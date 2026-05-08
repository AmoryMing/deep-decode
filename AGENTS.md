# AGENTS.md — 给 AI Agent 的入口索引

**你（agent）一进来先读这份。** 这份文件回答三件事：(1) 这个 repo 是什么 (2) 你想干什么该读哪 (3) 文件之间什么关系。

---

## 1. 这个 repo 是什么

一套 **AI 内容深度拆解套装** 的可复用工作流。

**三种输入对应三个执行模式**：

| 输入类型 | 模式 | Skill 主体 | 状态 |
|---------|------|-----------|------|
| 博客 / 推文 URL | `deep-decode`（主线） | [`SKILL.md`](./SKILL.md) | ✅ 完整 |
| 产品 / 公司 / 人物名 | `decode-entity`（横纵分析） | [`decode-entity-SKILL.md`](./decode-entity-SKILL.md) | ✅ 完整 |
| 热点话题 | `hot-history`（热点 × 历史先驱配对） | [`hot-history-SKILL.md`](./hot-history-SKILL.md) | ⚠️ 基于历史产出反推的开源版（原 SKILL.md 在 placeholder 目录里没保留，遇到差异以 `studio/pipelines/hot-history/` 标杆为准） |

**输出统一为四件套**：深度解读 .md + 漫画风信息图 SVG + 图文 .docx + 播客 .mp3

**这是 Skill 不是程序**。你按 SKILL.md 步骤一步步做，不是跑命令。

---

## 2. 决策树：你想干什么 → 读哪

| 你的意图 | 必读文件 | 顺序 |
|---------|---------|------|
| **拆一篇博客 / 推文（有 URL）** | `SKILL.md` → `knowledge/writing-style.md` → `knowledge/polish-7steps.md` → `knowledge/svg-design.md` | 按顺序 |
| **拆一个实体（产品/公司/人物名）** | `decode-entity-SKILL.md` → `knowledge/horizontal-vertical-analysis-prompt.md` → `knowledge/writing-style.md` | 按顺序 |
| **写一篇热点话题深度文** | `hot-history-SKILL.md` → `knowledge/hot-history-pairs.md` → `knowledge/writing-style.md` | 按顺序 |
| **看完整四件套效果（标杆）** | `examples/2026-04-09-managed-agents-architecture/`（含 6 张 SVG + .docx） | — |
| **看 hot-history 完整产出** | `studio/pipelines/hot-history/2026-04-21-memex-llm-wiki/` 或 `2026-04-21-skills-frames/` | — |
| **理解写作铁律** | `knowledge/writing-style.md` | — |
| **理解 7 步精修流程** | `knowledge/polish-7steps.md` + `skill-references/evaluator-prompt.md` | — |
| **画概念信息图** | `knowledge/svg-design.md` | — |
| **做播客音频** | `knowledge/podcast-aesthetics.md` + `skill-references/podcast-pipeline.md` | — |
| **分发到公众号/小红书/飞书** | `knowledge/channel-specs.md` + `knowledge/html-template.md` | — |
| **学习写作技法（拆解范文）** | `context/范文标注-写作方法论.md` + `studio/context/范文 20260406.md`（原范文） | — |
| **理解项目哲学/血泪教训** | `docs/ground-truth.md` + `studio/lessons_project.md` | — |
| **避坑清单** | `skill-references/gotchas-exec.md` | 执行前过一遍 |
| **跨文件查关系** | `graphify-out/markdown-index.json` + `graphify-out/GRAPH_INDEX.md` | — |
| **看全部 16 篇 decode 历史范例** | `studio/pipelines/decode/` | — |
| **学 hot-history seed 怎么挑** | `studio/pipelines/hot-history/seeds/three-pairs-seed.md` | — |
| **看选题怎么管理** | `studio/topics/handpicked.md` + `studio/topics/AIpicked.md` | — |
| **看用户反馈** | `studio/feedback/` | — |

**最短上手路径**：`AGENTS.md`（本文）→ 选三个 SKILL 之一 → `knowledge/writing-style.md` → 范例文件 → 开干。

---

## 3. 文件依赖关系（速查）

