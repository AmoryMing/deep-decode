#!/usr/bin/env python3
"""deepseek_polish.py — 发布前最后一道「中文语感润色」原子。

把已成稿的 article.md 交给 DeepSeek 做母语顺稿：只磨语感、去翻译腔/AI 腔，
**不动**事实、数字、引用、URL、markdown 结构、段落顺序、评论员判断。

为什么是独立一步（不并进 polish-pipeline）：
  polish-pipeline 做的是「结构层 + 散文层」的自我改写（grep 禁用词 + 段落重写）；
  这一步是把成稿再过一遍**另一个母语模型**的耳朵，专治残留的机翻腔/模型腔。
  放在 m.polish 之后、出图/分发之前，让所有下游渠道吃到的都是顺过的终稿。

用法（在 output/<slug>/ 跑，或给绝对路径）：
  python3 tools/deepseek_polish.py article.md
  python3 tools/deepseek_polish.py output/2026-06-28-foo/article.md --report deepseek_polish_report.json
  python3 tools/deepseek_polish.py article.md --dry-run      # 不写回，只看报告

key 解析优先级：--key > 环境变量 DEEPSEEK_POLISH_KEY > factory.config.yaml polish.deepseek
                 > factory.config.yaml models.providers.deepseek
config 在 .gitignore 里，key 不入库。
"""
from __future__ import annotations
import argparse, json, re, sys, time, urllib.request, urllib.error
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

try:
    import yaml
except ImportError:
    yaml = None


# ───────────────────────── 配置 ─────────────────────────
def load_cfg(cli_key: str | None) -> dict:
    cfg = {"base_url": "https://api.deepseek.com/v1", "model": "deepseek-chat",
           "temperature": 1.0, "api_key": None}
    fc = REPO / "factory.config.yaml"
    if yaml and fc.exists():
        try:
            data = yaml.safe_load(fc.read_text(encoding="utf-8")) or {}
        except Exception:
            data = {}
        pol = (((data.get("polish") or {}).get("deepseek")) or {})
        prov = (((data.get("models") or {}).get("providers") or {}).get("deepseek") or {})
        for src in (prov, pol):  # polish 段优先（后覆盖前）
            for k in ("base_url", "model", "temperature", "api_key"):
                if src.get(k) is not None:
                    cfg[k] = src[k]
    import os
    cfg["api_key"] = cli_key or os.environ.get("DEEPSEEK_POLISH_KEY") \
        or os.environ.get("DEEPSEEK_API_KEY") or cfg["api_key"]
    return cfg


SYSTEM = """你是中文母语的资深商业科技评论编辑，给一篇已成稿的文章做发布前最后一道「中文语感润色」。
唯一目标：让它读起来像一个有判断力的人用中文写的，而不是翻译腔或模型腔。

【绝对原样保留，不许动】
- 所有事实、数字、专有名词、公司/产品/人名、日期时间
- 所有英文引用原文与其中文译文、所有 URL 与链接文字
- markdown 结构：标题层级(#/##/###)、列表项目符号、引用块(>)、表格、图片 ![](...)、行内链接 [](...)、代码块
- 段落数量与先后顺序：一段进一段出，不合并、不拆分、不增删段落
- 文章的判断、立场、证据（评论员视角）

【只能做】
在不改变任何信息的前提下：调词序、删冗词、把翻译腔和 AI 腔换成自然中文人话、让句子有呼吸。

【重点清除的人机味】
- 「我认为 / 我们可以 / 让我们 / 值得注意的是 / 总而言之 / 综上所述 / 不仅……而且」这类套话
- 穷举式排比设问、空泛抽象名词堆叠、英式长定语从句直译
- 破折号滥用、万能三段式、过度绝对、自问自答、自我证明的语气

【输出】
只输出润色后的这段 markdown 正文本身。不要任何解释、前言、结语，不要用代码围栏把整段包起来。"""


