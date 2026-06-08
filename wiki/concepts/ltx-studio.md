---
title: LTX Studio DiT
type: concept
created: 2026-04-27
updated: 2026-04-27
tags: [视频扩散模型, DiT, Lightricks, 开源]
---

## 简介

以色列公司 Lightricks 开源的 Diffusion Transformer 视频模型，flipbook.page 在它上面重度优化做实时像素流生成。

## 关键属性

- 架构：DiT（Diffusion Transformer），视频原生而非图像逐帧
- 输出：1080p / 24fps 实时流
- 关键：连续帧一致性 + 低延迟 —— 这是为什么 flipbook 必须用视频模型而不是 SDXL 类图像模型
- 部署：flipbook 跑在 Modal Labs serverless GPU 上（4/25 之后由 Modal 赞助算力）

## 为什么不用图像模型

- SDXL/Flux 类逐帧生成会导致严重的帧间闪烁（每帧不同噪声）
- 用户点击响应需要"上一帧 → 动画过渡 → 下一帧"，视频模型原生支持
- 文字渲染稳定性：视频模型在连续上下文里学过文字结构，单帧图像模型经常画歪字

## 关联

- [[flipbook-pixel-browser]]
- [[generative-ui]]
