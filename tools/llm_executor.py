#!/usr/bin/env python3
"""llm_executor.py — BYOK 生成执行器（M2.5）。

让生成节点（router / article / …）真的调 LLM 产出，而不是停在 blocked。
读 factory.config.yaml 的 provider+key+model，OpenAI 兼容协议调用（urllib，无新依赖）。
被 run_pipeline.py 的 driver 调用：生成节点有执行器 + 配了 key → 跑它，否则照旧 block。

设计原则（呼应项目铁律）：
- 产物落地即过 runner 契约才算 done（缺产物=卡住，executor 不自报成功）。
- 成本护栏：单次 max_tokens、单 run 调用数上限，读 factory.config.budget。
- key 只从 gitignore 的 factory.config.yaml 读，绝不写进任何产物/日志。
"""
from __future__ import annotations
import json, re, sys, urllib.request, urllib.error, datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent

try:
    import yaml
except ImportError:
    sys.exit("需要 PyYAML")


def now_date() -> str:
    return datetime.datetime.now().strftime("%Y-%m-%d")


# ── 配置 ────────────────────────────────────────────────
def load_config() -> dict | None:
    f = REPO / "factory.config.yaml"
    if not f.exists():
        return None
    try:
        return yaml.safe_load(f.read_text(encoding="utf-8")) or {}
    except Exception:
        return None


def has_key(cfg: dict | None) -> bool:
    if not cfg:
        return False
    prov = (cfg.get("models", {}).get("providers", {}) or {}).get(
        cfg.get("models", {}).get("default", ""), {})
    return bool(prov.get("api_key", "").strip())


def _provider_for(cfg: dict, node_id: str) -> tuple[dict, str]:
    models = cfg.get("models", {})
    pname = (models.get("nodes", {}) or {}).get(node_id) or models.get("default")
    prov = dict((models.get("providers", {}) or {}).get(pname, {}))
    model_override = (models.get("node_models", {}) or {}).get(node_id)
    if model_override:
        prov["model"] = model_override
    return prov, pname


