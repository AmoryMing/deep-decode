#!/usr/bin/env python3
"""将 article.md + PNG 图片转为 CID 内联 HTML 邮件发送"""
import smtplib, os, re, sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import yaml

# --- 配置 ---
CONFIG_PATH = "/Users/muming/项目/内容/.claude/skills/chinadaas-email/config.yaml"
ARTICLE_DIR = os.path.dirname(os.path.abspath(__file__))
# 支持命令行指定 markdown 文件，默认 article.md
ARTICLE_NAME = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "article.md"
ARTICLE_PATH = os.path.join(ARTICLE_DIR, ARTICLE_NAME)
TO = "xuehongtao@chinadaas.com"

# --- 读配置 ---
with open(CONFIG_PATH, "r") as f:
    cfg = yaml.safe_load(f)

# --- 读 markdown ---
with open(ARTICLE_PATH, "r", encoding="utf-8") as f:
    raw = f.read()

# 提取 frontmatter 中的标题
title_match = re.search(r"^title:\s*(.+)$", raw, re.MULTILINE)
SUBJECT = title_match.group(1).strip() if title_match else os.path.splitext(ARTICLE_NAME)[0]

# 去掉 frontmatter
raw = re.sub(r"^---\n.*?\n---\n", "", raw, flags=re.DOTALL)

# --- 收集图片引用，替换为 CID ---
images = {}  # filename -> cid
cid_counter = 0


def replace_img(m):
    global cid_counter
    alt = m.group(1)
    src = m.group(2)
    filename = os.path.basename(src)
    # 确保用 .png
    if not filename.endswith(".png"):
        filename = filename.rsplit(".", 1)[0] + ".png"
    cid = f"img{cid_counter:03d}"
    cid_counter += 1
    images[filename] = cid
    return f'<IMGPLACEHOLDER alt="{alt}" cid="{cid}">'


raw = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", replace_img, raw)

# --- 行内格式化函数（必须在循环前定义）---

def format_inline(text):
    """处理行内 markdown：加粗、行内代码、链接"""
    # 加粗 → 橙底高亮
    text = re.sub(
        r"\*\*(.+?)\*\*",
        r'<strong style="background:#FFF3E0;padding:1px 5px;border-radius:3px;color:#37352F;">\1</strong>',
        text,
    )
    # 行内代码
    text = re.sub(
        r"`([^`]+)`",
        r'<code style="background:#F5F5F5;padding:2px 5px;border-radius:3px;'
        r"font-family:'SF Mono','Fira Code',monospace;font-size:13px;\">"
        r"\1</code>",
        text,
    )
    # 链接
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        r'<a href="\2" style="color:#2383E2;text-decoration:none;">\1</a>',
        text,
    )
    return text


# --- Markdown → HTML ---
lines = raw.strip().split("\n")
html_parts = []
in_list = False
in_code = False
code_buf = []

