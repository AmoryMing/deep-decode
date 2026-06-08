---
title: Claude Design
type: concept
created: 2026-04-25
updated: 2026-04-25
tags: [product, anthropic, design-tool]
---

# Claude Design

Anthropic Labs 于 2026-04-17 发布的设计产品，基于 Claude Opus 4.7。和传统设计工具不同——它的产出形态不是图，是**代码**：HTML/CSS/React 组件 + 交互 + shader + 可嵌入 AI 元素。

## 关键能力

| 能力 | 说明 |
|---|---|
| 输入多模态 | 文本 prompt / 图片 / DOCX / PPTX / XLSX / codebase / 网页抓取 |
| 自动建系统 | 读团队现有 codebase 和设计文件，自动总结颜色/字体/组件库为设计系统，后续项目沿用 |
| Implementation Bundle | 设计稿打包成"组件代码 + 设计 tokens + 文案 + 交互说明"的完整交接包，一键交给 Claude Code 落地 |
| 访问层级 | Research Preview，限 Claude Pro / Max / Team / Enterprise |

## 产品定位

Anthropic 官话："intended to complement Canva rather than replace it"——只字不提 Figma。但市场行为给出了反向解读：发布当天 Figma 跌 7%，YTD 跌 35%，Anthropic CPO Mike Krieger 在发布前一天辞去 Figma 董事席位。

Canva 选择融入：Canva CEO Melanie Perkins 亲自背书，把 Canva 定位为 Claude Design 的输出终点。

## 实测数据

- Brilliant：旧工具 20+ prompts → Claude Design 2 prompts
- Datadog：一周 brief + mockup + review → 一次对话

## 关联概念

- [[implementation-bundle]] —— 它的核心交接形态
- [[three-layer-design]] —— 它精确切入的是"执行段"
- [[harness-engineering]] —— Implementation Bundle 是设计 → 代码的 harness

## 出处

[[ai-design-three-layer]] 主拆解，Anthropic 官方发布稿
