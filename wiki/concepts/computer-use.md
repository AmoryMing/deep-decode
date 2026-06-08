---
title: Computer-Use
type: concept
created: 2026-05-27
updated: 2026-05-27
tags: [agent, anthropic, openai, automation]
---

# Computer-Use

让大模型直接操作电脑 GUI（鼠标点击、键盘输入、读屏）完成任务的范式。

## 时间线

- **2024-10** — Anthropic 发布 Claude 3.5 Sonnet computer-use API，演示订机票 / 填表单 demo
- **2025** — OpenAI Operator、Google Project Mariner、各种第三方 wrapper（browser-use 等）先后跟进
- **2026-05** — [[saas-bench]] 把这个范式按到地上测了一遍：最强 Claude 端到端通过率 3.8%

## 关键限制（SaaS-Bench 揭示）

1. **长程任务的脆性**：单步准确率 90% 听上去高，100 步下来累乘成 0.003%
2. **跨应用上下文丢失**：93.4% 真实办公任务跨 2+ 应用，模型在切换应用时记不住前一步建了什么
3. **验证回路缺失**：agent 点完保存就认为完事，不去 recheck 数据库状态变了没有
4. **执行方差**：同任务多次跑分数差 60+ 百分点，工程上无法对 SLA

## 与 AI 替代论的关系

"AI 替代白领"叙事预设 computer-use 能跑通真实办公流程。SaaS-Bench 用 3.8% 说，至少 2026 年 5 月，还跑不通。

## 参考

- Anthropic 发布：https://www.anthropic.com/news/3-5-models-and-computer-use
- SaaS-Bench：[[saas-bench]]
