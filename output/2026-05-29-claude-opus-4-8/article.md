---
title: Claude Opus 4.8 真正的升级不在跑分，在那一栏 0%
source: https://www.anthropic.com/news/claude-opus-4-8
author: Anthropic
date: 2026-05-29
type: decode
---

![封面](assets/png/00_cover.png)

2026 年 5 月 28 日，Anthropic 发布 Claude Opus 4.8，距上一代 4.7 只隔了 41 天。同一周，公司完成 Series H 融资 650 亿美元，估值 9650 亿——越过了 OpenAI 当前传闻的约 8500 亿，两家都在抢年内成为第一家上市的大模型公司。

把这两件事摆在一起看，4.8 的发布稿值得逐字读：官方给它的定语不是"更强"，是"sharper judgement, more honesty about its progress"（更锐利的判断、对自己进度更诚实）。一个要市场给它高于 OpenAI 估值的公司，在新旗舰上主打的卖点是——它会告诉你它什么时候没把握。

## 这次发布到底改了什么

先把表层信息过一遍。

价格不变：标准用量 5 美元 / 25 美元每百万 token（输入 / 输出），和 4.7 一模一样。Fast mode（快速模式）10 美元 / 50 美元每百万 token，跑到 2.5 倍速度，比上代快速模式便宜了三倍。上下文窗口仍是 100 万 token，默认 effort（投入档位）拉到 HIGH。API 名字是 `claude-opus-4-8`，Bedrock、Vertex AI、Microsoft Foundry、GitHub Copilot 当天全部到位。

跑分确实涨了，而且某些项涨得夸张：

| Benchmark | 4.8 | 4.7 | 变化 |
|---|---|---|---|
| SWE-bench Pro（智能体编码） | 69.2% | 64.3% | +4.9 |
| SWE-bench Verified | 88.6% | 87.6% | +1.0 |
| SWE-bench Multilingual | 84.4% | 80.5% | +3.9 |
| USAMO 2026（数学奥赛） | 96.7% | 69.3% | **+27.4** |
| GraphWalks 1M（长上下文 F1） | 68.1% | 40.3% | **+27.8** |
| GDPval-AA（知识工作 ELO） | 1890 | 1753 | +137 |
| GPQA Diamond（科学问答） | 93.6% | 94.2% | **-0.6** |

USAMO 从 69 跳到 97，长上下文从 40 跳到 68，这是会上头条的数字。但顺着这张表往下看会发现一个矛盾：GPQA Diamond 退了 0.6 个百分点。一个模型在数学奥赛上多对了近三成题，却在博士级科学问答上倒退——这说明 4.8 的训练重心根本不是"全面变聪明"。它在为别的东西让路。

那个东西，藏在 system card 里。

## 真正的升级在 system card，不在 benchmark

Anthropic 这次把一组很少有厂商愿意公开的数字写进了系统卡。它们衡量的不是模型多会做题，是模型有多诚实。

- **漏报率 3.7%**：让 4.8 总结自己写的代码，只有 3.7% 的情况下它没把重要事件上报给用户。
- **0% 那一栏**：在"未加批判地报告有缺陷的结果"这一项上，4.8 拿到 0%——**这是 Anthropic 史上第一个做到 0% 的模型**——它不会把一个跑挂了的结果包装成"已完成"递给你。
- **过度自信降 10 倍**：相比 4.7，它"声称自己能做到但实际做不到"的频率下降了一个数量级以上。
- **放过缺陷的概率降到 1/4**：对自己写的代码，它"让缺陷不加说明就溜过去"的概率，是上一代的四分之一。

官方对早期测试者反馈的转述很具体：模型"asks the right questions, catches its own mistakes, pushes back when a plan isn't sound"（会问对的问题、抓自己的错、计划不靠谱时会顶回来）。桥水基金（Bridgewater）的反馈更直白——4.8 会"主动指出一份分析的输入和输出有问题，这是其他模型经常漏掉的"。

把这两节连起来：GPQA 退 0.6，是为了换 0% 那一栏。Anthropic 用一点点"知道得更多"，换了一大块"对自己知道什么更诚实"。这是一笔明确的取舍，不是免费的午餐。我把它叫**诚实税**——为了让模型不吹牛，你得允许它在某些硬指标上不那么激进。

![GPQA 退 0.6 换来 0% 那一栏](assets/png/01_honesty_tax.png)

问题是，一个模型诚实不诚实，过去从来不是卖点。为什么是现在？

## dynamic workflows：诚实是自主的前提

答案在同一天发布的另一个功能：**dynamic workflows（动态工作流）**，目前是研究预览。

