---
title: 黄仁勋和纳德拉同台，把"智能体时代"绑成了一条栈
slug: 2026-06-05-nvidia-nadella-agentic
type: decode
created: 2026-06-05
updated: 2026-06-05
style: default
reader: default
distribute: [email, xiaohongshu]
tags: [NVIDIA, Microsoft, agentic-AI, AI工厂, Windows]
---

# 黄仁勋和纳德拉同台，把"智能体时代"绑成了一条栈

6 月 3 日，NVIDIA 官方账号发了一条不长的推文：「智能体 AI 时代来了。从台北，黄仁勋在 MS Build 上与纳德拉同台，展示 NVIDIA 与微软如何携手打造它——从 Windows 设备到规模化 AI 工厂。」黄仁勋人在台北（Computex 正在那里开），通过直播接进了纳德拉在 Build 的主题演讲。

这种巨头同台、互相恭维的 fireside 对话，套话浓度通常很高。但把两家这次摆出来的东西按位置排一排，会看到一件更值得注意的事：他们不是在宣布几个合作产品，他们在沿着一条从你手里的笔记本一直到数据中心的栈，逐层占位。这条栈的名字叫 agentic AI——智能体 AI。谁定义了这条栈的标准接口，谁就拿走了下一个十年的入口费。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- 黄仁勋和纳德拉这次绑的不是产品，是**一整条栈**：芯片 → 操作系统 → 云 → AI 工厂，每一层都填上了 NVIDIA + 微软的零件。
- "AI 工厂"不是比喻。它指的是把数十万张 Grace Blackwell 当成一台机器来调度的数据中心，产出的不是数据，是 token，而 token 现在能赚钱了。
- 纳德拉抛出"无计量的智能"（unmetered intelligence）——让智能体在你本地机器上跑完整闭环，不必每一步都往云上跑。这是这次发布最有野心、也最有争议的一句。
- 这场绑定真正在抢的，是 agentic AI 的标准位。对开发者和企业选型，意味着一个新的"默认栈"正在成型，而你迟早要决定上不上车。

## 一条栈，从你的膝盖到数据中心

先把这次同台亮出来的东西按层摆好，判断才有地方落脚。

最靠近用户的一层是 Windows 设备。NVIDIA 推出 RTX Spark——一颗他们自己叫"超级芯片"的东西，1 petaflop 的 AI 算力、最高 128GB 统一内存、号称能塞进续航一整天的轻薄笔记本，今年秋天上市，微软 Surface、华硕、戴尔、惠普、联想、微星都会出机型。再往上是 DGX Station for Windows，一台放在桌边的"AI 超算"：用 GB300 Grace Blackwell Ultra 桌面超级芯片，最高 748GB 一致性内存、20 petaflops 的 FP4 算力，能在本地跑最高 1 万亿参数的模型，年底出货。

petaflop 是衡量算力的单位，1 petaflop 等于每秒一千万亿次浮点运算。把这个数字放在桌边设备上，本身就是个信号——以前这是机房才有的量级。

往云上走一层，是微软自家的数据平台和模型平台。NVIDIA 把 GPU 加速塞进了 Microsoft Fabric，官方说 SQL 执行比纯 CPU 基线快最多 6 倍。NVIDIA 的开放模型——Nemotron 3 Ultra（推理）、Nemotron 3.5 ASR（语音识别）、Cosmos 3（面向物理 AI 的全模态模型）——上架微软的模型平台 Foundry，连 Claude 都在 Blackwell Ultra 上原生跑。

再贴近开发者一层，是 OpenShell：一个被塞进 GitHub Copilot 的安全运行时，给智能体一个沙箱化的容器，按策略控制它能往外打什么请求，Apache 2.0 开源。这一层很关键，因为智能体真正落地最大的障碍不是聪明不聪明，是放不放心让它动手——OpenShell 卖的就是"放手让它跑但跑在笼子里"。

栈的最底下，是 AI 工厂。下一代 NVIDIA 驱动的 AI 工厂，用 Vera Rubin 架构，官方给的数字是每兆瓦推理吞吐量最高提升 10 倍、每个智能体 token 的成本砍掉一个数量级；微软在威斯康星的 Fairwater 数据中心，会跑"数十万套"Grace Blackwell 系统。

把这五层叠起来：芯片（RTX Spark / DGX / Grace Blackwell）→ 操作系统（Windows）→ 开发者运行时（OpenShell in Copilot）→ 云平台（Fabric / Foundry）→ AI 工厂（Vera Rubin）。**每一层都有 NVIDIA 的硅 + 微软的软件咬在一起。**这不是合作清单，这是一条端到端的栈，被两家一次性焊死了。

![一条栈五层叠放](assets/gpt-img/01_stack.png)

## "AI 工厂"是什么，为什么它不是比喻

