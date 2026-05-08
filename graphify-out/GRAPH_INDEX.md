# GRAPH_INDEX.md - markdown 语义图（手扫版）

扫描路径：`deep-decode-repo/`  ·  节点数：33  ·  边数：60

**这个图扫的是 markdown 之间的引用关系**：wikilink (`[[x]]`)、相对路径 (`[](./x.md)`)、
路径常量 (`{WIKI_ROOT}knowledge/x.md`)。比 graphify-out/graph.json 的 AST 浅图丰富得多。

## God Nodes（被引用最多 = 核心抽象）

- `knowledge/writing-style.md` — 被引用 **6** 次
- `knowledge/svg-design.md` — 被引用 **6** 次
- `knowledge/channel-specs.md` — 被引用 **5** 次
- `{slug}.md` — 被引用 **4** 次
- `{slug}/` — 被引用 **4** 次
- `pipelines/decode/` — 被引用 **3** 次
- `pipelines/claudecode_deep_decode/` — 被引用 **3** 次
- `knowledge/html-template.md` — 被引用 **3** 次
- `文件名` — 被引用 **2** 次
- `knowledge/podcast-aesthetics.md` — 被引用 **2** 次
- `knowledge/horizontal-vertical-analysis-prompt.md` — 被引用 **2** 次
- `pipeline/queue.jsonl` — 被引用 **1** 次
- `context/` — 被引用 **1** 次
- `./AGENTS.md` — 被引用 **1** 次
- `./knowledge/writing-style.md` — 被引用 **1** 次

## Hub Files（引用别人最多 = 索引型文件）

- `SKILL.md` — 出度 **19**
- `docs/ground-truth.md` — 出度 **13**
- `decode-entity-SKILL.md` — 出度 **8**
- `README.md` — 出度 **6**
- `knowledge/horizontal-vertical-analysis-prompt.md` — 出度 **4**
- `AGENTS.md` — 出度 **3**
- `knowledge/writing-style.md` — 出度 **3**
- `examples/2026-03-29-pm-ai-exponential/2026-03-29-PM遇上指数级AI拆解.md` — 出度 **2**
- `examples/2026-04-09-managed-agents-architecture/2026-04-09-managed-agents-architecture.md` — 出度 **1**
- `examples/2026-04-12-mythos-reckless-helpfulness/next-session-tasks.md` — 出度 **1**

## 完整邻接表

见 `markdown-index.json` 的 `edges` 数组。

## 给 agent 的查询提示

```python
import json
g = json.load(open('graphify-out/markdown-index.json'))
# 谁引用了 writing-style.md：
[e['from'] for e in g['edges'] if 'writing-style' in e['to']]
# SKILL.md 引用了哪些文件：
[e['to'] for e in g['edges'] if e['from'] == 'SKILL.md']
```