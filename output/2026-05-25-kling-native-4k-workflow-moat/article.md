---
title: 视频模型的"工作流之战"——Kling 用 Native 4K 抢的是 Sora 留下的位置
source: https://x.com/Kling_ai/status/2058013861404684739
author: Kling AI（快手）
date: 2026-05-22
type: decode
---

![封面](assets/png/00_cover.png)

2026 年 4 月 26 日，Sora 关停。23 天前，Kling 上线了全球首个原生 4K 视频生成。13 天后（5 月 12 日），Kuaishou 在港交所披露正在评估把 Kling 拆出来独立融资，外部估值传闻 200 亿美元。

把这三件事按时间轴摆开看，Kling 在这条推文里推 Native 4K 不是单纯的版本更新，是一次主动卡位——抢在赛道头部塌掉那一刻，把自己的工作流故事讲清楚。

## 这条推文背后是什么

@Kling_ai 这条推文延续的是 Kling 自 4 月下旬开始的统一动作：把 Kling 3.0 系列的三大杀器——**Native 4K、3.0 Omni（角色与音色一致性）、多镜头分镜（Multi-shot Storyboard）**——按周节奏推到海外用户面前。

Kling 3.0 系列的全球发布日是 2026-02-05。彼时官方稿强调视频时长扩展到 15 秒、原生音视频同步、多镜头分镜统一在一个模型里。4 月 23 日 Native 4K 单独上线，官方原话是"the world's first native 4K video generation"——关键词是 **native**。

业内有一堆"4K 视频生成"标签，但绝大多数实现是 1080p 出图后用算法 upscale。Kling 3.0 直接在 3840×2160 分辨率上扩散生成，每一帧的细节、纹理、光线生成时就存在，不是后处理重建。CineD、Magnific 的测试都印证了这个差别——4K 屏上看纹理、皮肤、织物的边缘锐度，原生和升采样不是一档东西。

但 native 4K 只是表层。真正值得拆的是 Kling 在功能矩阵上的取舍。

## 不是单点 SOTA，是综合分

Cliprise 在 Medium 做过一组"500 视频 6 模型"对标测试，2026 年 2 月数据。最终加权分：

| 模型 | 视觉 | 动作 | 提示词 | 音频 | 制作就绪 | 综合 |
|---|---|---|---|---|---|---|
| Kling 3.0 | 8.4 | 8.1 | 8.6 | 7.8 | 8.5 | **8.3** |
| Sora 2 Pro | 8.0 | 8.5 | 8.2 | 7.5 | 7.8 | 8.0 |
| Veo 3.1 | 9.1 | 7.6 | 7.8 | 7.4 | 7.9 | 8.0 |
| Seedance 1.5 | 7.6 | 7.4 | 7.9 | 9.0 | 7.5 | 7.9 |
| Runway Gen-4 | 7.5 | 7.8 | 7.6 | N/A | 7.2 | 7.5 |

Veo 3.1 photoreal 一项 9.1 第一；Sora 2 Pro 叙事和镜头运动更稳；Seedance 在音频上 9.0 碾压。**Kling 没赢任何一项单点**，但综合分第一。

这个综合分背后是工作流。photoreal 第一的模型不一定能拼出连贯的多镜头剧本；动作第一的模型可能音轨需要补；音频第一的不一定有 4K。专业制作里，每补一刀就是一段流程、一个工具、一份外包预算。Kling 3.0 Omni 把这些刀都收进了一个模型——脚本进、4K 带音视频带角色一致性的多镜头序列出，中间不切工具。

Magnific CTO Omar Pera 的原话："With native 4K, your workflows go from idea to campaign-ready video in fewer steps."（有了原生 4K，从想法到可投放视频，中间环节更少。）

视频生成行业有一个少被点破的事实——**单点跑分赢一次只能上一次 X，工作流赢能上 invoice**。Kling 选了后者。

![三模型路线对比](assets/png/01_three_routes.png)

## Sora 留下的位置

Kling 这一刀切对了的另一个证据是 Sora。

2026-03-24 OpenAI 通知员工 Sora 关停。4-26 web/app 下线，9-24 API 下线。NYT、TechCrunch、BBC 的复盘几乎口径一致：Sora 关停不是技术失败，是经济失败。

