---
title: Needle — 26M 模型把"前台"和"大脑"拆开了
source: https://github.com/cactus-compute/needle
author: Cactus Compute / smol.ai AINews
date: 2026-05-12
type: decode
---

5 月 12 日，Cactus Compute 把一个 26M 参数的工具调用模型挂上 Hugging Face。同档对手是 FunctionGemma-270M、Qwen-0.6B、Granite-350M、LFM2.5-350M——参数量是它的 10 倍到 23 倍。在 single-shot function calling 上，26M 这边赢了。

参数差一个数量级，结果反过来——这件事本身要不是测试错了，要不是过去三年大家训的 transformer 里有一大块根本没用到。Cactus 在它的架构 writeup 里给的答案是后者：transformer 里大约 2/3 的参数花在 FFN 上，对工具调用这件事**几乎没有贡献**。

![封面](assets/png/00_cover.png)

## 把 transformer 想成"前台 + 大脑"

要看懂 Cactus 干了什么，先得拆 transformer 这个东西本身。

标准 transformer 每一层有两个部件：attention（注意力）和 FFN（前馈网络，也叫 MLP）。一个常见的比喻——attention 是**前台**，负责听客户说话、对照已有信息、找出"现在该跟谁说话、把哪条信息挪到哪里"；FFN 是**大脑**，负责"基于已有信息进行非线性变换、存知识、做推理"。

工具调用这件事，从输入到输出都在干什么？把用户的自然语言（"帮我订一张明天去上海的机票"）匹配到工具名（`book_flight`），从输入里抽出参数值（`destination=上海`，`date=明天+1`），拼成一个 JSON。

匹配、抽取、拼装——三件事都是"对齐 + 复制"。这恰好是 attention 干的事。FFN 在这里几乎没活干，**因为工具的知识不在模型权重里，在外部的工具 schema 里**。Cactus 的判断很直白：

> "Function calling is mostly retrieval/assembly over provided tool schemas rather than memorized reasoning."

翻译过来——工具调用本质是"在外部信息上检索和拼装"，不是"靠记忆推理"。既然知识在外面，就不需要靠 FFN 把知识塞进权重里。把 FFN 砍掉，留下 attention 加少量门控（gating），架构起名 Simple Attention Networks。

![前台和大脑](assets/png/01_frontdesk_brain.png)

## 砍掉 FFN 是数学问题，也是工程问题

FFN 在小模型里"参数浪费"这事，过去也有零散研究指出过——但工业界没人当回事，因为大模型时代大家堆参数堆得习惯了，没人去想 100M 以下这种"奇怪"的尺寸。

Cactus 把这件事推到工程结论：去掉 FFN 之后，每层参数砍掉约 2/3。在边缘设备（手机、IoT、车机）上，**模型推理速度的瓶颈不是计算量，是内存带宽**——每秒能从内存读到 NPU/CPU 里的字节数。少 2/3 参数等于少 2/3 次内存读取，延迟直接掉一截。

具体的数字：6000 tok/s 预填（prefill）、1200 tok/s 解码（decode），在"普通消费级设备"上。预填这个数字尤其值得拆——agent 要决定调哪个工具时，得先把整个上下文（用户请求 + 所有工具 schema）"读一遍"，这就是 prefill。6000 tok/s 意味着一个 5000 token 的 schema 库不到一秒就读完了。

训练成本同样塞牙缝：16 颗 TPU v6e 跑 27 小时，预训练 200B token；再用 2B 合成的 function-calling token 微调 45 分钟。预算量级估算下来 几千美元能跑一遍——这种数字在 LLM 圈子里不算研究项目，算"一个工程师周末的成本"。

X 上的反响里有一条直白评论：这不是把模型做小，是把"模型上手机这件事"重新报价。

![参数与带宽](assets/png/02_param_bandwidth.png)

## 蒸馏 Gemini，这件事本身有点反讽

