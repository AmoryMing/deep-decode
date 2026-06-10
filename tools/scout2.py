#!/usr/bin/env python3
"""scout2.py — 选题引擎 v2（DISCOVERY_DATA_SPEC 支柱1）。

复用 scout 的抓取框架，把"纯关键词打分"升级为多信号融合 + LLM 相关性 + 去重 + 灵感角度：
  最终分 = 信源权重 + 热度信号(HN分/aihot类目) + 时效 + 关键词命中 + LLM相关性 - 重复惩罚
top-N 再用 LLM 生成「切入角度」+ 建议 content_type + 候选标题钩子（"灵感"层）。
产物：wiki/radar/YYYY-MM-DD.json（结构化，web 收件箱用）+ .md（obsidian 可读）。

设计：LLM 用 deepseek-v4-flash（便宜），只给"廉价预排"后的 top 候选打分，单 run 2 次调用封顶。
无 key 时优雅降级为纯信号+关键词打分（冷启动不依赖 API）。失败不崩。
"""
from __future__ import annotations
import argparse, datetime, json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
SCOUT_DIR = REPO / ".claude" / "skills" / "scout"
sys.path.insert(0, str(SCOUT_DIR))
sys.path.insert(0, str(HERE))

import yaml  # noqa: E402
try:
    import scout  # 复用 fetch_source 等  # noqa: E402
except Exception as e:
    sys.exit(f"无法导入 scout.py：{e}")
try:
    import llm_executor  # noqa: E402
except Exception:
    llm_executor = None


# ── 信号库（去重 + 关键词）──────────────────────────────
def covered_title_tokens() -> list[set]:
    """已覆盖选题/已发文章的标题词集，用于新颖度去重。"""
    out = []
    for d in [(REPO / "wiki" / "topics"), (REPO / "output")]:
        if not d.exists():
            continue
        for p in d.glob("*" if d.name == "output" else "*.md"):
            name = p.stem if d.name == "wiki" else (p.name if p.is_dir() else "")
            if name:
                out.append(_tok(name.replace("-", " ")))
    return [t for t in out if t]


def _tok(s: str) -> set:
    s = s.lower()
    # 中文按字、英文按词
    cjk = set(re.findall(r"[一-鿿]{2,}", s))
    lat = set(w for w in re.findall(r"[a-z0-9]{3,}", s))
    return cjk | lat


def reader_keywords(reader: str) -> set:
    f = REPO / "readers" / reader / "persona.md"
    if not f.exists():
        return set()
    text = f.read_text(encoding="utf-8")
    kws = set(re.findall(r"`([^`]+)`", text)) | set(re.findall(r"\*\*([^*]+)\*\*", text))
    return {k.lower().strip() for k in kws if 2 < len(k) < 40}


def concept_names() -> set:
    d = REPO / "wiki" / "concepts"
    return {p.stem.replace("-", " ").lower() for p in d.glob("*.md")} if d.exists() else set()


# ── 廉价预排（无 LLM 也能跑）────────────────────────────
def days_old(published: str) -> int:
    if not published:
        return 99
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d", "%a, %d %b %Y %H:%M:%S"):
        try:
            d = datetime.datetime.strptime(published[:19], fmt)
            return (datetime.datetime.now() - d).days
        except Exception:
            continue
    return 99


def load_perf_priors() -> dict:
    """读爆款先验（perf_priors.py 产出）。无则空。"""
    p = REPO / "wiki" / "_performance_priors.json"
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8")) or {}
    except Exception:
        return {}


