# AGENTS.md — 给 AI Agent 的入口索引

**你（agent）一进来先读这份。** 这份文件回答三件事：(1) 这个 repo 是什么 (2) 你想干什么该读哪 (3) 文件之间什么关系。

---

## 1. 这个 repo 是什么

一套**AI 内容深度拆解套装**的可复用工作流。核心是 `SKILL.md` 描述的执行步骤，配套 `knowledge/` 里的写作/视觉/播客/横纵分析/热点配对标准，加 `examples/` 里 4 篇范例产出。

**三种输入对应三个执行模式**：

| 输入类型 | 模式 | Skill 文件位置 |
|---------|------|---------------|
| 博客/推文 URL | `deep-decode`（主线，本 repo 的 `SKILL.md`） | `SKILL.md` |
| 产品/公司/人物名 | `decode-entity`（横纵分析） | 框架在 `knowledge/horizontal-vertical-analysis-prompt.md` |
| 热点话题 | `hot-history`（历史先驱配对） | 框架在 `knowledge/hot-history-pairs.md` |

**输出统一为四件套**：深度解读 .md + 漫画风信息图 SVG + 图文 .docx + 播客 .mp3

**这是 Skill 不是程序**。你（agent）按 `SKILL.md` 的步骤一步步做，不是跑命令。

---

## 2. 决策树：你想干什么 → 读哪

| 你的意图 | 必读文件 | 顺序 |
|---------|---------|------|
| **跑一次完整深度拆解** | `SKILL.md` → `knowledge/writing-style.md` → `knowledge/polish-7steps.md` → `knowledge/svg-design.md` | 按顺序 |
| **只产文字稿，不出 SVG/播客** | `SKILL.md` § 工作流 → `knowledge/writing-style.md` | — |
| **理解写作铁律** | `knowledge/writing-style.md` | — |
| **理解 7 步精修流程** | `knowledge/polish-7steps.md` + `skill-references/evaluator-prompt.md` | — |
| **画概念信息图** | `knowledge/svg-design.md` | — |
| **做播客音频** | `knowledge/podcast-aesthetics.md` + `skill-references/podcast-pipeline.md` | — |
| **分发到公众号/小红书/飞书** | `knowledge/channel-specs.md` + `knowledge/html-template.md` | — |
| **学习写作技法（拆解范文）** | `context/范文标注-写作方法论.md` | — |
| **看实战范例** | `examples/2026-04-09-managed-agents-architecture/` ← 标杆 | 先看这篇 |
| **理解项目哲学/血泪教训** | `docs/ground-truth.md` | — |
| **避坑清单** | `skill-references/gotchas-exec.md` | 执行前过一遍 |
| **跨文件查关系** | `graphify-out/graph.json`（用 graphify CLI 查询） | — |

**最短上手路径**：`AGENTS.md`（本文）→ `SKILL.md` → `knowledge/writing-style.md` → `examples/2026-04-09-managed-agents-architecture/2026-04-09-managed-agents-architecture.md` → 开干。

---

## 3. 文件依赖关系（速查）

```
SKILL.md  ← 你的执行剧本
   │
   ├─ Phase 写作       → knowledge/writing-style.md
   ├─ Phase 3.5 评测   → knowledge/polish-7steps.md + skill-references/evaluator-prompt.md
   ├─ Phase SVG        → knowledge/svg-design.md
   ├─ Phase 播客       → knowledge/podcast-aesthetics.md + skill-references/podcast-pipeline.md
   ├─ Phase 分发       → knowledge/html-template.md + knowledge/channel-specs.md
   └─ 执行避坑         → skill-references/gotchas-exec.md

knowledge/horizontal-vertical-analysis-prompt.md  ← 实体拆解专用（输入是产品/公司名时）
knowledge/hot-history-pairs.md                    ← 热点-历史配对（输入是话题时）
knowledge/pipeline-standards.md                   ← 全管线产出标准（含质量门控）

context/范文标注-写作方法论.md  ← 把好文章逐句标技法，学风格的最快路径
docs/ground-truth.md            ← 项目设计哲学 + 4 天 0 产出事故复盘
docs/changelog.md               ← 版本演进
docs/next_steps.md              ← 已知 TODO 和待补的能力
```

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

`SKILL.md` 里所有 `{WIKI_ROOT}knowledge/xxx` 等价于 repo 内的 `knowledge/xxx`。

---

## 5. 不要碰

- `*.bak` — 历史备份，不是源
- `_archive/` — 归档（如有），仅作参考
- 任何 `material/`、`node_modules/`（这个 repo 已经过滤掉，但你二次创建时别带）

---

## 6. 知识图谱怎么用

**当前状态（重要）**：`graphify-out/graph.json` 是用 `graphify update` 生成的 **AST-only 浅图**，只覆盖了 `skill-references/create_sharing_doc_template.js` 里的 13 个函数节点 — **不包含 markdown 之间的引用关系**。

**真正的文件依赖图**：直接读上面 §3 「文件依赖关系（速查）」，那是手写的语义图，比浅图准确。

**想要 markdown 语义图谱**，在你的 AI 助手里跑 `/graphify --update`（或 `graphify add <file>` 逐文件加），让 LLM 扫一遍 markdown 提取概念边。完成后可以这样查：

```bash
graphify query "writing-style 影响哪些阶段"
graphify path "SKILL.md" "polish-7steps.md"
graphify explain "writing-style.md"
```

`graphify-out/GRAPH_REPORT.md` 有当前浅图的 god nodes 和社区聚类，但目前对你帮助有限（只有 JS 函数节点）。

---

## 7. 反馈

发现 Skill 跑不通 / 文档对不上 / 范例里有事实错误，请提 issue。
