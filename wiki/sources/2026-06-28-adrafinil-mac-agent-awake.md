---
title: Adrafinil — 只在 AI agent 干活时阻止 Mac 睡眠的菜单栏小工具
type: source
created: 2026-06-28
updated: 2026-06-28
tags: [mac, ai-agent, claude-code, caffeinate, 防睡眠, 桌面工具, 工作流, hook]
---

## 核心论点

Adrafinil 把 macOS 的防睡眠从「常开开关」改成了「按 agent 工作状态自动开合的阀门」。caffeinate、Amphetamine、KeepingYouAwake 这类老牌工具的逻辑是「让机器一直醒着」——你点一下，它就常开，直到你记得关。Adrafinil 反过来：只在 AI 编码 agent（Claude Code、Codex、Cursor 等）真正有活跃 turn 时阻止睡眠，活儿一干完立刻松手，恢复正常省电（包括合盖即睡）。它的卖点不是「更强的常开」，而是「更聪明的按需」——把唤醒的生命周期绑到 agent 的 turn 生命周期上。

这反映了 agent 工作流对桌面操作系统提出的新需求：本地 agent 跑在你自己的 Mac 上而非云端，机器一睡 agent 就停，但你又不想为了让它隔夜跑就让机器整夜醒着发烫费电。

## 关键事实（带出处）

- **名字/作者**：App 名 Adrafinil，作者 GitHub 用户 kageroumado，2026 年 6 月在 Hacker News 发 Show HN（约 108 分/71 评论）。仓库 `kageroumado/adrafinil`，Swift 100%，MIT 许可，约 159 star，最新 v1.1.2（2026-06-22）。来源：GitHub README + Show HN。
- **怎么感知 agent 在干活**：主路径是 hook——一键安装把自己接进 9 个 agent 的 hook 系统（Claude Code、Codex、Cursor、Gemini CLI、Aider、Hermes、OpenCode、Cline、Pi）。以 Claude Code 为例，`UserPromptSubmit` 时 `adrafinil acquire`，`Stop` 时 `adrafinil release`。daemon 按 session key 引用计数，计数大于 0 就阻止睡眠。备选是进程嗅探：检测到已知 agent 二进制在跑就自动 acquire，不依赖 hook。来源：README。
- **「活动级」不是「session 级」**：它绑的是「这一轮在不在跑」，不是「会话开没开」。空闲就放手。来源：README。
- **底层机制**：用 `pmset disablesleep` 对付合盖睡眠（公开的 IOPMAssertion 类型打不过合盖），另持一个标准 IOPMAssertion 对付 idle 睡眠。来源：README。
- **延迟**：acquire/release 往返 daemon < 50ms，不卡 agent。来源：README。
- **三层权限**：菜单栏 App（用户）+ Daemon（用户级，负责计数/进程/温度/盖子状态）+ Helper（root 级，唯一碰睡眠 API，只暴露 `setSleepBlocked(Bool)`）。来源：README。
- **合盖体验**：合盖时播提示音确认 assertion 已生效（屏幕关了弹不了通知）；开盖后显示离开期间跑了什么、峰值温度、是否触发热保护。来源：README。
- **安全兜底**：合盖期间温度越线→强制释放所有 assertion 防过热；进程死掉或 CPU 空闲 N 分钟→自动撤销。来源：README。
- **时间盒持有**：`adrafinil hold --for 30m --reason "deploy"`，给回答结束后仍在跑的长构建/部署用。还内置 MCP（`adrafinil mcp`），让 agent 自己请求时间盒。来源：README。
- **与 caffeinate 的区别**：caffeinate 是常开；它的合盖防睡眠（-s）只在接电时有效，Apple Silicon 上抗不住合盖。Adrafinil 自称「caffeinate/Amphetamine 这类常开工具的反面」。来源：README + Masset 博客 + Macworld。
- **pmset 抗合盖核实**：`pmset disablesleep` 设的内核级 SleepDisabled 标志在 Apple Silicon 上确能穿透合盖、无需外接显示器；但裸用会让内屏全亮空烧电、低电量时 OS 仍硬件强制睡眠。来源：Macworld + 社区。

## 金句（英文附译）

- "It only ever wakes for the work — then you both sleep." —— 它只为活儿醒着，活儿干完，你俩一起睡。（README）
- "the opposite of always-on wake utilities like caffeinate or Amphetamine." —— 它是 caffeinate、Amphetamine 这类常开唤醒工具的反面。（README）
- "When that computer sleeps, your worker clocks out." —— 电脑一睡，你的工人就下班了。（Masset 博客）

## 可写角度

1. **主角度（采用）**：从「防睡眠工具」这个 20 年没变的品类切入——为什么 agent 工作流让一个老到不能再老的需求（别睡）长出了新形态（按 agent 状态开合）。Adrafinil 是这个新需求的一个样本，不是终点。
2. 噱头与过度工程的张力：用提神药命名、15000 行 Swift 干一件几行脚本的事——这是营销，也是「把脏活封装干净」的工程取舍。
3. 一个拥挤的小赛道：同期冒出来 agents-sleep-preventer/NoSleepAgent/Macchiato/Lidless/StayUp/owly 一堆，说明这是真痛点还是一阵跟风。

## 信源

1. [kageroumado/adrafinil GitHub README](https://github.com/kageroumado/adrafinil) — 一手（作者仓库）
2. [Show HN: Adrafinil – keep a lid-closed Mac awake only while agents work](https://news.ycombinator.com/item?id=48701512) — 一手（作者自述 + 社区讨论）
3. [Your AI Agents Die the Moment Your Mac Falls Asleep (Masset Blog)](https://www.getmasset.com/resources/blog/keep-your-mac-awake-for-ai-agents) — 二手（caffeinate 局限与 agent 隔夜跑场景）
4. [How to use a MacBook with the lid closed (Macworld)](https://www.macworld.com/article/673295/how-to-use-macbook-with-lid-closed-stop-closed-mac-sleeping.html) — 二手（pmset/caffeinate 合盖行为核实）
5. [CharlonTank/agents-sleep-preventer](https://github.com/CharlonTank/agents-sleep-preventer) — 二手（同类竞品，证明赛道拥挤）
6. [newmarcel/KeepingYouAwake](https://github.com/newmarcel/KeepingYouAwake) — 二手（老牌常开类对照）
