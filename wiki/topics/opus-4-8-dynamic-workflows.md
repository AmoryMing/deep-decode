---
title: Opus 4.8 + Dynamic Workflows — 编排权从人手收进模型
type: topic
created: 2026-06-02
updated: 2026-06-02
style: default
content_type: decode
reader: developer
distribute: [email, 公众号, 小红书, 视频号]
tags: [anthropic, opus-4-8, dynamic-workflows, subagents, agent-orchestration, agent-teams, 评估]
status: queued
---

# Opus 4.8 + Dynamic Workflows

## 一句话选题

Claude Opus 4.8（2026-05-28，距 4.7 仅 41 天）带来 **Dynamic Workflows**：Claude Code 里模型自己 plan → 跑数百个并行 subagent（上限 1000）→ 验证输出 → 再汇报。把"多智能体编排"从人手里收进模型。配 agent teams 等方案横向对比 + Opus 4.8 模型评估。

## 主判断（候选，写作时收敛）

**编排正在从"人写脚本指挥 agent"变成"模型自己决定 fan-out"。** Dynamic Workflows 不是又一个 subagent 功能，是把"什么时候拆、拆成几个、谁验证"这套决策从人的 orchestration 脚本里收进 Opus 4.8 本身——这正是我们内容工厂里手搓 Workflow 编排在做的事，现在模型要自己做了。

## 反判断 / 盲区

- research preview，1000 subagent 上限的真实可用性 / 成本谁来兜
- "模型自己编排" vs "人写确定性 workflow" 的可控性取舍（确定性 runner 的价值会不会被削）
- 诚实度 ×4 的测法和泛化性（官方数字 vs 第三方复现）
- 41 天迭代节奏背后是不是"挤牙膏式小版本 + 营销"

## 横向对比维度（agent teams 等）

| 方案 | 编排者 | 并行度 | 验证 | 确定性 |
|---|---|---|---|---|
| Claude Dynamic Workflows | 模型自己 plan | 数百，上限 1000 | 模型自验后汇报 | 低（模型驱动） |
| Claude Code TeamCreate / SendMessage | 人 + 模型 | 手动建 team | 人控 | 中 |
| 手搓 Workflow runner（如本工厂 tools/pipeline.py） | 人写脚本 | 人定 | 硬产物门 | 高（脚本权威） |
| OpenAI agent teams / swarm | 框架 | 框架定 | 框架 | 中 |
| LangGraph / CrewAI | 图/角色 | 图定 | 节点 | 高（图确定） |

写作时核对各方实际机制，不照搬本表。

## Opus 4.8 评估点

- 诚实度：比 4.7 少 4 倍让代码缺陷漏过（官方）
- codebase-scale 迁移：数十万行从 kickoff 到 merge，以现有测试套件为标尺
- effort control（推理力度可调）+ fast mode 降价
- 对标 GPT-5.5（基准）
- 41 天迭代（4.7→4.8）

## 一手信源

1. [Introducing Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8) — Anthropic 官方（**第一信源，写作时逐条核对**）
2. [YouTube jZgcWCzxh1I](https://www.youtube.com/watch?v=jZgcWCzxh1I) — 用户指定视频信源，**写作前需转录**（yt-dlp 字幕 / whisper）
3. 二手交叉：
   - [TechCrunch: Opus 4.8 with dynamic workflow tool](https://techcrunch.com/2026/05/28/anthropic-releases-opus-4-8-with-new-dynamic-workflow-tool/)
   - [MarkTechPost: capped at 1,000 subagents](https://www.marktechpost.com/2026/05/28/anthropic-ships-claude-opus-4-8-alongside-dynamic-workflows-and-cheaper-fast-mode-with-workflows-capped-at-1000-subagents/)
   - [MindStudio: how to run hundreds of parallel sub-agents](https://www.mindstudio.ai/blog/claude-opus-4-8-dynamic-workflows-parallel-sub-agents)

## 证据缺口（写作前补）

- YouTube jZgcWCzxh1I 全文转录（确认 demo / 用户感受 / 实测细节）
- Anthropic 官方 blog 全文（dynamic workflows 的确切机制、限额、定价）
- 1000 subagent 上限的官方措辞 + 是否有 token/成本约束
- 诚实度 ×4 的 eval 方法
- 关联本工厂经验：我们 tools/pipeline.py 的确定性 runner vs dynamic workflows 的模型驱动，做一手对照（独家角度）

## 关联

- [[anthropic-product-launchroom]] — Cat Wu 谈 Anthropic 产品高速迭代（41 天节奏的注脚）
- [[2026-05-26-hf-agent-glossary]] — Agent = Model + Harness（dynamic workflows 是 harness 把编排吃进去）
- [[skill-graphs-2]] — 本工厂 compound 编排的自审
