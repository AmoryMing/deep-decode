# 三对 Pair 种子条目（Agent / Reasoning / RAG）

> **性质**：knowledge base 种子。subagent 3 产出。
> **状态**：种子完成，可作为 knowledge base 条目或后续文章素材。
> **产出日期**：2026-04-21

---

## Pair A: Agent × Cybernetics (Wiener 1948) + SHRDLU (Winograd 1970)

### 一句话论点
**Agent 不是新发明，是 Wiener 闭环的 LLM 版。**

### 血缘节点
- **1943** Rosenblueth/Wiener/Bigelow《Behavior, Purpose and Teleology》：把"目的性行为"还原为负反馈电路，取消机器与生物的本体论区隔
- **1948** Wiener《Cybernetics》：control + communication 合并为一门学问，steersman（κυβερνήτης）是词源
- **1970** Winograd SHRDLU（MIT AI-TR-235）：NLP+推理+规划+动作首次在一个程序里打通，但只活在 blocks world
- **2023-2024** OpenAI function calling / Anthropic MCP：tool use 协议标准化，blocks world 扩展成"任何有 API 的世界"

### 关键原文引用

> "It has long been clear to me that the modern ultra-rapid computing machine was in principle an ideal central nervous system to an apparatus for automatic control; and that its input and output need not be in the form of numbers or diagrams but might very well be, respectively, the readings of artificial sense organs, such as photoelectric cells or thermometers, and the performance of motors or solenoids."

> 现代高速计算机在原理上就是自动控制装置的理想中枢神经系统；它的输入输出不必是数字或图表，完全可以是人工感官（光电管、温度计）的读数，以及马达和螺线管的动作。

— Wiener, *Cybernetics*, Introduction p.27

SHRDLU 对话（1970 AI-TR-235）：

```
Person: Pick up a big red block.
Computer: OK.
Person: Grasp the pyramid.
Computer: I DON'T UNDERSTAND WHICH PYRAMID YOU MEAN.
```

### 当时为什么没成 / 今天为什么能成
SHRDLU 每一个名词、动词、空间关系都是 Winograd 手写的 Micro-Planner 规则。Blocks world 里 9 个物体、5 种形状，规则能穷举；搬到真实世界，长尾立刻爆炸。Winograd 自己 70 年代末就放弃这条路转去做 HCI，认定 symbolic+hand-coded 是死路。

**拐点**：LLM 把世界模型从"手写规则"换成"从文本压缩出来的先验"，tool use 协议（function calling/MCP）把"动作空间"从 blocks 扩到任何有 API 的东西——**Wiener 1948 设想的"马达和螺线管"终于换成了 HTTP 请求**。

### 一手信源清单
- Wiener 1948《Cybernetics》→ https://archive.org/details/cybernetics-or-communication-and-control-in-the-animal-and-the-machine-norbert-wiene-ocr
- Rosenblueth/Wiener/Bigelow 1943 → https://www.sfipress.org/06-rosenblueth-wiener-bigelow-1943
- Winograd 1971 MIT AI-TR-235（DSpace）→ https://dspace.mit.edu/handle/1721.1/7095
- Winograd 原站 SHRDLU 对话实录 → https://hci.stanford.edu/winograd/shrdlu/
- Anthropic MCP 协议 spec → https://modelcontextprotocol.io/specification

### 写作潜力评分
| 维度 | 分 |
|---|---|
| 冷门度 | 6/10（SHRDLU 拆过的人多，但"Wiener→Agent" 17 年跨度的血缘线很少人串起来）|
| 拐点锋利度 | 9/10（"tool use = 从 blocks world 扩到任何有 API 的世界"）|
| 自指性 | 10/10（用户在做 PM 替身 / Kanban / 数字员工 全是 agent 产品）|
| 一手材料可得性 | 9/10 |
| **综合** | **8.5/10** |

