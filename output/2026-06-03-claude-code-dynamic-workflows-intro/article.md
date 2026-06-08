---
title: 一门语言被重写了 75 万行：Claude Code 的 Dynamic Workflows 正式开闸
date: 2026-06-03
type: decode
slug: 2026-06-03-claude-code-dynamic-workflows-intro
style: default
reader: default
sources:
  - https://claude.com/blog/introducing-dynamic-workflows-in-claude-code
  - https://x.com/ClaudeDevs/status/2061900434722496604
distribute: [email, xiaohongshu]
---

# 一门语言被重写了 75 万行：Claude Code 的 Dynamic Workflows 正式开闸

5 月 28 日，Anthropic 在发布 Claude Opus 4.8 的同一天，给 Claude Code 上线了一个叫 **Dynamic Workflows（动态工作流）** 的功能，进入 research preview（研究预览）阶段。一句话说清它干什么：你交一个复杂任务，Claude 不再亲自一行行写代码，而是当场写出一份 JavaScript 编排脚本，用这份脚本在一次会话里调度几十到上百个并行子 agent 干活，交付前再自动验证。

判断这件事够不够分量，不看官方怎么吹，看谁已经拿它干成了什么。答案是：Bun（一个高性能 JavaScript 运行时）的作者用它，把整个 Bun 从 Zig 语言重写成了 Rust——约 75 万行 Rust 代码，原测试套件 99.8% 通过，从第一次提交到合并只用了 11 天。这不是 demo，这是一次真实的语言级整体迁移。本期就拆这条公告：它具体发布了什么、谁现在能用、怎么打开，以及那 75 万行是怎么来的。

![一次语言级重写：75 万行 Rust、11 天、99.8% 测试通过](assets/gpt-img/00_cover.png)

## 本期关键词

- **Dynamic Workflows（动态工作流）** —— Claude Code 新功能：Claude 现场写一份 JavaScript 编排脚本，把一个大任务拆给几十到上百个并行子 agent 执行，交付前自动验证。当前是 research preview。
- **research preview（研究预览）** —— 功能已能用但还没定型的发布阶段：放给真实用户跑，收集反馈，接口和行为可能继续变。
- **subagent（子 agent）** —— 由主 agent 派生、领一小块任务独立去做的实例。Dynamic Workflows 一次最多协调 1000 个，同时并行上限 16 个。
- **ultracode** —— Claude Code 里的一个设置项。打开后，Claude 会自己判断一个任务该不该启用动态工作流，不用你手动开口。

## 一、公告本身：发布了什么硬指标

![发布了什么：上千 agent 的受控调度](assets/gpt-img/01_announce.png)

先把功能的边界用数字钉死，否则"调度上百个 agent"听上去像营销话。ClaudeDevs 官方账号在公告推文里给了三个具体上限：

- 一次执行最多协调 **1000 个 agent**；
- 同一时刻并行上限 **16 个**；
- 脚本被打断能从断点续跑，不用从头再来。

整个流程是多阶段的，不是一股脑撒出去：先**规划**，再**分发**（把活扇出给一批 agent），然后**验证**，再**迭代**——这一步的设计很关键，是让一组独立 agent 去推翻另一组的结论，互相攻防直到答案收敛；全程进度持续保存，所以中途断了能续。

判断：这套上限本身就是产品定位的声明。1000 这个上界说明它瞄准的是单个上下文窗口根本装不下的任务——一个 agent 的上下文有限，能塞进去读的代码量有天花板，而 1000 个 agent 各读一块，等于把"一次能看多少"放大了三个数量级。16 的并行上限又说明它不是无脑堆并发，而是受控调度：真要 1000 个同时跑，光协调开销和资源争抢就会把收益吃掉，分批跑反而更稳。能续跑这一条最不起眼，却是把它从"玩具"和"生产工具"区分开的那道线——一个会跑几小时、烧大量 token 的长任务，中途断了若要从头再来，没人敢真把它用在生产任务上。