它的机制是这样：Claude 自己写编排脚本，在单个 session 里拉起几十到上百个并行 subagent（子智能体），上限 1000 个，状态可以跨多天断点续跑。官方给的场景是——Claude Code 接手"几十万行代码的全库迁移，从启动到合并，以现有测试套件作为达标线"。你给一个目标，它自己拆任务、派活、跑测试、合代码，中间可能跑好几天。

这里有个谁都绕不过去的现实：**当一个 agent 同时跑 1000 个子任务、连跑三天，你不可能审查它的每一步。** 你能审一个函数的 diff，审不了一千个子智能体几天里做的几万次决策。这时候你唯一能依赖的，不是它有多聪明，是它会不会在第 700 个子任务出问题时主动停下来告诉你"这里我没把握"，而不是默默把一个错误结论合进主干。

所以 0% 那一栏和 dynamic workflows 不是两个功能，是**同一个赌注的两面**。自主性越往上走，能力早就不是瓶颈了——4.7 的编码能力已经足够好——真正的瓶颈是信任。一个会把跑挂的结果说成"已完成"的模型，你不敢让它无人值守跑三天；一个 0% 谎报、漏报只有 3.7% 的模型，你才敢。Anthropic 这一代押的不是"更会写代码"，是"**可以放手的模型**"。

这也解释了为什么 effort control（投入档位控制）这次同步铺到了 claude.ai 和 Cowork：把"花多少力气"的旋钮交给用户，本质也是在管理信任——你决定让它想多深，它诚实地告诉你想到哪了。

![诚实与自主是同一个赌注的两面](assets/png/02_trust_bottleneck.png)

## 同一周，9650 亿估值的卡位

回到开头那两件事为什么要摆一起。

Anthropic 这周完成的 650 亿融资、9650 亿估值，由 Altimeter、Dragoneer、Greenoaks、Sequoia 领投，数字越过了 OpenAI。据报道，它在 ARR（年度经常性收入）上也已经反超 OpenAI。两家挤在同一条 IPO 跑道上，谁先上市，谁就拿走"第一家上市大模型公司"的叙事红利。

在这个节点上发一个主打"诚实、可放手"的模型，不是巧合。企业市场买大模型，最大的拦路虎从来不是"够不够聪明"，是"敢不敢让它碰生产系统、碰真实数据、碰会出事的流程"。Anthropic 把整个 4.8 的故事讲成"这是你敢无人值守的那个模型"——这恰好是它面对企业客户、面对要给它定价的资本市场，最值钱的一句话。**41 天就迭代一次的节奏**，本身也是讲给市场听的：我们跑得比你想象的快。

谁先 IPO 不取决于谁的 USAMO 高 30 分，取决于谁能让 CFO 相信这东西放进财务流程不会闯祸。4.8 是冲着这个问题去的。

## 盲区与代价

把另一半也摆出来，否则这篇就成了发布稿的复读。

**安全面有真实回退**。Gray Swan 的红队测试里，4.8 开启 thinking 时的提示词注入（prompt injection）攻击成功率约 9.6%，而 4.7 是 6.0%——这是写在文档里的安全权衡。在处理不可信输入的场景（比如让 agent 读外部网页、收邮件），4.8 反而更需要显式沙箱隔离。"更诚实"和"更难被骗"不是一回事，这次涨的是前者，退的是后者。

**dynamic workflows 还是研究预览**。1000 个 subagent、多天续跑是官方演示场景，不等于你的代码库明天就能这么跑。它目前只对 Max / Team / Enterprise 计划开放，发布时还需要管理员手动启用。从"演示能做"到"你的迁移任务真能从启动跑到合并"，中间隔着多少人工兜底，官方没给数字。

**"诚实"是测出来的，不是保证的**。3.7%、0%、降 10 倍，都是 Anthropic 自己的评测口径下的结果。0% 谎报是在特定测试集上达成的，不等于在你的真实工作流里它永远不会把错的说成对的。这些数字值得当信号，不值得当承诺。

**Mythos 还在门外**。Anthropic 同时预告了比 Opus 更高智能的 Mythos 级模型（Project Glasswing），但卡在网络安全防护措施的开发上，官方说"未来几周"能给所有客户。也就是说，4.8 是当下能拿到的天花板，真正的下一档还被安全闸门拦着——这件事本身也是"诚实"叙事的一部分：它在告诉你哪些东西它还不敢放出来。

## 对从业者意味着什么

**架构师 / 平台负责人**：本周别急着把 4.7 全量切 4.8。先做一件事——把你现在让 agent 无人值守跑的任务清单拉出来，标注哪些环节出错的代价最高。4.8 的诚实增益正是冲着"无人值守"场景，但提示词注入回退意味着，凡是 agent 要读外部不可信输入的链路，先上沙箱再升级。

