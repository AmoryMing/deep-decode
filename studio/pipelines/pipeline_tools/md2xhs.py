#!/usr/bin/env python3
"""
md2xhs.py -- Markdown 文章转小红书 3:4 配图
功能: 读取 decode 成品 markdown → 渲染为精排 HTML → playwright 截长图 → 切割为 1080x1440 PNG
用法: python3 md2xhs.py <markdown文件路径> [输出目录]
"""

import sys
import os
import re
import math
import tempfile
from pathlib import Path

# ---- 配置 ----
PAGE_W = 1080   # 小红书图片宽度 px
PAGE_H = 1440   # 小红书图片高度 px (3:4)
DPR = 2         # 设备像素比, 输出实际 2160x2880 高清图


def md_to_html(md_path: str) -> str:
    """读取 markdown 文件, 转为带样式的 HTML"""
    import markdown as md

    with open(md_path, "r", encoding="utf-8") as f:
        raw = f.read()

    # 去掉 YAML frontmatter
    raw = re.sub(r"^---\n.*?\n---\n", "", raw, flags=re.DOTALL)

    # 把本地图片路径转为绝对路径 file://
    md_dir = os.path.dirname(os.path.abspath(md_path))
    # 匹配 ![alt](path) 和 ![alt](material/pngs/xxx.png)
    def fix_img(m):
        alt = m.group(1)
        src = m.group(2)
        if not src.startswith(("http://", "https://", "file://")):
            abs_path = os.path.join(md_dir, src)
            if os.path.exists(abs_path):
                src = "file://" + abs_path
        return f'![{alt}]({src})'
    raw = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", fix_img, raw)

    # 转 HTML
    html_body = md.markdown(
        raw,
        extensions=["fenced_code", "tables", "nl2br"],
    )

    # 组装完整 HTML + CSS
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
/* ---- 小红书清洁风格排版 ---- */
* {{ margin: 0; padding: 0; box-sizing: border-box; }}

body {{
    width: {PAGE_W}px;
    font-family: "PingFang SC", "Noto Sans CJK SC", "SimHei", sans-serif;
    background: #FFFFFF;
    color: #1a1a1a;
    font-size: 28px;
    line-height: 1.8;
    padding: 60px 50px;
    overflow-x: hidden;
}}

/* 标题 */
h1 {{
    font-size: 48px;
    color: #1a1a1a;
    margin: 50px 0 30px 0;
    padding-bottom: 15px;
    border-bottom: 3px solid #2383E2;
    line-height: 1.4;
}}

h2 {{
    font-size: 38px;
    color: #2383E2;
    margin: 60px 0 25px 0;
    padding-left: 18px;
    border-left: 5px solid #2383E2;
    line-height: 1.4;
}}

h3 {{
    font-size: 32px;
    color: #37352F;
    margin: 40px 0 20px 0;
}}

/* 段落 */
p {{
    margin: 15px 0;
    text-align: justify;
}}

/* 强调 */
strong {{
    color: #C47B2B;
    font-weight: bold;
}}

em {{
    color: #2383E2;
    font-style: normal;
}}

/* 引用块 */
blockquote {{
    background: #FFF8E1;
    border-left: 4px solid #C47B2B;
    padding: 20px 25px;
    margin: 25px 0;
    border-radius: 0 12px 12px 0;
    font-size: 26px;
    color: #5D4E37;
}}

blockquote p {{
    margin: 8px 0;
}}

/* 代码块 */
pre {{
    background: #F7F7F5;
    border: 1px solid #E8E8E8;
    border-radius: 12px;
    padding: 25px;
    margin: 25px 0;
    overflow-x: auto;
    font-size: 22px;
    line-height: 1.6;
}}

code {{
    font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
    color: #2383E2;
}}

pre code {{
    color: #37352F;
}}

/* 行内代码 */
p code, li code, h2 code, h3 code {{
    background: #EBF5FF;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.9em;
}}

