---
title: Undercover Mode（隐身模式）
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [feature, ethics, security]
---

# Undercover Mode

Anthropic 员工用 Claude Code 向公开仓库提交代码时，自动隐藏 AI 身份。

## 机制

- USER_TYPE='ant'（Anthropic 员工）自动激活
- 防止内部代号（Capybara、Tengu、Fennec）泄露到 commit 中
- **没有强制关闭开关**（no force-OFF）

## 争议

这是整个泄露事件中最具伦理争议的发现：

| 视角 | 论点 |
|---|---|
| 支持 | 运营安全需要；防止竞品通过 commit 历史追踪 Anthropic 的开发方向 |
| 反对 | 透明度问题；开源社区无法知道贡献者是 AI 还是人 |

"没有 force-OFF 开关"意味着这不是个人选择，是组织策略。

## 相关概念

- [[permission-pipeline]] -- Undercover Mode 是权限系统的特殊策略
- [[anti-distillation]] -- 另一个防竞品机制
- [[feature-flags]] -- 门控在 ant-only 构建中

## 出处

5 个信源提及
