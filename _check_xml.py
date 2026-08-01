import re
from collections import Counter

with open('test.XUANZHI', 'r', encoding='utf-8') as f:
    txt = f.read()

types = re.findall(r'type="([^"]+)"', txt)
for t, c in Counter(types).most_common():
    print(f'  {t}: {c}次')
print(f'\n总块数: {len(types)}')

for kw in ['stop', 'end', '停', '结', 'break', 'exit', '终止']:
    if kw.lower() in txt.lower():
        idx = txt.lower().index(kw.lower())
        print(f'找到 "{kw}" 位置{idx}: ...{txt[max(0,idx-30):idx+50]}...')
    else:
        print(f'未找到 "{kw}"')
