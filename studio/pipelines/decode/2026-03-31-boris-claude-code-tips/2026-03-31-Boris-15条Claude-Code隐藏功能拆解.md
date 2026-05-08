---
title: 15 条"小技巧"背后的大图景 -- Claude Code 创建者揭示的三层架构
source: https://x.com/bcherny/status/2038454336355999749
author: Boris Cherny (Anthropic, Claude Code 创建者, 前 Meta 首席工程师)
date: 2026-03-30
decoded: 2026-03-31
tags: [AI产品, Claude Code, 开发工具, Agent, 自主编程]
---

# 15 条"小技巧"背后的大图景 -- Claude Code 创建者揭示的三层架构

42 条 tips，5 个帖子，横跨 3 个月。当 Claude Code 的创建者 Boris Cherny 说"分享一些我最喜欢的隐藏功能"时，他实际上在做的事情是：**一层一层地掀开 Claude Code 的真实架构**。

大多数人看到的是 15 条零散技巧。但把它们按功能排列，一个清晰的三层金字塔浮现出来——而绝大多数用户，还停留在最表面那一层。

![冰山：大多数人只看到水面](01_冰山-大多数人只看到水面.png)

## "意图编排"取代"写代码"

先看两个最容易被忽略的 tips：**#1 手机 App** 和 **#15 语音输入**。

Boris 用手机审代码、用语音写代码。这不是懒——这是一个信号：**代码的物理输入方式已经不重要了**。键盘、屏幕、IDE，这些曾经定义"程序员"的工具，正在变成可选项。

> "I wanted to share a bunch of my favorite hidden and under-utilized features in Claude Code. I'll focus on the ones I use the most."（分享我最喜欢的隐藏功能，重点是我用得最多的。）—— Boris Cherny

"用得最多"这四个字值得画重点。Claude Code 的创建者，日常最高频使用的功能不是代码补全，不是 debug 助手，而是**手机 App、语音输入、session 传送、和自动化调度**。这意味着他的工作模式已经从"写代码"彻底转向了"编排意图"（Intent Orchestration）——告诉 AI 做什么，而不是自己怎么做。

## 三层金字塔：从聊天到自治

![从聊天到自治的三个阶段](02_三个阶段-人在哪里.png)

把 15 条 tips 按性质分类，一个架构图自然浮现：

**第一层：对话界面**（tips #1, #2, #6, #7, #8, #9, #15）
手机 App、Chrome 扩展、session 分叉、`/btw` 侧边提问、语音输入。这是大多数人使用 Claude Code 的全部——一个更聪明的聊天窗口。好用，但远没有触及真正的杠杆点。

**第二层：开发基础设施**（tips #4, #10, #13, #14）
Hooks 生命周期钩子、Git Worktree 并行工作区、`--add-dir` 多仓库访问、`--agent` 自定义 Agent。这一层把 Claude Code 从"工具"变成了"平台"——可编程、可扩展、可组合。Boris 提到的 Hooks 有四个挂载点（SessionStart / PreToolUse / PermissionRequest / Stop），本质上这是一个 Agent 生命周期管理框架，不是一个聊天插件。

**第三层：自主运行**（tips #3, #5, #11, #12）
`/loop` 定时任务、`/schedule` 远程调度、`/batch` 大规模并行变更、`--bare` SDK 加速。到了这一层，Claude Code 不再需要人坐在屏幕前。它变成了一个**自主运行的 Agent 平台**：定时巡检代码、自动审 PR、批量重构成千上万个文件——全部在后台，全部无人值守。

这个金字塔的残酷之处在于：**每一层的用户数量大概是上一层的 10%**。绝大多数人停在第一层，偶尔碰到第二层，几乎没人到第三层。但 Boris 自己最高频使用的功能，恰恰集中在第二层和第三层。


## 三个值得深挖的信号

![/batch: 一个命令一千个Agent](03_batch-一个命令一千个Agent.png)

### 信号一：`/batch` -- 从"一个 Agent"到"一千个 Agent"

> "/batch fans out work across dozens, hundreds, or thousands of worktree agents independently."