Yahoo Finance 和 cosmo-edge 引用的内部数字：**每天烧 $15M 推理成本，全生命周期收入 $2.1M**。3 月份签下的迪士尼 $1B 内容授权同步取消。用户从峰值 100 万跌到 50 万以内。Sam Altman 给的官方理由是"focus on agentic AI and robotics"，但被砍的项目背后是更直白的算术——做电影的 GPU 不如做 Codex 的 GPU 赚钱。

Kling 同一时间窗口的成绩单：2025 年全年收入 10.4 亿 RMB（约 $150M），2025 年 12 月单月超 $20M，2026 年 1 月 ARR 突破 $300M。Sacra 2026-05-19 的估算是 ARR 已经到 $500M，2026 上半年还在翻倍。60M 全球用户、600M 累计视频、30K 企业客户。

同样是"视频模型"，一个一年烧 $5B 关张，一个一年回血 $500M 估值 $20B。**差的是产品哲学，更是分发渠道**。

OpenAI 把 Sora 当成 ChatGPT 之外的"另一个 app"卖给消费者，订阅 + 生成扣费。Kling 把视频生成嵌进短剧产业链——根据中国网络视听协会数据，2026 Q1 上线的 12.8 万部微短剧里，**95% 用 AI 辅助生成**。Kling 让一部短剧的制作成本从几十万降到 10 万左右，快手自家的内容生态直接消化。

这是 Sora 没有的东西：**一个对生成视频有刚需、有付费意愿、有海量评测信号反馈给模型的封闭回路**。

![Kling 的封闭回路](assets/png/02_closed_loop.png)

## 真正的壁垒在哪

Kling 的壁垒不是 4K，不是 Omni，甚至不是 8.3 综合分。是一组别人买不到的东西。

**Kuaishou 内部商业回路**。快手 2025 年广告主每天在 AI 生成创意素材上花费超过 RMB 30M，Kling 既是供应方又是反馈源。一个广告主点了"重新生成"的次数、最终选用的版本、转化率高的特征——这些数据 OpenAI 拿不到，Runway 拿不到。Veo 能拿到一部分（YouTube），但 Google 没有短剧产业链。

**Kuaishou 2026 年 RMB 260 亿（约 $3.76B）capex**。比 2025 年多出 RMB 110 亿，其中相当部分专门给 Kling 训练和推理。这是一个上市公司用现金流而不是融资在押注。

**跨业务嵌入**。Kling 2025 年底升格为 Kuaishou"主要业务单元"，直接接入快手电商、广告、短剧三大主营。这意味着 Kling 的客户结构会持续向 B 端倾斜——B 端 ARPU 远高于 C 端订阅。

## 盲区与没说出口的

**估值算术存疑**。$20B 按 ARR $500M 计算约 40 倍 P/S，比 OpenAI 当前估值倍数还激进。Sacra 自己注明 ARR 是估算，未经审计。Kuaishou 港交所公告措辞是"评估提议、尚无确定协议"。

**训练数据黑盒**。Kuaishou 短视频内容池是 Kling 的天然数据源，但具体多少进了训练集、有没有第三方授权、出海版本是否过滤——官方没披露。Sora 倒下时的一个伤口就是训练数据。

**单点能力天花板**。Veo 3.1 的 photoreal 9.1 仍然是 Kling 的差距点。如果未来视频生成竞争从"工作流"再退回到"单帧质量"或"长镜头物理一致性"这种硬指标，Kling 综合分的优势会被打散。

## 对从业者意味着什么

**营销 / 电商 PM**：本周拆一遍上季度视频素材外包账单，把"拍摄 + 剪辑 + 调色 + 配音"按工时和成本拉表。Kling 3.0 Omni 的多镜头 + 原生音视频 + 4K 直出，目标是把这串从 5 个工具压到 1 个。算账：每月 30 条投流视频，Kling Pro $0.112/s × 20s × 30 = $67/月。

**短剧 / 内容工作室主理人**：本周做一次 A/B——同一剧本，一组用 Kling 3.0 Std（$0.084/s），一组用 Runway Gen-4 Turbo + 外部音频补齐。比 30 个镜头连起来后角色脸是否还是同一张、配音是否还卡得上口型。

**架构师 / CTO**：本周评估 API 选型。Kling 3.0 在 fal.ai 上的价格约是 Sora 2 的 1/3、Veo 3.1 的 1/10。中国客户优先 Kling，欧美客户可能要双供应商架构。

