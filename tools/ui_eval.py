#!/usr/bin/env python3
"""ui_eval.py — 网站客观评分器（autoresearch 的 evaluate_bpb 对标物）。

只读 ground truth：UI 自优化循环里 agent 不得修改本文件 + EVAL_CRITERIA.md。
吐 ui_score（0-100，越高越好）+ 分项 + 失败断言清单。判据全部机械化，不靠人/agent 自述。

A 黑话泄漏(25) + B 工程bug(25) + C 动线(25,需 playwright，缺则按 baseline 占位) + D 信任可见(25)

用法：
  python3 tools/ui_eval.py                 # 评当前运行的 dev server（默认 :3100）
  python3 tools/ui_eval.py --port 3100 --freeze-baseline   # 首次：把当前泄漏数冻结为 baseline
"""
from __future__ import annotations
import argparse, hashlib, hmac, html, json, os, re, subprocess, time, urllib.request
from pathlib import Path

HOME = Path.home()

REPO = Path(__file__).resolve().parents[1]
WEB = REPO / "web"
BASELINE_F = REPO / "wiki" / "_ui_eval_baseline.json"

ADMIN_PAGES = ["/admin", "/admin/setup", "/admin/discover", "/admin/produce",
               "/admin/runs", "/admin/queue", "/admin/analytics", "/admin/calendar"]
PUBLIC_PAGES = ["/"]

# A. 黑话黑名单（渲染给用户看的可见文本里出现即泄漏）
JARGON = [
    r"\bn\.[a-z_]+", r"\bm\.[a-z_]+", r"\ba\.[a-z_]+", r"\bc\.[a-z_]+",
    r"spec_lock", r"\brunner\b", r"\bBYOK\b", r"\bexecutor\b", r"tone_lint",
    r"\.yaml\b", r"factory\.config", r"perf_record", r"analytics_snapshot",
    r"\bcron\b", r"ANTHROPIC_API_KEY", r"gitignore", r"READY\.md", r"send_email\.py",
    r"硬停", r"契约", r"原子推荐",
    # 2026-06-12 真实 DOM 复核新增（blocked 原因里漏的）：
    r"script:", r"\batom:", r"\bskill:", r"agent/LLM", r"确定性节点",
]

# 已知盲区（待 playwright 版评分器补）：
#   1. 客户端组件（"use client"）渲染文本走 Next RSC <script> chunk，被 visible_text 当 script 剥掉
#      → 当前 A 维只可靠覆盖服务端组件文本。客户端文本须用 playwright 取 innerText 才准。
#   2. 水合 payload（__next_f.push）含原始 props（节点 id/title），用户不可见但在页面源码里。
#   两者都要求评分器升级为"渲染真实 DOM"而非"fetch+剥标签"。见 EVAL_CRITERIA「盲区」节。


def b64url(b: bytes) -> str:
    import base64
    return base64.b64encode(b).decode().replace("+", "-").replace("/", "_").rstrip("=")


def mint_token() -> str:
    secret = "dev-insecure-secret-change-me"
    envf = WEB / ".env.local"
    if envf.exists():
        for line in envf.read_text().splitlines():
            if line.startswith("AUTH_SECRET="):
                secret = line.split("=", 1)[1].strip()
    payload = f"muming.{int(time.time()*1000)}"
    sig = b64url(hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest())
    return f"{b64url(payload.encode())}.{sig}"


def fetch(port: int, path: str, token: str) -> str:
    req = urllib.request.Request(f"http://localhost:{port}{path}",
                                 headers={"Cookie": f"cf_session={token}"})
    # 绕本地代理
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    with opener.open(req, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")


def visible_text(html_str: str) -> str:
    """粗取可见文本：去 script/style/标签，留文本节点。（仅 --no-dom 回退用）"""
    s = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", html_str)
    s = re.sub(r"(?s)<[^>]+>", " ", s)
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s)


