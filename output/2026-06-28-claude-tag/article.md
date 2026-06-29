---
title: 给 AI 发工号：Claude Tag 真正改的不是 Slack，是"谁能干什么"
source: https://www.anthropic.com/news/introducing-claude-tag
author: Anthropic
date: 2026-06-28
type: decode
voice: default-doubao
style: default
tags: [Anthropic, ClaudeTag, 智能体身份, agent-identity, Slack, 企业AI, ambient-mode, 权限治理, Opus4.8]
---

6 月 23 日，Anthropic 上线了 Claude Tag。媒体标题几乎一致："现在你可以在 Slack 里 @Claude 了。"这句话没错，但它把一个治理层面的变化，讲成了一个聊天框的小升级。

"在 Slack 里召唤一个机器人"早就不是新闻。真正变了的东西藏在一句话里。Anthropic 的 Noah Zweben 这么描述 Claude Tag 背后的设计："智能体身份把'这个用户能干什么？'这个问题，换成了'这个智能体在这个隔间里能干什么？'"（原文："Agent identity replaces the question 'what can this user do?' with 'what can this agent do in this compartment?'"）这句话的分量，比"可以 @它了"大得多——它意味着公司的权限系统里，第一次正式多出了一类既不是人、也不是普通脚本的成员。

## @一下，背后是一个独立工号

先把表面那层讲清楚。你在某个频道里 @Claude，提一个需求——把这周的客诉整理成报告、查一下这个 bug、给这份合同列风险点。Claude 把任务拆成几步，依次用它手上有的工具去做，结果直接发回 Slack 线程里。这一段，和你以前 DM 一个 AI 没什么本质不同。

不同的是接下来。这个频道里只有一个 Claude，所有人共用同一个。它干到一半，同事能看见进度，能接着你停下的地方继续推。Anthropic 自己的产品负责人 Cat Wu 把这点说穿了："Claude Code、Cowork、聊天都非常'单机'，而 Claude Tag 一开始就是为互动、为多人在线而造的。"（原文："Claude Code, Cowork, and chat are very single-player, whereas Claude Tag is built to be interactive and multiplayer."）

"单机"变"多人在线"这个比喻不只是营销话术。它带来一个具体后果：AI 的输入和产出，从此默认是团队公共物。以前你私聊 AI，对话是你一个人的黑盒；现在你 @它，整段交互摊在频道里，谁都能看、谁都能掰方向。这对协作是好事，对"我随口问个蠢问题"的心理负担，是另一回事。

但这些还都停留在"用法"。Claude Tag 真正的产品骨架，是它给 Claude 配了一个独立身份。

## 把 AI 当成一类新账号来治理  

传统的权限管理，回答的是“这个**人**能访问什么”。一个员工有账号、有角色、有权限清单，能进哪些系统由 IT 配好。AI 助手过去要么挂在某个人的权限下（它能干的就是这个人能干的），要么是个写死权限的服务账号。  

Claude Tag 走了第三条路：Claude 有自己独立于任何个人账号的身份。管理员给这个身份配默认的权限、工具、连接——能进哪些代码库、能用哪些 API key、装哪些 skill 和插件——然后按频道再调整。法务频道的 Claude，碰不到工程的资源，除非被明确授权。  

记忆也跟着身份走，按频道隔离。销售频道里的 Claude 学到的东西，不会渗到工程频道去，两边的记忆不互通。私有频道维持各自独立的身份，公开频道才共享一个工作区级身份。这就是 Zweben 说的“隔间”——不是一个无所不知的全局 AI，而是一堆被墙隔开、各管一摊的实例。  

这套设计的代价和好处是同一件事：你现在得像管一个真员工那样管这个 AI。好处是它能被精确约束；代价是你必须真的去配，配错了就是真出事。

## 它行动时，留下的是它自己的脚印

身份独立带来一个容易忽略、但对企业极重要的副作用：审计。

因为 Claude 以自己的身份去调工具、发请求，它的每一个动作会出现在所连服务自己的审计日志里——不是混在某个员工名下，而是清清楚楚记成“这个 agent 干的”。Anthropic 还在自己这侧记录全部任务、记忆更新、网络请求。出了事要追责，至少账面上能查到是谁、在哪个频道、让它做了什么。

