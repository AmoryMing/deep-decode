"""Deploy/update the Tide PM skill-suite theme component.

This is intentionally a gray-release component. It only renders when the URL
contains ?tide_pm=skills, so attaching it to the default theme should not change
normal forum traffic.
"""
import os
from pathlib import Path

import requests


API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"].rstrip("/")
HEADERS = {
    "Api-Key": API_KEY,
    "Api-Username": "system",
    "Content-Type": "application/json",
}

THEME_NAME = "tide-skill-suite-pm-prototype"
HEAD_TAG_FILE = Path(__file__).resolve().parent / "head_tag.html"
DEFAULT_THEME_ID = -1


def get_themes():
    r = requests.get(f"{BASE}/admin/customize/themes.json", headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json().get("themes", [])


def find_theme_by_name(name):
    for theme in get_themes():
        if theme["name"] == name:
            return theme
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
    children = [child["id"] for child in theme.get("child_themes", [])]
    if component_id in children:
        print("already attached to default theme")
        return
    children.append(component_id)
    r2 = requests.put(
        f"{BASE}/admin/themes/{DEFAULT_THEME_ID}.json",
        headers=HEADERS,
        json={"theme": {"child_theme_ids": children}},
        timeout=15,
    )
    r2.raise_for_status()
    print("attached to default theme")


def main():
    html = HEAD_TAG_FILE.read_text(encoding="utf-8")
    print(f"head_tag bytes: {len(html.encode('utf-8'))}")
    existing = find_theme_by_name(THEME_NAME)
    if existing:
        theme_id = existing["id"]
        print(f"updating existing theme id={theme_id}")
    else:
        theme = create_theme(THEME_NAME)
        theme_id = theme["id"]
        print(f"created theme id={theme_id}")
    set_head_tag(theme_id, html)
    attach_to_default(theme_id)
    print(f"done theme_id={theme_id}")


if __name__ == "__main__":
    main()
