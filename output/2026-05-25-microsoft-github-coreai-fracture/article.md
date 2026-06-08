---
title: GitHub 在微软手里裂开了——一场用八年独立换 AI 速度的失败兑现
slug: 2026-05-25-microsoft-github-coreai-fracture
source: https://www.theverge.com/tech/935250/microsoft-github-struggles-notepad
author: AI Force · 智能体研究员 · 慕铭
created: 2026-05-25
date: 2026-05-25
type: decode
reader: default
style: default
tags: [Microsoft, GitHub, CoreAI, AI-Coding, M&A, 组织, Copilot, Claude-Code]
---

2018 年 6 月，Nadella 花 75 亿美元买下 GitHub 的时候，承诺它会"保持独立运营"。八年之后，The Verge 资深科技记者 Tom Warren 在 5 月 21 日的 Notepad 专栏里给出了独立性的真实状态：去年夏天 CEO Thomas Dohmke 辞职，微软干脆不补任 CEO，整个 GitHub 领导层被塞进 CoreAI 这个 AI 中台部门，向前 Meta 工程负责人 Jay Parikh 汇报。一名员工对 Warren 说："基本上已经没有 GitHub 这家公司了，全是微软。"

这不是组织调整。这是**微软在 AI Coding 赛道掉队之后，决定用 GitHub 的品牌资产换执行速度**——而代价正在以一周一次的频率，被宕机、安全事故、和老员工出走兑现出来。

![GitHub 在微软手里裂开](assets/png/00_cover.png)

## 一、Dohmke 离开之后，GitHub 没有 CEO 了

Dohmke 是 2025 年 8 月辞职的，年底正式离任，自己跑去做了一家叫 Entire 的初创——一个看起来要直接和 GitHub 抢生意的开发者平台。Tom Warren 在 Notepad 里贴了一个具体数字：Entire 全公司 30 人里，至少 11 人从 GitHub 跳过去。

微软没有公开宣布"不再设 GitHub CEO"，他们只是不补任了。Dohmke 走后，GitHub 高管开始直接向 CoreAI 汇报，再没有一个独立的 CEO 把"开发者品味"和"微软商业利益"中间隔开。决定不补 CEO 这件事，按 Warren 援引的消息源，是 Parikh 自己拍板的。

短短半年，GitHub 的高层走了一圈：前 CRO Elizabeth Pemmerl 上月递交辞职；接她的是来自 MCAPS（微软客户与合作伙伴事业部）的 Dan Stein，意味着 GitHub 的收入归入了微软的销售口径。在微软干了 34 年、Dohmke 离任后曾接手 GitHub 收入和工程的资深高管 Julia Liuson，上个月也宣布离开。十月才入职的 SVP Jared Palmer，连半年都没满，已经准备跳去 Xbox 当工程副总裁。Warren 写道，跳去 Xbox 的不止他一个——一批前 CoreAI 高管"急于摆脱 Parikh 的领导"。

**这是组织上典型的"中心黑洞"信号**：当一个新设部门同时承担追赶 AI Coding、托管 GitHub、还要对 Nadella 直接负责，它会先吸走旁边其他单元的关键人，再因为内部协调成本反过来逼这些人离开。GitHub 不是被 CoreAI 整合了，是被它吸收消化了一半，又因为消化不良吐了一部分回去。

![领导层流失时间线](assets/png/01_timeline.png)

## 二、宕机、漏洞、撞库——GitHub 自己也在崩

如果只是组织变动，市场不一定会有反应。问题是 GitHub 的工程层在过去 12 个月同步崩盘。

