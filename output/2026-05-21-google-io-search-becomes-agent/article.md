---
title: 谷歌 I/O 之后：搜索框正在变成 Agent 入口
source:
  - https://blog.google/products-and-platforms/products/search/search-io-2026/
  - https://blog.google/innovation-and-ai/sundar-pichai-io-2026/
  - https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/
  - https://finance.sina.com.cn/tech/roll/2026-05-20/doc-inhyphnk2678725.shtml
  - https://www.ifanr.com/1666447
  - https://thenextweb.com/news/google-search-ai-overhaul-information-agents-io-2026
  - https://simonwillison.net/2026/May/20/google-io/
  - https://en.wikipedia.org/wiki/ChatGPT_Atlas
  - https://www.perplexity.ai/comet
  - https://www.anthropic.com/news/claude-design-anthropic-labs
  - https://almcorp.com/blog/google-search-63-billion-ai-mode-advertising-q4-2025/
  - https://rundatarun.io/p/last-30-days-google-io-2026
author: 内容工厂
date: 2026-05-21
type: decode
slug: 2026-05-21-google-io-search-becomes-agent
tags: [Google, GoogleIO, Agent, UX, Search, Gemini]
---

# 谷歌 I/O 之后：搜索框正在变成 Agent 入口

![封面 · 谷歌 I/O 之后，搜索框变 Agent 入口](cover.png)

Sundar Pichai 在 keynote 上把那句话说得很重——"the biggest upgrade to our iconic search box since its debut over 25 years ago"（25 年来对这个标志性搜索框最大的一次升级）。同一天，Polymarket 上"五月底最强 AI 模型"赌盘的读数是 Anthropic 96%、Google 1%、OpenAI 1%，八百多万美元的盘子，Google 这场两小时发布会几乎没让指针动一下。开发者圈对模型实力还没回过味来。

把这两组数字摆在一起，本届 I/O 的主线就清楚了：Google 真正升级的不是模型，是入口。模型实力没追上 Anthropic，但 Google 先动了一件比版本号更底层的事——PC 时代 40 年留下来的"输入框 + 控件 + 列表"这套 GUI 原语，正在被一个会自己组装界面、调用工具、在后台跑任务的 Agent 入口替换掉。机器之心的标题概括得最准："I/O 大会开完，谷歌连搜索框都变智能体了。"

## 同时被改的四个口子

搜索框只是这场替换里最显眼的那一个。Google 这次把四个不同层级的入口一起翻了一遍。

![四个被改的入口：搜索框 / 结果页 / 后台 / 桌面层](01_four_entries.png)

**第一个是搜索框本身。** 官方原话说它现在 "intuitive"、"dynamically expanding"，可以接受 "text, images, files, videos, or Chrome tabs as inputs"（文本、图片、文件、视频，或正在浏览的 Chrome 标签页）。机器之心的措辞更直白：谷歌"把传统的搜索框变成了一个通用对话框"。Tom's Guide 实测的体验是，框会随用户描述需求的长度自己拉高，AI 补全的不再是关键词，而是用户没说完的意图。

**第二个是搜索结果页。** Google 给它起的名字叫 Generative UI——官方说法是 "Search can design custom layouts, assembling components – like interactive visuals, tables, graphs or simulations – in real time"（搜索会自己设计布局，把互动可视化、表格、图表、模拟器这些组件实时组装起来）。爱范儿测试时问了一道物理题，搜索直接调用 Antigravity 现场写了一个互动式 Web 演示。结果页不再是十条蓝链接，是一个模型按用户问题现场拼出来的 mini-app。

**第三个是后台。** Information Agents 这个新组件 24/7 跑在 Google 这边，用户可以设定多个 agent 盯股价、盯新闻、盯商品价格，到点被动通知。这个能力夏季给 Pro 和 Ultra 订阅者。

**第四个是桌面层。** Gemini Spark 是常驻的个人 Agent，跑在 Google Cloud 的专属 VM 上；Antigravity 2.0 升级成独立桌面 app，官方描述为 "built entirely around agent orchestration"（完全围绕 agent 编排构建），用户可以让多个 agent 并行干活——一个写网页，一个生成品牌素材。

四个口子一起被改，不是一次产品更新，是一次范式切换。

## 控件代理化：GUI 时代 40 年的转折

![控件代理化 · 离散控件 GUI → Generative UI](02_gui_paradigm.png)

