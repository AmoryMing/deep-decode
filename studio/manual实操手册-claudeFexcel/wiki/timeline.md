---
title: 产品演进时间线
sources:
  - Anthropic 官方产品发布公告
  - Claude for Excel beta 发布日志
  - Claude for PowerPoint 发布日志
  - 跨应用协作功能更新公告
links_to:
  - "[[产品全景]]"
  - "[[Excel核心功能]]"
  - "[[跨应用协作]]"
linked_from:
  - "[[产品全景]]"
last_updated: 2026-04-10
---

# 产品演进时间线

Claude for Excel / PowerPoint 从 2025 年底开始公测，核心脉络是：**单应用 → 多模型 → 跨应用 → 企业级**。

## 时间线

### 2025年11月24日 — Excel Beta 发布

Claude for Excel 正式开放公测，首批支持 Max、Team、Enterprise 计划用户。

**这次发布带来了什么：**
- 在 Excel 内直接与 Claude 对话，操作工作簿
- 数据透视表（Pivot Table，按维度汇总数据的交叉表）创建和编辑
- 图表生成
- 文件上传支持（把本地文件传给 Claude 作为参考）
- 快捷键 `Ctrl + Option + C`（Mac）快速唤起 Claude

> 这是 AI 首次以加载项形式深度嵌入 Excel，不再需要复制粘贴到浏览器。

---

### 2026年2月5日 — PowerPoint 加载项发布 + Excel 重大升级

两件大事同时落地：PowerPoint 加载项上线，Excel 也迎来能力跃升。

**PowerPoint 加载项：**
- 在 PPT 内直接用 Claude 创建、编辑幻灯片
- 支持从 Excel 数据生成演示文稿

**Excel 升级内容：**
- 模型升级到 Opus 4.6（更强的推理能力，适合复杂财务模型）
- 原生操作（Native Actions）上线——Claude 不再只是"建议你怎么改"，而是直接在表格里执行操作：
  - 数据透视表编辑
  - 条件格式（Conditional Formatting，根据规则自动变色/标记的格式）设置

> 从"AI 助手"升级为"AI 操作员"，能直接动手改表格了。

---

### 2026年3月11日 — 跨应用协作 + Skills + 企业级网关

这一版把产品从"单点工具"推向"平台级能力"。

**跨应用上下文共享：**
- Excel 和 PowerPoint 之间打通，Claude 能同时理解两个应用里的内容
- 典型场景：Excel 里更新了数据，PPT 里的图表自动同步

**Skills（技能系统）：**
- 内置技能：预设的常用操作流程
- 自定义技能：用户可以定义自己的操作模板，让 Claude 重复执行

**LLM Gateway（大模型网关）：**
- 企业客户可以通过自己的云平台接入 Claude，数据不经过 Anthropic 服务器：
  - Amazon Bedrock
  - Google Vertex AI
  - Azure AI Foundry

> 企业级客户最关心的数据安全问题，这一版正式解决。

---

### 近期动态

| 事项 | 说明 |
|------|------|
| Sonnet 4.6 集成 | 新增快速响应模型，日常轻量任务不用调 Opus |
| 双倍用量促销 | 限时活动，至 2026年3月19日截止 |
| Pro 计划开放 PPT | 个人专业版用户也能用 PowerPoint 加载项了 |

## 演进趋势

```
Excel 单应用 → 加入 PPT → 跨应用联动 → 企业级部署
   (2025.11)    (2026.02)    (2026.03)       (2026.03)
```

每一步都在扩大适用范围：从个人用户的 Excel → 团队的 Office 全家桶 → 企业的私有化部署。

## 相关页面

- [[产品全景]] — 产品整体介绍
- [[Excel核心功能]] — Excel 里具体能做什么
- [[跨应用协作]] — Excel 和 PPT 联动的详细说明
