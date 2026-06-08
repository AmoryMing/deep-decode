---
title: Moonshot 又一次撕开 LLM 推理的物理边界：Prefill 要变成跨数据中心的服务
source: https://arxiv.org/abs/2604.15039
author: Ruoyu Qin, Weiran He 等（Moonshot AI + 清华大学）
date: 2026-04-16
decoded: 2026-04-20
tags: [AI产品, LLM推理, 系统工程, Moonshot, Mooncake, PD分离]
---

![封面](material/pngs/01_cover.png)

同样处理 32K 上下文（大约一本中篇小说的长度），MiniMax-M2.5 要求机器之间拉通约 60 Gbps 的胖管子，Kimi Linear 只要 2.6 Gbps 的细水管（数据出自论文 Table 3）。

**23 倍的带宽差距——LLM 推理的物理边界刚刚被撕开一道口。**

---

## 一篇论文，背后是一条贯穿两年的研究线

2026 年 4 月 16 日，Moonshot AI 的 Ruoyu Qin、Weiran He 团队和清华大学的 Mingxing Zhang、Weimin Zheng 教授组，合写的论文 *Prefill-as-a-Service: KVCache of Next-Generation Models Could Go Cross-Datacenter* 贴上了 arXiv。署名几乎是 2024 年 Mooncake 论文的原班人马。

这条线的三步走得很清楚：

1. **Mooncake（2024 年 6 月首发）**——第一次把 KVCache（注：模型"读完前文"之后保存在显存里的中间态，后续每生成一个新 token 都要查这份记忆）当成一等公民的系统资源来管，而不是显存里一段匿名数据。这套思想后来被 vLLM、SGLang、NVIDIA Dynamo 这些主流推理引擎吸收，成为事实上的 PD 分离标准做法。
2. **Kimi Linear / Kimi-k2（2025 年底到 2026 年初）**——用 hybrid attention（混合注意力，一部分层走标准注意力、一部分层走复杂度更低的线性注意力）把 KVCache 的尺寸再压一个数量级。
3. **PrfaaS（本篇）**——既然 KVCache 已经小到用商用以太网就能传，那是不是可以把 prefill 搬到另一个数据中心？

论文的原话把这种升级说得很克制：

> "At Moonshot AI, Mooncake helped push this shift into practice by treating KVCache as a first-class systems resource."

翻译过来就是：我们当年在 Mooncake 做的事，这次推到跨数据中心。

## 这篇论文到底在说什么：一句话版本

**用 hybrid attention 把 KVCache 压小，再叠上三个系统调度机制，就可以把"prefill 阶段"变成像 S3、Lambda 那样的独立服务——放在另一个数据中心，通过商用百 Gbps 以太网调用，吞吐反而比本地胖管道集群更高。**

这里有个关键术语必须讲清楚：

- **Prefill（预填充）**：你给 LLM 发一条 prompt，模型要先一次性把整段 prompt 读完、算出一份 KVCache。这一步是**一次性重算力**，GPU 跑 matrix 运算跑得冒烟。
- **Decode（解码）**：有了 KVCache 之后，模型开始一个 token 一个 token 吐字。每吐一个 token 就要把整份 KVCache 再读一遍，所以这一步是**持续的内存带宽密集型**。
- **PD 分离（Prefill-Decode Disaggregation）**：把这两个阶段拆到不同机器上各跑各的——让算力密集的 prefill 去用算力型 GPU，让带宽密集的 decode 去用显存带宽大的 GPU。这样两边都不浪费。

过去 PD 分离有一个死穴：**KVCache 是个大包裹**，prefill 机器算完后必须把它传给 decode 机器，而这个传输必须走 RDMA（远程直接内存访问，服务器之间跳过 CPU 的硬件直通线，400 Gbps 起步、延迟微秒级）才不拖后腿。结果就是 PD 分离只能在同一个 RDMA 网络域里做，等于被关在一栋楼里。

![架构演进](material/pngs/02_architecture_shift.png)

## 为什么现在能做到"跨楼"甚至"跨城"

核心答案：**KVCache 变小了**。

论文 Table 3 给出了一组横向对比（32K tokens 时，把 KVCache 从 prefill 机器传到 decode 机器所需的单请求带宽）：

- **Dense attention（标准全注意力）阵营**：
  - MiniMax-M2.5: **59.93 Gbps**
  - Qwen3-235B: 33.35 Gbps
