#!/usr/bin/env python3
"""
批量发布器：7 篇 done 文章 → 邮件草稿 + 公众号草稿
- 邮件：HTML 正文 + 图片内嵌，存 IMAP 草稿箱
- 公众号：调用 wechat_publish.py
- 两个渠道都加淡黄色高亮标记阅读重点
"""

import imaplib
import smtplib
import json
import re
import base64
import os
import sys
import subprocess
from pathlib import Path
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from datetime import datetime
import markdown

# ---- 配置 ----
SMTP_SERVER = "smtp.exmail.qq.com"
SMTP_PORT = 465
IMAP_SERVER = "imap.exmail.qq.com"
IMAP_PORT = 993
EMAIL = "muming@chinadaas.com"
PASSWORD = "Mm2025amory@579"
TO = "xuehongtao@chinadaas.com"

CC_ROOT = Path("/home/super/stuff_AI_force/stuff/muming/vault/1-knowledge/project/content_creation企媒内容生产/pipelines/claudecode_deep_decode")
QUEUE = CC_ROOT / "pipeline" / "queue.jsonl"
WECHAT_SCRIPT = Path("/home/super/stuff_AI_force/stuff/muming/vault/1-knowledge/project/content_creation企媒内容生产/pipelines/scripts/wechat_publish.py")

# ---- 淡黄色高亮：标记 **粗体** 为阅读重点 ----
HIGHLIGHT_STYLE = "background-color:#FFF9C4;padding:2px 4px;border-radius:3px;"

def get_done_articles():
    """读 queue，返回所有 done 的文章"""
    articles = []
    with open(QUEUE) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            if item.get("status") == "done":
                slug = item["slug"]
                md_path = CC_ROOT / slug / f"{slug}.md"
                if md_path.exists():
                    articles.append({
                        "id": item["id"],
                        "slug": slug,
                        "title": item["title"],
                        "md_path": md_path,
                        "dir": CC_ROOT / slug,
                    })
    return articles


def read_md(md_path):
    """读 markdown，去掉 frontmatter"""
    text = md_path.read_text(encoding="utf-8")
    if text.startswith("---"):
        end = text.find("---", 3)
        if end != -1:
            text = text[end + 3:].strip()
    return text


def md_to_html_email(md_text, pngs_dir):
    """Markdown → 邮件 HTML，图片用 CID 引用，粗体加淡黄色高亮"""
    images = {}
    cid_counter = [0]

    def replace_image(match):
        alt = match.group(1)
        path = match.group(2)
        filename = os.path.basename(path)
        png_path = pngs_dir / filename
        if not png_path.exists():
            for f in pngs_dir.iterdir():
                if alt in f.stem:
                    png_path = f
                    break
        if png_path.exists():
            cid_counter[0] += 1
            cid = f"img{cid_counter[0]}"
            images[cid] = png_path
            return f'<img src="cid:{cid}" alt="{alt}" style="max-width:100%;margin:16px 0;border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,0.1);">'
        return f'<p>[图片缺失: {alt}]</p>'

    md_text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replace_image, md_text)

    html = markdown.markdown(md_text, extensions=['tables', 'fenced_code'])

    # 粗体加淡黄色高亮
    html = re.sub(
        r'<strong>(.*?)</strong>',
        rf'<strong style="{HIGHLIGHT_STYLE}">\1</strong>',
        html
    )

    full_html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
body {{ font-family: -apple-system, "Segoe UI", "Noto Sans SC", sans-serif; line-height: 1.8; color: #1a1a1a; max-width: 720px; margin: 0 auto; padding: 20px; }}
h1 {{ font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 8px; }}
h2 {{ font-size: 20px; margin-top: 32px; color: #222; }}
p {{ margin: 12px 0; }}
blockquote {{ border-left: 3px solid #2383E2; padding: 12px 16px; background: #f7f9fc; color: #555; }}
code {{ background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 14px; }}
pre {{ background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; }}
img {{ max-width: 100%; border-radius: 4px; }}
table {{ border-collapse: collapse; width: 100%; margin: 16px 0; }}
td, th {{ border: 1px solid #e8e8e8; padding: 8px 12px; font-size: 14px; }}
</style></head><body>
{html}
</body></html>"""

    return full_html, images


def save_email_draft(title, html, images):
    """保存邮件到 IMAP 草稿箱"""
    msg = MIMEMultipart("related")
    msg["From"] = EMAIL
    msg["To"] = TO
    msg["Subject"] = title

    msg.attach(MIMEText(html, "html", "utf-8"))

    for cid, path in images.items():
        with open(path, "rb") as f:
            img = MIMEImage(f.read())
            img.add_header("Content-ID", f"<{cid}>")
            img.add_header("Content-Disposition", "inline", filename=path.name)
            msg.attach(img)

    # 存入草稿箱
    imap = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
    imap.login(EMAIL, PASSWORD)

    # 腾讯企业邮箱草稿箱名称
    draft_folder = "Drafts"
    try:
        imap.select(draft_folder)
    except Exception:
        # 尝试其他可能的草稿箱名称
        for name in ['"&g0l6P3ux-"', 'INBOX.Drafts', '&g0l6P3ux-']:
            try:
                imap.select(name)
                draft_folder = name
                break
            except Exception:
                continue

    result = imap.append(
        draft_folder,
        "\\Draft",
        None,
        msg.as_bytes()
    )
    imap.logout()

    return result[0] == "OK"


def publish_wechat_draft(md_path):
    """调用 wechat_publish.py 创建公众号草稿"""
    result = subprocess.run(
        [sys.executable, str(WECHAT_SCRIPT), str(md_path)],
        capture_output=True, text=True, timeout=120
    )
    return result.returncode == 0, result.stdout + result.stderr


def main():
    articles = get_done_articles()
    print(f"{'='*60}")
    print(f" 批量发布器：{len(articles)} 篇 done 文章")
    print(f" 邮件草稿 → {TO}")
    print(f" 公众号草稿 → 微信后台")
    print(f" 高亮：粗体文字加淡黄色背景")
    print(f"{'='*60}\n")

    email_ok = 0
    email_fail = 0
    wechat_ok = 0
    wechat_fail = 0

    for art in articles:
        print(f"\n--- [{art['id']}] {art['title'][:40]} ---")

        md_text = read_md(art["md_path"])
        pngs_dir = art["dir"] / "material" / "pngs"

        # 1. 邮件草稿
        if pngs_dir.exists():
            html, images = md_to_html_email(md_text, pngs_dir)
            try:
                ok = save_email_draft(art["title"], html, images)
                if ok:
                    print(f"  [邮件] 草稿已存 ({len(images)} 张图)")
                    email_ok += 1
                else:
                    print(f"  [邮件] 保存失败")
                    email_fail += 1
            except Exception as e:
                print(f"  [邮件] 错误: {e}")
                email_fail += 1
        else:
            print(f"  [邮件] 跳过 (无 pngs 目录)")
            email_fail += 1

        # 2. 公众号草稿
        try:
            ok, output = publish_wechat_draft(art["md_path"])
            if ok:
                print(f"  [公众号] 草稿已创建")
                wechat_ok += 1
            else:
                print(f"  [公众号] 失败: {output[-200:]}")
                wechat_fail += 1
        except Exception as e:
            print(f"  [公众号] 错误: {e}")
            wechat_fail += 1

    print(f"\n{'='*60}")
    print(f" 邮件草稿: {email_ok} 成功, {email_fail} 失败")
    print(f" 公众号草稿: {wechat_ok} 成功, {wechat_fail} 失败")
    print(f" 完成: {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
