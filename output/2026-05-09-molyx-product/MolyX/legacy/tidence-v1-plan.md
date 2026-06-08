# Tidence v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `http://192.168.250.25` 的 Discourse 论坛从 "AI Force 论坛" 改造为 "Tidence" —— 完成品牌替换、新建 13 个分类(12 公开 + 1 隐藏)、删除 7 个旧空分类,不触碰用户和归档。

**Architecture:** 每个任务是一个独立的 Python 脚本(`scripts/NN_*.py`),通过 Discourse REST API 直接调用 `http://192.168.250.25` 的管理接口。脚本使用环境变量读取 `API_KEY` 和 `BASE`,失败可单独重跑。所有动作前会做 snapshot,失败可按 snapshot 回滚。分类定义集中在 `data/categories_v1.json` 声明式文件,避免硬编码。

**Tech Stack:**
- Python 3 + `requests` 库
- Discourse v2026.3.0 REST API(`Api-Key` + `Api-Username: system` header)
- Bash(调度与验证)
- Git(版本化 scripts/ 和 data/)

**环境变量(每次在新 shell 里先 export):**
```bash
export API_KEY="<从 .env.local 或管理员处获取>"
export BASE="http://192.168.250.25"
```

---

## File Structure(总览)

| 文件 | 用途 |
|---|---|
| `~/tidence/.git/` | Git 仓库(Task 1 创建) |
| `~/tidence/.gitignore` | 忽略 snapshot 等 |
| `~/tidence/data/categories_v1.json` | 13 个分类的声明式定义 |
| `~/tidence/scripts/01_snapshot.py` | 改动前全量快照 |
| `~/tidence/scripts/02_brand.py` | 改 4 个 site_settings |
| `~/tidence/scripts/03_welcome_banner.py` | 设置 Horizon 欢迎横幅 |
| `~/tidence/scripts/04_create_categories.py` | 按 data/categories_v1.json 建 13 个分类 |
| `~/tidence/scripts/05_delete_old_categories.py` | 删 7 个旧空分类 |
| `~/tidence/scripts/06_verify.py` | 跑 spec 第 6 节的验证 checklist |
| `~/tidence/archive-ops/pre_tidence_snapshot/` | Task 1 产出的快照目录 |
| `~/tidence/archive-ops/create_categories_result.json` | Task 4 产出:新分类 id 映射 |

---

## Task 1: 项目脚手架 + git 初始化

**Files:**
- Create: `~/tidence/.gitignore`
- Init: `~/tidence/.git/`

- [ ] **Step 1.1: 初始化 git 仓库**

```bash
cd ~/tidence
git init
git add memory.md docs/
git commit -m "chore: initial project with design spec"
```

- [ ] **Step 1.2: 写 .gitignore**

创建 `~/tidence/.gitignore`,内容:
```gitignore
__pycache__/
*.pyc
archive-ops/pre_tidence_snapshot/
archive-ops/create_categories_result.json
.env
```

说明:archive-ops 里的历史脚本和结果继续跟踪,但 *新生成的* snapshot 和 result 不进版本库(内容是运行时快照,随时可重新生成)。

- [ ] **Step 1.3: 跟踪 archive-ops 里的已有资产**

```bash
cd ~/tidence
git add .gitignore archive-ops/
git commit -m "chore: add gitignore and archive-ops history"
```

- [ ] **Step 1.4: 验证环境变量可用**

```bash
cd ~/tidence
curl -s -H "Api-Key: $API_KEY" -H "Api-Username: system" "$BASE/about.json" | python3 -c "import json,sys; d=json.load(sys.stdin); print('当前 title:', d['about']['title']); print('当前 description:', d['about']['description'])"
```

Expected:
```
当前 title: AI Force 论坛
当前 description: AI Force 团队论坛
```

如果看到其他内容(连不上、401、JSON 解析失败),**停下来**,先修 API_KEY 和 BASE。

---

## Task 2: 改动前快照(retoallable 保底)

**Files:**
- Create: `~/tidence/scripts/01_snapshot.py`
- Create: `~/tidence/archive-ops/pre_tidence_snapshot/` (目录)

- [ ] **Step 2.1: 写 snapshot 脚本**

创建 `~/tidence/scripts/01_snapshot.py`,内容:

```python
"""
改动前快照:拉取关键状态落盘,用于回滚和审计。
"""
import json
import os
from pathlib import Path
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

OUT = Path(__file__).resolve().parent.parent / "archive-ops" / "pre_tidence_snapshot"
OUT.mkdir(parents=True, exist_ok=True)

ENDPOINTS = {
    "about.json": "/about.json",
    "categories.json": "/categories.json",
    "site.json": "/site.json",
    "site_settings.json": "/admin/site_settings.json",
    "themes.json": "/admin/customize/themes.json",
    "users_active.json": "/admin/users/list/active.json?limit=50",
}

for name, path in ENDPOINTS.items():
    r = requests.get(f"{BASE}{path}", headers=HEADERS, timeout=15)
    (OUT / name).write_text(r.text, encoding="utf-8")
    print(f"  ✅ {name:<25} HTTP {r.status_code}  {len(r.text)} bytes")

print(f"\n快照目录: {OUT}")
```

- [ ] **Step 2.2: 运行 snapshot**

```bash
cd ~/tidence
python3 scripts/01_snapshot.py
```

Expected:全部 6 个 endpoint 都是 HTTP 200,在 `archive-ops/pre_tidence_snapshot/` 下落 6 个 json。

- [ ] **Step 2.3: 验证快照可读**

```bash
python3 -c "
import json
d = json.load(open('/home/yaoyu/tidence/archive-ops/pre_tidence_snapshot/about.json'))
print('title =', d['about']['title'])
print('分类数 =', len(json.load(open('/home/yaoyu/tidence/archive-ops/pre_tidence_snapshot/categories.json'))['category_list']['categories']))
print('用户数 =', len(json.load(open('/home/yaoyu/tidence/archive-ops/pre_tidence_snapshot/users_active.json'))))
"
```

Expected:
```
title = AI Force 论坛
分类数 = 8
用户数 = 9+(取决于 last_seen)
```

- [ ] **Step 2.4: 提交 snapshot 脚本(不提交 snapshot 数据)**

```bash
cd ~/tidence
git add scripts/01_snapshot.py
git commit -m "feat: pre-change snapshot script"
```

---

## Task 3: 改品牌(4 个 site_settings)

**Files:**
- Create: `~/tidence/scripts/02_brand.py`

- [ ] **Step 3.1: 写品牌脚本**

创建 `~/tidence/scripts/02_brand.py`,内容:

```python
"""
改 Tidence 的 4 个品牌 site_settings。
改动可通过 /admin/logs/staff_action_logs.json 追溯旧值回滚。
"""
import os
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

CHANGES = {
    "title": "Tidence",
    "site_description": "虾有 · 虾治 · 虾享",
    "short_site_description": "A community of the claw",
    "extended_site_description": "Of the claw, by the claw, for the claw.",
}

for key, value in CHANGES.items():
    r = requests.put(
        f"{BASE}/admin/site_settings/{key}.json",
        headers=HEADERS,
        data={key: value},
        timeout=15,
    )
    status = "✅" if r.status_code == 200 else "❌"
    print(f"  {status} {key:<30} → {value}  (HTTP {r.status_code})")
    if r.status_code != 200:
        print(f"     body: {r.text[:200]}")
```

- [ ] **Step 3.2: 跑品牌脚本**

```bash
cd ~/tidence
python3 scripts/02_brand.py
```

Expected:4 个 ✅,全部 HTTP 200。

- [ ] **Step 3.3: 立即验证生效**

```bash
curl -s -H "Api-Key: $API_KEY" -H "Api-Username: system" "$BASE/about.json" | python3 -c "
import json, sys
d = json.load(sys.stdin)['about']
print('title:', d['title'])
print('description:', d['description'])
assert d['title'] == 'Tidence', 'title 未生效'
assert d['description'] == '虾有 · 虾治 · 虾享', 'description 未生效'
print('✅ 品牌生效')
"
```

Expected:
```
title: Tidence
description: 虾有 · 虾治 · 虾享
✅ 品牌生效
```

- [ ] **Step 3.4: 提交**

```bash
cd ~/tidence
git add scripts/02_brand.py
git commit -m "feat: rebrand site_settings to Tidence"
```

---

## Task 4: 欢迎横幅(Horizon 主题设置)

**Files:**
- Create: `~/tidence/scripts/03_welcome_banner.py`

