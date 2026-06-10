#!/usr/bin/env python3
"""run_pipeline.py — 把一个项目沿技能图谱往前推的 driver。

它问 pipeline.py「下一个该跑的节点是谁」，如果那个节点的实现是**安全的确定性原子**
就执行它、过门、继续；否则（生成/agent 节点，或需要凭证/网络/模型的重原子）就把这次
run 停在 `blocked` 并写明原因——绝不静默跳过（这是 runner 的核心哲学，也是项目两个月
最大痛点 agent 走丢的解药）。

状态写到 output/<slug>/_state/run.json，web 工作台据此显示实时进度条 + 并行批次。

用法：
  python3 tools/run_pipeline.py --root output/<slug>            # 推到 blocked/done
  python3 tools/run_pipeline.py --root output/<slug> --once     # 只推一步
  python3 tools/run_pipeline.py --root output/<slug> --dry-run  # 只分类不执行
"""
from __future__ import annotations
import argparse, json, subprocess, sys, datetime, traceback
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
sys.path.insert(0, str(HERE))
import pipeline  # noqa: E402  复用 runner 的图加载 / 状态计算 / 契约校验
import llm_executor  # noqa: E402  BYOK 生成执行器（M2.5）


def now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")


# ── 安全自动执行的原子白名单 ────────────────────────────────
# 只放：幂等、无网络副作用、不覆盖正文/媒体的确定性原子。
# 其余确定性节点（tts / imagegen / video / 各渠道发送）需凭证或会重算大文件，
# 默认 NOT 自动跑——driver 会 block 并说明，由人或后续 BYOK executor 接手。
def _run_tone_lint(root: Path) -> tuple[bool, str]:
    r = subprocess.run(
        [sys.executable, str(REPO / "tools" / "tone_lint.py"),
         "--root", str(root), "--article", "article.md"],
        capture_output=True, text=True, timeout=120)
    out = (r.stdout or "") + (r.stderr or "")
    return (r.returncode == 0, out.strip()[-500:])


SAFE_AUTORUN = {
    "a.tone_lint": _run_tone_lint,
}


def classify_block(node: dict) -> str:
    """非自动执行节点 → 给一句精确的 blocked 原因。"""
    run = (node.get("run") or "").strip()
    if run.startswith(("skill:", "agent:")):
        return f"需要 agent/LLM：{run}（生成步骤，等 BYOK executor 或操作者）"
    if node.get("hard_stop"):
        return "硬停：需要在 UI 确认 Strategy Spec"
    if run:
        return f"确定性节点但需凭证/网络/模型：{run}（暂不自动跑，手动或后续接管）"
    return "无 run 实现，需人工处理"


def mark_state_done(root: Path, nid: str) -> None:
    """旁路节点（无 produces）成功跑完后，写 pipeline_state done——否则按 state=pending
    永远判不出 done，driver 会误 block。"""
    spec = pipeline.load_spec(root)
    ps = spec.setdefault("pipeline_state", {}).setdefault(nid, {})
    ps["status"] = "done"; ps["done_at"] = now()
    pipeline.save_spec(root, spec)


def write_run(root: Path, data: dict) -> None:
    st = root / "_state"
    st.mkdir(parents=True, exist_ok=True)
    data["updated_at"] = now()
    (st / "run.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")