Cactus 没从零教模型怎么调用工具。它的训练方式是 **distillation**——拿 Gemini-3.1-Flash-Lite 当老师，让 26M 的学生学会"老师在工具调用上的输出分布"。

HN 评论区有一条比较辣的质疑：Gemini 在主流大模型里恰好是**工具调用做得不算好**的一家。原话——"Gemini is probably the worst major lab choice for tool calling"。Cactus 团队的回应是"用 Gemini 是因为 API 便宜"，没正面回应"为什么不用已经开源的 GLM / Qwen / Kimi 这些工具调用更强的模型"。

这件事的反面信号是：

- **老师能力封顶 = 学生能力封顶**。如果 Gemini 工具调用本身有 bug，Needle 大概率继承
- **基准选择有玄学**。FunctionGemma-270M / Granite-350M 是不是最强对手？或者只是好打？没人替 Cactus 跑一遍 Qwen3-0.5B-Instruct 在同一 benchmark 上的结果
- **single-shot 这个限定词**。模型只测了"一轮就出工具调用"的场景，多轮对话里要不要追问、要不要拒绝调用——这些更现实的场景没测

但反过来，蒸馏自 Gemini 这件事也回应了一个老问题——"小模型从哪学到工具调用的对齐能力"。从零训一个 26M 模型自己学，几乎不可能；从一个 trillion-token 的大模型身上"偷"对齐能力，是这套 distillation 路径反复证明过的捷径。Needle 把这条捷径用到了"工具调用"这一个动作的极致。

## 真实使用里翻车的地方

HN 上有用户跑了一个具体测试：

> "I need to contact my boss, I'm running late."

工具列表里包含发邮件功能。Needle 的输出——**设了个计时器**。

这是一个非常典型的"窄域模型"翻车——它在"明确的指令 → 明确的工具"路径上很强，但只要话里带歧义、带省略、带"我要 X 但说的是 Y"这种人类正常说话的方式，就崩。

Cactus 自己也承认了一个能力缺口：**还不支持 few-shot in-context learning**。也就是说，你不能在 prompt 里加几个示例告诉它"看，这种话要这么处理"——这种能力是过去两年大家用得最顺手的 LLM 调用方式。Needle 现阶段只能严格按训练时见过的工具调用模式走。

这两件事拼起来读，Needle 是一个**"能装进手机、跑得飞快、但只会做训练时教过的窄事"的模型**。它不是 Gemini Nano 的对手——后者要做"端上跑的通用对话"。它是 NPU 上一个**专门的工具路由层**，前面接一个更小的 ASR 或 intent 分类器，后面接真正干活的工具/API。

## 这件事对从业者意味着什么

Needle 这一篇是叙事先于性能的。性能数字会被很快超过——下个月可能就有 20M 的、15M 的、10M 的版本出来。真正可能改变的是**怎么看 transformer 这个东西本身**：

- **大模型 ≠ 万能模型**。具体到工具调用、意图分类、命名实体识别这种"对齐+复制"任务，FFN 是冗余的。这意味着以前"什么活都让 GPT-4 干"的架构里，至少 1/3 的调用可以下沉到 50M 以下的专用模型——成本能砍 99%
- **端云分工要重新画线**。以前的默认是"敏感和实时的部分在端、复杂的部分在云"。Needle 把"实时"这一头的能力上限抬高了——意图理解、工具路由、表单填写这些动作完全可以离线跑完，云只在真正需要"知识"或"推理"时才介入
- **agent 框架要给"路由层"留位置**。一个生产级 agent 通常先做意图识别、再选工具、再生成参数。如果这三步都能 26M 模型搞定，那 LangGraph / DSPy / Claude Agent SDK 这些框架就得给"端侧路由模型"做一个一等公民的接口
- **对 PM**：本周看你产品的 AI 功能里有多少是"工具调用"——能不能用 Needle 这类模型替掉一半的 GPT 调用，让响应快一倍、成本砍 99%
- **对工程师**：去 cactus-compute/needle 那个 repo 把它 pull 下来，在你的工具集上微调 30 分钟，看准确率能跑到多少。这是 2026 年最低成本的"端侧 agent 原型"
- **对架构师**：把"FFN 浪费"这个观察推广出去——你 stack 里还有哪些任务的本质是"对齐+复制"？这些任务都是 attention-only 小模型的候选

