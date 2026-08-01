"""验证 comment 解析是否正确提取到"结束"标签"""
import sys
sys.path.insert(0, 'src')
from parser.xml_parser import parse_xuanzhi_file

b = parse_xuanzhi_file('samples/test.XUANZHI')

def find_comments(bl, depth=0):
    results = []
    c = getattr(bl, 'comment', None)
    if c:
        results.append((depth, bl.type, c, bl.fields))
    for s in bl.statements.values():
        results.extend(find_comments(s, depth + 1))
    if bl.next_block:
        results.extend(find_comments(bl.next_block, depth))
    return results

print("=== 所有带 comment 的块 ===")
for d, t, c, f in find_comments(b):
    print(f"  L{d}: type={t}  comment={c!r}  fields={f}")
