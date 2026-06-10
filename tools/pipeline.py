#!/usr/bin/env python3
"""pipeline.py — Content Factory 技能图谱 2.0 的确定性执行器。

它是步骤顺序的唯一权威。人不再手数 18 步散文；这个 runner 读 skillgraph.yaml，
按 depends_on 拓扑排序，对每个节点做"输入门 → 跑 → 产物契约校验"，缺产物 / 契约失败
就 HARD-FAIL 并停下，绝不静默跳过（修复"漏步骤"）。状态落回 spec_lock.yaml 的
pipeline_state 块，可断点续跑。

用法（在 output/<slug>/ 目录里跑，或 --root 指定）：
  python3 tools/pipeline.py status   --root output/2026-05-29-foo
  python3 tools/pipeline.py next     --root output/2026-05-29-foo
  python3 tools/pipeline.py verify   --root output/2026-05-29-foo
  python3 tools/pipeline.py gate m.article --root output/2026-05-29-foo

约定：
  - 产物路径相对 project root（output/<slug>/）。
  - 引用仓库资源的契约字段（如 tone: readers/{reader}/tone.yaml）按 repo root 解析，
    并用 spec_lock.config 做 {reader}/{voice}/{style} 占位替换。
  - "完成" = 节点所有 produces 的 contract 全过。
"""
from __future__ import annotations
import argparse, json, sys, glob, re, datetime
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("需要 PyYAML：pip3 install pyyaml")

REPO = Path(__file__).resolve().parents[1]
GRAPH_PATH = REPO / "skillgraph.yaml"

C = {"g": "\033[32m", "r": "\033[31m", "y": "\033[33m", "d": "\033[2m", "b": "\033[1m", "x": "\033[0m"}
def c(s, col): return f"{C[col]}{s}{C['x']}"


# ───────────────────────── 加载 ─────────────────────────
def load_graph() -> dict:
    return yaml.safe_load(GRAPH_PATH.read_text(encoding="utf-8"))

def load_spec(root: Path) -> dict:
    p = root / "spec_lock.yaml"
    if not p.exists():
        sys.exit(f"找不到 {p}。先建项目 + 确认 Strategy Spec。")
    return yaml.safe_load(p.read_text(encoding="utf-8")) or {}

def save_spec(root: Path, spec: dict) -> None:
    (root / "spec_lock.yaml").write_text(
        yaml.safe_dump(spec, allow_unicode=True, sort_keys=False), encoding="utf-8")

def subst(s: str, cfg: dict) -> str:
    if not isinstance(s, str): return s
    for k in ("reader", "style", "voice", "content_type"):
        s = s.replace("{" + k + "}", str(cfg.get(k, k)))
    return s


# ───────────────────────── 节点索引 + 拓扑序 ─────────────────────────
def index_nodes(graph: dict) -> dict:
    idx = {}
    for n in graph.get("atoms", []) or []:
        n = dict(n); n.setdefault("layer", "atom"); idx[n["id"]] = n
    for n in graph.get("molecules", []) or []:
        idx[n["id"]] = n
    return idx

