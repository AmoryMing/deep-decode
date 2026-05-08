#!/usr/bin/env python3
"""
微信公众号草稿发布器
读取 markdown + 同目录 PNG → 转微信内联 HTML → 上传图片 → 创建草稿

用法:
    python3 wechat_publish.py <markdown_file> [--publish]

默认只创建草稿（出现在公众号后台草稿箱）。加 --publish 尝试直接发布（需认证号）。
"""

import os
import re
import sys
import json
import time
import requests
from pathlib import Path

# ---- 配置 ----
APPID = "wx81072788e1c3e892"
APPSECRET = "b145b215bf1b31b422d9dc5647b64da2"
API_BASE = "https://api.weixin.qq.com/cgi-bin"

# ---- Token 管理 ----
_token_cache = {"token": None, "expires": 0}

def get_token():
    now = time.time()
    if _token_cache["token"] and now < _token_cache["expires"]:
        return _token_cache["token"]

    r = requests.get(f"{API_BASE}/token", params={
        "grant_type": "client_credential",
        "appid": APPID,
        "secret": APPSECRET
    }).json()

    if "access_token" not in r:
        raise Exception(f"获取 token 失败: {r}")

    _token_cache["token"] = r["access_token"]
    _token_cache["expires"] = now + r.get("expires_in", 7200) - 300
    print(f"[token] 获取成功，有效期 {r.get('expires_in', 7200)}s")
    return _token_cache["token"]


# ---- 图片上传 ----
def upload_article_image(filepath):
    """上传文章内嵌图片，返回微信 CDN URL（不占素材配额）"""
    token = get_token()
    with open(filepath, "rb") as f:
        r = requests.post(
            f"{API_BASE}/media/uploadimg?access_token={token}",
            files={"media": (os.path.basename(filepath), f, "image/png")}
        ).json()

    if "url" not in r:
        raise Exception(f"上传图片失败 {filepath}: {r}")

    print(f"[图片] {os.path.basename(filepath)} -> {r['url'][:60]}...")
    return r["url"]


def upload_cover_image(filepath):
    """上传封面图（永久素材），返回 media_id"""
    token = get_token()
    with open(filepath, "rb") as f:
        r = requests.post(
            f"{API_BASE}/material/add_material?access_token={token}&type=image",
            files={"media": (os.path.basename(filepath), f, "image/png")}
        ).json()

    if "media_id" not in r:
        raise Exception(f"上传封面失败 {filepath}: {r}")

    print(f"[封面] {os.path.basename(filepath)} -> media_id={r['media_id'][:20]}...")
    return r["media_id"]


