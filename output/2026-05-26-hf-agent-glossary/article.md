---
title: Agent = Model + Harness：HuggingFace 把行话定了
source: https://huggingface.co/blog/agent-glossary
author: Sergio Paniego & Aritra Roy Gosthipaty (HuggingFace)
date: 2026-05-26
type: decode
---

5 月 25 日，HuggingFace 发了一篇看似平淡的术语表博客，把过去 18 个月被各家创业公司、博客作者、招聘 JD 揉得乱七八糟的几个词强行排了次序：Model、Scaffolding、Harness、Agent，再加上四个训练专属的 RL Environment、Trainer、Rollout、Reward。这件事在 X 上没翻起多大水花，但它是 agent 圈第一次有头部生态级机构出来做收敛动作。

时机不是巧合。Claude Code 的 docs 把整套系统直接命名为 "agentic harness"，OpenAI Codex 团队的工程帖反复用 harness engineering 这个说法，Cursor 在博客里写 "Continually improving our agent harness"，Antigravity CLI 把 harness 抽象成可插模型的中间层。各家产品都在用同一个词指自己最核心的那一层，但每家的定义边界不一样。HuggingFace 这篇出来，就是要把这堆边界画清楚。

![Model / Scaffolding / Harness / Agent 同心圆](00_系列封面.png)

## 一、Agent = Model + Harness：被埋在中段的中心等式

这篇文章真正的中心被写在 Agent 那一节的最后一句，几乎像是顺手提的：**"In the community, it's usually put as Agent = Model + Harness. If you're not the model, you're the harness."**

三个字一条等式。如果你不是模型，你就是 harness。

这句话之所以重要，是因为它一刀切掉了过去两年所有关于"agent 由几部分组成"的争论。中文圈现在常见的写法是"智能体 = 模型 + 工具 + 记忆 + 规划"，四件套，听起来很完整，但在工程对接上没法用——工具是 harness 里的一个组件，记忆是 scaffolding 里的 context 管理，规划是 model 在 scaffolding 引导下产生的中间输出。把它们和模型并列，等于把一个执行框架按"看起来重要的特征"切了一刀，而不是按"谁是黑盒、谁是壳"切。

HF 给的是工程上能直接用的二分法：模型是被训练出来的权重，是一个 stateless 的函数；除此以外的所有东西——执行循环、工具调用解析、停机判断、guardrail、context 管理——全是 harness。这条等式对训练侧和推理侧都成立，所以 GRPO trainer 才能直接把"训练时跑很多 rollout"和"推理时跑一个 episode"对齐。

## 二、Harness vs Scaffolding：宽义和窄义的差别

文章中第二个值得停下来的地方是它对 harness 和 scaffolding 的区分。这是真正容易混的地方，混了之后整个团队的工程语言就废了一半。

**Scaffolding 是模型"看到的世界"。** 它包括 system prompt、tool descriptions、模型输出的解析格式、跨步骤的 context 管理策略。换句话说，scaffolding 是你写给模型的那部分——你告诉它有哪些工具、用什么格式回复、保留多少历史。

**Harness 是"让模型跑起来的执行层"。** 它包括 agent loop（拿到模型输出 → 检测有没有工具调用 → 调用工具 → 把结果塞回 context → 再调模型）、错误处理、停机判断、各种 guardrail。harness 是你不让模型看到的那部分——它是裁判，决定什么时候继续、什么时候停、什么时候报错。

HF 在这里特别点出一个细节：Claude Code 自己的 docs 写 "Claude Code serves as the agentic harness around Claude"，把 scaffolding 和 harness 全部叫 harness。这是宽义。HF 这次刻意给的是窄义，原因藏在下一节——训练侧必须把这俩分开建模，不然 RL trainer 没法只学 policy 那一部分而不学 harness 的 bug。

![推理时 harness 的执行循环](01_harness_loop.png)

