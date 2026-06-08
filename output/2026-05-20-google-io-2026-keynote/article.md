---
title: Google I/O 2026：1800 亿 capex 把 frontier 模型的价格腰斩
author: Google / Sundar Pichai
date: 2026-05-20
type: decode
slug: 2026-05-20-google-io-2026-keynote
source:
  - https://blog.google/innovation-and-ai/sundar-pichai-io-2026/
  - https://www.pcmag.com/news/google-io-2026-live-everything-announced-gemini-omni-search-android-xr
tags: [Google, GoogleIO, Gemini, TPU, AgentPlatform, AndroidXR]
---

# Google I/O 2026：1800 亿 capex 把 frontier 模型的价格腰斩

![Google I/O 2026 关键发布](cover.png)

把这场两小时的 Keynote 缩成两个数字：年度资本开支从 2022 年的 310 亿美元跳到 2026 年的 1800-1900 亿美元，Gemini 模型月处理 token 同比七倍，到 3.2 千万亿。前者是底层基建的押注规模，后者是这些基建已经开始变现的证据。Pichai 在台上说了一晚上模型名，真正的发布会主线藏在这两个数字里。

Google 这次不是回应 OpenAI，是把整个 AI 行业的成本结构改写——并且把这件事做得比 Anthropic、OpenAI 都早一步。

## Omni Flash 没去打 API，先上了 YouTube Shorts

Gemini Omni Flash 是这次发布的"新旗舰多模态生成模型"。Pichai 的原话是 "combines Gemini's intelligence with our generative media models — a huge leap forward in world understanding"（把 Gemini 的智能和我们的生成式媒体模型合在一起，在世界理解上前进一大步）。

但比技术描述更重要的是发布次序：**Omni 先上 Gemini app、Google Flow 和 YouTube Shorts，API 接入要等几周后**。

这个顺序值得拆开看。OpenAI 自 GPT-4o 开始的打法是 API 先行——模型先发，让开发者把它包成产品，自家入口靠后。Google 反过来：把多模态生成第一时间塞进 YouTube Shorts 和自家 AI 入口。

这意味着 Google 不把多模态当开发者产品，而是当流量产品。YouTube Shorts 每月活跃用户超过 25 亿，把 Omni 嵌进去，等于给十亿级用户一个零门槛的"生成式短视频"工具。开发者拿到 API 时，YouTube Shorts 已经吃完了头一波数据飞轮。

**渠道优先于 API**，这是 Google 这次最被低估的战术选择。Sora 2 进 ChatGPT 用了三个月，Omni 进 YouTube 是同一天。前者是模型公司向消费者扩散，后者是平台公司向模型变现。

![Omni 的渠道优先打法 vs OpenAI API-first](01_omni_channel_first.png)

## 3.5 Flash 的"价格腰斩"是 TPU 的折现

Gemini 3.5 Flash 被 Pichai 描述成 "frontier intelligence with action"（具备行动能力的前沿智能），"four times faster than other frontier models" in output speed（输出速度是其他前沿模型的四倍），并且 "less than half the price of comparable frontier models"（价格不到同档模型的一半）。

官方给的换算很直白：如果一家企业把 80% 的 workload 切到 3.5 Flash 上，一年能省 10 亿美元以上。

"四倍速""一半价"这种话过去 OpenAI 也说过。区别在于，OpenAI 的成本曲线被 NVIDIA H100/B200 的定价权卡住——它降价的空间最终回到 Jensen Huang 那里。Google 不一样，它有 TPU。

**3.5 Flash 的价格腰斩，本质是 TPU 自研的折现。**

这次 I/O 同时发布 TPU 8t（训练专用）和 TPU 8i（推理专用），Pichai 说算力是上一代的 "nearly three times"（近三倍），能效更好。把训练和推理拆成两颗芯片，是承认推理 workload 的特征和训练完全不同——推理要的是低延迟、高吞吐、单位 token 价格低，训练要的是大显存、高带宽、稳定性。

这事别家做不了。Anthropic 主要用 Google TPU + Amazon Trainium，模型架构必须跟着芯片走。OpenAI 主要用 NVIDIA + 一点点 Azure 自研，定价天花板就是 NVIDIA 的毛利。Google 是这个三角里唯一同时控制模型、芯片、超算集群、数据中心的玩家。capex 砸到 1800 亿，是为了让"模型价格"从今往后变成"基建价格"。

这才是 3.5 Flash 真正的杀招。它不是一款"便宜的好模型"，是 Google 在告诉企业 CTO：把推理 workload 都搬过来，我给你的成本曲线和别家不在一个量级。

![推理价折现：TPU 把 NVIDIA 毛利让给客户](02_tpu_pricing.png)

## Gemini Spark 把代理从聊天框搬到后台

Gemini Spark 是这次发布里最值得 PM 拆解的一件事。

官方定义是"24/7 个人 AI 代理，跑在 Google Cloud 的专属虚拟机上"。本周给 trusted testers，下周给 Google AI Ultra 订阅者 Beta。和它一起发布的是 Android 新的 Halo UI——一个让用户实时看到 Spark 在干什么的系统级界面。

