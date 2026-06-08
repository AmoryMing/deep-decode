---
title: 坏代码现在是最贵的：Pocock 把 specs-to-code 派打脸了
source: https://aihero.dev
author: Matt Pocock
date: 2026-05-26
type: decode
---

Matt Pocock 在 AI Engineer 大会上的演讲没用一张架构图，结论却比这两年所有"AI 重塑软件工程"的报告都更刺人：**AI 不是软件基本功的替代品，而是软件基本功的价格发现机制**。过去十年我们模糊地说"坏代码会让维护成本变高"，现在 AI 把这件事算到了小数点后两位——好 codebase 接上 Claude Code 是产出乘以三，坏 codebase 接上 Claude Code 是熵乘以三。

![封面](00_cover.png)

这句话之所以重要，是因为它直接打脸了现在这一波最热的工具范式——specs-to-code。Karpathy 在 X 上推过"vibe coding"，腾讯 CodeBuddy、阿里通义灵码、智谱 CodeGeeX 全在主推"写 spec → 跑 compiler → 出代码 → 不看代码 → 改 spec"这条闭环。Pocock 自己也试过，他在台上举手投票："你试过这条路的请举手。" 一半人举手。"觉得越跑越烂的请别放下。" 几乎没人放下。

## 一、specs-to-code 闭环为什么会越跑越烂

specs-to-code 派的理论是"code is cheap"——代码只是 spec 的编译产物，烂了重新编一次就行。Pocock 把这句话直接翻成反面：**bad code is the most expensive it's ever been**——坏代码现在比以往任何时候都更贵。

证据来自一个他亲自做过的实验：拿 spec 反复跑 compiler。第一次出 70 分的代码，回去改 spec，再跑，出 60 分的代码，再跑，出 50 分的代码。原因是 spec 不能编码"为什么这里不该用 mutable state"、"为什么这个 module 该深不该浅"这类只有读过 codebase 才能形成的判断。Pragmatic Programmer 里讲的 software entropy——每一次只考虑局部变更、不考虑整体设计，系统就向无序滑一寸——在 spec-driven 的循环里被放大了，因为 LLM 默认就是"只考虑局部"。

![specs-to-code 与 Pocock 闭环对照](03_loops.png)

这不是"specs-to-code 工具不够好"的问题，是工作流本身的问题。compiler 越强、生成代码越快，熵的累积也越快。Pocock 给的对照是"设计接口、委托实现"：人定 module 的 interface，AI 写 module 的 internals。这是 Kent Beck 在《XP Explained》里那句"invest in the design of the system every day"的当代版——AI 时代你不只要每天投资设计，你还得抢在 AI 把熵注入之前投资。

## 二、五个失败模式对应五个 skill

演讲最具体的部分是五个失败模式 → 五个 skill 的映射。这不是"老书救我们"的情怀贴，是 Pocock 把他做"Claude Code for Real Engineers"这门课时反复触雷的样本归类。

![五个失败模式 vs 五个 skill](01_failure_modes.png)

**失败模式 1：AI 不知道你想要什么。** 对应 skill 是 `grill-me`——这是 Pocock GitHub 上 13k+ stars 那个。本质是把 AI 从"急于交付计划"的状态扭成"adversarial interviewer"，让它对你的需求连环追问 40-100 个问题，直到达成 Brooks 在《Design of Design》里说的 design concept——那种"两个人头脑里浮着的关于产品的共同理论"。证据是 grill-me 一个 README 加几行 prompt，star 数压过了无数复杂的 agent 框架。意味着工程师真正稀缺的不是工具，是"被逼着想清楚"的机制。

**失败模式 2：AI 太啰嗦。** 对应 skill 是 `ubiquitous-language`——DDD 的核心概念在 AI 语境下复活。它扫一遍 codebase，提取领域术语，生成一份 markdown 表，让 AI 和你共享一个词汇表。Pocock 说他读 AI 的 thinking trace，加了 ubiquitous-language 之后"verbose 程度肉眼可见下降"。原因不神秘：当 AI 不确定某个概念用什么名字时，它会绕、会铺垫、会复述；当词汇表锁死，它直接走规划。Eric Evans 那套 DDD 在 2003 年说服了一代后端架构师，2026 年要靠 AI 让它对前端、产品经理、独立开发者都生效。

**失败模式 3：AI 做出来不工作。** 对应 skill 是 TDD。这是最反 viral 的一条——TDD 在过去十年被 Rails 社区玩坏过，几乎成了贬义词。Pocock 把它捡回来的逻辑是 Pragmatic Programmer 那句 "the rate of feedback is your speed limit"。AI 默认动作是"一口气写一大段然后回头检查"——它在 outrun own headlights。TDD 强制小步：写测试 → 让测试通过 → 重构。它不是为了"测试覆盖率"，是为了卡住 AI 的步长。这条 skill 没有 prompt 神技，就是要求 AI 必须先写一个会失败的测试，再写代码。

![rate of feedback 速度曲线](02_feedback_rate.png)