这条窄义区分有一个非常实际的判断意义：**两个产品用同一个底模能跑出完全不同的体验**。Claude Code 和 Codex 都接 Claude 系列，但 harness 设计差很多——一个偏长跑、一个偏短反馈、停机判断完全不同。如果一个团队向你推销"我们的 agent"，问清楚他们改的是 model（罕见、贵），还是 scaffolding（中等门槛、能调），还是 harness（最常见、决定产品形态），三个答案对应三种公司。

## 三、训练专属四件套：把 agent 链到强化学习

这篇文章的隐藏价值在 Training 那一节。绝大多数中文圈的 agent 解读只覆盖推理侧——"怎么让一个 LLM 在循环里调工具"。HF 把训练侧四个词写出来：**RL Environment、Trainer、Rollout、Reward（+ Rubric）**。

**RL Environment** 是一个有状态的对象，接收 action、更新内部状态、返回 observation。LLM 场景里 action 通常就是工具调用——比如 `touch foo.txt` 这个 action 让文件系统 state 多了一个文件，返回的 observation 是新的目录列表。

**Trainer** 是把"模型变得更好"的那个程序。TRL 库里的 GRPOTrainer 是一个具体例子：一个 class 同时管 episode 生成、reward 打分、weight 更新。

**Rollout** 是一次完整 agent 跑，从 observation 开始到拿到 reward 结束。它也叫 trajectory 或 trace。一次训练步通常并行跑成百上千个 rollout，把它们拼成 batch 送进 trainer。

**Reward** 是分数。可以是 verifiable（测试通过/答案匹配）、learned（人类偏好或 LLM-as-judge）、sparse（一次跑完一个分）、dense（每步一个分）。**Rubric** 是把 reward 拆成多维加权——OpenEnv 和 Verifiers 库把 rubric 实现成可组合对象（WeightedSum、Sequential、Gate）。

![训练 RL pipeline](02_training_pipeline.png)

为什么 HF 一定要把训练侧术语和推理侧术语绑在一起？因为现在最重要的工程实践——**agent 训练时用的 harness 必须和部署时用的 harness 是同一份代码**——只有术语对齐才能保证这一点。这就是为什么 HF 强调 scaffold/harness 拆开：训练时你只想更新 model 的权重，不想让 RL 算法去"学" harness 的 bug；部署时 harness 还是同一个，但 scaffolding 可能因为不同产品被换掉。

Patrick O'Shaughnessy 的 O'Reilly Radar 文章和 OpenAI 关于 Codex 的工程帖都从推理侧讲过这件事，但它们没把训练那一端的术语补齐。HF 这篇是目前为止把两端画在一张图里最清楚的一次。

## 四、Tool / Skill / Sub-agent 的三阶递进

文章另一组有用的区分是 tool、skill、sub-agent 三个词。中文圈里这三个词经常混用——"工具调用"和"调用 agent"听起来差不多。HF 给了一个干净的三阶递进：

- **Tool** 是一个动作。"运行这条命令"、"查一下天气 API"。结构化 function call，模型生成意图、harness 执行。
- **Skill** 是一个打包好的知识体——为了完成某个目标，把需要的多步动作 + 上下文 + 检查项打包成一个可加载、可复用的单元。"调查这个 bug，提出假设，写一个修复"。
- **Sub-agent** 是被另一个 agent 调用的另一个 agent。它有自己的 model 和 scaffold，自己推理，返回结果。**关键区别：sub-agent 能自己再调工具、再调 sub-agent**——tool 和 skill 不会。

![Tool / Skill / Sub-agent 三阶递进](03_tool_skill_subagent.png)

这个区分在 PRD 写作上立刻有用。如果一个功能"只需调一次外部 API、把结果塞回来"，它是 tool；如果它"需要按一套流程跑多个动作、还有中间检查"，它是 skill；如果它"需要独立判断、可能再调别的工具"，它就是 sub-agent。三者的工程复杂度差一个数量级——tool 是几小时活、skill 是几天、sub-agent 是几周。