# ── LLM 调用（OpenAI 兼容）──────────────────────────────
def chat(cfg: dict, node_id: str, messages: list[dict], max_tokens: int | None = None) -> str:
    prov, _ = _provider_for(cfg, node_id)
    base = prov.get("base_url", "").rstrip("/")
    key = prov.get("api_key", "")
    model = prov.get("model", "")
    if not (base and key and model):
        raise RuntimeError(f"{node_id}: provider 配置不全（base/key/model）")
    cap = max_tokens or cfg.get("budget", {}).get("max_tokens_per_call", 8000)
    body = json.dumps({"model": model, "messages": messages, "max_tokens": cap},
                      ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        base + "/chat/completions", data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{node_id}: HTTP {e.code} {e.read()[:200]}")
    msg = data["choices"][0]["message"]
    return (msg.get("content") or "").strip()


def fetch_url_text(url: str, limit: int = 12000) -> str:
    """抓 URL 正文（粗去标签）作为一手素材，避免从摘要写。失败返回空串。"""
    if not re.match(r"^https?://", url or ""):
        return ""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            html = r.read().decode("utf-8", "ignore")
    except Exception:
        return ""
    html = re.sub(r"(?is)<(script|style|nav|footer|header).*?</\1>", " ", html)
    text = re.sub(r"(?s)<[^>]+>", " ", html)
    text = re.sub(r"&[a-z]+;", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit]


# ── 节点执行器 ──────────────────────────────────────────
def _read(p: Path, n: int = 2500) -> str:
    return p.read_text(encoding="utf-8")[:n] if p.exists() else ""


def exec_router(root: Path, spec: dict, cfg: dict) -> tuple[bool, str]:
    """input → 5 原子推荐 + 切入角度，落 phase0_router.yaml。"""
    inp = spec.get("input", {}) or {}
    proj = spec.get("project", {}) or {}
    conf = spec.get("config", {}) or {}
    prompt = (
        f"你是内容工厂的选题路由。给定一个选题，输出一个 YAML 推荐配置。\n"
        f"标题：{proj.get('title', '')}\n输入类型：{inp.get('type')}\n来源：{inp.get('source')}\n"
        f"当前已选：content_type={conf.get('content_type')} reader={conf.get('reader')} style={conf.get('style')}\n\n"
        f"只输出 YAML，字段：recommended_angle（一句话切入角度）、"
        f"knowledge_domains（2-4 个领域标签数组）、title_hooks（3 个候选标题）、"
        f"risk_notes（一句话风险/盲区）。不要解释，不要 markdown 代码围栏。")
    out = chat(cfg, "n.router", [{"role": "user", "content": prompt}], max_tokens=2000)
    out = re.sub(r"^```ya?ml\s*|\s*```$", "", out.strip())
    # 校验是 YAML
    try:
        parsed = yaml.safe_load(out)
        if not isinstance(parsed, dict):
            raise ValueError
    except Exception:
        parsed = {"recommended_angle": out[:200], "raw": True}
    parsed["_generated_by"] = "deepseek via llm_executor"
    (root / "phase0_router.yaml").write_text(
        yaml.safe_dump(parsed, allow_unicode=True, sort_keys=False), encoding="utf-8")
    return True, f"router 推荐已写（angle: {str(parsed.get('recommended_angle'))[:60]}）"


def exec_article(root: Path, spec: dict, cfg: dict) -> tuple[bool, str]:
    """写正文 article.md（评论员视角，带 frontmatter 含 voice）。"""
    proj = spec.get("project", {}) or {}
    conf = spec.get("config", {}) or {}
    inp = spec.get("input", {}) or {}
    reader = conf.get("reader", "default")
    style = conf.get("style", "default")
    persona = _read(REPO / "readers" / reader / "persona.md", 1800)
    voice = _read(REPO / "styles" / style / "voice.md", 2200)
    red_lines = (spec.get("strategy", {}) or {}).get("red_lines", [])
    source_text = fetch_url_text(inp.get("source", "")) if inp.get("type") == "url" else ""
    angle = ""
    rp = root / "phase0_router.yaml"
    if rp.exists():
        try:
            angle = str((yaml.safe_load(rp.read_text(encoding="utf-8")) or {}).get("recommended_angle", ""))
        except Exception:
            pass

    sys_msg = (
        "你是顶级中文科技评论员，不是翻译。每个判断都要有证据。"
        f"\n\n【读者画像】\n{persona}\n\n【写作风格】\n{voice}\n\n"
        f"【硬铁律】\n" + "\n".join(f"- {r}" for r in red_lines) +
        "\n- 结构必须齐：标题钩子 → '本期关键词'（一节，提炼 1 个核心关键词 + 一段解释）"
        " → 正文分 4-6 章 → '对从业者意味着什么'一节 → 结尾'引用'区。"
        "\n- 不用'我认为'，用'这意味着''数据表明'。禁止 emoji、'让我们'、'值得注意的是'。"
        "\n- 英文引用必须翻译，引用原文 URL 放引用区第一条。")
    user_msg = (
        f"选题：{proj.get('title','')}\n切入角度：{angle}\n来源：{inp.get('source','')}\n\n"
        + (f"【一手素材（来源正文节选，据此写，勿编造）】\n{source_text}\n\n" if source_text else "")
        + "写一篇观点密度极高的深度解读。直接输出正文 markdown（从 # 标题开始），不要前后多余说明。")
    body = chat(cfg, "m.article", [{"role": "system", "content": sys_msg},
                                   {"role": "user", "content": user_msg}], max_tokens=8000)
    body = re.sub(r"^```\w*\s*|\s*```$", "", body.strip())
    if len(body) < 400:
        return False, f"正文过短（{len(body)} 字），疑似生成失败"
    fm = {
        "title": proj.get("title", ""), "type": conf.get("content_type", "decode"),
        "reader": reader, "style": style, "voice": conf.get("voice"),
        "created": now_date(), "updated": now_date(),
        "source": inp.get("source", ""), "generated_by": "deepseek-v4-pro (auto-draft)",
        "tags": [],
    }
    front = "---\n" + yaml.safe_dump(fm, allow_unicode=True, sort_keys=False) + "---\n\n"
    (root / "article.md").write_text(front + body, encoding="utf-8")
    return True, f"article.md 已写（{len(body)} 字）"


def exec_evidence(root: Path, spec: dict, cfg: dict) -> tuple[bool, str]:
    """从来源抽取结构化信源 + 证据点，落 phase0_sources.json + phase2_evidence.json。
    URL 则抓正文据此抽取；本地选题则据描述抽取（标注需补一手源）。"""
    inp = spec.get("input", {}) or {}
    proj = spec.get("project", {}) or {}
    src = inp.get("source", "")
    body = fetch_url_text(src) if inp.get("type") == "url" else ""
    prompt = (
        f"选题：{proj.get('title','')}\n来源：{src}\n"
        + (f"\n【来源正文节选】\n{body}\n" if body else "")
        + "\n抽取这篇内容的关键证据，只输出 JSON（不要代码围栏），结构："
        '{"claims":[{"point":"一句话论点","evidence":"支撑数据/事实","source":"出处URL或名称"}],'
        '"key_numbers":["关键数字+含义"],"blind_spots":["可能的盲区/反方"]}')
    out = chat(cfg, "m.evidence", [{"role": "user", "content": prompt}], max_tokens=3000)
    out = re.sub(r"^```\w*\s*|\s*```$", "", out.strip())
    try:
        ev = json.loads(out)
    except Exception:
        ev = {"claims": [], "raw": out[:1000]}
    ev["_generated_by"] = "deepseek via llm_executor"
    ev["_needs_primary_source"] = not bool(body)
    (root / "phase2_evidence.json").write_text(
        json.dumps(ev, ensure_ascii=False, indent=1), encoding="utf-8")
    sources = {"sources": [
        {"url": c.get("source", ""), "claim": c.get("point", "")}
        for c in ev.get("claims", []) if isinstance(c, dict)
    ], "primary_fetched": bool(body), "input_source": src}
    (root / "phase0_sources.json").write_text(
        json.dumps(sources, ensure_ascii=False, indent=1), encoding="utf-8")
    return True, f"证据已抽取（{len(ev.get('claims', []))} 个论点）"


def exec_strategy(root: Path, spec: dict, cfg: dict) -> tuple[bool, str]:
    """生成 Strategy Spec 草案 phase1_strategy.md。这是唯一硬停：只由 UI「确认」动作触发，
    自动 driver 不会跑它（写出 phase1 = 确认 = 放行下游）。"""
    proj = spec.get("project", {}) or {}
    inp = spec.get("input", {}) or {}
    angle = ""
    rp = root / "phase0_router.yaml"
    if rp.exists():
        try:
            angle = str((yaml.safe_load(rp.read_text(encoding="utf-8")) or {}).get("recommended_angle", ""))
        except Exception:
            pass
    prompt = (
        f"为这个选题写一份简短 Strategy Spec（markdown）。\n选题：{proj.get('title','')}\n"
        f"切入角度：{angle}\n来源：{inp.get('source','')}\n\n"
        "包含：## 标题角度（1 句）、## 核心论点 thesis（2-3 句）、## 反方/盲区（1-2 句）、"
        "## 目标读者（1 句）、## 红线（3 条铁律）。直接输出 markdown。")
    out = chat(cfg, "m.article", [{"role": "user", "content": prompt}], max_tokens=2500)
    out = re.sub(r"^```\w*\s*|\s*```$", "", out.strip())
    (root / "phase1_strategy.md").write_text(
        f"# Strategy Spec — {proj.get('title','')}\n\n_由 deepseek 生成，经你确认_\n\n{out}\n",
        encoding="utf-8")
    return True, "Strategy 草案已生成"


EXECUTORS = {
    "n.router": exec_router,
    "n.evidence": exec_evidence,
    "m.article": exec_article,
}

# 仅由 UI「确认」动作触发，不进自动 driver
CONFIRM_EXECUTORS = {"n.strategy": exec_strategy}


def run_confirm_node(root: Path, spec: dict, node_id: str) -> tuple[bool, str]:
    cfg = load_config()
    if not has_key(cfg):
        return False, "未配 key"
    fn = CONFIRM_EXECUTORS.get(node_id)
    return fn(root, spec, cfg) if fn else (False, f"{node_id} 无确认执行器")


def run_node(root: Path, spec: dict, node_id: str) -> tuple[bool, str]:
    cfg = load_config()
    if not has_key(cfg):
        return False, "未配 factory.config.yaml 或缺 key"
    fn = EXECUTORS.get(node_id)
    if not fn:
        return False, f"{node_id} 无生成执行器"
    return fn(root, spec, cfg)


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="BYOK 生成执行器 — 单节点跑")
    ap.add_argument("--root", required=True)
    ap.add_argument("--node", required=True)
    a = ap.parse_args()
    root = Path(a.root).resolve()
    spec = yaml.safe_load((root / "spec_lock.yaml").read_text(encoding="utf-8"))
    if a.node in CONFIRM_EXECUTORS:
        ok, msg = run_confirm_node(root, spec, a.node)
    else:
        ok, msg = run_node(root, spec, a.node)
    print(json.dumps({"ok": ok, "msg": msg}, ensure_ascii=False))
    sys.exit(0 if ok else 1)
