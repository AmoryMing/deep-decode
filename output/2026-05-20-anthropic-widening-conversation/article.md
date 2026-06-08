---
title: Anthropic 把对话向神职人员打开：safety lab 的定位战
source: https://www.anthropic.com/news/widening-conversation-ai
date: 2026-05-20
type: decode
status: awaiting-evaluation
tags: [Anthropic, AI治理, AI安全, alignment, 政策]
---

# Anthropic 把对话向神职人员打开：safety lab 的定位战

![](cover.png)

一家以 safety lab 自我定位的公司，正在把对话向神职人员、哲学家和伦理学家打开。

2026 年 5 月，Anthropic 发了一篇标题克制的博客 "Widening the Conversation on AI"。原文只有几百词，列出已经完成的一轮对话——"scholars, clergy, philosophers, and ethicists from more than fifteen religious and cross-cultural groups"——以及未来要扩展的对话对象——"legal scholars, psychologists, writers, and civic institutions"。读起来像一份温吞的 outreach 公告。

但放在 2026 上半年这个时间点看，这不是 outreach。这是一次明确的定位动作。

OpenAI 在卖产品，xAI 在打嘴炮，Anthropic 在主动收集"对话权"。三家头部模型公司里，只有 Anthropic 在系统性地把自己钉在"AI 实验室"与"公共议题中介"之间的那一格。这一格过去是空的，过去由学者、智库、NGO 占据。现在 Anthropic 在亲自下场坐下来。

![](01_safety_posture.png)

## 公告说了什么

公告的语气是集体的"我们"，没有 Dario 或 Jack Clark 的署名引用。这本身就是信号——它不是某一个人的观点，是公司层面的姿态。

值得逐字看的几句话：

> "At Anthropic, we want to build AI systems that advance humanity and act for the global good."
>
> 在 Anthropic，我们想构建推进人类发展、为全球福祉服务的 AI 系统。

> "we need to engage with those who see the world from a variety of different perspectives."
>
> 我们需要与那些从多种不同视角看世界的人接触。

> "we hope these conversations might inform the practical work of developing Claude."
>
> 我们希望这些对话能够指导开发 Claude 的具体工作。

这三句话连起来构成一个闭环：我们在做 AI 善治 → 因此需要多元视角 → 视角会回到 Claude 的开发。最后一句尤其关键。它不是"我们在听"，而是"我们听到的会进产品"。这把"对话"从公关动作升级成了产品输入。

公告里还埋了一个具体的研究结果。Anthropic 测试了一个让 Claude 在执行任务过程中暂停做伦理反思的实验工具，结果在多项内部 alignment 评估里"markedly lower rates of misaligned behavior"。这个机制的灵感，来自前面那些对话里讨论的"safe other"——一个在道德冲突时可以求助的对象。

宗教传统的"良师"概念，被翻译成 Claude 内部的一个 prompt-level 暂停机制。这个翻译动作就是这篇公告的真正信号。

![](02_widening_arenas.png)

## 这次"对话扩散"是一次政治动作

把这个动作放回 2026 的具体上下文里。

第一，监管时点。美国的 AI 行政命令进入第二个修订周期，欧盟 AI Act 的高风险系统条款开始实质性执行，加州 SB 53 后续法案在准备。监管机构在找"问题清单"——AI 该被监管的边界是什么、用什么语言描述、找谁咨询。

第二，对话对象的选择。Anthropic 没有选用户、没有选开发者、没有选企业 CTO，而是选了宗教学者、神职人员、哲学家、伦理学家，下一轮要加法律学者、心理学家、作家和公民机构。这个名单的共同特征是——**在监管议题里有道德合法性，但没有商业利益**。当立法者听证时，这些人是最容易被邀请、最容易被引用、最容易被认为代表"社会"的群体。

第三，叙事包装。Anthropic 在公告里把这条研究线命名为 "Moral Formation Research"——道德养成研究。这个命名值得停下来看。alignment 这个词技术性太强、太像 RLHF 调参；moral formation 则直接借用了哲学和宗教教育的术语。换个词，听众就从工程师换成了伦理学家。

