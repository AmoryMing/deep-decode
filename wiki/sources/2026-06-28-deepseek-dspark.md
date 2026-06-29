---
title: DeepSeek 联合北大开源 DSpark——给 V4 外挂的推测解码加速框架
type: source
created: 2026-06-28
updated: 2026-06-28
tags: [DeepSeek, DSpark, 推测解码, 推理加速, 北京大学, 开源, V4, MoE, 效率优先]
---

## 核心论点

DSpark 不是新模型，是 [[DeepSeek]] 联合北京大学在 2026-06-27 发布并开源的**推理加速框架**：同一个 V4 权重不动，外挂一个推测解码（speculative decoding）模块，在同等吞吐量下把单用户生成速度提升 60%-85%（V4-Flash）/ 57%-78%（V4-Pro）。它数学上无损保留目标模型的输出分布——让 AI 回答更快、更便宜，但不让 AI 更聪明。在 DeepSeek 的战略里，DSpark 是其"效率优先、把同样的智能服务得更省"路线在推理层的延伸，并且把整套训练代码（DeepSpec 仓库）直接开源给行业。

## 关键事实（带出处）

- 2026-06-27 发布，DeepSeek 联合北京大学，MIT 协议开源（东方财富 / 新浪 / HF 卡片）。
- 完整名称：Confidence-Scheduled Speculative Decoding with Semi-Autoregressive Generation。
- 不是新模型："the same checkpoint with an additional speculative decoding module attached"（HF 卡片）。
- 推测解码原理：小草稿模型一次提议一整块 token，大模型一次前向把整块验证掉，接受最长合法前缀 + 1 个赠送 token，无损。
- 两项核心创新：①半自回归——并行主干（DFlash 改进）一次出全部位置 logits，再用轻量串行模块逐 token 注入前缀依赖，缓解并行草稿靠后位置接受率衰减；②置信度调度——置信度头估计每个 token 存活概率，硬件感知调度器按 GPU 负载动态调草稿长度（空闲多验、忙时少验），校准误差从 3-8% 降到约 1%。
- 性能：单用户提速 V4-Flash 60-85% / V4-Pro 57-78%（对比 MTP-1）；吞吐量随 SLA 收紧放大——保 80 token/s 时 +51%，保 120 token/s 时 +661%（V4-Flash）；保 35 token/s 时 +52%，保 50 token/s 时 +406%（V4-Pro）。接受长度比 Eagle3 高 26-31%、比 DFlash 高 16-18%；离线对话接受率 45.7%→95.7%，数学 76.9%→92.5%。
- 已在生产上线，配置 DSpark-5（五 token 草稿块 + Markov 头）。
- 开源 DeepSpec 仓库：DSpark / DFlash / Eagle3 三种草稿模型的训练代码、评估脚本、checkpoint + 论文。HF 上 `DeepSeek-V4-Pro-DSpark` / `DeepSeek-V4-Flash-DSpark` 两个 checkpoint。
- 底座 V4-Pro：1.6T 总参 / 49B 激活（MoE），100 万 token 上下文，FP4+FP8 混合精度。

## 金句（英文附译）

- "The AI race is no longer only about who can train the biggest or cleverest model. It is also about who can serve intelligence quickly, reliably, and cheaply at production scale." —— AI 竞赛已经不只是比谁训出最大或最聪明的模型，也是在比谁能在生产规模上把智能服务得更快、更稳、更便宜。（kingy.ai）
- "DeepSeek-V4-Pro-DSpark is not a new model. It is the same checkpoint with an additional speculative decoding module attached." —— DeepSeek-V4-Pro-DSpark 不是新模型，是同一个权重外挂了一个推测解码模块。（HF 卡片）

## 可写角度

- **主线（推荐）**：DSpark 是"算力账单"上的优化，不是"智商"上的升级。拆清楚推测解码到底省的是什么钱，再点明它在 DeepSeek 战略里的位置——延续 V3/R1 以来"用工程效率换性价比"的打法，而且这次连优化方法本身都开源了。
- 数字陷阱角度：406%/661% 这种标题数字只在严苛 SLA 下成立，正常负载是 51%-52%。教读者怎么读吞吐量报告。
- 开源即护城河角度：把推理加速这种本可当私有优势的基础设施开源，对行业（尤其国产替代）的意义。

## 信源

1. [DeepSeek-V4-Pro-DSpark · Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-DSpark) — 一手（官方模型卡片）
2. [DeepSpec GitHub](https://github.com/deepseek-ai/DeepSpec) — 一手（官方开源仓库）
3. [DeepSeek Releases DSpark... — MarkTechPost](https://www.marktechpost.com/2026/06/27/deepseek-releases-dspark-a-speculative-decoding-framework-that-accelerates-deepseek-v4-per-user-generation-60-85-over-mtp-1/) — 二手（详尽技术解读）
4. [北大与 DeepSeek 联合开源 DSpark — 东方财富](https://finance.eastmoney.com/a/202606273785453140.html) — 二手（中文财经，含北大与吞吐数字）
5. [DeepSeek 发布 DSpark — 新浪](https://www.sina.cn/news/detail/5314463070685867.html) — 二手（含 token/s SLA 数字）
6. [DeepSeek DSpark Explained — kingy.ai](https://kingy.ai/blog/deepseek-dspark-speculative-decoding/) — 二手（战略角度）