### 一句话判断
**subagent 3 推第一写**。血缘链条长、拐点锋利、用户每天在 build agent 有足够 skin in the game。

---

## Pair B: Reasoning/o1 × System 1-2 (Simon & Newell 1972 + Kahneman 2011)

### 一句话论点
**符号 AI 只有 System 2，神经网络只有 System 1，o1 是缝合手术。**

### 血缘节点
- **1957** Newell/Shaw/Simon GPS（General Problem Solver）：means-ends analysis，第一次把"推理"写成可运行程序
- **1972** Newell & Simon《Human Problem Solving》：把人类推理建模为 problem space + search + operator 三件套
- **2011** Kahneman《Thinking, Fast and Slow》：把双系统说法从学术圈带进大众词汇
- **2024.09** OpenAI o1 / **2025.01** DeepSeek-R1：RL 让 CoT 从 prompt trick 长成模型内置能力

### 关键原文引用

> "The problem solver's search for a solution is an odyssey through the problem space, from one knowledge state to another, until his current knowledge state includes the problem solution."

> 问题解决者在问题空间里做的是一次奥德赛式的漫游——从一个知识状态走向下一个知识状态，直到当前状态里包含了答案。

— Newell & Simon, *Human Problem Solving*, 1972, p.89

DeepSeek-R1 2501.12948：

> "Pure reinforcement learning can incentivize reasoning capabilities in LLMs without any supervised data, highlighting the potential of self-evolution through RL... the model naturally learns to allocate more thinking time to a problem by reevaluating its initial approach."

### 当时为什么没成 / 今天为什么能成
GPS 假设世界可以干净地写成 state + operator + goal，但真实世界里"从抽屉里拿把钥匙开门"涉及的常识操作数就爆掉了——**符号 AI 的 System 2 死于没有 System 1（感知+常识）供养**，这就是 Hubert Dreyfus 1972 年在《What Computers Can't Do》里钉棺材的那一刀。

**拐点**：Transformer 先把 System 1 做到了能从 pixel/token 压出世界先验，然后 RL（o1 / R1）让 CoT 在推理时真的分配计算——**Simon 1972 手画的 problem space 现在长在 embedding 上，search 是 autoregressive decoding。Simon 对了 50 年，只是等到了 System 1**。

### 一手信源清单
- Newell & Simon 1972《Human Problem Solving》→ https://psycnet.apa.org/record/1973-10478-000
- Newell/Shaw/Simon 1959 GPS 原论文 → https://stacks.stanford.edu/file/druid:xp695bx5654/xp695bx5654.pdf
- OpenAI o1 blog "Learning to Reason with LLMs" → https://openai.com/index/learning-to-reason-with-llms/
- DeepSeek-R1 arxiv → https://arxiv.org/abs/2501.12948
- Kahneman 节选（免费）→ https://www.scientificamerican.com/article/kahneman-excerpt-thinking-fast-and-slow/

### 写作潜力评分
| 维度 | 分 |
|---|---|
| 冷门度 | 4/10（"o1 = System 2"已是媒体口水词）|
| 拐点锋利度 | 8/10（"Simon 对了 50 年只是等 System 1"）|
| 自指性 | 6/10（用户用 reasoning 模型但不直接 build 它）|
| 一手材料可得性 | 8/10 |
| **综合** | **6.5/10** |

### 一句话判断
**最容易写烂**——Kahneman 梗已经被 AI 媒体吃穿。要写就必须下到 Newell & Simon 1972 原书的 problem space 公式去，否则沦为"又一篇 o1 科普"。放最后或不写。

---

## Pair C: RAG × Bartlett 1932 + Internet Archive 1996

### 一句话论点
**RAG 不是搜索+拼接，是 Bartlett 的 schema 重构上机。**

