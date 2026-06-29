---
title: 美团 LongCat 开源 VitaBench 2.0——长期动态智能体评测基准
type: source
created: 2026-06-28
updated: 2026-06-28
tags: [agent, benchmark, 美团, LongCat, 长期记忆, 个性化, 主动性, 评测]
---

## 核心论点

VitaBench 2.0 把 agent 评测从「一次性任务能不能做完」推进到「跨天、跨会话能不能持续理解并主动服务同一个人」。它是首个把「长期记忆 + 真实工具执行 + 偏好漂移 + 主动性」四件事合在一个基准里的评测集，用 56 个虚拟用户、平均 1580 天交互跨度量化「长期个性化」这件难以衡量的能力。结论很硬：连最强模型在「全上下文」这种作弊式上界设置下也只到约 50% Avg@4，换成真实记忆机制（agent 自管档案 / RAG 检索）还要掉。工具调用早已不是瓶颈，记住一个人、并在信息不足时主动问，才是。

## 关键事实（带出处）

- 发布：美团 LongCat 团队联合新加坡国立大学、中国科学技术大学、北京邮电大学、浙江大学，2026 年 6 月上旬开源（腾讯新闻系 6 月 9 日）。MIT 协议，代码与数据集均在 GitHub/HuggingFace `meituan-longcat/VitaBench-2.0`。
- 规模：56 个虚拟用户、819 个任务、2000+ 随时间演变的动态偏好、66 个可执行工具、平均交互跨度 1580 天；平均每用户 48 次以上偏好动态调整；约 20% 交互掺入「噪音」（无关信息/探索/代理行为）。（GitHub README 另写 771 subtasks，口径有差异。）
- 三大业务域：外卖配送、到店消费、在线旅游（OTA），与 1.0 同源（都是美团自家高频生活服务场景）。
- 三个个性化维度：偏好抽取（从碎片化交互里推断隐式偏好）、偏好运用（把偏好用进决策）、偏好更新（偏好随行为演变时跟着改）。外加一个主动性维度：信息不足时主动追问/探索，而不是盲目决策。
- 三种记忆设置对照：Full Context（全历史塞进 prompt，上界）/ Agentic Memory（agent 自主维护结构化档案）/ RAG Memory（历史切片向量检索）。
- 指标：Avg@4 / Pass@4 / Pass^4，4 次独立运行、temperature 0.0。
- SOTA：最强 thinking 模型 Claude-Opus-4.6 在 Full Context 下 Avg@4=0.503；最强 non-thinking DeepSeek-V4-Pro=0.456。论文原话：即使全上下文，SOTA 也只约 0.5 Avg@4、约 0.3 Pass^4。
- 关键失败模式：主动性任务得分 27-28%，远低于个性化任务 44-50%；开 thinking 模式不一定更好；即便把真值偏好直接喂给模型，成绩仍卡在约 50%。
- 对比 1.0：VitaBench(1.0) 入选 ICLR 2026，66 工具、100 跨场景 + 300 单场景任务，最强模型跨场景成功率仅约 30%（32.5%），考的是单次复杂任务的工具编排；2.0 把考核轴换成了「长期 × 个性化 × 主动」。
- LongCat 背景：美团自研大模型/团队（王兴 2025-03 已确认内部模型名 LongCat）；LongCat-Flash 是 560B 总参/约 27B 激活的 MoE（Shortcut-connected MoE + 零计算专家），2025-09 开源。

## 金句（英文附译）

- "Even under the Full Context setting where full interaction history is accessible, state-of-the-art models achieve only Avg@4 of around 0.5 and Pass^4 of around 0.3." —— 即使能拿到全部历史，最强模型 Avg@4 也只约 0.5、Pass^4 约 0.3。
- "Even with ground-truth preferences provided, performance plateaus around 50%." —— 就算把正确偏好直接喂进去，成绩也卡在 50% 左右。
- 中文一手转述："随着工具调用错误率显著降低，捕捉并应用用户偏好已成为限制智能体落地的核心瓶颈。"

## 可写角度

1. （主）为什么「长期动态」是 agent 基准的下一个战场——区别于 τ-bench / WebArena 那类单次任务，长期基准考的是记忆架构 + 主动性策略，而这正是产品化 agent 真正会拉开差距的地方。
2. 「全上下文 50%、上界都这么低」这个数字本身的冲击：不是模型记不住，是给了它全部信息也用不好。
3. 三种记忆设置的对照实验价值：现成脚手架，做 agent 的人可直接拿来压测自己的记忆方案。
4. 美团为什么做这个：自家生活服务场景天然是长期、个性化、多会话的；做基准既是技术话语权也是给自家 agent 立标尺。

## 信源

1. [VitaBench 2.0 arXiv 论文 (2605.27141)](https://arxiv.org/html/2605.27141v1) — 一手
2. [GitHub: meituan-longcat/VitaBench-2.0](https://github.com/meituan-longcat/VitaBench-2.0) — 一手
3. [VitaBench (1.0) 项目主页](https://vitabench.github.io/) — 一手（对比基线）
4. [VitaBench 1.0 arXiv (2509.26490)](https://arxiv.org/abs/2509.26490) — 一手（对比基线）
5. [腾讯新闻：美团发布智能体新基准 VitaBench](https://news.qq.com/rain/a/20260609A088BW00) — 二手
6. [OpenI：VitaBench 2.0 技术解读](https://openi.cn/318627.html) — 二手
7. [格隆汇快讯：美团 LongCat 开源 VitaBench 2.0](https://www.gelonghui.com/live/2521822) — 二手
8. [量子位：美团首个开源大模型 LongCat](https://www.qbitai.com/2025/09/327751.html) — 二手（LongCat 背景）
