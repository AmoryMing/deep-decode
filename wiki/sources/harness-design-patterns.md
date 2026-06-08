---
title: Harness Design for Long-Running AI Apps
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [Anthropic, harness, Generator-Evaluator, Agent架构, 长任务]
---

# Harness Design for Long-Running AI Apps

来源：https://www.anthropic.com/engineering/harness-design-long-running-apps

Anthropic 工程团队关于如何设计长时间运行的 AI 应用的实践指南。核心主张：**分离生成与评审**。

## 核心问题

长任务面临两个顽疾：
1. **上下文退化**：窗口填满后模型失去连贯性，出现"上下文焦虑"（提前结束任务）
2. **自评偏差**：模型评估自己的产出时会"自信地称赞——即使质量明显平庸"

## Generator-Evaluator 架构

GAN 启发的多 Agent 结构：
- **Generator**：产出制品（代码/设计/内容）
- **Evaluator**：独立评估质量
- **反馈循环**：Evaluator 发现驱动 Generator 迭代

关键引用："Tuning a standalone evaluator to be skeptical turns out to be far more tractable than making a generator critical of its own work."

## 三 Agent 系统

- **Planner**：1-4 句 brief → 完整产品规格（强调高层交付物，避免过度规定实现细节）
- **Generator**：迭代实现，用 git 版本控制，交接前自评
- **Evaluator**：用 Playwright 像终端用户一样交互测试

### Sprint Contract

Generator 和 Evaluator 在实现前谈判"Sprint Contract"定义成功标准。通过结构化文件实现异步交接。

## 质量评分维度（前端设计场景）

1. **Design Quality**：视觉一致性
2. **Originality**：有意识的创造性选择 vs 模板默认值
3. **Craft**：技术执行（层次/间距/对比）
4. **Functionality**：独立于美学的可用性

加权 design + originality → 推动模型冒审美风险而非输出泛型。

## 关键设计原则

- **上下文重置优于压缩**：清空窗口+结构化交接，优于原地摘要（Sonnet 4.5）
- **但 Opus 4.6 消除了上下文焦虑**，可以连续 session + 自动压缩
- **Evaluator 需要迭代校准**：初始会偏向 LLM 产出，需要读 log 找偏差，用 few-shot 示例对齐
- **Load-bearing 组件原则**：每个 harness 组件编码了"模型做不到什么"的假设，新模型到来时应重新压力测试

## 性能数据

- Solo run（Opus 4.5）：20 分钟/$9 → 核心功能损坏
- Full harness：6 小时/$200 → 完整可玩应用
- DAW App（Opus 4.6 简化 harness）：~4 小时/$125，Evaluator 在第二轮抓到缺失核心功能

## 与本工厂的关系

本内容工厂的自动化流水线直接采用了这套架构：
- Scout = 信息采集层（不在原文中，是工厂创新）
- Planner = 本文的 Planner
- Producer = 本文的 Generator
- Evaluator = 本文的 Evaluator
- Sprint Contract = wiki/contracts/
- 六维质量评分 = 本文四维评分的扩展版

可写角度：这篇博客本身就是一个 decode 选题（~12/15 分），角度是"AI 工程的元方法论"。
