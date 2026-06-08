---
title: 把个人 AI 拆成五个零件：OpenJarvis 想证明端侧也能打
type: decode
created: 2026-06-05
updated: 2026-06-05
style: default
distribute: [email, xiaohongshu]
tags: [端侧AI, 个人助手, local-first, 开源框架, Stanford, 隐私]
---

# 把个人 AI 拆成五个零件：OpenJarvis 想证明端侧也能打

斯坦福的研究者做了一件听起来像逆潮流的事：把个人 AI 助手从云端拽回你自己的设备。推理在本地跑，记忆存在本地，连"学习"——根据你的使用记录变得更好用——也不出本机。云端模型只在"真的必要"时才被调用，而且被严格设了边界。

这个框架叫 OpenJarvis，出自斯坦福 Scaling Intelligence Lab 与 Hazy Research，作者名单里有 Christopher Ré 和 Azalia Mirhoseini 这样的名字。它的核心论点很硬：现在所有主流个人 AI 栈——OpenClaw、Hermes Agent 这类——都把"几乎每一条查询"路由给云端前沿模型，哪怕这条查询动的是你硬盘里的敏感数据。OpenJarvis 要回答的问题是：能不能不把数据交出去，又不把性能丢光。

它给出的答案不是"端侧够用就行"的安慰话，而是一组可以被复现的数字。最好的本地模型配置，平均准确率落在最强云端模型后面 3.2 个百分点。这个差距，值得逐项拆开看。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **直接换本地模型会崩**：把 Claude Opus 4.6 换成 Qwen3.5-9B 塞进现有框架，准确率掉 25–39 个百分点。问题不在模型，在框架是围着某个云模型焊死的。
- **五原语拆解**：OpenJarvis 把个人 AI 系统写成一份"有类型的配置"，由 Intelligence、Engine、Agents、Tools & Memory、Learning 五个可独立编辑的字段组成。
- **3.2 个百分点的差距**：经过优化的本地配置，平均准确率落后最强云端模型仅 3.2 个百分点，8 个基准里有 4 个追平或反超，边际 API 成本低约 800 倍，延迟低约 4 倍。
- **云端只当老师不当工人**：一种叫"LLM 引导的配置搜索"的机制，让云模型在搜索阶段提改进建议，最终跑的配置完全在本地，数据不出门。

## 直接换本地模型，为什么会崩

先把一个直觉打掉：很多人以为端侧 AI 不好用，是因为本地模型笨。OpenJarvis 的实验说，不全是。

研究者做了一个"替换测试"（swap test）：拿现成的个人 AI 框架，把它原本调用的 Claude Opus 4.6 直接换成体积小得多的本地模型 Qwen3.5-9B，其余不动。结果准确率在 PinchBench、GAIA 这类个人 AI 任务上掉了 25 到 39 个百分点。

听起来像是本地模型不行。但论文的判断是：崩的不是模型，是框架。现有的栈把"智能体提示词、工具描述、记忆配置、运行时设置"全都围着一个特定的云端模型焊死了——提示词是为那个模型的脾气写的，工具描述假设了那个模型的理解力，记忆策略假设了它的上下文窗口。你只换中间那块芯片，外面一整套适配层全错位。

更扎心的是，在这种焊死的结构里，你唯一能调的只有提示词。而当前最好的提示词优化器，单靠调提示词，只能把本地与云端的差距补回 5 个百分点。剩下的二三十个百分点，卡在你碰不到的地方。

这就是 OpenJarvis 的出发点：个人 AI 栈必须被拆开，每个零件都能单独调，才有机会把差距补回来。

![](assets/gpt-img/01_swap_test.png)

## 五个原语，把系统写成一份配置

OpenJarvis 的做法，是把一个完整的个人 AI 系统表示成一份"有类型的配置"（typed spec），由五个原语组成。每个原语是一个可以独立编辑的字段，意味着整个系统可以被端到端地优化和测量。

**Intelligence（智能）**——模型本身：用哪个权重、生成参数、量化方案。这是你大脑的具体型号。

**Engine（引擎）**——推理怎么跑：推理运行时、批处理、KV 缓存、走哪条硬件路径。OpenJarvis 支持 Ollama、vLLM、SGLang、llama.cpp、苹果的 Foundation Models、Exo 等多种引擎，这一层决定同一个模型在你的设备上跑得快不快、省不省电。