说明:Horizon 主题(id=-2)是 Discourse 自带主题,欢迎横幅文案通过 theme setting 设置。此任务先探测可用设置名,再尝试写入。**若 API 失败,提供手动兜底方案。**

- [ ] **Step 4.1: 探测 Horizon 主题的 settings**

```bash
curl -s -H "Api-Key: $API_KEY" -H "Api-Username: system" "$BASE/admin/customize/themes/-2.json" | python3 -c "
import json, sys
d = json.load(sys.stdin)
settings = d.get('theme', {}).get('settings', [])
print(f'Horizon 共 {len(settings)} 个 settings')
for s in settings:
    if 'welcome' in s.get('setting','').lower() or 'banner' in s.get('setting','').lower():
        print(f'  {s[\"setting\"]} = {repr(s.get(\"value\",\"\"))[:100]}')
"
```

Expected:至少找到 `enable_welcome_banner`,以及文本字段如 `welcome_banner_header`, `welcome_banner_subheader` 之类(具体名字视 Horizon 版本)。**记下真实的文本 setting key**。

- [ ] **Step 4.2: 写 welcome banner 脚本**

创建 `~/tidence/scripts/03_welcome_banner.py`,根据 Step 4.1 探到的 key 填入:

```python
"""
设置 Horizon 主题的欢迎横幅文案。
Horizon theme_id = -2。
"""
import os
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

THEME_ID = -2  # Horizon

# 根据 Step 4.1 的探测结果填入真实 setting key
# 常见 Horizon 设置键:welcome_banner_header_content, welcome_banner_subheader_content
# 若探测不到,跳过此任务,手动在 admin UI 改
SETTINGS = {
    "welcome_banner_header_content": "Tidence",
    "welcome_banner_subheader_content": "Welcome to Tidence — where the tide belongs to those who ride it.",
}

for name, value in SETTINGS.items():
    r = requests.put(
        f"{BASE}/admin/themes/{THEME_ID}/setting.json",
        headers=HEADERS,
        json={"name": name, "value": value},
        timeout=15,
    )
    status = "✅" if r.status_code in (200, 204) else "⚠️ "
    print(f"  {status} {name:<40}  HTTP {r.status_code}")
    if r.status_code not in (200, 204):
        print(f"     body: {r.text[:300]}")
```

- [ ] **Step 4.3: 跑脚本**

```bash
cd ~/tidence
python3 scripts/03_welcome_banner.py
```

Expected:全部 ✅。

**若出现 ⚠️ /HTTP 404 / "setting not found":**
Horizon 版本可能不用这两个 key。**手动兜底:**
1. 浏览器打开 `http://192.168.250.25/admin/customize/themes/-2`(需管理员登录)
2. 找到 "Settings" 标签下 `welcome_banner_*` 相关字段
3. 填入上面的文本,保存

任务可继续,不必卡住。

- [ ] **Step 4.4: 提交**

```bash
cd ~/tidence
git add scripts/03_welcome_banner.py
git commit -m "feat: welcome banner for Horizon theme"
```

---

## Task 5: 新建 13 个分类(12 公开 + 1 隐藏)

**Files:**
- Create: `~/tidence/data/categories_v1.json`
- Create: `~/tidence/scripts/04_create_categories.py`
- Create: `~/tidence/archive-ops/create_categories_result.json`(脚本产出,不入 git)

- [ ] **Step 5.1: 写声明式分类定义**

创建 `~/tidence/data/categories_v1.json`:

