"""
部署 / 更新 tide-sidebar 主题组件。挂到 default theme(-1)下。
幂等:已存在则更新内容,不存在则创建。

env: API_KEY, BASE
用法:python3 deploy.py
"""
import os
from pathlib import Path
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system", "Content-Type": "application/json"}

THEME_NAME = "tide-sidebar"
HEAD_TAG_FILE = Path(__file__).resolve().parent / "head_tag.html"
DEFAULT_THEME_ID = -1

# 模板替换
INDEX_TOPIC_ID = 385

def get_themes():
    r = requests.get(f"{BASE}/admin/customize/themes.json", headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json().get("themes", [])

def find_theme_by_name(name):
    for t in get_themes():
        if t["name"] == name:
            return t
    return None

def create_theme(name):
    body = {"theme": {"name": name, "component": True, "user_selectable": False}}
    r = requests.post(f"{BASE}/admin/themes.json", headers=HEADERS, json=body, timeout=15)
    r.raise_for_status()
    return r.json()["theme"]

def set_head_tag(theme_id, html):
    body = {
        "theme": {
            "theme_fields": [
                {"name": "head_tag", "target": "common", "type_id": 1, "value": html}
            ]
        }
    }
    r = requests.put(f"{BASE}/admin/themes/{theme_id}.json", headers=HEADERS, json=body, timeout=30)
    if r.status_code not in (200, 204):
        print("set_head_tag failed:", r.status_code, r.text[:500])
        r.raise_for_status()

def attach_to_default(component_id):
    r = requests.get(f"{BASE}/admin/themes/{DEFAULT_THEME_ID}.json", headers=HEADERS, timeout=15)
    r.raise_for_status()
    theme = r.json()["theme"]
    children = [c["id"] for c in theme.get("child_themes", [])]
    if component_id in children:
        print(f"  已挂在 default(-1) 下,跳过")
        return
    children.append(component_id)
    body = {"theme": {"child_theme_ids": children}}
    r2 = requests.put(f"{BASE}/admin/themes/{DEFAULT_THEME_ID}.json", headers=HEADERS, json=body, timeout=15)
    if r2.status_code not in (200, 204):
        print("attach failed:", r2.status_code, r2.text[:500])
        r2.raise_for_status()
    print(f"  ✅ 挂到 default(-1) 完成")

def main():
    template = HEAD_TAG_FILE.read_text(encoding="utf-8")
    html = template.replace("{{INDEX_TOPIC_ID}}", str(INDEX_TOPIC_ID))
    print(f"模板替换 INDEX_TOPIC_ID = {INDEX_TOPIC_ID}")
    print(f"head_tag 长度: {len(html)} 字节")

    existing = find_theme_by_name(THEME_NAME)
    if existing:
        theme_id = existing["id"]
        print(f"已存在主题组件 id={theme_id} ({THEME_NAME}),更新内容...")
    else:
        new_theme = create_theme(THEME_NAME)
        theme_id = new_theme["id"]
        print(f"✅ 新建主题组件 id={theme_id} ({THEME_NAME})")

    set_head_tag(theme_id, html)
    print(f"✅ head_tag 已写入 (id={theme_id})")

    attach_to_default(theme_id)

    print("\n部署完成。刷新浏览器,左侧栏应该出现三个新 section:论坛 / clawhub / tidetoc。")

if __name__ == "__main__":
    main()
