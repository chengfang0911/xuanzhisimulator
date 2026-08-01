"""玄智 XUANZHI 机器人模拟器 - 启动入口

用法:
    python main.py [程序文件.XUANZHI]
"""
import os
import sys

# 将项目根加入 sys.path
ROOT = os.path.dirname(os.path.abspath(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from src.app import main as app_main

if __name__ == "__main__":
    app_main()
