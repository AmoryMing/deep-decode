#!/usr/bin/env python3
"""扫 repo 所有 .md 提取引用关系，生成 markdown-index.json + GRAPH_INDEX.md.

引用类型：
- wikilink   [[name]] 或 [[name|alias]]
- relative   [text](./path.md) 或 (path.md)
- constant   {WIKI_ROOT}knowledge/x.md 之类的路径常量
"""
from __future__ import annotations
import json
import re
import os
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent

WIKILINK = re.compile(r"\[\[([^\]|#]+?)(?:\|[^\]]+)?\]\]")
MD_LINK = re.compile(r"\]\(([^)]+\.md)(?:#[^)]*)?\)")
CONSTANT_PATH = re.compile(r"\{(?:WIKI_ROOT|DECODE_ROOT|CC_ROOT|KNOWLEDGE|SKILL_REF)\}([^\s`,)]+)")


def collect_md_files() -> list[Path]:
    files = []
    for p in ROOT.rglob("*.md"):
        rel = p.relative_to(ROOT)
        parts = rel.parts
        if any(part.startswith(".") for part in parts):
            continue
        if "graphify-out" in parts and rel.name != "GRAPH_INDEX.md":
            # 不扫 graphify 自己产出的报告
            if rel.name in {"GRAPH_REPORT.md"}:
                continue
        files.append(p)
    return files


def extract_title(text: str, fallback: str) -> str:
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def extract_edges(src_rel: str, text: str) -> list[dict]:
    edges = []
    for m in WIKILINK.finditer(text):
        edges.append({"from": src_rel, "to": m.group(1).strip(), "type": "wikilink"})
    for m in MD_LINK.finditer(text):
        target = m.group(1).strip()
        if target.startswith("http"):
            continue
        edges.append({"from": src_rel, "to": target, "type": "relative"})
    for m in CONSTANT_PATH.finditer(text):
        edges.append({"from": src_rel, "to": m.group(1).strip(), "type": "constant"})
    return edges


def main() -> None:
    files = collect_md_files()
    nodes = []
    edges = []
    for f in files:
        rel = str(f.relative_to(ROOT)).replace("\\", "/")
        text = f.read_text(encoding="utf-8", errors="ignore")
        nodes.append({
            "path": rel,
            "title": extract_title(text, rel),
            "size_bytes": f.stat().st_size,
            "lines": text.count("\n") + 1,
        })
        edges.extend(extract_edges(rel, text))

    out = ROOT / "graphify-out" / "markdown-index.json"
    out.write_text(json.dumps({
        "schema_version": 1,
        "root": str(ROOT.name),
        "node_count": len(nodes),
        "edge_count": len(edges),
        "nodes": nodes,
        "edges": edges,
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    # 易读版：按入度排序找 god nodes
    indeg = defaultdict(int)
    for e in edges:
        indeg[e["to"]] += 1
    god_nodes = sorted(indeg.items(), key=lambda x: -x[1])[:15]

    outdeg = defaultdict(int)
    for e in edges:
        outdeg[e["from"]] += 1
    hub_files = sorted(outdeg.items(), key=lambda x: -x[1])[:10]

    md_lines = [
        "# GRAPH_INDEX.md - markdown 语义图（手扫版）",
        "",
        f"扫描路径：`{ROOT.name}/`  ·  节点数：{len(nodes)}  ·  边数：{len(edges)}",
        "",
        "**这个图扫的是 markdown 之间的引用关系**：wikilink (`[[x]]`)、相对路径 (`[](./x.md)`)、",
        "路径常量 (`{WIKI_ROOT}knowledge/x.md`)。比 graphify-out/graph.json 的 AST 浅图丰富得多。",
        "",
        "## God Nodes（被引用最多 = 核心抽象）",
        "",
    ]
    for target, cnt in god_nodes:
        md_lines.append(f"- `{target}` — 被引用 **{cnt}** 次")

    md_lines.extend([
        "",
        "## Hub Files（引用别人最多 = 索引型文件）",
        "",
    ])
    for src, cnt in hub_files:
        md_lines.append(f"- `{src}` — 出度 **{cnt}**")

    md_lines.extend([
        "",
        "## 完整邻接表",
        "",
        "见 `markdown-index.json` 的 `edges` 数组。",
        "",
        "## 给 agent 的查询提示",
        "",
        "```python",
        "import json",
        "g = json.load(open('graphify-out/markdown-index.json'))",
        "# 谁引用了 writing-style.md：",
        "[e['from'] for e in g['edges'] if 'writing-style' in e['to']]",
        "# SKILL.md 引用了哪些文件：",
        "[e['to'] for e in g['edges'] if e['from'] == 'SKILL.md']",
        "```",
    ])

    (ROOT / "graphify-out" / "GRAPH_INDEX.md").write_text(
        "\n".join(md_lines), encoding="utf-8"
    )

    print(f"OK: {len(nodes)} nodes, {len(edges)} edges")
    print(f"  → {out}")
    print(f"  → {ROOT / 'graphify-out' / 'GRAPH_INDEX.md'}")


if __name__ == "__main__":
    main()
