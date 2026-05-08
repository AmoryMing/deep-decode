---
title: 【AI Force 简报】Claude Opus 4.7 发布：顶配模型被 Anthropic 首次刻意锁起来
source: https://www.anthropic.com/news/claude-opus-4-7
author: 慕铭
date: 2026-04-17
tags: [AI简报, Claude, Anthropic, 模型发布]
---

# Claude Opus 4.7：顶配模型被刻意锁起来的一次发布

**4 月 16 日，Anthropic 发布 Claude Opus 4.7。表面是常规升级，实则首次确认了一个新的行业事实——Anthropic 手上最强的模型叫 Mythos Preview，SWE-bench Verified 93.9%，但不对外发布；Opus 4.7 是被"差异化训练"主动降过能的对外版本。这是 AI 行业第一次有厂商把顶配模型藏起来，只公开第二强。**

下面是今天这篇简报的三个核心判断和对我们的直接影响。

![分级发布](01_tiering.png)

## 判断一：Opus 4.7 的真正信号不是"更强"，是"被降"

原文里最值得盯住的一句话：

> "Opus 4.7 is the first such model: its cyber capabilities are not as advanced as those of Mythos Preview (indeed, during its training we experimented with efforts to **differentially reduce** these capabilities)."

"差异化降能"是训练阶段的外科手术，不是模型碰巧更弱。配合 Mythos Preview 被限制在 Project Glasswing 联盟（AWS、Apple、Google、Microsoft、NVIDIA、JPMorganChase、Cisco、CrowdStrike、Broadcom、Palo Alto Networks、Linux Foundation 共 11 家）这一事实，说明 Anthropic 正式开创了 **Model Tiering（模型分级发布）** 范式：

- **Tier 1 联盟限制**：Mythos Preview（SWE-bench Verified 93.9%），仅 Glasswing 成员
- **Tier 2 公开商用**：Opus 4.7（SWE-bench Verified 87.6%），差异化降能后广泛发布
- **Tier 3 专业豁免**：通过 Cyber Verification Program 的安全研究者，可解锁 Opus 4.7 默认关闭的部分能力

**对我们意味着什么**：未来两年，"最新即最强"的默认假设会被打破。评估一个新模型时，要同时追问"它是 Tier 几"和"同系列是否有未公开的更强版本"。这会影响技术栈选型的长期判断。

## 判断二：价格没变，但实际付费减半

Opus 4.7 的定价与 4.6 持平（输入 $5/M tokens，输出 $25/M tokens），但埋了一个重要的效率变化：

**Opus 4.7 的 `xhigh` 档跑 100k token，性能等同 Opus 4.6 `max` 档跑 200k token。**

这是一次隐性降价——同等质量下 token 消耗减半。Replit 官方 testimonial 里原话：**"same quality at lower cost"**。

![三个转向](02_three_shifts.png)

**直接行动项**：

1. 所有在 Opus 4.6 max 档位上跑的生产流量，立即跑 A/B 对照测试切 Opus 4.7 xhigh。如果任务质量持平，直接迁移，月度 token 账单预期下降 30-50%。
2. 重新评估 prompt 策略。过去为省 token 做的 context 压缩，现在可以取消，让模型用更完整的上下文。

## 判断三：agent 产品化颗粒度从"一轮对话"推到"一个任务"

三个新产品特性合起来看，Anthropic 在把 Claude 从"助手"卖成"同事"：

| 特性 | 作用 | 可用性 |
|---|---|---|
| **Task Budget** | 给 Claude 一个 token 预算（覆盖思考/工具调用/输出），模型看到 running countdown 并据此调度优先级 | 公测 |
| **Auto Mode** | 授权 Claude 在权限范围内自主决策、不打断用户 | Claude Code Max 专享 |
| **/ultrareview** | 结构化代码审查命令（架构/安全/性能/可维护性四维度） | Pro/Max 每月 3 次免费 |

Cognition CEO Scott Wu 的原话：**"It works coherently for hours, pushes through hard problems rather than giving up"**——Devin 团队证实 Opus 4.7 可以连贯工作数小时不偏航。

![差异化训练](04_differential.png)

**对我们意味着什么**：

- **智能体团队**：如果正在设计 agentic workflow，重新评估"任务单位"的长度。过去按"一轮对话"切分的任务，现在可以整合为一个 2-3 小时的 Task Budget 任务。
- **Claude Code 重度用户**：`/ultrareview` 加入 PR workflow，针对核心模块（认证/支付/数据迁移）强制跑一次。三次免费是 Anthropic 在用试用换使用习惯，值得借此窗口期形成流程依赖。
- **架构侧**：Auto Mode 意味着 Claude Code Max 订阅的 ROI 显著上升，值得重新测算团队订阅结构。

## Benchmark 数字速览

| 指标 | Opus 4.7 | Opus 4.6 | 竞品 | 备注 |
|---|---|---|---|---|
| SWE-bench Verified | 87.6% | 80.8% | Gemini 3.1 Pro 80.6% | Mythos 93.9%（不对外） |
| SWE-bench Pro | 64.3% | 53.4% | GPT-5.4 57.7% / Gemini 3.1 Pro 54.2% | |
| CursorBench | 70% | 58% | — | Cursor 官方报告 |
| 视觉敏锐度 | 98.5% | 54.5% | — | 图像最大 ~3.75MP |
| Rakuten-SWE-Bench 生产任务 | 3x | 1x | — | 衡量单位改为"通过任务数" |
| BigLaw Bench | 90.9% | — | — | Harvey 报告 |

![Benchmark 分层](03_benchmarks.png)

## 盲区与值得持续观察的四件事

1. **Mythos 能力上限未公开**。"autonomously developed next-gen offensive cyber capability"具体到什么程度？官方只给定性描述，无定量边界。
2. **"数小时连贯工作"无时长上限**。Cognition 说 hours 但不量化。这是营销词还是工程指标需要观察。
3. **差异化训练的副作用已显现**。Opus 4.7 在管制物质减害建议上比 4.6 稍差——说明精度未达"只砍该砍的"，能力耦合仍存在。
4. **Cyber Verification Program 准入机制**。这是 AI 行业第一个官方"能力解锁许可证"体系，值得跟踪其申请标准，可能成为 dual-use AI 的合规样板。

## 本期关键词速查

- **Project Glasswing**：Mythos Preview 的 11 家受限分发联盟
- **Differential Training**：训练阶段精准削除特定能力的技术
- **Task Budget**：给 agent 设置 token 预算 + running countdown
- **xhigh**：介于 high 和 max 之间的推理效果档位
- **Model Tiering**：模型分级发布的四层结构

## 原文与主要参考

- [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) —— Anthropic 官方（2026-04-16）
- [Claude Opus 4.7 leads on SWE-bench and agentic reasoning](https://thenextweb.com/news/anthropic-claude-opus-4-7-coding-agentic-benchmarks-release) —— 竞品对比数据
- [Anthropic Releases Claude Mythos Preview](https://www.infoq.com/news/2026/04/anthropic-claude-mythos/) —— Mythos 受限发布背景
- [Anthropic limits Mythos AI rollout (CNBC)](https://www.cnbc.com/2026/04/07/anthropic-claude-mythos-ai-hackers-cyberattacks.html) —— Project Glasswing 联盟

---

*完整深度拆解版（约 5300 字，含 Model Tiering 范式完整分析）已同步至知识库，需要可索取。*
