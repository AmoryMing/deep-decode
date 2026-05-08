---
title: 连接器（MCP）
sources:
  - Anthropic 官方文档 — Connectors
  - MCP（Model Context Protocol）规范
links_to:
  - "[[企业部署]]"
  - "[[限制与安全]]"
  - "[[安装与配置]]"
linked_from:
  - "[[产品全景]]"
  - "[[Skills技能系统]]"
last_updated: 2026-04-10
---

# 连接器（MCP）

## 连接器是什么

连接器让 Claude for Excel 能读取外部工具和数据源的信息，直接在表格里使用。你不需要手动复制粘贴数据，Claude 通过连接器自动从外部系统拉数据进来。

底层技术是 MCP（Model Context Protocol，模型上下文协议）——Anthropic 发布的开放标准，专门解决"AI 应用怎么跟外部工具/数据对接"这个问题。你可以把它理解成一个统一的插口规范，只要按这个规范做的工具，Claude 都能接上。

## 已集成的数据供应商

以下是官方已经对接好的数据源，直接用就行：

| 供应商 | 说明 |
|--------|------|
| S&P Global | 标普全球，金融数据 |
| LSEG | 伦敦证券交易所集团，市场数据 |
| Daloopa | 财务数据自动化 |
| Pitchbook | 私募/VC 投资数据 |
| Moody's | 穆迪，信用评级和风险数据 |
| FactSet | 金融分析数据平台 |

## 添加自定义连接器

### Team / Enterprise 管理员操作

管理员可以为整个组织添加连接器，成员一键连接即可：

1. 进入 **Organization settings > Connectors**
2. 点 **"Add"** → 选 **"Custom"** → 选 **"Web"**
3. 输入远程 MCP 服务器的 URL（服务器地址）
4. 可选：填写 OAuth Client ID 和 Secret（用于身份认证）
5. 点 **"Add"** 完成

成员连接管理员添加的连接器：**Customize > Connectors** → 找到对应连接器 → 点 **"Connect"** 完成认证。

### Pro / Max 个人用户操作

个人用户自己加连接器：**Customize > Connectors** → 点 **"+"** → **"Add custom connector"** → 输入 MCP 服务器 URL。

### 启用 / 禁用连接器

在聊天界面点 **"+"** 按钮 → **"Connectors"**，用开关切换每个连接器的启用状态。

## 网络要求

MCP 服务器必须从 Anthropic 的云基础设施可访问，也就是说服务器要**公网可达**。如果你的 MCP 服务器在公司内网、需要 VPN 才能访问，或者有防火墙拦截，Claude 是连不上的。

## 安全注意事项

连接器本质上是让 Claude 访问外部系统，安全风险需要重视：

- **只连接你信任的服务器** — 不明来源的 MCP 服务器可能窃取数据
- **仔细审查 OAuth 权限** — 看清楚授权了哪些访问权限，不要随手全部同意
- **监控工具行为** — 留意连接器是否有异常的数据读写
- **注意 Prompt 注入攻击** — 外部数据可能包含恶意指令，误导 Claude 执行不当操作
- **谨慎使用 "Allow always"** — 先审查工具请求的具体操作，再决定是否永久授权

## 第三方平台功能对比

Claude for Excel 既可以通过 Claude 官方账号使用，也可以通过第三方平台（如 Google Cloud Vertex AI）接入。两种方式的功能差异：

| 功能 | Claude 账号 | 第三方平台 |
|------|------------|------------|
| 聊天 / 读写表格 | 支持 | 支持 |
| 连接器 | 支持 | 即将推出 |
| 跨应用协作 | 支持 | 不支持 |
| Skills（技能） | 支持 | 即将推出 |
| 文件上传 | 支持 | 不支持 |
| 网络搜索 | 支持 | 仅 Vertex AI |

> 相关页面：[[企业部署]]、[[限制与安全]]、[[安装与配置]]