GUI 这套东西从施乐 PARC 1973 年的 Alto 算起，到现在五十多年。它的核心假设一直没变：把用户意图离散化成一组可点击的控件——按钮、菜单、文本框、列表项——每次点击触发一个预定义的 API。设计师的工作是穷举所有用户路径，再把这些路径压缩成有限的控件。

Generative UI 反过来做。用户描述一个意图，模型现场组装一个用过即抛的界面。爱范儿把这个变化总结成"搜索行为从『获取信息』进化成了『完成任务』"——这一步背后还有更深的一步："应用这个概念正在变薄"。结果页可以现场拼一个抵押贷款计算器、一张露营路线图、一段 3D 物理模拟，"装一个 App"的边际价值就被搜索框吃掉了一截。

把 GUI 控件换成 Agent 调度，设计师不再设计完整页面，模型在 inference 时刻按用户意图拼出页面。这件事三年前还做不了，因为单次推理成本太高——给每个查询生成一个交互式 UI，毛利会被吃光。今年 Google 财报披露 AI response cost 较 Gemini 3 升级降 30%，每次查询现场组装 UI 才算进了经济区间。Generative UI 不是 UI 创新，是 TPU 8i 把推理成本压低之后的产品化兑现。

## 入口替换的另外三家

![入口替换战 · 四家挑了四个不同的"输入框"](03_four_players.png)

只看 Google 会以为这是 Pichai 一个人的赌注。横向铺开看，过去十八个月里四家头部厂商都在改入口，差别在各自动了哪一个。

**Perplexity 改浏览器地址栏。** 2025 年 7 月 Comet 在 Win/Mac 上线，11 月上 Android，2026 年 3 月上 iOS。这一波里最激进的方案——官方页面写着 "Instead of a traditional URL bar, a prompt box dominates the view where you simply ask a question"（不再有传统的 URL 栏，主视图被一个提示框占据，用户直接问问题）。地址栏这个东西从 1993 年 Mosaic 算起也三十多年，Perplexity 整个砍掉。

**OpenAI 改桌面层。** ChatGPT Atlas 2025 年 10 月发布 macOS 版，基于 Chromium，把 ChatGPT 做成侧边栏助手，付费用户可以开 "agent mode" 让模型直接操作网页。2026 年 1 月加 tab groups，3 月宣布把 Atlas、Codex 和 ChatGPT 桌面 app 合并成一个 superapp。OpenAI 的逻辑是先抢操作系统级控制权，再往上分发——浏览器只是入口的一种，桌面 app 才是终点。

**Anthropic 改专业工具入口。** 2026 年 4 月 Claude Design 上线 Claude.ai 侧边栏的 palette icon，左边对话、右边 live canvas——用户描述要什么，Claude 生成第一版，再通过对话、行内批注、直接编辑或滑块去精修。Anthropic 没碰浏览器和操作系统，挑了一个最克制的位置：从设计师、PM 的专业工具切进去。

**Google 改搜索框。** 这个位置最有意思的地方在流量——AI Mode 一年破 10 亿月活，每季度查询量翻倍。这个口子的吞吐量比浏览器、桌面、Figma 加起来还大一个量级。Google 没选最激进的方案，挑了最大的存量。

四家挑了四个不同的位置去攻，攻的是同一件事：把"用户操作 GUI 控件"换成"用户描述意图 + Agent 现场执行"。一年半之内，搜索框、URL 栏、桌面 app、专业工具入口这四种"输入框"被集体重写。

## 一年半的入口替换

![18 个月的入口替换时间线](04_timeline.png)

把时间线铺出来看，节奏比 keynote 上那种"今天我们发布"的叙事密得多：

- 2025 年 7 月，Perplexity Comet 上 Win/Mac。
- 2025 年 10 月，OpenAI ChatGPT Atlas 上 macOS。
- 2025 年 11 月，Comet 上 Android。
- 2026 年 3 月，Comet 上 iOS；OpenAI 宣布 Atlas + Codex + ChatGPT 合并桌面 superapp。
- 2026 年 4 月，Anthropic Claude Design 上线。
- 2026 年 5 月，Google I/O 把搜索框这个 25 年的老入口重做一遍。

短到这种程度的 cadence 不是巧合。模型层每六个月迭代一次，倒逼上层入口每六个月动一次。这不是 Google 单家的发布会，是一场已经跑了十八个月的入口替换战的第四个 announcement。

## 范式革命要先撞翻自家广告业务

![广告生意的两难 · Generative UI 与 1980 亿现金流的冲突](05_ad_dilemma.png)