**工程团队 / Tech Lead**：dynamic workflows 申请预览资格，但第一个任务别挑生产库。挑一个有完整测试套件、改挂了也不致命的中等迁移（比如一次依赖大版本升级），用"现有测试套件作为达标线"这个官方设定跑一遍，记录它中途主动上报了几次问题——这个次数比它最终改对多少行更值得看。

**CTO / 决策者**：4.8 价格没涨、fast mode 便宜三倍，意味着把高质量推理铺到更多内部流程的单位成本下降了。但真正要评估的不是 token 单价，是"敢不敢把它接进会出事的流程"。把 system card 那几个诚实指标，写进你给 agent 落地划红线的验收标准里。

**投资 / 战略**：记住这次发布的真正信号——头部厂商的竞争焦点正在从"benchmark 谁高"转向"谁敢让客户放手"。下一阶段比的不是参数和跑分，是可托付度（trustworthiness）。谁能把"无人值守不闯祸"做成可量化、可审计的指标，谁就拿到企业市场的定价权。

![四类从业者的本周动作](assets/png/03_who_does_what.png)

## 本期关键词

**诚实税（Honesty Tax）** —— 为了让模型不谎报、不过度自信，得允许它在某些硬指标上不那么激进。4.8 的 GPQA Diamond 退了 0.6，换来 0% 谎报率。这不是 bug，是训练重心的主动取舍：用一点"知道得更多"，换一大块"对自己知道什么更诚实"。

**0% 那一栏** —— system card 里"未加批判地报告有缺陷结果"这一项，4.8 拿到 0%，是 Anthropic 史上首个。它衡量的不是模型会不会做题，是模型会不会把跑挂的结果包装成"已完成"递给你。对要无人值守跑 agent 的人，这一栏比 SWE-bench 那一栏重要。

**可放手的模型（Hands-off Model）** —— 当能力已经够用，模型的卖点从"多聪明"转向"多可托付"。一个会谎报的模型你不敢让它跑三天，一个 0% 谎报的才敢。4.8 主打的不是性能曲线，是这条信任曲线。

**信任瓶颈（Trust Bottleneck）** —— 智能体自主性越往上走，瓶颈越不是能力，是信任。你能审一个函数的 diff，审不了 1000 个子智能体几天里的几万次决策。这时候唯一能依赖的，是模型会不会在没把握时主动停下来说话。

**诚实-自主同构** —— 0% 谎报和 dynamic workflows 是同一个赌注的两面，不是两个功能。没有前者，后者不敢用；有了前者，后者才成立。看一家厂商的下一代，先看它的诚实指标，再看它敢放出多大的自主权——两者必须同步涨。

**41 天节奏** —— 4.8 距 4.7 只隔 41 天。迭代节奏本身是讲给市场听的叙事：在 IPO 抢跑、估值越过 OpenAI 的节点上，"我们跑得比你想象的快"和模型本身一样是产品。

## 引用

1. [Introducing Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8) —— Anthropic 官方公告，"sharper judgement, more honesty about its progress" 原文出处
2. [Anthropic releases Opus 4.8 with new 'dynamic workflow' tool](https://techcrunch.com/2026/05/28/anthropic-releases-opus-4-8-with-new-dynamic-workflow-tool/) —— TechCrunch，dynamic workflows 与桥水反馈
3. [Claude Opus 4.8: Benchmarks, Effort & Dynamic Workflows](https://www.digitalapplied.com/blog/claude-opus-4-8-release-dynamic-workflows-2026) —— benchmark 全表 + system card 诚实指标 + 提示词注入回退
4. [Anthropic raises $65 billion at a $965 billion valuation](https://sherwood.news/tech/anthropic-raises-65-billion-at-a-965-billion-valuation-releases-a-more-honest-claude-opus-4-8/) —— Sherwood，融资估值与 IPO 竞赛
5. [Workflows Capped at 1,000 Subagents](https://www.marktechpost.com/2026/05/28/anthropic-ships-claude-opus-4-8-alongside-dynamic-workflows-and-cheaper-fast-mode-with-workflows-capped-at-1000-subagents/) —— MarkTechPost，1000 subagent 上限
6. [Claude Opus 4.8 is generally available for GitHub Copilot](https://github.blog/changelog/2026-05-28-claude-opus-4-8-is-generally-available-for-github-copilot/) —— GitHub 官方 changelog
7. [Anthropic upgrades Claude with new Opus 4.8 model](https://9to5mac.com/2026/05/28/anthropic-upgrades-claude-with-new-opus-4-8-model-heres-whats-new/) —— 9to5Mac，价格与 fast mode
