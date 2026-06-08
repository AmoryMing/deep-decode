---
title: 12 美元 vs 61 美元
source: https://www.qbitai.com/2026/05/424552.html
author: 量子位 · 鱼羊
date: 2026-05-25
type: decode
voice: default-doubao
signature_key: chinadaas-internal
---

# 12 美元 vs 61 美元

一个公开放弃通用性的开源工具，把 DeepSeek V4 的缓存命中率推到了 99.82%。同一个 DeepSeek，同一份工作流，单日 4.35 亿输入 token，账单从 61 美元降到 12 美元。差距来自模型外面那一层——harness。

![封面](cover.png)

2026 年 5 月 1 日。开发者 esengine 单日跑出了一份账单。输入 4.35 亿 token，缓存命中率 99.82%，最终扣费约 12 美元。同样的工作量如果按常规命中率算，是 61 美元。差距 5 倍，来源不是模型，是模型外面那一层。

那一层有名字。这个名字最近一年在英文圈逐渐定型，叫 **harness**——LLM 模型外面那一圈骨架，决定上下文怎么组织、工具怎么暴露、回路怎么跑、成本怎么控。Claude Code、Cursor、aider、Cline 都是 harness。esengine 的项目叫 Reasonix，挂在 GitHub 上是 esengine/DeepSeek-Reasonix。他做了一件别的 harness 不敢做的事：**公开宣布自己只为 DeepSeek 一家模型打造，完全不通用，也永远不会出通用版本**。

这件事在 2026 年的 AI 工具圈是反方向的。过去两年所有红利都来自"通用"——Cursor 通吃 Claude / GPT / Gemini，Cline 切换主干模型靠下拉菜单，aider 干脆把模型抽象成 yaml 配置。Reasonix 反过来把通用性当包袱扔了。它的三层抽象——cache 循环、tool calling 修复、模型梯度切换——全部绑死 DeepSeek 的具体 feature。在这个绑死的代价下，它拿到了 99.82% 的命中率，比 DeepSeek 自家的 web 服务还高 4 个百分点。

这篇文章想说清楚的一件事：模型层在 2026 年趋同，差距已经迁移到 harness 层。Reasonix 是一个极端样本，但极端样本恰恰能让"差距迁移"这件事看清楚。

## 91 到 99.82：DeepSeek 自家的天花板被外人打穿

先把数字摆清。

DeepSeek 在 2026 年 4 月 27 日宣布永久降价。输入 token 分两档：**cache hit 0.25 元/百万**，**cache miss 2.5 元/百万**。命中价是未命中价的十分之一。这是 V4 的核心定价杠杆——你的命中率每提高一个量级，账单就降一档。

量子位在降价文里给了 DeepSeek 自家的命中率基线：**V4 Pro 约 96%，V4 Flash 约 91%**。这两个数字是 DeepSeek 官方 web 和 app 的真实表现，来自服务端 session cache + 增量上下文的组合优化。已经是行业里最高的一档。

99.82% 比这个基线又往上拱了一个数量级。"一个数量级"不是夸张——这里要看的是 miss 的绝对量，而不是 hit 的百分比。从 91% 命中到 99.82% 命中，看起来只多了 8.82 个百分点，但 miss 比例从 9% 降到了 0.18%，是 50 倍的差距。在 4.35 亿 token 的体量上，这 50 倍直接换算成账单。按 DeepSeek 现价粗算：

- 91% 命中：3.96 亿 hit × 0.25 + 0.39 亿 miss × 2.5 = 约 99 元 + 97.5 元 = 约 197 元
- 99.82% 命中：4.342 亿 hit × 0.25 + 78 万 miss × 2.5 = 约 108.5 元 + 1.95 元 = 约 110 元

110 元对应的就是 12 美元。Reasonix 不是在和裸 API 比，是在和**已经做了一轮命中率优化的 DeepSeek 官方服务**比。它在比 91% 这条线还要往上拱。