撤权也因此变干净。管理员不用去一个个收回散落在各处的权限，停用这个身份，所有口子一起关。Anthropic 还给了两道成本闸：月度 token 消费上限，组织级和频道级都能设；活动日志里能看到每个操作的发起人。

对一个要把 AI 真正放进生产环境的公司，这几样东西——独立身份、独立审计、一键撤权、消费上限——比“Claude 又聪明了多少”实用得多。它们解决的是另一个问题：当一个非人成员开始替你动真东西，你怎么不丢掉控制权。

## 永远在线的那位"同事"

Claude Tag 还有一个开关叫 ambient（主动模式）。开了之后，Claude 不等你 @，它会持续跟着频道和所连工具，主动提示它觉得你该知道的事，跟进那些没人收尾的线程。Anthropic 把整个体验形容为"像和一个真同事共事——一个能在所有人眼前产出工作的同事"。

说成同事，是个聪明的框架，但也藏着这次发布最该盯住的地方。一个会主动插话的同事，等价于一个**永远在线、持续在读全频道**的账号。安全侧的评论已经点到这层：在 ambient 模式下，Claude"会持续分析组织数据——文档、对话、工作流——不需要你显式下命令"。便利和监听，是同一个机制的两面。

数据也一样。Geeky Gadgets 的分析把话挑明：Claude Tag 对敏感公司数据的访问，"带来关于所有权、安全与潜在滥用的担忧"，企业得想清楚自己的数据在 Anthropic 系统里怎么存、怎么处理、怎么保护。再加一层："上下文锁定"——你越深地把组织上下文喂给它，就越难离开 Anthropic。这不是说它一定会出问题，而是说，决定开 ambient、决定把哪些频道交给它之前，这些是必须先算的账，不是事后补的。

## 盲区：我们不知道的

那个 65% 要小心读。Anthropic 说自家产品团队 65% 的代码由内部版 Claude Tag 产出。这是公司自报的数字，没有第三方核验；而且 Anthropic 的工程团队是地球上最懂怎么用 Claude 的一群人，他们的比例不能直接搬到一家普通公司头上。官方原文是“由它创造（created by）”，Fortune 转述成“批准并并入（approves and incorporates）”，两种说法的含义差着一截——是它写的，还是它审过放行的？发布材料没说死。

记忆隔离的边界也还没被外部压力测过。“销售频道学的不渗到工程频道”是设计意图，真实世界里跨频道引用、共享连接、管理员手滑授权，会不会把墙凿穿，要等真用起来才知道。一个开着 ambient、读着满频道内容的 agent，恰恰是 prompt 注入（有人在频道里埋一段话，诱导 AI 做它不该做的事）最舒服的攻击面——这一点 Anthropic 的发布材料没有正面展开。Anthropic 自己也留了话：后续会上“身份感知”的控制，对敏感操作要求频道权限和用户权限同时满足。换句话说，今天这版，敏感操作的双重确认还没到位。

定价同样模糊。除了“管理员能设月度 token 上限”，具体单价、一个活跃的 Claude 一个月大概烧多少，没有公开数字。对要做预算的人，这是个真空。

## 对 AI 从业者/实践者意味着什么

如果你管 IT、安全或平台：把 Claude Tag 当成一类**新的非人账号**纳入你现有的身份治理，而不是当一个聊天插件审一遍就算。老问题还是那些——这个身份能进哪些系统、它的动作进不进我们的 SIEM（安全日志汇总系统）、谁有权改它的权限、它一个月最多花多少——只是对象换成了 AI。先在低敏感频道试，把审计日志和 token 上限接进现有流程，再往核心系统放。ambient 默认别开，想清楚监听换来的便利值不值再开。

如果你是普通团队成员：你和同事现在共用一个会记事、还可能主动插话的 Claude。你 @它说的每句话，都成了团队的公共上下文，也成了它长期记忆的一部分。这意味着把活交给它能省不少来回解释，但你也得知道哪些话不该在它在场的频道里说。它是同事，但它的“记性”和“嘴”都连着管理员配的那套权限——它替你做的事，留下的是它的工号、查得到的脚印。

更大的一层：Anthropic 不是唯一在做这件事的。微软、Glean、Snowflake、Databricks 都在抢搭企业的“组织上下文层”。Ramp 今年 5 月的 AI Index 里，Anthropic 的企业采用率 34.4%，略高于 OpenAI 的 32.3%。Claude Tag 这步棋，争的不是“哪家模型答得好”，而是“哪家的 AI 先变成你公司花名册上的一员”。一旦它真进了花名册，换供应商的成本，就和换一个深度嵌进流程的同事一样高。

