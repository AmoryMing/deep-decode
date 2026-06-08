"""
Step 3: 收尾归档 - 把剩下的 8 个普通主题挪进归档分类
(about-category 系统描述帖保留在原分类,不可移动)
"""
import json
import os
import time
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

ARCHIVE_ID = 9

# 从 API 实时拉当前状态,找出还没归档的普通主题
cats = requests.get(f"{BASE}/categories.json", headers=HEADERS).json()
cats = cats["category_list"]["categories"]

to_move = []
for c in cats:
    if c["id"] == ARCHIVE_ID or c["topic_count"] == 0:
        continue
    r = requests.get(f"{BASE}/c/{c['id']}/l/latest.json", headers=HEADERS)
    if r.status_code != 200:
        continue
    for t in r.json()["topic_list"]["topics"]:
        # 跳过 about-category 系统帖:标题以 "关于" 开头 + 以 "类别" 结尾
        title = t["title"]
        if title.startswith("关于") and title.endswith("类别"):
            continue
        to_move.append({
            "id": t["id"],
            "title": title,
            "from_cat_id": c["id"],
            "from_cat_name": c["name"],
        })

print(f"=== 待归档: {len(to_move)} 个主题 ===")
for t in to_move:
    print(f"  id={t['id']:3d}  [{t['from_cat_name']}]  {t['title'][:60]}")

print()
ok, fail = [], []
for t in to_move:
    r = requests.put(
        f"{BASE}/t/-/{t['id']}.json",
        headers=HEADERS,
        json={"title": t["title"], "category_id": ARCHIVE_ID},
    )
    if r.status_code == 200:
        ok.append(t)
        print(f"  ✅ id={t['id']:3d}  [{t['from_cat_name']}] → 归档")
    else:
        fail.append({"topic": t, "status": r.status_code, "body": r.text[:300]})
        print(f"  ❌ id={t['id']:3d}  HTTP {r.status_code}  {t['title'][:40]}")
    time.sleep(0.15)

print(f"\n=== 汇总 ===  成功={len(ok)}  失败={len(fail)}")
if fail:
    for f in fail:
        print(f"  id={f['topic']['id']}  HTTP {f['status']}  {f['body'][:200]}")

with open("move_result.json", "w") as f:
    json.dump({"ok": ok, "fail": fail}, f, ensure_ascii=False, indent=2)
print("结果已写入 move_result.json")
