"""
Step 2: 把所有 topic 移到 归档 分类
"""
import json
import os
import time
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

topics = json.load(open("topics_to_move.json"))
archive = json.load(open("archive_category.json"))
ARCHIVE_ID = archive["id"]
print(f"目标分类: 归档 (id={ARCHIVE_ID})")
print(f"待移动: {len(topics)} 个 topic\n")

ok, fail = [], []
for t in topics:
    # PUT /t/-/{id}.json 同时带 title 和 category_id
    r = requests.put(
        f"{BASE}/t/-/{t['id']}.json",
        headers=HEADERS,
        json={"title": t["title"], "category_id": ARCHIVE_ID},
    )
    if r.status_code == 200:
        ok.append(t)
        print(f"  ✅ topic_id={t['id']:4d}  [{t['from_cat_name']}] → 归档")
    else:
        fail.append({"topic": t, "status": r.status_code, "body": r.text[:200]})
        print(f"  ❌ topic_id={t['id']:4d}  HTTP {r.status_code}  {t['title'][:40]}")
    time.sleep(0.1)  # 别把服务器打崩

print(f"\n=== 汇总 ===")
print(f"成功: {len(ok)} / {len(topics)}")
print(f"失败: {len(fail)}")

if fail:
    print("\n失败详情:")
    for f in fail:
        print(f"  topic_id={f['topic']['id']}  HTTP {f['status']}  {f['topic']['title'][:50]}")
        print(f"    原因: {f['body'][:150]}")

# 保存结果
with open("move_result.json", "w") as f:
    json.dump({"ok": ok, "fail": fail}, f, ensure_ascii=False, indent=2)