for line in lines:
    if line.startswith("```"):
        if in_code:
            code_text = "\n".join(code_buf)
            html_parts.append(
                f'<pre style="background:#F5F5F5;padding:14px 16px;border-radius:6px;'
                f"font-family:'SF Mono','Fira Code',monospace;font-size:13px;"
                f'line-height:1.6;color:#37352F;overflow-x:auto;margin:16px 0;">'
                f"<code>{code_text}</code></pre>"
            )
            code_buf = []
            in_code = False
        else:
            in_code = True
        continue
    if in_code:
        code_buf.append(line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
        continue

    stripped = line.strip()

    if not stripped:
        if in_list:
            html_parts.append("</ul>")
            in_list = False
        continue

    if stripped.startswith("<IMGPLACEHOLDER"):
        m = re.search(r'alt="([^"]*)" cid="([^"]*)"', stripped)
        if m:
            alt, cid = m.group(1), m.group(2)
            html_parts.append(
                f'<div style="text-align:center;margin:24px 0;">'
                f'<img src="cid:{cid}" alt="{alt}" style="max-width:100%;height:auto;border-radius:6px;">'
                f"</div>"
            )
        continue

    if stripped.startswith("## "):
        title = format_inline(stripped[3:])
        html_parts.append(
            f'<h2 style="font-size:19px;color:#37352F;font-weight:700;'
            f"margin:32px 0 12px 0;padding-bottom:8px;"
            f'border-bottom:2px solid #2383E2;font-family:\'PingFang SC\',\'Microsoft YaHei\',sans-serif;">'
            f"{title}</h2>"
        )
        continue

    if stripped.startswith("- "):
        if not in_list:
            html_parts.append('<ul style="padding-left:20px;margin:12px 0;">')
            in_list = True
        item = format_inline(stripped[2:])
        html_parts.append(
            f'<li style="font-size:15px;line-height:1.8;color:#37352F;'
            f"margin-bottom:8px;font-family:'PingFang SC','Microsoft YaHei',sans-serif;\">"
            f"{item}</li>"
        )
        continue

    if stripped == "---":
        if in_list:
            html_parts.append("</ul>")
            in_list = False
        html_parts.append(
            '<hr style="border:none;border-top:1px solid #E3E2E0;margin:28px 0;">'
        )
        continue

    # 普通段落
    if in_list:
        html_parts.append("</ul>")
        in_list = False
    text = format_inline(stripped)
    html_parts.append(
        f'<p style="font-size:15px;line-height:1.9;color:#37352F;'
        f"margin:0 0 16px 0;font-family:'PingFang SC','Microsoft YaHei',sans-serif;\">"
        f"{text}</p>"
    )

if in_list:
    html_parts.append("</ul>")

# --- 组装完整 HTML ---
body_html = "\n".join(html_parts)

full_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F7F5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="680" cellpadding="0" cellspacing="0"
  style="background:#FFFFFF;border-radius:8px;max-width:680px;width:100%;">
<tr><td style="padding:36px 40px;">

<h1 style="font-size:24px;color:#37352F;font-weight:700;margin:0 0 8px 0;
  line-height:1.4;font-family:'PingFang SC','Microsoft YaHei',sans-serif;">
  {SUBJECT}</h1>
<p style="font-size:13px;color:#787774;margin:0 0 24px 0;
  font-family:'PingFang SC','Microsoft YaHei',sans-serif;">
  AI Force 深度拆解 | 2026-04-17</p>
<hr style="border:none;border-top:2px solid #2383E2;margin:0 0 28px 0;">

{body_html}

<hr style="border:none;border-top:1px solid #E3E2E0;margin:28px 0 16px 0;">
<p style="font-size:12px;color:#787774;text-align:center;margin:0;
  font-family:'PingFang SC','Microsoft YaHei',sans-serif;">
  AI Force | 中数智汇</p>

</td></tr>
</table>
</td></tr>
</table>
</body>
</html>"""

# --- 构建邮件 ---
msg = MIMEMultipart("related")
msg["From"] = cfg["email"]
msg["To"] = TO
msg["Subject"] = SUBJECT
msg.attach(MIMEText(full_html, "html", "utf-8"))

# 附加图片为 CID 内联
for filename, cid in images.items():
    filepath = os.path.join(ARTICLE_DIR, filename)
    if not os.path.exists(filepath):
        print(f"[WARN] 图片不存在: {filepath}")
        continue
    with open(filepath, "rb") as f:
        img = MIMEImage(f.read(), _subtype="png")
        img.add_header("Content-ID", f"<{cid}>")
        img.add_header("Content-Disposition", "inline", filename=filename)
        msg.attach(img)
    print(f"[OK] 内联图片: {filename} -> cid:{cid}")

# --- 预览 / 草稿 / 发送 ---
# 保存 HTML 预览（始终执行）
preview_path = os.path.join(ARTICLE_DIR, "email_preview.html")
with open(preview_path, "w", encoding="utf-8") as f:
    f.write(full_html)

if "--send" in sys.argv:
    # 直接发送（需明确指定）
    with smtplib.SMTP_SSL(cfg["smtp_server"], cfg["smtp_port"]) as server:
        server.login(cfg["email"], cfg["password"])
        server.sendmail(cfg["email"], [TO], msg.as_string())
    print(f"\n[SENT] 邮件已发送 → {TO}")
elif "--draft" in sys.argv:
    # 存草稿箱（默认推荐方式）
    import imaplib
    with imaplib.IMAP4_SSL(cfg["imap_server"], cfg["imap_port"]) as mail:
        mail.login(cfg["email"], cfg["password"])
        result = mail.append("Drafts", "\\Draft", None, msg.as_bytes())
        status = "saved" if result[0] == "OK" else "failed"
    print(f"\n[DRAFT] 邮件已存入草稿箱 ({status})")
    print(f"  收件人: {TO}")
    print(f"  主题: {SUBJECT}")
    print(f"  图片: {len(images)} 张 CID 内联")
    print(f"  请登录 exmail.qq.com 检查草稿后手动发送")
else:
    # 默认：仅预览
    print(f"\n[PREVIEW] HTML 已保存: {preview_path}")
    print(f"  收件人: {TO}")
    print(f"  主题: {SUBJECT}")
    print(f"  图片: {len(images)} 张 CID 内联")
    print(f"  加 --draft 存草稿箱 | 加 --send 直接发送")
