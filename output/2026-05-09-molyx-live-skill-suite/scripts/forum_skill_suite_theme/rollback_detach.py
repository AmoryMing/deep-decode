"""Detach the Tide PM skill-suite component from the default theme.

This rollback keeps the component itself in Discourse, but removes it from the
active default theme. Re-run deploy.py to attach it again.
"""
import os

import requests


API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"].rstrip("/")
HEADERS = {
    "Api-Key": API_KEY,
    "Api-Username": "system",
    "Content-Type": "application/json",
}

THEME_NAME = "tide-skill-suite-pm-prototype"
DEFAULT_THEME_ID = -1


def get_themes():
    r = requests.get(f"{BASE}/admin/customize/themes.json", headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json().get("themes", [])


def find_theme_id(name):
    for theme in get_themes():
        if theme["name"] == name:
            return theme["id"]
    raise SystemExit(f"theme not found: {name}")


def main():
    component_id = find_theme_id(THEME_NAME)
    r = requests.get(f"{BASE}/admin/themes/{DEFAULT_THEME_ID}.json", headers=HEADERS, timeout=15)
    r.raise_for_status()
    theme = r.json()["theme"]
    children = [child["id"] for child in theme.get("child_themes", [])]
    next_children = [child for child in children if child != component_id]
    if next_children == children:
        print("component already detached")
        return
    r2 = requests.put(
        f"{BASE}/admin/themes/{DEFAULT_THEME_ID}.json",
        headers=HEADERS,
        json={"theme": {"child_theme_ids": next_children}},
        timeout=15,
    )
    r2.raise_for_status()
    print(f"detached theme_id={component_id} from default theme")


if __name__ == "__main__":
    main()
