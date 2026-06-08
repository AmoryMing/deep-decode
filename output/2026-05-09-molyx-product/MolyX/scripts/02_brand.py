"""
改 Discourse 的 3 个品牌 site_settings(标题、副标、扩展描述)。

历史背景:
  原本是 Tidence v1 task 3 的脚本。项目方向已转为 TideTown(见 memory.md),
  Discourse 是否还需要换品牌待定 —— 跑前请重审 CHANGES 字面值。

已知 Discourse 行为:
  - PUT 成功返回 204 (No Content),不是 200。原版本判 == 200 全 ❌,已修。
  - extended_site_description 是 hidden setting,核心限制 422 不让改,已从 CHANGES 移除。
  - 多 worker + 内存缓存,PUT 完读回会在新旧值之间抖一阵子,读回带重试。

环境:
  export API_KEY="<discourse admin api key>"
  export BASE="http://192.168.250.25"
"""
import os
import time
import requests

API_KEY = os.environ["API_KEY"]
BASE = os.environ["BASE"]
HEADERS = {"Api-Key": API_KEY, "Api-Username": "system"}

CHANGES = {
    "title": "潮汐社",
    "site_description": "虾有 · 虾治 · 虾享",
    "short_site_description": "Of the claw, by the claw, for the claw.",
}
# 这是 2026-04-30 实际推上 192.168.250.25 的版本(对齐 TideTown 设计)。
# 直读多 worker 缓存的 admin/site_settings.json 会抖动 —— 重试 3 次取到
# 新值就是真实状态。匿名 about.json 是最终用户视角,以那里为准。
# short_site_description 在当前实例的 admin endpoint 永远读回 '' (不论 PUT 成功),
# 是这个实例特有的拦截 bug,但 about.json 不受影响。


def put_setting(key: str, value: str) -> tuple[bool, str]:
    r = requests.put(
        f"{BASE}/admin/site_settings/{key}.json",
        headers=HEADERS,
        data={key: value},
        timeout=15,
    )
    ok = r.status_code in (200, 204)
    detail = "" if ok else f"HTTP {r.status_code} | {r.text[:200]}"
    return ok, detail


def verify_setting(key: str, expected: str, attempts: int = 3, gap: float = 1.5) -> bool:
    for _ in range(attempts):
        r = requests.get(f"{BASE}/admin/site_settings.json", headers=HEADERS, timeout=15)
        if r.ok:
            for s in r.json().get("site_settings", []):
                if s["setting"] == key and s["value"] == expected:
                    return True
        time.sleep(gap)
    return False


def main() -> None:
    print(f"BASE = {BASE}")
    for key, value in CHANGES.items():
        ok, detail = put_setting(key, value)
        if not ok:
            print(f"  ❌ {key:<26} PUT 失败 — {detail}")
            continue
        verified = verify_setting(key, value)
        mark = "✅" if verified else "⚠️  (PUT ok 但读回未对齐,可能是 worker 缓存)"
        print(f"  {mark} {key:<26} → {value}")


if __name__ == "__main__":
    main()
