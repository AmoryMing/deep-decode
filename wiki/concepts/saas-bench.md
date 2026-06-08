---
title: SaaS-Bench
type: concept
created: 2026-05-27
updated: 2026-05-27
tags: [benchmark, agent-eval, computer-use, unipat]
---

# SaaS-Bench

UniPat AI 2026 年 5 月发布的 computer-use agent 评测基准。把 23 套真实开源 SaaS 系统部署在 Docker 里，让 agent 在真前端 UI + 真数据库 + 真业务约束下做端到端工作流。

## 关键数字

- **106 任务** × **3,971 checkpoint** × **6 职业领域**
- 93.4% 任务跨 2+ 应用，三应用任务占一半（53 道）
- 74 道纯文本 + 32 道多模态
- 97.3% 文本任务操作步数 > 100，最长 300+ 步

## 六大领域

软件研发（31）/ 商务财务（15）/ 医疗管理（16）/ 团队协作（12）/ 农业供应链（12）/ 独立媒体（20）。

## 23 SaaS 系统（部分）

Frappe HRMS, BigCapital, Twenty CRM, ERPNext, code-server, OpenEMR, OnlyOffice, ownCloud, Roundcube, Mattermost, Grocy, FarmOS, SiYuan, OpenProject, Baserow, PhotoPrism, MediaCMS。

## 评测得分（2026-05）

| Model | Checkpoint | End-to-End | Avg Steps |
|---|---|---|---|
| Claude Opus 4.7 | 43.9% | **3.8%** | 175 |
| GPT-5.5 High | 43.8% | 1.9% | 200 |
| Claude Opus 4.6 | 43.2% | 3.8% | 257 |
| GPT-5.4 High | 37.0% | 3.8% | 252 |
| Kimi K2.6 | 34.1% | 0.9% | 269 |
| Qwen 3.6 Plus | 29.9% | 1.9% | 249 |
| Doubao Seed 2.0 Pro | 27.1% | 1.9% | — |
| Kimi K2.5 | 27.7% | 0.0% | — |
| Gemini 3.1 Pro | 27.1% | 0.0% | — |
| Claude Sonnet 4.6 | 23.3% | 0.9% | — |

## 四类失败模式

1. **Long-Horizon Fragility（长程脆性）** — 10-20 个 checkpoint 的独立失败率数学叠加，end-to-end 被压到接近 0
2. **Error Cascading（错误级联）** — 早期 3% 权重的错误（建错实体类型）让下游 30% 分数失效
3. **Verification Blindness（验证盲）** — agent 自报完成，不做闭环 outcome 验证
4. **Execution Variance（执行方差）** — 同题同模型多次跑，结果 0.00-0.68 不等

## 验证方法

- **State-Check** — 数据库 / API 状态对比
- **Content-Check** — 字符串 / 正则匹配
- **LLM-Judge** — 开放式输出 LLM 评判

## 参考

- 论文：https://arxiv.org/html/2605.15777v1
- 官方页：https://unipat.ai/benchmarks/SaaS-Bench
- GitHub：https://github.com/UniPat-AI/SaaS-Bench
