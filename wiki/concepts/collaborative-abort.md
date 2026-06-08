---
title: 协作中断（Collaborative Abort）
type: concept
created: 2026-04-30
updated: 2026-04-30
tags: [agent-ui, trust, claude-code, esc, abort-controller]
---

## 一句话

用户对运行中智能体发出的「停一下」信号，必须分层：当前轮次取消、agent 实例不死、上层任务保留。一个 Esc 三种语义。

## 实现位置

`raw/claudecodesources/raw_code/claude-code/src/hooks/useBackgroundTaskNavigation.ts:149-167`

## 三层语义

1. **当前轮次取消** — `task.currentWorkAbortController?.abort()` — 这次走偏了重来
2. **退出选择模式** — `Escape in selection mode: exit selection without aborting leader` — 先不选了
3. **关闭 agent** — 需显式确认 — 我后悔创建这个

## 配套：可审计纯文本

- `CLAUDE.md` 用 plain Markdown，没走结构化配置那条路 — 用户可 `git diff` / `rm` / 一秒看懂
- `FallbackToolUseRejectedMessage` 渲染一行 `<InterruptedByUser />` — 把中断写进对话历史，下一轮 agent 能看到自己被否决过

## 设计原则

> 信任不是靠动画建立的，靠「东西归你管」建立的。

参考 [Smashing Magazine 2026-02](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)：可控性的核心不是确认对话框，是可撤销与可审计的成本。
