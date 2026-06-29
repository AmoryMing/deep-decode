---
title: Fable 5 的"逐步放开"，放开的不是能力，是准入
source: https://www.anthropic.com/news/claude-fable-5-mythos-5
author: Anthropic
date: 2026-06-28
type: decode
voice: default-doubao
style: default
tags: [Anthropic, Claude, Fable5, Mythos5, 灰度发布, 安全对齐, Opus4.8, 模型发布, AI治理]
---

6 月 9 日，Anthropic 把公开发布过的最强模型 Fable 5 一次性推上了 Claude API 和三大云。能力没有保留，没有 waitlist，没有“先给 1% 用户”。但同一天它又说，订阅用户只能免费用到 6 月 22 日，之后要扣 credits，GitHub Copilot 那边“逐步放量、没看到再等等”。

一个被宣传成“逐步放开”的模型，能力是满血上线的。这两件事不矛盾，恰恰是这次发布最该看懂的地方：Anthropic 把一次模型发布，拆成了两条互不相干的轴——**能力**给满，**准入**捏着慢慢放。“逐步”全发生在准入这条轴上。

## Fable 和 Mythos 是同一个模型的两张脸

要看懂准入为什么要分层，先看 Anthropic 这次给了两个模型：Fable 5 和 Mythos 5。

它们能力一模一样。官方文档的原话是 Mythos 5“和 Fable 5 共享能力，但去掉了安全分类器”（shares Claude Fable 5's capabilities without the safety classifiers）。换句话说，底层是同一个 Mythos 级模型，区别只在一层东西：分类器开不开。

开着分类器、对公众发的，叫 Fable 5。关掉分类器、只发给 Project Glasswing 里获批的合作伙伴和少数生物研究者的，叫 Mythos 5。Anthropic 自己的定义是“一个被我们做安全、可供大众使用的 Mythos 级模型”（a Mythos-class model that we've made safe for general use）。

这句话值得停一下。“做安全”在这里不是训练阶段把模型对齐好就完事，而是在一个已经训好的强模型外面，套了一层可以单独摘掉的壳。同一份权重，给伙伴的是裸的，给大众的是带壳的。安全在这次发布里不是模型的属性，是一个开关。

这就是为什么能力能一次给满，准入却要慢慢放——能力是固定的，那层壳的松紧才是 Anthropic 真正在调的旋钮。

## 那层壳长什么样：命中高风险就退回 Opus 4.8

壳的具体实现是一组安全分类器。Fable 5 处理请求时，分类器盯着话题；一旦命中网络安全、生物、化学、模型蒸馏这几类高风险领域，它不自己答，而是把这次请求交给 Claude Opus 4.8 来答。TechCrunch 转述官方的说法是“模型拦下回应，降级到 Claude Opus 4.8”（the model blocks responses and falls back to Claude Opus 4.8）。Anthropic 称 95% 以上的会话根本不触发降级，也就是触发率不到 5%。

这个降级的工程细节，藏着判断这次发布的关键。官方文档写得很清楚：Fable 5 拒绝一个请求时，API 返回的是成功的 HTTP 200，状态是 `stop_reason: "refusal"`，并且会告诉你是哪个分类器拦的——它不是报错，是一种正常返回。配套还有一整套计费规则：拒答在出任何内容之前发生，所以不计费；你换个模型重试，fallback credit 会把切换时的缓存成本退给你。

把这些拼起来看：拒答、降级、重试退费，已经是开发者必须写代码去处理的三类新状态。模型不再是一个你发请求、拿答案的静态接口。它会在某些话题上自己换一个更弱的脑子来答你，而你付的是 Fable 的钱。Anthropic 没把这当 bug 藏起来，反而做成了文档化的产品行为——说明降级不是临时补丁，是这一代模型对外的常态。

## "逐步"是一张排期表，不是技术限制

准入怎么放，Anthropic 给了一张明确的排期。

API 和按量付费的 Enterprise，6 月 9 日当天全量，没有阶梯。真正"逐步"的是订阅侧：Pro、Max、Team、按席位的 Enterprise，6 月 9 到 22 日免费包含 Fable 5；6 月 23 日起再用就要扣 usage credits；官方说"等产能允许了，再把 Fable 5 恢复成订阅计划的标配"。GitHub Copilot 那边也是逐步放量，企业管理员需要手动打开 Fable 5 的策略，默认关闭。