把这两件事放一起，结论比单独看任何一个都清楚：**Google 在赌 Agent 的入口不是聊天框，是后台进程**。

聊天框是 ChatGPT 范式：用户提问，模型回答，会话结束。这个范式有一个致命缺陷——用户必须在前台等。Spark 反过来，它跑在 Google Cloud 的 VM 上，用户睡觉的时候也在工作；Halo UI 让任务变成像下载进度条一样的可见对象，用户随时能看一眼。

**后台代理**这个范式不是 Google 原创——OpenAI 的 Codex Agent、Anthropic 的 Computer Use 都在试。但 Google 是第一个把它做成手机系统级 UI 的。聊天框停在 App 里，后台代理嵌进通知栏、嵌进锁屏、嵌进 Always-on Display。这是分发权的差异。

代价是隐私和成本。Spark 跑在专属 VM 上意味着 Google 要给每个 Ultra 订阅者分配 24/7 在线的算力，单用户成本结构和过去的"按 token 收费"完全不同。Pichai 没说每月运营成本，也没说怎么避免代理在用户不知情时执行危险操作。这是发布会上刻意没碰的两条线。

![Spark + Halo UI：Agent 从聊天框搬到后台进程](03_spark_background_agent.png)

## AI Mode 一年 10 亿 MAU，但搜索的护城河在掉血

这次 I/O 的另一个被 Google 反复重复的数字是：AI Mode 上线一年突破 10 亿月活。配套发布的还有 Ask YouTube（夏季上线，秒级定位视频片段）、Information Agents（夏季给 Pro/Ultra 订阅者）、Generative UI（搜索结果动态布局）。

数字漂亮，但需要放进 Google 整体搜索流量来看才知道含义。AI Mode 的 10 亿 MAU，是从一个本来就 30+ 亿 MAU 的 Google Search 里切出来的。也就是说，**三个 Google 用户里一个已经开始用 AI 而不是十个蓝链接**。

这个迁移速度比 Google 自己预想的快。一年前的 I/O 上 Pichai 还在小心翼翼推 AI Overviews，今年直接把 "AI Mode" 当成默认形态。Generative UI 把"搜索结果页"从静态网页变成"模型现场组装的界面"，更是把传统 SEO 的根基拔掉。

对依赖 Google 搜索流量的内容方而言：**蓝链接时代用十年沉淀的 SEO 资产，在 Generative UI 下不一定继续兑现**。这事在 I/O 上没人提，但 28 亿独立网站都得自己算账。

![AI Mode 抢走 1/3 搜索用户](04_ai_mode_search_share.png)

## TPU 8t / 8i 把训练推理分家

TPU 8t 和 TPU 8i 同时发布，名字里的 t/i 是 training/inference 的缩写。把训练和推理切成两套芯片，行业里 NVIDIA 也在做（H100 vs L40S，B200 vs B40），但谁都没像 Google 这样把"训推分家"做成发布会主线。

为什么这事重要？因为推理已经吃掉了大多数算力 workload。OpenAI 2025 年的成本结构里推理占 60% 以上，Anthropic Claude 4.5 上线后这个比例更高。训练是一次性投入，推理是 24/7 的边际成本——前者决定模型有多强，后者决定平台能不能赚钱。

**训推分家**的本质是承认：推理时代的芯片设计目标和训练时代不同。训练要堆 HBM、堆 NVLink、堆 fp8 吞吐；推理要压 KV cache、压延迟、压单 token 功耗。一颗芯片同时优化两者，必然两边都不够极致。

Google 这次直接把两条产品线拆开。下一代模型在 8t 上训练，部署的时候搬到 8i 上跑。这条工程路径意味着：未来三年内，Google Cloud 上的 Gemini 推理价格会和 NVIDIA 系平台逐步分化。客户做平台选型时，要把"两条芯片曲线"分别评估，不能再用一个综合算力指标。

![TPU 8t / 8i：训推分家的硬件优化目标对比](05_tpu_train_inference_split.png)

## 智能眼镜和 Gemini for Science：两条没怎么被注意的线

发布会末尾还塞了两条短消息。

第一条：智能眼镜（音频版 + 显示版）2026 秋季上线。这是 Google 在 Glass 折戟十年后第二次进入这条赛道。Meta 的 Ray-Ban 显示眼镜 2025 出货百万级，Google 这次能不能撕开市场，要看显示眼镜在续航和视野上能不能给出实质性差异。Pichai 在台上没给具体规格，这一段是为了对冲 Meta 在 XR 上的领先。

第二条：Gemini for Science 整合 30+ 生命科学数据库。这条几乎没被科技媒体重点报，但放进 AlphaFold → Isomorphic Labs 这条 Google 在生命科学的纵线上看，它是把 DeepMind 的能力从"模型"扩成"数据底座"。前者是发论文用，后者是给制药企业卖服务。

## 盲区：Pichai 没说的几件事

每次 I/O 都有刻意没碰的角落。

第一，Omni 和 Sora 2 / Veo 3 在视频生成的实际质量差距。发布会上放的 demo 都是 Google 内部精选案例，没有横评。Sora 2 的物理一致性、连贯运动、长镜头能力，Veo 3 实测仍有差距，Omni 是否补齐这一段，要等独立测评。