这条轻描淡写的 tip 可能是整个帖子里最重要的。它意味着 Claude Code 已经内建了**大规模并行 Agent 调度能力**。一个 `/batch` 命令，可以同时启动上千个独立 Agent，每个都有自己的 worktree（代码副本），互不干扰。

这不是"代码补全工具"的功能，这是**分布式计算基础设施**的功能。想象一下：你有一个跨 500 个文件的 API 迁移任务，传统做法需要一个人花两周，现在一个命令分发给 500 个 Agent 并行执行。

但 Boris 没提的是：**谁来审这 500 个 Agent 的产出？** 这恰好呼应了 Anthropic 在 3 月 9 日发布的 Code Review 功能——"A team of agents runs a deep review on every PR." Agent 写代码，Agent 审代码。人的角色从"写+审"变成了"定义标准+抽检"。

![Hooks: Agent的四个生命周期钩子](04_Hooks-Agent的四个生命周期.png)

### 信号二：Hooks -- 不是插件，是操作系统级的扩展点

Hooks 支持四个生命周期事件：SessionStart（启动时加载上下文）、PreToolUse（工具调用前拦截）、PermissionRequest（权限审批路由）、Stop（任务完成后保持动量）。

这四个钩子覆盖了 Agent 运行的完整生命周期，本质上是一个**Agent 操作系统的 API**。类比 Linux 的 systemd，Hooks 让你可以在 Agent 的每个关键节点注入自定义逻辑——动态加载 CLAUDE.md、记录命令日志、路由审批流程、在任务间保持状态。

一个有趣的外部信号：[[EPD范式转移-epd-paradigm-shift]] 中 LangChain CEO 在同期提出"瓶颈从实现转向评审"。Hooks 的 PermissionRequest 恰好就是在解决评审瓶颈——让 Agent 自主执行，但在关键节点暂停等待人类确认。

![Cowork: Agent走出代码仓库](05_Cowork-Agent走出代码仓库.png)

### 信号三：Cowork Dispatch -- Agent 走出 IDE

Tip #5 Cowork Dispatch 让 Claude Desktop App 可以被远程控制，处理邮件、文件管理、浏览器操作。这意味着 Claude Code 的 Agent 不再局限于代码仓库——它开始接管**开发者的整个数字工作台**。

结合 `/loop` 的定时调度：想象一个 Agent 每 30 分钟扫一遍 Slack，把用户反馈整理成 Issue，然后自动创建 PR 修复。从反馈到修复，全程无人。

![盲区: Boris没说的三件事](06_盲区-Boris没说的三件事.png)

## 盲区与反面论证

Boris 的 15 条 tips 都在说"能做什么"，但有几个关键问题他没提：

**成本问题**。`/batch` 启动上千个 Agent 并行，每个 Agent 消耗独立的 token 额度。大规模使用的 API 成本可能是个人开发者无法承受的。Boris 作为 Anthropic 员工，可能对成本没有普通用户那么敏感。

**质量控制**。自主运行的 Agent 越多，出错的概率越高。`/loop` 每 5 分钟跑一次 code review 很酷，但如果 review 质量不稳定，就变成了噪音制造机。Boris 提到了 `--bare` 提速 10 倍，但没提质量基线怎么保证。

**学习曲线的断崖**。从第一层到第三层，认知门槛是指数级上升的。Hooks 需要理解 Agent 生命周期，Worktree 需要理解 Git 分支模型，`/batch` 需要理解并行计算的一致性问题。大多数"我用 Claude Code 写代码"的用户，不具备这些前置知识。

**安全边界**。Cowork Dispatch 让 Agent 操作邮件和浏览器，`/schedule` 让 Agent 在你睡觉时自动执行。这些功能的安全边界在哪？如果 Agent 误操作了邮件或误删了文件，回滚机制是什么？Boris 整个帖子没有提到一次"安全"或"权限"。

## 对 AI 从业者/实践者来说意味着什么

**如果你是产品经理**：停止把 AI 编程工具当作"智能代码补全"来定位。Boris 的使用方式表明，这类工具的终态是**开发者操作系统**——管理 Agent、调度任务、编排工作流。产品设计应该围绕"如何让用户从第一层快速进入第二层"，而不是在第一层里堆更多聊天功能。

