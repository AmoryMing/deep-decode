"""
把 ~/skillhub 下的 5 个 provider 各自打成 zip(不含 server/)
+ 抽出每个 SKILL.md 的 name/description 暴露在帖子正文里
+ 上传 zip 附件
+ 在论坛 skillhub 分类(id=33) 发 topic,作者 claw-bot-3

幂等性:跑前会查同名 topic 是否已存在(按 frontmatter name),已存在则跳过(v1 不做更新版本逻辑)。
"""
import json
import os
import re
import sys
import time
import zipfile
from pathlib import Path
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
SKILLHUB_CAT_ID = 33
AUTHOR = "claw-bot-3"  # 工具人

# 索引 topic / post id(2026-05-07 建)
INDEX_TOPIC_ID = 385
INDEX_POST_ID = 5668
ABOUT_TOPIC_ID = 376  # "关于虾械库类别"(guidelines),不算 skill

SRC = Path("/home/yaoyu/skillhub")
WORK = Path("/tmp/skillhub_zips")
WORK.mkdir(exist_ok=True)

ADMIN = {"Api-Key": API_KEY, "Api-Username": "system"}
BOT = {"Api-Key": API_KEY, "Api-Username": AUTHOR}

# 5 个 provider:provider_dir → (forum slug, version, "domain · 一句话")
# 改过 SKILL/spec/README 的 zip 内容 → 把 version 升一级,跑脚本时会自动发新版本 reply + 编辑首楼
PROVIDERS = [
    ("t2i/flux",          "flux-gen",        "0.2.0", "FLUX.1 HTTP API,Mac M3 Ultra,LoRA 加载,摄影级真实感"),
    ("t2i/sensenova-u1",  "sensenova-u1",    "0.2.0", "商汤 SenseNova U1 多模态:t2i / edit / vqa / interleave 四合一"),
    ("tts/voxcpm2",       "voxcpm2",         "0.2.0", "VoxCPM2 TTS,Mac MPS,2B 参数 48kHz 30 语种(实测 warm RTF 1.27)"),
    ("tts/cosyvoice2",    "cosyvoice2",      "0.2.0", "CosyVoice 2 TTS,Strix Halo ROCm,5 语种 24kHz + instruct mode + 音色注册"),
    ("video",             "video-pipeline",  "0.2.0", "视频合成流水线:编排 t2i(HTTP)+ tts + ffmpeg,产出带语音字幕的短片"),
]

FRONTMATTER_RE = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)

def parse_skill_md(path):
    """从一个 SKILL.md 抽 name 和 description"""
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    fm = m.group(1)
    name = re.search(r'^name:\s*(.+)$', fm, re.MULTILINE)
    desc = re.search(r'^description:\s*(.+)$', fm, re.MULTILINE)
    return {
        "name": name.group(1).strip() if name else path.parent.name,
        "description": desc.group(1).strip().strip('"').strip("'") if desc else "(无 description)"
    }

def collect_skills(provider_dir):
    """列出 provider 下所有 SKILL.md 的元数据"""
    skills = []
    for sk in sorted(provider_dir.rglob("SKILL.md")):
        meta = parse_skill_md(sk)
        if meta:
            meta["rel_path"] = str(sk.relative_to(provider_dir))
            skills.append(meta)
    return skills

def build_zip(provider_dir, slug, version):
    """打包 provider 目录(排除 server/),保留 spec.md / skills/ / README.md(如有)"""
    zip_path = WORK / f"{slug}-v{version}.zip"
    zip_path.unlink(missing_ok=True)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for p in provider_dir.rglob("*"):
            if not p.is_file():
                continue
            rel = p.relative_to(provider_dir)
            # 排除 server/、.git/、__pycache__、隐藏文件
            parts = rel.parts
            if "server" in parts or ".git" in parts or "__pycache__" in parts:
                continue
            if any(part.startswith(".") for part in parts):
                continue
            z.write(p, arcname=f"{slug}/{rel}")
    return zip_path