为什么 DeepSeek 自家拿不到 99%？因为 DeepSeek 的 web 服务要兼顾**所有用户的所有 session**。新用户、新对话、跨设备、多端同步——这些场景里没有稳定前缀。DeepSeek 的服务端缓存是被动检测公共前缀，能命中多少看缘分。Reasonix 反过来——它假设你只是在一个 codebase 里写代码，假设你的 session 是长的，假设你的工具集合是固定的。这些假设大幅缩小了使用场景，换来了字节级稳定的前缀。

![缓存经济学](01_cache_economics.png)

## 三个固定区域：harness 怎么把上下文焊死

Reasonix 的第一个支柱叫 **cache-first loop**。原文表述是"byte-stable prefix-cache mechanics keep cacheable content consistent across sessions"——基于字节稳定前缀缓存的运行循环，让可缓存内容在会话之间保持一致。翻译过来就是一句话：**old context stays fixed, new messages are only appended**。

实现方式是把上下文切成三个固定区域。

**前缀区**放系统提示、工具 schema、项目 onboarding。这部分在整个 session 期间一次写定，永不变。任何对工具描述的修改、任何对系统提示的微调，都会让整个前缀失效。所以前缀区是"焊死"的——出厂即定型。

**中部区**放长期记忆。这部分按 session 周期重写，但在一个 session 期内保持不变。比如这次 session 一开始就把 README、ARCHITECTURE.md、最近三次提交记录读进来，整个 session 不再改。session 结束才更新。

**末尾区**放本轮对话——用户输入、AI 回复、工具调用结果。每轮只追加，从不修改历史。哪怕你想纠正 AI 的上一个错误，也是在末尾补一句"上面那个 implementation 错了，重写"，而不是回去改它。

这个三区结构对 prefix cache 的友好程度是字节级的。DeepSeek 的官方文档讲过 cache prefix unit 的判定逻辑：**当前请求必须完全匹配一个 cache prefix unit**——不允许部分重叠，token id 序列必须严格相等。任何对中间内容的修改都会让后面所有 token 的 KV cache 失效。Reasonix 把这条规则直接物化成了上下文布局。

![三区上下文](02_three_regions.png)

副作用是，常规 IDE 插件里"编辑历史""压缩对话""重排消息"这些 feature 在 Reasonix 里全是禁区。你要纠正，就 append。你要清理，就开新 session。这是用 UX 的灵活性换 cache 命中率。

## 工具调用修复：token 黑洞的堵漏工程

第二个支柱叫 **tool-call repair**。原文是"Handles model output errors without token waste"——处理模型输出错误，不浪费 token。

为什么这是个独立支柱。DeepSeek V4 在 tool calling 上的常见故障比 GPT-5 多——JSON 引号转义错、函数参数 schema 不严格、重复调用同一个工具、调用不存在的工具。每次故障的代价是一轮完整 token：模型输出几百 token 的失败 JSON，agent 框架报错，下一轮带着错误日志再请求一次。一个 8000 token 的工具描述前缀 + 错误恢复信息，反复跑五六轮，就是几万 token 的纯浪费。更糟糕的是，**错误日志注入到对话历史里，会破坏后续请求的前缀稳定性**——cache miss 雪崩。

Reasonix 的解法是四轮处理。第一轮直接解析模型输出；解析失败进第二轮，本地修复 JSON 格式 / 参数 schema，不重新请求模型；本地修不了进第三轮，构造一个明确的"上轮你错在哪"的修正请求；第三轮还不行进第四轮，降级到 reasonix run 单步模式，不再走复杂多轮回路。

关键不在四轮本身，关键在**修复发生在 harness 层，不污染上下文**。模型不知道自己曾经出过 JSON 错——它看到的还是干净的对话流。前缀稳定性被保住了。

![工具调用四轮修复](03_tool_repair.png)

这个设计反过来也限制了 Reasonix 的通用性。Claude 的 tool calling 几乎不犯 JSON 错（Claude 4.5 在内部测试里 tool call schema 通过率超过 99.7%），写这么重的修复机制是过度工程。GPT-5 的 tool calling 错误模式又和 DeepSeek 不一样——重复调用更少，但参数畸形更多。Reasonix 的四轮逻辑是按 DeepSeek 的错误分布调优的，搬到 GPT-5 上是负优化。