Anthropic 给出的理由是需求："我们预计 Fable 5 的需求会非常高，且难以预测"（We expect demand for Fable 5 to be very high, and difficult to predict）。按这个口径，逐步放开就是个产能调度问题——付费用量可控的渠道先给满，免费吃流量的订阅渠道留个口子慢慢开。

这个解释能成立一半。能力满血上 API、却给订阅用户设一道 6 月 23 日的收费闸，确实是在用价格信号把不可控的免费需求压成可计费的需求。但只把"逐步"理解成排产，会漏掉它更要命的另一半。

## 三天后被一纸指令叫停，才暴露“逐步”的真用途

6 月 12 日，发布后第三天，Fable 5 和 Mythos 5 被美国政府的一纸出口指令叫停。导火索是亚马逊的安全团队发现了一个越狱漏洞，上报给了白宫。GitHub 的更新日志直接挂出编辑注：“Fable 5 在所有 GitHub Copilot 场景里的访问已被暂停。”白宫 AI 顾问 David Sacks 的表态是，希望 Anthropic 尽快修好安全问题、解除出口管制、让 Fable 回到普遍发布。

把这件事放回发布当天的说辞旁边，反差很尖锐。Anthropic 发布时强调，外部漏洞悬赏跑了超过 1000 小时，“没有产生任何通用越狱”（no universal jailbreaks）。三天后，一个越狱漏洞就把模型从所有平台撤了下来。1000 小时无越狱的红队结论，被现实推翻只用了三天。

这才是“逐步放开”真正在防的东西。如果发布是一次性的、不可回收的，那么发现漏洞时模型已经在几百万次调用里跑过了，覆水难收。而把准入做成分层、可计费、要管理员手动开、默认关的形态，等于给整个发布装了一个随时能拽下来的总闸——监管要叫停，三天内就能从所有平台撤干净。逐步放开的价值不在“放”，在“随时能收回”。

需求是台面上的理由，可收回才是这套机制的底层目的。Anthropic 这次想验证的判断是：当模型强到一个程度，发布就不能再是一个动作，而必须是一个持续的、能反悔的状态。

## 盲区：我们不知道的

那层安全壳的触发条件，对用户是黑盒。命中哪些话题会被降级到 Opus 4.8，分类器的边界画在哪，用户看不到、改不了、也无处申诉。官方只给了一个“不到 5%”的自报数字，至于这 5% 里有多少是真高风险、多少是误伤合法探查，没有第三方验证。你付着 Fable 的钱，可能在某些正当问题上拿到的是弱模型的答案，而你不会知道这次被降级了。

那纸出口指令本身也是黑盒。它的确切文本、法律依据、适用范围都没公开，目前只有 InfoQ 和白宫顾问表态这类二手描述。叫停持续多久、6 月 23 日那道订阅收费闸在叫停之后是否还按原计划执行、模型现在到底恢复了没有——这些都还是进行中的事，本文写作时无法确证。所以这篇拆的是这套发布机制的设计逻辑，不是它最终跑成了什么样。

## 对 AI 从业者意味着什么

做集成的，别再把模型当一个稳定的 endpoint 接进去。Fable 5 这一代多了三个你必须写代码处理的状态：它会拒答（HTTP 200 + `stop_reason: "refusal"`，不是报错，别当异常崩了）、会在高风险话题上把你降级到 Opus 4.8（你付 Fable 的价、拿 Opus 的答案）、拒答不计费但重试要走 fallback credit。这三条官方都文档化了，照着 refusals-and-fallback 那套写好兜底，比上线后被静默降级坑了强。

买能力的，要重新算一笔账。你买的不是一个模型，是“能力 + 一层随时可能被供应商或监管收紧的准入”。那层准入不在你的 SLA 里：5% 的降级率不在、6 月 23 日的收费闸不在、一纸出口指令更不在。Mythos 和 Fable 同源不同壳还顺带说明，最强的那一档能力本来就不是给公众的——它发给了 Glasswing 里获批的伙伴。你能稳定拿到的，永远是戴着壳、可被调紧的那一版。

更上一层看：Anthropic 这次把“逐步放开”做成了产品形态，等于给行业立了个样板——模型越强，发布越要可回收。后面的强模型大概率都会带上这种“能力满血、准入捏着、随时能撤”的结构。谁先把拒答和降级的兜底写进自己的系统，谁就少被下一次“三天叫停”打个措手不及。

