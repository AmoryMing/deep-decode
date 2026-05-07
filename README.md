# deep-decode

**AI 内容深度拆解套装**。不只是博客拆解器 —— 是**三种输入 × 四件套产出**的一整套深度解读工作流。

## 三种输入模式

| 输入 | 模式 | 适用 |
|------|------|------|
| 博客 / 推文 URL | `deep-decode`（主线） | claude.com/blog、anthropic.com、openai.com、langchain.dev、x.com 长推等 |
| 产品 / 公司 / 人物名 | `decode-entity`（横纵分析） | 「拆 Cursor」「起底 Anthropic」「Karpathy 是谁」 |
| 热点话题 | `hot-history`（历史配对） | 「LLM Wiki 来龙去脉」「Agent 热潮从哪来」 |

每种模式都产出**四件套** —— 观点密度极高的深度解读 .md + 漫画风信息图 SVG + 图文 Word 文档 + 播客 .mp3。能看、能读、能听、能转发。

不是翻译，不是摘要 —— 是**用自己的框架重构原文逻辑**。

## 这是什么

一套写给 AI Agent（Claude Code / Cursor / 其他支持 Skill 的环境）的**可复用工作流**。Skill 文件 + 写作风格知识库 + 历史范例 + 知识图谱索引，clone 下来就能让你的 agent 立刻具备这套能力。

## 快速上手

### 给 AI Agent 用

直接读 [`AGENTS.md`](./AGENTS.md) — 那是为 agent 写的入口索引，告诉它「想做什么 → 该读哪个文件 → 文件之间什么关系」。

### 给人看

1. 拆解效果长什么样 → 翻 [`examples/`](./examples/) 任一篇的 `*.md`
2. 写作风格怎么定义的 → [`knowledge/writing-style.md`](./knowledge/writing-style.md)
3. 信息图怎么画 → [`knowledge/svg-design.md`](./knowledge/svg-design.md)
4. 横纵分析框架 → [`knowledge/horizontal-vertical-analysis-prompt.md`](./knowledge/horizontal-vertical-analysis-prompt.md)
5. 热点-历史配对法 → [`knowledge/hot-history-pairs.md`](./knowledge/hot-history-pairs.md)
6. 项目设计哲学 → [`docs/ground-truth.md`](./docs/ground-truth.md)

## 目录速查

```
SKILL.md                  # Skill 主体（执行步骤）
skill-references/         # Skill 内部引用：评分提示、播客管线、踩坑清单
knowledge/                # 写作 / SVG / 播客 / 渠道规范 / 横纵 / 热点配对（Skill 按阶段读取）
context/                  # 范文标注（拆开看「好文章为什么好」）
examples/                 # 4 篇代表性产出，含原始草稿 + 终稿 .md
docs/                     # 项目级文档：ground-truth / changelog / next_steps
graphify-out/             # 知识图谱（graph.json + GRAPH_REPORT.md）
```

## 状态

**早期开源版本，欢迎在此基础上改造。** 有事 issue 见。

## License

MIT