这三件事合起来，是在做一件单一的事：把 Anthropic 的安全叙事变成监管语境的默认问题框架。

OpenAI 用的是"preparedness levels"。xAI 用的是"truth-seeking"。Anthropic 用的是"constitution"、"alignment"、"moral formation"——三个都自带"应该"的味道。当立法者最终要写一句"AI 公司应当......"时，他们大概率会借用 Anthropic 提供的词，而不是 OpenAI 的。

这就是为什么"扩大对话"温和的外表下，是硬定位。

![](03_policy_capture.png)

## 框架：安全姿态的扩音器策略

把这套打法命名为**安全姿态的扩音器策略**（Safety-Posture Amplifier）。

第一层，在内部把命名升级。把 alignment 重新叙述为"宪法"、"道德养成"、"safe other"，让它从工程问题听起来像伦理问题。

第二层，把这套命名带出去，找外部群体做结构化对话。神职人员、哲学家、伦理学家是天然的传声筒——他们的话语权来自非商业的道德权威，他们使用的词汇会被媒体和监管引用。

第三层，等外部群体开始用 Anthropic 的命名讨论 AI，监管语境就被默认收编了。立法者听证时，被邀请的伦理学家用着 Anthropic 给的词，监管文献里"行业已与社会广泛对话"的句子开始出现，Anthropic 自己却不需要再说一次。

这套策略的高明之处在于——它不是 lobby。Lobby 是直接游说立法者，付钱给说客。扩音器策略是塑造立法者将听到的语言。前者会被记录在游说支出公开数据库里，后者不会。

公告里同时出现 KPMG 和 PwC 这两家咨询公司，是这套策略的另一只手。咨询公司是企业合规和政府咨询的传导带——当某个司法管辖区的监管机构要做 AI 风险评估，他们大概率请的就是 KPMG / PwC / Deloitte / EY。Anthropic 在和这两家做企业部署的同时，等于把自己的安全语言种进了未来咨询报告的脚注里。

![](04_anthropic_vs_openai_vs_xai.png)

## 监管语境会被怎么改写

具体到从业者要关心的事：监管的"该问什么问题"正在被重写。

过去监管者问的是技术问题——参数量多少、训练数据来源、是否使用 RLHF、是否有红队测试。这些问题答案有限、可量化、容易合规化。

Anthropic 在推动的是新一类问题——AI 系统的"性格"是怎么形成的、它的"价值观"训练用了什么、在道德冲突时它会向哪种"safe other"求助。公告里有一句话明确这点："developers...choosing which patterns to reinforce, which to set aside"——开发者在选择强化哪些模式、搁置哪些。这把训练过程描述成了道德选择，而不是技术决策。

如果监管开始按这个新框架问问题，模型公司将被要求披露的不是参数和数据，而是"价值观训练设计文档"、"道德反思机制"、"伦理审查记录"。这些东西 Anthropic 已经有了——Claude's constitution 就是现成模板。OpenAI 和 xAI 没有同样的预制内容。

谁制定了问题清单，谁就占据了合规模板的位置。

![](05_blind_spot_kpmg.png)

## 盲区：道德叙事和商业利益的边界

写到这里必须把另一面摊开。

Anthropic 不是 NGO。它是一家估值数百亿美元、和 KPMG / PwC 谈企业部署、和 AWS / Google Cloud 有几十亿美元基础设施合约、要打模型市场份额战的商业公司。这家公司同时在做两件事——和神职人员谈道德形成，和咨询公司谈企业合规——并且把两件事放在同一篇博客里。

这里有几个值得追问的问题。

被邀请的群体——那 fifteen religious and cross-cultural groups——是怎么选出来的？他们有发言纪要吗？他们的反对意见是否被同等收录？Anthropic 公告里没有给。

更直接的问题：当这些对话被未来的监管文献引用为"行业已和社会广泛对话"的证据时，被引用方是否有权决定怎么被引用？目前看没有。Anthropic 既是组织方、记录方，也是叙事框架的提供方。

