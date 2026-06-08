#!/usr/bin/env python3
"""将 article.md + PNG 图片转为 CID 内联 HTML 邮件发送"""
import smtplib, os, re, sys, mimetypes
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email import encoders
import yaml

# --- 配置 ---
CONFIG_PATH = os.path.expanduser(
    "~/.claude/skills/chinadaas-email/config.yaml"
)
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

# 提取 frontmatter 字段
def _fm(key, default=""):
    m = re.search(rf"^{key}:\s*(.+)$", raw, re.MULTILINE)
    return m.group(1).strip().strip('"').strip("'") if m else default

SUBJECT = _fm("title") or os.path.splitext(ARTICLE_NAME)[0]
AUTHOR = _fm("author")
DATE = _fm("date")
DECODE_TYPE = _fm("type", "decode")

# 构造动态副标题：类型 | 原文：{author} | {date}
_type_label = {"decode": "深度拆解", "brief": "情报日报", "practice": "实操手册"}.get(
    DECODE_TYPE.lower(), "深度拆解"
)
_byline_parts = [_type_label]
if AUTHOR:
    _byline_parts.append(f"原文：{AUTHOR}")
if DATE:
    _byline_parts.append(DATE)
BYLINE = " | ".join(_byline_parts)

# 去掉 frontmatter
raw = re.sub(r"^---\n.*?\n---\n", "", raw, flags=re.DOTALL)

# --- 收集图片引用，替换为 CID ---
images = {}  # relative image path -> cid
cid_counter = 0


def replace_img(m):
    global cid_counter
    alt = m.group(1)
    src = m.group(2)
    rel_path = src.strip()
    # 确保用 .png
    if not rel_path.endswith(".png"):
        rel_path = rel_path.rsplit(".", 1)[0] + ".png"
    cid = f"img{cid_counter:03d}"
    cid_counter += 1
    images[rel_path] = cid
    return f'<IMGPLACEHOLDER alt="{alt}" cid="{cid}">'


raw = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", replace_img, raw)

# --- 行内格式化函数（必须在循环前定义）---

