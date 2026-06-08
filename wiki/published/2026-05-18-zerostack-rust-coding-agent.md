---
title: Zerostack — 8MB 编程代理拆解（复盘）
type: published
created: 2026-05-18
updated: 2026-05-18
style: default
tags: [coding-agent, rust, unix-philosophy, 开发者工具, 开源, AIHOT]
---

# 复盘：12MB 对 300MB，但内存不是 Zerostack 的护城河

## 主判断

Zerostack 的护城河不是 8MB 内存，是"一个人手选每个依赖、7000 行讲清一件事"这套不可规模化的工程克制——在 harness 能力被模型决定的赛道里，这恰恰是大厂 TypeScript 快迭代模式最难复制的差异化位。

## 角度

AIHOT 自动选题，进入已拥挤 coding agent 赛道（Claude Code/Codex/Aider/Cline/OpenCode/Pi）。没有顺着"Rust 省内存"这个已知结论写，而是拆掉它：先承认 HN 最尖锐反对（省内存对等 LLM 的工具是伪需求）有道理的一半，再用"并行多代理 + 长 session"新工作流补上漏掉的一半，最后落到真差异化——harness 工程质量是模型抬不走的位，而单人克制不可规模化。

## 一手素材

- crates.io 1.0.0（GPL-3.0-only）
- GitHub README 全文（270 行）+ API meta（529 星 / 6 天到 1.0）
- HN 讨论 536 点 / 295 评论（AIHOT 给的 115 点是早期快照，已用最新数并在引用标注）
- jock.pl 2026 harness 横评（同 Opus 不同 harness 差 16 分）
- nxcode Claude Code vs Codex 对照

## 产出

- article.md（~3000 字，6 图嵌入 assets/png/）
- 6 SVG + 6 PNG（cairosvg scale=2，已 Read 验证无方框/溢出）
- podcast.mp3 6.86 分钟（edge-tts fallback，VoxCPM 内网服务不可达，与 gowers 篇同因——VPN 未恢复）
- polish_report.json（structural PASS 1 轮，3 处修；prose 1 轮，2 段）
- factcheck.json（0 硬伤）

## 盲区处理

无公开 benchmark / prompt 无运行时发现 / 单人 6 天可持续性 / GPL 企业摩擦——四条全部在正文盲区段明写，未替项目编造跑分。

## 待办

- podcast 待 VPN 恢复后用 VoxCPM2 重生（与 2026-05-10-gowers 同处理）
- 邮件草稿已存，未发；公众号/小红书/视频号/抖音未做（spec channels 仅 email）