**Agents（智能体）**——推理循环本身：用 ReAct 还是 CodeAct，配什么提示词，工具调用走什么策略。这是"怎么思考、怎么决定动手"的部分。

**Tools & Memory（工具与记忆）**——和外部世界的接口：25 个以上的连接器、32 个以上的通道、原生 MCP 支持，记忆后端可以互换。这是助手能读你的日历、收你的邮件、记住你昨天说过什么的地方，也正是数据最敏感的地方。

**Learning（学习）**——一个"优化器插槽"：可以插 LoRA、DSPy、GEPA 或配置搜索，它根据你的执行记录去更新整套配置。这是让助手越用越懂你的那一层。

把这五样拆成可独立编辑的字段，关键不在于命名好看，而在于它让一件事成为可能：你不再被锁死在"为某个云模型调好的一整套"里，而是可以针对你手上的本地模型，逐个字段重新匹配。

值得单独点出的是 OpenJarvis 的评测口径。它不只测准确率，而是把能耗、FLOPs（浮点运算量）、延迟、美元成本都当成"一等约束"，和准确率并列。这是端侧框架该有的诚实——在你自己的设备上，电池和发热是真实代价，不是脚注。

![](assets/gpt-img/02_five_primitives.png)

## 3.2 个百分点的差距，具体是怎么来的

数字是这篇工作的硬通货，逐项摆一下。

评测覆盖 8 个基准、508 个任务，从工具调用（ToolCall-15）、智能体工作流（PinchBench）、写代码（LiveCodeBench）、客服对话（τ-Bench V2、τ²-Bench Telecom），到通用助理（GAIA）和深度研究（LiveResearchBench、DeepResearchBench）。覆盖面基本就是一个个人助手日常会被要求干的活。

最好的单一本地模型 Qwen3.5-122B，平均准确率 80.3%。最强云端基线 Claude Opus 4.6，83.5%。差 3.2 个百分点。这是优化之后的结果，不是裸换模型——别和前面那个掉 25–39 个百分点的替换测试搞混。

补差距的机制叫"LLM 引导的配置搜索"（LLM-guided spec search）。它是一种本地与云端的协作：在搜索阶段，前沿云模型扮演老师，跨五个原语提出修改建议；只有不会让成绩倒退的修改才被接受；而搜索出来的最终配置，推理时完全在本地跑。云模型只在"调教阶段"露面，干活阶段不碰你的数据。论文的措辞是，推理、智能体状态和记忆"在结构上"留在设备端，云端老师是可选的、有边界的。

成绩单上更有意思的是分项：8 个基准里有 4 个，本地配置追平或反超云端——ToolCall-15、PinchBench、LiveCodeBench、τ-Bench V2。差距主要集中在"推理密集和研究密集"的任务上，也就是 GAIA、深度研究那一类需要长链条思考的活。换句话说，日常的工具调用、流程执行、写代码，本地已经够打；真正拉开距离的是最烧脑的深度推理。

代价那一头同样要看：本地配置的边际 API 成本低约 800 倍，端到端延迟低约 4 倍。"边际成本低 800 倍"的意思是，云端方案每多处理一条查询都在按 token 计费，而本地方案模型一旦装好，多跑一条查询的额外现金支出趋近于零——剩下的是电费。

![](assets/gpt-img/03_benchmark_gap.png)

## local-first 为什么是个人助手的隐私答案

把这套技术放回它要解决的现实问题：个人助手天然要碰你最私密的数据。

它要读你的邮件才能帮你回邮件，要看你的日历才能帮你安排，要翻你的文件才能帮你找东西，要记住你的偏好才能越用越顺。这些恰恰是你最不愿意逐条上传到别人服务器的东西。论文里那句话点得很直白：现有的个人 AI 系统"仍然依赖别人的服务器"。

local-first（端侧优先）的价值就在这里，它不是技术炫技，是把信任结构倒过来：默认数据不出本机，云端是例外而非常态。这带来两个直接好处。隐私上，敏感数据"在结构上"留在设备里，不是靠一纸隐私政策承诺，而是架构上就没把它送出去。离线上，模型装在本地，没网也能用，不受服务商宕机或限流影响。对一个你指望它管理日程、邮件、文件的助手来说，这两条都不是加分项，是底线。

