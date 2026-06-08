---
title: KAIROS——7x24 后台 Daemon 的野心
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [kairos, daemon, background-agent, claude-code]
mode: source-code-decode
series: claudecode_deep_decode
---

# KAIROS

## 摘要

Series 第二十篇（隐藏功能）。论点：Anthropic 在源码里藏了完整后台守护进程系统 KAIROS，feature flag 锁死，从未出现在公开版本，但被引用 150+ 次、关联 75 个文件。

钩子用一句源码注释当锚：「'Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly.'」第 17 种钩子方式：内部源码注释当锚 + 反预期内容。

KAIROS（古希腊"恰当的时机"）是从 request-response 模式（你问它答，你不问它停）→ 主动模式（让 AI 拥有自己的时间感）的转变。

不是"还没做完的功能"，是"完整通过编译的基础设施，只差一个开关"。

## 写作特点

- **第 17 种钩子方式：内部源码注释当锚 + 反预期内容**。源码注释教 AI"算账"——预期是教写代码，反预期是教省钱
- **未发布功能的考古学**：把"feature flag 锁死但已通过编译"的隐藏功能作为研究对象——这是源码泄露独有的题材
- **从被动到主动的产品哲学**：把 KAIROS 放进"AI 工具产品形态演化"的位置——不是新功能，是产品类型切换

## 关联概念

- [[kairos]] —— 已存在 concept 页
- wiki/topics/2026-04-03-kairos-daemon.md（已存在）
- [[autodream]] —— KAIROS 系统下的子组件

## 复盘备注

- 钩子方式 #17：内部源码注释当锚
- 未发布功能考古学是源码泄露拆解的独有题材方向