def expand_compound(graph: dict, spec: dict) -> list[dict]:
    """把 content_type 对应的 compound 展开成有序节点列表（含分发渠道展开）。"""
    cfg = spec.get("config", {}) or {}
    ctype = cfg.get("content_type", "decode")
    comp_id = f"c.{ctype}"
    comp = (graph.get("compounds", {}) or {}).get(comp_id)
    if not comp:
        sys.exit(f"skillgraph 无 compound {comp_id}（content_type={ctype}）")
    idx = index_nodes(graph)
    raw = list(comp.get("nodes", []))

    # 展开终端 c.distribute_all → 声明渠道的节点 + 合成终端节点
    channels = ((spec.get("artifacts", {}) or {}).get("distribution", {}) or {}).get("channels", []) \
        or (cfg.get("distribute", {}) or {}).get("channels", []) or ["email"]
    out: list[dict] = []
    for nid in raw:
        if nid == "c.distribute_all":
            dist = graph["compounds"]["c.distribute_all"]
            cmap = dist.get("channel_nodes", {})
            chan_node_ids = []
            for ch in channels:
                cn = cmap.get(ch)
                if cn and cn in idx:
                    chan_node_ids.append(cn)
                    if not any(x["id"] == cn for x in out):
                        out.append(idx[cn])
            # 合成终端节点：依赖所有渠道节点，产 READY.md + send.sh
            out.append({
                "id": "c.distribute_all", "layer": "compound", "title": dist["title"],
                "run": "script:tools/gen_send_sh.py", "is_terminal": True,
                "depends_on": chan_node_ids,
                "produces": dist.get("produces", []),
            })
        elif nid in idx:
            out.append(idx[nid])
        else:
            out.append({"id": nid, "layer": "?", "title": "(未注册)", "produces": [], "depends_on": []})

    # 修正跨 compound 的悬空依赖：渠道/分发节点的 depends_on 可能指向本 compound 不含的节点
    # （如 brief 里 m.email_package 声明依赖 m.video/m.factcheck，二者不在图中 → 会误判 ready）。
    # 规则：渠道节点 + 终端，统一追加对"内容主干末节点"的依赖（content backbone 的最后一个非渠道节点）。
    in_set = {n["id"] for n in out}
    chan_ids = set()
    dist = graph["compounds"].get("c.distribute_all", {})
    for cn in (dist.get("channel_nodes", {}) or {}).values():
        chan_ids.add(cn)
    backbone = [n["id"] for n in out
                if n["id"] not in chan_ids and n["id"] != "c.distribute_all"]
    content_tail = backbone[-1] if backbone else None
    if content_tail:
        for i, n in enumerate(out):
            if n["id"] in chan_ids or n["id"] == "c.distribute_all":
                deps = [d for d in (n.get("depends_on") or []) if d in in_set]
                if content_tail not in deps and content_tail != n["id"]:
                    deps.append(content_tail)
                out[i] = {**n, "depends_on": deps}
    return toposort(out)

def toposort(nodes: list[dict]) -> list[dict]:
    by_id = {n["id"]: n for n in nodes}
    listed = {n["id"]: i for i, n in enumerate(nodes)}
    visited, order = {}, []
    def visit(nid, stack):
        if nid in visited: return
        if nid in stack:  # 环：保守保留 listed 序，不崩
            return
        stack.add(nid)
        for d in sorted([d for d in by_id.get(nid, {}).get("depends_on", []) if d in by_id],
                        key=lambda x: listed.get(x, 1e9)):
            visit(d, stack)
        stack.discard(nid); visited[nid] = True
        order.append(by_id[nid])
    for n in sorted(nodes, key=lambda n: listed[n["id"]]):
        visit(n["id"], set())
    return order


# ───────────────────────── 契约校验（runner 的心脏） ─────────────────────────
def check_contract(root: Path, spec: dict, path: str, contract: dict) -> tuple[bool, str]:
    cfg = spec.get("config", {}) or {}
    kind = (contract or {}).get("kind", "file_exists")
    p = root / subst(path, cfg)

    if kind == "file_exists":
        return (p.exists(), "存在" if p.exists() else f"缺 {path}")

    if kind == "min_bytes":
        if not p.exists(): return (False, f"缺 {path}")
        sz = p.stat().st_size
        return (sz >= contract["min"], f"{sz}B" + ("" if sz >= contract["min"] else f" < {contract['min']}"))

    if kind == "json_has_keys":
        if not p.exists(): return (False, f"缺 {path}")
        try: data = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e: return (False, f"JSON 解析失败 {e}")
        miss = [k for k in contract["keys"] if k not in (data or {})]
        return (not miss, "ok" if not miss else f"缺 key {miss}")

    if kind == "frontmatter_has":
        if not p.exists(): return (False, f"缺 {path}")
        fm = parse_frontmatter(p.read_text(encoding="utf-8"))
        miss = [k for k in contract.get("keys", []) if k not in fm]
        return (not miss, "ok" if not miss else f"frontmatter 缺 {miss}")

    if kind == "glob_min_count":
        n = len(glob.glob(str(root / subst(contract["glob"], cfg))))
        return (n >= contract["min"], f"{n} 个" + ("" if n >= contract["min"] else f" < {contract['min']}"))

    if kind == "png_for_each_svg":
        svgs = glob.glob(str(root / subst(contract["svg"], cfg)))
        pngdir = root / subst(contract["png"], cfg)
        missing = [Path(s).stem for s in svgs if not (pngdir / (Path(s).stem + ".png")).exists()]
        return (not missing and bool(svgs), "ok" if svgs and not missing else f"缺 PNG {missing or '(无 svg)'}")

    if kind == "audio_visual_sync":
        return check_av_sync(root)

    if kind == "tone_match":
        return check_tone(root, spec, contract)

    if kind == "channel_draft_ready":
        # 渠道节点自己产 _state/<chan>.draft 标记文件；存在 = draft-ready
        return (p.exists(), "draft-ready" if p.exists() else f"渠道 {contract.get('chan')} 未到 draft-ready")

    if kind == "imap_draft":
        # 由 send_email.py --draft 写 _state/email.draft；这里只查标记
        mp = root / "_state" / "email.draft"
        return (mp.exists(), "IMAP 草稿已建" if mp.exists() else "无 IMAP 草稿标记")

    return (False, f"未知 contract kind: {kind}")


