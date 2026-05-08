# Phase 1: 结构解剖

## 1. 核心论点（一句话）

Claude Code 的智能不住在模型里，住在 QueryEngine + query.ts 这条"脊椎"上——一套五步预处理流水线 + 流式工具执行 + 六层上下文压缩的工程系统，把一个"聊天机器人"变成了一个"认知运行时"。

## 2. 隐含假设

- **假设1**: Agent 系统的核心复杂度在跨轮次状态管理，不在单次推理。所以 query.ts 故意做成"胖核心"，拒绝过度模块化。
- **假设2**: 单线程主循环优于多 Agent 竞争/Swarm。复杂度用预处理流水线消化，不用并发消化。
- **假设3**: 上下文窗口是 Agent 的生命线，必须分层压缩（微压缩→自动压缩→完全压缩），而不是指望模型窗口无限大。
- **假设4**: 工具执行可以不等模型输出完就开始（StreamingToolExecutor），因为安全检查和工具准备可以并行。

## 3. 关键证据

- **五步预处理流水线**: Snip → 微压缩 → 上下文折叠 → 自动压缩 → 组装请求。源码注释明确说"折叠放在 autocompact 之前，如果折叠够用就不触发 autocompact"
- **AsyncGenerator 驱动的 while(true) 循环**: query.ts 核心是一个生成器模式的 ReAct 循环
- **AUTOCOMPACT_BUFFER_TOKENS = 13_000**: 预留 13K token 给压缩摘要输出，来自 p99.99 数据（17,387 token）
- **StreamingToolExecutor**: 模型还在输出时就开始准备工具调用，投机性分类器检查（startSpeculativeClassifierCheck）
- **tombstone 消息类型**: 清理 fallback 切换时的"孤儿" thinking blocks，防签名错误
- **wizard 注释**: 维护者用魔法师口吻警告 thinking block 处理规则的复杂性
- **QueryEngine 类**: 管理 mutableMessages[]、abortController、permissionDenials[]、totalUsage、discoveredSkillNames 等跨轮次状态
- **feature() 编译时消除**: 未启用的功能在构建时物理删除，不是运行时判断

## 4. 盲区/作者刻意没提的

- **性能数据缺失**: 五步流水线的实际耗时占比？每步压缩能节省多少 token？没有公开 benchmark
- **失败模式**: 压缩过度丢失关键信息怎么办？连续 autocompact 失败（MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3）之后的降级策略
- **单线程瓶颈**: 刻意选择单线程，但当工具执行耗时很长时（如大型 git 操作），主循环被阻塞的用户体验问题
- **"胖核心"的技术债**: query.ts 太大意味着难以测试、难以并行开发。这是有意为之还是演进的遗留？
- **内外版本差异**: USER_TYPE === 'ant' 分支意味着内部版本有不同的 prompt 策略，外部用户看到的行为可能不是最优解

## 5. 可视化规划

| 编号 | 主题 | 形式 | 风格 |
|------|------|------|------|
| 00 | 系列封面 | 标题+副标题+视觉隐喻 | 风格B |
| 01 | 五步预处理流水线 | 左→右流程图，每步标注输入/输出/触发条件 | 风格B |
| 02 | QueryEngine 三文件脊椎 | main.tsx→QueryEngine→processUserInput→query.ts 的调用链 | 风格B |
| 03 | "胖核心" vs 过度拆分 | 左右对比：胖核心（状态集中）vs 微服务化（状态分散）| 风格A |

## 6. 读者画像

AI 从业者、技术决策者、对 Agent 架构有实践经验的工程师和产品人。
对他们意味着：Agent 产品的核心不是接哪个模型，而是中间这层"脊椎"怎么设计——状态管理、上下文压缩、工具执行策略。
