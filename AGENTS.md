# AGENTS.md — 给 AI Agent 的入口索引

**你（agent）一进来先读这份。** 这份文件回答三件事：(1) 这个 repo 是什么 (2) 你想干什么该读哪 (3) 文件之间什么关系。

---

## 1. 这个 repo 是什么

一套 **AI 内容深度拆解套装** 的可复用工作流。

**三种输入对应三个执行模式**：

| 输入类型 | 模式 | Skill 主体 | 状态 |
|---------|------|-----------|------|
| 博客 / 推文 URL | `deep-decode`（主线） | [`SKILL.md`](./SKILL.md) | ✅ 完整 |
| 产品 / 公司 / 人物名 | `decode-entity`（横纵分析：时间轴 + 同期竞品） | [`decode-entity-SKILL.md`](./decode-entity-SKILL.md) | ✅ 完整 |
| 热点话题 | `hot-history`（热点 × 历史先驱配对） | 暂只有框架 [`knowledge/hot-history-pairs.md`](./knowledge/hot-history-pairs.md) | ⚠️ Skill 主体未开源 |

**输出统一为四件套**：深度解读 .md + 漫画风信息图 SVG + 图文 .docx + 播客 .mp3

**这是 Skill 不是程序**。你（agent）按 SKILL.md 步骤一步步做，不是跑命令。

---

## 2. 决策树：你想干什么 → 读哪

| 你的意图 | 必读文件 | 顺序 |
|---------|---------|------|
| **拆一篇博客 / 推文（有 URL）** | `SKILL.md` → `knowledge/writing-style.md` → `knowledge/polish-7steps.md` → `knowledge/svg-design.md` | 按顺序 |
| **拆一个实体（产品/公司/人物名）** | `decode-entity-SKILL.md` → `knowledge/horizontal-vertical-analysis-prompt.md` → `knowledge/writing-style.md` | 按顺序 |
| **写一篇热点话题深度文** | `knowledge/hot-history-pairs.md` → `knowledge/writing-style.md`（Skill 主体待补，可参考 `SKILL.md` 工作流改造） | — |
| **只产文字稿，不出 SVG/播客** | `SKILL.md` § 工作流 → `knowledge/writing-style.md` | — |
| **理解写作铁律** | `knowledge/writing-style.md` | — |
| **理解 7 步精修流程** | `knowledge/polish-7steps.md` + `skill-references/evaluator-prompt.md` | — |
| **画概念信息图** | `knowledge/svg-design.md` + 看 `examples/2026-04-09-managed-agents-architecture/*.svg` 范例 | — |
| **做播客音频** | `knowledge/podcast-aesthetics.md` + `skill-references/podcast-pipeline.md` | — |
| **分发到公众号/小红书/飞书** | `knowledge/channel-specs.md` + `knowledge/html-template.md` | — |
| **学习写作技法（拆解范文）** | `context/范文标注-写作方法论.md` | — |
| **看完整四件套效果** | `examples/2026-04-09-managed-agents-architecture/`（含 6 张 SVG + 1 个 .docx） | 标杆 |
| **理解项目哲学/血泪教训** | `docs/ground-truth.md` | — |
| **避坑清单** | `skill-references/gotchas-exec.md` | 执行前过一遍 |
| **跨文件查关系** | `graphify-out/markdown-index.json` + `graphify-out/GRAPH_INDEX.md` | — |

**最短上手路径**：`AGENTS.md`（本文）→ `SKILL.md` 或 `decode-entity-SKILL.md` → `knowledge/writing-style.md` → `examples/2026-04-09-managed-agents-architecture/` → 开干。

---

## 3. 文件依赖关系（速查）

