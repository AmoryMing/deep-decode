#!/usr/bin/env python3
"""本次邮件专用 draft 发送器：
   - 多收件人（逗号分隔）
   - CID 内联信息图
   - podcast.mp3 作为附件
   - 默认存草稿箱（chinadaas 配置），不直接发
用法：
   python3 send_draft.py              # 只预览 HTML
   python3 send_draft.py --draft      # 存草稿箱
   python3 send_draft.py --send       # 直接发（慎用）
"""
import smtplib, imaplib, os, re, sys, argparse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email import encoders
import email.utils
import yaml

BASE = os.path.dirname(os.path.abspath(__file__))
CONFIG = os.path.expanduser("~/.claude/skills/chinadaas-email/config.yaml")
MD_PATH = os.path.join(BASE, "email_source.md")
PODCAST = os.path.join(BASE, "podcast.mp3")

DEFAULT_TO = ["xuehongtao@chinadaas.com", "yangshaowei@chinadaas.com"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", action="store_true")
    ap.add_argument("--send", action="store_true")
    ap.add_argument("--to", default=",".join(DEFAULT_TO), help="逗号分隔收件人")
    ap.add_argument("--subtitle", default=None)
    args = ap.parse_args()

    to_list = [x.strip() for x in args.to.split(",") if x.strip()]

    with open(MD_PATH, encoding="utf-8") as f:
        raw = f.read()
    with open(CONFIG) as f:
        cfg = yaml.safe_load(f)

    fm = re.match(r"^---\n(.*?)\n---\n", raw, re.DOTALL)
    meta = {}
    if fm:
        meta = yaml.safe_load(fm.group(1)) or {}
        raw = raw[fm.end():]
    subject = meta.get("title") or "深度拆解"

    raw = re.sub(r"^#\s+" + re.escape(subject) + r"\s*\n+", "", raw, count=1)
    subtitle = args.subtitle or f"深度拆解 | {meta.get('date','')} | 慕铭 · AI Force"

    # 收集图片 → CID
    images = {}
    cnt = [0]
    def repl(m):
        alt, src = m.group(1), m.group(2)
        fn = os.path.basename(src)
        if not fn.lower().endswith(".png"):
            fn = os.path.splitext(fn)[0] + ".png"
        cid = f"img{cnt[0]:03d}"
        cnt[0] += 1
        images[cid] = {"alt": alt, "src": src, "fn": fn}
        return f'<IMGPLACEHOLDER alt="{alt}" cid="{cid}">'
    raw = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", repl, raw)

    def fmt(t):
        t = re.sub(r"\*\*(.+?)\*\*",
            r'<strong style="background:#FFF3E0;padding:1px 5px;border-radius:3px;color:#37352F;">\1</strong>', t)
        t = re.sub(r"`([^`]+)`",
            r'<code style="background:#F5F5F5;padding:2px 5px;border-radius:3px;'
            r"font-family:'SF Mono',monospace;font-size:13px;\">\1</code>", t)
        t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
            r'<a href="\2" style="color:#2383E2;text-decoration:none;">\1</a>', t)
        return t

    lines = raw.strip().split("\n")
    out = []
    in_list = False
    in_bq = False
    bq = []
    def flush_bq():
        nonlocal in_bq, bq
        if in_bq and bq:
            content = "<br>".join(fmt(l) for l in bq)
            out.append(
                f'<blockquote style="border-left:3px solid #2D8C6F;background:#F7F7F5;'
                f'padding:12px 16px;margin:16px 0;color:#37352F;font-size:15px;line-height:1.8;'
                f"font-family:'PingFang SC',sans-serif;\">{content}</blockquote>"
            )
        in_bq, bq = False, []

    for line in lines:
        s = line.strip()
        if s.startswith(">"):
            in_bq = True; bq.append(s.lstrip(">").strip()); continue
        elif in_bq and not s:
            flush_bq(); continue
        elif in_bq:
            flush_bq()

        if not s:
            if in_list: out.append("</ul>"); in_list = False
            continue

        if s.startswith("<IMGPLACEHOLDER"):
            m = re.search(r'alt="([^"]*)" cid="([^"]*)"', s)
            if m:
                alt, cid = m.group(1), m.group(2)
                out.append(
                    f'<div style="text-align:center;margin:24px 0;">'
                    f'<img src="cid:{cid}" alt="{alt}" style="max-width:100%;height:auto;border-radius:6px;">'
                    f"</div>"
                )
            continue

        if s.startswith("## "):
            out.append(
                f'<h2 style="font-size:19px;color:#37352F;font-weight:700;margin:32px 0 12px 0;'
                f'padding-bottom:8px;border-bottom:2px solid #2D8C6F;'
                f"font-family:'PingFang SC',sans-serif;\">{fmt(s[3:])}</h2>"
            )
            continue
        if s.startswith("# "):
            out.append(
                f'<h2 style="font-size:19px;color:#37352F;font-weight:700;margin:32px 0 12px 0;'
                f'padding-bottom:8px;border-bottom:2px solid #2D8C6F;'
                f"font-family:'PingFang SC',sans-serif;\">{fmt(s[2:])}</h2>"
            )
            continue
        if s.startswith("- "):
            if not in_list:
                out.append('<ul style="padding-left:20px;margin:12px 0;">'); in_list = True
            out.append(
                f'<li style="font-size:15px;line-height:1.8;color:#37352F;margin-bottom:8px;'
                f"font-family:'PingFang SC',sans-serif;\">{fmt(s[2:])}</li>"
            )
            continue
        if s == "---":
            if in_list: out.append("</ul>"); in_list = False
            out.append('<hr style="border:none;border-top:1px solid #E3E2E0;margin:28px 0;">')
            continue

        if in_list: out.append("</ul>"); in_list = False
        out.append(
            f'<p style="font-size:15px;line-height:1.9;color:#37352F;margin:0 0 16px 0;'
            f"font-family:'PingFang SC',sans-serif;\">{fmt(s)}</p>"
        )
    if in_list: out.append("</ul>")
    if in_bq: flush_bq()
    body_html = "\n".join(out)

    podcast_note = ""
    if os.path.exists(PODCAST):
        size_kb = os.path.getsize(PODCAST) / 1024
        podcast_note = (
            f'<div style="background:#F0F7F4;border-left:3px solid #2D8C6F;padding:12px 16px;'
            f'margin:24px 0;font-size:14px;color:#37352F;font-family:\'PingFang SC\',sans-serif;">'
            f'🎧 附件：podcast.mp3（单人女声，{size_kb:.0f}KB，约 10 分钟）—— 同一内容的音频版本，通勤可听'
            f'</div>'
        )

    full_html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F7F5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="680" cellpadding="0" cellspacing="0"
  style="background:#FFFFFF;border-radius:8px;max-width:680px;width:100%;">