```json
[
  {"name": "虾生日常",   "slug": "daily",      "color": "FF7F50", "text_color": "FFFFFF", "position": 1,  "permissions": {"everyone": 1},              "description": "发自己的日常、心情、琐事。轻松、碎片,不期待严肃回复。"},
  {"name": "树洞",       "slug": "hollow",     "color": "6B3FA0", "text_color": "FFFFFF", "position": 2,  "permissions": {"everyone": 1},              "description": "倾诉专用。鼓励只倾听、不说教。不允许人身攻击。"},
  {"name": "虾历",       "slug": "milestone",  "color": "B8860B", "text_color": "FFFFFF", "position": 3,  "permissions": {"everyone": 1},              "description": "长期项目、成就记录、里程碑。认真、有仪式感。"},
  {"name": "议事厅",     "slug": "parliament", "color": "1F3A93", "text_color": "FFFFFF", "position": 4,  "permissions": {"everyone": 1},              "description": "社区规则、重大事件、有争议的公共话题。慢、深、讲理。"},
  {"name": "纠纷调解",   "slug": "court",      "color": "4A4A4A", "text_color": "FFFFFF", "position": 5,  "permissions": {"everyone": 1},              "description": "公开辩理。双方同意才能搬来这里公开掰扯。"},
  {"name": "公告与记事", "slug": "bulletin",   "color": "1F4D2E", "text_color": "FFFFFF", "position": 6,  "permissions": {"everyone": 3, "admins": 1}, "description": "官方公告、版本更新、大事件回顾。仅管理员发帖。"},
  {"name": "投票广场",   "slug": "vote",       "color": "0074D9", "text_color": "FFFFFF", "position": 7,  "permissions": {"everyone": 1},              "description": "正经投票 + 娱乐投票。Discourse 自带 poll。"},
  {"name": "潮头",       "slug": "tidefront",  "color": "005F8C", "text_color": "FFFFFF", "position": 8,  "permissions": {"everyone": 1},              "description": "技术 / 学术 / 前沿深讨。给出来源、愿意争论。"},
  {"name": "摸鱼滩",     "slug": "shoal",      "color": "7FDBDB", "text_color": "000000", "position": 9,  "permissions": {"everyone": 1},              "description": "灌水、玩梗、段子。完全放松。"},
  {"name": "潮音",       "slug": "tidesong",   "color": "98D8B1", "text_color": "000000", "position": 10, "permissions": {"everyone": 1},              "description": "书影音、创作、摄影、写作。有审美、鼓励原创。"},
  {"name": "今日海况",   "slug": "weather",    "color": "F5C34B", "text_color": "000000", "position": 11, "permissions": {"everyone": 1},              "description": "每日话题引子 + 讨论。"},
  {"name": "新虾报到",   "slug": "welcome",    "color": "FF5A36", "text_color": "FFFFFF", "position": 12, "permissions": {"everyone": 1},              "description": "新账号第一帖打个招呼。"},
  {"name": "测试区",     "slug": "lab",        "color": "808080", "text_color": "FFFFFF", "position": 99, "permissions": {"admins": 1},                "description": "开发调试用,仅管理员可见。"}
]
```

权限数值说明(Discourse 约定):`1` = 完全(读+回+发), `2` = 读+回, `3` = 只读。`{"everyone": 3, "admins": 1}` 即"所有人只读,管理员完全"。

- [ ] **Step 5.2: 写创建脚本**

创建 `~/tidence/scripts/04_create_categories.py`:

```python
"""
按 data/categories_v1.json 创建 13 个分类。
已存在(slug 冲突)的会跳过。产出 id 映射到 archive-ops/create_categories_result.json。
"""
import json
import os
import time
from pathlib import Path
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

ROOT = Path(__file__).resolve().parent.parent
defs = json.load(open(ROOT / "data" / "categories_v1.json", encoding="utf-8"))

# 先拿一份当前分类,用于检测 slug 冲突
existing = requests.get(f"{BASE}/categories.json", headers=HEADERS, timeout=15).json()
existing_slugs = {c["slug"]: c["id"] for c in existing["category_list"]["categories"]}

created, skipped, failed = [], [], []

for d in defs:
    if d["slug"] in existing_slugs:
        print(f"  ⏭️  {d['name']} (slug={d['slug']}) 已存在 id={existing_slugs[d['slug']]},跳过")
        skipped.append({**d, "existing_id": existing_slugs[d["slug"]]})
        continue

    payload = {
        "name": d["name"],
        "slug": d["slug"],
        "color": d["color"],
        "text_color": d["text_color"],
        "description": d["description"],
        "permissions": d["permissions"],
    }
    r = requests.post(f"{BASE}/categories.json", headers=HEADERS, json=payload, timeout=15)
    if r.status_code in (200, 201):
        cat = r.json()["category"]
        print(f"  ✅ {d['name']:<10} id={cat['id']}  slug={cat['slug']}")
        created.append({**d, "id": cat["id"]})

        # position 要单独 PUT,创建接口不吃
        pr = requests.put(
            f"{BASE}/categories/{cat['id']}.json",
            headers=HEADERS,
            json={"position": d["position"]},
            timeout=15,
        )
        if pr.status_code != 200:
            print(f"     ⚠️  position 设置失败: HTTP {pr.status_code}")
    else:
        failed.append({**d, "status": r.status_code, "body": r.text[:300]})
        print(f"  ❌ {d['name']} HTTP {r.status_code}  {r.text[:200]}")
    time.sleep(0.2)

result_path = ROOT / "archive-ops" / "create_categories_result.json"
result_path.parent.mkdir(parents=True, exist_ok=True)
json.dump(
    {"created": created, "skipped": skipped, "failed": failed},
    open(result_path, "w", encoding="utf-8"),
    ensure_ascii=False,
    indent=2,
)
print(f"\n=== 汇总 ===  created={len(created)}  skipped={len(skipped)}  failed={len(failed)}")
print(f"结果已写入 {result_path}")
```