![分工重新画线](assets/png/03_split_redraw.png)

## 盲区

Needle 现阶段三件事没说清：

**长上下文表现没测。** 6000 tok/s prefill 是在多长的输入上测的？2k？8k？如果工具集大到 30 个工具 × 每个 schema 200 token = 6000 token，模型还吃得下吗？这件事 repo 文档里没给。

**多语言能力不明。** distillation 自 Gemini，理论上中文应该可用，但 Cactus 没给中文 benchmark。中国厂商如果想在国产 NPU 上复制这套思路，得自己跑一遍。

**安全和拒答没做。** 工具调用最危险的不是调错工具，是**乱调工具**——比如 prompt injection 让它去调用"删除用户数据"那种工具。Needle 是否会拒绝可疑指令、是否会做意图二次确认，这些训练数据里有没有，文档没说。

最后一件事——Cactus 这个团队本身在做什么。它的主业是"在边缘设备上跑 LLM"的 SDK，Needle 是这个 SDK 的"代言模型"——证明 Cactus 这条路是对的。所以读这篇文章的时候要分清楚：技术判断是真的，但产品宣传的部分要打个折。

## 本期关键词

**Simple Attention Network (SAN)** — Cactus 给这个砍掉 FFN 的架构起的名字。本质是 transformer 减去 MLP 层，只留 attention 加门控。在窄域任务上能用 1/3 参数干掉同尺寸 transformer。

**Distillation（蒸馏）** — 用大模型当老师教小模型的训练范式。学生不学"事实"，学"在每个 token 位置上老师的概率分布"。Needle 的训练方式：用 Gemini-3.1-Flash-Lite 蒸馏出 26M 学生。

**Prefill / Decode** — LLM 推理的两个阶段。Prefill 是"把整个 prompt 一次读完算出 KV 缓存"，可以并行；Decode 是"一个 token 一个 token 往外吐"，必须串行。Needle 6000 tok/s prefill、1200 tok/s decode 这两个数都重要——prefill 决定 agent 选工具有多快，decode 决定生成 JSON 参数有多快。

**Function calling / Tool calling** — 让 LLM 输出结构化的"调用哪个工具、传什么参数"的 JSON。是 agent 的最核心动作。这两个词通常互换使用。

**On-device AI** — 模型在用户设备本地跑而不是云端跑。好处：低延迟、可离线、隐私。瓶颈：内存带宽和功耗。Needle 把这条路径的速度上限抬了一个数量级。

**Memory bandwidth bottleneck** — 边缘设备跑大模型的真瓶颈。不是算力不够，是内存到处理器的数据通道太窄。砍参数 = 砍内存读取 = 直接降延迟。

## 引用

1. [cactus-compute/needle on GitHub](https://github.com/cactus-compute/needle) — 本期拆解原文
2. [Simple Attention Networks (架构 writeup)](https://github.com/cactus-compute/needle/blob/main/docs/simple_attention_networks.md) — 砍 FFN 的技术原理
3. [Cactus-Compute/needle on Hugging Face](https://huggingface.co/Cactus-Compute/needle) — 模型权重
4. [Show HN: Needle — We Distilled Gemini Tool Calling into a 26M Model](https://news.ycombinator.com/item?id=48111896) — HN 真实质疑（"联系老板说迟到"翻车 / 蒸馏 Gemini 的反讽 / few-shot 缺失）
5. [smol.ai AINews — 2026-05-12](https://news.smol.ai/issues/26-05-12-not-much) — 本期被 AINews 列为 Paper #2