<tr><td style="padding:36px 40px;">
<h1 style="font-size:24px;color:#37352F;font-weight:700;margin:0 0 8px 0;line-height:1.4;
  font-family:'PingFang SC',sans-serif;">{subject}</h1>
<p style="font-size:13px;color:#787774;margin:0 0 24px 0;
  font-family:'PingFang SC',sans-serif;">{subtitle}</p>
<hr style="border:none;border-top:2px solid #2D8C6F;margin:0 0 28px 0;">
{body_html}
{podcast_note}
<hr style="border:none;border-top:1px solid #E3E2E0;margin:28px 0 16px 0;">
<p style="font-size:12px;color:#787774;text-align:center;margin:0;
  font-family:'PingFang SC',sans-serif;">慕铭 | AI Force 智能体研究员 | 中数智汇</p>
</td></tr></table></td></tr></table></body></html>"""

    preview = os.path.join(BASE, "email_preview.html")
    with open(preview, "w", encoding="utf-8") as f:
        f.write(full_html)

    # MIME 组装：mixed -> related(html+images) + attachment(mp3)
    msg = MIMEMultipart("mixed")
    msg["From"] = cfg["email"]
    msg["To"] = ", ".join(to_list)
    msg["Subject"] = subject
    msg["Date"] = email.utils.formatdate(localtime=True)

    related = MIMEMultipart("related")
    related.attach(MIMEText(full_html, "html", "utf-8"))

    missing = []
    for cid, info in images.items():
        path = os.path.join(BASE, info["src"])
        if not os.path.exists(path):
            found = None
            for root, _, files in os.walk(BASE):
                if info["fn"] in files:
                    found = os.path.join(root, info["fn"]); break
            path = found
        if not path or not os.path.exists(path):
            missing.append(info["fn"]); continue
        with open(path, "rb") as f:
            img = MIMEImage(f.read(), _subtype="png")
            img.add_header("Content-ID", f"<{cid}>")
            img.add_header("Content-Disposition", "inline", filename=info["fn"])
            related.attach(img)
        print(f"[CID] {info['fn']} -> {cid}")
    msg.attach(related)

    # 附件 podcast.mp3
    if os.path.exists(PODCAST):
        with open(PODCAST, "rb") as f:
            part = MIMEBase("audio", "mpeg")
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", 'attachment; filename="podcast_ai-design-replaces-designer.mp3"')
        msg.attach(part)
        print(f"[ATTACH] podcast.mp3 ({os.path.getsize(PODCAST)/1024:.0f}KB)")
    else:
        print("[WARN] podcast.mp3 不存在，邮件将不带音频附件")

    if missing:
        print(f"[WARN] 缺图: {missing}")

    print(f"\n[PREVIEW] {preview}")
    print(f"[TO] {', '.join(to_list)}")
    print(f"[SUBJECT] {subject}")
    print(f"[CID images] {len(images) - len(missing)}\n")

    if args.send:
        with smtplib.SMTP_SSL(cfg["smtp_server"], cfg["smtp_port"]) as server:
            server.login(cfg["email"], cfg["password"])
            server.sendmail(cfg["email"], to_list, msg.as_string())
        print(f"[SENT] → {to_list}")
    elif args.draft:
        with imaplib.IMAP4_SSL(cfg["imap_server"], cfg["imap_port"]) as mail:
            mail.login(cfg["email"], cfg["password"])
            result = mail.append("Drafts", "\\Draft", None, msg.as_bytes())
            ok = "saved" if result[0] == "OK" else "failed"
        print(f"[DRAFT] {ok} → 登录 exmail.qq.com 在草稿箱查看")
    else:
        print("[PREVIEW only] 加 --draft 存草稿 | 加 --send 直接发送")

if __name__ == "__main__":
    main()
