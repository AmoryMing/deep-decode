# 热点 × 历史 对照表（Hot-History Pairs）

> **性质**：知识库（LLM Wiki）。持续积累的"当代 AI 热点 ↔ 被遗忘的历史先驱"配对。
> **方法论**：当热点变得眼花缭乱，就必须扎根历史。读历史才能看未来。
> **启发**：Karpathy 2026-04-04 gist，从 Vannevar Bush 1945 Memex 得灵感做 LLM Wiki
> **窗口**：百年尺度（1900s-2026）
> **配套 Skill**：`/hot-history`（自动挖新 pair，从热点到血缘链到文章）

---

## 方法论（三件事）

### 1. 时间差套利

热点是"大家在看什么"，历史是"这件事以前谁试过、谁想过"。把 2026 的热点拿去 1945 翻，翻到被遗忘的灵感——别人没读过，所以你能抢到别人看不到的角度。

### 2. 血缘链条

每个 pair 必须有 **3 个以上时间节点**的血缘链。不是"A 启发了 Z"这种空话，而是：
```
起点（1945）→ 中间继承人（1965, 1968...）→ 断裂期（why）→ 重连（today）
```

### 3. 断裂-重连判断

**核心问题**：当时为什么没成？今天为什么能成？
**核心答案形式**：因为 X 拐点（具体技术 / 经济 / 社会变化）→ 所以 Y 今天能兑现

不能笼统说"算力够了"——要精确到：哪个模块是卡点，哪个具体发明解除了卡点。

---

## 筛选标准（什么 pair 值得入库）

1. **当前热点**必须在近 2 年（2024-2026）有显著讨论
2. **历史根源**必须早于 1995（留足 30 年回声时间）
3. **血缘链条**清晰可讲（3-6 个节点）
4. **断裂-重连**有明确技术/经济拐点
5. **冷门度**：中英文都很少人讲过更佳（时间差价值）

---

## 写作潜力评分（每 pair 必填）

| 维度 | 0-10 | 说明 |
|---|---|---|
| 冷门度 | ? | 多少人写过，越少越好 |
| 拐点锋利度 | ? | 一句话能否拍醒人 |
| 自指性 | ? | 跟用户当前做的事关联度 |
| 一手材料可得性 | ? | 论文/档案好不好找 |
| **综合推荐** | ? | 是否值得展开写深度文章 |

---

## Pair 列表（5 个种子，subagent 填充中 / 已填）

### Pair 1: LLM Wiki × Memex (Bush 1945)

**状态**：🟡 subagent 深挖中（第二篇候选）

**一句话论点**：Bush 1945 画的饼，80 年后 LLM 终于能兑现

**血缘链**：
- 1945 Bush《As We May Think》— Memex 构想：个人策展 + 关联轨迹
- 1962/1968 Engelbart NLS — 工程化实现，学习曲线 KO
- 1965 Nelson Hypertext / Xanadu — 理论完美，30 年 vaporware
- 1991 Berners-Lee WWW — 砍功能换采用，link rot + 变广告牌
- 2019-2022 Roam / Obsidian — 工具级复活，维护成本转给用户
- 2026-04-04 Karpathy LLM Wiki — LLM 当私人图书管理员

**拐点判断**：LLM 解决了"抽取归档"和"近距离关联"，把"品味/策展"留给 schema（人写）

**待填**：精确原文引用 / 社区复刻情况 / 哲学深度分析（subagent 2 产出）

---

### Pair 2: Skills × Frames (Minsky 1974)  ⭐ 第一篇推荐

**状态**：🟡 subagent 深挖中（第一篇候选，subagent 1）

**一句话论点**：Marvin Minsky 1974 年就把 SKILL.md 想好了

**血缘链**：
- 1974 Minsky《A Framework for Representing Knowledge》— Frames：slot + default + procedure
- 1977 Schank & Abelson《Scripts》— 餐厅脚本原型，frame 的过程化变体
- 1980s 专家系统热潮（CYC / MYCIN / KEE / KRL / LOOPS）— Frame-based 大规模商用尝试
- 1987 LISP 机崩盘 + 知识获取瓶颈（Feigenbaum's paradox）— Frames 方向死
- 2022-2024 Prompt engineering → Custom Instructions → MCP — 不自觉重做 Frames
- 2025 Anthropic Claude Skills — 结构上是 Frames 复活体

**拐点判断**：Frames 死于"人工填 slot 不 scale"，Skills 活于"LLM 从自然语言自动填 slot"