**失败模式 4：测试很难写。** 对应的不是 skill，是 codebase 的结构——Ousterhout 的 deep modules vs shallow modules。Pocock 在台上画了两张图：一张是十几个 shallow module 互相调用，AI 在里面绕路；一张是几个 deep module，interface 简单、内部复杂、彼此独立。前者的 codebase AI 一进去就迷路，后者的 codebase AI 在 interface 上做完决策就能委托内部实现。这是整场演讲最深的判断：**好的架构不只是工程师工具，是 AI 的导航系统**。

**失败模式 5：脑子顶不住了。** 对应 skill 是 design-the-interface（委托实现）。Pocock 说他演讲前一周对一个 AI 朋友（指代 AI 工具的拟人化说法）讲完整个流程后，自己当晚睡得像 20 岁那年——因为他不用再读 AI 写的每一行代码，只读 interface 和测试。这条 skill 的前提条件是失败模式 4 已经解决：codebase 必须先变成 deep module 结构，"灰盒委托"才安全。Pocock 自己的措辞是 gray box——你看得见接口，看不见也不需要看见内部。

![deep modules vs shallow modules 模块山脉](04_modules.png)

## 三、AI 时代的"基本功"被重新定价

这套五件套真正颠覆的，是软件工程师能力栈的优先级。

过去十年的招聘市场里，"懂 DDD"、"会 TDD"、"读过 Ousterhout"这些是简历加分项，不是入场券。AI 介入之后，它们变成了**杠杆系数**。一个不懂 ubiquitous language 的工程师用 Claude Code，产出是 1x；懂的人用同一个 Claude Code，产出是 5x。这个差距以前是 1.5x，现在被拉大到 5x。Pocock 没明说这个数字，但他的台词"good codebase 能拿到全部 AI bounty"是这个意思。

中国语境里的实际矛盾在这里浮出水面。腾讯 CodeBuddy、通义灵码、智谱 CodeGeeX、字节豆包 MarsCode 全都在主推 spec-to-code 工作流，因为对企业用户来说，"写 spec 不写代码"是更容易讲的 AI 故事——它把 AI 包装成"项目经理友好"的产品，绕开了"工程师能力分层"这个不舒服的话题。但 Pocock 这一刀切下去，露出的真相是：**spec-to-code 在弱 codebase 里跑得越欢，公司的技术债涨得越快**，AI 反而成了债务加速器。

对国内大厂而言，Pocock 这个立场值得认真读，因为它指向了一个不太想听但很实在的结论——AI 工具竞争的下一个阶段，不是"谁的 spec compiler 更强"，是"谁能把客户的 codebase 改造成 AI-friendly 的"。这是一个咨询服务的活，不是产品的活。

## 盲区 / 我们不知道的

Pocock 的样本是 TypeScript 中型 SaaS，他自己是教师 + 独立开发者。这套结论在三类场景下不一定成立。

第一是大型遗留系统。Linux kernel、Postgres、SAP ABAP 这种 codebase，不是几个 skill 就能改造成"deep modules"的，重写代价大于 AI 节省的工时。第二是数据/ML 管道，主要瓶颈在数据质量和 GPU 调度，不在 module 边界。第三是 Rust / Go 系统编程，类型系统已经在做 Pocock 说的"interface 强约束"那件事，TypeScript 那套手工建立"ubiquitous language"的痛点在这里不存在。

更要警惕的是 viral 信号本身。grill-me 13k stars 不等于"被 staff engineer 验过"。社区给一个 prompt 加星，理由可能是好奇心、是趣味、是"我也想要这种概念"，不是它在生产环境跑过 18 个月。Pocock 自己在台上承认"我还在探索 DDD"——这是诚实，也是提醒：这五条 skill 还在早期。

specs-to-code 那一派也不该被全盘否定。Karpathy 的论点是"在合适的边界内、有合适的测试、有人 review 的前提下，自然语言到代码的转换是可以收敛的"。Pocock 的反例是 anecdote-driven，没有 N=1000 的对照实验。对一个组织来说，最稳的姿势是同时养两套——spec-driven 适合验证性原型，design-driven 适合需要活 5 年的系统。

## 对从业者意味着什么

如果你是 CTO 或研发 VP，Pocock 的演讲转译成 KPI 就是一件事：**今年评估 AI 工具时，不要只看代码生成速度，还要看它对你 codebase 健康度的影响**。一个让你产出快但 module 边界越来越糊的工具，是债务工具。一个让你产出慢一点但强制你写 ubiquitous-language 文件、强制 TDD 卡步长的工具，是资产工具。

如果你是 Tech Lead，立刻能做的两件事：第一，在团队 repo 里建一份 ubiquitous-language.md，把领域术语、内部黑话、缩写都列出来，每次和 AI 对话前把这份文件塞进 context。第二，把团队最复杂的那个 module 拆出来，看它是 shallow 还是 deep——如果 interface 比 implementation 还长，这就是 AI 在你 codebase 里第一个迷路的地方。

如果你是一线工程师，最现实的判断是：那些"AI 取代程序员"的论调在 2026 年已经被实证打脸——AI 把"会读 Ousterhout 的人"和"不会读的人"之间的产出差距拉到了 5 倍。投资软件基本功不是怀旧，是杠杆。