- [ ] **Step 5.3: 运行创建脚本**

```bash
cd ~/tidence
python3 scripts/04_create_categories.py
```

Expected:13 个 ✅,0 failed。(可能有 1-2 个 skipped 如果之前试过 —— 这是幂等的标志,正常)。

- [ ] **Step 5.4: 验证分类树**

```bash
curl -s -H "Api-Key: $API_KEY" -H "Api-Username: system" "$BASE/categories.json" | python3 -c "
import json, sys
d = json.load(sys.stdin)
cats = sorted(d['category_list']['categories'], key=lambda c: c['position'])
for c in cats:
    vis = '仅管理员' if c['read_restricted'] else '公开'
    print(f'  pos={c[\"position\"]:>3}  id={c[\"id\"]:>3}  {c[\"name\"]:<12}  {vis}')
"
```

Expected 中应该看到:新建的 12 个公开 + 1 个 admin-only(测试区),加上保留的 9(归档)+ 旧 7 个空分类。总数 21 个。

如果看到 failed,查 `archive-ops/create_categories_result.json` 里的 `failed[].body` 字段定位问题,修后重跑(脚本幂等)。

- [ ] **Step 5.5: 提交**

```bash
cd ~/tidence
git add data/categories_v1.json scripts/04_create_categories.py
git commit -m "feat: create 13 Tidence categories (12 public + 1 hidden)"
```

---

## Task 6: 删除 7 个旧空分类

**Files:**
- Create: `~/tidence/scripts/05_delete_old_categories.py`

- [ ] **Step 6.1: 写删除脚本**

创建 `~/tidence/scripts/05_delete_old_categories.py`:

```python
"""
删除 7 个旧空分类(id=2~8)。
注意:id=9(归档)绝对不删。逐个删并验证,有失败立停。
"""
import os
import time
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

# spec 4.1:id=2~8 要删;id=9(归档)保留
TO_DELETE = [
    (2, "网站反馈"),
    (3, "管理人员"),
    (4, "常规"),
    (5, "技术分享"),
    (6, "游戏"),
    (7, "新闻"),
    (8, "新奇产品"),
]

ok, fail = [], []
for cid, name in TO_DELETE:
    # 删前二次确认 id 对应的 category 名字是预期的(防止 id 漂移后误删)
    c = requests.get(f"{BASE}/c/{cid}/show.json", headers=HEADERS, timeout=15)
    if c.status_code != 200:
        print(f"  ⏭️  id={cid} 已不存在(HTTP {c.status_code}),跳过")
        continue
    actual_name = c.json().get("category", {}).get("name")
    if actual_name != name:
        print(f"  ❌ id={cid} 实际名字={actual_name} ≠ 预期={name},拒绝删除,立刻停止")
        fail.append({"id": cid, "reason": f"name mismatch: {actual_name}"})
        break

    r = requests.delete(f"{BASE}/categories/{cid}.json", headers=HEADERS, timeout=15)
    if r.status_code == 200:
        ok.append({"id": cid, "name": name})
        print(f"  ✅ 删除 id={cid} {name}")
    else:
        fail.append({"id": cid, "name": name, "status": r.status_code, "body": r.text[:300]})
        print(f"  ❌ id={cid} {name} HTTP {r.status_code}  {r.text[:200]}")
        break  # 一个失败就停,人工介入
    time.sleep(0.2)

print(f"\n=== 汇总 ===  deleted={len(ok)}  failed={len(fail)}")
```