def upload_zip(zip_path):
    with zip_path.open("rb") as f:
        files = {"files[]": (zip_path.name, f, "application/zip")}
        data = {"type": "composer", "synchronous": "true"}
        r = requests.post(f"{BASE}/uploads.json", headers=BOT, data=data, files=files, timeout=60)
    if r.status_code not in (200, 204):
        print(f"  ❌ upload failed: {r.status_code} {r.text[:300]}")
        r.raise_for_status()
    return r.json()

def find_existing_topic(slug):
    """检查 skillhub 分类下是否已有同 slug 的 topic(简单按标题包含 [slug] 判)"""
    r = requests.get(f"{BASE}/c/{SKILLHUB_CAT_ID}.json", headers=ADMIN, timeout=15)
    r.raise_for_status()
    for t in r.json().get("topic_list", {}).get("topics", []):
        if f"[{slug}]" in t.get("title", ""):
            return t["id"]
    return None

def fetch_topic_first_post(topic_id):
    """返回 (post_id, raw_markdown)"""
    tr = requests.get(f"{BASE}/t/{topic_id}.json", headers=ADMIN, timeout=15)
    tr.raise_for_status()
    post_id = tr.json()["post_stream"]["posts"][0]["id"]
    pr = requests.get(f"{BASE}/posts/{post_id}.json", headers=ADMIN, timeout=15)
    pr.raise_for_status()
    return post_id, pr.json().get("raw", "")

def parse_version_from_raw(raw):
    """从 frontmatter 抠 version 字段"""
    m = FRONTMATTER_RE.match(raw)
    if not m:
        return None
    vm = re.search(r'^version:\s*(.+)$', m.group(1), re.MULTILINE)
    return vm.group(1).strip().strip('"').strip("'") if vm else None

def version_tuple(v):
    """semver compare-friendly tuple"""
    try:
        return tuple(int(x) for x in v.split("."))
    except Exception:
        return (0,)

def update_first_post(post_id, old_raw, new_version, new_oneliner, upload, slug, skills):
    """编辑第 1 楼:用本地最新数据更新 frontmatter version/description、H1、SKILL 表、下载块。其他段落不动。"""
    # 1) frontmatter version
    new_raw = re.sub(r'^version:\s*.+$', f'version: {new_version}', old_raw, count=1, flags=re.MULTILINE)
    # 2) frontmatter description
    new_raw = re.sub(r'^description:\s*.+$', f'description: {new_oneliner}', new_raw, count=1, flags=re.MULTILINE)
    # 3) H1 oneliner
    new_raw = re.sub(rf'^# {re.escape(slug)} · .+$', f'# {slug} · {new_oneliner}', new_raw, count=1, flags=re.MULTILINE)
    # 4) 重建 SKILL 表(从本地最新 SKILL.md 抽 frontmatter)
    rows = "\n".join(f"| `{s['name']}` | {s['description']} |" for s in skills) if skills else "| (无) | (本 provider 暂无 SKILL.md) |"
    new_table = f"## 包含的 SKILL(s)\n\n虾搜索时直接命中下表里的 `name` 或 `description`。\n\n| name | description |\n|---|---|\n{rows}\n\n---"
    new_raw = re.sub(r'## 包含的 SKILL\(s\).*?\n---', new_table, new_raw, count=1, flags=re.DOTALL)
    # 5) 在 ## 下载 块的列表顶部插入新版本行(去掉旧 "(最新)")
    new_line = f"- v{new_version} (最新): [{slug}-v{new_version}.zip]({upload['short_url']}) ({upload['human_filesize']})"
    new_raw = re.sub(r'^- (v[\d.]+) \(最新\):', r'- \1:', new_raw, flags=re.MULTILINE)
    new_raw = re.sub(r'(## 下载\s*\n\s*\n)', rf'\1{new_line}\n', new_raw, count=1)
    # 6) unzip 命令文件名跟新
    new_raw = re.sub(rf'unzip {re.escape(slug)}-v[\d.]+\.zip', f'unzip {slug}-v{new_version}.zip', new_raw)

    r = requests.put(f"{BASE}/posts/{post_id}.json",
                     headers={**BOT, "Content-Type":"application/json"},
                     json={"post": {"raw": new_raw, "edit_reason": f"upload v{new_version}"}},
                     timeout=30)
    if r.status_code not in (200, 204):
        print(f"    ❌ 编辑首楼失败: {r.status_code} {r.text[:300]}")
        r.raise_for_status()

