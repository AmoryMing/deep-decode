---
title: 任务调度台来了：Claude Code 不再只是单会话助手
source: https://github.com/anthropics/claude-code/releases/tag/v2.1.139
author: Anthropic
date: 2026-05-11
type: decode
status: draft_v1
---

2026 年 5 月 11 日，Anthropic 在 Claude Code v2.1.139 里把两个功能放在 release note 的最前面：agent view 和 `/goal`。这不是一次“多了几个命令”的更新。它把 AI coding 的默认画面，从一个终端里的一段对话，推向一个任务调度台。

agent view 管横向并发。`/goal` 管纵向续航。前者让一个人同时盯住多个 Claude Code session，后者让单个 session 跨多个 turn 追一个完成条件。两个功能放在同一版里，信号很清楚：Claude Code 正在把“助手”做成“可调度的工作单元”。

## agent view 不是会话列表，是调度面板

官方文档对 agent view 的定义很直接：用 `claude agents` 打开，一个屏幕管理所有后台 session，看到哪些在运行、哪些卡在人类输入、哪些已经完成。文档还明确说，session 可以在没有终端 attached 的情况下继续跑，由独立 supervisor process 承载。

这改变了 Claude Code 的操作重心。过去的主界面是一条 transcript，人类盯着当前任务往前推。agent view 的主界面是一张状态表，人类看的不是“下一句怎么回”，而是“哪条任务线需要介入”。Working、Needs input、Idle、Completed、Failed、Stopped 这些状态，已经不是聊天软件语言，而是任务系统语言。

更关键的是 peek and reply。用户按 Space 看某个 session 最近在做什么、需要什么输入、开了哪个 PR；必要时直接在 peek panel 里回复，不必打开完整 transcript。这个小交互把人类介入压缩成一个调度动作。多数时候，人不需要回到细节里，只要处理阻塞。

后台 session 的写入隔离也说明 agent view 不是浮在表面的 UI。官方文档写得很细：后台 session 起步在当前工作目录，但需要编辑文件时，会进入 `.claude/worktrees/` 下的隔离 git worktree。并发 coding agent 如果共享同一个 checkout，写文件迟早互相踩。worktree 是把“同时跑多个 session”变成工程现实的底座。

## `/goal` 不是长 prompt，是完成条件

`/goal` 的机制更像给 agent 加了一层小型验收器。用户写下一个完成条件，例如某组测试通过、某个迁移完成、某个队列清空。Claude 每跑完一个 turn，一个小模型会检查条件是否已经满足。如果没有满足，Claude 自动开始下一轮，不把控制权交还给用户。

这和“给 Claude 一条更长的 prompt”不是一回事。长 prompt 只影响当前 turn 的意图，`/goal` 改的是 turn 和 turn 之间的连接方式。官方文档把它和 `/loop`、Stop hook、auto mode 放在同一张比较表里：`/goal` 在上一个 turn 结束后触发，停止条件是模型确认目标达成。

这里最重要的词不是“自动”，而是“可验证”。官方建议 goal condition 要有一个可测终点、一个检查方式和必要约束，比如测试命令退出 0、lint 干净、不改其他测试文件。`/goal` 真正奖励的不是“努力工作直到我满意”，而是“把满意写成可检查条件”。

这也解释了为什么它支持 interactive、`-p` 和 Remote Control。`claude -p "/goal CHANGELOG.md has an entry for every PR merged this week"` 这种写法，把一次 CLI 调用变成一个跑到条件满足为止的循环。人类不再逐步喂 prompt，而是在开始时定义验收口径。

## 横向并发加纵向续航

agent view 和 `/goal` 合起来看，Claude Code 的角色变了。

横向上，agent view 让一个人同时发起、观察、介入多个后台 session。纵向上，`/goal` 让每个 session 不再依赖用户逐 turn 续命，而是围绕一个 completion condition 自己往下走。前者解决“多条线怎么管”，后者解决“一条线怎么跑到底”。

这就是任务调度台。人类从驾驶员变成调度员：不是一直扶着方向盘，而是定义任务、设定边界、处理阻塞、验收结果。

