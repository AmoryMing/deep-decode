---
title: 跨应用协作 — Excel 与 PowerPoint 联动
sources:
  - Anthropic 官方跨应用指南
  - Claude for Excel/PowerPoint 产品文档
links_to:
  - "[[Excel核心功能]]"
  - "[[PowerPoint核心功能]]"
  - "[[安装与配置]]"
linked_from:
  - "[[产品全景]]"
  - "[[Excel核心功能]]"
  - "[[PowerPoint核心功能]]"
last_updated: 2026-04-10
---

# 跨应用协作 — Excel 与 PowerPoint 联动

Claude 可以在 Excel 和 PowerPoint 两个加载项之间协调工作：从一个应用读取数据，在另一个应用中修改，不需要你手动复制粘贴。

---

## 前提条件

使用跨应用协作需要满足以下全部条件：

| 条件 | 说明 |
|------|------|
| 付费计划 | Pro、Max、Team 或 Enterprise |
| 两个加载项都装好 | 从 Microsoft Marketplace 安装 Claude for Excel 和 Claude for PowerPoint，各激活至少一次 |
| 开启跨应用开关 | 在每个应用的 Settings 中打开 "Let Claude work across files" |
| 管理员授权（Team/Enterprise） | 组织管理员需在组织级别先启用此功能，个人用户才能打开 |

开启后，你会看到连接文件指示器（Connected File Indicator），显示 Excel 或 PowerPoint 文件已关联到当前会话。

---

## 工作方式

跨应用协作的核心逻辑：

1. **Claude 同时使用两个加载项** — 读取 Excel 中的数据，写入 PowerPoint 中的幻灯片（反过来也行）
2. **自动传递上下文** — Claude 在 Excel 中已经理解了你的模型结构、关键输出和假设，切换到 PowerPoint 时不需要你重新解释一遍
3. **你留在一个应用就行** — 你在 PowerPoint 里对 Claude 说"把 Excel 模型里的收入数据做成图表"，Claude 自己去 Excel 读数据再回来做图表

---

## 核心能力

### 跨文件读写

从 Excel 拉数字到 PowerPoint 幻灯片，或者用 PowerPoint 中确认的最新数据反向更新 Excel 图表。

**典型场景：**
- "把 Excel 模型中的 Q3 收入预测做成 PPT 图表"
- "用 Excel 里最新的财务数据更新这张幻灯片的图表"
- "从 Excel 的敏感性分析表拉数据，在 PPT 里做一张总结"

### 上下文传递

Claude 在 Excel 中已经理解的内容 -- 模型结构、关键产出、假设逻辑 -- 切换到 PowerPoint 时会自动携带。你不需要重新描述"收入在哪个 Sheet""增长率是什么公式"这些背景。

**实际体验：**
- 在 Excel 中分析完财务模型后，直接说"帮我做个汇报 PPT"
- Claude 会基于已有的理解，自动选择关键数据点放入幻灯片

### Skills 跨应用生效

在 Claude 设置中启用的 Skills（技能）在跨应用工作时同样生效。比如：
- 建模规范（如投行格式）在 Excel 和 PPT 中都会执行
- 模板匹配规则在跨应用操作时自动应用

---

## 当前限制

| 限制 | 说明 |
|------|------|
| 只能访问当前打开的文件 | Claude 看不到你没打开的 Excel 或 PPT 文件 |
| 不能创建、打开、关闭或切换文件 | Claude 无法帮你新建文件或打开另一个文件，你需要自己操作 |
| 跨应用聊天记录不保留 | 关闭后重新打开，之前的跨应用对话历史丢失 |
| 数据保留期 | 输入和输出在 Anthropic 后台 30 天内自动删除 |

---

## 管理员控制

Team 和 Enterprise 计划的组织管理员可以统一管理跨应用权限：

**路径：** Organization settings > Capabilities > Integration permissions

在这里可以开关 "Let Claude work across apps"，控制组织内所有用户是否可以使用跨应用功能。个人用户的开关受组织级别设置约束 -- 组织关了，个人打不开。

---

## 常见问题排查

| 问题 | 解决方法 |
|------|----------|
| 看不到另一个应用的文件 | 确认两个加载项都已激活，且 Settings 中跨应用开关已打开 |
| 修改没出现在目标文件 | 等 Claude 完成操作，然后检查目标文件；可能需要刷新页面 |
| 开关灰色不可点击 | Team/Enterprise 用户请联系组织管理员先在组织级别启用 |

---

## 相关页面

- [[Excel核心功能]] — Excel 里具体能做什么
- [[PowerPoint核心功能]] — PPT 里具体能做什么
- [[安装与配置]] — 怎么安装和配置加载项