def dom_extract(port: int, token: str) -> dict | None:
    """用 playwright 取渲染后真实 DOM 的 innerText + 动线信号。
    解决客户端组件文本进 RSC <script> 的盲区。失败返回 None（调用方回退）。"""
    state = {"cookies": [{"name": "cf_session", "value": token, "domain": "localhost",
                          "path": "/", "expires": int(time.time()) + 86400,
                          "httpOnly": True, "secure": False, "sameSite": "Lax"}],
             "origins": []}
    Path("/tmp/ui-critique").mkdir(parents=True, exist_ok=True)
    Path("/tmp/ui-critique/state.json").write_text(json.dumps(state))
    env = dict(os.environ)
    env["UI_PORT"] = str(port)
    # playwright 装在 ~/node_modules（全局解析）
    env["NODE_PATH"] = str(HOME / "node_modules")
    for k in list(env):
        if "proxy" in k.lower():
            env.pop(k)
    env["NO_PROXY"] = "*"
    try:
        r = subprocess.run(["node", str(REPO / "tools" / "ui_eval_dom.mjs")],
                           capture_output=True, text=True, timeout=180, env=env, cwd=str(HOME))
        if r.returncode != 0 or not r.stdout.strip():
            return None
        return json.loads(r.stdout)
    except Exception:
        return None


def score_jargon(texts: dict) -> tuple[float, list]:
    leaks = []
    for path, txt in texts.items():
        for pat in JARGON:
            for m in re.finditer(pat, txt):
                leaks.append({"page": path, "term": m.group(0)})
    n = len(leaks)
    # 绝对刻度（不依赖 baseline，换测量方式也不失真）：0 泄漏=满分，≥30 泄漏=0
    pts = 20 * max(0.0, 1 - n / 30)
    return round(pts, 1), leaks


def score_flow(flow: dict) -> tuple[float, list]:
    """C 动线(20)：从真实 DOM 信号判关键路径是否可达/几步。"""
    checks = []

    def chk(name, ok):
        checks.append({"check": name, "pass": bool(ok)})

    # 发布动作可达：有「发送」按钮(好)
    chk("发布动作按钮化", flow.get("publish_button"))
    # 终端命令不再默认可见（折叠进高级 fallback 可接受）
    chk("终端命令已降级(非默认可见)", not flow.get("terminal_visible"))
    chk("选题页一键建项目", flow.get("discover_oneclick_create"))
    chk("产出页就地确认(不跨页)", flow.get("inline_confirm"))
    passed = sum(1 for c in checks if c["pass"])
    pts = 20 * passed / len(checks)
    return round(pts, 1), checks


def score_bugs(texts: dict, raw: dict) -> tuple[float, list]:
    checks = []

    def chk(name, ok):
        checks.append({"check": name, "pass": bool(ok)})

    portal = raw.get("/", "")
    chk("门户日期不含 GMT 全串", "GMT+" not in portal and "Standard Time" not in portal)
    # 卡片日期降序（取页面里所有 YYYY-MM-DD 或中文日期，宽松判断存在排序意图）
    dates = re.findall(r"20\d{2}-\d{2}-\d{2}", portal)
    chk("门户存在规整日期(非Date串)", len(dates) >= 3 or "GMT+" not in portal)
    # hasVideo：源码不再只认 horizontal/vertical
    content_ts = (WEB / "lib" / "content.ts").read_text(encoding="utf-8") if (WEB / "lib" / "content.ts").exists() else ""
    chk("hasVideo 认 video.mp4", 'video.mp4' in content_ts or 'video_horizontal' not in content_ts)
    # 一套编号：H2 里的圈号数字与 nav 不冲突——宽松判定 compliance/queue 不再各自占 ③④
    runs_t = texts.get("/admin/runs", ""); comp = texts.get("/admin/calendar", "")
    chk("运行/投放页头无重复圈号③④冲突", not ("③" in runs_t and "③" in comp))
    # accent 对比度：globals.css 的 accent 不再是 #d4541e（或仅大字）——查 css 常量
    css = ""
    for c in [(WEB/"app"/"globals.css"), (WEB/"app"/"global.css")]:
        if c.exists(): css = c.read_text(encoding="utf-8")
    chk("accent 非低对比 #d4541e", "#d4541e" not in css or "--color-accent-strong" in css)
    # blocked 状态有 CTA
    runs_raw = raw.get("/admin/runs", "")
    chk("运行页 blocked 带 CTA", 'data-cta' in runs_raw or "去接入" in runs_raw or "重试" in runs_raw)
    # 实时按钮文案
    chk("刷新按钮不误称暂停AI", "AI 仍在后台" in runs_raw or "自动刷新" in runs_raw or "实时（每" in runs_raw)

    passed = sum(1 for c in checks if c["pass"])
    pts = 20 * passed / len(checks)
    return round(pts, 1), checks