如果你在做投资判断，Pocock 这条线指向一个安静但确定的赛道——**AI-native 代码质量工具**。不是 Copilot 的下游，是 Copilot 的上游：在 AI 写代码之前把 codebase 改造成 AI 能跑的形状。这个市场现在没有清晰的领跑者，但它的需求会随着第一批"被 AI 写废的 codebase"在 2027-2028 集中暴雷而显性化。

## 本期关键词

**Software entropy（软件熵）** —— Pragmatic Programmer 里的概念。系统每一次只针对局部需求改动、不重新考虑整体设计时，结构就向无序退化一寸。这是个不可逆过程，因为每一次"局部最优"的累积都会把全局结构推得更乱。AI 介入之后，entropy 的累积速度被指数化——LLM 默认只关注当前 prompt 的局部，它写得越快，熵涨得越快。Pocock 整场演讲的经济学基础就建立在这一个变量上。

**Design concept（设计概念）** —— Frederick Brooks 在《The Design of Design》提出的术语。指当多人合作设计一个系统时，每个人脑子里悬浮着的那个"关于产品的共同理论"。它不是 markdown 文档，不是 figma 图，是真正决定一致性的隐性共识。Pocock 把"和 AI 协作"也当作"多人协作"，所以 design concept 必须先和 AI 对齐。grill-me 这个 skill 就是把 design concept 从隐性变显性的工具——通过 40-100 个追问把所有未表达的假设挤出来。

**Ubiquitous language（统一语言）** —— Eric Evans 在《Domain-Driven Design》提出的核心概念之一。要求技术团队和领域专家共享同一套词汇，让代码里的 class name、变量名、函数名直接映射业务术语。在 AI 协作场景下，这份语言表变成 AI 的 context 锚点——它让 AI 的 thinking trace 收敛得更快，因为模型不再需要花算力去"猜你说的 invoice 是不是 order"。Pocock 报告这个 skill 让 AI 的实现质量"肉眼可见提升"。

**Deep modules vs shallow modules（深模块 vs 浅模块）** —— Ousterhout 在《A Philosophy of Software Design》里的核心区分。深模块 = interface 简单、implementation 复杂、隐藏的功能多；浅模块 = interface 几乎等于 implementation、暴露细节、模块多但每个都薄。坏 codebase 表现是几百个 shallow module 互相调用，AI 一进去就迷路。好 codebase 表现是十几个 deep module，AI 在 interface 上做完决策就可以委托内部实现。这是 Pocock 整场演讲里最 actionable 的一条结构判断。

**Rate of feedback as speed limit（反馈速率即速度上限）** —— Pragmatic Programmer 的原话。意思是软件开发的"安全速度"等于"你拿到反馈的速度"——typecheck 一次 5 秒、跑测试 30 秒、看运行结果 2 分钟，那这就是你的步长上限。AI 默认违反这条原则：它一次写 200 行然后回头检查，本质是 outrunning own headlights。TDD 在这个语境下不是"测试驱动"，是"反馈驱动"——它强制 AI 必须在每个小步骤之后拿到反馈，才能继续走。

**Design the interface, delegate the implementation（设计接口、委托实现）** —— Pocock 自己造的 catchphrase，源自 Kent Beck "invest in the design every day"。在 AI 时代具体化为：人决定 module 暴露什么 interface（输入、输出、错误语义、副作用边界），AI 负责把 interface 里的承诺翻译成代码。前提是 codebase 已经是 deep module 结构，且测试已经把 interface 的契约固化下来。这是一个"灰盒委托"模型——你不需要读 AI 写的每一行，你只需要相信测试加 interface 已经把语义钉死。

## 引用

1. [Matt Pocock 主页 · aihero.dev](https://aihero.dev) —— 演讲来源 AI Engineer 大会，演讲全名 "Software Fundamentals Matter More Than Ever"。Pocock 的 newsletter + 课程 "Claude Code for Real Engineers" 入口
2. [Matt Pocock on X (@mattpocockuk)](https://x.com/mattpocockuk) —— 演讲后续讨论 + skills repo 更新主入口
3. [mattpocock/skills · GitHub](https://github.com/mattpocock/skills) —— `grill-me` / `ubiquitous-language` / `improve-codebase-architecture` 等 5 条 skill 的源码（13k+ stars）
4. [《A Philosophy of Software Design》· John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php) —— deep modules / shallow modules / complexity 定义的一手出处
5. [《The Pragmatic Programmer》· Hunt & Thomas](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) —— software entropy / "rate of feedback is your speed limit" 的一手出处
6. [《The Design of Design》· Frederick P. Brooks](https://www.pearson.com/en-us/subject-catalog/p/design-of-design-the-essays-from-a-computer-scientist/P200000009425) —— design concept / design tree 概念出处
7. [《Domain-Driven Design》· Eric Evans](https://www.domainlanguage.com/ddd/) —— ubiquitous language 概念的一手出处
8. [Kent Beck · "Invest in the design of the system every day"](https://tidyfirst.substack.com/) —— Pocock 引用的设计哲学箴言来源