def cheap_score(it: dict, reader_kws: set, concepts: set, covered: list[set],
                priors: dict | None = None) -> tuple[float, list]:
    score = float(it.get("_weight", 5))
    reasons = [f"src+{it.get('_weight', 5)}"]
    t = (it.get("title", "") + " " + it.get("summary", "")).lower()
    # 热度信号
    if it.get("score"):  # HN 分
        b = min(it["score"] / 40.0, 5.0)
        score += b; reasons.append(f"hn+{b:.1f}")
    cat = it.get("category", "")
    if cat in ("精选", "ai-models", "selected"):
        score += 3; reasons.append(f"hot:{cat}")
    # 关键词 / 概念
    if any(kw in t for kw in reader_kws):
        score += 3; reasons.append("reader")
    hit_c = next((c for c in concepts if c in t), None)
    if hit_c:
        score += 4; reasons.append(f"concept:{hit_c}")
    # 爆款先验：命中高赢面概念的新热点加权（闭环：表现→选题）
    if priors:
        pc = priors.get("concepts", {}) or {}
        best = 0.0; best_c = None
        for c, info in pc.items():
            if c in t and abs(info.get("weight", 0)) > abs(best):
                best = info.get("weight", 0); best_c = c
        if best_c:
            score += best * 4  # weight∈[-1,1] → ±4 分
            reasons.append(f"perf:{best_c}{'+' if best >= 0 else ''}{best:.2f}")
    # 时效
    d = days_old(it.get("published", ""))
    if d <= 1:
        score += 4; reasons.append("today")
    elif d <= 3:
        score += 2; reasons.append("recent")
    # 新颖度去重
    toks = _tok(it.get("title", ""))
    if toks:
        for cov in covered:
            inter = len(toks & cov)
            if inter >= 2 and inter / max(len(toks), 1) >= 0.6:
                score -= 5; reasons.append("dup")
                break
    return score, reasons


# ── LLM 相关性 + 灵感角度（flash，便宜）──────────────────
def _flash_chat(prompt: str, max_tokens: int = 3000) -> str | None:
    if not llm_executor:
        return None
    cfg = llm_executor.load_config()
    if not llm_executor.has_key(cfg):
        return None
    try:
        return llm_executor.chat(cfg, "n.router", [{"role": "user", "content": prompt}],
                                 max_tokens=max_tokens)
    except Exception as e:
        print(f"[scout2] LLM 失败，降级纯信号：{e}", file=sys.stderr)
        return None


def llm_relevance(items: list[dict], reader: str) -> None:
    """给 items 批量打相关性 0-10（就地写 it['_rel'] + it['_rel_reason']）。"""
    persona = ""
    pf = REPO / "readers" / reader / "persona.md"
    if pf.exists():
        persona = pf.read_text(encoding="utf-8")[:1200]
    listing = "\n".join(f"{i}. {it.get('title', '')[:120]}" for i, it in enumerate(items))
    prompt = (
        f"你是内容选题编辑，为下面这个号筛 AI 选题。读者画像：\n{persona}\n\n"
        "给每条打相关性分 0-10（这条值不值得本号写一篇深度解读），只输出 JSON 数组，"
        '形如 [{"i":0,"rel":8,"why":"一句话"}]，不要解释、不要代码围栏：\n' + listing)
    out = _flash_chat(prompt, 4000)
    if not out:
        return
    out = re.sub(r"^```\w*\s*|\s*```$", "", out.strip())
    try:
        for r in json.loads(out):
            i = r.get("i")
            if isinstance(i, int) and 0 <= i < len(items):
                items[i]["_rel"] = float(r.get("rel", 0))
                items[i]["_rel_reason"] = str(r.get("why", ""))[:80]
    except Exception as e:
        print(f"[scout2] 相关性解析失败：{e}", file=sys.stderr)


def llm_angles(items: list[dict]) -> None:
    """给 top items 生成切入角度 + 建议 content_type + 标题钩子（就地写 it['_angle'] 等）。"""
    listing = "\n".join(f"{i}. {it.get('title', '')[:120]}｜{it.get('summary', '')[:100]}"
                        for i, it in enumerate(items))
    prompt = (
        "你是顶级中文科技评论的选题策划。对下面每条热点，给一个'非显然的切入角度'（不是转述新闻，"
        "是值得写的深度解读切口）、建议内容类型（decode深度拆解|brief快讯|practice实操）、1 个标题钩子。"
        '只输出 JSON 数组 [{"i":0,"angle":"...","content_type":"decode","hook":"..."}]，无围栏：\n'
        + listing)
    out = _flash_chat(prompt, 4000)
    if not out:
        return
    out = re.sub(r"^```\w*\s*|\s*```$", "", out.strip())
    try:
        for r in json.loads(out):
            i = r.get("i")
            if isinstance(i, int) and 0 <= i < len(items):
                items[i]["_angle"] = str(r.get("angle", ""))[:200]
                items[i]["_content_type"] = r.get("content_type", "decode")
                items[i]["_hook"] = str(r.get("hook", ""))[:120]
    except Exception as e:
        print(f"[scout2] 角度解析失败：{e}", file=sys.stderr)