## 默认 Flash，难任务才上 Pro：模型梯度的反向用法

第三个支柱叫 **cost control**。

DeepSeek V4 有两个版本——Pro 和 Flash。Pro 贵，深度推理强；Flash 便宜，速度快，日常代码够用。大部分通用 agent 框架的默认配置是 Pro——因为 Pro 是旗舰，跑通了用户就不会抱怨能力不够。

Reasonix 反过来：**默认 Flash，只有困难任务才切到 Pro**。

"困难"的判定不靠用户选，靠 harness 自己。Reasonix 监控几个信号：
- 同一个任务连续失败几次
- 输出长度超过某阈值
- 模型自己说"我需要更多思考"
- 上下文长度逼近 Flash 的舒适区上限

任何一条触发，自动升级到 Pro 跑一轮。这一轮跑完，再回到 Flash。

这是 harness 层对模型梯度的反向利用——**把贵模型当应急备胎，便宜模型当主力**。大部分 agent 框架做不到这件事，因为它们的设计哲学是"用户挑模型 harness 不干预"。Reasonix 反过来——用户只管说"我要写代码"，harness 自己决定每一轮用哪个版本。

附加效果：Flash 的命中率本身就比 Pro 低 5 个百分点（91% vs 96%），但因为 Reasonix 把前缀焊死了，Flash 在 Reasonix 里实测命中率也能跑到 99%+。模型梯度的差距被 harness 层抹平。

## 反通用化：这是对 Claude Code 哲学的一次定价

把上面三件事放在一起，Reasonix 真正的命题就出现了。

esengine 在 README 里写得很直接：**"Reasonix 只为 DeepSeek 打造，每一个抽象层级都基于 DeepSeek 的 feature 构建，完全不通用，也不会发布通用功能。"**这是 2026 年至今最坦白的一句 harness 哲学声明。

对照另一条路线。Claude Code 的设计哲学是"模型无关"——理论上它可以驱动任何带 tool calling 的模型，实际默认绑 Claude，但 API 抽象层为兼容 GPT-5 / Gemini / DeepSeek 都留了口子。Cursor 更彻底，下拉菜单里七八家模型随便切。aider 把模型变成 yaml 配置项。这条路线的核心假设是：模型在涨价、在被替代、在迭代，**绑死任何一家都是 vendor lock-in 风险**。

Reasonix 把这个假设直接掀了。它的潜台词是：**模型 lock-in 不是风险，是杠杆**。绑死一家，三层抽象都吃透这家的特性，你能拿到通用框架拿不到的极限——比如 99.82% 命中率。换算成钱，是 5 倍账单差。

![两条 harness 路线](04_two_philosophies.png)

这个潜台词成立有几个隐含条件。第一，被绑的那家模型本身要够好，不能踩坑——DeepSeek V4 在国产里是头部，可以绑。第二，被绑的那家在定价上有杠杆——DeepSeek 给了 cache hit 10 倍折扣，Reasonix 才能把折扣放大。第三，社区愿意为单一模型写 harness——这条在 2026 年还存疑，因为 DeepSeek 涨价或下线，整套 harness 就报废。

但这三条目前都成立。所以 Reasonix 的存在本身就是一次定价：**通用 harness 的"灵活性"溢价在缩水**。对一个固定用 DeepSeek 的团队来说，每个月多付 5 倍 API 费，换的是"以后能切到别家"——这笔保险费在 2026 年的国产生态里值不值，开始要被算账。

## 盲区：99.82% 是地板还是天花板

几条要说在前面的盲区。

第一，99.82% 是**单日单 workflow** 的实测数字。esengine 跑的是他自己的项目，codebase 稳定、任务类型集中。换一个 codebase——比如要频繁切换语言、要做大量探索性 refactor、要跨 monorepo 切换——前缀稳定性会被破坏，命中率掉到 95% 以下完全可能。99.82% 是地板还是天花板，要看你的 workflow 离 esengine 的有多远。

第二，DeepSeek 在官方文档里**明确说不保证缓存命中率**。引用原文：cache 是 best-effort basis。这意味着 DeepSeek 的后端可能因为流量、机房、模型版本切换让你的命中率波动。Reasonix 在客户端把前缀焊死，但服务端是不是配合，DeepSeek 说了算。

