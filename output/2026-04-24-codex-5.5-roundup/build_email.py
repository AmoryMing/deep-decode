#!/usr/bin/env python3
"""构建 HTML 邮件：顶部信息图 CID 内联 + 文章全文 + 播客附件"""
import os, sys, json
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email import encoders

sys.path.insert(0, '/home/super/stuff_AI_force/stuff/muming/.claude/skills/chinadaas-email/scripts')
import yaml
with open('/home/super/stuff_AI_force/stuff/muming/.claude/skills/chinadaas-email/config.yaml') as f:
    CFG = yaml.safe_load(f)

BASE = Path('/home/super/stuff_AI_force/stuff/muming/vault/1-knowledge/ai-frontier/decode/2026-04-24-codex-5.5-roundup')

SUBJECT = '[AI Force 情报] 分叉领先：GPT-5.5 与 Claude Opus 4.7 的一周战事'
TO = ['xuehongtao@chinadaas.com', 'yangshaowei@chinadaas.com']

# ---------- 样式 ----------
STYLE = {
    'body': 'background:#F7F7F5;margin:0;padding:0;font-family:"PingFang SC","Microsoft YaHei",sans-serif;',
    'outer_td': 'padding:32px 16px;',
    'card_td': 'padding:36px 40px;background:#FFFFFF;border-radius:8px;',
    'h1': 'font-size:24px;color:#37352F;font-weight:700;line-height:1.4;margin:0 0 8px 0;',
    'meta': 'font-size:13px;color:#787774;margin:0 0 20px 0;',
    'hr_main': 'border:none;border-top:2px solid #2D8C6F;margin:0 0 24px 0;',
    'hr_sub': 'border:none;border-top:1px solid #E3E2E0;margin:24px 0;',
    'h2': 'font-size:19px;color:#37352F;font-weight:700;padding-bottom:8px;border-bottom:2px solid #2D8C6F;margin:32px 0 16px 0;',
    'p': 'font-size:15px;line-height:1.9;color:#37352F;margin:0 0 16px 0;',
    'p_small': 'font-size:13px;color:#787774;margin:0;line-height:1.7;',
    'strong': 'background:#FFF3E0;padding:1px 5px;border-radius:3px;color:#37352F;',
    'code': 'background:#F5F5F5;padding:2px 5px;border-radius:3px;font-family:"SF Mono",monospace;font-size:13px;',
    'a': 'color:#2D8C6F;text-decoration:none;',
    'blockquote': 'margin:0 0 16px 0;padding:12px 16px;background:#F5F5F5;border-left:3px solid #2D8C6F;font-size:14px;color:#37352F;line-height:1.7;',
    'img_wrap': 'text-align:center;margin:0 0 24px 0;',
    'img': 'max-width:100%;height:auto;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.06);',
    'table': 'border-collapse:collapse;width:100%;margin:0 0 24px 0;font-size:14px;',
    'th': 'background:#F5F5F5;color:#37352F;padding:10px 12px;border:1px solid #E3E2E0;text-align:left;font-weight:700;',
    'td': 'padding:10px 12px;border:1px solid #E3E2E0;color:#37352F;',
    'sig': 'font-size:12px;color:#787774;text-align:center;margin:24px 0 0 0;',
}

# ---------- Markdown → HTML（精简版，专门处理 article.md 结构） ----------
import re