**投资者 / 战略**：Sora 关停不是"AI 视频不行"，是"独立 AI 视频公司不行"。视频模型要活下去，要么长在内容平台里（Kling 路径），要么长在专业工具链里（Runway 路径）。中间地带要被洗。

![四角竞争格局](assets/png/03_four_corners.png)

## 本期关键词

**Native 4K** -- 不是后期 upscale 出来的伪 4K。Kling 3.0 在 3840×2160 分辨率上直接扩散生成，每帧纹理、皮肤、织物细节在生成时就存在，不依赖算法重建。意义是从"AI 视频"过渡到"可直接交付到院线和大屏"的视频。

**Kling 3.0 Omni** -- Kling 3.0 系列里的高阶模型。核心能力是从 3-8 秒参考视频里提取角色形象、音色、动作特征，在新场景里还原。配合多镜头分镜界面，用户可以一次定义最多六个镜头的时长、机位、运镜、台词，模型保持角色和场景一致。

**Multi-shot Storyboard（多镜头分镜）** -- 把"一次生成一个镜头然后剪起来祈祷连贯"变成"一次生成一组镜头自带连贯"。这是从"视频生成器"到"轻量制作流水线"的核心架构变化。Sora 2 在做类似事，Veo 还没有。

**工作流壁垒** -- 在 AI 视频赛道，单点跑分赢一次只能上一次 X，工作流赢能上 invoice。Kling 综合分第一但单项没赢任何一项，恰恰说明它的赢点不是模型本身，是模型背后的功能聚合与生态嵌入。

**封闭反馈回路** -- 模型公司能拿到的"用户实际怎么用、改了几次、最终选哪个"的数据。OpenAI 把 Sora 做成独立 app，没回路；Kling 嵌在快手广告、短剧、电商流水线里，每条素材的转化率都是训练信号。

**推理经济学** -- Sora 关停的根本原因。$15M/天推理成本对 $2.1M lifetime 收入，差三个数量级。视频生成对算力的需求比文本生成高两个数量级，定价又不能高到普通用户付得起。出路是嵌入有付费意愿的 B 端工作流（Kling 路径），或者放弃独立卖（Sora 路径）。

## 引用

1. [Kling AI 官方推特账号](https://x.com/Kling_ai) -- @Kling_ai 主页明确 4 月 23 日上线 native 4K
2. [Kling AI Launches 3.0 Model](https://www.prnewswire.com/news-releases/kling-ai-launches-3-0-model-ushering-in-an-era-where-everyone-can-be-a-director-302679944.html) -- 2026-02-05 PRNewswire 全球发布稿
3. [Kuaishou Ramps Up AI Commercialization](https://www.caixinglobal.com/2026-03-25/kuaishou-ramps-up-ai-commercialization-as-kling-revenue-hits-150-million-102427380.html) -- 财新全球 Kuaishou 2025 年报
4. [Kuaishou Weighs Kling AI Spinoff at $20B](https://www.implicator.ai/kuaishou-weighs-kling-ai-spinoff-at-20-billion-valuation/) -- 港交所公告 2026-05-12
5. [Kling revenue, funding & news | Sacra](https://sacra.com/c/kling/) -- ARR $500M 估算
6. [I Generated 500 Videos Across 6 AI Models](https://medium.com/@cliprise/i-generated-500-videos-across-6-ai-models-the-definitive-quality-speed-and-cost-comparison-43fb271e509c) -- Cliprise Medium 测评
7. [Kling 3.0: The first AI video model with native 4K output](https://www.magnific.com/blog/kling-3-0-the-first-ai-video-model-with-native-4k-output/) -- Magnific 技术拆解
8. [Why OpenAI Killed Sora: The $15 Million Per Day Disaster](https://miraflow.ai/blog/why-openai-shut-down-sora-2026) -- Sora 关停经济账
9. [Kuaishou Boosts AI Short Dramas as Kling AI ARR Hits $100M](https://www.newsglobenow.com/new362644.html) -- Q1 2026 微短剧 95% AI 生成
10. [Kling 3.0 Review on Atlas Cloud](https://www.atlascloud.ai/blog/guides/kling-3.0-review-features-pricing-ai-alternatives) -- 价格对比