def format_inline(text):
    """处理行内 markdown：加粗、斜体、行内代码、链接"""
    # 加粗 → 橙底高亮（先处理，避免 *italic* 吃掉 **bold**）
    text = re.sub(
        r"\*\*(.+?)\*\*",
        r'<strong style="background:#FFF3E0;padding:1px 5px;border-radius:3px;color:#37352F;">\1</strong>',
        text,
    )
    # 斜体 *text* —— 排除 **（已在上面处理）和空格夹括号情况
    text = re.sub(
        r"(?<!\*)\*([^\*\n]+?)\*(?!\*)",
        r'<em style="font-style:italic;color:#37352F;">\1</em>',
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


def render_table(buf):
    """把 markdown 表格行列表渲染为 HTML table。自动识别首行为 header，
    跳过 |---|---| 分隔行。"""
    rows = []
    for line in buf:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        # 跳过分隔行：每 cell 只含 -、:、空
        if all(re.fullmatch(r"[-:\s]*", c) for c in cells):
            continue
        rows.append(cells)
    if not rows:
        return ""
    html = [
        '<table style="border-collapse:collapse;width:100%;margin:16px 0;'
        "font-family:'PingFang SC','Microsoft YaHei',sans-serif;font-size:14px;\">"
    ]
    # 首行作 header
    html.append("<thead><tr>")
    for c in rows[0]:
        html.append(
            '<th style="border:1px solid #E3E2E0;padding:8px 12px;'
            'background:#F7F7F5;text-align:left;color:#37352F;font-weight:600;">'
            + format_inline(c) + "</th>"
        )
    html.append("</tr></thead><tbody>")
    for row in rows[1:]:
        html.append("<tr>")
        for c in row:
            html.append(
                '<td style="border:1px solid #E3E2E0;padding:8px 12px;'
                'color:#37352F;line-height:1.7;">'
                + format_inline(c) + "</td>"
            )
        html.append("</tr>")
    html.append("</tbody></table>")
    return "".join(html)


def render_quote(buf):
    """把 blockquote 行列表渲染为 HTML blockquote。"""
    content = " ".join(
        format_inline(l.lstrip(">").strip()) for l in buf if l.strip()
    )
    return (
        '<blockquote style="margin:16px 0;padding:12px 18px;'
        "border-left:4px solid #2383E2;background:#F7F7F5;"
        "font-size:15px;line-height:1.8;color:#37352F;"
        "font-family:'PingFang SC','Microsoft YaHei',sans-serif;\">"
        + content + "</blockquote>"
    )


# --- Markdown → HTML ---
lines = raw.strip().split("\n")
html_parts = []
in_list = False
in_code = False
code_buf = []
in_table = False
table_buf = []
in_quote = False
quote_buf = []


def flush_table():
    global in_table, table_buf
    if in_table:
        html_parts.append(render_table(table_buf))
        table_buf = []
        in_table = False


def flush_quote():
    global in_quote, quote_buf
    if in_quote:
        html_parts.append(render_quote(quote_buf))
        quote_buf = []
        in_quote = False


def flush_list():
    global in_list
    if in_list:
        html_parts.append("</ul>")
        in_list = False


for line in lines:
    if line.startswith("```"):
        flush_table(); flush_quote(); flush_list()
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
        flush_table(); flush_quote(); flush_list()
        continue

    # 表格：以 | 开头且含 | 的行
    if stripped.startswith("|") and stripped.count("|") >= 2:
        flush_quote(); flush_list()
        in_table = True
        table_buf.append(stripped)
        continue
    else:
        flush_table()

    # Blockquote：以 > 开头
    if stripped.startswith(">"):
        flush_list()
        in_quote = True
        quote_buf.append(stripped)
        continue
    else:
        flush_quote()

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

flush_table(); flush_quote(); flush_list()

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
  {BYLINE}</p>
<hr style="border:none;border-top:2px solid #2383E2;margin:0 0 28px 0;">

{body_html}

<hr style="border:none;border-top:1px solid #E3E2E0;margin:28px 0 16px 0;">
<p style="font-size:12px;color:#787774;text-align:center;margin:0;
  font-family:'PingFang SC','Microsoft YaHei',sans-serif;">
  慕铭 | AI Force 智能体研究员 | 中数智汇</p>

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
for rel_path, cid in images.items():
    filepath = os.path.join(ARTICLE_DIR, rel_path)
    if not os.path.exists(filepath):
        print(f"[WARN] 图片不存在: {filepath}")
        continue
    with open(filepath, "rb") as f:
        img = MIMEImage(f.read(), _subtype="png")
        img.add_header("Content-ID", f"<{cid}>")
        img.add_header("Content-Disposition", "inline", filename=os.path.basename(rel_path))
        msg.attach(img)
    print(f"[OK] 内联图片: {rel_path} -> cid:{cid}")

# --- 附件：通过 --attach 添加任意文件（如 podcast.mp3） ---
# 用法：python3 send_email.py article.md --attach podcast.mp3 [--attach more.pdf] --draft
def _collect_attachments(argv):
    out = []
    i = 0
    while i < len(argv):
        if argv[i] == "--attach" and i + 1 < len(argv):
            out.append(argv[i + 1])
            i += 2
        else:
            i += 1
    return out

# 默认行为：article 同目录有 podcast.mp3 自动作为附件（除非 --no-podcast）
attachments = _collect_attachments(sys.argv)
if "--no-podcast" not in sys.argv:
    auto_podcast = os.path.join(ARTICLE_DIR, "podcast.mp3")
    if os.path.exists(auto_podcast) and auto_podcast not in attachments:
        attachments.append(auto_podcast)

for att_path in attachments:
    if not os.path.isabs(att_path):
        att_path = os.path.join(ARTICLE_DIR, att_path)
    if not os.path.exists(att_path):
        print(f"[WARN] 附件不存在: {att_path}")
        continue
    ctype, _ = mimetypes.guess_type(att_path)
    maintype, subtype = (ctype or "application/octet-stream").split("/", 1)
    with open(att_path, "rb") as f:
        data = f.read()
    if maintype == "audio":
        part = MIMEAudio(data, _subtype=subtype)
    elif maintype == "image":
        part = MIMEImage(data, _subtype=subtype)
    else:
        part = MIMEBase(maintype, subtype)
        part.set_payload(data)
        encoders.encode_base64(part)
    fn = os.path.basename(att_path)
    part.add_header("Content-Disposition", "attachment", filename=fn)
    msg.attach(part)
    size_mb = len(data) / 1024 / 1024
    print(f"[OK] 附件: {fn} ({size_mb:.1f} MB, {maintype}/{subtype})")

# --- 预览 / 草稿 / 发送 ---
# 保存 HTML 预览（始终执行）：把 cid:imgXXX 替换成实际文件名，浏览器才能渲染
preview_html = full_html
cid_to_filename = {cid: fn for fn, cid in images.items()}
for cid, filename in cid_to_filename.items():
    preview_html = preview_html.replace(f'src="cid:{cid}"', f'src="{filename}"')
preview_path = os.path.join(ARTICLE_DIR, "email_preview.html")
with open(preview_path, "w", encoding="utf-8") as f:
    f.write(preview_html)

if "--send" in sys.argv:
    # 直接发送（需明确指定）
    with smtplib.SMTP_SSL(cfg["smtp_server"], cfg["smtp_port"]) as server:
        server.login(cfg["email"], cfg["password"])
        server.sendmail(cfg["email"], [TO], msg.as_string())
    print(f"\n[SENT] 邮件已发送 → {TO}")
    # 同步追加到「已发送」文件夹（SMTP 不会自动写入 Sent）
    import imaplib
    try:
        with imaplib.IMAP4_SSL(cfg["imap_server"], cfg["imap_port"]) as mail:
            mail.login(cfg["email"], cfg["password"])
            mail.append('"Sent Messages"', "\\Seen", None, msg.as_bytes())
        print("[SENT] 已写入 Sent Messages 文件夹")
    except Exception as e:
        print(f"[WARN] Sent 追加失败：{e}")
elif "--append-sent" in sys.argv:
    # 仅追加到已发送（用于补录已通过其他路径发出的邮件）
    import imaplib
    with imaplib.IMAP4_SSL(cfg["imap_server"], cfg["imap_port"]) as mail:
        mail.login(cfg["email"], cfg["password"])
        result = mail.append('"Sent Messages"', "\\Seen", None, msg.as_bytes())
    status = "saved" if result[0] == "OK" else "failed"
    print(f"\n[APPEND-SENT] 已写入 Sent Messages ({status})")
    print(f"  收件人: {TO}")
    print(f"  主题: {SUBJECT}")
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