def md_to_html(md_text):
    """把 article.md 正文转成邮件 HTML。跳过 frontmatter 和首行 # 标题（邮件外层已有标题）。"""
    # 去 frontmatter
    if md_text.startswith('---'):
        md_text = md_text.split('---', 2)[2]
    # 去首个 # 标题（邮件已有 h1）
    lines = md_text.strip().split('\n')
    if lines[0].startswith('# '):
        lines = lines[2:] if len(lines) > 1 and lines[1] == '' else lines[1:]
    md_text = '\n'.join(lines)

    # 解析表格
    def render_table(tbl_text):
        rows = [r.strip() for r in tbl_text.strip().split('\n') if r.strip()]
        if len(rows) < 2:
            return tbl_text
        def cells(row):
            return [c.strip() for c in row.strip('|').split('|')]
        header = cells(rows[0])
        body = [cells(r) for r in rows[2:]]  # 跳过分隔线
        out = f'<table style="{STYLE["table"]}">'
        out += '<thead><tr>' + ''.join(f'<th style="{STYLE["th"]}">{inline(c)}</th>' for c in header) + '</tr></thead>'
        out += '<tbody>'
        for r in body:
            out += '<tr>' + ''.join(f'<td style="{STYLE["td"]}">{inline(c)}</td>' for c in r) + '</tr>'
        out += '</tbody></table>'
        return out

    def inline(txt):
        # 行内格式
        txt = re.sub(r'\*\*(.+?)\*\*', rf'<strong style="{STYLE["strong"]}">\1</strong>', txt)
        txt = re.sub(r'`(.+?)`', rf'<code style="{STYLE["code"]}">\1</code>', txt)
        txt = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', rf'<a href="\2" style="{STYLE["a"]}">\1</a>', txt)
        return txt

    html_parts = []
    buf = []
    in_table = False
    tbl_buf = []
    in_quote = False
    quote_buf = []

    def flush_buf():
        if buf:
            text = ' '.join(buf).strip()
            if text:
                html_parts.append(f'<p style="{STYLE["p"]}">{inline(text)}</p>')
            buf.clear()

    def flush_quote():
        if quote_buf:
            text = '<br>'.join(quote_buf)
            html_parts.append(f'<blockquote style="{STYLE["blockquote"]}">{inline(text)}</blockquote>')
            quote_buf.clear()

    for line in md_text.split('\n'):
        ln = line.rstrip()
        # 表格
        if ln.startswith('|'):
            flush_buf(); flush_quote()
            in_table = True
            tbl_buf.append(ln)
            continue
        else:
            if in_table:
                html_parts.append(render_table('\n'.join(tbl_buf)))
                tbl_buf.clear()
                in_table = False

        # 引用
        if ln.startswith('> '):
            flush_buf()
            quote_buf.append(inline(ln[2:]))
            continue
        elif ln.startswith('>'):
            flush_buf()
            quote_buf.append(inline(ln[1:].strip()))
            continue
        else:
            if quote_buf:
                flush_quote()

        # 标题
        if ln.startswith('## '):
            flush_buf()
            html_parts.append(f'<h2 style="{STYLE["h2"]}">{ln[3:].strip()}</h2>')
            continue

        # 水平线
        if ln.strip() == '---':
            flush_buf()
            html_parts.append(f'<hr style="{STYLE["hr_sub"]}">')
            continue

        # 空行 = 分段
        if not ln.strip():
            flush_buf()
            continue

        # 列表项
        if ln.lstrip().startswith(('- ', '* ', '1. ')):
            flush_buf()
            content = re.sub(r'^[-*]\s+', '', ln.lstrip())
            content = re.sub(r'^\d+\.\s+', '', content)
            html_parts.append(f'<p style="{STYLE["p"]};padding-left:16px;"> · {inline(content)}</p>')
            continue

        buf.append(ln)

    flush_buf()
    flush_quote()
    if in_table and tbl_buf:
        html_parts.append(render_table('\n'.join(tbl_buf)))

    return '\n'.join(html_parts)


