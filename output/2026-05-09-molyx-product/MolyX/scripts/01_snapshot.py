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