第三，模型专用 harness 的迁移成本没被算进 TCO。如果 DeepSeek 涨价、下线、被监管，团队从 Reasonix 切到通用 harness 的工程代价——重写工具集成、重训用户习惯、重建 prompt 库——可能远超几个月省下的 API 费。通用 harness 的灵活性是真有价值的，只是这个价值在便宜模型时代被压扁了。

第四，esengine 是个体开发者。Reasonix 的工程质量、文档完整度、长期维护承诺都是个人项目级别。企业级团队真要押注，得自己 fork 一份做内部改造。

## 对从业者意味着什么

——————————

- **PM**：本周回去看你的 AI 编码工具账单。如果团队主用 DeepSeek 但跑在 Cursor / Cline / Continue 里，命中率大概率在 30-60% 之间。算一下"如果换 Reasonix 能省多少"，再算一下"切工具的迁移成本是多少"。如果省的多，立项做迁移评估。
- **架构师**：本周读一遍 Reasonix 的 cache-first loop 实现（GitHub 公开），把"前缀焊死、append-only、tool repair 不污染上下文"这三条抽象出来，看是不是能反推到你自己用的其他 agent 框架里。这三条不是 DeepSeek 专属，是 harness 层通用的工程纪律。
- **CTO**：本周和团队复盘一次"我们是不是在为通用性付钱"。AI 工具的灵活性溢价在 2026 年正在重新定价。如果你团队 90% 的活都在一个模型上，模型专用 harness 的 ROI 已经值得算账。
- **工程师**：本周开一个 reasonix code 试试自己的项目（npx reasonix code 一行命令）。重点不是"它好不好用"，是观察 prompt_cache_hit_tokens 字段——这是 DeepSeek API 返回的真实命中率。看你自己工作流的 baseline 在哪一档。

## 本期关键词

- **harness**——LLM 模型外面那一层骨架，决定上下文怎么组织、工具怎么暴露、回路怎么跑、成本怎么控。它不训练模型也不改权重，但能让同一个模型的产出和成本差好几倍。Claude Code、Cursor、aider 都是 harness。harness 现在被认为是 AI 编码工具的真正价值层——模型在趋同，harness 在分化。

- **前缀缓存（prefix cache）**——LLM 推理时把每个 token 在 attention 里算出来的 key/value 向量按"前缀"持久化，下次同样的 token 序列直接复用 KV 不重算。触发条件是**字节级完全匹配**——不是语义匹配，是 token id 序列严格相等。DeepSeek 的命中价是未命中价的 1/10，所以命中率每往上拱一档，账单就降一档。

- **append-only loop**——agent harness 的一种设计纪律：每轮新对话只往上下文末尾追加，从不修改历史。任何编辑、删除、压缩、重排序都会让前缀缓存失效。这是用 UX 灵活性换 cache 命中率的明示选择。

- **tool call repair**——工具调用出错时，由 harness 在本地修复（修 JSON、修 schema、构造修正请求），而不是把错误日志注入上下文。目的是让模型看到的对话流始终干净，前缀稳定性不被错误污染。Reasonix 把这件事做成了独立支柱。

## 引用

1. 量子位 · 鱼羊《DeepSeek V4 还能更省！新工具缓存命中率高达 99.82%，2 折稳定到手》https://www.qbitai.com/2026/05/424552.html
2. esengine, "DeepSeek-Reasonix" GitHub 项目主页 https://github.com/esengine/DeepSeek-Reasonix（README 关键宣称："435M input tokens, 99.82% cache hit, ~$12 instead of ~$61"）
3. 量子位《DeepSeek V4 永久降价！缓存命中再打 1 折，实测编程成本骤降 83%》https://www.qbitai.com/2026/04/407850.html（V4 Pro 96% / Flash 91% 官方命中率基线）
4. DeepSeek 官方《Context Caching Guide》https://api-docs.deepseek.com/guides/kv_cache（cache prefix unit 判定逻辑、best-effort 服务等级、prompt_cache_hit_tokens 字段）
