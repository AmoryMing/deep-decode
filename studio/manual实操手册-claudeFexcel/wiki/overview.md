---
title: 产品全景 — Claude for Excel / PowerPoint
sources:
  - Anthropic 官方产品页
  - Claude for Excel beta 发布公告
  - Claude for PowerPoint 发布公告
links_to:
  - "[[安装与配置]]"
  - "[[Excel核心功能]]"
  - "[[PowerPoint核心功能]]"
  - "[[跨应用协作]]"
linked_from:
  - "[[产品演进时间线]]"
  - "[[安装与配置]]"
last_updated: 2026-04-10
---

# 产品全景 — Claude for Excel / PowerPoint

## 这个产品是什么

Claude for Excel 是一个 Excel 加载项（Add-in，装在 Excel 里的小插件），把 Claude AI 直接嵌入你日常用的 Excel 工作流。你不需要切换到浏览器问 AI，直接在表格里对话就行。

目前处于 beta（公测）阶段，支持以下付费计划的用户使用：

| 计划 | 说明 |
|------|------|
| Pro | 个人专业版 |
| Max | 个人高级版 |
| Team | 团队版 |
| Enterprise | 企业版 |

同时还有一个 PowerPoint 加载项，两者可以跨应用协作——比如 Excel 里算好的数据，直接让 Claude 帮你生成 PPT 图表。

**支持的 AI 模型：** Sonnet 4.6（快速响应）和 Opus 4.6（深度推理）

**支持的文件格式：** .xlsx 和 .xlsm（含宏的工作簿）

## 能帮你做什么

### 1. 工作簿问答（带单元格引用）

对着打开的 Excel 表格直接提问，Claude 会引用具体的单元格位置回答。比如问"收入最高的产品是哪个"，它会告诉你"B15 单元格，XX产品，收入 XX 万"。

### 2. 安全更新假设

改财务模型里的假设参数时，Claude 会保留公式依赖关系（Formula Dependencies，公式之间的引用链条），不会因为改一个数就把一串公式搞坏。

### 3. 调试错误

遇到 `#REF!`（引用错误）、`#VALUE!`（值类型错误）、循环引用（Circular Reference，A 引用 B、B 又引用 A 的死循环）这类报错，Claude 能定位原因并修复。

### 4. 从零建模或填充模板

给 Claude 一句话描述，它能从空白表格搭出完整的财务模型、数据分析表；也能帮你把现有模板里的数据填好。

### 5. 导航多标签页工作簿

几十个 Sheet（工作表标签页）的大型工作簿，Claude 能理解各标签页之间的关系，跨 Sheet 查找和操作数据。

### 6. 连接器集成外部工具

通过 MCP 连接器（Model Context Protocol，一种让 AI 调用外部数据的标准协议），Claude 可以直接从金融数据平台拉取数据到 Excel：

- S&P Global（标普全球）
- LSEG（伦敦证券交易所集团）
- Daloopa（财务数据自动化）
- Pitchbook（私募股权数据）
- Moody's（穆迪）
- FactSet（金融数据终端）

### 关键特性：不破坏你的表格

Claude 在操作时会保留：
- 公式和依赖关系
- 单元格之间的引用关系
- 现有的格式设置

## 适合谁用

- **财务/FP&A 人员：** 建模、改假设、调试公式
- **数据分析师：** 快速问答、数据清洗、生成透视表
- **运营/产品经理：** 整理报表、填充模板、生成汇报 PPT
- **任何重度 Excel 用户：** 用自然语言替代复杂公式操作

## 相关页面

- [[安装与配置]] — 怎么装、怎么配
- [[Excel核心功能]] — Excel 里具体能做什么
- [[PowerPoint核心功能]] — PPT 里具体能做什么
- [[跨应用协作]] — Excel 和 PPT 怎么联动