# ---------- 邮件拼装 ----------
def build_html(article_html, infographic_cid):
    return f'''<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="{STYLE["body"]}">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td align="center" style="{STYLE["outer_td"]}">
    <table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;">
      <tr><td style="{STYLE["card_td"]}">

        <h1 style="{STYLE["h1"]}">分叉领先：GPT-5.5 与 Claude Opus 4.7 的一周战事</h1>
        <p style="{STYLE["meta"]}">AI Force 情报组 · 2026-04-24 · 公开信源 20+ · 约 4500 字</p>
        <hr style="{STYLE["hr_main"]}">

        <p style="{STYLE["p"]}">过去一周 AI 编程工具领域集中发生了几件值得记录的动态，包括 Claude Opus 4.7 GA、Pro 计划订阅档位调整、GPT-5.5 发布以及 Codex 产品形态更新。本篇以公开数据和第三方评测为依据，整理能力分布、订阅架构、产品形态三条线上的变化。顶部为一张摘要信息图，下方为完整观察，附单女声播客音频（约 14 分钟）供通勤时听。</p>

        <div style="{STYLE["img_wrap"]}">
          <img src="cid:{infographic_cid}" style="{STYLE["img"]}" alt="一周战事信息图">
        </div>

        <hr style="{STYLE["hr_sub"]}">

        {article_html}

        <hr style="{STYLE["hr_sub"]}">
        <p style="{STYLE["sig"]}">慕铭 · 智能体研究员 · 中数智汇 AI Force<br>本期情报由自动化管线产出，反馈请直接回复</p>

      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>'''


def main():
    article_md = (BASE / 'article.md').read_text()
    article_html = md_to_html(article_md)
    print(f'[MD] 正文 HTML 长度 {len(article_html)} 字符')

    infographic_cid = 'infographic001'
    html = build_html(article_html, infographic_cid)
    (BASE / 'email_preview.html').write_text(html)
    print(f'[HTML] 写入 email_preview.html ({len(html)} 字符)')

    # 组 MIME
    msg = MIMEMultipart('mixed')
    msg['From'] = CFG['email']
    msg['To'] = ', '.join(TO)
    msg['Subject'] = SUBJECT

    # 邮件主体：alternative 容器里放 HTML
    alt = MIMEMultipart('alternative')
    alt.attach(MIMEText(html, 'html', 'utf-8'))
    msg.attach(alt)

    # CID 内联图（信息图）
    img_path = BASE / 'material/pngs/infographic_gpt.png'
    with open(img_path, 'rb') as f:
        img = MIMEImage(f.read())
        img.add_header('Content-ID', f'<{infographic_cid}>')
        img.add_header('Content-Disposition', 'inline', filename='infographic.png')
        msg.attach(img)

    # 播客附件（使用 64kbps 压缩版，6.6 MB 邮件友好）
    podcast_path = BASE / 'podcast_compact.mp3'
    if podcast_path.exists():
        part = MIMEBase('audio', 'mpeg')
        with open(podcast_path, 'rb') as f:
            part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', 'attachment',
                        filename='2026-04-24-AI编程工具一周观察.mp3')
        msg.attach(part)
        print(f'[MP3] 附件 {podcast_path.stat().st_size/1024:.1f} KB')
    else:
        print('[WARN] podcast.mp3 还没就绪')

    # 写 .eml 本地备份
    eml_path = BASE / 'email.eml'
    with open(eml_path, 'wb') as f:
        f.write(msg.as_bytes())
    print(f'[EML] 本地备份 {eml_path} ({eml_path.stat().st_size/1024:.1f} KB)')

    return msg

def save_to_draft(msg):
    """IMAP APPEND 到腾讯企业邮箱草稿箱"""
    import imaplib, email.utils
    msg['Date'] = email.utils.formatdate(localtime=True)
    with imaplib.IMAP4_SSL(CFG['imap_server'], CFG['imap_port']) as mail:
        mail.login(CFG['email'], CFG['password'])
        result = mail.append('Drafts', '\\Draft', None, msg.as_bytes())
        status = 'saved' if result[0] == 'OK' else 'failed'
    print(f'[DRAFT] {status} · subject={msg["Subject"]} · to={msg["To"]}')
    return status

if __name__ == '__main__':
    import sys
    msg = main()
    if len(sys.argv) > 1 and sys.argv[1] == 'draft':
        save_to_draft(msg)