Memory 那一节顺手补了短期长期的区分：**short-term memory** 是 context window 内的——一次 run 期间的对话历史、tool 结果、中间推理；**long-term memory** 是 context window 外的——外置存储、按需 retrieval、塞回 context 时叫 retrieval-augmented。这条切分不新，但 HF 把它和 context engineering 绑在一起写很整洁。

## 盲区：HF 这条等式哪里有折扣

不是所有事 HF 都说圆了。

第一，**中文圈的"智能体 = 模型 + 工具 + 记忆 + 规划"四件套并不会因为 HF 发一篇博客就消失**。百度、阿里、智谱、零一万物的对外材料、产品 doc、PM 培训都在用这套写法。HF 这条等式短期内只在英文工程圈和会读 HF 博客的中国工程师群体里流通。跨方言对接时仍然需要双语翻译表——"harness ≈ 执行框架"，"scaffolding ≈ 系统提示 + 工具描述 + 输出格式"。

第二，**long-term memory 还是黑话**。HF 这篇把它一句话带过——"外置存储、按需 retrieval"。但实际工程里 long-term memory 的设计选择多得是：是按 session 切片，还是按 entity 切片？是 vector search，还是 hybrid search？是 read-only 还是 write-back？这些选择直接决定 agent 的"性格"，而 HF 没有给收敛术语。

第三，**Agent 这个词本身没有被 HF 彻底回收**。文章承认在 RL 圈 agent 就是一个 "observation → action" 的函数，但在 LLM 圈 agent 已经被扩成 "model 加它周围一切"——这条扩张其实正是过去两年术语混乱的根源。HF 选择和扩张和解，没有强行把 agent 拉回 RL 定义。这是务实，但也意味着 "agent" 这个词在未来还会继续被人滥用。

![Short-term vs Long-term memory](04_memory.png)

## 对从业者意味着什么

对一线工程师：**和外部供应商谈 agent 项目之前，先用三个问题验证对方的术语层级**——"你们改的是模型权重，还是 scaffolding，还是 harness？" 三个答案的工程量差一个数量级。如果对方含混说"我们端到端优化"，那基本是 harness 调一调而已。

对 PM 和产品决策者：**写 PRD 时把 tool / skill / sub-agent 三个词的边界明确**。把所有交互都写成 "agent 调用"，工程会无差别按 sub-agent 拆，最后做出一个比需求重 10 倍的系统。HF 给的三阶定义可以直接抄进 PRD 术语表。

对 ML 工程师：**训练侧用 GRPO/PPO 的人现在终于有了对外讲清"我在干什么"的统一词汇**——你跑的是 rollout，你算的是 reward 或 rubric，你的 trainer 在更新 model 权重而不是 scaffolding。和推理侧的工程师对齐起来不会再卡在"你说的 trajectory 是不是我说的 trace"。

对中国 AI 应用层：**这套术语是英文圈定的，国内 PM 培训和产品文档需要做翻译适配**。最简单的做法是把 "harness" 翻成 "执行框架"、把 "scaffolding" 翻成 "提示与工具脚手架"、把 agent 限定在"完整可独立跑的系统"。否则你和你的工程负责人、外包公司、海外合作伙伴之间会一直在用三套不同的 mental model 讨论同一件事。

HuggingFace 没发明任何一个新词，但它把每个词放在了正确的位置。术语对齐这件事在工程行业里不是文人雅趣——是项目能不能按时交付的前置条件。

## 本期关键词

**Harness** —— Agent 的执行层。它负责在循环里调用模型、解析模型输出里的工具意图、真正执行工具、把工具结果塞回 context、判断什么时候停。Harness 不直接产生智能——智能在 model 权重里——但 harness 决定 model 怎么被使用。harness engineering 这门工程在训练侧和推理侧都成立，区别只是 reward 的来源（训练时是 RL signal，推理时是产品指标）。Claude Code、Codex、Cursor、Antigravity 都在卖自家的 harness，模型可能是同一个。

