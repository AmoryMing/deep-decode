# deep-decode

**AI 内容深度拆解套装**。三种输入 × 四件套产出的一整套深度解读工作流。

## 三种输入模式

| 输入 | Skill 主体 | 适用 |
|------|-----------|------|
| 博客 / 推文 URL | [`SKILL.md`](./SKILL.md)（deep-decode 主线） | claude.com/blog、anthropic.com、openai.com、langchain.dev、x.com 长推等 |
| 产品 / 公司 / 人物名 | [`decode-entity-SKILL.md`](./decode-entity-SKILL.md)（横纵分析：时间轴 + 同期竞品） | 「拆 Cursor」「起底 Anthropic」「Karpathy 是谁」 |
| 热点话题 | [`hot-history-SKILL.md`](./hot-history-SKILL.md)（热点 × 历史先驱配对） | 「LLM Wiki 配 Bush 1945 Memex」「Skill 系统配 Minsky 1974 Frames」 |

每种模式都产出**四件套** —— 观点密度极高的深度解读 .md + 漫画风信息图 SVG + 图文 Word 文档 + 播客 .mp3。

不是翻译，不是摘要 —— 是**用自己的框架重构原文逻辑**。

## 这是什么

一套写给 AI Agent（Claude Code / Cursor / 其他支持 Skill 的环境）的**可复用工作流**。Skill 文件 + 写作风格知识库 + 完整生产现场快照 + 知识图谱索引，clone 下来就能让你的 agent 立刻具备这套能力。

## 快速上手

### 给 AI Agent 用

直接读 [`AGENTS.md`](./AGENTS.md) — 那是为 agent 写的入口索引，告诉它「想做什么 → 该读哪个文件 → 文件之间什么关系」。

### 给人看

1. 拆解效果长什么样 → 翻 [`examples/2026-04-09-managed-agents-architecture/`](./examples/2026-04-09-managed-agents-architecture/)（含 6 张 SVG + 完整 .docx）
2. hot-history 怎么写 → [`studio/pipelines/hot-history/2026-04-21-memex-llm-wiki/`](./studio/pipelines/hot-history/2026-04-21-memex-llm-wiki/)
3. 写作风格怎么定义的 → [`knowledge/writing-style.md`](./knowledge/writing-style.md)
4. 信息图怎么画 → [`knowledge/svg-design.md`](./knowledge/svg-design.md)
5. 横纵分析框架 → [`knowledge/horizontal-vertical-analysis-prompt.md`](./knowledge/horizontal-vertical-analysis-prompt.md)
6. 热点-历史配对法 → [`knowledge/hot-history-pairs.md`](./knowledge/hot-history-pairs.md)
7. 项目设计哲学 → [`docs/ground-truth.md`](./docs/ground-truth.md)
8. 全量生产现场快照 → [`studio/`](./studio/)（37 MB，1800+ 文件）

## 目录

```
SKILL.md                  # deep-decode 主 Skill（输入 URL）
decode-entity-SKILL.md    # decode-entity Skill（输入实体名，横纵分析）
hot-history-SKILL.md      # hot-history Skill（输入热点话题，历史配对）
skill-references/         # Skill 内部引用：评分提示、播客管线、踩坑清单
knowledge/                # 写作 / SVG / 播客 / 渠道规范 / 横纵 / 热点配对（顶层入口）
context/                  # 范文标注（拆开看「好文章为什么好」）
examples/                 # 4 篇精选代表作（含 managed-agents 完整四件套二进制）
docs/                     # 项目级文档：ground-truth / changelog / next_steps
studio/                   # 完整生产现场快照（37 MB） — vault 镜像基线
                          #   含 9 条流水线全量产出（除 mp3/docx/pdf 等大二进制）
graphify-out/             # 知识图谱：markdown-index.json (433/502) + GRAPH_REPORT (AST 15k 节点)
```

## 状态

**早期开源版本，欢迎在此基础上改造。** 当前 commit 即基线快照。

## License

MIT