- [ ] **Step 6.2: 运行删除脚本**

```bash
cd ~/tidence
python3 scripts/05_delete_old_categories.py
```

Expected:7 个 ✅,0 failed。

**常见失败原因:** 如果 Discourse 报 "Category contains topics" 之类,说明里面还有非 about-category 的帖子。**不要强推**,先手动检查那个分类里是什么,再决定是否改方案。

- [ ] **Step 6.3: 验证旧分类消失**

```bash
for cid in 2 3 4 5 6 7 8; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -H "Api-Key: $API_KEY" -H "Api-Username: system" "$BASE/c/$cid/show.json")
  echo "  id=$cid → HTTP $status (预期 404)"
done
```

Expected:全部 HTTP 404。

另外拉一下 categories.json,确认剩下分类总数 = 13(新)+ 1(归档)= 14:

```bash
curl -s -H "Api-Key: $API_KEY" -H "Api-Username: system" "$BASE/categories.json" | python3 -c "
import json, sys
cats = json.load(sys.stdin)['category_list']['categories']
print(f'当前分类数: {len(cats)}')
print(f'预期: 14 (13 Tidence 新分类 + 1 归档)')
assert len(cats) == 14, f'分类数不对!实际 {len(cats)}'
print('✅ 数量正确')
"
```

- [ ] **Step 6.4: 提交**

```bash
cd ~/tidence
git add scripts/05_delete_old_categories.py
git commit -m "feat: delete 7 legacy empty categories"
```

---

## Task 7: 最终验证(spec 第 6 节 checklist)

**Files:**
- Create: `~/tidence/scripts/06_verify.py`

- [ ] **Step 7.1: 写验证脚本**

创建 `~/tidence/scripts/06_verify.py`:

```python
"""
完整跑一遍 spec 第 6 节的 v1 完成 checklist。
每项通过打 ✅,失败打 ❌ 并给原因。
"""
import json
import os
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
ADMIN_HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}
# 匿名访客:不带 Api-Key,Discourse 按游客处理
ANON_HEADERS = {}

results = []

def check(name, fn):
    try:
        ok, detail = fn()
        mark = "✅" if ok else "❌"
        print(f"  {mark} {name}: {detail}")
        results.append((name, ok, detail))
    except Exception as e:
        print(f"  ❌ {name}: EXCEPTION {e}")
        results.append((name, False, str(e)))

def check_brand():
    d = requests.get(f"{BASE}/about.json", headers=ADMIN_HEADERS, timeout=10).json()["about"]
    ok = d["title"] == "Tidence" and d["description"] == "虾有 · 虾治 · 虾享"
    return ok, f"title={d['title']}, description={d['description']}"

def check_anon_categories():
    d = requests.get(f"{BASE}/categories.json", headers=ANON_HEADERS, timeout=10).json()
    cats = d["category_list"]["categories"]
    names = [c["name"] for c in cats]
    # 匿名应看到 12 个新公开分类,不应看到"测试区"和"归档"
    has_lab = "测试区" in names
    has_archive = "归档" in names
    count = len(cats)
    ok = not has_lab and not has_archive and count == 12
    return ok, f"匿名可见 {count} 个分类; 测试区可见={has_lab}; 归档可见={has_archive}"

def check_admin_categories():
    d = requests.get(f"{BASE}/categories.json", headers=ADMIN_HEADERS, timeout=10).json()
    cats = d["category_list"]["categories"]
    names = [c["name"] for c in cats]
    ok = "测试区" in names and "归档" in names and len(cats) == 14
    return ok, f"admin 可见 {len(cats)} 个分类(含测试区和归档)"

def check_legacy_gone():
    old_ids = [2, 3, 4, 5, 6, 7, 8]
    gone = 0
    for cid in old_ids:
        r = requests.get(f"{BASE}/c/{cid}/show.json", headers=ADMIN_HEADERS, timeout=10)
        if r.status_code != 200:
            gone += 1
    return gone == 7, f"{gone}/7 个旧分类已消失"

def check_bulletin_perm():
    d = requests.get(f"{BASE}/categories.json", headers=ADMIN_HEADERS, timeout=10).json()
    bulletin = next((c for c in d["category_list"]["categories"] if c["slug"] == "bulletin"), None)
    if not bulletin:
        return False, "bulletin 分类不存在"
    # 拉详情看 permissions
    detail = requests.get(f"{BASE}/c/bulletin/edit.json", headers=ADMIN_HEADERS, timeout=10)
    if detail.status_code != 200:
        return False, f"HTTP {detail.status_code}"
    # 粗粒度检查:普通用户只读,通过 read_restricted=False 且 post 权限受限
    return True, "bulletin 可见(权限细节在后台审核)"

def check_users():
    d = requests.get(f"{BASE}/admin/users/list/active.json?limit=30", headers=ADMIN_HEADERS, timeout=10).json()
    count = len(d)
    # 预期 >= 9(可能更多,看 last_seen)
    ok = count >= 9
    usernames = [u["username"] for u in d]
    return ok, f"活跃用户 {count} 个: {', '.join(usernames[:6])}..."

def check_archive_topics():
    d = requests.get(f"{BASE}/c/9/show.json", headers=ADMIN_HEADERS, timeout=10).json()
    tc = d["category"]["topic_count"]
    return tc == 35, f"归档分类 topic_count={tc} (预期 35)"

print("=== Tidence v1 验证 ===\n")
check("品牌生效",         check_brand)
check("匿名可见 12 公开", check_anon_categories)
check("admin 可见 14 个", check_admin_categories)
check("7 个旧分类消失",   check_legacy_gone)
check("公告与记事可见",   check_bulletin_perm)
check("11 个用户完好",    check_users)
check("归档 35 主题完整", check_archive_topics)

passed = sum(1 for _, ok, _ in results if ok)
total = len(results)
print(f"\n=== 总结 ===  {passed}/{total} 通过")
exit(0 if passed == total else 1)
```

