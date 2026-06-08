---
title: 终端里的浏览器：Ink 渲染引擎逐行拆解
type: published
created: 2026-04-16
updated: 2026-04-16
tags: [Claude Code, Ink, 渲染引擎, React, Yoga, UX源码拆解]
series: claude-code-ux-源码拆解 #1
---

# 终端里的浏览器：Ink 渲染引擎逐行拆解

## 基本信息

- **类型**: decode（深度拆解）
- **系列**: Claude Code UX 源码拆解 #1
- **源**: src/ink/ 目录，96 个 TypeScript 源文件
- **产出**: output/2026-04-16-ux-ink-engine/
- **文件清单**: article.md + 2 SVG + 2 PNG

## 核心论点

1. Claude Code 的 Ink 不是 npm Ink 的简单使用，是深度 fork，增加了鼠标事件、screen 打包、选区系统
2. 完整渲染管线：JSX → Reconciler → Custom DOM → Yoga Layout → Screen Buffer → Diff → ANSI stdout
3. screen.ts（1487 行）是性能核心：TypedArray 打包 cell、CharPool ASCII 快速路径、StylePool bit-0 可见性
4. ScrollBox 绕过 React 直接修改 DOM——高频交互的工程权衡

## Evaluator 评审结果

- **Score**: 27/30（判断密度 5 + 证据质量 4 + 读者友好 5 + 文字功力 4 + 结构纪律 5 + 从业者价值 4）
- **Fact-check**: 24/25 verified, 1 unverifiable (non-critical)
- **Revision**: 1 轮（修复 2 处：删除无来源的团队人数猜测，纠正 renderNodeToOutput 可读性声明）
- **AI Slop**: 0 instances found