上面这些描述都是好看的那一面，账还没结。

Generative UI 在搜索结果页直接拼 mini-app，第一个被吃掉的就是"十个蓝链接"这个广告位形态。Google 搜索广告 Q1 2026 营收 600 亿美元、同比加 19%，2025 全年 1980 亿美元，占整个 Alphabet 营收的六成。这门生意建立在一个朴素假设上——用户点一个链接，链接旁边挂一个广告。当链接变成现场组装的可交互组件，广告挂在哪里？

Google 的过渡解是两条腿走路：AI Mode 里测试新的广告位，同时把 Checkout 集成进 AI Mode，让用户在结果页直接付钱，吃交易抽成而不只是广告费。这是 Pichai 没在 keynote 上展开讲的部分。从公开数据看现金流还撑得住——Q1 加 19% 说明广告业务还在过渡期内——但 Generative UI 一旦全量铺开，每一个被模型现场拼出来的 mini-app 都是对原有广告库存的减法。

TheNextWeb 的评论讲得直接：Google 把信息在自己这边合成、把交互闭环留在结果页，"reduces incentive for users to visit source websites"（降低了用户访问源网站的动机）。这话对内容站和 SEO 业是判决书，对 Google 自己的广告生态也是。Google 是唯一一家既要做范式革命又要保护现金流的玩家——这是它的难点，也是它会比 Perplexity 慢的根本原因。

## 没说出口的另外几件事

Simon Willison 当晚的博客有句话很扎实："a lot of the big announcements are 'coming soon'"（大部分大的发布都标着"即将推出"）。Information Agents 夏季给 Pro/Ultra，Generative UI 也是夏季全量铺，Spark 给 trusted testers。这场发布会里能立刻上手验证的不多。

价格也有反直觉的地方。独立测算显示，Gemini 3.5 Flash 实测推理成本比 Gemini 3 Flash 贵 5.5 倍，比 Gemini 3.1 Pro 还贵 75%。"Flash"这个命名从代际上看一直是 budget 档位，3.5 这一代的定价已经从"便宜的 frontier"漂到了"中档"。Pichai 在台上反复说"价格不到同档前沿模型的一半"，对照的是 GPT-5 这类，不是上一代 Gemini。这条信息官方没完整披露。

安全是另一条。Willison 直说担心 Spark 是 "the top candidate for the agent security challenger disaster"（agent 安全事故的头号候选）——24/7 跑在云端 VM 上、native 接入 Gmail / Drive / Calendar 的代理，被 prompt injection 攻击时用户怎么救？官方安全文档列了 enterprise 级控制，消费者侧的兜底没讲。

主流媒体漏掉的还有一条：Google 公告里夹了一段——Gemini CLI（Apache 2.0 协议）6 月 18 日停服，被闭源的 Antigravity CLI 替代。Google 在开发者工具上从开源往闭源走，这是一个分发权信号。

最后是市场判断。Polymarket "best AI model end of May" 赌盘读数 Anthropic 96%。Google 这场两小时发布会上完，赌盘指针没动。开发者圈对 Gemini 模型实力的信任度还没回来。

## 对从业者意味着什么

**对企业 AI 产品负责人**：盘点一下自家产品里那些"输入框 + 表单 + 列表"的核心交互。这一波入口替换三年内会传染到 B 端工具。员工上下班路上习惯了搜索框听懂复合指令、自己拼出报表，回到办公场景再用十年前那种"先点筛选器再点导出"的工具，体感会很断裂。提前画一张产品 input 端从"控件填空"走向"意图描述"的路径图。

**对产品经理**：把"结果页 = 列表 + 卡片"这个假设换掉。Generative UI 把结果页变成了一次性的、按 query 现场组装的 UI。设计交付物不再是固定页面，是一组组件 + 一份意图到组件的映射规则。设计稿这种交付物的边界会变模糊。

**对前端工程师**：组件库要为"模型现场组装"做准备。每个组件需要更严格的 props 契约、更明确的 a11y 标记、更稳的回归测试。模型拼出来的 UI 没有设计师手工对齐过，工程稳定性靠组件内部抗住。Antigravity 和 WebMCP 这两条协议先读一遍源码，先于业务落地建立 mental model。

**对内容 / SEO 负责人**：十年沉淀的蓝链接 SEO 资产开始折现。第一波损耗已经发生——AI Overviews 上线那年内容站的 referral 流量普遍掉一两成。Generative UI 全量铺开后曲线会更陡。值得算的账是：哪类内容会被模型在 Generative UI 里"引用并保留链接"，哪类内容会被吸进 mini-app 的内嵌数据。结构化数据、第一手数据、强品牌内容是第一类；汇总性、解释性内容多半进第二类。

