# Phase 1: 结构解剖

## 1. 核心论点

Claude Code 的默认架构是单线程 Agent Loop，而非多 Agent Swarm。这不是技术局限，而是深思熟虑的架构哲学——在 AI Agent 开发中，"约束即能力"。当竞品追逐多 Agent 蜂群编排时，Anthropic 选择让一个线程把一件事做到极致。

## 2. 隐含假设

- 模型本身足够聪明，可以充当自己的调度器——不需要外部编排框架替它决定"下一步做什么"
- 单线程 + prompt cache 的经济效益优于多线程并行的吞吐量优势
- 可调试性和可预测性比并行加速更重要——用户需要看到 AI 在做什么
- 大多数编程任务本质上是串行的：理解问题 → 定位代码 → 修改 → 验证

## 3. 关键证据

1. **query.ts 的 `while(true)` 循环**：整个系统的心跳。一个无限循环，模型输出 → 解析工具调用 → 执行工具 → 结果回传 → 继续。stop_reason 决定退出。
2. **StreamingToolExecutor**：在单线程内实现了工具级并发——读操作并行、写操作串行。不是没有并发，而是在正确的层级做并发。
3. **Swarm/Coordinator 是 feature-flagged 的可选层**：COORDINATOR_MODE 环境变量控制，不是默认行为。说明 Anthropic 认为多 Agent 是特定场景的解决方案，不是通用范式。
4. **Coordinator 的 369 行系统 prompt**：核心铁律 "Never write 'based on your findings'"——coordinator 必须自己理解问题，不能委派理解。管理哲学写进了代码。

## 4. 盲区

- 单线程在超大型任务（如全仓库重构）上的性能天花板
- Coordinator 模式仍在灰度测试，说明 Anthropic 自己也在探索单线程与多 Agent 的边界
- 没有公开的 benchmark 对比单线程 vs 多 Agent 在不同任务类型上的效率
- 三套多 Agent 系统（Swarm/Coordinator/Fork）并存，意味着没有找到统一范式

## 5. 读者画像

AI 产品经理、Agent 架构师、Claude Code 重度用户。关心的不是"怎么写代码"，而是"为什么这么设计"以及"对我做产品意味着什么"。

## 6. 可视化规划

| 图表 | 类型 | 内容 |
|------|------|------|
| 01 | 对比图（风格A） | 单线程 Loop vs 多 Agent Swarm：两种世界观的碰撞 |
| 02 | 流程图（风格B） | query.ts 的 while(true) 循环：一个线程的一生 |
| 03 | 层级图（风格B） | 三级并发架构：工具级 → 子 Agent → 团队协作 |
