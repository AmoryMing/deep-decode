#!/usr/bin/env python3
"""
xhs_pipeline.py -- 小红书发布管线
功能: 扫描 decode 成品文章 → md2xhs 生成 3:4 配图 → opencli 推到草稿箱
用法:
  python3 xhs_pipeline.py                     # 扫描全部, 只生成配图不发布
  python3 xhs_pipeline.py --publish            # 生成 + 发布到草稿箱
  python3 xhs_pipeline.py --article <目录名>   # 只处理指定文章
  python3 xhs_pipeline.py --force              # 强制重新生成配图
"""

import os
import sys
import subprocess
import time
import argparse
from pathlib import Path

# ---- 路径 ----
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PIPELINES_DIR = os.path.dirname(SCRIPT_DIR)
# 扫描两个产出目录
ARTICLE_DIRS = [
    os.path.join(PIPELINES_DIR, "decode"),
    os.path.join(PIPELINES_DIR, "claudecode_deep_decode"),
    os.path.join(PIPELINES_DIR, "hot-history"),
]
MD2XHS = os.path.join(SCRIPT_DIR, "md2xhs.py")


def find_articles(specific=None):
    """扫描 decode/ 下所有成品文章目录"""
    articles = []
    for base_dir in ARTICLE_DIRS:
        if not os.path.isdir(base_dir):
            continue

        for d in sorted(os.listdir(base_dir)):
            full = os.path.join(base_dir, d)
            if not os.path.isdir(full):
                continue
            # 跳过非文章目录（context/, pipeline/ 等）
            if not d.startswith("2026-") and not d.startswith("2025-"):
                continue
            if specific:
                if isinstance(specific, list):
                    if d not in specific:
                        continue
                elif d != specific:
                    continue

            # 找主 markdown 文件 (与目录同名)
            md_file = os.path.join(full, f"{d}.md")
            if not os.path.isfile(md_file):
                # 尝试找任意 .md (排除 draft.md)
                mds = [f for f in os.listdir(full) if f.endswith(".md") and f != "draft.md"]
                if mds:
                    md_file = os.path.join(full, mds[0])
                else:
                    continue

            articles.append({"dir": d, "path": full, "md": md_file})

    return articles


def has_xhs_images(article_path):
    """检查是否已生成小红书配图"""
    xhs_dir = os.path.join(article_path, "distribute", "xiaohongshu")
    if not os.path.isdir(xhs_dir):
        return False
    pngs = [f for f in os.listdir(xhs_dir) if f.endswith(".png") and "page_" in f]
    return len(pngs) > 0


def generate_images(md_file, force=False):
    """调用 md2xhs 生成配图"""
    article_dir = os.path.dirname(md_file)
    xhs_dir = os.path.join(article_dir, "distribute", "xiaohongshu")

    if has_xhs_images(article_dir) and not force:
        print(f"  [跳过] 配图已存在 ({xhs_dir})")
        return True

    result = subprocess.run(
        [sys.executable, MD2XHS, md_file],
        capture_output=True, text=True, timeout=120
    )

    if result.returncode == 0:
        print(result.stdout)
        return True
    else:
        print(f"  [错误] md2xhs 失败:")
        print(result.stderr)
        return False


def parse_content_md(xhs_dir):
    """从 content.md 解析标题/正文/标签/图片"""
    content_file = os.path.join(xhs_dir, "content.md")
    if not os.path.isfile(content_file):
        return None

    with open(content_file, "r", encoding="utf-8") as f:
        text = f.read()

    import re

    # 标题
    m = re.search(r"## 标题\n+(.+)", text)
    title = m.group(1).strip() if m else ""

    # 正文
    m = re.search(r"## 正文\n+(.*?)\n+## 标签", text, re.DOTALL)
    body = m.group(1).strip() if m else ""

    # 标签: 从 ## 标签 后的 #tag 行提取
    m = re.search(r"## 标签\n+(.+)", text)
    topics = ""
    if m:
        tags_line = m.group(1).strip()
        tags = [t.strip().lstrip("#").strip() for t in tags_line.split("#") if t.strip()]
        topics = ",".join(tags[:10])

    # 图片列表
    images = sorted([
        os.path.join(xhs_dir, f)
        for f in os.listdir(xhs_dir)
        if f.endswith(".png") and "page_" in f
    ])

    return {
        "title": title,
        "body": body,
        "topics": topics,
        "images": ",".join(images),
        "image_count": len(images),
    }


