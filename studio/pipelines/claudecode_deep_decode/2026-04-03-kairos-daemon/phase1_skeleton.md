# Phase 1: 结构解剖 -- KAIROS：7x24 后台 Daemon 的野心

## 1. 核心论点（一句话）

KAIROS 不是一个功能，是 Claude Code 从"被动工具"变成"永不下线的 AI 同事"的操作系统级基础设施——它通过 tick 心跳 + SleepTool 休眠 + 外部消息唤醒 + 定时任务 + 记忆巩固五大子系统，让 AI Agent 第一次拥有了完整的"自主时间感"。

## 2. 隐含假设

- **假设1：AI Agent 的价值不在被问到时有多聪明，而在没人问时能做多少事。** KAIROS 的全部设计都指向一个方向：让 AI 在用户不在的时候也能创造价值。
- **假设2：API 成本是可工程化优化的。** SleepTool 的 prompt cache 5分钟过期权衡、tick 心跳的频率控制、forked subagent 的缓存共享——每个设计决策都在成本和能力之间走钢丝。
- **假设3：信任是渐进建立的。** 从 BriefTool 的强制工具化输出（只有用 SendUserMessage 才能被用户看到），到外部消息的结构化权限协议——KAIROS 不给 AI 完全自由，而是在可控框架内赋予自主性。
- **假设4：编程工具的终局不是编程工具。** 把记忆巩固（AutoDream）、外部消息响应（MCP Channel）、定时任务（CronScheduler）拼在一起，这是一个通用 AI 助手的运行时，编程只是第一个落地场景。

## 3. 关键证据（最强 3 个）

### 证据1：源码中的五层门控体系
main.tsx 第79-81行，KAIROS 通过 Bun 的 `feature()` 做编译时死代码消除：
```typescript
const assistantModule = feature('KAIROS') ? require('./assistant/index.js') : null;
const kairosGate = feature('KAIROS') ? require('./assistant/gate.js') : null;
```
下游 BriefTool、CronScheduler、proactive 命令全部通过 `feature('KAIROS')` 或 `feature('PROACTIVE') || feature('KAIROS')` 门控。这不是一个功能开关，是一整套子系统的总闸。

### 证据2：SleepTool 的成本感知设计
SleepTool prompt 中明确写道：
> "Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly."

这揭示了 KAIROS 最核心的工程权衡：太频繁醒来浪费 API 调用，太不频繁 prompt cache 过期导致下次调用更贵（因为要重新填充缓存）。AI 需要自己学会"什么时候该醒，什么时候该继续睡"。

### 证据3：BriefTool 的强制通道化
在 KAIROS 助手模式下，模型的所有用户可见输出必须通过 BriefTool（即 SendUserMessage）发送，普通文本输出对用户不可见。BriefTool 的 status 字段区分 'normal'（回复用户）和 'proactive'（主动汇报）。这把"思考"和"沟通"彻底分离——AI 在后台默默工作，只在有意义的时候才"说话"。

## 4. 盲区（作者们刻意没提或轻描淡写的）

- **成本真相**：所有分析都聚焦于 KAIROS 的架构精巧，但没人算过一个 KAIROS daemon 7x24 运行的实际 API 成本。按 Opus 4.6 的定价，即使有 prompt cache，每天几百次 tick 唤醒的成本也不低。
- **安全边界**：一个 7x24 运行、能响应外部消息、能执行定时任务的 AI Agent，它的安全边界在哪里？如果它在凌晨3点收到一条恶意构造的 Slack 消息怎么办？
- **用户信任**：KAIROS 模式下 AI 可以在用户不在时自主行动。但用户怎么知道 AI 在他睡觉时做了什么？只靠 /brief 查看汇报够不够？
- **竞品对比缺失**：Devin、Replit Agent、GitHub Copilot Workspace 都在做类似的"持续运行 Agent"，但没有分析者做过系统性对比。

## 5. 读者画像

这篇文章写给：
- AI 工程师/Agent 开发者：想知道 KAIROS 的技术实现细节，可借鉴的设计模式
- AI 产品经理：想理解"AI 从工具到同事"这条产品演进路线的技术基础
- 技术决策者：想评估"持续运行的 AI Agent"在自己产品中的可行性

对我们意味着：KAIROS 证明了"永不下线的 AI 同事"在工程上已经可行，关键瓶颈不是技术而是成本和信任模型。

## 6. 可视化规划

| 图序 | 概念 | 形式 | 风格 |
|------|------|------|------|
| 封面 | KAIROS 从不下线的 AI 同事 | 系列封面 | 风格B结构化 |
| 01 | Tick-Sleep 成本权衡循环 | 时间线+决策树 | 风格A概念漫画（时钟+钱袋隐喻） |
| 02 | KAIROS 五大子系统全景 | 架构图/层级图 | 风格B结构化（Notion式） |
| 03 | 工具→助手→同事→伙伴 进化链 | 四阶段演进图 | 风格A概念漫画（进化隐喻） |
