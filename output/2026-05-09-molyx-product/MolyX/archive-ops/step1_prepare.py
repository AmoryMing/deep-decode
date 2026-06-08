"""
Step 1: 收集所有 topic ID + 创建 归档 分类(管理员可见)
"""
import json
import os
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

# 1. 拿全部分类
cats = requests.get(f"{BASE}/categories.json", headers=HEADERS).json()
cats = cats["category_list"]["categories"]

# 2. 遍历每个分类,拿 topic 列表
all_topics = []
for c in cats:
    if c["topic_count"] == 0:
        continue
    # Discourse 标准接口: /c/{id}/l/latest.json
    r = requests.get(f"{BASE}/c/{c['id']}/l/latest.json", headers=HEADERS)
    if r.status_code != 200:
        print(f"  ⚠️  分类 {c['name']}(id={c['id']}) 拉取失败: HTTP {r.status_code}")
        continue
    topics = r.json()["topic_list"]["topics"]
    for t in topics:
        # 跳过 pinned 的"关于此分类"系统帖(category 描述帖,不能移动)
        if t.get("pinned") and t.get("posters", []) and t.get("archetype") == "regular":
            pass  # 还是收进来,后面看是否能动
        all_topics.append({
            "id": t["id"],
            "title": t["title"],
            "from_cat_id": c["id"],
            "from_cat_name": c["name"],
            "pinned": t.get("pinned", False),
        })

print(f"=== 共发现 {len(all_topics)} 个 topic ===")
for t in all_topics:
    pin = " 📌" if t["pinned"] else ""
    print(f"  topic_id={t['id']:4d}  [{t['from_cat_name']}]  {t['title']}{pin}")

# 把列表存盘,后面 step2 直接读
with open("topics_to_move.json", "w") as f:
    json.dump(all_topics, f, ensure_ascii=False, indent=2)

# 3. 创建 归档 分类(只有 admin 组能看)
print("\n=== 创建 归档 分类 ===")
r = requests.post(f"{BASE}/categories.json", headers=HEADERS, json={
    "name": "归档",
    "slug": "archive",
    "color": "808080",
    "text_color": "FFFFFF",
    "description": "归档的旧内容,仅管理员可见",
    "permissions": {"admins": 1},  # 1=完全权限,只给 admins 组,其他人看不到
})
if r.status_code in (200, 201):
    new_cat = r.json()["category"]
    print(f"  ✅ 创建成功: id={new_cat['id']}, name={new_cat['name']}, slug={new_cat['slug']}")
    with open("archive_category.json", "w") as f:
        json.dump(new_cat, f, ensure_ascii=False, indent=2)
else:
    print(f"  ❌ 创建失败: HTTP {r.status_code}")
    print(r.text[:500])
