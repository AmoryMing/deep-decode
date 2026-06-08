#!/usr/bin/env python3
"""article.md → article.pdf。复用 email 的渲染样式，把 cid: 换成相对图片路径，
用 Chrome headless 打印为 PDF。"""
import os, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ARTICLE = ROOT / "article.md"
PRINT_HTML = ROOT / "article_print.html"
OUT = ROOT / "article.pdf"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

raw = ARTICLE.read_text(encoding="utf-8")


def _fm(key, default=""):
    m = re.search(rf"^{key}:\s*(.+)$", raw, re.MULTILINE)
    return m.group(1).strip().strip('"').strip("'") if m else default


SUBJECT = _fm("title")
AUTHOR = _fm("author")
DATE = _fm("date")
DECODE_TYPE = _fm("type", "decode")
_label = {"decode": "深度拆解", "brief": "情报日报", "practice": "实操手册"}.get(DECODE_TYPE, "深度拆解")
BYLINE = " | ".join([_label] + ([f"原文：{AUTHOR}"] if AUTHOR else []) + ([DATE] if DATE else []))

raw = re.sub(r"^---\n.*?\n---\n", "", raw, flags=re.DOTALL)


def format_inline(t):
    t = re.sub(r"\*\*(.+?)\*\*",
               r'<strong style="background:#FFF3E0;padding:1px 5px;border-radius:3px;color:#37352F;">\1</strong>', t)
    t = re.sub(r"(?<!\*)\*([^\*\n]+?)\*(?!\*)", r'<em style="font-style:italic;color:#37352F;">\1</em>', t)
    t = re.sub(r"`([^`]+)`",
               r'<code style="background:#F5F5F5;padding:2px 5px;border-radius:3px;'
               r"font-family:\'SF Mono\',\'Fira Code\',monospace;font-size:13px;\">\1</code>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" style="color:#2383E2;text-decoration:none;">\1</a>', t)
    return t


def render_table(buf):
    rows = []
    for line in buf:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r"[-:\s]*", c) for c in cells):
            continue
        rows.append(cells)
    if not rows:
        return ""
    h = ['<table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;">']
    h.append("<thead><tr>")
    for c in rows[0]:
        h.append(f'<th style="border:1px solid #E3E2E0;padding:8px 12px;background:#F7F7F5;text-align:left;font-weight:600;">{format_inline(c)}</th>')
    h.append("</tr></thead><tbody>")
    for row in rows[1:]:
        h.append("<tr>")
        for c in row:
            h.append(f'<td style="border:1px solid #E3E2E0;padding:8px 12px;line-height:1.7;">{format_inline(c)}</td>')
        h.append("</tr>")
    h.append("</tbody></table>")
    return "".join(h)


def render_quote(buf):
    content = " ".join(format_inline(l.lstrip(">").strip()) for l in buf if l.strip())
    return ('<blockquote style="margin:16px 0;padding:12px 18px;border-left:4px solid #2383E2;'
            'background:#F7F7F5;font-size:15px;line-height:1.8;color:#37352F;">' + content + "</blockquote>")


lines = raw.strip().split("\n")
parts = []
in_list = in_code = in_table = in_quote = False
code_buf, table_buf, quote_buf = [], [], []


def flush_table():
    global in_table, table_buf
    if in_table:
        parts.append(render_table(table_buf)); table_buf = []; in_table = False


def flush_quote():
    global in_quote, quote_buf
    if in_quote:
        parts.append(render_quote(quote_buf)); quote_buf = []; in_quote = False


def flush_list():
    global in_list
    if in_list:
        parts.append("</ul>"); in_list = False


for line in lines:
    if line.startswith("```"):
        flush_table(); flush_quote(); flush_list()
        if in_code:
            txt = "\n".join(code_buf)
            parts.append(f'<pre style="background:#F5F5F5;padding:14px 16px;border-radius:6px;'
                         f"font-family:'SF Mono','Fira Code',monospace;font-size:13px;line-height:1.6;"
                         f'overflow-x:auto;margin:16px 0;white-space:pre-wrap;word-break:break-all;">'
                         f"<code>{txt}</code></pre>")
            code_buf = []; in_code = False
        else:
            in_code = True
        continue
    if in_code:
        code_buf.append(line.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;"))
        continue
    s = line.strip()
    if not s:
        flush_table(); flush_quote(); flush_list(); continue
    if s.startswith("|") and s.count("|") >= 2:
        flush_quote(); flush_list(); in_table = True; table_buf.append(s); continue
    flush_table()
    if s.startswith(">"):
        flush_list(); in_quote = True; quote_buf.append(s); continue
    flush_quote()
    # 图片：直接用相对路径，Chrome headless 打印时本地能加载
    m = re.match(r"!\[([^\]]*)\]\(([^)]+)\)", s)
    if m:
        flush_list()
        alt, src = m.group(1), m.group(2)
        # 用绝对 file:// 确保可解析
        abs_src = (ROOT / src).resolve()
        parts.append(f'<div style="text-align:center;margin:24px 0;page-break-inside:avoid;">'
                     f'<img src="file://{abs_src}" alt="{alt}" '
                     f'style="max-width:100%;height:auto;border-radius:6px;"></div>')
        continue
    if s.startswith("## "):
        parts.append(f'<h2 style="font-size:19px;font-weight:700;margin:32px 0 12px 0;'
                     f'padding-bottom:8px;border-bottom:2px solid #2383E2;page-break-after:avoid;">'
                     f'{format_inline(s[3:])}</h2>')
        continue
    if s.startswith("- "):
        if not in_list:
            parts.append('<ul style="padding-left:20px;margin:12px 0;">'); in_list = True
        parts.append(f'<li style="font-size:15px;line-height:1.8;margin-bottom:8px;">{format_inline(s[2:])}</li>')
        continue
    if s == "---":
        flush_list()
        parts.append('<hr style="border:none;border-top:1px solid #E3E2E0;margin:28px 0;">')
        continue
    flush_list()
    parts.append(f'<p style="font-size:15px;line-height:1.9;margin:0 0 16px 0;">{format_inline(s)}</p>')

flush_table(); flush_quote(); flush_list()

body = "\n".join(parts)
html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@page {{ size: A4; margin: 18mm 16mm; }}
body {{ font-family: 'PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;
       color:#37352F; max-width:720px; margin:0 auto; padding:0 8px; }}
h1 {{ font-size:26px; font-weight:700; line-height:1.4; margin:0 0 8px 0; }}
.byline {{ font-size:13px; color:#787774; margin:0 0 18px 0; }}
img {{ max-width:100%; height:auto; }}
hr.head {{ border:none; border-top:2px solid #2383E2; margin:0 0 24px 0; }}
</style></head><body>
<h1>{SUBJECT}</h1>
<p class="byline">{BYLINE}</p>
<hr class="head">
{body}
<hr style="border:none;border-top:1px solid #E3E2E0;margin:28px 0 12px 0;">
<p style="font-size:12px;color:#787774;text-align:center;">慕铭 | AI Force 智能体研究员 | 中数智汇</p>
</body></html>"""

PRINT_HTML.write_text(html, encoding="utf-8")
print(f"[html] {PRINT_HTML}")

# Chrome headless 打印 PDF
cmd = [
    CHROME,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    "--virtual-time-budget=10000",
    f"--print-to-pdf={OUT}",
    f"file://{PRINT_HTML}",
]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode != 0 or not OUT.exists():
    print(r.stderr); sys.exit(1)
print(f"[OK] {OUT}  {OUT.stat().st_size/1e6:.2f}MB")
