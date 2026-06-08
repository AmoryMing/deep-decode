---
title: MCP Connector 生态
type: concept
created: 2026-04-30
updated: 2026-04-30
tags: [mcp, connector, ecosystem, anthropic]
---

# 概念

MCP（Model Context Protocol）是 Anthropic 在 2024 末发布的开放协议，定义 LLM 与外部工具之间的数据/能力接口。**Connector** 是 MCP 在 Claude 产品里的封装态——Anthropic 替用户做完了"鉴权 + 工具描述 + 调用编排"三件事，用户在 Claude.ai 一键开关。

## 协议层 vs 应用层

- **协议层（MCP server）**：开发者跑自己的 server（Python/TS SDK），定义工具，需要走 Claude Desktop / Cline / Cursor 等 host
- **应用层（Claude connector）**：用户在 Claude.ai 直接连，零本地部署。Adobe/Notion/Slack/Google Drive 等是 connector 形态

## 已知 connector 时间线（不完全）

- 早期：Notion / Slack / Google Drive / Google Calendar / GitHub
- 企业向：Linear / Asana / Atlassian
- 2026-04-28：Creative Connectors 9 件套 — Adobe / Ableton / Splice / Affinity by Canva / Autodesk Fusion / Blender / SketchUp / Resolume Arena / Resolume Wire

## 战略含义

- Anthropic 用 connector 矩阵把 MCP "既成事实化"，不再依赖第三方布道
- Connector 把"AI 助手 + 专业工具"的标准接口卡位定义在 Claude 这边
- 没接入的工具（如 Figma）= 拒绝做被调用方 = 平行竞争

## 关联

- [[blender-development-fund]] — Anthropic 借 connector 进生态，又靠捐款反哺
- 见 sources/[[2026-04-28-claude-creative-connectors]]
