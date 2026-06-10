#!/usr/bin/env python3
"""analytics_snapshot.py — 把账号数据快照按日追加成时间序列（DISCOVERY_DATA_SPEC 支柱2）。

现状是单点覆盖（schedule/analytics.json / xhs-snapshot.json 手填），趋势靠手填 change。
本工具把"今天的快照"追加到 schedule/analytics/<date>.json（只读不改源），多天后趋势真实可算。
幂等：同一天重复跑只覆盖当天那份。cron 每日跑一次。
"""
from __future__ import annotations
import json, datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SCH = REPO / "schedule"
SERIES = SCH / "analytics"


def load(name: str) -> dict:
    p = SCH / name
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def main():
    date = datetime.date.today().isoformat()
    xhs = load("xhs-snapshot.json")
    ana = load("analytics.json")
    SERIES.mkdir(parents=True, exist_ok=True)

    snap = {
        "date": date,
        "xhs_account": (xhs.get("account") or {}),
        "xhs_metrics": {k: v.get("value") for k, v in (xhs.get("metrics") or {}).items()},
        "platforms": ana.get("platforms", []),
    }
    out = SERIES / f"{date}.json"
    out.write_text(json.dumps(snap, ensure_ascii=False, indent=1), encoding="utf-8")

    # 趋势：与最近一份历史比
    history = sorted([p for p in SERIES.glob("*.json") if p.stem != date])
    trend = {}
    if history:
        prev = json.loads(history[-1].read_text(encoding="utf-8"))
        for k, v in snap["xhs_metrics"].items():
            pv = (prev.get("xhs_metrics") or {}).get(k)
            if isinstance(v, (int, float)) and isinstance(pv, (int, float)):
                trend[k] = v - pv
    print(json.dumps({"snapshot": str(out.relative_to(REPO)),
                      "days_in_series": len(history) + 1,
                      "trend_vs_prev": trend or "（首份快照，暂无趋势）"},
                     ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
