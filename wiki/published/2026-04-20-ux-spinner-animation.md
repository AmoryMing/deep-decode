---
title: "一个 Spinner，12 个文件：Claude Code 把等待做成了精密时钟"
type: published
date: 2026-04-20
slug: 2026-04-20-ux-spinner-animation
source: Claude Code 源码 src/components/Spinner/
series: claude-code-ux-源码拆解
---

## 产出

- article.md（约 3200 字）
- 4 张概念图（00 封面 + 01 主时钟 + 02 stalled 检测 + 03 表象 vs 内核）
- SVG + PNG (scale=2) 齐全

## 核心角度

**Spinner 不是转圈动画，是一台精密时钟系统**。187 条文案是烟雾弹（表象），50ms 主时钟 + 6 条动画共享才是真工程（内核）。

## 关键数字（从源码提取）

- 187 条 spinner verbs（186 条单引号 + 1 条 "Beboppin'" 双引号）
- 12 帧 glyph：6 字符 forward + reverse
- 120ms 一帧 glyph
- 50ms 主时钟（一秒 20 帧，一分钟 1200 帧）
- shimmer 只涂 ±1 个字符 → -81% Text 节点
- stalled 阈值 3000ms，渐变 2000ms
- ERROR_RED = rgb(171, 43, 63)
- token 插值分段：gap<70 步进 3，gap<200 步进 15%，>200 步进 50
- reducedMotion：退化为 `●`，2000ms 呼吸

## 引用的代码证据

- `SpinnerGlyph.tsx` → Ghostty 字符降级注释
- `useShimmerAnimation.ts` → 50ms/200ms mode 区分
- `useStalledAnimation.ts` → 3s 阈值 + 指数缓动 0.1
- `GlimmerMessage.tsx` → "-81% on the shimmer path" 注释
- `SpinnerAnimationRow.tsx` → "reuse our existing 50ms clock" 注释
- `constants/spinnerVerbs.ts` → 完整 187 条列表

## 分发状态

- 未发布（待用户确认发送到公众号/小红书/邮件）

## 复盘

- 源码一手读到位：12 个文件全部通读，外加 spinnerVerbs.ts 确认 187 数字
- 有判断：每段以"这不是 X，是 Y"的重新框定推进，不堆砌代码
- 技法克制：每段最多 1-2 个概念 + 1 条证据
- 没自封原创术语：juiciness、RGB 插值、指数缓动、grapheme segmentation 都是已有词汇