def load_run(root: Path) -> dict:
    p = root / "_state" / "run.json"
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def drive(root: Path, once: bool = False, dry: bool = False, max_steps: int = 40) -> dict:
    graph = pipeline.load_graph()
    slug = root.name
    run = load_run(root)
    run.setdefault("slug", slug)
    run.setdefault("started_at", now())
    run.setdefault("history", [])
    run["status"] = "running"
    run["blocked_reason"] = None

    for _ in range(max_steps):
        spec = pipeline.load_spec(root)
        status = pipeline.build_status(root, graph, spec)
        run["progress"] = status["progress"]
        nxt = status["next"]
        run["current"] = nxt["id"] if nxt else None
        write_run(root, run)

        if nxt is None:
            prog = status["progress"]
            if prog["done"] >= prog["total"]:
                run["status"] = "done"
                run["history"].append({"node": None, "action": "done", "ok": True, "at": now(),
                                        "msg": "ready-to-distribute"})
            else:
                # 无可推进节点但未全完成 = 卡住（多半 Strategy 未确认 / 缺上游产物），不是 done
                run["status"] = "blocked"
                run["blocked_reason"] = (
                    f"无可推进节点但仅 {prog['done']}/{prog['total']} 完成"
                    "——多半 Strategy 未确认（去产出页确认）或上游缺产物")
                run["history"].append({"node": None, "action": "stalled", "ok": False,
                                       "at": now(), "msg": run["blocked_reason"]})
            break

        nid = nxt["id"]
        # 取完整节点（含 run / hard_stop）
        node = next((n for n in pipeline.expand_compound(graph, spec) if n["id"] == nid), nxt)

        # 可选节点按 spec 跳过（创作者关掉视频/播客 → 不 block 在这）
        arts = spec.get("artifacts", {}) or {}
        optional_off = {
            "m.video": arts.get("video_required") is False,
            "m.podcast": arts.get("podcast_required") is False,
        }
        if optional_off.get(nid) and not dry:
            sp = pipeline.load_spec(root)
            sp.setdefault("pipeline_state", {}).setdefault(nid, {})["status"] = "skipped"
            pipeline.save_spec(root, sp)
            run["history"].append({"node": nid, "action": "skipped", "ok": True,
                                   "at": now(), "msg": "配置为非必需，跳过"})
            continue

        # 解析 atom: 别名（如 m.tone_gate 的 run=atom:a.tone_lint → 跑 a.tone_lint）
        autorun_fn = SAFE_AUTORUN.get(nid)
        if autorun_fn is None:
            rf = (node.get("run") or "")
            if rf.startswith("atom:"):
                autorun_fn = SAFE_AUTORUN.get(rf.split(":", 1)[1].strip())

        if autorun_fn and not dry:
            try:
                ok, msg = autorun_fn(root)
            except Exception:
                ok, msg = False, "执行异常：" + traceback.format_exc()[-400:]
            # 旁路节点（无 produces）跑成功 → 标 state done，否则永远 pending
            if ok and not (node.get("produces") or []):
                mark_state_done(root, nid)
            # 跑完重新判定该节点是否过门
            spec2 = pipeline.load_spec(root)
            n2 = next((n for n in pipeline.expand_compound(graph, spec2) if n["id"] == nid), node)
            st2, det = pipeline.node_status(root, spec2, n2)
            passed = st2 == "done"
            run["history"].append({"node": nid, "action": "ran", "ok": passed, "at": now(),
                                   "msg": (msg or "")[-300:]})
            if not passed:
                run["status"] = "blocked"
                run["blocked_reason"] = f"{nid} 跑完但契约未过：{'; '.join(det)[:300]}"
                break
            if once:
                run["status"] = "running"
                break
            continue
        elif nid in llm_executor.EXECUTORS and not dry and not node.get("hard_stop"):
            cfg = llm_executor.load_config()
            if not llm_executor.has_key(cfg):
                reason = "需要 factory.config.yaml 填模型 key 才能跑生成节点"
                run["status"] = "blocked"; run["blocked_reason"] = f"{nid} — {reason}"
                run["history"].append({"node": nid, "action": "blocked", "ok": False,
                                       "at": now(), "msg": reason}); break
            # 成本护栏：单 run 的 LLM 调用上限
            cap = (cfg.get("budget", {}) or {}).get("max_calls_per_run", 12)
            if run.get("llm_calls", 0) >= cap:
                run["status"] = "blocked"
                run["blocked_reason"] = f"{nid} — 已达单 run LLM 调用上限 {cap}"
                break
            run["current"] = nid; write_run(root, run)  # 标注"生成中"
            ok, msg = False, ""
            for attempt in range(2):  # 节点级重试：长链偶发瞬时失败，整节点重跑一次
                try:
                    ok, msg = llm_executor.run_node(root, spec, nid)
                except Exception:
                    ok, msg = False, "生成异常：" + traceback.format_exc()[-300:]
                run["llm_calls"] = run.get("llm_calls", 0) + 1
                if ok:
                    break
                import time as _t; _t.sleep(3)
            # seedance 出片满足 m.video（不走 remotion 的 podcast/scene_plan 契约）
            if ok and nid == "m.video" and (root / "seedance_video.mp4").exists() \
                    and (root / "seedance_video.mp4").stat().st_size > 50000:
                sp = pipeline.load_spec(root)
                sp.setdefault("pipeline_state", {}).setdefault(nid, {})["status"] = "satisfied"
                pipeline.save_spec(root, sp)
            spec2 = pipeline.load_spec(root)
            n2 = next((n for n in pipeline.expand_compound(graph, spec2) if n["id"] == nid), node)
            st2, det = pipeline.node_status(root, spec2, n2)
            passed = st2 == "done"
            run["history"].append({"node": nid, "action": "generated", "ok": passed,
                                   "at": now(), "msg": (msg or "")[-300:]})
            if not passed:
                run["status"] = "blocked"
                run["blocked_reason"] = f"{nid} 生成完但契约未过：{'; '.join(det)[:300]}"
                break
            if once:
                run["status"] = "running"; break
            continue
        else:
            reason = classify_block(node)
            run["status"] = "blocked"
            run["blocked_reason"] = f"{nid} — {reason}"
            run["history"].append({"node": nid, "action": "blocked", "ok": False,
                                   "at": now(), "msg": reason})
            break

    run["log_tail"] = [f"{h['at']} [{h['action']}] {h.get('node') or '·'} "
                       f"{'ok' if h['ok'] else 'x'} {h.get('msg','')[:120]}"
                       for h in run["history"][-8:]]
    write_run(root, run)
    return run