**Scaffolding** —— Model 看到的那部分世界。它包括 system prompt、tool descriptions、模型回复的解析格式、跨步骤的 context 管理。scaffolding 是你写给模型的 "instruction surface"——这个 surface 决定模型在每一步看到什么。和 harness 的区别：scaffolding 是模型的输入侧（模型能看到），harness 是模型的执行侧（模型看不到）。同一个模型套不同 scaffolding 会有完全不同的行为，这就是为什么 prompt engineering 和 context engineering 在过去三年没有过时。

**Policy** —— Agent 在任意状态下采取每个 action 的概率分布。在 LLM agent 里，policy 有一部分被烧在模型权重里（pretraining + RLHF 的产物），还有一部分由 scaffolding 和 harness 共同决定（同一个 checkpoint 套不同 scaffolding 会展现完全不同的 policy）。Policy 不等于 agent——policy 描述行为，agent 是在 environment 里真正跑的那个系统。把 checkpoint 包进 scaffolding 和 harness 部署出去，你才得到一个 agent，它在 environment 里的实际行为就是它的 policy。

**Rollout** —— 一次从头到尾的完整 agent 跑：agent 看到了什么、做了什么、每一步拿到了什么 reward。也叫 trajectory 或 trace。Rollout 是 RL 算法学习的原始数据——trainer 并行跑很多个 rollout，把它们打成 batch，按 reward 打分后用来更新 model 权重。一次训练步的 rollout 数量是工程经验值，TRL 的 GRPOTrainer 默认跑 16-64 个。

**Rubric** —— Reward 的多维加权拆解。不再用一个数字表达"这次 rollout 有多好"，而是把它拆成多个维度（比如"代码能跑"、"测试通过"、"风格干净"），每个维度独立打分，最后按权重组合。OpenEnv 和 Verifiers 这两个开源库把 rubric 实现成可组合对象（WeightedSum、Sequential、Gate），方便实验。比单一 scalar reward 更适合训练复杂任务，但也更容易调成 reward hacking。

**Sub-agent** —— 被另一个 agent 调用的另一个 agent。它有自己的 model 和 scaffolding，自己推理，自己可能再调工具或再调 sub-agent，最后返回一个结果给调用者。Sub-agent 和 tool 的根本区别：tool 是 deterministic 的 function call（输入 → 输出），sub-agent 自己会推理，自己能选择走哪一步。Sub-agent 和 skill 的根本区别：skill 是被 agent 调用的"packaged knowledge"，没有独立判断；sub-agent 有。把一个功能误判成 sub-agent 会让工程量翻 5 到 10 倍。

## 引用

1. [HuggingFace Blog: Harness, Scaffold, and the AI Agent Terms Worth Getting Right](https://huggingface.co/blog/agent-glossary) —— 一手原文，Sergio Paniego & Aritra Roy Gosthipaty，2026-05-25
2. [@Vtrivedy10: The Anatomy of an Agent Harness](https://x.com/Vtrivedy10/status/2031408954517971368) —— Harness 解剖图，HF 引用作为推理侧 harness 概念的最早可视化
3. [Patrick O'Shaughnessy: Agent Harness Engineering (O'Reilly Radar)](https://www.oreilly.com/radar/) —— harness engineering 这条术语的早期推广来源
4. [OpenAI: Harness Engineering — leveraging Codex in an agent-first world](https://openai.com/blog) —— Codex 团队对自家 harness 的工程论述
5. [Cursor: Continually improving our agent harness](https://cursor.com/blog) —— Cursor 把 harness 当作产品差异化叙事的官方表述
6. [lm-evaluation-harness (EleutherAI)](https://github.com/EleutherAI/lm-evaluation-harness) —— "eval harness" 这条术语的事实标准实现，HF 借它说明 harness 在评估侧的同构使用