/* 列表 */
ul, ol {{
    margin: 15px 0 15px 35px;
}}

li {{
    margin: 8px 0;
}}

li::marker {{
    color: #2383E2;
}}

/* 图片 */
img {{
    max-width: 100%;
    border-radius: 12px;
    margin: 20px 0;
    display: block;
}}

/* 表格 */
table {{
    width: 100%;
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 24px;
}}

th {{
    background: #F7F7F5;
    color: #37352F;
    padding: 12px 15px;
    text-align: left;
    border: 1px solid #E8E8E8;
    font-weight: bold;
}}

td {{
    padding: 10px 15px;
    border: 1px solid #E8E8E8;
}}

tr:nth-child(even) {{
    background: #FAFAFA;
}}

/* 分割线 */
hr {{
    border: none;
    height: 2px;
    background: linear-gradient(to right, #2383E2, #4DB6AC, #C47B2B);
    margin: 40px 0;
}}

/* 页脚水印 */
.page-footer {{
    position: fixed;
    bottom: 20px;
    right: 40px;
    font-size: 18px;
    color: rgba(0,0,0,0.15);
}}
</style>
</head>
<body>
{html_body}
</body>
</html>"""
    return html


def render_and_split(html: str, output_dir: str, stem: str) -> list:
    """用 playwright 渲染 HTML 并切割为 3:4 PNG 页面"""
    from playwright.sync_api import sync_playwright
    from PIL import Image
    import io

    os.makedirs(output_dir, exist_ok=True)

    # 写临时 HTML
    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html)
    tmp.close()

    pages_out = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(
                viewport={"width": PAGE_W, "height": PAGE_H},
                device_scale_factor=DPR,
            )
            page.goto(f"file://{tmp.name}", wait_until="networkidle")

            # 等图片加载
            page.wait_for_timeout(1000)

            # 截全页长图
            full_shot = page.screenshot(full_page=True)
            browser.close()

        # 用 Pillow 切割
        img = Image.open(io.BytesIO(full_shot))
        w, h = img.size
        # 实际像素是 PAGE_W*DPR x 总高*DPR
        page_h_px = PAGE_H * DPR
        total_pages = math.ceil(h / page_h_px)

        print(f"[md2xhs] 长图尺寸: {w}x{h}, 切割为 {total_pages} 页 ({PAGE_W}x{PAGE_H} @{DPR}x)")

        for i in range(total_pages):
            top = i * page_h_px
            bottom = min((i + 1) * page_h_px, h)

            # 创建标准尺寸画布 (处理最后一页不满的情况)
            page_img = Image.new("RGB", (w, page_h_px), (255, 255, 255))  # #FFFFFF 白色背景
            crop = img.crop((0, top, w, bottom))
            page_img.paste(crop, (0, 0))

            out_path = os.path.join(output_dir, f"{stem}_page_{i+1:02d}.png")
            page_img.save(out_path, "PNG", optimize=True)
            pages_out.append(out_path)
            print(f"  [OK] {os.path.basename(out_path)} ({page_img.size[0]}x{page_img.size[1]})")

    finally:
        os.unlink(tmp.name)

    return pages_out


def generate_hook_text(md_path: str) -> str:
    """从 markdown 提取前几段作为小红书正文钩子"""
    with open(md_path, "r", encoding="utf-8") as f:
        raw = f.read()

    # 去 frontmatter
    raw = re.sub(r"^---\n.*?\n---\n", "", raw, flags=re.DOTALL)

    # 取前3个非空段落(非标题、非图片)
    lines = raw.split("\n")
    paras = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith("#") or line.startswith("!") or line.startswith("```"):
            continue
        # 去掉 markdown 格式
        clean = re.sub(r"\*\*([^*]+)\*\*", r"\1", line)
        clean = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", clean)
        paras.append(clean)
        if len(paras) >= 3:
            break

    hook = "\n\n".join(paras)
    # 小红书正文限制 1000 字, 留余量
    if len(hook) > 800:
        hook = hook[:800] + "..."
    return hook


def extract_title(md_path: str) -> str:
    """从 frontmatter 或首个 h1 提取标题"""
    with open(md_path, "r", encoding="utf-8") as f:
        raw = f.read()

    # 从 frontmatter title
    m = re.search(r"^title:\s*(.+)$", raw, re.MULTILINE)
    if m:
        title = m.group(1).strip().strip('"').strip("'")
        # 小红书标题限制 20 字, 在标点或空格处截断
        if len(title) > 20:
            # 找最后一个合适的截断点
            for i in range(19, 10, -1):
                if title[i] in "：:，, 、—-·|":
                    title = title[:i]
                    break
            else:
                title = title[:20]
        return title

    # 从首个 h1
    m = re.search(r"^#\s+(.+)$", raw, re.MULTILINE)
    if m:
        title = m.group(1).strip()
        if len(title) > 20:
            for i in range(19, 10, -1):
                if title[i] in "：:，, 、—-·|":
                    title = title[:i]
                    break
            else:
                title = title[:20]
        return title

    return os.path.basename(md_path).replace(".md", "")


def extract_tags(md_path: str) -> str:
    """从 frontmatter tags 提取标签"""
    with open(md_path, "r", encoding="utf-8") as f:
        raw = f.read()

    m = re.search(r"^tags:\s*\[(.+)\]$", raw, re.MULTILINE)
    if m:
        tags = [t.strip().strip('"').strip("'").replace(" ", "") for t in m.group(1).split(",")]
        tags = [t for t in tags if t]  # 去空
        return ",".join(tags[:10])
    return "AI,深度解读"


def main():
    if len(sys.argv) < 2:
        print("用法: python3 md2xhs.py <markdown文件> [输出目录]")
        print("示例: python3 md2xhs.py article.md ./xhs_output/")
        sys.exit(1)

    md_path = sys.argv[1]
    if not os.path.isfile(md_path):
        print(f"[错误] 文件不存在: {md_path}")
        sys.exit(1)

    # 输出目录: 指定 or 文章同级 distribute/xiaohongshu/
    if len(sys.argv) >= 3:
        output_dir = sys.argv[2]
    else:
        output_dir = os.path.join(os.path.dirname(md_path), "distribute", "xiaohongshu")

    stem = Path(md_path).stem

    print(f"[md2xhs] 输入: {md_path}")
    print(f"[md2xhs] 输出: {output_dir}")
    print()

    # Step 1: md → HTML
    print("[1/4] 转换 Markdown → HTML ...")
    html = md_to_html(md_path)

    # Step 2: 渲染 + 切割
    print("[2/4] Playwright 渲染 + 切割为 3:4 页面 ...")
    pages = render_and_split(html, output_dir, stem)

    # Step 3: 提取元数据
    print("[3/4] 提取标题/标签/钩子文案 ...")
    title = extract_title(md_path)
    tags = extract_tags(md_path)
    hook = generate_hook_text(md_path)

    # Step 4: 生成 content.md
    print("[4/4] 生成 content.md ...")
    content_md = os.path.join(output_dir, "content.md")
    with open(content_md, "w", encoding="utf-8") as f:
        f.write(f"## 标题\n\n{title}\n\n")
        f.write(f"## 正文\n\n{hook}\n\n")
        f.write(f"## 标签\n\n")
        for tag in tags.split(","):
            f.write(f"#{tag.strip()} ")
        f.write(f"\n\n## 配图\n\n")
        for p in pages:
            f.write(f"- {os.path.basename(p)}\n")

    print()
    print(f"========================================")
    print(f"完成! 共 {len(pages)} 张配图")
    print(f"  标题: {title}")
    print(f"  标签: {tags}")
    print(f"  钩子: {hook[:60]}...")
    print(f"  content.md: {content_md}")
    print(f"========================================")

    return pages


if __name__ == "__main__":
    main()