def parse_frontmatter(text: str) -> dict:
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m: return {}
    try: return yaml.safe_load(m.group(1)) or {}
    except Exception: return {}


def check_av_sync(root: Path) -> tuple[bool, str]:
    """镜像 templates/content/decode.md § 7 的音画同步硬条件。"""
    plan_p, cap_p = root / "scene_plan_v3.json", root / "captions.json"
    if not plan_p.exists() or not cap_p.exists():
        return (False, "缺 scene_plan_v3.json / captions.json")
    try:
        plan = json.loads(plan_p.read_text(encoding="utf-8"))
        caps = json.loads(cap_p.read_text(encoding="utf-8"))
    except Exception as e:
        return (False, f"解析失败 {e}")
    segs = caps.get("segments", [])
    def seg_dur(i):
        s = segs[i]; return (s.get("end_ms", s.get("end", 0)*1000) - s.get("start_ms", s.get("start", 0)*1000)) / 1000
    for sc in plan.get("scenes", []):
        idxs = sc.get("narration_segment_idx")
        if not idxs: return (False, f"scene 缺 narration_segment_idx: {sc.get('kind')}")
        try: cap_dur = sum(seg_dur(i) for i in idxs)
        except Exception: return (False, "narration_segment_idx 越界")
        if abs(sc.get("duration_s", 0) - cap_dur) >= 0.2:
            return (False, f"scene 时长差 {abs(sc.get('duration_s',0)-cap_dur):.2f}s ≥ 0.2s")
    return (True, "AV sync ok")


def check_tone(root: Path, spec: dict, contract: dict) -> tuple[bool, str]:
    """语气门：跑 tone_lint 的产物 tone_report.json；没有就提示先跑 a.tone_lint。"""
    rep = root / "tone_report.json"
    if not rep.exists():
        return (False, "缺 tone_report.json（先跑 tools/tone_lint.py）")
    try: data = json.loads(rep.read_text(encoding="utf-8"))
    except Exception as e: return (False, f"解析失败 {e}")
    if not data.get("pass", False):
        return (False, f"语气违规 {data.get('violations')[:3]}")
    if not data.get("voice_match", True):
        return (False, f"voice 不匹配 reader 期望: {data.get('voice_detail','')}")
    return (True, "语气 ok")