def call_deepseek(cfg: dict, text: str, retries: int = 3) -> str:
    url = cfg["base_url"].rstrip("/") + "/chat/completions"
    body = json.dumps({
        "model": cfg["model"],
        "messages": [{"role": "system", "content": SYSTEM},
                     {"role": "user", "content": text}],
        "temperature": cfg.get("temperature", 1.0),
        "max_tokens": 8192,
        "stream": False,
    }).encode("utf-8")
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, data=body, method="POST", headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {cfg['api_key']}",
            })
            with urllib.request.urlopen(req, timeout=120) as r:
                data = json.loads(r.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
        except Exception as e:  # noqa
            last = e
            time.sleep(2 * (i + 1))
    raise RuntimeError(f"DeepSeek 调用失败（{retries} 次）: {last}")


# ───────────────────────── 文本处理 ─────────────────────────
FENCE = re.compile(r"```.*?```", re.S)

def protect_code(s: str):
    blocks = []
    def sub(m):
        blocks.append(m.group(0))
        return f"§§CODE{len(blocks)-1}§§"
    return FENCE.sub(sub, s), blocks

def restore_code(s: str, blocks: list[str]) -> str:
    for i, b in enumerate(blocks):
        s = s.replace(f"§§CODE{i}§§", b)
    return s

def split_sections(body: str) -> list[str]:
    """按 '## ' 二级标题切块（标题跟着它的正文）。首块是引子。"""
    parts = re.split(r"(?m)(?=^## )", body)
    return [p for p in parts if p != ""]

def prose_len(s: str) -> int:
    """估算一段里真正的'散文字符'数（剥掉标题/图片/链接壳/引用号/列表符/代码占位）。"""
    t = re.sub(r"§§CODE\d+§§", "", s)
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", t)        # 图片
    t = re.sub(r"^#{1,6}\s.*$", "", t, flags=re.M)     # 标题
    t = re.sub(r"^\s*>\s?", "", t, flags=re.M)         # 引用号
    t = re.sub(r"^\s*[-*]\s+", "", t, flags=re.M)      # 列表符
    t = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", t)     # 链接保留文字
    t = re.sub(r"https?://\S+", "", t)
    return len(t.strip())

def clean_output(out: str) -> str:
    out = out.strip()
    # 整段被 ```markdown ... ``` 包裹时剥壳
    m = re.match(r"^```[a-zA-Z]*\n(.*)\n```$", out, re.S)
    if m:
        out = m.group(1)
    return out


def polish_body(cfg: dict, body: str) -> tuple[str, list[dict]]:
    sections = split_sections(body)
    out_sections, log = [], []
    for idx, sec in enumerate(sections):
        plen = prose_len(sec)
        if plen < 25:  # 几乎没散文（纯标题/图片/引用块）→ 跳过，原样
            out_sections.append(sec)
            log.append({"section": idx, "prose_chars": plen, "status": "skip-no-prose"})
            continue
        protected, blocks = protect_code(sec)
        try:
            raw = call_deepseek(cfg, protected)
        except Exception as e:
            out_sections.append(sec)
            log.append({"section": idx, "prose_chars": plen, "status": f"error-keep:{e}"})
            continue
        polished = restore_code(clean_output(raw), blocks)
        # 安全门：输出过短 / 丢了图片或链接 → 判为不可信，保留原段
        in_imgs = sec.count("![");  out_imgs = polished.count("![")
        in_links = sec.count("](");  out_links = polished.count("](")
        ratio = len(polished) / max(1, len(sec))
        if (not polished.strip()) or ratio < 0.55 or out_imgs < in_imgs or out_links < in_links:
            out_sections.append(sec)
            log.append({"section": idx, "prose_chars": plen, "status": "reject-unsafe",
                        "ratio": round(ratio, 2), "imgs": [in_imgs, out_imgs],
                        "links": [in_links, out_links]})
            continue
        changed = polished.strip() != sec.strip()
        out_sections.append(polished)
        log.append({"section": idx, "prose_chars": plen,
                    "status": "polished" if changed else "unchanged"})
    # 重组：模型会吃掉段首/段尾空行 → 段间统一补一个空行，保证 '## ' 前有空行、
    # 图片/段落与下一节标题不黏连（markdown 渲染需要）。
    result = ""
    for sec in out_sections:
        s = sec.strip("\n")
        if not s:
            continue
        if result:
            result += "\n\n"
        result += s
    return result + "\n", log


def split_frontmatter(text: str) -> tuple[str, str]:
    m = re.match(r"^(---\n.*?\n---\n)(.*)$", text, re.S)
    if m:
        return m.group(1), m.group(2)
    return "", text


def main():
    ap = argparse.ArgumentParser(description="DeepSeek 中文语感润色（发布前终稿）")
    ap.add_argument("article", help="article.md 路径")
    ap.add_argument("--key", default=None)
    ap.add_argument("--model", default=None)
    ap.add_argument("--report", default=None, help="报告 JSON 路径（默认与文章同目录 deepseek_polish_report.json）")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    art = Path(a.article).resolve()
    if not art.exists():
        sys.exit(f"找不到 {art}")
    cfg = load_cfg(a.key)
    if a.model:
        cfg["model"] = a.model
    if not cfg.get("api_key"):
        sys.exit("没有 DeepSeek key（--key / DEEPSEEK_POLISH_KEY / factory.config.yaml polish.deepseek）")

    raw = art.read_text(encoding="utf-8")
    fm, body = split_frontmatter(raw)
    new_body, log = polish_body(cfg, body)
    # frontmatter 与正文之间留一个空行（fm 以 '---\n' 结尾）
    new_text = (fm + "\n" + new_body.lstrip("\n")) if fm else new_body

    n_pol = sum(1 for x in log if x["status"] == "polished")
    n_rej = sum(1 for x in log if x["status"] == "reject-unsafe")
    n_err = sum(1 for x in log if str(x["status"]).startswith("error"))
    report = {
        "model": cfg["model"],
        "sections": len(log),
        "polished": n_pol,
        "unchanged": sum(1 for x in log if x["status"] == "unchanged"),
        "skipped": sum(1 for x in log if x["status"].startswith("skip")),
        "rejected_unsafe": n_rej,
        "errors": n_err,
        "chars_before": len(body),
        "chars_after": len(new_body),
        "verdict": "ok" if n_err == 0 and n_rej == 0 else "partial",
        "detail": log,
    }

    if not a.dry_run:
        bak = art.with_suffix(art.suffix + ".pre-deepseek")
        bak.write_text(raw, encoding="utf-8")
        art.write_text(new_text, encoding="utf-8")
    rp = Path(a.report) if a.report else art.parent / "deepseek_polish_report.json"
    rp.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps({k: report[k] for k in
                      ("model", "sections", "polished", "unchanged", "skipped",
                       "rejected_unsafe", "errors", "chars_before", "chars_after", "verdict")},
                     ensure_ascii=False))
    if report["verdict"] != "ok":
        print(f"⚠ 有 {n_rej} 段被安全门拒绝 / {n_err} 段出错，已保留原文，详见 {rp.name}", file=sys.stderr)


if __name__ == "__main__":
    main()