v2.1.139 里的其他更新也在给这个方向铺路。release note 提到，subagent 的 API 请求会带 `x-claude-code-agent-id` 和 parent agent id，OpenTelemetry span 也会写入 agent id。这个细节很小，但方向很硬：当 agent 变成可并发调度的工作单元，它也必须变成可追踪、可归因、可观测的对象。

## 盲区：调度台不等于无人驾驶

agent view 仍是 research preview，官方明确要求 Claude Code v2.1.139 或更高版本，并提示界面和快捷键可能变化。它适合试用新的工作形态，不适合直接当成企业流程平台。

`/goal` 的边界更值得盯。官方文档写明，evaluator 不会独立运行命令或读取文件，只能根据 Claude 已经放进 conversation 的内容判断目标是否满足。这意味着 goal 的质量取决于 Claude 是否真的把检查结果跑出来、写出来。没有 transcript 里的证据，evaluator 看不到。

权限也没有消失。auto mode 可以减少单个 turn 内的工具确认，`/goal` 可以减少 turn 和 turn 之间的人工续航，但文件写入、命令执行、网络访问、凭据、PR 合并，仍然要靠权限模式、hooks、worktree 和团队规则兜底。

成本同样会从“单次对话成本”变成“调度成本”。agent view 的 row summary 由 Haiku-class model 生成，`/goal` 每个 turn 后也会触发小模型评估。单次看起来不大，但并发 session 多起来，组织需要关注的不再只是主模型 token，而是整套 agent 操作面的 token、权限和产出质量。

## 对从业者意味着什么

- PM：本周把一个正在排队的研发需求改写成 3 条可验收的 `/goal` 条件。不要写“完成迁移”，写“`npm test` 退出 0、旧 API 调用数为 0、未修改无关模块”。
- 架构师：拿一个低风险仓库试 agent view，同时派 3 个互不依赖任务，检查 worktree、权限、CI、PR 合并路径是否能承受并发。
- CTO：重新定义团队里的 AI coding 指标。不要只看“用了多少次 Claude Code”，要看并发任务数、阻塞响应时间、失败 session 复盘、agent 产出合并成本。
- 工程师：把常见长任务改成“目标条件 + 检查命令 + 不可变约束”。写得越像验收标准，`/goal` 越能发挥作用。
- 平台负责人：把 agent id、parent agent id、OTEL span 和权限日志放进同一套观测视图。agent 一旦并发，追责和复盘不能靠记忆。

## 本期关键词

- **任务调度台**：不是一个新按钮，而是一种新的操作面。人类面对的不是单条聊天记录，而是一组可派发、可挂起、可介入、可验收的 agent session。

- **横向并发**：多个独立任务同时跑。agent view 的价值不在“能开很多窗口”，而在它把 running、needs input、completed 这些状态压进一张表，让人类只处理需要介入的部分。

- **纵向续航**：单个任务跨多个 turn 持续推进。`/goal` 让 Claude 不必每完成一轮就等下一句 prompt，而是根据完成条件继续跑，直到 evaluator 判断达成。

- **完成条件**：`/goal` 的核心资产。好的完成条件必须可测、可证明、有约束。它把“帮我做完”翻译成“满足这些证据就算完成”。

- **后台 session**：脱离当前终端继续运行的 Claude Code 会话。agent view 之所以像调度台，是因为这些 session 不只是被列出来，而是真的可以在后台运行、等待输入、完成或失败。

- **可观测 agent**：当 agent 能并发，团队就需要知道哪个 agent 做了什么、由哪个 parent agent 触发、耗费了多少 token、失败在哪里。v2.1.139 的 agent id 和 OTEL 改动，是这个方向的小信号。

## 引用

1. [GitHub release v2.1.139](https://github.com/anthropics/claude-code/releases/tag/v2.1.139) — 原始 release。
2. [Claude Code changelog](https://code.claude.com/docs/en/changelog.md) — v2.1.139 官方变更列表。
3. [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view.md) — agent view 官方文档。
4. [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal.md) — `/goal` 官方文档。
5. [Run agents in parallel](https://code.claude.com/docs/en/agents.md) — Claude Code 并行 agent 工作方式说明。
