---
title: Claude Fable 5 逐步放开——能力一次到位，准入分层灰度
type: source
created: 2026-06-28
updated: 2026-06-28
tags: [Anthropic, Claude, Fable5, Mythos5, 模型发布, 安全对齐, 灰度发布, Opus4.8]
---

## 核心论点

Fable 5 的「逐步放开」不是一句产能不够的客套话，而是 Anthropic 把一次模型发布拆成了两条独立的轴：**能力**和**准入**。

- 能力轴：Fable 5 == Mythos 级能力，已是公开发布过的最强模型，6/9 一次性到位。
- 准入轴：谁拿到、什么时候拿到、命中高风险话题时退回哪个模型——这条轴被刻意做成可分层、可计费、可降级、可被监管一键叫停。

「逐步」发生在准入轴上，不在能力轴上。这是把「让模型安全」从训练阶段的一次性对齐，搬到了产品/运营层的持续治理。

## 关键事实（带出处）

- model id `claude-fable-5`，2026-06-09 在 Claude API、AWS、Bedrock、Google Cloud(Vertex)、Microsoft Foundry 全面可用。[官方平台文档]
- Fable 5 = 给 Mythos「做安全」后的公开版；Mythos 5(`claude-mythos-5`)不带安全分类器，只在 Project Glasswing 限量发给获批客户与少数生物研究者。[Anthropic news / docs]
- 安全机制：Fable 内置分类器，命中网络安全/生物/化学/蒸馏等高风险话题时自动改由 **Claude Opus 4.8** 应答；官方称 95%+ 的 session 不触发降级(即触发率<5%)。拒答在 API 里返回 `stop_reason: "refusal"` 的 HTTP 200，并报告是哪个分类器拒的。[docs / TechCrunch]
- 准入分层：API 与按量付费 Enterprise 当天即全量；Pro/Max/Team/席位制 Enterprise 在 6/9–6/22 免费包含，6/23 起改为需 usage credits，待产能恢复再回归订阅标配。[Anthropic news]
- GitHub Copilot：6/9 起放给 Copilot Pro+/Max/Business/Enterprise，明示「Rollout will be gradual」，企业/商业管理员需手动开策略(默认关)。[GitHub Changelog]
- 6/12(发布后三天)Fable 5 与 Mythos 5 被美国政府出口指令叫停——亚马逊安全团队发现一个越狱漏洞并上报白宫所致。白宫 AI 顾问 David Sacks 称希望尽快修好、解除管制、恢复发布。[InfoQ]
- 定价 $10/百万输入 token、$50/百万输出 token(约 Mythos Preview 的不到一半)；1M token 上下文，单次最多 128k 输出；30 天数据留存，不支持零留存。[docs]
- 能力定位(官方基准)：SWE-Bench Pro 80.3%(Opus 4.8 69.2% / GPT 5.5 58.6%)；FrontierCode 29.3%(Opus 4.8 13.4% / GPT 5.5 5.7%)。[the-decoder 引官方]

## 金句（英文附译）

- "Today we're launching Claude Fable 5: a Mythos-class model that we've made safe for general use." — 今天我们发布 Claude Fable 5：一个被我们「做安全」、可供大众使用的 Mythos 级模型。
- "We expect demand for Fable 5 to be very high, and difficult to predict." — 我们预计 Fable 5 的需求会非常高，且难以预测。
- "we ran an external bug bounty that produced no universal jailbreaks in over 1,000 hours of testing." — 我们办了一场外部漏洞悬赏，超 1000 小时测试里没有产生任何通用越狱。
- "When Claude Fable 5 declines a request, the Messages API returns stop_reason: \"refusal\" as a successful HTTP 200 response, not an error." — Fable 5 拒答时，API 以成功的 HTTP 200 返回 `stop_reason: "refusal"`，而非报错。

## 可写角度

1. **「逐步放开」拆解为能力轴 vs 准入轴**（首选）——为什么能力一次到位、准入分层灰度，这说明 Anthropic 把安全从训练侧搬到了运营侧。
2. Fable/Mythos 双胞胎结构：同一能力，一个戴分类器对公众、一个不戴对获批伙伴——安全成了一个「开关」而非「属性」。
3. 工程视角：拒答、降级、fallback credit 是开发者必须新写的三类状态码处理，模型不再是静态 endpoint。
4. 6/12 叫停事件：1000 小时无越狱的红队结论被三天打脸，监管能一键覆盖商业发布——灰度发布在这里的真实价值是「随时能收回」。

## 信源

1. [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) — 一手(官方发布)
2. [Introducing Claude Fable 5 and Claude Mythos 5 — Platform Docs](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5) — 一手(官方文档)
3. [Claude Fable 5 is generally available for GitHub Copilot](https://github.blog/changelog/2026-06-09-claude-fable-5-is-generally-available-for-github-copilot/) — 一手(平台变更日志)
4. [Anthropic released Claude Fable 5… days after warning AI is getting too dangerous](https://techcrunch.com/2026/06/09/anthropic-released-claude-fable-5-its-most-powerful-model-publicly-days-after-warning-ai-is-getting-too-dangerous/) — 二手(TechCrunch)
5. [Anthropic releases Claude Fable 5 and Mythos 5 with major gains in coding and science](https://the-decoder.com/anthropic-releases-claude-fable-5-and-mythos-5-with-major-gains-in-coding-and-science/) — 二手(the-decoder，含官方基准)
6. [Anthropic Releases and Temporarily Suspends Claude Fable 5](https://www.infoq.com/news/2026/06/claude-5-release/) — 二手(InfoQ，叫停事件)
7. [Anthropic releases Mythos-like AI model to the public, Claude Fable 5](https://www.cnbc.com/2026/06/09/anthropic-mythos-claude-fable-5.html) — 二手(CNBC)