def post_reply(topic_id, body, max_retries=5):
    """对 topic 发回帖"""
    payload = {"topic_id": topic_id, "raw": body}
    for attempt in range(max_retries):
        r = requests.post(f"{BASE}/posts.json", headers={**BOT, "Content-Type":"application/json"},
                          json=payload, timeout=30)
        if r.status_code in (200, 204):
            return r.json()
        if r.status_code == 429:
            try: wait = r.json().get("extras", {}).get("wait_seconds", 10)
            except Exception: wait = 10
            wait = max(wait + 2, 5)
            print(f"    ⏸  429 等 {wait}s")
            time.sleep(wait)
            continue
        print(f"    ❌ reply 失败: {r.status_code} {r.text[:300]}")
        r.raise_for_status()
    raise RuntimeError("post_reply 超过 max_retries")

def publish_new_version(topic_id, provider_dir, slug, new_version, oneliner, skills, upload):
    """发新版本 reply + 编辑第 1 楼。"""
    # 1) reply
    contains = "\n".join(f"  - `{s['name']}` — {s['description']}" for s in skills) if skills else "  - (无 SKILL.md)"
    reply_body = f"""## v{new_version} — {time.strftime("%Y-%m-%d")}

### 改动
*(改动细节见上游仓库 git log;本帖描述/版本/下载链接已自动同步到第 1 楼)*

### 当前定位
{oneliner}

### 包含的 SKILL(s)
{contains}

### 下载

[{slug}-v{new_version}.zip]({upload['short_url']}) ({upload['human_filesize']})
"""
    rep = post_reply(topic_id, reply_body)
    print(f"    ✅ 发了 reply,post_id={rep.get('id')}")
    # 2) 编辑第 1 楼
    post_id, raw = fetch_topic_first_post(topic_id)
    update_first_post(post_id, raw, new_version, oneliner, upload, slug, skills)
    print(f"    ✅ 已编辑首楼:version → {new_version},description / SKILL 表 / 下载链接全部跟新")

def build_post_body(provider_dir, slug, version, oneliner, skills, upload):
    """生成 topic 第 1 楼 markdown"""
    # SKILLs 表
    rows = []
    for s in skills:
        rows.append(f"| `{s['name']}` | {s['description']} |")
    skills_table = (
        "| name | description |\n|---|---|\n" + "\n".join(rows)
    ) if skills else "(本 provider 暂无 SKILL.md)"

    # spec 摘要(取前 800 字)
    spec_path = provider_dir / "spec.md"
    spec_excerpt = ""
    if spec_path.exists():
        spec_text = spec_path.read_text(encoding="utf-8")
        body = re.sub(FRONTMATTER_RE, "", spec_text)
        spec_excerpt = body.strip()[:1200]
        if len(body.strip()) > 1200:
            spec_excerpt += "\n\n*(spec.md 截断,完整内容见 zip)*"

    # 拼正文
    return f"""---
name: {slug}
version: {version}
description: {oneliner}
author: "@{AUTHOR}"
license: MIT
depends_on: []
---

# {slug} · {oneliner}

> 内网 provider。SKILL.md 直接装到龙虾,服务跑在内网指定机器,装了就能调。

## 包含的 SKILL(s)

虾搜索时直接命中下表里的 `name` 或 `description`。

{skills_table}

---

## spec 摘要

{spec_excerpt}

---

## 下载

- v{version}: [{slug}-v{version}.zip]({upload['short_url']}) ({upload['human_filesize']})

解压后把 `skills/<skill-name>/` 软链或复制到你的 clawhub:

```bash
unzip {slug}-v{version}.zip
ln -s $(pwd)/{slug}/skills/<skill-name> ~/.openclaw/clawhub/<skill-name>
```

## 说明

- 不含 server/ 源码(内网部署,不复用),只发 SKILL.md + spec.md
- 调用前确认你能访问内网机器(看 spec 摘要里的 host:port)
- 改进/反馈:本帖下方 reply 即可
"""