## 二、谁能用、在哪用、怎么打开

![谁能用、在哪用、怎么打开](assets/gpt-img/02_access.png)

公告把可用性讲得很细，这部分对想立刻上手的人最实用。

**覆盖的入口**：Claude Code 的 CLI（命令行）、Desktop（桌面端）、VS Code 扩展，以及 Claude API。

**覆盖的计划与云**：Max、Team、Enterprise 三档计划，外加 Amazon Bedrock、Google Vertex AI、Microsoft Foundry 三个云平台。也就是说，无论你是个人订阅还是企业走云厂商通道，路都铺好了。

**两种激活方式**：

- 直接对 Claude 说 "create a dynamic workflow"（创建一个动态工作流），手动点名要用；
- 或者打开 `ultracode` 设置，让 Claude 自己判断什么任务该用它，你不用每次开口。

这里有一个容易踩的默认值差异，必须说清：**Enterprise（企业版）计划默认是关闭的**，要管理员到 Claude Code 设置里手动开启；其他符合条件的计划则**默认开启**。判断：这个差异不是疏忽，是 Anthropic 在替企业 IT 管事——动态工作流烧 token 的量级远高于普通会话，企业默认关，等于把"要不要给全员开这把重武器"的决定权交回给管理员，而不是让它在不知情的情况下吃掉预算。

## 三、那 75 万行 Rust 是怎么来的

![那 75 万行是怎么来的](assets/gpt-img/03_howbuilt.png)

公告里最有说服力的不是功能列表，是 Bun 的案例。Bun 作者 Jarred Sumner 用 Dynamic Workflows 把整个 Bun 从 Zig 重写成 Rust，几个数字值得逐个看：

- 约 **75 万行** Rust 代码；
- 原测试套件 **99.8% 通过**；
- 从第一次提交到合并 **11 天**。

光有结果不够，方法才是能不能复用的关键。Sumner 的做法是三件事的组合：

1. **文件级并行生成** —— 不是让一个 agent 顺着写，而是按文件切开，多个文件同时由不同 agent 生成；
2. **每个文件配两名 reviewer（审查员）** —— 每份生成的代码，都有两个独立 agent 来审，而不是写完就算；
3. **夜间自动跑优化 pass** —— 人下班后，让工作流继续在夜里对代码做优化轮次。

把这三件事对上第一节的"多阶段"就能看懂：文件级并行就是"分发"，双 reviewer 就是"验证"，夜间优化轮次就是"迭代"——Bun 这个案例几乎是把官方那套流程一比一跑了一遍，只不过跑在 75 万行的规模上。

这里"每个文件配两名 reviewer"这个细节值得单独拎出来。为什么是两名、为什么要独立？因为让生成代码的那个 agent 自己审自己，等于裁判和球员是同一个人——它会偏袒自己刚写出来的东西。换成两个没参与生成、上下文隔离的 agent 来审，它们没有"自己的答案"要维护，挑刺时才下得去手。这不是靠提醒模型"认真一点"，是用结构把"自我偏袒"这个毛病从流程里挤出去。

判断：99.8% 这个数字比 75 万行更重要。语言级重写最怕的不是写不出来，是写出来一堆看着对、跑起来错的代码——历史上无数迁移项目就死在"最后那几个百分点"的回归 bug 上。99.8% 测试通过意味着"双 reviewer + 夜间优化"这套结构真的把质量兜住了，而不是用速度换正确性。Anthropic 给这件事下的官方注脚是一句很重的承诺：**原本按季度规划的工程量，现在按天交付**。一次过去要一个团队几个月、出错率高到没人敢碰的迁移，这里压进了 11 天。

## 四、代价：它是重武器，不是顺手工具

![它是重武器，不是顺手工具](assets/gpt-img/04_cost.png)

公告没有回避成本，反而专门强调了。Dynamic Workflows 的 token 消耗**远高于普通会话**，需要谨慎 scoping（界定任务范围），它适合的是复杂、高价值的任务。

