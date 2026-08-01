"""XUANZHI (.XUANZHI) 文件解析器

将 Google Blockly XML 格式的程序文件解析为可执行的积木块树。
"""

import xml.etree.ElementTree as ET
import re
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any


@dataclass
class Block:
    """表示一个 Blockly 积木块"""
    type: str
    fields: Dict[str, Any] = field(default_factory=dict)   # <field name="...">值
    values: Dict[str, 'Block'] = field(default_factory=dict)  # <value name="...">子块
    statements: Dict[str, 'Block'] = field(default_factory=dict)  # <statement name="...">子块
    next_block: Optional['Block'] = None  # <next>后面的兄弟块
    comment: Optional[str] = None          # <comment>标签文本 (如 "结束"/"直行"/"左转")


# Blockly 中 shadow 元素的 field 名称映射
_SHADOW_FIELD_MAP = {
    'text': 'TEXT',
    'math_number': 'NUM',
    'math_positive_number': 'NUM',
    'math_integer': 'NUM',
    'robot_motor_slider': 'NUM',
    'robot_telecontrol_menu': 'TELECONTROL_MENU',
    'robot_motor_menu': 'MOTOR_MENU',
}


def parse_xuanzhi_file(filepath: str) -> Block:
    """解析 .XUANZHI 文件，返回根积木块"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # 移除默认命名空间声明 (xmlns="..."), 避免 ElementTree 强制前缀匹配
    content = re.sub(r'\sxmlns="[^"]*"', '', content, count=1)
    root = ET.fromstring(content)
    # root 是 <xml>，找第一个 <block>
    first_block = root.find('block')
    if first_block is None:
        first_block = next(iter(root), None)
    if first_block is None or first_block.tag != 'block':
        raise ValueError("文件中未找到任何积木块")
    return _parse_block(first_block)


def _parse_block(elem: ET.Element) -> Block:
    """递归解析一个 <block> 元素"""
    block = Block(type=elem.get('type', ''))

    # 解析 field (键值对)
    for f in elem.findall('field'):
        name = f.get('name')
        text = f.text if f.text is not None else ''
        # 尝试转为数字
        block.fields[name] = _try_number(text)

    # 解析 value (输入值，通常是表达式块或 shadow 默认值)
    for v in elem.findall('value'):
        name = v.get('name')
        child_block = v.find('block')
        if child_block is not None:
            block.values[name] = _parse_block(child_block)
        else:
            shadow = v.find('shadow')
            if shadow is not None:
                lit = _shadow_to_literal(shadow)
                if lit is not None:
                    block.values[name] = lit

    # 解析 statement (语句容器，通常是嵌套块)
    for s in elem.findall('statement'):
        name = s.get('name')
        child_block = s.find('block')
        if child_block is not None:
            block.statements[name] = _parse_block(child_block)

    # 解析 comment (附着在积木块上的标签/注释，如 "结束"/"直行")
    c = elem.find('comment')
    if c is not None and c.text:
        block.comment = c.text.strip()

    # 解析 next (下一个兄弟块)
    nxt = elem.find('next')
    if nxt is not None:
        next_block = nxt.find('block')
        if next_block is not None:
            block.next_block = _parse_block(next_block)

    return block


def _shadow_to_literal(shadow: ET.Element) -> Optional[Block]:
    """将 Blockly shadow 占位元素转换为 literal 虚拟积木块"""
    stype = shadow.get('type', '')
    field_name = _SHADOW_FIELD_MAP.get(stype, 'TEXT')
    f = shadow.find(f"field[@name='{field_name}']")
    if f is None:
        f = shadow.find('field')  # 兜底：取第一个 field
    if f is None:
        return None
    value = _try_number(f.text) if f.text is not None else 0
    # 对文本类型保持字符串，数字类型保持数值
    if stype == 'text':
        value = f.text if f.text is not None else ''
    return Block(type='literal', fields={'VALUE': value})


def _try_number(text: str) -> Any:
    """尝试将字符串转为数字，失败则返回原字符串"""
    try:
        if '.' in text:
            return float(text)
        return int(text)
    except (ValueError, TypeError):
        return text


def block_to_text(block: Block, indent: int = 0) -> str:
    """将积木块树转为可读文本（调试用）"""
    pad = "  " * indent
    lines = [f"{pad}[{block.type}]"]
    for k, v in block.fields.items():
        lines.append(f"{pad}  field.{k} = {v}")
    for k, v in block.values.items():
        lines.append(f"{pad}  value.{k} =")
        lines.append(block_to_text(v, indent + 2))
    for k, v in block.statements.items():
        lines.append(f"{pad}  statement.{k} =")
        lines.append(block_to_text(v, indent + 2))
    if block.next_block:
        lines.append(f"{pad}  next:")
        lines.append(block_to_text(block.next_block, indent + 2))
    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        b = parse_xuanzhi_file(sys.argv[1])
        print(block_to_text(b))