# ── 主流程 ──────────────────────────────────────────────
def run(date: str, reader: str, prerank_n: int, angle_n: int, use_llm: bool) -> dict:
    cfg = yaml.safe_load((SCOUT_DIR / "sources.yaml").read_text(encoding="utf-8"))
    sources = [s for s in cfg.get("sources", []) if s.get("enabled", True)]
    reader_kws = reader_keywords(reader)
    concepts = concept_names()
    covered = covered_title_tokens()
    priors = load_perf_priors()

    all_items: list[dict] = []
    seen_urls = set()
    for s in sources:
        try:
            items = scout.fetch_source(s)
        except Exception as e:
            print(f"[scout2] {s['name']} 抓取失败：{e}", file=sys.stderr)
            continue
        for it in items:
            u = it.get("url", "")
            if not it.get("title") or (u and u in seen_urls):
                continue
            seen_urls.add(u)
            it["_source"] = s["name"]
            it["_weight"] = s.get("weight", 5)
            sc, reasons = cheap_score(it, reader_kws, concepts, covered, priors)
            it["_cheap"] = sc
            it["_reasons"] = reasons
            all_items.append(it)

    all_items.sort(key=lambda x: x["_cheap"], reverse=True)
    candidates = all_items[:prerank_n]

    if use_llm:
        llm_relevance(candidates, reader)
        for it in candidates:
            it["_final"] = it["_cheap"] + it.get("_rel", 0) * 1.5  # LLM 相关性权重
    else:
        for it in candidates:
            it["_final"] = it["_cheap"]
    candidates.sort(key=lambda x: x["_final"], reverse=True)

    top = candidates[:angle_n]
    if use_llm and top:
        llm_angles(top)

    # 结构化产物
    radar = {
        "date": date, "reader": reader, "generated_by": "scout2",
        "total_fetched": len(all_items), "scored": len(candidates),
        "items": [{
            "rank": i + 1, "title": it.get("title", ""), "url": it.get("url", ""),
            "summary": it.get("summary", ""), "source": it.get("_source", ""),
            "category": it.get("category", ""), "published": it.get("published", ""),
            "score": round(it.get("_final", 0), 1),
            "signals": it.get("_reasons", []),
            "relevance": it.get("_rel"), "relevance_why": it.get("_rel_reason"),
            "angle": it.get("_angle"), "content_type": it.get("_content_type"),
            "hook": it.get("_hook"),
        } for i, it in enumerate(candidates)],
    }
    return radar


def write_outputs(radar: dict, out_dir: Path) -> tuple[Path, Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    jp = out_dir / f"{radar['date']}.json"
    jp.write_text(json.dumps(radar, ensure_ascii=False, indent=1), encoding="utf-8")
    # 人读 .md（由 json 生成，单一来源是 json）
    lines = [f"---\ntitle: Radar {radar['date']}\ntype: radar\ncreated: {radar['date']}\n---\n",
             f"# Radar {radar['date']}\n",
             f"_共抓 {radar['total_fetched']} 条，打分 {radar['scored']} 条；scout2 多信号+LLM_\n"]
    for it in radar["items"][:30]:
        ang = f"\n  > 角度：{it['angle']}（{it.get('content_type','')}）" if it.get("angle") else ""
        rel = f" rel={it['relevance']}" if it.get("relevance") is not None else ""
        lines.append(f"- **[{it['score']}{rel}] {it['title']}** — [link]({it['url']})"
                     f"  `{it['source']}`{ang}")
    mp = out_dir / f"{radar['date']}.md"
    mp.write_text("\n".join(lines), encoding="utf-8")
    return jp, mp


def main():
    ap = argparse.ArgumentParser(description="选题引擎 v2")
    ap.add_argument("--date", default=datetime.date.today().isoformat())
    ap.add_argument("--reader", default="default")
    ap.add_argument("--prerank", type=int, default=30, help="LLM 打分的候选数")
    ap.add_argument("--angles", type=int, default=8, help="生成切入角度的 top 数")
    ap.add_argument("--no-llm", action="store_true", help="纯信号打分，不调 LLM")
    args = ap.parse_args()
    radar = run(args.date, args.reader, args.prerank, args.angles, use_llm=not args.no_llm)
    jp, mp = write_outputs(radar, REPO / "wiki" / "radar")
    print(json.dumps({"json": str(jp.relative_to(REPO)), "md": str(mp.relative_to(REPO)),
                      "fetched": radar["total_fetched"], "scored": radar["scored"],
                      "top": [{"score": i["score"], "title": i["title"][:50],
                               "angle": (i.get("angle") or "")[:40]} for i in radar["items"][:5]]},
                     ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