但要诚实地看边界。OpenJarvis 的成绩是在受控条件下拿到的：每个配置跑 5 次取平均，用 GPT-5-mini 当评分裁判，在单台机器上测试。这意味着"低 4 倍延迟""落后 3.2 个百分点"这些数字，是实验室协议下的结果，换到你那台具体的笔记本或手机上，本地模型能跑多大、跑多快，受你的内存和算力硬约束。Qwen3.5-122B 这种量级的模型，不是随便一台设备装得下的。端侧优先给了你隐私和离线，但前提是你的设备扛得动你想要的那个智能档位——这正是性能差距和设备算力之间，每个人都要自己做的那道权衡题。

![](assets/gpt-img/04_local_first.png)

## 对从业者意味着什么

如果你在做个人 AI 或任何隐私敏感场景的助手，OpenJarvis 给了两个可以直接用的判断。

第一，别再"换芯片"，要"换整机"。如果你试过把云端 API 换成本地模型、发现效果崩了，先别怪本地模型笨。崩的大概率是你的提示词、工具描述、记忆策略还停在为云模型调好的状态。把这五层当成可以分别重调的字段，针对你手上的本地模型逐个重新匹配，二三十个百分点的差距里有相当一部分是能补回来的。

第二，分清哪些活该留在本地。这套评测给了一张很实用的地图：工具调用、流程执行、写代码、客服对话这类结构化任务，本地模型已经追平甚至反超云端，完全可以放心端侧化；而需要长链条深度推理、深度研究的任务，本地还落后，这部分要么接受差距，要么用"云端当老师、本地干活"的协作模式去补。把任务按这条线分类，是你设计端侧 agent 时第一步该做的事。

最后一句务实的：OpenJarvis 是 Apache 2.0 开源、装一行命令就能跑（`jarvis` 开聊，`jarvis init --preset <名字>` 切配置），自带 morning-digest、deep-research、code-assistant 等预设。想验证"端侧到底够不够用"，最快的路是拿你自己的真实任务，在你自己的设备上跑一遍它的预设，看那 3.2 个百分点在你的场景里是不是真的能接受。

## 关键词

- **local-first（端侧优先）**：默认所有计算和数据都在用户自己的设备上完成，云端只在必要时作为例外被调用的架构思路。和"云优先"相反。
- **swap test（替换测试）**：保持框架其余部分不变，只把云端模型换成本地模型，用来检验框架对模型的依赖有多深的实验。
- **typed spec（有类型的配置）**：把一个 AI 系统的每个部件写成一个有明确类型、可以独立修改的配置字段，从而让整个系统可被程序化地优化和测量。
- **MCP（Model Context Protocol，模型上下文协议）**：一种让 AI 助手统一接入外部工具和数据源的开放标准。
- **量化（quantization）**：把模型权重用更低精度的数字表示，以换取更小体积和更快速度，代价是轻微精度损失，是端侧跑大模型的关键手段。
- **边际 API 成本**：每多处理一条查询所额外产生的费用。云端按 token 计费，本地装好后趋近于零。

## 引用

1. 主信源：Meet OpenJarvis: A Local-First Framework for On-Device Personal AI Agents with Tools, Memory, and Learning. MarkTechPost, 2026-06-03. https://www.marktechpost.com/2026/06/03/meet-openjarvis-a-local-first-framework-for-on-device-personal-ai-agents-with-tools-memory-and-learning/
2. GitHub 仓库：OpenJarvis — Personal AI, On Personal Devices. https://github.com/open-jarvis/OpenJarvis
3. 论文：OpenJarvis: Personal AI, On Personal Devices. arXiv:2605.17172. 作者 Jon Saad-Falcon、Avanika Narayan、Christopher Ré、Azalia Mirhoseini 等。https://arxiv.org/abs/2605.17172
   - 摘要原文（节选）："swapping Claude Opus 4.6 for Qwen3.5-9B drops accuracy by 25-39 pp across personal AI tasks" — 在 PinchBench、GAIA 等个人 AI 任务上，把 Claude Opus 4.6 换成 Qwen3.5-9B，准确率下降 25 至 39 个百分点。
   - "on-device specs match or exceed cloud accuracy on 4 of 8 benchmarks and land within 3.2 pp of the best cloud baseline on average" — 端侧配置在 8 个基准中的 4 个上追平或超过云端准确率，平均落后最强云端基线 3.2 个百分点之内。
4. 斯坦福实验室博客：OpenJarvis: Personal AI, On Personal Devices. Scaling Intelligence Lab, Stanford University. https://scalingintelligence.stanford.edu/blogs/openjarvis/