def run_one_node(root: Path, nid: str) -> dict:
    """定向跑一个 SAFE_AUTORUN 节点（UI「重跑这一步」/ 测试用），不管上游。"""
    graph = pipeline.load_graph()
    run = load_run(root); run.setdefault("slug", root.name)
    run.setdefault("started_at", now()); run.setdefault("history", [])
    if nid not in SAFE_AUTORUN:
        run["status"] = "blocked"
        run["blocked_reason"] = f"{nid} 不在安全自动执行白名单"
        write_run(root, run); return run
    try:
        ok, msg = SAFE_AUTORUN[nid](root)
    except Exception:
        ok, msg = False, traceback.format_exc()[-400:]
    spec = pipeline.load_spec(root)
    n = next((x for x in pipeline.expand_compound(graph, spec) if x["id"] == nid), {"id": nid})
    if ok and not (n.get("produces") or []):
        mark_state_done(root, nid)
        spec = pipeline.load_spec(root)
    st, det = pipeline.node_status(root, spec, n)
    run["history"].append({"node": nid, "action": "ran", "ok": st == "done", "at": now(),
                           "msg": (msg or "")[-300:]})
    run["status"] = "done" if st == "done" else "blocked"
    run["blocked_reason"] = None if st == "done" else f"{nid} 跑完但契约未过：{'; '.join(det)[:300]}"
    run["progress"] = pipeline.build_status(root, graph, spec)["progress"]
    run["log_tail"] = [f"{h['at']} [{h['action']}] {h.get('node')} {'ok' if h['ok'] else 'x'}"
                       for h in run["history"][-8:]]
    write_run(root, run); return run


def main():
    ap = argparse.ArgumentParser(description="技能图谱 driver — 把项目往前推到 blocked/done")
    ap.add_argument("--root", required=True, help="项目目录 output/<slug>/")
    ap.add_argument("--once", action="store_true", help="只推一步")
    ap.add_argument("--dry-run", action="store_true", help="只分类不执行")
    ap.add_argument("--node", help="定向只跑这一个安全节点（不管上游）")
    ap.add_argument("--max-steps", type=int, default=40)
    a = ap.parse_args()
    root = Path(a.root).resolve()
    if not (root / "spec_lock.yaml").exists():
        sys.exit(f"找不到 {root}/spec_lock.yaml")
    if a.node:
        run = run_one_node(root, a.node)
    else:
        run = drive(root, once=a.once, dry=a.dry_run, max_steps=a.max_steps)
    print(json.dumps({"status": run["status"], "current": run.get("current"),
                      "progress": run.get("progress"), "blocked_reason": run.get("blocked_reason")},
                     ensure_ascii=False))
    sys.exit(0 if run["status"] in ("done", "running") else 2)


if __name__ == "__main__":
    main()