# ───────────────────────── 节点状态 ─────────────────────────
def node_status(root: Path, spec: dict, node: dict) -> tuple[str, list[str]]:
    """返回 (done|todo|fail, 明细)。无 produces 的旁路节点按 state 标记判定。"""
    # 显式 skipped（如创作者关掉视频）→ 即便有 produces 也算完成，让流水线绕过可选节点
    if (spec.get("pipeline_state", {}) or {}).get(node["id"], {}).get("status") == "skipped":
        return ("done", ["(已跳过 — 配置为非必需)"])
    produces = node.get("produces", []) or []
    if not produces:
        st = (spec.get("pipeline_state", {}) or {}).get(node["id"], {}).get("status", "pending")
        return ("done" if st in ("done", "skipped") else "todo", [f"(无强制产物，state={st})"])
    details, ok_all = [], True
    for pr in produces:
        ok, msg = check_contract(root, spec, pr["path"], pr.get("contract", {}))
        details.append(f"{'✓' if ok else '✗'} {pr['path']} — {msg}")
        ok_all = ok_all and ok
    return ("done" if ok_all else "todo", details)


def deps_done(root, spec, node, status_map) -> bool:
    return all(status_map.get(d) == "done" for d in node.get("depends_on", []) if d in status_map)


# ───────────────────────── 命令 ─────────────────────────
def cmd_status(root, graph, spec, verbose=True):
    nodes = expand_compound(graph, spec)
    cfg = spec.get("config", {})
    print(c(f"\n  Pipeline: {spec.get('project',{}).get('slug','?')}  "
            f"[type={cfg.get('content_type')} reader={cfg.get('reader')} "
            f"style={cfg.get('style')} voice={cfg.get('voice')}]", "b"))
    confirmed = spec.get("project", {}).get("strategy_confirmed", False)
    print(f"  Strategy 确认: {c('✓','g') if confirmed else c('✗ 未确认（唯一硬停）','y')}\n")
    status_map, next_node, details_all = {}, None, {}
    for n in nodes:
        st, det = node_status(root, spec, n)
        status_map[n["id"]] = st; details_all[n["id"]] = det
    for n in nodes:
        st = status_map[n["id"]]
        glyph = {"done": c("✓", "g"), "todo": c("·", "d"), "fail": c("✗", "r")}[st]
        blocked = not deps_done(root, spec, n, status_map) and st != "done"
        layer = {"atom": "a", "molecule": "m", "compound": "C"}.get(n.get("layer"), "?")
        line = f"  {glyph} [{layer}] {n['id']:<18} {n.get('title','')}"
        if blocked: line += c("  (上游未完)", "d")
        print(line)
        if verbose and st != "done":
            for d in details_all[n["id"]]:
                print(c(f"        {d}", "d"))
        if next_node is None and st != "done" and deps_done(root, spec, n, status_map):
            if n["id"] == "n.strategy" and not confirmed:
                next_node = n
            elif n["id"] != "n.strategy":
                next_node = n
            elif confirmed:
                continue
    done_n = sum(1 for s in status_map.values() if s == "done")
    print(c(f"\n  进度 {done_n}/{len(nodes)} 节点完成", "b"))
    if next_node:
        print(c(f"  ▶ 下一步: {next_node['id']} — {next_node.get('title')}", "y"))
        print(c(f"    run: {next_node.get('run','(agent)')}", "d"))
        if next_node.get("hard_stop"):
            print(c("    ⏸ 这是硬停：需要用户确认 Strategy Spec 后写 strategy_confirmed:true", "y"))
    else:
        print(c("  ✓ 全部节点完成 — ready-to-distribute。点 send.sh 里的 --send 发布。", "g"))
    return status_map

def build_status(root, graph, spec) -> dict:
    """计算全节点状态，返回纯数据 dict（机器可读，供 web/CI 用）。"""
    nodes = expand_compound(graph, spec)
    cfg = spec.get("config", {}) or {}
    confirmed = bool(spec.get("project", {}).get("strategy_confirmed", False))
    status_map = {}
    node_out = []
    for n in nodes:
        st, det = node_status(root, spec, n)
        status_map[n["id"]] = st
        node_out.append({"_n": n, "status": st, "details": det})
    next_node = None
    for item in node_out:
        n, st = item["_n"], item["status"]
        item["blocked"] = (not deps_done(root, spec, n, status_map)) and st != "done"
        if next_node is None and st != "done" and deps_done(root, spec, n, status_map):
            if n["id"] == "n.strategy" and not confirmed:
                next_node = n
            elif n["id"] != "n.strategy":
                next_node = n
    nodes_json = [{
        "id": it["_n"]["id"],
        "layer": it["_n"].get("layer", "?"),
        "title": it["_n"].get("title", ""),
        "status": it["status"],
        "blocked": it["blocked"],
        "details": it["details"],
    } for it in node_out]
    done_n = sum(1 for s in status_map.values() if s == "done")
    return {
        "slug": spec.get("project", {}).get("slug") or root.name,
        "content_type": cfg.get("content_type"),
        "reader": cfg.get("reader"),
        "style": cfg.get("style"),
        "voice": cfg.get("voice"),
        "confirmed": confirmed,
        "progress": {"done": done_n, "total": len(nodes_json)},
        "next": ({
            "id": next_node["id"], "title": next_node.get("title"),
            "run": next_node.get("run"), "hard_stop": bool(next_node.get("hard_stop")),
        } if next_node else None),
        "ready_to_distribute": next_node is None and done_n == len(nodes_json),
        "nodes": nodes_json,
    }


