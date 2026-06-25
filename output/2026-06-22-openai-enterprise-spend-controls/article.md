---
title: OpenAI 给企业装了块"AI 电表"——按席位卖的时代，正在收场
type: published
created: 2026-06-22
updated: 2026-06-22
style: default
voice: doubao-shuangkuaisisi
tags: [OpenAI, ChatGPT Enterprise, Codex, 信用额度, FinOps, 支出控制, 企业AI]
---

# OpenAI 给企业装了块"AI 电表"——按席位卖的时代，正在收场

**本期关键词:信用额度计量（credits metering）/ 共享额度池 / AI FinOps（AI 成本运营）**

2026 年 6 月 18 日，OpenAI 给企业版 ChatGPT（叫 ChatGPT Enterprise，面向大公司按合同卖的那个版本）上线了一个看着像"加了个账单后台"的功能:用量分析 + 支出控制。管理员能在一个统一的后台里，看清楚公司里的 AI 把"信用额度"花到哪去了，还能给整个公司、给小组、给个人分别设花钱的上限。

如果只当成"OpenAI 加了个报表功能"，就看小了。**这件事真正的信号是:AI 卖给企业的方式，正在从"按人头卖座位"，悄悄变回"按用量计量、像管水电费一样管"。** 这篇带你看清"信用额度"到底是什么、账单为什么会失控、以及为什么说这是一个比功能更新大得多的转向。先从那三个字讲起。

---

## 第零步:先把"信用额度"这三个字讲清

很多人一看到"信用额度（credits）"就以为是"预存的钱"。**不是。** OpenAI 官方帮助文档把它定义得很清楚:

> "Credits unlock additional, flexible access to advanced ChatGPT features like Deep Research, Thinking models, Image Gen, Advanced Voice and Codex."
>
> （信用额度解锁对 ChatGPT 高级功能的额外、灵活使用权，比如深度研究、思考模型、图像生成、高级语音和 Codex 编程助手。）
>
> 来源:OpenAI Help Center，2026-06，https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans

翻成人话:**信用额度是一把"用一次高级功能扣多少"的统一刻度，像游戏点卡、像手机流量套餐**——你充的不是现金，是"能用多少次"。而企业版的关键设定在下一句:

> "Enterprise and Edu workspaces purchase a shared credit pool at the contract level... There are no per-seat usage caps by default."
>
> （企业版和教育版在合同层面购买一个共享的额度池……默认没有按席位的用量上限。）
>
> 来源:OpenAI Help Center，2026-06，同上

记住这个设定:**全公司共用一个大额度池，默认谁都能从里面抽，没有按人头的上限。** 这一句，就是后面所有故事的种子。

---

## 第一步:账单为什么突然管不住了

"全员共抽一个池子、默认没上限"——好处是灵活，坏处是**花销天生不可预测**。

你把它想成**公司茶水间的免费咖啡机**:没人限量的时候，有人一天喝十杯，月底账单吓人，而你根本不知道是哪个部门、哪个人喝掉的。企业里的 AI 用量正是这样:有人重度用图像生成、有人让 Codex 跑大任务，钱哗哗从那个共享池子里流走，管理员却看不清流向。

这不是 OpenAI 拍脑袋想出来的功能，是被真实客户的痛点逼出来的。官方公告里引用了一家无人机配送公司 Zipline 的话，点破了真实诉求:

> "...for granular usage controls to keep spend predictable."
>
> （……（我们想要）细颗粒度的用量控制，好让花销变得可预测。）
>
> 来源:OpenAI 官方公告，2026-06-18，https://openai.com/index/chatgpt-enterprise-spend-controls/

关键词是"predictable（可预测）"。**当一个东西按量消耗、又看不见流向，财务就没法做预算。** 这正是这次功能要解决的真问题。

---

## 第二步:一块仪表盘，把花销照出原形

OpenAI 的解法第一步，是给这个黑箱装上一块"仪表盘"——它叫**全局管理控制台（Global Admin Console）**。官方原话:

> "The Global Admin Console brings ChatGPT and Codex credit usage into one view, so admins can see a more granular breakdown of credit consumption across users, products, and models."
>
> （全局管理控制台把 ChatGPT 和 Codex 的信用额度消耗汇入同一个视图，让管理员能跨用户、产品和模型，看到更细颗粒度的消耗拆解。）
>
> 来源:OpenAI 官方公告，2026-06-18，https://openai.com/index/chatgpt-enterprise-spend-controls/

具体能看四个维度，官方逐条列了:**按时间看趋势、揪出用量最高的人、按用户/产品/模型拆解花销、还能通过一个统一接口（Cost API）把这些数据拉进公司自己的系统**做更深分析。

你把它想成**家里的智能电表**:过去只在月底收一张总账单，现在能实时看到此刻每个房间用了多少电。这里有个容易被忽略的关键:**ChatGPT（聊天）和 Codex（编程）的花销，第一次进了同一块表。** 为什么这一步不简单?下一章讲。

---

## 第三步:Codex 是怎么被"收编"进同一张账的

"把 ChatGPT 和 Codex 并进同一块表"听着简单，其实有个前提，而且**因果顺序不能颠倒**。

Codex 是 OpenAI 的 AI 编程助手。它能被并进统一账单，是因为它先在两个月前完成了计费方式的改造。官方文档:

> "On April 2, 2026, we updated Codex pricing to align with API token usage, instead of per-message pricing."
>
> （2026 年 4 月 2 日，我们把 Codex 的定价改成按 API token 用量计算，而不再是按消息条数。）
>
> 来源:OpenAI Help Center（Codex rate card），https://help.openai.com/en/articles/20001106-codex-rate-card

"token"是大模型计量文字的最小单位。**先把 Codex 的计费颗粒度从"一条消息"细化到"一个 token"，它的消耗才能和 ChatGPT 用同一把刻度（信用额度）来折算、才能并进一张账。** 你把它想成**两家原本各记各账的子公司，先统一了记账货币，才能合并财务报表。** 这套统一之所以可能，还靠后台新引入的一个最高层级"租户（Tenant）"——它能把多个 ChatGPT 工作区和多个 API 组织挂在一起，于是两条线的花销有了共同的归集口。

所以这次发布不是孤立的功能上线，是一条"先计量、再管控"的链条走到了第二步。

---

## 第四步:三层闸门——管得住，又不一刀切

看清了花销，第二步是管住它。这里要纠正一个常见的简化:支出控制**不是只能设一个总额度，而是三层**。官方原话:

> "Now admins can also set a default limit for their ChatGPT Enterprise workspace, configure limits for specific groups, and create individual overrides for people who need more capacity."
>
> （现在管理员还能为整个工作区设一个默认额度、给特定小组配置额度、并为需要更多容量的个人开个别特例。）
>
> 来源:OpenAI 官方公告，2026-06-18，https://openai.com/index/chatgpt-enterprise-spend-controls/

三层从粗到细:**整个工作区的默认额度 → 特定小组的额度 → 个别人的特例。** 而且还配了一个员工自助的闭环——员工能看到自己用了多少、还剩多少，额度不够时可以申请追加、并写明"我在做什么"，让管理员据此判断。

你把它想成**公司的报销制度**:全员有个默认额度，某些部门（比如研发）额度更高，个别出差多的人能单独申请提额并写明事由。**这套设计的妙处是"不必为了一个人，给所有人放水"**——精细，但不僵硬。

---

## 第五步:这其实是 FinOps 登陆 AI

把前面几步连起来看——按 token 计量、统一仪表盘、可设额度、还开放接口让企业把数据拉走——你会发现这套东西**似曾相识**。

它几乎是把过去十年企业管理云计算账单的那套方法，原样搬到了 AI 上。这套方法有个名字叫 **FinOps（云财务运营）**:实时看花销、按团队分摊、设预算告警。你把它想成**十年前企业上云时经历过的同一幕**:计算从"买断一台服务器"变成"按用量付费"，于是公司里诞生了专门盯云账单的 FinOps 团队。

而且这不是 OpenAI 一家的孤举，是三巨头几乎同年完成的同一个动作:微软早在 2025 年 9 月就把办公套件里的 Copilot 改成了"Copilot 信用额度"计量;Anthropic 在 2025 年底到 2026 年初，把 Claude 企业版从"打包席位费"拆成了"低底价席位 + 消耗承诺"的混合模式。OpenAI 这次补上的，是其中整合度最高的一块——**把聊天和编程两条线的消耗并进同一张账、还开放了 Cost API。**

判断:**AI 的计费心智，正在从"软件订阅（买永久席位）"坍缩回"云计算计费（按用量抽额度池）"。** 而管控工具的出现，是这个转变成立的最后一块拼图——没有电表和阀门，没人敢放开了按量用。

---

## 对从业者意味着什么

1. **如果你是企业里管 AI 预算的人:** 这套工具直接好用——先用仪表盘看清谁在烧、烧在哪个产品哪个模型，再用三层额度把花销框住。但记住核心是"可预测"而非"砍成本":目标是让财务能做预算、让重度用户照常高效，而不是一刀切限流把生产力也限掉了。

2. **如果你在选 AI 供应商:** 评估的尺子要加一把。过去只看"模型分数、上下文长度、单价";现在要像选云厂商一样，多看三项——**计量颗粒度（能不能拆到人/产品/模型）、额度治理（能不能分层设限）、成本可观测性（有没有 Cost API 让你拉数据）。** 你把它想成**选水电供应商**:不只看电压稳不稳（模型强不强），还要看有没有清晰电表、能不能分户计费、超额会不会预警。

3. **看懂一个更大的转变:权力正在从"采购部"移向"成本运营团队"。** 当 AI 像电费一样按表计量，决定 AI 怎么用、用多少的人，会从"签合同的采购"变成"盯仪表盘的 FinOps"。**这次发布，是这场权力转移的发令枪。** 如果你的公司还在用"按人头买席位"的思路规划 AI 预算，是时候换成"按用量做运营"的思路了——这不是要不要的问题，是早晚的问题。

---

## 引用与信源

1. OpenAI 官方公告:New usage analytics and updated spend controls for enterprises（2026-06-18）:https://openai.com/index/chatgpt-enterprise-spend-controls/
2. OpenAI Help Center:Flexible pricing for the Enterprise, Edu, and Business plans（信用额度定义、共享额度池、默认无按席位上限）:https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans
3. OpenAI Help Center:Codex rate card（2026-04-02 起按 API token 计费）:https://help.openai.com/en/articles/20001106-codex-rate-card
4. OpenAI Help Center:Global Admin Console（引入"租户 Tenant"层级，可挂多个工作区与 API 组织）:https://help.openai.com/en/articles/12289294