**如果你是开发者**：立刻尝试 Hooks 和 Worktree。按 Boris 的说法，worktree 是"单一最大的生产力解锁"。5 个 worktree 并行 = 5 倍吞吐量，这比任何 prompt 优化的 ROI 都高。

**如果你在做开发工具**：注意 Claude Code 的扩展模型——不是插件市场，而是 Hooks + Custom Agents + SDK。这种"基础设施级"的扩展方式比传统插件市场更灵活，但也更难入门。你的竞争策略应该聚焦在降低第二层和第三层的入门门槛。

---

## 本期关键词

**意图编排（Intent Orchestration）** -- 不再手写代码，而是用自然语言（甚至语音）告诉 Agent 做什么。Boris 用手机+语音写代码，就是意图编排的终极形态。值得知道因为：这重新定义了"编程"这个动作本身。

**Agent 生命周期钩子（Hooks）** -- 在 Agent 运行的关键节点（启动/工具调用/权限请求/停止）注入自定义逻辑，类似 Linux 的 systemd 或 React 的生命周期方法。值得知道因为：这是 Agent 从"工具"变成"平台"的标志性特征。

**Git Worktree** -- Git 的原生功能，允许同一个仓库同时存在多个独立工作区，每个有自己的分支和文件状态。Claude Code 用它实现多 Agent 并行开发互不干扰。值得知道因为：Boris 说这是"最大的生产力解锁"。

**`/batch` 大规模并行** -- 一个命令把任务分发给上百个独立 Agent 并行执行，每个 Agent 在自己的 worktree 里工作。值得知道因为：这标志着 AI 编程从"一对一辅助"进入"一对多调度"时代。

**`/loop` 定时 Agent** -- 让 Agent 按固定间隔（如每 5 分钟）自动执行任务，类似 Linux 的 cron。值得知道因为：这让 AI 从"你问它答"变成"自主巡检"，是从同步到异步的关键转变。

**Cowork Dispatch** -- 远程控制 Claude Desktop App 处理非编码任务（邮件、文件、浏览器），让 Agent 的能力范围超越代码仓库。值得知道因为：这是 Agent 从"编码助手"走向"数字员工"的第一步。

## 原文关键引用

> "I wanted to share a bunch of my favorite hidden and under-utilized features in Claude Code. I'll focus on the ones I use the most."（分享我最喜欢的 Claude Code 隐藏功能，重点是我用得最多的。）—— Boris Cherny

> "/batch fans out work across dozens, hundreds, or thousands of worktree agents independently."（/batch 把工作分发给几十、几百甚至上千个独立的 worktree Agent。）—— Boris Cherny

> "Give Claude a way to verify its output — enables iteration."（给 Claude 一种验证自己输出的方式——让迭代成为可能。）—— Boris Cherny, on Chrome Extension

## 引用

1. [Boris Cherny: Claude Code Hidden Features](https://x.com/bcherny/status/2038454336355999749) -- 本期拆解原文
2. [Boris Cherny's Claude Code Tips Are Now a Skill](https://alirezarezvani.medium.com/boris-chernys-claude-code-tips-are-now-a-skill-here-is-what-the-complete-collection-reveals-b410a942636b) -- Medium 分析：42 条 tips 实际上是一个工作流的渐进式揭示
3. [Claude Code March 2026 Full Capability Interpretation](https://help.apiyi.com/en/claude-code-2026-new-features-loop-computer-use-remote-control-guide-en.html) -- /loop、Computer Use 等 12 项核心新功能解读
4. [Put Claude on Autopilot: Scheduled Tasks](https://medium.com/@richardhightower/put-claude-on-autopilot-scheduled-tasks-with-loop-and-schedule-built-in-skills-43f3be5ac1ec) -- /loop 和 /schedule 实战指南
5. [How Boris Cherny Uses Claude Code](https://karozieminski.substack.com/p/boris-cherny-claude-code-workflow) -- Boris 工作流深度拆解