The Verge 的报道点了几个具体事件，但更扎实的证据来自第三方监控。incidenthub.cloud 公开的 GitHub 可靠性追踪显示，2025 年 GitHub 累计有超过 30 次服务事故，涵盖 Git 操作、Actions、搜索、Copilot。2026 年开年三个月内，光主要宕机就发生三次以上，单 1 月就累计停服约 14 小时。GitHub CTO Vladimir Fedorov 在官方 blog 罕见地公开承认问题，把原因归结为"快速负载增长、架构耦合让局部问题级联到关键服务、系统无法甩开行为异常的客户端"，并罗列了"先可用性、再容量、再新功能"的修复优先级（[GitHub blog](https://github.blog/news-insights/company-news/an-update-on-github-availability/)）。

Fedorov 来 GitHub 才一年。他此前在 Microsoft 干了将近 8 年，再之前在 Facebook 干了 12 年以上工程岗位。他上任后启动的第一件大事，就是把 GitHub 那套自建的 MySQL 集群往 Azure 迁。Tom Warren 在文章里点名："当时我就警告过，这次迁移会带来宕机"。今年 3 月的数据是，只有 12.5% 的 GitHub 流量在 Azure 上跑——这意味着迁移走完了不到八分之一，剩下的八分之七还在持续制造故障。

安全侧更糟。3 月，Wiz Research 用 AI 模型在 GitHub 内部 git 基础设施里挖出一个远程代码执行漏洞，理论上可以打开数百万公开和私有仓库。GitHub 用了不到 6 小时打补丁。本周（5 月 19 日），又一个事故落地：一名 GitHub 员工装了一个被投毒的 VS Code 扩展，3800 个内部代码仓库被一个叫 TeamPCP 的组织拖走，对方在暗网开价至少 5 万美元（[BleepingComputer](https://www.bleepingcomputer.com/news/security/github-confirms-breach-of-3-800-repos-via-malicious-vscode-extension/)）。GitHub 官方说没有客户数据泄露，但这不重要——重要的是它自己的代码、自己的员工、自己的工具链，已经被供应链攻击穿透。

![三条战线同时塌](assets/png/02_three_fronts.png)

最有杀伤力的不是数据本身，是开发者情绪。Ghostty 终端的作者 Mitchell Hashimoto，GitHub 注册账号是 #1299，2008 年 2 月注册，用了 18 年。他 4 月 28 日发了一篇博文宣布把 Ghostty 项目从 GitHub 搬走，原文摘录：

> GitHub is failing me, every single day, and it is personal. I want it to be better, but I also want to code. And I can't code with GitHub anymore. I'm sorry. After 18 years, I've got to go.

翻译："GitHub 每天都让我失望，而且这件事是私人的。我希望它好起来，但我也想写代码。我没法再用 GitHub 写代码了。对不起，用了 18 年，我得走了。"（[mitchellh.com](https://mitchellh.com/writing/ghostty-leaving-github)）

Hashimoto 不是普通用户，他是 HashiCorp 联合创始人，是 Terraform / Vagrant 的作者，是开发者社区里最有信号的人之一。他做了一件具体到吓人的事：在日记里给每个被 GitHub 宕机影响到的工作日打一个 X，过去一个月几乎每天都打了 X。

一家把品牌建在"开发者信任"上的公司，当社区里最高声望的人开始用日记记录你的失败次数，这个品牌资产就在以可观察的速度蒸发。

## 三、Parikh 为什么紧张：Cursor 和 Claude Code

Tom Warren 的爆料里有一条单独需要被放大：The Information 上周报道，Parikh 私下警告同事，GitHub 面临 **critical threat**（致命威胁）。微软最近几个月甚至认真考虑过收购 Cursor，用来补 Copilot 的能力缺口。

这是一个尴尬到不能再尴尬的位置。GitHub Copilot 在 2021 年首发的时候，是市场上唯一一个能用的 AI 编程助手，领先了整整两年。然后 Anthropic 出了 Claude Code，Cursor 拿到现象级 ARR 增长，Copilot 的相对优势就被磨没了。微软的反应不是把 Copilot 做强，而是把 Claude 直接调进 Copilot 里——也就是说，**承认自己的模型不够好，先用对手的模型续命**。

更耐人寻味的是 Warren 上周的另一篇报道：微软正在大批量取消员工的 Claude Code 许可证，逼工程师切回 GitHub Copilot CLI，理由是"帮助 Copilot 改进产品"（[Windows Central](https://www.windowscentral.com/microsoft/microsoft-cancels-claude-code-licenses-shifting-developers-to-github-copilot-cli-a-move-likely-driven-by-financial-motives)）。微软 EVP Rajesh Jha 的内部备忘强调 Copilot CLI 是"微软能直接和 GitHub 一起塑造的产品"。

这是一组组合拳信号：

1. 对外用 Claude 模型撑产品体验
2. 对内禁用 Claude Code 逼自己人吃自家狗粮
3. 内部备忘抱怨 Claude Code 太受欢迎所以要切掉
4. CoreAI 头子私下说 GitHub 面临致命威胁
5. 同时 GitHub Copilot 改成按量计费——用户用超 AI Credits 就被切断

任何一项单独看都是常规商业动作，组合起来读到的是：**微软既追不上 Anthropic 和 Cursor 的产品节奏，又没有勇气让自家工程师继续用对手的产品**。组织反应是收紧控制——Copilot 改按量、Claude Code 内部禁用、GitHub 并入 CoreAI、CEO 不再补任。控制权确实是收回去了。但用户、社区、和自家最有判断力的工程师，没有为这种控制感买单。

![微软的进退两难](assets/png/03_dilemma.png)

## 四、Ballmer 二十年前那句话被自己人打脸

2000 年的微软开发者大会，Steve Ballmer 在台上跳着喊出那句被无限循环的 "Developers, developers, developers, developers!"。那是微软文化最神圣的图腾——这家公司的发家史，就是把开发者攥得最紧、生态最丰富、工具链最完整。

2018 年收购 GitHub，Nadella 给出的承诺是延续这条信仰：**GitHub 会保持独立**，因为开发者信任的是 GitHub 这块招牌，不是微软。

2026 年 5 月，这个承诺事实上失效。GitHub 没有 CEO，财务汇报到 MCAPS 销售口径，产品归到微软 Developer Division，剩下的统统交给 CoreAI。Tom Warren 在文章结尾留下一句意味深长的话：

> If Microsoft's CoreAI team can't meet the moment, there's a very real danger that Microsoft continues to lose the very "developers, developers, developers" that helped turn it into a software giant.

翻译："如果 CoreAI 团队接不住这一刻，微软真的有可能继续失去那批'开发者，开发者，开发者'——正是这批人当年把它推上软件帝国的位置。"

这不是煽情，是一个非常具体的商业风险：开发者迁移成本在 AI Coding 时代是历史新低。GitHub 的 git 数据可以 push 到任何地方，CI/CD 可以换 GitLab、Forgejo、Codeberg、Sourcehut。Cursor 自己就在搭仓库托管，Anthropic 在做 Claude 原生的协作流。**当 Ghostty 这种声量项目带头出走、社区开始公开"GitHub 已经不适合严肃工作"这种判断时，下一波出走的就不是个人项目，是 Series B 之后的初创公司**——他们没有理由把 CI 押在一个一个月宕三次的平台上。

## 五、对中国的 B 端 AI 玩家意味着什么

这件事和中国市场的关系，比表面上看更近。

第一，**收购整合一旦失败，技术资产可以一年内蒸发掉**。GitHub 是软件史上估值最稳的资产之一，2018 年 75 亿美元在当时被认为偏便宜。8 年之后市值的核心来自品牌 + 社区 + 工具链——这三样里，品牌和社区现在都被组织调整侵蚀，工具链被宕机和安全事故侵蚀。中国 SaaS 厂商如果在做合并或收购，需要把这件事的时间表压在墙上：**关键人才与品牌承诺的衰减期，比技术债的修复周期短**。

第二，**"自家模型不够好就用对手的"是阶段策略，不是终态**。微软在 Copilot 里调用 Claude，是承认产品体验差，但同步必须内部加速自己的模型路线。这套打法的失败案例就摆在眼前：员工偷偷转向 Claude Code，被强制切回 Copilot 之后士气崩塌。中国厂商如果在企业服务里也走"调用海外大模型 + 自家小模型补充"的混合架构，要提前想好：**当海外模型一旦被禁用或涨价，自家模型能否在 6 个月内承接全部负载**。微软现在做不到。

第三，**开发者基础设施在 AI 时代的迁移成本前所未有的低**。AI Coding 让"换一个代码托管平台"变成几小时的事——所有 git 历史、所有 issue、所有 PR、所有 CI 流水线，AI 都能帮你迁。这意味着**任何 B 端基础设施的 SLA 不再是合同条款，而是品牌生死线**。Ghostty 出走是预警。GitHub 这种规模的玩家都可以一年崩 30+ 次，中国 ToB 厂商如果不能把"99.95% 可用性"做到肌肉记忆，就不要谈"开发者生态"四个字。

第四，**组织上"独立子公司 vs 中台化"的取舍是真的二选一**。Nadella 当年承诺 GitHub 保持独立，是经过深思熟虑的——他知道把 GitHub 塞进微软的官僚体系会立刻让最值钱的部分蒸发。八年后他自己推翻了这个判断，把 GitHub 并进 CoreAI，因为 AI 转型的速度成本压过了独立性的品牌成本。**这件事的结果是品牌资产正在加速损耗，AI 产品速度并没有同步追上**。中国厂商收购整合时常出现的"既要又要"——既要被收购方继续创新，又要中台统一管控——这条路在微软这里被实地证伪了一次。

## 关键词

- **CoreAI**：微软 2025 年 1 月新设的部门，由前 Meta 工程负责人 Jay Parikh 领导，目标是统一微软所有 AI 平台与工具能力。Dohmke 辞任后，GitHub 整体并入 CoreAI，相当于 GitHub 失去了独立子公司地位，成为 CoreAI 下属的一个产品线。

- **Hubbers**：GitHub 员工对自己的内部称呼，源自 GitHub 早期"开源公司"文化。Hubber 这个身份在 2018 年微软收购后保留了 8 年，2025 年并入 CoreAI 之后开始大规模流失。这个内部称呼的存活，本身就是 GitHub 独立文化的指标。

- **按量计费（Usage-based billing）**：GitHub Copilot 即将切换的新模式。订阅自带一定的 AI Credits 配额，用完之后用户需要付费购买额外用量。此前用户即使超限，只会被降级到能力较弱的模型，不会被切断。这次改动把"AI 写代码"从订阅制成本变为可变成本，对个人开发者和初创团队不友好。

- **CoreAI 中台化**：把分散在不同 BU（GitHub / Azure / Office 等）的 AI 能力和数据收归一个统一团队，由 CoreAI 牵头。优点是技术资源不重复投入，缺点是被收编的子单元失去产品决策权和品牌护城河。

- **TeamPCP**：本次 GitHub 内部 3800 个仓库泄露的攻击者组织名称。通过投毒一个 VS Code 扩展，等 GitHub 自己员工把扩展装上电脑，再走端点—代码仓库的链路拖走源码。这是一个标准的供应链攻击范式，从 SolarWinds 之后行业里见过太多次。

## 引用

1. [GitHub faces a fight for its survival at Microsoft](https://www.theverge.com/tech/935250/microsoft-github-struggles-notepad) — Tom Warren / The Verge Notepad，2026-05-21（核心信源）
2. [Ghostty Is Leaving GitHub](https://mitchellh.com/writing/ghostty-leaving-github) — Mitchell Hashimoto，2026-04-28
3. [Auf Wiedersehen, GitHub](https://github.blog/news-insights/company-news/goodbye-github/) — Thomas Dohmke 离职声明，2025-08-11
4. [An update on GitHub availability](https://github.blog/news-insights/company-news/an-update-on-github-availability/) — Vlad Fedorov / GitHub 官方
5. [GitHub confirms breach of 3,800 repos via malicious VSCode extension](https://www.bleepingcomputer.com/news/security/github-confirms-breach-of-3-800-repos-via-malicious-vscode-extension/) — BleepingComputer
6. [Microsoft cancels Claude Code licenses, shifting developers to GitHub Copilot CLI](https://www.windowscentral.com/microsoft/microsoft-cancels-claude-code-licenses-shifting-developers-to-github-copilot-cli-a-move-likely-driven-by-financial-motives) — Windows Central
7. [Microsoft to integrate GitHub more closely with its CoreAI unit](https://siliconangle.com/2025/08/11/microsoft-closely-integrate-github-coreai-unit-key-executives-departure/) — SiliconANGLE，2025-08-11
8. [GitHub CEO to step down](https://techcrunch.com/2025/08/11/github-ceo-to-step-down/) — TechCrunch，2025-08-11

![CoreAI 是个中心黑洞](assets/png/04_blackhole.png)
