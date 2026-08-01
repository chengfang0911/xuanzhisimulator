"""机器人运动模型 (小台风2 / M40D)

=== 官方固件证据 (来自安装包 M40D_CRSF 反汇编) ===
  * 积木 robot_motor 生成: xChannal_Motor_nSpeed_Run(MOTOR_MENU, NUM)
  * 固件实现 (Controllable_object.c -> .lst):
        pwm = 1500 + nSpeed * 5;            // 单位 us, 标准 RC 电调信号
        // nSpeed=-100 -> 1000us(全反转), 0 -> 1500us(中位停), 100(全正转)->2000us
        ch==1 -> Motion_Motor1(pwm)
        ch==2 -> Motion_Motor2(pwm)
        ch==3 -> Motion_Motor3(pwm)
        ch==4 -> Motion_Motor4(pwm)
    => M1~M4 是 4 个**独立**电机通道(各接一个电调), 非左右差速两轮。
  * test.XUANZHI 实际只用 M2、M3 做移动 -> 视为左右驱动, 其余通道程序未参与。

=== 模拟器约定 (依程序行为反推) ===
  - 电机2 (M2): 左轮
  - 电机3 (M3): 右轮 (右轮"前进"在程序里用负值, 故取 right = -M3 统一极性)
  - forward  = (M2 + M3')/2      (M3' = -M3)
  - turn     = (M2 - M3')/2      (正 = 左转)
  - "结束" 是用户加在 M1=0 块上的 <comment> 标签, 由解析器捕获后跳出 forever 循环。
"""

import math


class RobotState:
    def __init__(self, x: float = 300.0, y: float = 300.0, heading: float = -math.pi/2, params: dict = None):
        self.x = x                      # 位置 x (像素)
        self.y = y                      # 位置 y (像素)
        self.heading = heading          # 朝向 (弧度, -pi/2 表示朝上)
        self.motors = {1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0}  # 各电机速度
        self.trail: list[tuple[float, float]] = []       # 移动轨迹
        self._trail_timer = 0.0
        self.distance_px = 0.0          # 累计走过的路径长度 (像素, 用于轨迹长度标注)
        # 渲染比例(屏幕相关, 由 set_view_scale 按模拟区宽度自动设定, 不暴露给用户)
        self.PX_PER_MM = 0.6
        # 物理参数 (由外部 params 注入, 支持运行时配置)
        self.set_params(params)

    def set_params(self, params: dict):
        """注入/更新物理与电机参数 (来自主界面配置, 含默认值)"""
        p = params or {}
        # ---- 底盘/电机参数 ----
        self.WHEEL_DIAMETER_MM = float(p.get('wheel_diameter_mm', 44.0))   # 轮子直径 (官方教程: 44mm 海绵轮)
        self.WHEELBASE_MM = float(p.get('wheelbase_mm', 75.0))             # 轴距
        self.K_V = float(p.get('k_v', 1.2))                               # 速度系数
        # ---- 电机参数 (来自固件反汇编: pwm = center + speed*per_unit) ----
        self.MOTOR_SPEED_MIN = float(p.get('motor_speed_min', -100.0))
        self.MOTOR_SPEED_MAX = float(p.get('motor_speed_max', 100.0))
        self.PWM_CENTER_US = float(p.get('pwm_center_us', 1500.0))         # PWM 中位 (us)
        self.PWM_PER_UNIT = float(p.get('pwm_per_unit', 5.0))             # 每速度单位 PWM (us)
        self._recalc()

    def _recalc(self):
        # K_OMEGA = K_V / L_pixel  (ω = (v_r - v_l)/L)
        L_pixel = max(1e-6, self.WHEELBASE_MM * self.PX_PER_MM)
        self.K_OMEGA = self.K_V / L_pixel

    def set_view_scale(self, sim_w: float):
        """根据模拟区宽度自动设定渲染比例 (屏幕相关, 无需用户配置)。
        px_per_mm = sim_w/1000 => 默认窗口(≈680px)约 0.68, 与原来 0.6 量级一致。"""
        self.PX_PER_MM = max(0.1, sim_w / 1000.0)
        self._recalc()

    def set_motor(self, motor_id: int, speed: float):
        if motor_id in self.motors:
            self.motors[motor_id] = max(self.MOTOR_SPEED_MIN, min(self.MOTOR_SPEED_MAX, speed))

    def stop_all(self):
        for k in self.motors:
            self.motors[k] = 0.0

    def update(self, dt: float):
        """按当前电机速度推进 dt 秒"""
        left = self.motors[2]
        right = -self.motors[3]   # 右轮负值为前进

        forward = (left + right) / 2.0
        turn = (left - right) / 2.0

        v = forward * self.K_V
        omega = turn * self.K_OMEGA

        nx = self.x + v * math.cos(self.heading) * dt
        ny = self.y + v * math.sin(self.heading) * dt
        self.distance_px += math.hypot(nx - self.x, ny - self.y)  # 累计路径长度
        self.x, self.y = nx, ny
        self.heading -= omega * dt   # 正 turn = 左转(逆时针), 故朝向递减

        # 记录轨迹 (限制频率)
        self._trail_timer += dt
        if self._trail_timer >= 0.05 and (abs(v) > 0.5 or abs(omega) > 0.001):
            self.trail.append((self.x, self.y))
            if len(self.trail) > 2000:
                self.trail.pop(0)
            self._trail_timer = 0.0

    def reset(self, x: float = 300.0, y: float = 300.0):
        self.x, self.y = x, y
        self.heading = -math.pi/2
        self.stop_all()
        self.trail.clear()
        self._trail_timer = 0.0
        self.distance_px = 0.0

    @property
    def distance_mm(self) -> float:
        """累计路径长度, 换算为毫米 (基于 PX_PER_MM 渲染比例)"""
        return self.distance_px / self.PX_PER_MM

    def is_moving(self) -> bool:
        return abs(self.motors[2]) > 0.5 or abs(self.motors[3]) > 0.5