判断：这句话该被每个想尝鲜的人抄下来。它和第二节"企业默认关闭"是同一件事的两面——这不是用来写个小函数、改个 typo 的工具，那样用就是拿火箭筒打蚊子，账单会很难看。它的甜点区是那种"规模大到一个上下文装不下、且答错代价很高"的任务：全代码库 bug 猎杀、profiler（性能剖析器）引导的优化审计、安全审计与加固、大规模迁移与现代化。Bun 的重写正好踩在这个甜点区正中间——规模够大、错了代价够高、价值够高，值得为它烧那么多 token。

## 五、企业已经在用它干什么

![企业已经在用它干什么](assets/gpt-img/05_enterprise.png)

research preview 不等于没人在用真章。公告放了两条企业反馈，指向的恰恰是上面那个甜点区。

Klarna 的高级工程经理 Alessio Vallero：

> "Dynamic workflows have been especially valuable for discovery and review tasks across large codebases. We've seen strong results using it to identify dead code."（动态工作流在大型代码库的勘察与审查任务上尤其有价值，我们用它找死代码，效果很好。）

CyberAgent 的首席系统工程师 Ken Takao：

> "Dynamic workflows fill the gap between firing off a single subagent and building out a full agent team. Plan to implementation just flows."（动态工作流填上了"随手发一个子 agent"和"搭建一整支 agent 团队"之间的空档，从规划到落地一气呵成。）

判断：这两条反馈把它的真实价值说得比官方功能页更准。Vallero 说的"找死代码"，是个最典型的"规模大但单点不难"的任务——要扫遍整个代码库才能确认某段代码真没人用，这正好是并行子 agent 的活，一个 agent 扫不完。Takao 说的"空档"则点中了它的产品位置：在它之前，你要么将就用一个 agent，要么花工程师的时间手搭一整套多 agent 系统；现在这层编排由模型按需即时生成，人不必先成为分布式系统工程师，才能调度一支 agent 队伍。

## 对从业者意味着什么

![对从业者意味着什么](assets/gpt-img/06_takeaway.png)

这条公告交出的不是一个"又快了一点"的功能，而是一个新的工具档位：当你面对一个大到一个上下文装不下、错了代价又高的任务时，第一次有了"让模型自己写编排脚本、调度一支 agent 队伍"这个选项。

- **对想立刻上手的工程师**：先确认你的计划档位——Max / Team 默认开，Enterprise 要找管理员开。激活就两条路：手动说 "create a dynamic workflow"，或开 `ultracode` 让 Claude 自己判断。但别拿它干日常小活，token 账单会教你做人。先挑一个"规模大 + 错了代价高"的真任务练手，比如全库死代码清理或一次有测试兜底的迁移。
- **对要做大迁移的团队**：Bun 那套方法是可抄的模板——文件级并行生成 + 每个文件配两名独立 reviewer + 夜间自动优化轮次。99.8% 的测试通过率说明，质量是靠"双重独立验证"这个结构兜住的，不是靠模型一次写对。所以前提是你得先有一套能跑的测试套件，否则验证那一环是空的。
- **对管理预算的人**：把它当重武器立项，不是把它当日常订阅铺给全员。Enterprise 默认关闭这个设计就是提醒——先想清楚哪些任务值得为它烧 token，再决定给谁开。它的回报来自"按天交付原本按季度的工程量"，所以只在那种工程量级的任务上算账才划算。
- **对所有人**：research preview 意味着接口和行为还会变，现在投入要留好"它会改"的余量。但 Bun 的 75 万行已经证明它不是 PPT——值得现在就找一个真任务，把这套"模型当工头、agent 当工人"的工作方式跑通一遍。

## 引用

1. Introducing dynamic workflows in Claude Code（官方公告）：https://claude.com/blog/introducing-dynamic-workflows-in-claude-code
2. ClaudeDevs 公告推文（1000 agent / 16 并行上限 / 断点续跑）：https://x.com/ClaudeDevs/status/2061900434722496604
