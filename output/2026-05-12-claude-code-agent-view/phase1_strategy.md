# Phase 1 Strategy

## 主判断

Claude Code v2.1.139 的核心变化是工作形态升级：从“一个人盯着一个 AI 助手跑一条任务线”，变成“一个人调度多个 coding agent，并给单个 agent 设定可验证终点”。agent view 负责横向并发，`/goal` 负责纵向续航。

## 文章标题

任务调度台来了：Claude Code 不再只是单会话助手

## 结构

1. 用 v2.1.139 的 release 事实开场：同一版同时上线 agent view 和 `/goal`。
2. 拆 agent view：不是 session 列表，而是多任务调度面板。
3. 拆 `/goal`：不是 prompt 技巧，而是给 agent 加一个跨 turn 的完成条件。
4. 合并判断：横向并发 + 纵向续航，让人的角色从操作员变成调度者。
5. 写盲区：research preview、模型 evaluator、权限与隔离、成本和合并。
6. 落地：PM、架构师、CTO、工程师本周怎么试。

## 证据策略

- 所有事实性判断优先引用官方 GitHub release 和 Claude Code docs。
- 不用第三方传闻，不写用户量、价格、商业推断。
- 关键证据落在可核验语句：release 发布时间、feature list、agent view 状态、后台 session、worktree 隔离、`/goal` evaluator 限制。

## 风格策略

- 不翻译 changelog，抓结构变化。
- 少形容词，多机制。
- 使用“横向并发”“纵向续航”“任务调度台”“完成条件”作为核心关键词。
