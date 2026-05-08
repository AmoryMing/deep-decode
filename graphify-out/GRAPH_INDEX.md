# GRAPH_INDEX.md - markdown 语义图（手扫版 v2，含全量 studio 镜像）

扫描路径：`deep-decode-repo/`  ·  节点数：433  ·  边数：502

**这个图扫的是 markdown 之间的引用关系**：wikilink (`[[x]]`)、相对路径 (`[](./x.md)`)、
路径常量 (`{WIKI_ROOT}knowledge/x.md` / `{HOT_HISTORY_ROOT}...`)。

## 子目录文件分布

- `studio/` — 398 个 .md
- `examples/` — 13 个 .md
- `knowledge/` — 9 个 .md
- `(root)/` — 5 个 .md
- `skill-references/` — 3 个 .md
- `docs/` — 3 个 .md
- `context/` — 1 个 .md
- `graphify-out/` — 1 个 .md

## God Nodes（被引用最多 = 核心抽象）

- `产品全景` — 被引用 **19** 次
- `安装与配置` — 被引用 **17** 次
- `Excel核心功能` — 被引用 **15** 次
- `./README.md` — 被引用 **13** 次
- `限制与安全` — 被引用 **12** 次
- `PowerPoint核心功能` — 被引用 **11** 次
- `Subagents` — 被引用 **11** 次
- `Skills` — 被引用 **10** 次
- `knowledge/writing-style.md` — 被引用 **9** 次
- `knowledge/svg-design.md` — 被引用 **9** 次
- `企业部署` — 被引用 **9** 次
- `跨应用协作` — 被引用 **9** 次
- `knowledge/channel-specs.md` — 被引用 **8** 次
- `2026-04-17-your-harness-your-memory` — 被引用 **8** 次
- `最佳实践` — 被引用 **8** 次
- `README.md` — 被引用 **8** 次
- `Hooks` — 被引用 **8** 次
- `故障排除` — 被引用 **6** 次
- `Commands` — 被引用 **6** 次
- `knowledge/html-template.md` — 被引用 **5** 次

## Hub Files（引用别人最多 = 索引型文件）

- `studio/pipelines/manual实操手册/context/claude-code-best-practice/README.md` — 出度 **46**
- `SKILL.md` — 出度 **19**
- `studio/pipelines/claudecode_deep_decode/context/information_sources/claude-source-leaked-main/README.md` — 出度 **16**
- `studio/pipelines/claudecode_deep_decode/context/information_sources/claude-source-leaked-main/README_CN.md` — 出度 **16**
- `docs/ground-truth.md` — 出度 **13**
- `studio/ground-truth.md` — 出度 **13**
- `studio/manual实操手册-claudeFexcel/wiki/index.md` — 出度 **13**
- `studio/pipelines/manual实操手册/wiki/index.md` — 出度 **13**
- `studio/pipelines/manual实操手册/wiki/overview.md` — 出度 **13**
- `studio/manual实操手册-claudeFexcel/wiki/excel-features.md` — 出度 **11**
- `studio/manual实操手册-claudeFexcel/wiki/troubleshooting.md` — 出度 **11**
- `studio/manual实操手册-claudeFexcel/wiki/best-practices.md` — 出度 **10**
- `studio/manual实操手册-claudeFexcel/wiki/enterprise.md` — 出度 **10**
- `studio/manual实操手册-claudeFexcel/wiki/limitations.md` — 出度 **10**
- `studio/manual实操手册-claudeFexcel/wiki/overview.md` — 出度 **10**

## 完整邻接表

见 `markdown-index.json` 的 `edges` 数组（含 schema_version=2）。

## 给 agent 的查询提示

```python
import json
g = json.load(open('graphify-out/markdown-index.json'))
# 谁引用了 writing-style.md：
[e['from'] for e in g['edges'] if 'writing-style' in e['to']]
# SKILL.md 引用了哪些文件：
[e['to'] for e in g['edges'] if e['from'] == 'SKILL.md']
# 找 hot-history 相关所有文件：
[n['path'] for n in g['nodes'] if 'hot-history' in n['path']]
```