def cmd_status_json(root, graph, spec):
    print(json.dumps(build_status(root, graph, spec), ensure_ascii=False))


def cmd_next(root, graph, spec):
    # 复用 status 的计算，但只打印下一个
    nodes = expand_compound(graph, spec)
    status_map = {n["id"]: node_status(root, spec, n)[0] for n in nodes}
    confirmed = spec.get("project", {}).get("strategy_confirmed", False)
    for n in nodes:
        if status_map[n["id"]] == "done": continue
        if not deps_done(root, spec, n, status_map): continue
        if n["id"] == "n.strategy" and confirmed: continue
        print(json.dumps({"id": n["id"], "title": n.get("title"), "run": n.get("run"),
                          "hard_stop": bool(n.get("hard_stop")),
                          "produces": [p["path"] for p in n.get("produces", [])]}, ensure_ascii=False))
        return
    print(json.dumps({"id": None, "msg": "ready-to-distribute"}, ensure_ascii=False))

def cmd_verify(root, graph, spec):
    status_map = cmd_status(root, graph, spec, verbose=True)
    # 写回 pipeline_state
    ps = spec.setdefault("pipeline_state", {})
    now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")
    for nid, st in status_map.items():
        ps.setdefault(nid, {})
        ps[nid]["status"] = "done" if st == "done" else ps[nid].get("status", "pending")
        ps[nid]["checked"] = now
    save_spec(root, spec)
    fails = [k for k, v in status_map.items() if v == "fail"]
    sys.exit(1 if fails else 0)

def cmd_gate(root, graph, spec, node_id):
    nodes = {n["id"]: n for n in expand_compound(graph, spec)}
    if node_id not in nodes: sys.exit(f"无此节点: {node_id}")
    st, det = node_status(root, spec, nodes[node_id])
    for d in det: print(d)
    if st == "done":
        ps = spec.setdefault("pipeline_state", {}).setdefault(node_id, {})
        ps["status"] = "done"
        ps["done_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")
        save_spec(root, spec)
        print(c(f"✓ {node_id} 通过 — 已记入 pipeline_state", "g")); sys.exit(0)
    print(c(f"✗ {node_id} 未通过 — 不允许进入下一步", "r")); sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="技能图谱 2.0 确定性执行器")
    ap.add_argument("cmd", choices=["status", "next", "verify", "gate"])
    ap.add_argument("node", nargs="?", help="gate 命令的节点 id")
    ap.add_argument("--root", default=".", help="项目目录 output/<slug>/")
    ap.add_argument("--json", action="store_true", help="status: 机器可读 JSON 输出")
    a = ap.parse_args()
    root = Path(a.root).resolve()
    graph, spec = load_graph(), load_spec(root)
    if a.cmd == "status":
        cmd_status_json(root, graph, spec) if a.json else cmd_status(root, graph, spec)
    elif a.cmd == "next": cmd_next(root, graph, spec)
    elif a.cmd == "verify": cmd_verify(root, graph, spec)
    elif a.cmd == "gate":
        if not a.node: sys.exit("gate 需要节点 id")
        cmd_gate(root, graph, spec, a.node)

if __name__ == "__main__":
    main()
