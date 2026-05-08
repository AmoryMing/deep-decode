#!/usr/bin/env python3
"""
小红书草稿批量发布脚本
用法: python3 pipeline/xhs_publish_drafts.py
前提: opencli 已安装, Browser Bridge 已连接, Chrome 已登录 creator.xiaohongshu.com
"""

import os
import re
import subprocess
import sys
import time

# ---- 配置 ----
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ARTICLES = [
    ("2026-04-03-claude-code-leak-panorama", "51万行源码泄露，底裤长啥样"),
    ("2026-04-03-agent-loop-single-thread", "最强AI编程工具选了最笨架构"),
    ("2026-04-03-harness-greater-than-model", "50万行代码不跟AI对话在干嘛"),
    ("2026-04-03-queryengine-brain", "从能跑到能用差了12900行"),
    ("2026-04-03-speculation-prefetch", "AI编程助手偷学了CPU老把戏"),
    ("2026-04-03-two-leaks-evolution", "同一个错误14个月后又犯了"),
]


def check_opencli():
    """检查 opencli 连接状态"""
    try:
        result = subprocess.run(["opencli", "doctor"], capture_output=True, text=True, timeout=15)
        if "[OK] Connectivity" in result.stdout:
            print("[OK] opencli 连接正常")
            return True
    except Exception as e:
        print(f"[错误] opencli 检查失败: {e}")
    print("[错误] opencli 未连接。请确认 Chrome 已安装 Browser Bridge 扩展并登录 creator.xiaohongshu.com")
    return False


def parse_content_md(filepath):
    """从 content.md 解析正文和标签"""
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    # 提取正文：## 正文 到 ## 标签 之间
    body_match = re.search(r"## 正文\n+(.*?)\n+## 标签", text, re.DOTALL)
    body = body_match.group(1).strip() if body_match else ""

    # 提取标签：## 标签 后的 #tag 行，去掉 # 号，逗号分隔
    tags_match = re.search(r"## 标签\n+(.+)", text)
    topics = ""
    if tags_match:
        tags_line = tags_match.group(1).strip()
        # 去掉 # 号，按空格分割
        tags = [t.lstrip("#").strip() for t in tags_line.split("#") if t.strip()]
        topics = ",".join(tags[:10])  # 最多 10 个

    return body, topics


def collect_images(xhs_dir):
    """收集目录下所有 PNG 文件路径"""
    pngs = sorted([
        os.path.join(xhs_dir, f)
        for f in os.listdir(xhs_dir)
        if f.endswith(".png")
    ])
    return ",".join(pngs)


def publish_draft(title, body, images, topics):
    """调用 opencli 发布草稿"""
    cmd = [
        "opencli", "xiaohongshu", "publish", body,
        "--title", title,
        "--images", images,
        "--topics", topics,
        "--draft", "true",
        "--format", "json",
    ]

    print(f"  [调试] 标题({len(title)}字): {title}")
    print(f"  [调试] 正文: {len(body)}字")
    print(f"  [调试] 图片: {images.count(',') + 1}张")
    print(f"  [调试] 标签: {topics}")

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

    if result.returncode == 0:
        print(f"  [stdout] {result.stdout.strip()}")
        return True
    else:
        print(f"  [stderr] {result.stderr.strip()}")
        print(f"  [stdout] {result.stdout.strip()}")
        return False


def main():
    print(f"[小红书草稿发布] 基础目录: {BASE}")
    print()

    if not check_opencli():
        sys.exit(1)
    print()

    success, fail = 0, 0

    for dirname, title in ARTICLES:
        xhs_dir = os.path.join(BASE, dirname, "distribute", "xiaohongshu")
        content_md = os.path.join(xhs_dir, "content.md")

        print(f"=== 发布: {title} ===")

        if not os.path.isdir(xhs_dir):
            print(f"  [跳过] 目录不存在: {xhs_dir}")
            fail += 1
            continue

        if not os.path.isfile(content_md):
            print(f"  [跳过] content.md 不存在")
            fail += 1
            continue

        body, topics = parse_content_md(content_md)
        images = collect_images(xhs_dir)

        if not body:
            print("  [跳过] 正文为空")
            fail += 1
            continue

        if publish_draft(title, body, images, topics):
            print(f"  [OK] 草稿已保存")
            success += 1
        else:
            print(f"  [失败]")
            fail += 1

        print()
        time.sleep(3)

    print("=" * 40)
    print(f"发布完成: 成功 {success} / 失败 {fail} / 共 {len(ARTICLES)}")
    print("请打开 creator.xiaohongshu.com 审核草稿")
    print("=" * 40)


if __name__ == "__main__":
    main()
