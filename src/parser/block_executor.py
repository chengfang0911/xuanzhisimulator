"""积木块执行器

解释执行解析后的 Blockly 积木块树，驱动机器人状态更新。
"""

from typing import Any, Optional
import time

from .xml_parser import Block, parse_xuanzhi_file


class _StopExecution(Exception):
    """内部异常：用于"结束"块跳出循环（不传播到外层）"""
    pass


class ExecContext:
    """执行上下文：共享遥控通道、机器人状态、运行控制标志"""

    def __init__(self, robot_state, channels: dict, log_fn=None):
        self.robot = robot_state
        self.channels = channels          # {1: val, 2: val, ...}
        self.running = True               # 是否运行中
        self.speed_factor = 1.0           # 模拟速度倍率 (1.0=实时)
        self.log_fn = log_fn or (lambda *a, **k: None)
        self.sim_time = 0.0               # 模拟累计时间(秒)

    # ---- 时间相关 ----
    def sleep(self, seconds: float):
        """模拟延时：按 speed_factor 缩放后真正等待"""
        real = seconds / max(self.speed_factor, 0.01)
        # 这里用真实时间分片，便于配合 UI 刷新
        # 调用方负责在主循环中驱动；此处用阻塞 sleep（简化版）
        time.sleep(real)


class Executor:
    """遍历并执行积木块树"""

    def __init__(self, context: ExecContext):
        self.ctx = context

    # ===== 入口 =====
    def run(self, root: Block):
        """执行根块（通常是 event_m40d_begin）"""
        self._exec_block(root)

    def _exec_block(self, block: Optional[Block]):
        cur = block
        while cur is not None:
            self._step(cur)
            cur = cur.next_block

    def _step(self, block: Block):
        t = block.type

        # 检查附着在块上的 comment 标签（如 "结束"）
        if getattr(block, 'comment', None) == '结束':
            raise _StopExecution()

        if t == 'event_m40d_begin':
            self._exec_block(block.next_block)   # 入口：执行后续块
            return  # 注意：begin 不应 return 后再继续 next（已在上面处理）

        # ---- 控制流 ----
        if t == 'control_forever':
            while self.ctx.running:
                try:
                    self._exec_block(block.statements.get('SUBSTACK'))
                except _StopExecution:
                    break
            return
        if t in ('control_stop', '结束'):
            # "结束"块：跳出当前循环 (forever/repeat)，等效于 break
            raise _StopExecution()
        if t == 'control_if':
            cond = self._eval(block.values.get('CONDITION'))
            if self._truthy(cond):
                self._exec_block(block.statements.get('SUBSTACK'))
            return
        if t == 'control_if_else':
            cond = self._eval(block.values.get('CONDITION'))
            target = 'SUBSTACK' if self._truthy(cond) else 'SUBSTACK2'
            self._exec_block(block.statements.get(target))
            return
        if t == 'control_wait':
            dur = self._eval(block.values.get('DURATION'))
            try:
                self.ctx.sleep(float(dur))
                self.ctx.sim_time += float(dur)
            except (TypeError, ValueError):
                pass
            return

        # ---- 机器人动作 ----
        if t == 'robot_motor':
            motor = int(block.fields.get('MOTOR_MENU', 0))
            speed = self._eval(block.values.get('NUM'))
            try:
                speed = float(speed)
            except (TypeError, ValueError):
                speed = 0.0
            self.ctx.robot.set_motor(motor, speed)
            self.ctx.log_fn(f"[电机{motor}] = {speed:.0f}")
            return

        # 其它未知块（如空 next 后的占位）忽略
        return

    # ===== 表达式求值 =====
    def _eval(self, block: Optional[Block]) -> Any:
        if block is None:
            return 0
        t = block.type
        if t == 'literal':
            return block.fields.get('VALUE', 0)

        # 遥控通道
        if t == 'robot_remote_control':
            ch = int(self._eval(block.values.get('TELECONTROL_MENU')))
            return self.ctx.channels.get(ch, 0)
        if t == 'robot_telecontrol_menu':
            return block.fields.get('TELECONTROL_MENU', 0)

        # 数学常量 / 滑块
        if t == 'math_number' or t == 'math_positive_number':
            return block.fields.get('NUM', 0)
        if t == 'robot_motor_slider':
            return block.fields.get('NUM', 0)

        # 比较 / 逻辑
        if t == 'operator_equals':
            return self._num(self._eval(block.values.get('OPERAND1'))) == \
                   self._num(self._eval(block.values.get('OPERAND2')))
        if t == 'operator_gt':
            return self._num(self._eval(block.values.get('OPERAND1'))) > \
                   self._num(self._eval(block.values.get('OPERAND2')))
        if t == 'operator_lt':
            return self._num(self._eval(block.values.get('OPERAND1'))) < \
                   self._num(self._eval(block.values.get('OPERAND2')))
        if t == 'operator_and':
            return self._truthy(self._eval(block.values.get('OPERAND1'))) and \
                   self._truthy(self._eval(block.values.get('OPERAND2')))
        if t == 'operator_or':
            return self._truthy(self._eval(block.values.get('OPERAND1'))) or \
                   self._truthy(self._eval(block.values.get('OPERAND2')))

        # 算术
        if t == 'operator_add':
            return self._num(self._eval(block.values.get('NUM1'))) + \
                   self._num(self._eval(block.values.get('NUM2')))
        if t == 'operator_subtract':
            return self._num(self._eval(block.values.get('NUM1'))) - \
                   self._num(self._eval(block.values.get('NUM2')))
        if t == 'operator_multiply':
            return self._num(self._eval(block.values.get('NUM1'))) * \
                   self._num(self._eval(block.values.get('NUM2')))

        # 未知表达式块，返回 0
        return 0

    # ===== 工具 =====
    @staticmethod
    def _num(v) -> float:
        try:
            return float(v)
        except (TypeError, ValueError):
            return 0.0

    @staticmethod
    def _truthy(v) -> bool:
        if isinstance(v, bool):
            return v
        try:
            f = float(v)
            return f != 0
        except (TypeError, ValueError):
            return bool(v)


def load_and_parse(filepath: str) -> Block:
    return parse_xuanzhi_file(filepath)
