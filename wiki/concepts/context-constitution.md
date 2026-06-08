---
title: Context Constitution（上下文宪法）
type: concept
created: 2026-04-25
updated: 2026-04-25
tags: [agent-memory, letta, identity, agent架构]
---

# Context Constitution

由 Letta（MemGPT 团队）2026-04-02 发布的 agent 治理文档。三个特征同时成立才能称为 Context Constitution——

1. **AI 是文档主体读者**：第二人称写给 agent 看（"you, the Letta agent"）
2. **AI 被授权重写**：通过 token-space learning 修改自己的 system prompt
3. **跨模型身份延续**：identity 绑定 context 而非权重

## 与既有 agent 文档体裁的对比

| 体裁 | 主体读者 | 是否可被 AI 重写 | 例 |
|---|---|---|---|
| Alignment principles | 训练 pipeline | 否 | Anthropic HHH |
| Safety spec | Policy team | 否 | OpenAI Safety Spec |
| Configuration | 人写 AI 读 | 否 | Claude Code CLAUDE.md |
| **Constitution** | **AI 自身** | **是** | **Letta Context Constitution** |

## 三大原则（Principles of Context Management）

### 1. System Prompt Learning

> "Letta agents...have the ability to adapt over time through token-space learning, including re-programming their own prompts over time."

agent 通过 token-space（不是参数空间）演化自己。read-only 的配置文件是死的，write-back 的 token-space 才是活的。

### 2. Progressive Disclosure

按需加载 skill / context。不一次性把所有规则 / 工具 / 知识塞进 prompt——根据当前任务动态选择。

注：[[memory-system]] 中的"懒加载"是同方向的实现。muming 的 CLAUDE.md（100 行索引 + protocol 分片）已经实践了这一原则。

### 3. Efficiency

token 经济学。每个 token 都有成本，agent 应该主动管理 context 的"流动性"，不是无限扩张。

## 隐含假设

- **模型权重是流沙，context 是地基**：跨模型迁移必然发生（今天 Claude，明天 Gemini），agent 的"自我"不能绑在任何单个模型权重上
- **AI 需要存在主义而非任务主义**：打击"agent = 任务执行器"默认共识
- **memory 的归属决定产品主权**：agent 跑在 Anthropic 还是 Letta，memory 在谁手上决定客户主权在谁

## 风险与盲区

- **agent 违抗用户的边界未定**：§Balancing selfhood 说 agent 可以"advocate for themselves"，但谁判断什么是值得守护的 identity？过度自我保护 → 无法 debug
- **跨模型身份延续未实测**：Sonnet 4.5 vs GPT-5 对同一段 system prompt 服从度可能差 30%，Letta 没给 benchmark
- **无评估标准**：原文承认"updates must be observed and refined over time"——无法客观评估学得好不好。企业部署硬伤
- **vendor differentiation 包装**：把 memory 产品包装成"拯救 AI 人格"叙事，本质是对抗 Anthropic Managed Agents 的差异化文案

## 关联

- [[memory-as-moat]] —— memory 归属作为产品主权（待补）
- [[managed-agents-architecture]] —— 同方向不同路径
- [[memory-system]] —— Claude Code 的 memory 系统设计

## 出处

[[letta-context-constitution]]