- **Hybrid attention（混合注意力）阵营**：
  - Qwen3.5-397B: 8.25 Gbps
  - MiMo-V2-Flash: 4.66 Gbps
  - Kimi Linear: 3.87 Gbps
  - Ring-2.5-1T: **2.59 Gbps**

Ring-2.5-1T 和 MiniMax-M2.5 之间差了 **23 倍**。这不是参数规模的差距——Ring 是 1T，MiniMax 只有几百 B——而是注意力架构的差距。

这里插一个术语片：

- **Linear Attention（线性注意力）**：传统注意力要算每个 token 对所有其他 token 的相关性，复杂度 O(n²)，序列越长越恐怖。线性注意力通过数学变换把复杂度压到 O(n)——序列越长，省得越多。
- **MLA（Multi-head Latent Attention）**：DeepSeek 发明的技术，把 KVCache 压缩成一份"隐向量"，占用比原版小几十倍。
- **Hybrid**：在模型的不同层混搭。Kimi Linear 用 KDA:MLA = 3:1 的比例，Ring-2.5-1T 用 Lightning:MLA = 7:1。大部分层省钱，少部分层保精度。

Hybrid 的意义是**让 KVCache 从"显存里的庞然大物"变成"商用以太网能驮动的小包裹"**。这一层做到了，上面那三层系统创新才有意义。

![带宽差距](material/pngs/03_kv_bandwidth.png)

## 光架构小还不够：论文的核心贡献其实是系统工程

论文写得很诚实：

> "smaller KVCache alone does not make heterogeneous cross-datacenter PD serving practical."

翻译：KVCache 变小不等于跨数据中心 PD 服务能跑。

实际工程里会撞上三个硬问题：请求长度分布歪（长请求极少但吃掉大部分算力）、流量突发（一下子来一堆长 prompt 把跨 DC 链路打爆）、带宽波动（商用以太网不像 RDMA 稳定）。论文拿出三个招。

### 招式一：选择性卸载（Selective Offloading）

不是所有请求都往跨数据中心扔。设定一个长度阈值 **t**，prompt 长度超过 t 的才发到 PrfaaS 集群（专门装 H200 算力型 GPU 的集群），短于 t 的就地消化。

论文给出的最优值：**t = 19.4K tokens**。大约只有 50% 的请求被卸载（来自 Figure 5 的寻优实验）。

**为什么这么做**：短 prompt 本来 prefill 就不贵，跨 DC 传输反而增加延迟；长 prompt 的 prefill 成本极高，哪怕加上跨 DC 传输也划算。这本质是**把跨 DC 带宽这种稀缺资源用在 ROI 最高的地方**。

![选择性卸载](material/pngs/04_selective_offload.png)

### 招式二：双时间尺度调度（Dual-Timescale Scheduling）

调度分两套表。

**短时（毫秒级到秒级）**：实时看 PrfaaS 出口带宽利用率、对端队列深度。带宽紧张时，本地集群就不去用跨 DC 的前缀缓存了，独立决策；带宽充裕时，可以考虑跨集群共享前缀缓存（prefix cache，同一段 prompt 被多次请求命中时不用重算）。

**长时（分钟级到小时级）**：根据这段时间的流量长度分布，重新调整本地 PD 集群里 prefill 节点数 Np 和 decode 节点数 Nd 的比例，满足一个守恒公式：

> Θprfaas + Θpd-p = Θpd-d

翻译：prfaas 贡献的 prefill 产能 + 本地 prefill 产能 = 本地 decode 产能。KVCache 的生产速度和消费速度必须匹配，不然要么 decode 端饿着、要么 prefill 端堆积。

这套思路很像运维调度里的"控制回路"——短时反馈抑抖动，长时反馈调结构。

### 招式三：混合前缀池（Hybrid Prefix Cache Pool）

Linear attention 的"记忆"是 request 级别的一整块状态，Full attention 的 KVCache 是 block 级别的分片。论文把这两种异构数据塞进**同一个存储池**，统一 block size 对齐。

池里两种块：

- **Prefix-cache 块**：写满以后跨请求复用（多个用户问同一个长文档，只算一次）
- **Transfer-cache 块**：用完就丢，专门承接跨 DC 传过来的尾段 KVCache

关键判断是：**存储池的"接口"必须对 Linear 和 Full 两种记忆模型都成立**，否则新旧模型不能共存于同一套基础设施。

## 数据：54% 的吞吐提升从哪来

论文的主实验很朴素：跑一个 Kimi 自家的 1T 参数模型（KDA:MLA 3:1 结构）。