# ---- Markdown → 微信 HTML ----
def md_to_wechat_html(md_text, image_url_map):
    """
    简易 Markdown → 微信内联样式 HTML 转换器

    微信会剥除所有 <style> 和 class，必须内联样式。
    """
    lines = md_text.split("\n")
    html_parts = []
    in_blockquote = False
    in_code_block = False
    code_lines = []

    for line in lines:
        # 跳过 frontmatter
        if line.strip() == "---":
            continue
        if line.startswith("title:") or line.startswith("source:") or line.startswith("author:") or line.startswith("date:") or line.startswith("decoded:") or line.startswith("tags:"):
            continue

        # 代码块
        if line.strip().startswith("```"):
            if in_code_block:
                code_html = "\n".join(code_lines)
                html_parts.append(
                    f'<pre style="background:#1e1e1e;color:#d4d4d4;padding:16px;border-radius:8px;'
                    f'font-size:13px;line-height:1.6;overflow-x:auto;margin:16px 0;">'
                    f'<code>{code_html}</code></pre>'
                )
                code_lines = []
                in_code_block = False
            else:
                in_code_block = True
            continue

        if in_code_block:
            code_lines.append(line.replace("<", "&lt;").replace(">", "&gt;"))
            continue

        # 空行
        if not line.strip():
            if in_blockquote:
                in_blockquote = False
            html_parts.append("")
            continue

        # 图片
        img_match = re.match(r'!\[(.*?)\]\((.*?)\)', line.strip())
        if img_match:
            alt, src = img_match.groups()
            url = image_url_map.get(src, src)
            html_parts.append(
                f'<p style="text-align:center;margin:20px 0;">'
                f'<img src="{url}" alt="{alt}" style="max-width:100%;border-radius:6px;" />'
                f'</p>'
            )
            if alt:
                html_parts.append(
                    f'<p style="text-align:center;font-size:13px;color:#999;margin-top:-12px;margin-bottom:20px;">{alt}</p>'
                )
            continue

        # 引用块
        if line.strip().startswith("> "):
            text = process_inline(line.strip()[2:])
            html_parts.append(
                f'<blockquote style="border-left:4px solid #2383E2;padding:12px 16px;'
                f'margin:16px 0;background:#f7f9fc;color:#555;font-size:15px;line-height:1.8;">'
                f'{text}</blockquote>'
            )
            continue

        # 标题
        h_match = re.match(r'^(#{1,4})\s+(.*)', line)
        if h_match:
            level = len(h_match.group(1))
            text = process_inline(h_match.group(2))
            styles = {
                1: "font-size:24px;font-weight:bold;color:#37352F;margin:32px 0 16px;border-bottom:2px solid #2383E2;padding-bottom:8px;",
                2: "font-size:20px;font-weight:bold;color:#37352F;margin:28px 0 12px;",
                3: "font-size:17px;font-weight:bold;color:#37352F;margin:24px 0 10px;",
                4: "font-size:16px;font-weight:bold;color:#555;margin:20px 0 8px;",
            }
            html_parts.append(f'<h{level} style="{styles[level]}">{text}</h{level}>')
            continue

        # 表格行 - 跳过分隔行
        if re.match(r'^\|[\s\-:]+\|', line):
            continue

        # 表格
        if line.strip().startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            row_html = "".join(
                f'<td style="border:1px solid #e8e8e8;padding:8px 12px;font-size:14px;line-height:1.6;">'
                f'{process_inline(c)}</td>' for c in cells
            )
            html_parts.append(f'<tr>{row_html}</tr>')
            continue

        # 普通段落
        text = process_inline(line.strip())
        if text.startswith("- ") or text.startswith("* "):
            bullet_text = text[2:]
            html_parts.append(
                f'<p style="font-size:15px;line-height:1.8;color:#37352F;margin:4px 0 4px 20px;">'
                f'<span style="color:#2383E2;margin-right:8px;">&#9679;</span>{bullet_text}</p>'
            )
        else:
            html_parts.append(
                f'<p style="font-size:15px;line-height:1.8;color:#37352F;margin:10px 0;">{text}</p>'
            )

    # 包装表格
    result = "\n".join(html_parts)
    result = re.sub(
        r'(<tr>.*?</tr>(\s*<tr>.*?</tr>)*)',
        lambda m: f'<table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;">'
                  f'{m.group(0)}</table>',
        result,
        flags=re.DOTALL
    )

    return result


def process_inline(text):
    """处理行内格式：粗体、行内代码、链接"""
    # 粗体
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong style="color:#37352F;">\1</strong>', text)
    # 行内代码
    text = re.sub(r'`([^`]+)`',
        r'<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-size:13px;color:#EB5757;">\1</code>',
        text)
    # 链接
    text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a style="color:#2383E2;text-decoration:none;" href="\2">\1</a>', text)
    # wikilink (Obsidian) - 转纯文本
    text = re.sub(r'\[\[(.*?)\]\]', r'\1', text)
    return text


# ---- 创建草稿 ----
def create_draft(title, html_content, cover_media_id, author="AI 前沿拆解", digest="", source_url=""):
    token = get_token()

    article = {
        "title": title[:64],
        "author": author[:16],
        "content": html_content,
        "thumb_media_id": cover_media_id,
        "need_open_comment": 1,
        "only_fans_can_comment": 0,
    }
    if digest:
        article["digest"] = digest[:128]
    if source_url:
        article["content_source_url"] = source_url

    data = json.dumps({"articles": [article]}, ensure_ascii=False).encode("utf-8")
    r = requests.post(
        f"{API_BASE}/draft/add?access_token={token}",
        data=data,
        headers={"Content-Type": "application/json"}
    ).json()

    if "media_id" not in r:
        raise Exception(f"创建草稿失败: {r}")

    print(f"[草稿] 创建成功! media_id={r['media_id']}")
    return r["media_id"]


def publish_draft(media_id):
    """发布草稿（需认证号权限）"""
    token = get_token()
    r = requests.post(
        f"{API_BASE}/freepublish/submit?access_token={token}",
        json={"media_id": media_id}
    ).json()

    if r.get("errcode", 0) != 0:
        print(f"[发布] 失败（个人号需要手动登录后台发布）: {r}")
        return None

    print(f"[发布] 提交成功! publish_id={r.get('publish_id')}")
    return r.get("publish_id")


