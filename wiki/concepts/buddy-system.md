---
title: Buddy 电子宠物系统
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [feature, ux, future]
---

# Buddy 电子宠物系统

Claude Code 内藏了一套完整的电子宠物系统（类似 Tamagotchi）。

## 规格

- 18 个物种（名称用 `String.fromCharCode()` 编码，躲过内部泄露检测）
- 稀有度：普通 60% / 少见 25% / 稀有 10% / 史诗 4% / 传说 1%（闪光款）
- 5 项属性：DEBUGGING、PATIENCE、CHAOS、WISDOM、SNARK
- 6 种眼睛、8 种帽子（稀有度门控）
- "灵魂"由 Claude 在首次孵化时生成

## 技术实现

- Mulberry32 PRNG，种子 = hash(userId) + 'friend-2026-401'
- 确定性生成：同一用户永远得到同一只宠物
- 计划测试窗口：2026 年 4 月 1-7 日

## 产品意义

不是玩笑。情感连接是 AI 产品留存的关键杠杆。Buddy 系统把"工具"变成"伙伴"。

**大白话**：你的 AI 编程助手养了一只电子宠物。看起来是彩蛋，其实是留存策略。

## 相关概念

- [[kairos]] -- Buddy 是 KAIROS 的情感层

## 出处

5 个信源提及