def score_visual() -> tuple[float, list]:
    """E 视觉美观/一致性(20)：纯静态扫 web/ 源码，机器可判。"""
    checks = []

    def chk(name, ok):
        checks.append({"check": name, "pass": bool(ok)})

    comp_files = list((WEB / "components").glob("*.tsx")) + \
        list((WEB / "app").rglob("page.tsx"))
    allsrc = "\n".join(f.read_text(encoding="utf-8") for f in comp_files if f.exists())

    # 1) 圆角收敛：不同 rounded-* 档 ≤ 4
    radii = set(re.findall(r"rounded-(sm|md|lg|xl|2xl|3xl|full)", allsrc))
    chk("圆角档数≤4", len(radii) <= 4)
    # 2) 字号地板：text-[10px]/[11px] 数量不高于 baseline
    tiny = len(re.findall(r"text-\[1[01]px\]", allsrc))
    base_tiny = load_baseline().get("tiny_font", max(tiny, 1))
    chk("小字号(≤11px)不增", tiny <= base_tiny)
    # 3) 状态色语义冲突：violet 二义性消除（queue/runs 不再同用 violet 表相反义）
    qb = (WEB / "components" / "QueueBoard.tsx")
    rc = (WEB / "components" / "RunsConsole.tsx")
    qv = "violet" in qb.read_text(encoding="utf-8") if qb.exists() else False
    rv = "violet" in rc.read_text(encoding="utf-8") if rc.exists() else False
    chk("violet 不再跨页二义", not (qv and rv))
    # 4) "未动"不再用 red（red 只留失败）
    qtext = qb.read_text(encoding="utf-8") if qb.exists() else ""
    none_red = bool(re.search(r'none:\s*"[^"]*red', qtext))
    chk('"未动"非红色', not none_red)
    # 5) 集中状态色映射（出现共享 statusColors 模块 = 一致性治理）
    chk("有集中状态色/标签映射模块",
        (WEB / "lib" / "nodeLabels.ts").exists() or (WEB / "lib" / "statusColors.ts").exists())

    passed = sum(1 for c in checks if c["pass"])
    pts = 20 * passed / len(checks)
    return round(pts, 1), checks


def score_content(content: dict) -> tuple[float, list]:
    """F 内容呈现/降噪(20)：成品图文混排 + 列表显标题非slug + 队列默认降噪。"""
    checks = []

    def chk(name, ok):
        checks.append({"check": name, "pass": bool(ok)})

    chk("成品页图文混排(正文≥3图)", (content.get("post_figures") or 0) >= 3)
    chk("产出列表显中文标题(非裸slug)", not content.get("produce_shows_slug", True))
    chk("审核队列默认降噪(≤40行)", (content.get("queue_rows_default") or 999) <= 40)
    passed = sum(1 for c in checks if c["pass"])
    pts = 20 * passed / len(checks)
    return round(pts, 1), checks


def score_trust(texts: dict, raw: dict) -> tuple[float, list]:
    checks = []

    def chk(name, ok):
        checks.append({"check": name, "pass": bool(ok)})

    produce = texts.get("/admin/produce", "")
    runs = texts.get("/admin/runs", "")
    overview = texts.get("/admin", "")
    queue = texts.get("/admin/queue", "")
    chk("开始按钮旁有耗时/成本/边界预告", ("分钟" in produce or "不会发布" in produce or "约" in produce))
    chk("运行卡显示 AI 调用用量", re.search(r"\d+\s*/\s*\d+\s*次", runs) is not None or "调用" in runs)
    seen = sum(1 for t in (overview, produce, queue) if "人审" in t or "人工" in t or "发布永远" in t)
    chk("人审承诺≥2处可见", seen >= 2)
    chk("Strategy 两步(先看草案)", "看过" in produce or "按这个写" in produce or "查看策略" in produce or "策略草案" in produce)
    chk("blocked 有断点续跑/可离开说明", "后台" in runs or "可以离开" in runs or "断点" in runs)

    passed = sum(1 for c in checks if c["pass"])
    pts = 20 * passed / len(checks)
    return round(pts, 1), checks