### 血缘节点
- **1932** Bartlett《Remembering》：War of the Ghosts 实验证明记忆=按 schema 重构，不是录像回放
- **1970s** Schank & Abelson scripts/frames：把 Bartlett 的 schema 工程化成 AI 知识结构（餐厅 script）
- **1996** Brewster Kahle 创立 Internet Archive：首次证明"全人类外部记忆+可检索"在工程上能跑
- **2020** Lewis et al. *Retrieval-Augmented Generation for Knowledge-Intensive NLP*（FAIR）：embedding + DPR + seq2seq，schema-based retrieval 第一次长在神经网络里

### 关键原文引用

> "Remembering is not the re-excitation of innumerable fixed, lifeless and fragmentary traces. It is an imaginative reconstruction, or construction, built out of the relation of our attitude towards a whole active mass of organised past reactions or experience, and to a little outstanding detail which commonly appears in image or in language form."

> 记忆不是对大量固定、死寂、碎片化痕迹的再激活。它是一种想象性的重构——建立在我们对整个有组织的过去经验团块的态度之上，加上一点通常以图像或语言形式出现的突出细节。

— Bartlett, *Remembering*, 1932, Ch.10, p.213

Brewster Kahle 1996 founding mission：

> "Universal access to all knowledge."

### 当时为什么没成 / 今天为什么能成
Bartlett 的 schema 理论在 50-70 年代行为主义和符号 AI 主导期被冷藏——schema 无法形式化，frames（Minsky 1974）和 scripts（Schank 1977）想把它做成规则表，结果跟 SHRDLU 一个死法：手写枚举不过长尾。Internet Archive 证明了"外部存储+检索"物理上可行，但 keyword 搜索命中的是字面，不是语义。

**拐点**：BERT/Sentence embeddings 让"schema"第一次有了连续向量表示，vector DB（FAISS 2017 / pgvector 2021）让 KNN 检索在数亿条规模落地，RAG（2020）把检索+生成缝成一个 pipeline——**Bartlett 1932 那句 "imaginative reconstruction" 在 2020 后才真的变成工程可复现品**。

### 一手信源清单
- Bartlett 1932《Remembering》全书扫描 → https://archive.org/details/rememberingstudy0000bart
- Lewis et al. 2020 RAG 原论文 → https://arxiv.org/abs/2005.11401
- Karpukhin et al. 2020 DPR（RAG 检索器前身）→ https://arxiv.org/abs/2004.04906
- Internet Archive About 页 → https://archive.org/about/
- Schank & Abelson 1977《Scripts, Plans, Goals》→ https://archive.org/details/scriptsplansgoal00scha

### 写作潜力评分
| 维度 | 分 |
|---|---|
| 冷门度 | 8/10（Bartlett 在认知心理学圈有名，RAG 圈几乎没人引）|
| 拐点锋利度 | 8/10（"RAG = Bartlett 上机"反直觉但站得住）|
| 自指性 | 8/10（用户在 build vault+graphify+知识库，每天在 RAG）|
| 一手材料可得性 | 10/10（archive.org 自己就藏着 Bartlett 全书）|
| **综合** | **8/10** |

### 一句话判断
**反差最大的一篇**——1932 年剑桥老教授用印第安民间故事做实验，跟今天的 vector DB 直连，写出来读者会"啊？"。**自指性拉满（用 Internet Archive 写 Internet Archive 的文章）**。

---

## 总判断（subagent 3 推荐顺序）

**写作顺序：A → C → B**

- **A 第一写**：血缘链最长（1943→1948→1970→2024，跨 80 年）、拐点最锋利（tool use 协议）、用户正在 build agent 产品自指性满分
- **C 第二写**：冷门度和一手材料最优，反差戏剧性强（1932 War of the Ghosts 实验 + 2020 RAG 论文并排放很有张力），而且你做 vault/graphify 是活的 case study
- **B 放最后或不写**：Kahneman × o1 已经是 AI 媒体口水题

---

> *产出日期：2026-04-21 | 种子完整 | 可入 knowledge base 或作为候选文章素材*