黄仁勋这两年逢人就说"AI 工厂"，听起来像营销词，但他指的是一个相当具体的东西。

传统数据中心存数据、跑应用，产出是信息。AI 工厂不一样：它把数十万张 Grace Blackwell GPU 当成**一台机器**来统一调度，从供电、散热到网络都围绕一件事优化——尽可能便宜地产出 token。token 是大模型吞吐的最小单位，你问模型一句话、它答你一段，中间流动的就是 token。在这个框架里，token 是工厂的产品，电是原料，GPU 集群是流水线。

黄仁勋在台上说了一句关键的话：「token 现在能赚钱了。」（Tokens are now profitable.）这句话朴素，但它是整套叙事的地基。逻辑是这样的：以前一个 AI 应用每生成一个 token 都在烧钱，规模越大亏越多；现在单位经济算得过来了，于是 AI 公司想生成更多 token、想盖更多 AI 工厂来生成它们。NVIDIA 给的那个"每 token 成本砍一个数量级"，砍的正是这条曲线——把每个 token 的边际成本压下去，token 的生意才真正成立。

为什么智能体时代尤其吃这套基础设施？因为一个会自己行动的智能体，和你聊两句的聊天机器人，token 消耗量不在一个量级。聊天机器人一问一答；智能体要规划、调工具、读结果、再规划，一个任务在后台可能消耗成千上万个 token，而且它是常驻的、自己跑的。黄仁勋自己的描述很直观：「PC 从一个工具，变成被 AI 助手自主使用的工具……我可以在外面出差、用手机给我的 PC 发消息，让它把代码写完。」一台帮你常驻干活的机器，背后是源源不断的 token 在烧。智能体越普及，token 需求越爆炸，AI 工厂就越是这条栈真正的底座。

所以"agentic AI 是基础设施之争"不是一句口号。智能体不是一个 app，是一种持续消耗算力的运行方式；谁控制了产 token 最便宜的工厂，谁就握着所有智能体应用的水电费定价权。

![AI工厂产token的循环](assets/gpt-img/02_factory.png)

## 纳德拉那句最大胆的话："无计量的智能"

这场对话里野心最大、也最该被掂量的，是纳德拉抛出的"无计量的智能"（unmetered intelligence）。

他的意思是：别再让所有模型都只活在云上、按调用次数计费，而是让开发者把模型跑在自己的本地机器上。「你现在有了一个完整的本地智能体闭环，可以给它工具访问权限，构建完全自有的智能体应用，不必每一步都跑到云上去。」配套的硬件正是 RTX Spark 和 DGX Station for Windows——把机房级的算力搬到桌边，于是"智能"不再像水电一样按表计费，而是装进你自己的盒子里随便用。

这句话的诱惑力很大。对开发者，它意味着数据不出本地、没有 API 账单、没有限速；对微软，它给了 Windows 一个在 AI 时代重新被需要的理由——别忘了 Windows 这些年的存在感一直在被云稀释。

但这一层恰恰是整场发布最站不稳的地方。科技分析师 Ben Thompson 在他的拆解里直接泼了冷水：「智能体最适合的环境是云，是跨应用、跨设备地工作；手机可以是其中一个设备，但论智能体，它不该是中枢。」他的判断是，本地推理这套逻辑在 2023 年 ChatGPT 刚火、模型只是个聊天框时成立；但今天的推理模型和智能体系统，要的是强 CPU 加上随时往云里甩活的能力，而不是把一堆算力锁死在本地 GPU 上。他对 RTX Spark 的评价很不客气：「它把大量芯片面积浪费在比云端更差的 GPU 核心上……如果你只想要个 2023 年版的聊天机器人，它够用；但在 2026 年，很难说它值这个价。」

这个分歧值得记住，因为它戳中了这条栈的一道裂缝。NVIDIA 和微软在最靠近用户那一层（本地设备）讲的故事，和智能体实际运行的重心（云）可能是拧着的。换句话说，这条栈五层都焊死了，但最上面那层——"无计量的智能"——卖的可能是一个方向没完全对的未来。把硬件买回家，不等于智能体就该在家里跑。

![本地与云的方向之争](assets/gpt-img/03_unmetered.png)

## 抢的是标准位，不是市场份额

回到最该锚住的判断：这场绑定真正在争夺的，是 agentic AI 这条栈的**标准位**，不是某一层的市场份额。

理由是栈的形状。当 NVIDIA 的芯片、Windows 的系统、Copilot 里的运行时、Foundry 上的模型、Vera Rubin 的工厂被设计成层层咬合、端到端贯通，开发者一旦在这条栈上构建智能体，每一层的接口、格式、调度方式就成了他的默认假设。换栈的成本不是换一个零件，是把五层全拆了重来。这就是标准位的含义——你不需要在每一层都最便宜或最好，你只需要让整条路成为"不用想的那条路"。