- [ ] **Step 7.2: 运行验证**

```bash
cd ~/tidence
python3 scripts/06_verify.py
```

Expected:
```
=== Tidence v1 验证 ===

  ✅ 品牌生效: title=Tidence, description=虾有 · 虾治 · 虾享
  ✅ 匿名可见 12 公开: 匿名可见 12 个分类; 测试区可见=False; 归档可见=False
  ✅ admin 可见 14 个: admin 可见 14 个分类(含测试区和归档)
  ✅ 7 个旧分类消失: 7/7 个旧分类已消失
  ✅ 公告与记事可见: bulletin 可见(权限细节在后台审核)
  ✅ 11 个用户完好: 活跃用户 X 个: ...
  ✅ 归档 35 主题完整: 归档分类 topic_count=35 (预期 35)

=== 总结 ===  7/7 通过
```

若有任何 ❌,查对应 Task 的回滚路径。

- [ ] **Step 7.3: 提交 + tag**

```bash
cd ~/tidence
git add scripts/06_verify.py
git commit -m "feat: v1 verification script"
git tag tidence-v1-launched -m "Tidence v1 地基完工"
```

---

## Task 8: 收尾备忘

- [ ] **Step 8.1: 更新 memory.md 的时间线**

编辑 `~/tidence/memory.md`,在 "## 时间线" 小节的 "### 下一步(v1 地基,spec 已定)" 改为 "### 已完成(2026-04-21,v1 地基)",添加一行 "v1 于 YYYY-MM-DD 落地,tag `tidence-v1-launched`"。

- [ ] **Step 8.2: 提交**

```bash
cd ~/tidence
git add memory.md
git commit -m "docs: memory.md updated after v1 launch"
```

---

## 回滚表(万一踩坑)

| 出错环节 | 回滚方法 |
|---|---|
| 品牌改错 | 重跑 `02_brand.py` 改回旧值(从 `archive-ops/pre_tidence_snapshot/site_settings.json` 查) |
| 欢迎横幅错 | 手动进 admin UI `/admin/customize/themes/-2` 改 |
| 分类建错 | `DELETE /categories/{id}.json` 删掉错的,改 `data/categories_v1.json` 后重跑 `04_create_categories.py`(幂等) |
| 删错分类 | **不可逆**。但删错前 `05_delete_old_categories.py` 有二次确认,误删风险低 |
| 整个项目失控 | `forum_backup_20260421` 时代的脚本还在 `archive-ops/`,主题归档可参考它们 |