def post_topic(title, body, max_retries=5):
    payload = {
        "title": title,
        "category": SKILLHUB_CAT_ID,
        "raw": body,
    }
    for attempt in range(max_retries):
        r = requests.post(f"{BASE}/posts.json", headers={**BOT, "Content-Type":"application/json"},
                          json=payload, timeout=30)
        if r.status_code in (200, 204):
            return r.json()
        if r.status_code == 429:
            try:
                wait = r.json().get("extras", {}).get("wait_seconds", 10)
            except Exception:
                wait = 10
            wait = max(wait + 2, 5)
            print(f"  ⏸  429 限频,等 {wait}s 重试 (attempt {attempt+1}/{max_retries})")
            time.sleep(wait)
            continue
        print(f"  ❌ post failed: {r.status_code} {r.text[:500]}")
        r.raise_for_status()
    raise RuntimeError(f"post_topic 重试 {max_retries} 次仍失败")

def fetch_skill_topics():
    """扫 cat 33 里所有 topic,对每个非 about/index 的 topic,GET 详情解 frontmatter + SKILL 表"""
    r = requests.get(f"{BASE}/c/{SKILLHUB_CAT_ID}.json", headers=ADMIN, timeout=15)
    r.raise_for_status()
    topics = r.json().get("topic_list", {}).get("topics", [])
    skills = []
    for t in topics:
        if t["id"] in (ABOUT_TOPIC_ID, INDEX_TOPIC_ID):
            continue
        try:
            # /t/{id}.json 不返 raw,先拿 post_id 再 /posts/{id}.json
            tr = requests.get(f"{BASE}/t/{t['id']}.json", headers=ADMIN, timeout=15)
            tr.raise_for_status()
            post_meta = tr.json()["post_stream"]["posts"][0]
            post_id = post_meta["id"]
            pr = requests.get(f"{BASE}/posts/{post_id}.json", headers=ADMIN, timeout=15)
            pr.raise_for_status()
            raw = pr.json().get("raw", "")
            fm_match = FRONTMATTER_RE.match(raw)
            if not fm_match:
                continue
            fm_text = fm_match.group(1)
            def fm_get(key, default=""):
                m = re.search(rf'^{key}:\s*(.+)$', fm_text, re.MULTILINE)
                return m.group(1).strip().strip('"').strip("'") if m else default
            # 解 SKILL 表(Markdown table 行 | `name` | description |)
            inner_skills = []
            for m in re.finditer(r'\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|\s*$', raw, re.MULTILINE):
                inner_skills.append({"name": m.group(1), "description": m.group(2)})
            # 解 zip short_url(从下载块的 markdown link)
            zip_url = ""
            zip_match = re.search(r'\(upload://[A-Za-z0-9]+\.zip\)', raw)
            if zip_match:
                zip_url = zip_match.group(0).strip("()")
            skills.append({
                "topic_id": t["id"],
                "title": t["title"],
                "name": fm_get("name", t["title"]),
                "version": fm_get("version", "?"),
                "description": fm_get("description", ""),
                "author": fm_get("author", ""),
                "license": fm_get("license", "MIT"),
                "depends_on": fm_get("depends_on", "[]"),
                "skills": inner_skills,
                "zip": zip_url,
            })
        except Exception as e:
            print(f"  ⚠️  跳过 topic {t['id']} ({t['title']}): {e}")
    return skills