**三组对比**（这里"naive 异构"指不做选择性卸载、把所有请求都往 PrfaaS 集群丢的朴素方案，作为对比基线证明论文那三个调度机制确实有用）：

| 配置 | 硬件 | 吞吐相对值 |
|------|------|-----------|
| 同构基线 | 96× H20 | 1.00 |
| naive 异构（不做选择性卸载） | 32× H200 + 64× H20 | 1.17 |
| **PrfaaS** | 32× H200 + 64× H20 | **1.54** |

相对同构基线 **+54%**，相对 naive 异构 **+32%**。

**延迟也砍了**：

- Mean TTFT（Time To First Token，从发 prompt 到第一个字吐出来的延迟）：2.22s vs 同构 4.44s（**砍半**）
- P90 TTFT：3.51s vs 9.73s（**砍 64%**）

**网络占用**：在最优工作点（49.6% 请求被卸载），实际跨 DC 出口带宽约 **13 Gbps**——100 Gbps 商用 VPC peering 链路只用了 **13%**。

翻译一下这组数字意味着什么：**同样的钱，买一组 H200 + H20 混合池比买清一色 H20 多服 54% 的请求**；而且这组机器**不需要拉在一个机房**。

![实验结果](material/pngs/05_results.png)

## 原创框架：相位地理解耦（Phase-Geographic Decoupling）

论文本身没给这个名字，但实际上它在说的是一个被命名才会被理解的东西。LLM 推理有两个"相位"（prefill 和 decode），过去它们必须物理共处一地；PrfaaS 让它们**第一次可以分布在不同的地理位置**。

类比看更清楚：

- **CDN**（内容分发）已经把"静态内容"从计算中心剥离出去，靠近用户
- **S3/对象存储**已经把"冷数据"从热数据库剥离出去，跨 DC 部署
- **PrfaaS** 现在要把 prefill 从 decode 剥离出去，跨 DC 部署

这背后还有一条硬件佐证链。论文第 5 节指出：

> "NVIDIA Rubin CPX explicitly targets high-throughput long-context prefill, while architectures such as Groq's Language Processing Unit (LPU) emphasize the extreme memory bandwidth required for decode."

Rubin CPX（NVIDIA 2025 宣布的"上下文加速"芯片）专攻 prefill，Groq 的 LPU 专攻 decode。硬件已经在分家，软件 PrfaaS 只是把这个分家合法化、调度化。

## 盲区：论文没说的，或者轻描淡写的

1. **"跨数据中心"其实是同地域两个机房**。论文用的是约 100 Gbps 的 VPC peering，延迟应该是 1-5ms 级别。真跨大洲（比如北京 → 法兰克福），延迟要到 100ms+，整个 TTFT 模型会崩。作者没测。
2. **SLO 卡在 40 tokens/sec**。这属于"能用"级别，但聊天场景体感 50-80 tokens/sec 才舒服。严苛 SLO 下这套系统有多少剩余空间，未知。
3. **所有实验跑 Kimi 自家的 1T 模型**。迁移到其他公司的闭源模型（比如 Claude、GPT），架构假设（KDA:MLA 3:1）不成立时结论能否复现，未知。
4. **跨 VPC 的 KVCache 隔离/加密/审计完全没提**。企业客户的多租户场景直接用这套会有合规问题。
5. **经济账没算**。"54% 吞吐"只是技术数字，商用百 Gbps 带宽在不同云上的 $/GB 不一样，总体 TCO（拥有成本）能省多少，论文里一个美元都没写。

这些不是黑它——学术论文本来就该聚焦技术贡献——但从业者读论文必须自己补上这些维度。

## 对 AI 产品人意味着什么

从 muming 这类产品视角看，这篇论文传递的信号有四条：

**1. 云厂商 AI BU 的产品形态要重塑**
过去卖"AI 训练集群"或"AI 推理集群"是一个整块产品。未来可以拆成"prefill 服务"和"decode 服务"分开卖，客户按 token 长度分布来组合。阿里云/百度云/华为云如果还没在产品目录里考虑这个拆法，两年后会被动。

**2. 模型选型的系统维度越来越重要**
选模型不再只看 MMLU 分数、只看参数量。**注意力架构（hybrid vs dense）直接决定上线以后单位 token 的推理成本**。闭源大厂如果坚守全注意力，在 K 级上下文场景下会被 hybrid 阵营以系统成本优势打穿。