```
SKILL.md (deep-decode)              ← 输入是 URL 时的执行剧本
decode-entity-SKILL.md              ← 输入是实体名时的执行剧本（横纵分析）
   │
   ├─ Phase 写作       → knowledge/writing-style.md
   ├─ Phase 横纵骨架   → knowledge/horizontal-vertical-analysis-prompt.md  (decode-entity 专属)
   ├─ Phase 3.5 评测   → knowledge/polish-7steps.md + skill-references/evaluator-prompt.md
   ├─ Phase SVG        → knowledge/svg-design.md
   ├─ Phase 播客       → knowledge/podcast-aesthetics.md + skill-references/podcast-pipeline.md
   ├─ Phase 分发       → knowledge/html-template.md + knowledge/channel-specs.md
   └─ 执行避坑         → skill-references/gotchas-exec.md

knowledge/hot-history-pairs.md   ← 热点-历史配对框架（hot-history 模式专用）
knowledge/pipeline-standards.md  ← 全管线产出标准 + 质量门控

context/范文标注-写作方法论.md   ← 把好文章逐句标技法，学风格的最快路径
docs/ground-truth.md             ← 项目设计哲学 + 4 天 0 产出事故复盘
docs/changelog.md                ← 版本演进
docs/next_steps.md               ← 已知 TODO 和待补的能力
```

完整的语义图见 `graphify-out/GRAPH_INDEX.md`（手扫版，33 节点 60 边）。

---

## 4. 路径常量改写（重要）

原 Skill 在私有 vault 里用了这些常量：

```
WIKI_ROOT = vault/1-knowledge/project/content_creation企媒内容生产/
DECODE_ROOT = {WIKI_ROOT}pipelines/decode/
CC_ROOT = {WIKI_ROOT}pipelines/claudecode_deep_decode/
```

**在这个 repo 里改写为**：

```
WIKI_ROOT = ./                 # repo 根
DECODE_ROOT = ./examples/      # 范例和你的产出
KNOWLEDGE = ./knowledge/       # 写作/视觉/播客标准
SKILL_REF = ./skill-references/  # Skill 内部引用
```

`SKILL.md` 和 `decode-entity-SKILL.md` 里所有 `{WIKI_ROOT}knowledge/xxx` 等价于 repo 内的 `knowledge/xxx`。

---

## 5. 不要碰

- `*.bak` — 历史备份，不是源
- `_archive/` — 归档（如有），仅作参考
- 任何 `material/`、`node_modules/`（这个 repo 已经过滤掉，但你二次创建时别带）

---

## 6. 知识图谱怎么用

**这个 repo 提供两层图谱**：

### 6.1 markdown 语义图（推荐先用，本 repo 主要图谱）

`graphify-out/markdown-index.json` — **33 节点 60 边**，扫了所有 .md 之间的：
- wikilinks `[[xxx]]`
- 相对路径引用 `[](./xxx.md)`
- 路径常量引用 `{WIKI_ROOT}knowledge/xxx.md`

人读版在 `graphify-out/GRAPH_INDEX.md`，包含 god nodes（被引最多的核心抽象）和 hub files（出度最高的索引型文件）。

**Python 一行查询示例**：

```python
import json
g = json.load(open('graphify-out/markdown-index.json'))
# 谁引用了 writing-style.md：
[e['from'] for e in g['edges'] if 'writing-style' in e['to']]
# SKILL.md 引用了哪些文件：
[e['to'] for e in g['edges'] if e['from'] == 'SKILL.md']
```

要重新生成（修改文档后）：在 repo 根跑 `bash` heredoc 调 `graphify-out/build-md-index.py`，或直接重新执行该脚本。

### 6.2 graphify AST 图（补充，覆盖代码）

`graphify-out/graph.json` 是 `graphify update` 生成的 AST-only 浅图，**只覆盖**了 `skill-references/create_sharing_doc_template.js` 里的函数节点（13 个）。**不包含 markdown 关系** — markdown 关系请用上面的 §6.1。

想让 graphify 也扫 markdown 概念，在你的 AI 助手里跑 `/graphify --update`（让 LLM 提取语义边），完成后可以：

```bash
graphify query "writing-style 影响哪些阶段"
graphify path "SKILL.md" "polish-7steps.md"
graphify explain "writing-style.md"
```

---

## 7. 反馈

发现 Skill 跑不通 / 文档对不上 / 范例里有事实错误，请提 issue。