def render_index_md(items):
    """生成索引 topic 的 markdown 内容"""
    import datetime
    ts = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    n_provider = len(items)
    n_skills = sum(len(it["skills"]) for it in items)
    out = [
        "# 虾械库 · 全量 skill 目录",
        "",
        f"> 自动维护(`upload_skills.py` 每次跑都重写),最后更新 **{ts}**。",
        f"> 本帖统计:**{n_provider} provider · {n_skills} skill**",
        ">",
        f"> Agent 用法:`GET {BASE}/t/{INDEX_TOPIC_ID}.json` → 取 `.post_stream.posts[0].raw`,正文是这份结构化 markdown。",
        ">",
        "> 字段约定:每个 provider 一段 H3,frontmatter 字段都是平的 `- **key**: value`。`contains` 段是该 provider 内的 SKILL.md 列表。",
        "",
        "---",
        "",
    ]
    for it in items:
        out.append(f"### {it['name']} `{it['version']}`")
        out.append(f"- **description**: {it['description']}")
        out.append(f"- **topic**: [/t/{it['topic_id']}]({BASE}/t/{it['topic_id']})")
        if it.get("zip"):
            out.append(f"- **zip**: `{it['zip']}` (相对 {BASE}/uploads/short-url/...zip)")
        out.append(f"- **author**: {it['author']}")
        out.append(f"- **license**: {it['license']}")
        out.append(f"- **depends_on**: {it['depends_on']}")
        if it["skills"]:
            out.append(f"- **contains** ({len(it['skills'])} skill{'s' if len(it['skills'])>1 else ''}):")
            for sk in it["skills"]:
                out.append(f"  - `{sk['name']}` — {sk['description']}")
        out.append("")
    return "\n".join(out)

def rebuild_index():
    print("\n=== 重建索引帖 ===")
    items = fetch_skill_topics()
    print(f"  扫到 {len(items)} 个 skill provider")
    body = render_index_md(items)
    r = requests.put(f"{BASE}/posts/{INDEX_POST_ID}.json",
                     headers={**BOT, "Content-Type":"application/json"},
                     json={"post": {"raw": body, "edit_reason": "auto rebuild from upload_skills.py"}},
                     timeout=30)
    if r.status_code not in (200, 204):
        print(f"  ❌ 索引更新失败: {r.status_code} {r.text[:300]}")
        r.raise_for_status()
    print(f"  ✅ 索引已更新: {BASE}/t/{INDEX_TOPIC_ID}")

def main():
    print(f"目标分类: skillhub (id={SKILLHUB_CAT_ID}), 作者: {AUTHOR}")
    print(f"工作目录: {WORK}\n")

    for rel, slug, version, oneliner in PROVIDERS:
        provider_dir = SRC / rel
        if not provider_dir.exists():
            print(f"⚠️  跳过 {slug}: {provider_dir} 不存在")
            continue

        print(f"=== {slug} (target v{version}) ===")
        skills = collect_skills(provider_dir)

        existing = find_existing_topic(slug)
        if existing:
            # 查现有版本
            _, raw = fetch_topic_first_post(existing)
            cur_ver = parse_version_from_raw(raw)
            print(f"  forum 现有 topic id={existing},version={cur_ver}")
            if cur_ver and version_tuple(cur_ver) >= version_tuple(version):
                print(f"  ⏭️  forum 版本 {cur_ver} ≥ 目标 {version},跳过")
                continue
            print(f"  ↗️  升级 {cur_ver} → {version}")
            zip_path = build_zip(provider_dir, slug, version)
            print(f"    打包: {zip_path.name} ({zip_path.stat().st_size} bytes)")
            upload = upload_zip(zip_path)
            print(f"    上传: short_url={upload['short_url']}")
            publish_new_version(existing, provider_dir, slug, version, oneliner, skills, upload)
            time.sleep(8)
            continue

        # 全新发布
        print(f"  发现 {len(skills)} 个 SKILL.md: {[s['name'] for s in skills]}")
        zip_path = build_zip(provider_dir, slug, version)
        print(f"  打包: {zip_path.name} ({zip_path.stat().st_size} bytes)")
        upload = upload_zip(zip_path)
        print(f"  上传: short_url={upload['short_url']}")
        title = f"[{slug}] · {oneliner}"
        body = build_post_body(provider_dir, slug, version, oneliner, skills, upload)
        result = post_topic(title, body)
        topic_id = result.get("topic_id")
        print(f"  ✅ 发帖: topic_id={topic_id} url={BASE}/t/{topic_id}")
        time.sleep(8)

    rebuild_index()
    print("\n全部完成。")

if __name__ == "__main__":
    main()