第二，Gemini 3.5 Flash 在 agent harness 实测里 vs Claude 4.7 / GPT-5 的对比。"四倍速""一半价"是 API 性能数字，agent 工程的真实指标是 SWE-bench Verified、tau-bench、长 horizon 任务完成率。这些数字 Google 在 keynote 上没给。

第三，Gemini Spark 的运营成本和滥用防护。24/7 跑在 VM 上的代理，如果被用来爬竞品价格、批量注册账号、自动发垃圾邮件，Google 怎么管？官方只字未提。

第四，Information Agents 收的是 Pro/Ultra 月费，但 Ultra 一直没有公开价格。如果定到 $200/月对标 ChatGPT Pro，对普通用户是天花板；如果只对企业，那它的 24/7 代理设计就和定价错位。

第五，AI Mode 抢走 10 亿 Google Search 月活以后，广告变现模型怎么变。Generative UI 取消了"十个蓝链接"这个广告位形态，Google 广告业务（2025 年 2800+ 亿美元营收）的根本依据是否被自家产品蚕食，财报上还看不到。

## 对从业者意味着什么

**对企业 AI 平台负责人**：把 Gemini 3.5 Flash 列进推理 workload 的候选池，但不要光看价格。跑一遍自家 agent harness，看实际 tool-use 准确率和长 horizon 完成率是否扛得住 Claude Sonnet 4.5 / GPT-5 这两条基线。如果只是 RAG / 总结 / 翻译这类 workload，3.5 Flash 的"半价"几乎确定值得切。

**对 CTO**：下一轮基建评估，把"芯片成本曲线"作为独立维度。NVIDIA 系平台（AWS / Azure / CoreWeave）和 TPU 系平台（Google Cloud）会在 12-24 个月内出现明显推理价差。这不是云厂商打折，是底层成本结构分化。

**对产品 PM**：如果你的产品里有"AI 助手"功能，Spark + Halo UI 范式值得做一次产品对照。聊天框不是 Agent 的天然形态——任务监控、后台执行、通知栏触达，可能更贴合用户日常。

**对内容 / SEO 负责人**：Generative UI 把"十个蓝链接"拆掉了。原本依赖 SERP 流量的内容资产要重新评估——什么样的内容会被模型在 Generative UI 里"组装"而保留品牌可见性，什么样的内容会被吸进 AI Mode 的回答里只剩一行引用。

**对模型层创业者**：Google 用 capex 1800 亿告诉行业，模型公司未来要不要自研芯片不是选择题，是生存题。如果你只做 API 转售或者纯应用层，下一波"半价 frontier 模型"出现时，毛利会被压到不能看。

![Capex 5 年 6 倍：从财务科目到护城河深度](06_capex_curve.png)

## 本期关键词

**推理价折现** —— 指模型公司用自研芯片把 NVIDIA 的定价权从模型边际成本里剔除掉，把"省下的硬件毛利"折现给客户。Gemini 3.5 Flash 的"一半价"不是营销让利，是 TPU 8i 的成本结构反映。

**渠道优先模型** —— 多模态生成模型不再 API-first，先上自家流量入口（YouTube Shorts、Google Flow、Gemini app）。它把多模态当流量产品而非开发者产品。OpenAI 的 GPT-4o 是 API-first 反例，Omni 是渠道优先典型。

**后台代理** —— 把 Agent 从聊天框搬到操作系统的后台进程层，跑在云端 VM 上，用进度条式 UI 让用户监控任务而不是等回答。Spark + Android Halo UI 是第一个系统级落地。区别于 ChatGPT 范式的"用户在前台等"。

**训推分家** —— 训练芯片和推理芯片拆成两条产品线，承认两类 workload 的硬件优化目标不同。Google TPU 8t（训练）+ 8i（推理）是这次的正式落地。下游含义是云厂商的推理价格会和训练价格脱钩。

**算力 capex 拐点** —— 模型公司年度资本开支从"硬件采购"变成"战略护城河"。Google 2022 年 capex 310 亿，2026 年 1800-1900 亿，5 年 6 倍。capex 不再是财务科目，是定义市场结构的护城河深度。

**Generative UI** —— 搜索结果页从静态网页变成模型现场组装的动态界面。蓝链接 + 描述这个组合被替换成模型按用户意图生成的交互元素。对 SEO 而言是十年来最深的根基冲击。

## 引用

1. Sundar Pichai, "Highlights from Google I/O 2026", Google Blog, 2026-05-20, <https://blog.google/innovation-and-ai/sundar-pichai-io-2026/>
2. "Google I/O 2026 Live: Everything Announced — Gemini Omni, Search, Android XR", PCMag, 2026-05-20, <https://www.pcmag.com/news/google-io-2026-live-everything-announced-gemini-omni-search-android-xr>
3. Google Q1 2026 Earnings Call, capex guidance $180-190B, 2026-04
4. The Information, "Google's TPU roadmap and Anthropic's compute dependency", 2026-03
5. YouTube Shorts MAU disclosure, Q4 2025 letter to shareholders