## 本期关键词

- **智能体身份（agent identity）** —— 给 AI 配一个独立于任何人类账号的身份，有自己的权限、工具访问和记忆。过去 AI 助手要么借用某个员工的权限，要么是写死权限的服务账号；agent identity 把它当成“第三类成员”来管：既不是人，也不是普通脚本，而是一个有工号、有权限清单、会被单独审计的非人账号。Claude Tag 的整套治理（按频道隔离、审计日志、一键撤权）都建在这个概念上。

- **ambient 模式（主动/环境模式）** —— 关闭时，Claude 等你 @它才动；开启后，它会持续跟着频道和所连工具，不用你下令就主动提示、跟进没收尾的事。好处是它像个会操心的同事；代价是它等于一个永远在线、持续在读全频道内容的账号，便利和监听是同一个开关的两面。

- **scoped memory（按频道隔离的记忆）** —— Claude 学到的东西不是攒成一个全局大脑，而是被关在各自的“隔间”里。销售频道的记忆不流到工程频道，私有频道各自独立。这是为了防止 AI 把它在 A 处听到的，泄露到不该知道的 B 处。是设计意图，边界是否真严，还得真用起来才知道。

- **prompt 注入（prompt injection）** —— 攻击者在 AI 能读到的内容里（比如一条 Slack 消息、一个文档）埋一段指令，诱导 AI 去做它本不该做的事，比如泄露数据或越权操作。一个开着 ambient、自动读满频道内容的 agent，正好给了这种攻击最大的下手空间，所以“它能读到谁的东西”必须卡死。

- **上下文锁定（context lock-in）** —— 你越深地把公司的对话、文档、流程喂给一个 AI 平台，让它越懂你的业务，就越难换到别家——因为换走意味着丢掉它积累的全部上下文。这是平台型 AI 产品天然的护城河，也是采购方要提前算的退出成本。

## 引用

1. [Introducing Claude Tag](https://www.anthropic.com/news/introducing-claude-tag) —— Anthropic 官方发布页（一手）。"Within a given Slack channel, there's one Claude that interacts with everyone."（在一个给定的 Slack 频道里，只有一个 Claude 与所有人交互。）"65% of our product team's code is created by our internal version of Claude Tag."（我们产品团队 65% 的代码，由内部版 Claude Tag 创造。）
2. [What is Claude Tag? — Claude Help Center](https://support.claude.com/en/articles/15594475-what-is-claude-tag) —— Anthropic 官方文档（一手）。
3. [Anthropic's Claude Tag gives AI agents independent identities — Help Net Security](https://www.helpnetsecurity.com/2026/06/24/anthropic-claude-tag-agent-identity-model/) —— 二手。Noah Zweben："Agent identity replaces the question 'what can this user do?' with 'what can this agent do in this compartment?'"（智能体身份把"这个用户能干什么？"换成了"这个智能体在这个隔间里能干什么？"）
4. [Anthropic's Claude Tag is learning your company, one Slack message at a time — TechCrunch](https://techcrunch.com/2026/06/23/anthropics-claude-tag-is-learning-your-company-one-slack-message-at-a-time/) —— 二手。"working with a real colleague — one that can produce work in public view."（像和一个真同事共事——一个能在所有人眼前产出工作的同事。）
5. [Anthropic releases Claude Tag, a virtual employee that works within Slack — Fortune](https://fortune.com/2026/06/23/anthropic-claude-tag-virtual-employee-tool-slack/) —— 二手。Cat Wu："Claude Code, Cowork, and chat are very single-player, whereas Claude Tag is built to be interactive and multiplayer."（Claude Code、Cowork 和聊天都非常"单机"，而 Claude Tag 一开始就是为互动、为多人在线而造。）含 Ramp 2026 年 5 月 AI Index 采用率数据。
6. [Anthropic Claude Tag Explained: 2026 Features and Risks — Geeky Gadgets](https://www.geeky-gadgets.com/claude-tag-data-privacy-risks/) —— 二手（风险视角）。"access to sensitive company data raises concerns about ownership, security and potential misuse."（对敏感公司数据的访问，带来关于所有权、安全与潜在滥用的担忧。）