竞争对手的位置也因此清晰。在云这一层，亚马逊和谷歌有自己的栈，不会让微软轻松通吃。在芯片这一层，AMD、各家自研 ASIC 都在抢 NVIDIA 的份额。在设备这一层，按 Thompson 的判断，苹果用 iPhone 当中枢的模型，和微软推的"一群设备协同、智能体在云里跨设备跑"的模型，是两条不同的路。所以这条栈不是没人挑战，而是 NVIDIA + 微软抢先把一条完整的、能用的路铺出来了，逼所有人要么接它的标准，要么自己再铺一条。

谁先把整条栈跑通、谁让最多开发者在上面动手，谁就把"智能体该怎么搭"这件事的默认答案攥在了手里。这场台北连线的真正信息，不是"我们出了几个新产品"，是"这条栈，我们替你定了"。

![栈的标准位攻防](assets/gpt-img/04_standard.png)

## 对从业者意味着什么

如果你是开发者：现在该认真评估这条"默认栈"了。RTX Spark、DGX Station、OpenShell 这套本地 + 沙箱的组合，如果你在做需要数据不出域、或者想摆脱云端 API 账单的智能体，值得拿来做原型——但要带着 Thompson 那句怀疑去测：你的智能体到底是本地闭环就够，还是天然要跨设备、跨应用，离不开云？别被"无计量"的诱惑带着走，先量清楚自己的智能体重心在哪。

如果你负责企业选型：要意识到你选的不是一个工具，是一条栈的入口。一旦团队在 NVIDIA + 微软这条端到端栈上构建，迁移成本会随着每一层的咬合而指数上升。这未必是坏事——焊死的栈往往更省心——但要在签字前就把锁定成本算进去，而不是三年后才发现拆不动。

更上层的判断：agentic AI 的竞争已经从"谁的模型更聪明"下移到"谁的基础设施更便宜、更连贯"。token 经济、AI 工厂、本地与云的重心之争，这些听起来很远的词，正在决定你下一个智能体项目跑得起跑不起、迁得动迁不动。盯模型榜单的同时，也该开始盯这条栈。

## 关键词

- **agentic AI（智能体 AI）**：能自己规划、调用工具、执行多步任务的 AI，而不是一问一答的聊天机器人。它常驻、自主行动，因此消耗的算力远高于对话式 AI。
- **AI 工厂（AI factory）**：把数十万张 GPU 当成一台机器统一调度的数据中心，从供电散热到网络都为"最便宜地产出 token"而优化。产品是 token，不是数据。
- **token**：大模型处理文本的最小单位。你问一句、模型答一段，中间流动的就是 token。智能体一个任务可能烧掉成千上万个。
- **无计量的智能（unmetered intelligence）**：纳德拉提出的设想——让模型跑在本地机器上、形成完整智能体闭环，不必每步都按调用次数往云上付费。
- **全栈（full stack）**：这里指从芯片、操作系统、开发者运行时、云平台到 AI 工厂的每一层都被打通、端到端贯穿的整条技术栈。

## 引用

1. NVIDIA 官方推文（主信源），2026-06-03：[https://x.com/nvidia/status/2062228974273716457](https://x.com/nvidia/status/2062228974273716457)。原文：「The agentic AI era is here. From Taipei, Jensen Huang joined @satyanadella at #MSBuild to show how NVIDIA and @Microsoft are building it together, from Windows devices to AI factories at scale.」译：「智能体 AI 时代来了。从台北，黄仁勋在 MS Build 上与纳德拉同台，展示 NVIDIA 与微软如何携手打造它——从 Windows 设备到规模化 AI 工厂。」
2. NVIDIA 官方博客《NVIDIA Partners With Microsoft on Unified Stack for Agentic AI Deployment》：[https://blogs.nvidia.com/blog/microsoft-build-windows-local-cloud-devices/](https://blogs.nvidia.com/blog/microsoft-build-windows-local-cloud-devices/)（RTX Spark / DGX Station / Fabric / Foundry / OpenShell / Vera Rubin 的规格与数字来源）。
3. NVIDIA 新闻稿《NVIDIA and Microsoft Reinvent Windows PCs for the Age of Personal AI》：[https://nvidianews.nvidia.com/news/nvidia-microsoft-windows-pcs-agents-rtx-spark](https://nvidianews.nvidia.com/news/nvidia-microsoft-windows-pcs-agents-rtx-spark)。
4. Ben Thompson, Stratechery,《The Nvidia AI PC, Project Solara, Microsoft AI》：[https://stratechery.com/2026/the-nvidia-ai-pc-project-solara-microsoft-ai/](https://stratechery.com/2026/the-nvidia-ai-pc-project-solara-microsoft-ai/)（对本地推理与"无计量智能"的批评）。原文：「Agents work best in the cloud, and across apps and devices.」译：「智能体最适合的环境是云，是跨应用、跨设备地工作。」
