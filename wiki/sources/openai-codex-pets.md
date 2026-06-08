---
title: OpenAI Codex pets 官方设置说明
type: source
created: 2026-05-08
updated: 2026-05-08
tags: [OpenAI, Codex, pets, Agent UX]
source_url: https://developers.openai.com/codex/app/settings#codex-pets
---

# OpenAI Codex pets 官方设置说明

## 核心论点

OpenAI 将 Codex pets 定义为 Codex App 的可选动画伴侣，入口在 Settings → Appearance → Pets，也可以通过 `/pet`、Wake Pet / Tuck Away Pet 或命令面板唤醒和收起。

真正的产品价值不在动画，而在 floating overlay：它会在用户使用其他 App 时保留活跃 Codex 工作状态，显示当前线程，并表达 Codex 是 running、waiting for input，还是 ready for review。

## 可写角度

- [[state-personification]]：把 Agent 的后台运行状态拟人化，降低长任务焦虑。
- [[buddy-system]] 对照：Claude buddy 是身份型伙伴，Codex pets 是工作型状态层。
- 可编程界面：自定义 pet 通过 `hatch-pet` skill 进入技能系统，说明界面资产开始被纳入 Agent 工作流。

## 关键事实

- `/pet` 可在 composer 中触发。
- Settings → Appearance 提供 Wake Pet / Tuck Away Pet。
- Cmd+K / Ctrl+K 命令面板可执行同样命令。
- overlay 显示 active thread、running / waiting / review 状态和短进度提示。
- 自定义 pet 路径：安装 `hatch-pet` skill，Force Reload Skills，再让 skill 创建新 pet。

## 关联

- [[codex-pets-state-personification]]
- [[state-personification]]
- [[buddy-system]]