## 本期关键词

- **Fable 5 / Mythos 5** — Anthropic 2026 年 6 月 9 日发布的同源双模型。底层是同一个 Mythos 级强模型，Fable 5（模型 ID `claude-fable-5`）戴安全分类器，公开发布；Mythos 5（`claude-mythos-5`）摘掉分类器，只通过 Project Glasswing 限量发给获批伙伴和少数生物研究者。能力相同，区别只在壳开不开。

- **安全分类器 / 降级（fallback）** — Fable 5 外面套的判断模块。它盯着请求话题，一旦命中网络安全、生物、化学、蒸馏等高风险领域，就不让 Fable 自己回答，转而交给更保守的 Claude Opus 4.8。官方称触发率不到 5%。对开发者来说，这意味着同一接口在某些话题上会悄悄换成一个更弱的模型来回应。

- **逐步放开 / 灰度发布** — 不是一次性把模型推给所有人，而是按渠道、时间、付费方式分层放量，同时保留随时收回的能力。这次的具体形态：API 当天全量，订阅侧免费窗口到 6 月 23 日转收费，平台默认关闭、管理员手动打开。真正用途不是“放”，而是出问题时能快速从所有平台撤下来——6 月 12 日那次三天叫停就用上了。

- **Project Glasswing** — Anthropic 发放无安全壳版本（Mythos 5）的限量通道。只对获批客户开放，通过 Anthropic、AWS 或 Google Cloud 的客户团队申请。这说明：最强、限制最少的那一档能力，设计上就不打算给公众，而是定向给经审查的机构。

## 引用

1. [Claude Fable 5 and Claude Mythos 5 — Anthropic](https://www.anthropic.com/news/claude-fable-5-mythos-5) — 官方发布原文。“今天我们发布 Claude Fable 5：一个我们做安全后可供大众使用的 Mythos 级模型”“我们预计 Fable 5 的需求会非常高且难以预测”“超过 1000 小时测试里没有产生任何通用越狱”。
2. [Introducing Claude Fable 5 and Claude Mythos 5 — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5) — 官方文档。model id、$10/$50 定价、1M 上下文、拒答返回 `stop_reason: "refusal"` 的 HTTP 200、fallback credit、Mythos“共享能力但去掉安全分类器”、6/9 各平台可用、30 天数据留存。
3. [Claude Fable 5 is generally available for GitHub Copilot — GitHub Changelog](https://github.blog/changelog/2026-06-09-claude-fable-5-is-generally-available-for-github-copilot/) — 平台变更日志。开放给 Copilot Pro+/Max/Business/Enterprise；“Rollout will be gradual”；策略默认关；6/12 编辑注：“Fable 5 在所有 GitHub Copilot 场景里的访问已被暂停”。
4. [Anthropic released Claude Fable 5… days after warning AI is getting too dangerous — TechCrunch](https://techcrunch.com/2026/06/09/anthropic-released-claude-fable-5-its-most-powerful-model-publicly-days-after-warning-ai-is-getting-too-dangerous/) — “在网络安全、生物、化学和蒸馏等高风险领域，模型拦下回应并降级到 Claude Opus 4.8”；至少 95% 会话不触发降级。
5. [Anthropic releases Claude Fable 5 and Mythos 5 with major gains in coding and science — the-decoder](https://the-decoder.com/anthropic-releases-claude-fable-5-and-mythos-5-with-major-gains-in-coding-and-science/) — 引官方基准：SWE-Bench Pro Fable 80.3%（Opus 4.8 69.2% / GPT 5.5 58.6%）；FrontierCode Fable 29.3%（Opus 4.8 13.4% / GPT 5.5 5.7%）。
6. [Anthropic Releases and Temporarily Suspends Claude Fable 5 — InfoQ](https://www.infoq.com/news/2026/06/claude-5-release/) — 6/12 美国政府出口指令叫停；亚马逊安全团队上报越狱漏洞给白宫；David Sacks 称希望尽快修好、解除管制、恢复发布。
7. [Anthropic releases Mythos-like AI model to the public, Claude Fable 5 — CNBC](https://www.cnbc.com/2026/06/09/anthropic-mythos-claude-fable-5.html) — 二手交叉验证 Mythos→Fable 公开版的定位。