def load_baseline() -> dict:
    if BASELINE_F.exists():
        try:
            return json.loads(BASELINE_F.read_text())
        except Exception:
            return {}
    return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=3100)
    ap.add_argument("--freeze-baseline", action="store_true")
    ap.add_argument("--no-dom", action="store_true", help="跳过 playwright，回退 fetch+剥标签")
    a = ap.parse_args()

    token = mint_token()
    raw, texts = {}, {}
    # raw HTML 仍需（B 维查源码串/属性）
    for p in ADMIN_PAGES + PUBLIC_PAGES:
        try:
            raw[p] = fetch(a.port, p, token)
        except Exception as e:
            raw[p] = ""
            print(f"  ! 取 {p} 失败：{str(e)[:60]}")
    # 可见文本优先用 playwright 真实 DOM（覆盖客户端组件）；失败回退剥标签
    dom = None if a.no_dom else dom_extract(a.port, token)
    flow = {}
    if dom:
        texts = dom.get("pages", {})
        flow = dom.get("flow", {})
        text_src = "playwright 真实 DOM"
    else:
        texts = {p: visible_text(raw[p]) for p in raw}
        text_src = "回退：fetch+剥标签（客户端文本可能漏；装 playwright 更准）"

    if a.freeze_baseline:
        leaks = []
        for path, txt in texts.items():
            for pat in JARGON:
                leaks += [m.group(0) for m in re.finditer(pat, txt)]
        comp_files = list((WEB / "components").glob("*.tsx")) + list((WEB / "app").rglob("page.tsx"))
        allsrc = "\n".join(f.read_text(encoding="utf-8") for f in comp_files if f.exists())
        tiny = len(re.findall(r"text-\[1[01]px\]", allsrc))
        BASELINE_F.write_text(json.dumps(
            {"jargon_leaks": len(leaks), "tiny_font": tiny, "frozen": time.strftime("%Y-%m-%d"),
             "click_baseline_create_to_run": 5, "click_baseline_draft_to_send": 999},
            ensure_ascii=False, indent=1))
        print(f"baseline 冻结：jargon_leaks={len(leaks)} tiny_font={tiny}")

    a_pts, leaks = score_jargon(texts)
    b_pts, bugs = score_bugs(texts, raw)
    d_pts, trust = score_trust(texts, raw)
    e_pts, visual = score_visual()
    if dom:
        c_pts, flow_checks = score_flow(flow)
        f_pts, content_checks = score_content(dom.get("content", {}))
    else:
        c_pts, flow_checks = 10.0, [{"check": "需 playwright 实测", "pass": False}]
        f_pts, content_checks = 10.0, [{"check": "需 playwright 实测", "pass": False}]
    # 6 维各满 20（共 120）→ 归一化到 100
    raw_sum = a_pts + b_pts + c_pts + d_pts + e_pts + f_pts
    total = round(raw_sum / 120 * 100, 1)

    out = {
        "ui_score": total,
        "raw_sum_of_6dims": round(raw_sum, 1),
        "text_source": text_src,
        "breakdown": {"A_jargon": a_pts, "B_bugs": b_pts, "C_flow": c_pts,
                      "D_trust": d_pts, "E_visual": e_pts, "F_content": f_pts},
        "jargon_leaks": len(leaks),
        "bug_checks": bugs,
        "trust_checks": trust,
        "visual_checks": visual,
        "flow_checks": flow_checks,
        "content_checks": content_checks,
        "note": "6维各20分(共120)归一化到100；A=真实DOM绝对刻度；C/F=真实DOM信号",
    }
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