def publish_draft(meta):
    """调用 opencli 发布草稿"""
    if not meta["title"] or not meta["body"]:
        print("  [跳过] 标题或正文为空")
        return False

    # 小红书支持最多 20 张图, opencli 可能有自己的限制
    images = meta["images"]
    img_list = images.split(",")
    if len(img_list) > 20:
        print(f"  [警告] 图片 {len(img_list)} 张超过20张, 取前20张")
        images = ",".join(img_list[:20])
        meta["image_count"] = 20

    cmd = [
        "opencli", "xiaohongshu", "publish", meta["body"],
        "--title", meta["title"],
        "--images", images,
        "--topics", meta["topics"],
        "--draft", "true",
        "--format", "json",
    ]

    print(f"  标题: {meta['title']}")
    print(f"  图片: {meta['image_count']} 张")
    print(f"  标签: {meta['topics']}")
    print(f"  正文: {meta['body'][:60]}...")

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

    if result.returncode == 0:
        print(f"  [OK] 草稿已保存")
        return True
    else:
        print(f"  [失败] {result.stderr.strip()}")
        return False


def check_opencli():
    """检查 opencli 连接"""
    try:
        result = subprocess.run(["opencli", "doctor"], capture_output=True, text=True, timeout=15)
        if "[OK] Connectivity" in result.stdout:
            return True
    except Exception:
        pass
    return False


def main():
    parser = argparse.ArgumentParser(description="小红书发布管线")
    parser.add_argument("--publish", action="store_true", help="生成配图后发布到草稿箱")
    parser.add_argument("--article", type=str, action="append", help="只处理指定文章目录名(可多次指定)")
    parser.add_argument("--force", action="store_true", help="强制重新生成配图")
    args = parser.parse_args()

    print("=" * 50)
    print("小红书发布管线")
    print(f"扫描目录: {', '.join(os.path.basename(d) for d in ARTICLE_DIRS)}")
    print("=" * 50)
    print()

    # 扫描文章
    # --article 可多次指定，传入列表或 None
    article_filter = args.article  # None 或 list
    articles = find_articles(article_filter)
    if not articles:
        print("[无文章] 没找到可处理的成品文章")
        sys.exit(1)

    print(f"找到 {len(articles)} 篇文章:")
    for a in articles:
        status = "已有配图" if has_xhs_images(a["path"]) else "待生成"
        print(f"  - {a['dir']} [{status}]")
    print()

    # 如果要发布, 先检查 opencli
    if args.publish:
        if not check_opencli():
            print("[错误] opencli 未连接, 无法发布。仅生成配图。")
            args.publish = False
        else:
            print("[OK] opencli 连接正常")
        print()

    # 处理每篇文章
    gen_ok, gen_fail, pub_ok, pub_fail = 0, 0, 0, 0

    for article in articles:
        print(f"=== {article['dir']} ===")

        # Step 1: 生成配图
        if generate_images(article["md"], args.force):
            gen_ok += 1
        else:
            gen_fail += 1
            continue

        # Step 2: 发布 (如果指定)
        if args.publish:
            xhs_dir = os.path.join(article["path"], "distribute", "xiaohongshu")
            meta = parse_content_md(xhs_dir)
            if meta and publish_draft(meta):
                pub_ok += 1
            else:
                pub_fail += 1
            time.sleep(3)  # 避免频率限制

        print()

    # 汇总
    print("=" * 50)
    print(f"配图生成: 成功 {gen_ok} / 失败 {gen_fail}")
    if args.publish:
        print(f"草稿发布: 成功 {pub_ok} / 失败 {pub_fail}")
        print("请打开 creator.xiaohongshu.com 审核草稿")
    else:
        print("配图已就绪, 加 --publish 参数可发布到草稿箱")
    print("=" * 50)


if __name__ == "__main__":
    main()