**对 AI Native 创业者**：入口已经被四家头部公司各占一个，再做一个"对话式搜索框"产品在战略上已经过时。反方向更值得想——大公司没动到的那些"输入框"，企业内部 IT 工单、政府服务表单、医疗 intake、教育课堂提问。这些口子的流量比不上 Google 搜索框，但用户的痛感更具体，落地阻力更小。

## 本期关键词

**控件代理化** —— GUI 时代的离散控件（按钮、列表、表单）被 Agent 现场组装的连续 UI 替换的过程。本质是把"设计师穷举用户路径"换成"模型在 inference 时刻按意图拼出路径"。Generative UI 是它在搜索结果页的第一个大规模落地，但范式比 Generative UI 更大——任何用 GUI 控件让用户描述意图的产品都在替换名单上。

**入口替换战** —— 2025 年 7 月到 2026 年 5 月，四家头部 AI 公司各自改一种"输入框"的运动。Perplexity 改浏览器地址栏，OpenAI 改桌面 superapp，Anthropic 改专业工具侧边栏，Google 改搜索框。攻的是同一件事，挑的是不同的存量入口。

**Generative UI** —— Google I/O 2026 的正式产品名。搜索结果页不再是固定模板，模型按查询现场组装可交互组件——折线图、表格、3D 演示、小型应用。技术上靠 Gemini 3.5 Flash + Antigravity 在 inference 时刻做代码生成。经济上靠推理成本被压到每次查询都能现场组装的水平（Google Q1 2026 披露 AI response cost 较 Gemini 3 降 30%）。

**蓝链接折现** —— 搜索结果页用十年沉淀的 SEO 资产，在 Generative UI 范式下不再等价兑现成流量。损耗从 AI Overviews 上线时就开始，Generative UI 全量铺开后曲线会更陡。这件事对内容站、媒体、广告业都是分母变小的问题，对 Google 自己的广告库存也是。

**Information Agents** —— Google 这次新加的搜索内常驻代理类型。用户在搜索框里设一个目标（盯股价、盯航班、盯商品价格），agent 在后台 24/7 跑，到点主动通知。本质是把"用户重复发起查询"压缩成"一次定义、持续监控"，把搜索从"获取信息"推到"完成任务"。夏季上线 Pro / Ultra 订阅者。

## 引用

1. Google Blog, "Google Search's I/O 2026 updates: AI agents and more", 2026-05-19, <https://blog.google/products-and-platforms/products/search/search-io-2026/>
2. Sundar Pichai, "Google I/O 2026: Sundar Pichai's opening keynote", Google Blog, 2026-05-19, <https://blog.google/innovation-and-ai/sundar-pichai-io-2026/>
3. Google Developers Blog, "I/O 2026 developer highlights: Antigravity, Gemini API, AI Studio", 2026-05-19, <https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/>
4. 机器之心，"I/O 大会开完，谷歌连搜索框都变智能体了"，2026-05-20，<https://finance.sina.com.cn/tech/roll/2026-05-20/doc-inhyphnk2678725.shtml>
5. 爱范儿，"Google 重塑搜索框，进化 50 亿人的上网习惯"，2026-05-20，<https://www.ifanr.com/1666447>
6. The Next Web, "Google replaces the search box with AI agents at I/O 2026", 2026-05-20, <https://thenextweb.com/news/google-search-ai-overhaul-information-agents-io-2026>
7. Simon Willison, "Google I/O, Gemini Spark, Antigravity", 2026-05-20, <https://simonwillison.net/2026/May/20/google-io/>
8. Wikipedia, "ChatGPT Atlas", <https://en.wikipedia.org/wiki/ChatGPT_Atlas>
9. Perplexity, "Comet Browser", <https://www.perplexity.ai/comet>
10. Anthropic, "Introducing Claude Design by Anthropic Labs", 2026-04-17, <https://www.anthropic.com/news/claude-design-anthropic-labs>
11. ALM Corp, "Google Search Hits $63B: AI Mode Ads & Monetization in 2026", <https://almcorp.com/blog/google-search-63-billion-ai-mode-advertising-q4-2025/>
12. Justin Johnson, "Last 30 Days: Google I/O 2026", rundatarun.io, 2026-05-20, <https://rundatarun.io/p/last-30-days-google-io-2026>
