---
title: 高德把地图变成 Skill：当 LBS 厂商开始为 Agent 备货
type: published
created: 2026-04-30
updated: 2026-04-30
tags: [高德, Skill, LBS, Agent 基建, decode]
output_path: output/2026-04-30-amap-personal-map-skill/
---

# 复盘：高德个人地图 Skill

## 写了什么

3500-4000 字深度拆解，三层框架：

1. **Tech 层**：MCP 暴露工具签名 vs Skill 暴露"标准玩法"。GitHub 仓库目录结构与 Anthropic Skills 规范同构（SKILL.md + references/×13），属于协议跟随而非技术抄袭。
2. **Money 层**：高德开放平台原本按 QPS / 调用次数计费。Skill 化后付费方迁移到 Agent 平台，颗粒度从单次 API 升到订阅 + 分成；地图厂商退到"水电级基础设施"。
3. **Product 层**："个人地图"作为 App 内资产 vs Felt / My Maps 的网页工具产物。难点在前端——把结构化结果"装"成可在导航软件里打开的真实地图，只有 App 流量持有方做得到。

## 配图（6 张）

| 文件 | 章节 | 形式 |
|---|---|---|
| 00_系列封面 | — | 概念图：地理空间能力 → SKILL.md 包装 |
| 01_skill封装 | Tech | 三段式对比：Web API / MCP / Skill |
| 02_计费矩阵 | Money | 5×3 矩阵：按调用 / 按 MAU / Skill 批发 |
| 03_交互链路 | Product | 5 步流程：自然语言 → App 资产 |
| 04_产品三象限 | Product | 二维气泡图：交互方式 × 产物形态 |
| 05_能力gap | 盲区 | 漏斗：期望 → 简单 → 复杂 → 长尾 → 摩擦 |

## 素材使用
- 一手锚点：小红书 @高德地图（视频文案抓不全）
- 外部信号 8 个：SegmentFault 公关稿、腾讯云 OpenClaw 适配稿、JSAPI Skills 发布稿、AMap-Web/amap-skills GitHub、高德 MCP Server 官方说明、Anthropic Skills 规范

## 不确定项（已在文章里显式标"分析判断"）
- 个人地图 Skill 是否兼容 Anthropic Skills 公开规范，还是高德私有 Skill 协议
- C 端用户使用是否单独付费、Agent 厂商是否走流量分成

## 风格自检
- 钩子：用"措辞变化"路线（Skill 专区取代 API 文档作为门面），未走"今天 X 发布了"模板
- 每段有判断 + 证据
- 6 张图嵌入对应章节，不堆文末
- 关键词在"对从业者意味着什么"之后、"引用"之前
- polish-pipeline：4 grep 全 PASS（修了 1 处"某个"），prose 改 3 段

## 待反馈
等用户读完后，反馈进 style/feedback.md。

## 分发（未执行）
- 公众号：未发
- 小红书：未发
- 邮件：未发
