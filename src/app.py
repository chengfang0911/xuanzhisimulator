"""玄智机器人 2D 模拟器主程序 (Pygame)

功能:
  - 解析 .XUANZHI (Blockly XML) 程序文件
  - 在 2D 画布上模拟 IE1 机器人运动 (差速驱动)
  - 提供遥控通道滑块 / 按钮实时输入
  - 运行 / 停止 / 重置控制
"""

import os
import sys
import json
import threading
import time
import math

import pygame

# 确保项目根在 sys.path 以便导入 src 包
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from src.parser.xml_parser import parse_xuanzhi_file, block_to_text
from src.parser.block_executor import Executor, ExecContext
from src.simulator.robot_state import RobotState

# ---------- 布局常量 ----------
# 默认窗口尺寸
DEFAULT_W, DEFAULT_H = 1000, 640
MIN_W, MIN_H = 700, 480

COL_BG = (30, 32, 40)
COL_SIM = (20, 22, 28)
COL_GRID = (45, 48, 58)
COL_ROBOT = (80, 200, 255)
COL_TRAIL = (255, 180, 60)
COL_TEXT = (220, 225, 235)
COL_ACCENT = (90, 220, 140)
COL_SLIDER_BG = (55, 58, 70)
COL_SLIDER_FG = (90, 170, 240)
COL_BTN_ON = (90, 220, 140)
COL_BTN_OFF = (120, 70, 70)

# ---------- 仿真/程序参数默认值 ----------
CONFIG_PATH = os.path.join(_PROJECT_ROOT, "config.json")

# 键: (标签, 单位, 是否整数)
PARAM_FIELDS = [
    ("wheel_diameter_mm", "轮子直径", "mm", False),
    ("wheelbase_mm",      "轴距",     "mm", False),
    ("trigger_threshold", "触发阈值", "(CH1>)", True),
]

DEFAULT_PARAMS = {
    "wheel_diameter_mm": 45.0,
    "wheelbase_mm": 75.0,
    "k_v": 1.2,
    "motor_speed_min": -100,
    "motor_speed_max": 100,
    "pwm_center_us": 1500,
    "pwm_per_unit": 5.0,
    "trigger_threshold": 15,
}


def load_params() -> dict:
    """加载参数配置 (与默认值合并, 缺项补默认)"""
    p = dict(DEFAULT_PARAMS)
    try:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                p.update({k: v for k, v in json.load(f).items() if k in DEFAULT_PARAMS})
    except Exception:
        pass
    return p


def save_params(p: dict):
    """保存参数配置到 config.json"""
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump({k: p.get(k, DEFAULT_PARAMS[k]) for k in DEFAULT_PARAMS},
                      f, ensure_ascii=False, indent=2)
    except Exception:
        pass