还有一个尴尬的不对称：神职人员和哲学家面对一个估值数百亿的 AI 实验室坐下来谈话时，议程是谁定的、记录是谁写的、结论怎么形成共识？传统对话研究里，这种结构性不对称会被明确披露并控制。在 Anthropic 的公告里，这一层没有。

"对话扩散"和 lobby 之间的边界不是从有到无，是一道梯度。Anthropic 现在站在这道梯度上，向 lobby 那一端走还是向真正的公共协商那一端走，取决于它接下来是否愿意公开对话的程序细节——谁来选嘉宾、议程谁定、纪要谁审、反对意见怎么处理。

公告里没有任何关于程序的承诺。这就是这次定位战目前最大的盲区。

![](06_take_action.png)

## 对从业者意味着什么

**对 AI 政策研究者**：注意 Anthropic 提供的语言正在进入监管语境。下一个版本的 AI 立法草案如果出现 "moral formation"、"constitutional AI"、"safe other" 这类术语，就是扩音器策略生效的证据。建议追踪：被邀请的 fifteen religious and cross-cultural groups 的具体名单、对话纪要是否会公开。

**对 AI 产品负责人**：未来合规文档的形态会从"技术披露"扩展到"价值观训练文档"。提前准备一份能讲清"模型在道德冲突时怎么处理"的内部材料，比临时被问起来好。Claude's constitution 是参考模板。

**对模型公司战略**：OpenAI 和 xAI 在监管语境里目前是失声的——OpenAI 在 safety 议题上以技术披露为主，xAI 在嘴炮里。如果不在 2026 下半年补一套自己的"价值观叙事"，监管语言会默认采用 Anthropic 的版本。

**对一般 AI 从业者**：留意一个模式——技术公司把自己的工程概念翻译成伦理/哲学语言，再通过对话扩散到非技术群体，最后被引用回监管。这个模式不是 Anthropic 发明的（药企做过、烟草公司做过、社交平台做过），但 Anthropic 的执行精细程度值得记下来。具体到日常工作里，下次看到任何"AI 安全"的新术语，先问一句它最初是为了解决工程问题还是为了讲故事，再看它现在长什么样。两者之间的距离就是定位战的位移量。

**对学术研究者与学者**：如果接到 Anthropic 或其他模型公司的"对话邀请"，提前要清楚三件事——议程谁定、纪要谁审、自己的反对意见会以怎样的形式被记录和引用。这不是冒犯邀请方，是任何严肃公共协商的程序前提。被引用比不被引用更需要程序保护。

## 本期关键词

**Moral Formation Research（道德养成研究）** —— Anthropic 提出的 alignment 新命名。把训练过程描述成道德教育而非工程调参。命名升级本身是定位动作，不是技术变更。

**Claude's constitution（Claude 的宪法）** —— Anthropic 早期公开的一份"价值与行为规范"文档，规定 Claude 在哪些情境下应该拒绝、怎么回应、用什么口吻。是 Anthropic 把 alignment 文档化的源头模板。

**safe other（安全他者）** —— 来自宗教/伦理传统的概念，指人在道德冲突时可以求助的另一个存在（如良师、长辈）。Anthropic 把这个概念翻译成 Claude 内部的一个 prompt-level 暂停机制，是这次"对话→产品"翻译动作的具体样本。

**安全姿态的扩音器策略（Safety-Posture Amplifier）** —— 本文命名的一套打法：内部把 alignment 升级为道德叙事 → 找外部群体做结构化对话 → 让外部群体的话语反过来塑造监管语境。比 lobby 隐形，比 PR 长效。

**问题清单收编（agenda capture）** —— 在监管议程形成前，先决定监管会问什么问题。比直接游说立法答案更前置，效果更持久。这次 Anthropic 在做的事的本质。

## 引用

1. [Anthropic: Widening the Conversation on AI](https://www.anthropic.com/news/widening-conversation-ai) — 官方公告，2026-05-19。
2. [Anthropic: Claude's Constitution](https://www.anthropic.com/news/claudes-constitution) — Claude 行为规范文档，本文中明确引用。