**3. 中国 AI infra 研究在"系统层"有持续输出**
Mooncake 过去一年成了全球 PD 分离的典型实现，vLLM/SGLang/Dynamo 都在吸收相关思路。PrfaaS 是这条线的延续。Moonshot 把开源（Kimi-k2/Kimi Linear）和系统工程（Mooncake/PrfaaS）两条线绞在一起，最近一个商业化信号是 Kimi-k2.5 被 Cursor Composer 2 采用作为底层模型（Simon Willison 2026-03-20 报道）——说明这条组合拳在商业侧已经开始被验证。

**4. 推理基础设施的物理假设正在松动**
以前"AI 集群"是一个不可切分的地理原子——必须一整栋楼一整条 RDMA。现在开始可以像微服务那样拆。这会催生一批"异构推理池化"的工具链创业机会：跨 DC 调度器、KVCache 边缘缓存、prefix 命中率市场化等等，都有空间。

---

## 原文关键引用

> "KVCache transfer keeps prefill and decode tightly coupled within a single high-bandwidth network domain." — §1
> （KVCache 传输把 prefill 和 decode 绑死在同一个高带宽网络域里。）

> "smaller KVCache alone does not make heterogeneous cross-datacenter PD serving practical." — §2
> （只靠压缩 KVCache 不能让跨数据中心 PD 服务变得可行。）

> "At Moonshot AI, Mooncake helped push this shift into practice by treating KVCache as a first-class systems resource." — §3
> （在 Moonshot，Mooncake 把 KVCache 当作一等系统资源来对待，推动了这次转变的落地。）

> "The optimum occurs at the intersection of the two curves, yielding t=19.4K. At this operating point, approximately 50% of all requests (the longer ones) are offloaded to the PrfaaS cluster." — §4.3
> （最优点在两条曲线的交点，阈值 t=19.4K，约 50% 的长请求被卸载到 PrfaaS 集群。）

---

## 本期关键词

**Prefill-Decode Disaggregation（PD 分离）** —— 把大模型推理拆成"读 prompt"和"生成 token"两步，分开跑在不同 GPU 上。一步吃算力、一步吃带宽，不再互相浪费。这是过去两年 LLM 推理系统最大的结构性优化，vLLM、SGLang、Mooncake 都做。

**KVCache** —— 模型读完前文后保存的"注意力记忆"。每生成一个新 token 都要查这份记忆。KVCache 的大小直接决定显存占用、跨机传输成本、批处理容量。它是 LLM 推理里一切性能讨论的中心。

**Hybrid Attention（混合注意力）** —— 在模型不同层混用标准注意力和线性/线性化注意力。标准层保精度，线性层省成本。Kimi Linear、Ring-2.5-1T、MiMo 都是这个路线的代表。

**MLA（Multi-head Latent Attention）** —— DeepSeek 首创，把 KVCache 压缩成一份低维"隐向量"，占用仅为传统的几十分之一。现在是主流大模型的标配选项。

**Linear/Lightning Attention** —— 复杂度 O(n) 的注意力变体。序列越长越占便宜，适合长文档场景。Kimi 叫 KDA，MiniMax 叫 Lightning，本质同类。

**TTFT（Time To First Token）** —— 从用户提交 prompt 到系统吐出第一个字的延迟。用户感受到"它还在想"的时间，是体感指标里最关键的一个。

**RDMA（Remote Direct Memory Access）** —— 服务器之间绕过 CPU 的硬件直通线。400 Gbps 起步，延迟微秒级。AI 集群过去的物理假设就是"一切机间通信都走 RDMA"。PrfaaS 的潜台词是"KVCache 传输可以不走 RDMA 了"。

**Prefill-as-a-Service（PrfaaS）** —— 本文造的新词，也是论文标题。意味着 prefill 可以像 S3、Lambda 那样变成独立部署、独立扩缩的云服务。这个命名本身就是行业方向的信号。

---

## 引用

1. [Prefill-as-a-Service: KVCache of Next-Generation Models Could Go Cross-Datacenter](https://arxiv.org/abs/2604.15039) —— 本期拆解原文，arXiv:2604.15039，2026-04-16
2. [Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving](https://arxiv.org/abs/2407.00079) —— 前作，2024-06 arXiv 首发
3. [[intel-2026-04-17-quoting-kimi-ai-kimi-moonshot]] —— Kimi-k2.5 被 Cursor Composer 2 采用为底层模型（2026-03-20 Simon Willison 报道）
4. NVIDIA Rubin CPX 公告（2025）—— 专攻长上下文 prefill 的硬件加速芯片
5. Groq LPU —— 专攻 decode 阶段内存带宽的推理芯片