class Slider:
    """通用滑块控件 (摇杆为连续值, 按钮为离散开关)"""
    def __init__(self, label, ch, x, y, w=260, h=22,
                 min_val=-100, max_val=100, discrete=False):
        self.label = label
        self.ch = ch
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.min_val = min_val
        self.max_val = max_val
        self.discrete = discrete
        self.value = min_val if discrete else 0
        self.dragging = False

    def contains(self, mx, my):
        return self.x <= mx <= self.x + self.w and self.y - 6 <= my <= self.y + self.h + 6

    def set_from_mouse(self, mx):
        t = (mx - self.x) / self.w
        t = max(0.0, min(1.0, t))
        val = self.min_val + t * (self.max_val - self.min_val)
        if self.discrete:
            val = self.min_val if val < (self.min_val + self.max_val) / 2 else self.max_val
        self.value = val

    def toggle(self):
        if self.discrete:
            self.value = self.max_val if self.value <= self.min_val else self.min_val

    def draw(self, surf, font):
        # 标签
        txt = font.render(f"{self.label}", True, COL_TEXT)
        surf.blit(txt, (self.x, self.y - 18))
        # 轨道
        pygame.draw.rect(surf, COL_SLIDER_BG, (self.x, self.y, self.w, self.h), border_radius=4)
        # 中值线
        mid_x = self.x + self.w / 2
        pygame.draw.line(surf, (90, 95, 110), (mid_x, self.y - 2), (mid_x, self.y + self.h + 2))
        # 把手位置
        t = (self.value - self.min_val) / (self.max_val - self.min_val)
        hx = self.x + t * self.w
        color = COL_BTN_ON if (self.discrete and self.value > self.min_val) else COL_SLIDER_FG
        if self.discrete:
            # 按钮样式 - 直接显示数值避免混淆
            pygame.draw.rect(surf, color, (self.x, self.y, self.w, self.h), border_radius=4)
            label = f"{int(self.value):+d}"   # 显示 +100 或 -100
            t2 = font.render(label, True, (10, 10, 10))
            surf.blit(t2, (mid_x - 16, self.y + 3))
        else:
            pygame.draw.circle(surf, color, (int(hx), self.y + self.h // 2), self.h // 2 + 3)
            val_txt = font.render(f"{self.value:.0f}", True, COL_TEXT)
            surf.blit(val_txt, (self.x + self.w + 8, self.y))


class EditableField:
    """面板上的可编辑数值输入框 (数字 + 负号 + 小数点)"""
    def __init__(self, key, label, unit, x, y, w, default, is_int=False):
        self.key = key
        self.label = label
        self.unit = unit
        self.x = x
        self.y = y
        self.w = w                 # 输入框宽度
        self.is_int = is_int
        self.value = default
        self.text = str(int(default) if is_int else float(default))
        self.focused = False

    def contains(self, mx, my):
        # 命中区域: 标签 + 输入框 (label 宽 76)
        return self.x <= mx <= self.x + 76 + self.w and self.y - 2 <= my <= self.y + 22

    def set_text(self, t):
        try:
            v = int(t) if self.is_int else float(t)
        except ValueError:
            self.text = self._fmt(self.value)
            return
        self.text = t
        self.value = v

    def _fmt(self, v):
        return str(int(v)) if self.is_int else str(float(v))

    def draw(self, surf, font):
        # 标签
        surf.blit(font.render(self.label, True, COL_TEXT), (self.x, self.y + 3))
        bx = self.x + 76
        rect = pygame.Rect(bx, self.y, self.w, 22)
        bg = (40, 60, 90) if self.focused else COL_SLIDER_BG
        pygame.draw.rect(surf, bg, rect, border_radius=3)
        pygame.draw.rect(surf, (90, 95, 110), rect, 1, border_radius=3)
        disp = self.text
        if self.focused and int(time.time() * 2) % 2 == 0:
            disp += "|"
        surf.blit(font.render(disp if disp != "" else "0", True, COL_TEXT), (bx + 5, self.y + 3))
        if self.unit:
            surf.blit(font.render(self.unit, True, (150, 160, 180)), (bx + self.w + 5, self.y + 4))


class App:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.root_block = parse_xuanzhi_file(filepath)

        # 动态布局尺寸 (随窗口缩放更新)
        self.win_w = DEFAULT_W
        self.win_h = DEFAULT_H

        # 仿真/程序参数 (从 config.json 加载, 含默认)
        self.params = load_params()

        self.robot = RobotState(x=self._sim_w() / 2, y=self._sim_h() / 2, params=self.params)
        self.robot.set_view_scale(self._sim_w())   # 渲染比例按屏幕自动设定(无需用户配置)
        self.channels = {1: 0, 2: 0, 3: 0, 4: 0, 6: -100, 7: -100}
        self.running = False
        self.paused = False
        self.speed_factor = 1.0
        self.log_lines = []
        # ---------- 轨迹长度标注 (每隔 0.5s 在地图上打一个点) ----------
        self.length_marks = []        # [(world_x, world_y, length_mm), ...]
        self._length_timer = 0.0
        # ---------- 可编辑参数输入框 ----------
        self.fields = []              # [EditableField, ...]
        self._focused_field = None
        # ---------- 相机 (地图缩放/平移) ----------
        self.cam_x = self._sim_w() / 2   # 视野中心对应的世界坐标
        self.cam_y = self._sim_h() / 2
        self.zoom = 1.0
        self.panning = False
        self._pan_last = (0, 0)
        self._mouse = (self._sim_w() // 2, self._sim_h() // 2)
        self._lock = threading.Lock()

        self.ctx = ExecContext(self.robot, self.channels, log_fn=self.log)
        self.executor = Executor(self.ctx)
        self.thread = None

        # 文件选择对话框状态 (纯 pygame 实现, 避免 tkinter 与 pygame 冲突)
        self.file_dialog_open = False
        self.file_list = []          # [(名称, 完整路径), ...]
        self.file_list_rects = []
        self._file_dialog_rect = pygame.Rect(0, 0, 0, 0)

        self._init_pygame()
        self._init_controls()
        self._relayout()

    # ---------- 动态布局 ----------
    def _sim_w(self):
        return int(self.win_w * 0.68)

    def _panel_x(self):
        return self._sim_w() + 8

    def _panel_w(self):
        return self.win_w - self._panel_x()

    def _sim_h(self):
        return self.win_h

    def _relayout(self):
        """窗口大小改变后重新计算所有控件位置"""
        px = self._panel_x()
        pw = self._panel_w()
        y = 70
        for i, s in enumerate(self.sliders):
            s.x = px
            s.y = y
            s.w = pw - 40
            y += 50
        self.open_btn = pygame.Rect(px + pw - 130, 16, 110, 26)
        self.btns['run'] = pygame.Rect(px, y + 10, (pw - 20) // 2 - 6, 34)
        self.btns['reset'] = pygame.Rect(px + (pw) // 2 + 4, y + 10, (pw - 20) // 2 - 6, 34)
        y += 60
        bw = max(50, (pw - 24) // 4)
        self.speed_btns[0.5] = pygame.Rect(px, y + 10, bw, 30)
        self.speed_btns[1.0] = pygame.Rect(px + bw + 8, y + 10, bw, 30)
        self.speed_btns[2.0] = pygame.Rect(px + (bw+8)*2, y + 10, bw, 30)
        self.speed_btns[4.0] = pygame.Rect(px + (bw+8)*3, y + 10, bw, 30)
        y += 60
        # 参数输入框 (两列布局)
        if self.fields:
            fy = y
            col_w = (pw - 40) // 2
            for i, f in enumerate(self.fields):
                col = i % 2
                row = i // 2
                f.x = px + col * (col_w + 20)
                f.y = fy + row * 26
                f.w = col_w - 96
            rows = (len(self.fields) + 1) // 2
            y = fy + rows * 26
        self.log_y = y + 12
        # 机器人位置按比例缩放（保持相对位置）
        if len(self.robot.trail) == 0:
            self.robot.x = self._sim_w() / 2
            self.robot.y = self._sim_h() / 2

    # ---------- 相机变换 ----------
    def world_to_screen(self, wx, wy):
        """世界坐标 -> 屏幕坐标 (模拟区局部坐标)"""
        sw = self._sim_w()
        sh = self._sim_h()
        return ((wx - self.cam_x) * self.zoom + sw / 2,
                (wy - self.cam_y) * self.zoom + sh / 2)

    def screen_to_world(self, sx, sy):
        """屏幕坐标 (模拟区局部坐标) -> 世界坐标"""
        sw = self._sim_w()
        sh = self._sim_h()
        return ((sx - sw / 2) / self.zoom + self.cam_x,
                (sy - sh / 2) / self.zoom + self.cam_y)

    def _in_sim_area(self, pos):
        mx, my = pos
        return 0 <= mx < self._sim_w() and 0 <= my < self._sim_h()

    def _zoom_at(self, pos, delta):
        """以屏幕坐标 pos 为锚点缩放 (delta>0 放大)"""
        if delta == 0:
            return
        new_zoom = max(0.2, min(5.0, self.zoom * (1.1 if delta > 0 else 1 / 1.1)))
        # 锚点对应的世界坐标, 缩放后保持其在原屏幕位置
        wx, wy = self.screen_to_world(pos[0], pos[1])
        self.zoom = new_zoom
        sw, sh = self._sim_w(), self._sim_h()
        self.cam_x = wx - (pos[0] - sw / 2) / self.zoom
        self.cam_y = wy - (pos[1] - sh / 2) / self.zoom

    # ---------- 初始化 ----------
    def _init_pygame(self):
        pygame.init()
        self.screen = pygame.display.set_mode((self.win_w, self.win_h), pygame.RESIZABLE)
        pygame.display.set_caption("玄智 XUANZHI 机器人模拟器 - " + os.path.basename(self.filepath))
        self.font = pygame.font.SysFont("microsoft yahei", 16)
        self.font_small = pygame.font.SysFont("microsoft yahei", 13)
        self.clock = pygame.time.Clock()

    def _init_controls(self):
        px = self._panel_x()
        pw = self._panel_w()
        y = 70
        self.sliders = []
        # 摇杆 (连续)
        self.sliders.append(Slider("CH1 左摇杆", 1, px, y, w=pw-40)); y += 50
        self.sliders.append(Slider("CH2 右摇杆", 2, px, y, w=pw-40)); y += 50
        self.sliders.append(Slider("CH3 上摇杆", 3, px, y, w=pw-40)); y += 50
        self.sliders.append(Slider("CH4 下摇杆", 4, px, y, w=pw-40)); y += 50
        # 按钮开关 (离散)
        self.sliders.append(Slider("CH6 按钮1", 6, px, y, w=pw-40, discrete=True)); y += 50
        self.sliders.append(Slider("CH7 按钮2", 7, px, y, w=pw-40, discrete=True)); y += 50

        # 按钮区
        self.btns = {
            'run':  pygame.Rect(px, y + 10, (pw-20)//2 - 6, 34),
            'reset': pygame.Rect(px + (pw)//2 + 4, y + 10, (pw-20)//2 - 6, 34),
        }
        y += 60
        bw = max(50, (pw - 24) // 4)
        # 速度按钮
        self.speed_btns = {
            0.5: pygame.Rect(px, y + 10, bw, 30),
            1.0: pygame.Rect(px + bw + 8, y + 10, bw, 30),
            2.0: pygame.Rect(px + (bw+8)*2, y + 10, bw, 30),
            4.0: pygame.Rect(px + (bw+8)*3, y + 10, bw, 30),
        }
        self.log_y = y + 55
        # 打开文件按钮
        self.open_btn = pygame.Rect(px + pw - 130, 16, 110, 26)
        # 可编辑参数输入框
        self._rebuild_fields()

    # ---------- 日志 ----------
    def log(self, msg):
        with self._lock:
            self.log_lines.append(msg)
            if len(self.log_lines) > 200:
                self.log_lines.pop(0)

    # ---------- 运行控制 ----------
    def start(self):
        if self.running:
            return
        self.running = True
        self.paused = False
        self.ctx.running = True
        self._apply_params(save=True)     # 运行前收集界面参数并写入 config.json
        self.thread = threading.Thread(target=self._run_executor, daemon=True)
        self.thread.start()
        self.log(">> 程序开始运行")
        outer, inner = self._find_ifs()
        if self._cond_met(outer) and self._cond_met(inner):
            self.log("条件满足, 机器人开始运动")
        else:
            self.log("注意: 触发条件未满足, 机器人不会动")

    def stop(self):
        self.running = False
        self.ctx.running = False
        self.robot.stop_all()
        self.log("|| 已停止")

    def reset(self):
        self.stop()
        time.sleep(0.05)
        self.robot.reset(x=self._sim_w() / 2, y=self._sim_h() / 2)
        self.channels.update({1: 0, 2: 0, 3: 0, 4: 0, 6: -100, 7: -100})
        for s in self.sliders:
            s.value = s.min_val if s.discrete else 0
        self.length_marks.clear()
        self._length_timer = 0.0
        self.log("<< 已重置")

    def _run_executor(self):
        try:
            self.executor.run(self.root_block)
        except Exception as e:
            self.log(f"ERROR 执行错误: {e}")
        finally:
            self.running = False
            self.robot.stop_all()

    # ---------- 触发条件辅助 ----------
    def _find_ifs(self):
        """定位演示程序的嵌套 if 条件 (外: CH6/CH7, 内: CH1), 用于状态提示。
        返回 (outer_cond, inner_cond) 积木或 None。"""
        outer = None
        inner = None
        cur = self.root_block
        if cur is not None and cur.type == 'event_m40d_begin':
            cur = cur.next_block
        if cur is not None and cur.type == 'control_forever':
            st = cur.statements.get('SUBSTACK')
            if st is not None and st.type == 'control_if':
                outer = st.values.get('CONDITION')
                inner_st = st.statements.get('SUBSTACK')
                if inner_st is not None and inner_st.type == 'control_if':
                    inner = inner_st.values.get('CONDITION')
        return outer, inner

    def _cond_met(self, cond_block):
        if cond_block is None:
            return None
        return self.executor._truthy(self.executor._eval(cond_block))

    def _draw_status_overlay(self):
        try:
            outer, inner = self._find_ifs()
        except Exception:
            return
        if outer is None and inner is None:
            return
        try:
            o = self._cond_met(outer)
            i = self._cond_met(inner)
        except Exception:
            return

        parts = []
        if o is not None:
            parts.append(f"CH6={int(self.channels.get(6,0)):+d} CH7={int(self.channels.get(7,0)):+d} {'OK' if o else 'FAIL'}")
        if i is not None:
            thr = int(self.params.get('trigger_threshold', 15))
            parts.append(f"CH1={int(self.channels.get(1,0)):+d}>{thr} {'OK' if i else 'FAIL'}")

        if o and i:
            state = ">>> 条件满足, 机器人将运动"
            col = COL_ACCENT
        else:
            state = "!!! 未触发: 机器人静止 (把 CH1 左摇杆拖到 >15)"
            col = (235, 180, 70)

        bar_h = 46
        sw = self._sim_w()
        sh = self._sim_h()
        bar = pygame.Rect(0, sh - bar_h, sw, bar_h)
        pygame.draw.rect(self.screen, (15, 17, 22), bar)
        pygame.draw.line(self.screen, (70, 75, 90), (0, sh - bar_h), (sw, sh - bar_h))
        self.screen.blit(self.font.render(state, True, col), (12, sh - bar_h + 6))
        detail = "    ".join(parts)
        self.screen.blit(self.font_small.render(detail, True, COL_TEXT), (12, sh - bar_h + 26))

    # ---------- 参数输入框 ----------
    def _rebuild_fields(self):
        """按 PARAM_FIELDS / 当前 params 构建可编辑字段 (仅首次创建, 之后同步值)"""
        if not self.fields:
            self.fields = [
                EditableField(key, label, unit, 0, 0, 60, self.params[key], is_int)
                for (key, label, unit, is_int) in PARAM_FIELDS
            ]
        else:
            for f in self.fields:
                f.value = self.params[f.key]
                f.text = f._fmt(f.value)

    def _collect_params(self) -> dict:
        p = dict(self.params)
        for f in self.fields:
            p[f.key] = f.value
        return p

    def _apply_params(self, save: bool = False):
        """收集字段值应用到 robot, 可选写入 config.json"""
        self.params = self._collect_params()
        self.robot.set_params(self.params)
        if save:
            save_params(self.params)

    def _handle_field_input(self, ev):
        f = self._focused_field
        if f is None:
            return
        if ev.key == pygame.K_BACKSPACE:
            f.text = f.text[:-1]
            f.set_text(f.text if f.text != "" else "0")
        elif ev.key in (pygame.K_RETURN, pygame.K_KP_ENTER, pygame.K_ESCAPE):
            f.focused = False
            self._focused_field = None
        else:
            ch = ev.unicode
            if not ch:
                return
            if ch == '-':
                if f.text != "":          # 负号只允许在首位
                    return
            elif ch == '.':
                if f.is_int or '.' in f.text:
                    return
            elif not ch.isdigit():
                return
            f.text += ch
            f.set_text(f.text)
        self._apply_params(save=False)    # 实时应用到仿真, 不落盘

    # ---------- 文件导入 (纯 pygame 对话框) ----------
    def _open_file_dialog(self):
        self.file_list = []
        search_dirs = []
        samples_dir = os.path.join(_PROJECT_ROOT, "samples")
        if os.path.isdir(samples_dir):
            search_dirs.append(samples_dir)
        search_dirs.append(os.getcwd())
        for d in search_dirs:
            try:
                for fn in os.listdir(d):
                    if fn.lower().endswith('.xuanzhi'):
                        self.file_list.append((fn, os.path.join(d, fn)))
            except Exception:
                pass
        # 去重
        seen = set()
        uniq = []
        for name, p in self.file_list:
            if p not in seen:
                seen.add(p)
                uniq.append((name, p))
        self.file_list = uniq
        self.file_dialog_open = True

    def _draw_file_dialog(self):
        # 半透明遮罩
        overlay = pygame.Surface((self.win_w, self.win_h))
        overlay.set_alpha(180)
        overlay.fill((0, 0, 0))
        self.screen.blit(overlay, (0, 0))
        # 面板
        pw, ph = min(780, int(self.win_w * 0.85)), min(460, int(self.win_h * 0.8))
        px, py = (self.win_w - pw) // 2, (self.win_h - ph) // 2
        self._file_dialog_rect = pygame.Rect(px, py, pw, ph)
        pygame.draw.rect(self.screen, (40, 44, 54), self._file_dialog_rect, border_radius=10)
        pygame.draw.rect(self.screen, (90, 95, 110), self._file_dialog_rect, 2, border_radius=10)
        title = self.font.render("选择 XUANZHI 程序文件 (点击选择, ESC/点外部关闭)", True, COL_TEXT)
        self.screen.blit(title, (px + 20, py + 14))
        self.file_list_rects = []
        ly = py + 56
        if not self.file_list:
            t = self.font_small.render("未找到 .XUANZHI 文件。可用命令行导入: python main.py 路径", True, (235, 180, 70))
            self.screen.blit(t, (px + 20, ly))
            return
        for i, (name, p) in enumerate(self.file_list):
            rect = pygame.Rect(px + 20, ly, pw - 40, 30)
            pygame.draw.rect(self.screen, (55, 60, 72), rect, border_radius=6)
            t = self.font_small.render(name, True, COL_TEXT)
            self.screen.blit(t, (px + 30, ly + 7))
            self.file_list_rects.append(rect)
            ly += 36

    def load_file(self, filepath: str):
        if not os.path.exists(filepath):
            self.log(f"ERROR 文件不存在: {os.path.basename(filepath)}")
            return
        self.stop()
        time.sleep(0.05)
        try:
            self.root_block = parse_xuanzhi_file(filepath)
        except Exception as e:
            self.log(f"ERROR 解析失败: {e}")
            return
        self.filepath = filepath
        pygame.display.set_caption("玄智 XUANZHI 模拟器 - " + os.path.basename(filepath))
        self.reset()
        self.log("已加载: " + os.path.basename(filepath))

    # ---------- 主循环 ----------
    def run(self):
        self.log("程序已加载: " + os.path.basename(self.filepath))
        self.log("提示: 拖动滑块/点击按钮设置遥控, 然后点 [运行]")
        while True:
            try:
                dt = self.clock.tick(60) / 1000.0
                self._handle_events()
            except Exception as e:
                self.log(f"ERROR 事件处理异常: {e}")
                dt = 1/60
            # 同步滑块 -> 通道
            for s in self.sliders:
                self.channels[s.ch] = s.value
            # 更新机器人
            if self.running:
                try:
                    self.robot.update(dt * self.speed_factor)
                    # 每隔 0.5s 在地图上标记当前累计轨迹长度
                    self._length_timer += dt
                    if self._length_timer >= 0.5:
                        self._length_timer -= 0.5
                        self.length_marks.append(
                            (self.robot.x, self.robot.y, self.robot.distance_mm))
                except Exception as e:
                    self.log(f"ERROR 物理更新异常: {e}")
            try:
                self._draw()
            except Exception as e:
                self.log(f"ERROR 绘制异常: {e}")
            try:
                pygame.display.flip()
            except Exception as e:
                self.log(f"ERROR 刷新显示异常: {e}")

    # ---------- 事件 ----------
    def _handle_events(self):
        for ev in pygame.event.get():
            if ev.type == pygame.QUIT:
                self.stop()
                pygame.quit()
                sys.exit()
            elif ev.type == pygame.VIDEORESIZE:
                self.win_w = max(MIN_W, ev.w)
                self.win_h = max(MIN_H, ev.h)
                self.screen = pygame.display.set_mode((self.win_w, self.win_h), pygame.RESIZABLE)
                self._relayout()
            elif ev.type == pygame.MOUSEBUTTONDOWN:
                # 在模拟区按左键 -> 拖动平移地图; 否则按原有点击逻辑
                if ev.button == 1 and self._in_sim_area(ev.pos):
                    self.panning = True
                    self._pan_last = ev.pos
                else:
                    self._on_click(ev.pos)
            elif ev.type == pygame.MOUSEMOTION:
                self._mouse = ev.pos
                if self.panning:
                    dx = ev.pos[0] - self._pan_last[0]
                    dy = ev.pos[1] - self._pan_last[1]
                    self.cam_x -= dx / self.zoom
                    self.cam_y -= dy / self.zoom
                    self._pan_last = ev.pos
                elif any(s.dragging for s in self.sliders):
                    for s in self.sliders:
                        if s.dragging:
                            s.set_from_mouse(ev.pos[0])
            elif ev.type == pygame.MOUSEBUTTONUP:
                self.panning = False
                for s in self.sliders:
                    s.dragging = False
            elif ev.type == pygame.MOUSEWHEEL:
                # 以鼠标位置为中心缩放
                self._zoom_at(self._mouse, ev.y)
            elif ev.type == pygame.KEYDOWN:
                if ev.key == pygame.K_ESCAPE and self.file_dialog_open:
                    self.file_dialog_open = False
                elif self._focused_field is not None:
                    self._handle_field_input(ev)
                else:
                    self._on_key(ev.key)

    def _on_click(self, pos):
        mx, my = pos
        # 文件选择对话框模式
        if self.file_dialog_open:
            for i, (name, p) in enumerate(self.file_list):
                if i < len(self.file_list_rects) and self.file_list_rects[i].collidepoint(pos):
                    self.file_dialog_open = False
                    self.load_file(p)
                    return
            if not self._file_dialog_rect.collidepoint(pos):
                self.file_dialog_open = False
            return
        # 参数输入框焦点
        for f in self.fields:
            if f.contains(mx, my):
                for o in self.fields:
                    o.focused = False
                f.focused = True
                self._focused_field = f
                return
        # 点击其他区域 -> 取消输入焦点
        if self._focused_field is not None:
            self._focused_field.focused = False
            self._focused_field = None
        # 滑块
        for s in self.sliders:
            if s.contains(mx, my):
                if s.discrete:
                    s.toggle()
                else:
                    s.dragging = True
                    s.set_from_mouse(mx)
                return
        # 运行 / 重置
        if self.btns['run'].collidepoint(pos):
            if self.running:
                self.stop()
            else:
                self.start()
        elif self.btns['reset'].collidepoint(pos):
            self.reset()
        elif self.open_btn.collidepoint(pos):
            self._open_file_dialog()
        # 速度
        for sf, rect in self.speed_btns.items():
            if rect.collidepoint(pos):
                self.speed_factor = sf
                self.log(f"速度倍率: {sf}x")

    def _on_key(self, key):
        if key == pygame.K_SPACE:
            if self.running:
                self.stop()
            else:
                self.start()
        elif key == pygame.K_r:
            self.reset()
        elif key == pygame.K_6:
            self.sliders[4].toggle()
        elif key == pygame.K_7:
            self.sliders[5].toggle()
        elif key == pygame.K_c:
            self.cam_x = self._sim_w() / 2
            self.cam_y = self._sim_h() / 2
            self.zoom = 1.0
            self.log("视图已居中")

    # ---------- 绘制 ----------
    def _draw(self):
        self.screen.fill(COL_BG)
        self._draw_sim()
        self._draw_panel()
        if self.file_dialog_open:
            self._draw_file_dialog()

    def _draw_sim(self):
        sw = self._sim_w()
        sh = self._sim_h()
        # 模拟区背景
        sim_rect = pygame.Rect(0, 0, sw, sh)
        pygame.draw.rect(self.screen, COL_SIM, sim_rect)

        # 可视区域对应的世界坐标范围 (随缩放/平移变化)
        x0, y0 = self.screen_to_world(0, 0)
        x1, y1 = self.screen_to_world(sw, sh)
        step = 40
        gx0 = int(math.floor(min(x0, x1) / step) * step)
        gx1 = int(math.ceil(max(x0, x1) / step) * step)
        gy0 = int(math.floor(min(y0, y1) / step) * step)
        gy1 = int(math.ceil(max(y0, y1) / step) * step)
        # 网格 (世界坐标 -> 屏幕坐标)
        for gx in range(gx0, gx1 + 1, step):
            ax, ay = self.world_to_screen(gx, y0)
            bx, by = self.world_to_screen(gx, y1)
            pygame.draw.line(self.screen, COL_GRID, (ax, ay), (bx, by))
        for gy in range(gy0, gy1 + 1, step):
            ax, ay = self.world_to_screen(x0, gy)
            bx, by = self.world_to_screen(x1, gy)
            pygame.draw.line(self.screen, COL_GRID, (ax, ay), (bx, by))

        # 边界
        pygame.draw.rect(self.screen, (70, 75, 90), sim_rect, 2)
        # 轨迹
        if len(self.robot.trail) > 1:
            pts = [self.world_to_screen(p[0], p[1]) for p in self.robot.trail]
            pygame.draw.lines(self.screen, COL_TRAIL, False,
                              [(int(a), int(b)) for a, b in pts], 2)
        # 轨迹长度标注 (每 0.5s 一个标记点)
        for (wx, wy, length) in self.length_marks:
            sx, sy = self.world_to_screen(wx, wy)
            ix, iy = int(sx), int(sy)
            pygame.draw.circle(self.screen, (255, 255, 255), (ix, iy), 3)
            label = f"{length:.0f}mm"
            tw = self.font_small.size(label)[0]
            pygame.draw.rect(self.screen, (15, 17, 22),
                             (ix + 6, iy - 18, tw + 6, 17))
            self.screen.blit(self.font_small.render(label, True, (255, 230, 120)),
                             (ix + 9, iy - 16))
        # 机器人
        self._draw_robot()
        # 缩放提示
        zt = self.font_small.render(f"缩放 {self.zoom:.2f}x  (滚轮缩放 / 模拟区拖动平移 / 按C居中)",
                                    True, (150, 160, 180))
        self.screen.blit(zt, (8, 8))
        # 触发条件状态条
        self._draw_status_overlay()

    def _draw_robot(self):
        x, y = self.world_to_screen(self.robot.x, self.robot.y)
        h = self.robot.heading
        # 车身 (三角朝向 heading) — 尺寸随缩放变化
        size = 16 * self.zoom
        nose = (x + size * 1.4 * math.cos(h),
                y + size * 1.4 * math.sin(h))
        left = (x + size * math.cos(h + 2.5),
                y + size * math.sin(h + 2.5))
        right = (x + size * math.cos(h - 2.5),
                 y + size * math.sin(h - 2.5))
        pygame.draw.polygon(self.screen, COL_ROBOT, [nose, left, right])
        pygame.draw.circle(self.screen, (255, 255, 255), (int(x), int(y)), max(2, int(3 * self.zoom)))

    def _draw_panel(self):
        px = self._panel_x()
        # 标题
        title = self.font.render("遥控控制台", True, COL_TEXT)
        self.screen.blit(title, (px, 20))
        # 打开文件按钮
        pygame.draw.rect(self.screen, (120, 130, 150), self.open_btn, border_radius=6)
        ot = self.font_small.render("打开文件", True, (10, 10, 10))
        self.screen.blit(ot, (self.open_btn.x + 22, self.open_btn.y + 5))
        # 滑块
        for s in self.sliders:
            s.draw(self.screen, self.font_small)
        # 运行按钮
        run_color = COL_BTN_ON if not self.running else (200, 120, 60)
        pygame.draw.rect(self.screen, run_color, self.btns['run'], border_radius=6)
        rt = self.font.render("运行" if not self.running else "停止", True, (10, 10, 10))
        self.screen.blit(rt, (self.btns['run'].x + 38, self.btns['run'].y + 7))
        pygame.draw.rect(self.screen, (120, 130, 150), self.btns['reset'], border_radius=6)
        rst = self.font.render("重置", True, (10, 10, 10))
        self.screen.blit(rst, (self.btns['reset'].x + 38, self.btns['reset'].y + 7))
        # 速度
        st = self.font_small.render("速度:", True, COL_TEXT)
        self.screen.blit(st, (px, self.speed_btns[0.5].y - 18))
        for sf, rect in self.speed_btns.items():
            col = COL_ACCENT if abs(self.speed_factor - sf) < 0.01 else COL_SLIDER_BG
            pygame.draw.rect(self.screen, col, rect, border_radius=5)
            t = self.font_small.render(f"{sf}x", True, (10, 10, 10))
            self.screen.blit(t, (rect.x + 22, rect.y + 7))
        # 仿真参数 (可编辑, 运行后写入 config.json)
        if self.fields:
            ptitle = self.font_small.render("仿真参数 (运行后写入 config.json)",
                                            True, (150, 200, 255))
            self.screen.blit(ptitle, (px, self.fields[0].y - 22))
            for f in self.fields:
                f.draw(self.screen, self.font_small)
        # 日志
        ly = self.log_y
        head = self.font_small.render("— 运行日志 —", True, COL_ACCENT)
        self.screen.blit(head, (px, ly))
        ly += 20
        log_max = max(3, (self.win_h - ly - 12) // 16)
        with self._lock:
            for line in self.log_lines[-log_max:]:
                t = self.font_small.render(line, True, COL_TEXT)
                self.screen.blit(t, (px, ly))
                ly += 16


def main():
    default = os.path.join(_PROJECT_ROOT, "samples", "不撞墙自动程序2.XUANZHI")
    filepath = sys.argv[1] if len(sys.argv) > 1 else default
    if not os.path.exists(filepath):
        print(f"找不到文件: {filepath}")
        sys.exit(1)
    try:
        app = App(filepath)
        app.run()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"FATAL: {type(e).__name__}: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
    finally:
        pygame.quit()


if __name__ == "__main__":
    main()