**自指性**：⭐ 用户自己在大量写 SKILL.md，这篇既是历史文章又是工作方法论背书

**待填**：Minsky 1974 精确原文 / Skills-Frames 对照表 / Minsky 晚年反思 / 中英文舆论扫描（subagent 1 产出）

---

### Pair 3: Agent × Cybernetics (Wiener 1948) + SHRDLU (Winograd 1970)

**状态**：🟡 subagent 种子中（subagent 3）

**一句话论点**：感知-决策-行动的闭环，控制论 1948 就建完了

**血缘链**（占位）：
- 1948 Wiener《Cybernetics》— 负反馈闭环理论
- 1970 Winograd SHRDLU — blocks world 里 NLP+推理+动作走通
- ...（subagent 填充）

**待填**：完整血缘 / 拐点 / 原文引用 / 评分（subagent 3 产出）

---

### Pair 4: Reasoning/o1 × System 1-2 (Simon&Newell 1972 + Kahneman 2011)

**状态**：🟡 subagent 种子中（subagent 3）

**一句话论点**：符号 AI 先做 System 2，神经网络回头补 System 1，现在又回来做 System 2

**血缘链**（占位）：
- 1972 Simon & Newell《Human Problem Solving》— GPS 通用问题求解器，推理链建模
- 2011 Kahneman《Thinking Fast and Slow》— 双过程理论通俗化
- 2024 OpenAI o1 / DeepSeek R1 — RL 在 token 流里做 chain-of-thought
- ...（subagent 填充）

**待填**：完整血缘 / 拐点 / 原文引用 / 评分（subagent 3 产出）

---

### Pair 5: RAG × Bartlett 1932 + Internet Archive 1996

**状态**：🟡 subagent 种子中（subagent 3）

**一句话论点**：记忆不是录像回放，是 schema-based 重构——1932 年的心理学实验就证明了

**血缘链**（占位）：
- 1932 Bartlett《Remembering》— schema-based 记忆重构实验
- 1996 Brewster Kahle Internet Archive — 大规模外部存储+可检索
- 2020+ embedding + vector DB — schema-based retrieval 首次机器实现
- ...（subagent 填充）

**待填**：完整血缘 / 拐点 / 原文引用 / 评分（subagent 3 产出）

---

## 下一批候选（等第一批写完后再挖）

- **Tool use × Unix philosophy (1970s Bell Labs, McIlroy)** — 小工具组合思想
- **Constitutional AI × Asimov 机器人三定律 (1942)** — 伦理约束如何编码
- **Multi-agent × Minsky Society of Mind (1986)** — 智能作为多智能体涌现
- **Dynabook × Alan Kay (1972) + 现代个人 AI 助手** — 个人计算愿景
- **World Model × Schmidhuber 1990s 工作** — 预测即智能
- **Embedding × Osgood 1957 Semantic Differential** — 心理学向量化语义
- **Fine-tuning × Behaviorism / 斯金纳操作性条件反射** — 奖励塑造行为

---

## 信源清单（通用）

> 专属信源按 pair 归档在各自 pipeline 目录

### 一手历史文献
- Internet Archive (archive.org)
- ACM Digital Library（CS 论文，1947+）
- MIT DSpace（AI Memo 系列）
- Bell Labs Archive
- Xerox PARC / Engelbart Institute 档案
- Atlantic Monthly Archives（Memex 1945 原文在此发）
- Stanford Encyclopedia of Philosophy（思想史最权威）

### 二手史家
- Gwern.net — 冷门深挖
- Stratechery — 商业史 + 当代
- Simon Willison — LLM 实战
- Ars Technica History series
- Computer History Museum oral history
- Acquired podcast — 公司史深度

### 中文圈（补位：没有真正的 Gwern）
- 宝玉 xp（@dotey）— 最接近 Simon Willison 中文对标
- 赵赛坡 Dailyio — 人机关系/认知史
- 远川研究所 — 商业考古
- 晚点 LatePost — 一手采访 + 技术史专题
- 乱翻书（潘乱 podcast）— 产品向考古

### 当前热点
- Karpathy gists + tweets — 本人就在做时间差
- Anthropic blog + Claude changelog
- HN front page + hn.algolia.com
- Swyx latent.space
- arxiv cs.CL / cs.AI + HF daily papers

---

## 更新日志

- **2026-04-21** 初始化，5 个 pair 种子入库，subagent 深挖中
- 后续更新追加到此处