```
SKILL.md (deep-decode)              ← 输入 URL 时的执行剧本
decode-entity-SKILL.md              ← 输入实体名时的执行剧本
hot-history-SKILL.md                ← 输入热点话题时的执行剧本
   │
   ├─ Phase 写作       → knowledge/writing-style.md
   ├─ Phase 横纵骨架   → knowledge/horizontal-vertical-analysis-prompt.md  (decode-entity 专属)
   ├─ Phase 配对挖掘   → knowledge/hot-history-pairs.md  (hot-history 专属)
   ├─ Phase 3.5 评测   → knowledge/polish-7steps.md + skill-references/evaluator-prompt.md
   ├─ Phase SVG        → knowledge/svg-design.md
   ├─ Phase 播客       → knowledge/podcast-aesthetics.md + skill-references/podcast-pipeline.md
   ├─ Phase 分发       → knowledge/html-template.md + knowledge/channel-specs.md
   └─ 执行避坑         → skill-references/gotchas-exec.md

knowledge/pipeline-standards.md   ← 全管线产出标准 + 质量门控

context/范文标注-写作方法论.md    ← 把好文章逐句标技法
docs/ground-truth.md              ← 项目设计哲学 + 4 天 0 产出事故复盘
docs/changelog.md                 ← 版本演进
docs/next_steps.md                ← 已知 TODO 和待补的能力

studio/                           ← 完整生产现场快照（vault 镜像）
   ├─ knowledge/                  ← 等价于顶层 knowledge/，原始位置
   ├─ context/feedback/topics/    ← 范文/反馈/选题
   ├─ pipelines/decode/           ← 16 篇 decode 全量
   ├─ pipelines/hot-history/      ← 2 篇 hot-history 完整产出 + 5 个 seed pair
   ├─ pipelines/claudecode_deep_decode/  ← Claude Code 源码深度拆解专题
   ├─ pipelines/manual实操手册/    ← 实操手册项目
   ├─ pipelines/practice/         ← 实操经验拆解范例
   ├─ pipelines/scripts/          ← TTS / 字幕 / 微信发布等管线脚本
   ├─ pipelines/pipeline_tools/   ← 小红书 / md2xhs 转换工具
   └─ pipelines/小红书参考/         ← 小红书参考资料
```

完整的语义图见 `graphify-out/GRAPH_INDEX.md`（手扫版，433 节点 502 边）。

---

## 4. 路径常量改写（重要）

原 Skill 在私有 vault 里用了这些常量：

```
WIKI_ROOT = vault/1-knowledge/project/content_creation企媒内容生产/
DECODE_ROOT = {WIKI_ROOT}pipelines/decode/
HOT_HISTORY_ROOT = {WIKI_ROOT}pipelines/hot-history/
CC_ROOT = {WIKI_ROOT}pipelines/claudecode_deep_decode/
```

**在这个 repo 里改写为**：

```
WIKI_ROOT = ./                           # repo 根
KNOWLEDGE = ./knowledge/                 # 顶层 knowledge（agent 推荐入口）
SKILL_REF = ./skill-references/          # 顶层 references
DECODE_ROOT = ./studio/pipelines/decode/             # 全量 decode 历史范例
HOT_HISTORY_ROOT = ./studio/pipelines/hot-history/   # 全量 hot-history 历史范例
CC_ROOT = ./studio/pipelines/claudecode_deep_decode/ # 全量 Claude Code 源码拆解资料
```

注意：`./knowledge/` 和 `./studio/knowledge/` 内容一致，**优先用顶层 `./knowledge/`**（更扁平，agent 容易找）。

---

## 5. 不要碰

- `*.bak` — 历史备份（已被 .gitignore 排除）
- `studio/pipelines/manual实操手册/` 下的 `material/` 子项目（如有）— 大体积素材，已被 .gitignore 过滤
- `graphify-out/cache/`、`graphify-out/converted/`、`graphify-out/graph.json`、`graphify-out/graph.html` — 工具中间产物 / 大文件，已被 .gitignore 过滤；agent 想用 graphify CLI 自己跑 `graphify update .` 重新生成

---

## 6. 知识图谱怎么用

**这个 repo 提供两层图谱**：

### 6.1 markdown 语义图（推荐先用）

`graphify-out/markdown-index.json` — **433 节点 502 边**，扫了所有 .md 之间的：
- wikilinks `[[xxx]]`
- 相对路径引用 `[](./xxx.md)`
- 路径常量引用 `{WIKI_ROOT}knowledge/xxx.md`、`{HOT_HISTORY_ROOT}xxx`

人读版在 `graphify-out/GRAPH_INDEX.md`，包含子目录文件分布、god nodes（被引最多的核心抽象）、hub files（出度最高的索引型文件）。

**Python 一行查询示例**：

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

要重新生成（修改文档后）：在 repo 根跑 `python3 graphify-out/build-md-index.py`（或读那个文件直接跑等价 heredoc）。

### 6.2 graphify AST 图（补充，覆盖代码）

`graphify-out/GRAPH_REPORT.md` 是 `graphify update .` 生成的 AST 图报告 —— **15,783 节点 / 61,565 边 / 170 社区**，覆盖了 `studio/pipelines/scripts/`、`studio/pipelines/pipeline_tools/` 等 Python/JS 文件的函数级依赖。原始 `graph.json` 33 MB 太大已经 .gitignore 排除，要查询请自己 clone 后跑：

```bash
graphify update .                          # 重新生成 graph.json
graphify query "writing-style 影响哪些阶段"
graphify path "SKILL.md" "polish-7steps.md"
graphify explain "writing-style.md"
```

---

## 7. 反馈

发现 Skill 跑不通 / 文档对不上 / 范例里有事实错误，请提 issue。
