---
title: SaaS-Bench — Computer-Use Agent 真实办公任务评测（UniPat AI, 2026-05）
type: source
created: 2026-05-27
updated: 2026-05-27
tags: [saas-bench, computer-use, unipat, benchmark, agent-eval, anthropic]
related:
  - [[../concepts/saas-bench]]
  - [[../concepts/unipat-ai]]
  - [[../concepts/computer-use]]
---

# SaaS-Bench：把 23 套真实 SaaS 装进 Docker，让 agent 干活

## 主要论点

1. **3.8% 不是个噪声数字，是天花板。** Claude Opus 4.7 在 106 道真实办公任务里完整做完 4 道，是榜首。GPT-5.5 High、Kimi K2.6、Gemini 3.1 Pro 都在 2% 以下，Gemini 和 Kimi K2.5 是 0%。
2. **checkpoint 43.9% vs end-to-end 3.8% 的 11 倍落差是核心信号。** agent 能把"片段步骤"做对，但接不起来一整条工作流。Long-Horizon Fragility（长程脆性）是论文给的正式命名。
3. **任务设计是 evals 行业的一次升级。** 不是 prompt 答题，是把 BigCapital、ERPNext、OpenEMR、Mattermost 这些真 SaaS 部署在 Docker 里，让 agent 在前端 UI + 后端数据库 + 业务约束里走流程。93.4% 任务跨 2 个以上应用，97.3% 文本任务超 100 步。
4. **失败模式四件套：长程脆性 / 错误级联 / 验证盲 / 执行方差。** 三件套是工程问题，"验证盲"是 agent 自身能力问题——agent 不会回去 recheck 自己刚做的事。
5. **这是对"AI 替代白领"叙事的一次具体打击。** 不是模糊的"AI 还不行"，是一个具体的 3.8% + 一份具体的 106 任务清单。

## 金句

- "Agents can start work, but rarely finish it."（agent 能开始干活，但很少能干完。）— UniPat AI 官方
- "Even the strongest model resolves fewer than 4% of tasks end-to-end."— 论文 abstract
- 96.2% 的真实办公任务，Claude 干不完 — 我的中文翻译版

## 角度

- 角度 A（首选）：**3.8% 这个数字的含义** — checkpoint vs end-to-end 11 倍落差是 evals 行业的新坐标系
- 角度 B：**Computer-Use 神话 vs SaaS-Bench 现实** — 2024 年 10 月 Anthropic 演 demo 时声音很大，两年过去基准里揭出的天花板
- 角度 C：**评测方法学** — Docker + 真 SaaS + 三种验证（State / Content / LLM-Judge）= 不再能靠刷题混分
- 角度 D：**对 AI 替代白领叙事的打击** — 实习生日常能做的事，最强 Claude 做完 4/106

## 一手 URL

- 量子位中文报道：https://www.qbitai.com/2026/05/424277.html
- UniPat AI 官方页：https://unipat.ai/benchmarks/SaaS-Bench
- arxiv 论文：https://arxiv.org/html/2605.15777v1
- GitHub Repo：https://github.com/UniPat-AI/SaaS-Bench
- 36kr 英文版：https://eu.36kr.com/en/p/3824057526259840
