#!/usr/bin/env python3
"""perf_priors.py — 爆款归因 → 选题先验（DISCOVERY_DATA_SPEC 支柱3，闭环的心脏）。

读每篇的表现数据 output/<slug>/performance.json，按该篇的 概念/content_type 归因，
算出"哪些概念/类型赢面高、哪些翻车"，写 wiki/_performance_priors.json。
scout2 读它给命中高赢面概念的新热点加权——内容表现真的反哺下一轮选题。

performance.json 契约（由 perf_record.py / 真实拉取 / 手填 产出）：
  {"slug":"...","updated":"YYYY-MM-DD",
   "platforms":{"xhs":{"views":N,"likes":N,"collects":N,"comments":N,"shares":N,"new_followers":N}},
   "post_ids":{"xhs":"<noteId>"}}

无数据时优雅产出空先验（scout2 加 0，不报错）。
"""
from __future__ import annotations
import json, re, datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "output"
PRIORS = REPO / "wiki" / "_performance_priors.json"

try:
    import yaml
except ImportError:
    yaml = None


def engagement_score(p: dict) -> float | None:
    """单平台表现 → 0~1 综合分。互动加权 / 观看，收藏权重高（干货信号）。"""
    v = p.get("views") or p.get("impressions") or 0
    if not v:
        return None
    weighted = (p.get("likes", 0) + p.get("collects", 0) * 2 + p.get("comments", 0) * 3
                + p.get("shares", 0) * 2 + p.get("new_followers", 0) * 5)
    rate = weighted / v
    # 经验归一：rate 0.15 ≈ 优秀 → 1.0 封顶
    return min(rate / 0.15, 1.0)


def slug_concepts(slug: str) -> tuple[list[str], str]:
    """该篇的概念 token + content_type（从 spec_lock + 标题/角度抽）。"""
    d = OUT / slug
    concepts, ctype = [], "decode"
    sp = d / "spec_lock.yaml"
    title = slug
    if sp.exists() and yaml:
        try:
            s = yaml.safe_load(sp.read_text(encoding="utf-8")) or {}
            cfg = s.get("config", {}) or {}
            ctype = cfg.get("content_type", "decode")
            concepts += [str(x).lower() for x in (cfg.get("knowledge_domains") or [])]
            title = (s.get("project", {}) or {}).get("title", slug)
            ang = (s.get("strategy", {}) or {}).get("title_angle", "")
            title = f"{title} {ang}"
        except Exception:
            pass
    # slug 本身就是 kebab 关键词（去日期/数字/停用词）→ 当概念用
    STOP = {"the", "and", "for", "vs", "with", "ai", "llm", "20"}
    for tok in re.split(r"-", slug):
        tok = tok.lower()
        if len(tok) >= 3 and not tok.isdigit() and not re.match(r"^\d{4}$|^\d+[a-z]$", tok) \
                and tok not in STOP:
            concepts.append(tok)
    # 再叠加 wiki/concepts 实体名匹配（更准的领域概念）
    cdir = REPO / "wiki" / "concepts"
    if cdir.exists():
        t = title.lower()
        for cp in cdir.glob("*.md"):
            name = cp.stem.replace("-", " ").lower()
            if name and name in t:
                concepts.append(name)
    return list(dict.fromkeys(concepts)), ctype


def compute() -> dict:
    samples = []  # (perf_score, concepts, ctype)
    for pf in OUT.glob("*/performance.json"):
        try:
            data = json.loads(pf.read_text(encoding="utf-8"))
        except Exception:
            continue
        plats = data.get("platforms", {}) or {}
        scores = [s for s in (engagement_score(p) for p in plats.values()) if s is not None]
        if not scores:
            continue
        perf = sum(scores) / len(scores)
        concepts, ctype = slug_concepts(data.get("slug", pf.parent.name))
        samples.append((perf, concepts, ctype))

    if not samples:
        return {"updated": datetime.date.today().isoformat(), "computed_from": 0,
                "concepts": {}, "content_types": {}, "note": "无 performance.json，先验为空"}

    g_avg = sum(s[0] for s in samples) / len(samples)

    def aggregate(key_fn):
        acc: dict[str, list[float]] = {}
        for perf, concepts, ctype in samples:
            for k in key_fn(concepts, ctype):
                acc.setdefault(k, []).append(perf)
        out = {}
        for k, vals in acc.items():
            avg = sum(vals) / len(vals)
            # 先验权重 = (该项均值 - 全局均值)，clamp 到 [-1,1]
            out[k] = {"weight": round(max(-1.0, min(1.0, (avg - g_avg) * 2)), 3),
                      "avg": round(avg, 3), "n": len(vals)}
        return out

    return {
        "updated": datetime.date.today().isoformat(),
        "computed_from": len(samples),
        "global_avg": round(g_avg, 3),
        "concepts": aggregate(lambda c, t: c),
        "content_types": aggregate(lambda c, t: [t]),
    }


def main():
    priors = compute()
    PRIORS.write_text(json.dumps(priors, ensure_ascii=False, indent=1), encoding="utf-8")
    top = sorted(priors["concepts"].items(), key=lambda kv: kv[1]["weight"], reverse=True)[:5]
    print(json.dumps({"computed_from": priors["computed_from"],
                      "top_concepts": [{"c": k, "w": v["weight"]} for k, v in top],
                      "content_types": priors.get("content_types", {})},
                     ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
