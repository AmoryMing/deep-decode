#!/usr/bin/env python3
"""perf_record.py — 记录单篇表现数据 → output/<slug>/performance.json（支柱2 的数据入口）。

真实数据从哪来（按可得性排序）：
  1. 真实拉取（tools/xhs_stats.py，待 D5）——最理想，自动。
  2. 手填——创作者从平台后台抄单篇互动数，最稳。本工具就是这条。
记完自动触发 perf_priors 重算（闭环立即生效）。

用法：
  python3 tools/perf_record.py --slug <slug> --platform xhs \
      --views 22000 --likes 900 --collects 1400 --comments 60 --shares 500 --new-followers 120 \
      --post-id <noteId>
"""
from __future__ import annotations
import argparse, json, subprocess, sys, datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]


def main():
    ap = argparse.ArgumentParser(description="记录单篇表现")
    ap.add_argument("--slug", required=True)
    ap.add_argument("--platform", default="xhs", choices=["xhs", "wechat", "douyin", "shipinhao"])
    for m in ("views", "impressions", "likes", "collects", "comments", "shares", "new-followers"):
        ap.add_argument(f"--{m}", type=int)
    ap.add_argument("--post-id")
    a = ap.parse_args()

    d = REPO / "output" / a.slug
    if not d.exists():
        sys.exit(f"无此项目目录：output/{a.slug}")
    pf = d / "performance.json"
    data = {}
    if pf.exists():
        try:
            data = json.loads(pf.read_text(encoding="utf-8"))
        except Exception:
            data = {}
    data.setdefault("slug", a.slug)
    data["updated"] = datetime.date.today().isoformat()
    plats = data.setdefault("platforms", {})
    metrics = {k: getattr(a, k.replace("-", "_")) for k in
               ("views", "impressions", "likes", "collects", "comments", "shares", "new-followers")
               if getattr(a, k.replace("-", "_")) is not None}
    plats[a.platform] = {**plats.get(a.platform, {}), **{k.replace("-", "_"): v for k, v in metrics.items()}}
    if a.post_id:
        data.setdefault("post_ids", {})[a.platform] = a.post_id
    pf.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"已记 {a.slug} / {a.platform}：{metrics}")

    # 触发先验重算（闭环立即生效）
    r = subprocess.run([sys.executable, str(REPO / "tools" / "perf_priors.py")],
                       capture_output=True, text=True)
    print("先验已重算" if r.returncode == 0 else f"先验重算失败：{r.stderr[-200:]}")


if __name__ == "__main__":
    main()