# ---- 主流程 ----
def publish_markdown(md_path, do_publish=False):
    md_path = Path(md_path).resolve()
    md_dir = md_path.parent

    print(f"\n{'='*60}")
    print(f"微信公众号草稿发布器")
    print(f"文件: {md_path.name}")
    print(f"目录: {md_dir}")
    print(f"{'='*60}\n")

    # 1. 读取 markdown
    md_text = md_path.read_text(encoding="utf-8")

    # 提取 frontmatter
    title = ""
    source_url = ""
    fm_match = re.search(r'^---\n(.*?)\n---', md_text, re.DOTALL)
    if fm_match:
        fm = fm_match.group(1)
        t = re.search(r'title:\s*(.+)', fm)
        if t:
            title = t.group(1).strip()
        s = re.search(r'source:\s*(.+)', fm)
        if s:
            source_url = s.group(1).strip()

    if not title:
        title = md_path.stem

    print(f"[标题] {title}")

    # 2. 找所有引用的图片（智能查找：先试直接路径，再按文件名在目录树中搜索）
    img_refs = re.findall(r'!\[.*?\]\((.*?)\)', md_text)
    png_files = []
    ref_to_file = {}  # markdown引用路径 → 实际文件路径

    for ref in img_refs:
        # 尝试1：相对于 .md 文件所在目录
        candidate = md_dir / ref
        if candidate.exists():
            png_files.append(candidate)
            ref_to_file[ref] = candidate
            continue

        # 尝试2：按文件名在 .md 目录树中搜索
        fname = Path(ref).name
        found = list(md_dir.rglob(fname))
        if found:
            png_files.append(found[0])
            ref_to_file[ref] = found[0]
            continue

        # 尝试3：相对于 .md 的父目录（decode/ 目录）
        candidate = md_dir.parent / ref
        if candidate.exists():
            png_files.append(candidate)
            ref_to_file[ref] = candidate
            continue

        print(f"[警告] 图片未找到: {ref}")

    print(f"[图片] 找到 {len(png_files)} 张需要上传")

    # 3. 上传图片，建立本地路径→微信URL映射
    image_url_map = {}
    for ref, png in ref_to_file.items():
        # 检查大小
        size_kb = png.stat().st_size / 1024
        if size_kb > 1024:
            print(f"[警告] {png.name} = {size_kb:.0f}KB > 1MB，跳过")
            continue
        url = upload_article_image(str(png))
        # 映射：markdown 里写的相对路径 → 微信 CDN URL（同时映射文件名）
        image_url_map[ref] = url
        image_url_map[png.name] = url

    # 4. 选封面图（第一张，或目录里的封面文件）
    cover_media_id = None
    cover_candidates = list(md_dir.rglob("*封面*.*")) + list(md_dir.rglob("*cover*.*"))
    cover_file = None
    if cover_candidates:
        cover_file = [c for c in cover_candidates if c.suffix.lower() in ('.png', '.jpg', '.jpeg')]
        cover_file = cover_file[0] if cover_file else None

    if not cover_file and png_files:
        cover_file = png_files[0]

    if cover_file:
        cover_media_id = upload_cover_image(str(cover_file))
    else:
        print("[错误] 没有封面图，无法创建草稿。请至少提供一张 PNG。")
        return

    # 5. Markdown → 微信 HTML
    html = md_to_wechat_html(md_text, image_url_map)

    # 过滤微信不支持的标签和属性
    # 外部链接转纯文本（微信对非白名单域名直接拒绝整篇文章，errcode 45166）
    html = re.sub(r'<a [^>]*>(.*?)</a>', r'\1', html)
    html = re.sub(r'</?(?:script|iframe|form|input|textarea|select|button|object|embed|video|audio|canvas|svg|math)[^>]*>', '', html, flags=re.IGNORECASE)
    # 移除 data- 属性、onclick 等事件属性
    html = re.sub(r'\s(?:data-\w+|on\w+)="[^"]*"', '', html)
    # 移除空的 style 属性
    html = re.sub(r'\sstyle="\s*"', '', html)

    # 检查大小
    html_size = len(html.encode("utf-8"))
    print(f"[HTML] 生成完成，大小 {html_size/1024:.1f}KB")
    if html_size > 1024 * 1024:
        print("[错误] HTML 超过 1MB 限制！")
        return

    # 6. 创建草稿
    digest = re.sub(r'<[^>]+>', '', html)[:120].replace('\n', ' ').strip()

    # 微信要求 source_url 必须是有效的 http/https URL，否则传空
    if source_url and not re.match(r'^https?://', source_url):
        print(f"[警告] source_url 无效，已忽略: {source_url[:60]}")
        source_url = ""

    draft_id = create_draft(
        title=title,
        html_content=html,
        cover_media_id=cover_media_id,
        source_url=source_url,
        digest=digest
    )

    # 7. 可选：直接发布
    if do_publish:
        publish_draft(draft_id)
    else:
        print(f"\n[完成] 草稿已创建，登录公众号后台 → 草稿箱 → 点击发布")
        print(f"  https://mp.weixin.qq.com")

    return draft_id


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 wechat_publish.py <markdown_file> [--publish]")
        sys.exit(1)

    md_file = sys.argv[1]
    do_publish = "--publish" in sys.argv

    publish_markdown(md_file, do_publish)
