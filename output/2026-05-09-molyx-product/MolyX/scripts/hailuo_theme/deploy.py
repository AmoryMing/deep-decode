"""部署 / 更新 hailuo-feed 主题组件,挂到 default theme(-1)下。幂等。"""
import os
from pathlib import Path
import requests

API_KEY = os.environ["API_KEY"]; BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system", "Content-Type": "application/json"}
THEME_NAME = "hailuo-feed"
HEAD_TAG_FILE = Path(__file__).resolve().parent / "head_tag.html"
DEFAULT_THEME_ID = -1

def get_themes():
    r = requests.get(f"{BASE}/admin/customize/themes.json", headers=HEADERS, timeout=15); r.raise_for_status()
    return r.json().get("themes", [])

def find_theme_by_name(name):
    for t in get_themes():
        if t["name"] == name: return t

def main():
    html = HEAD_TAG_FILE.read_text(encoding="utf-8")
    print(f"head_tag 长度: {len(html)} 字节")
    existing = find_theme_by_name(THEME_NAME)
    if existing:
        theme_id = existing["id"]; print(f"已存在 id={theme_id}")
    else:
        r = requests.post(f"{BASE}/admin/themes.json", headers=HEADERS,
                          json={"theme":{"name":THEME_NAME,"component":True,"user_selectable":False}}, timeout=15); r.raise_for_status()
        theme_id = r.json()["theme"]["id"]; print(f"✅ 新建 id={theme_id}")
    body = {"theme":{"theme_fields":[{"name":"head_tag","target":"common","type_id":1,"value":html}]}}
    r2 = requests.put(f"{BASE}/admin/themes/{theme_id}.json", headers=HEADERS, json=body, timeout=30)
    if r2.status_code not in (200,204): print(f"  set_head_tag failed: {r2.status_code} {r2.text[:300]}"); r2.raise_for_status()
    print(f"✅ head_tag 已写入")
    # 挂到 default
    r3 = requests.get(f"{BASE}/admin/themes/{DEFAULT_THEME_ID}.json", headers=HEADERS, timeout=15); r3.raise_for_status()
    children = [c["id"] for c in r3.json()["theme"].get("child_themes",[])]
    if theme_id in children:
        print("  已挂在 default(-1)"); return
    children.append(theme_id)
    r4 = requests.put(f"{BASE}/admin/themes/{DEFAULT_THEME_ID}.json", headers=HEADERS,
                      json={"theme":{"child_theme_ids":children}}, timeout=15); r4.raise_for_status()
    print("  ✅ 挂到 default(-1)")

if __name__ == "__main__": main()
