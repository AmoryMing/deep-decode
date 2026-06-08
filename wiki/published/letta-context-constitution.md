---
title: Letta 给 AI 写了一份宪法——Context Constitution 深拆
type: published
status: published
created: 2026-04-17
updated: 2026-04-25
tags: [agent-memory, letta, memgpt, constitution, identity, agent架构]
source_url: https://www.letta.com/blog/context-constitution
source_author: Charles Packer & Sarah Wooders (Letta)
mode: event-decode
---

# Letta Context Constitution

## 摘要

拆解 Letta 2026-04-02 发布的 *Context Constitution*——一份**写给 AI 看的元宪法 + 自我修改授权书**。文档第二人称：「The Context Constitution is a document written by humans for you, the Letta agent.」结尾落款"To Letta agents, from the Letta humans"。

这种体裁在 AI 产业公开文档史上几乎没有先例：
- Anthropic HHH Principles → 训练 pipeline 内化的对齐规则
- OpenAI Safety Spec → 写给 policy team
- Claude Code CLAUDE.md → 人写人改、AI 被动遵守的配置文件
- **Letta Constitution** → AI 是文档主体读者，并被授权重写自己 system prompt 条款

核心论点：首次把"agent 身份"从"训出来的"变成"活出来的"。模型权重是流沙，context 是地基；agent 的"自我"不能绑在任何单个模型权重上。

三大原则：
1. **System Prompt Learning** —— agent 通过 token-space 自主重写系统提示
2. **Progressive Disclosure** —— 按需加载 skill / context
3. **Efficiency** —— token 经济学

## 写作特点

- **钩子用一句意外引言开场**：直接引"written by humans for you, the Letta agent"。第 5 种钩子方式（不同于时间压缩 / 数据反差 / 单一突出数据 / 反常识断言）
- **体裁本身当证据**：把"全文第二人称"作为论点的第一证据，对比 HHH/SafetySpec/CLAUDE.md 四类文档体裁。这是把"形式即内容"做到极致
- **盲区段直击商业真相**：5 条盲区里包含「'agent 有 selfhood' 的商业包装嫌疑」——指出叙事掩盖了 vendor differentiation 文案功能。这种"把营销叙事拆穿"的盲区是企媒拆解最有价值的反向声音
- **跨产品链闭环作为可信度证据**：Letta Code + Context Repositories + Skill Learning + memory omni-tool 集成 Sonnet 4.5——四件套同期落地，证明这不是纸上谈兵
- **读者落地段做职业映射**：把"muming 的 CLAUDE.md（100 行索引+protocol 分片）已经在做 Progressive Disclosure"——把抽象理论映射到读者已经在做的事，让读者意识到自己的实践在被某种理论命名

## 关联概念

- [[context-constitution]] —— 体裁与原则（待补独立 concept）
- [[system-prompt-learning]] —— Token-space learning，重写自己 prompt（待补）
- [[progressive-disclosure]] —— 按需加载（待补）
- [[memory-as-moat]] —— Memory 归属决定产品主权（待补）

## 关联选题

- [[managed-agents-architecture]] —— Anthropic 同向但不同路径的 agent 架构
- [[ai-design-three-layer]] —— 设计角度的"判断段不可压缩"，本文是 agent 角度的"identity 不可压缩"
- [[claude-opus-4-7]] —— Opus 4.7 的 Auto Mode + Task Budget 是 Anthropic 对同一问题的不同答案

## 复盘备注

- **第 5 种钩子方式**：意外引言开场。直接引一句反直觉/反预期的原文。要点：被引的句子必须自带"等等这是给谁看的"的悬念
- **形式即内容写法**：本篇把"第二人称写作"作为最强证据。这种"把文档的形式当作论点本身"是 AI 产品文档拆解的高阶技法
- **盲区段拆穿营销**：「商业包装嫌疑」一条特别有价值——拆开"selfhood"叙事下的 vendor differentiation 真相。值得记入 playbook 作为盲区段的一个标准维度："官方叙事掩盖的商业意图是什么"
