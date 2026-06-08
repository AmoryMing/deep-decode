---
title: Anthropic financial-services repository
type: source
created: 2026-05-12
updated: 2026-05-12
tags: [Anthropic, financial-services, MCP, managed-agents, business]
---

# Anthropic financial-services repository

## 一手出处

- [Anthropic financial-services GitHub repository](https://github.com/anthropics/financial-services)
- [frxiaobei X post](https://x.com/frxiaobei/status/2053861985008431398)

## 核心事实

- 仓库面向金融服务工作流，README 将内容定义为 reference agents, skills, and data connectors。
- 同一套来源可以两种方式使用：作为 Claude Cowork plugin 安装，或通过 Claude Managed Agents API 部署到企业自己的 workflow engine 后面。
- README 列出多个 named workflow agents，如 Pitch Agent、Meeting Prep Agent、Market Researcher、Earnings Reviewer、Model Builder、Valuation Reviewer、GL Reconciler、Month-End Closer、Statement Auditor、KYC Screener。
- README 列出 vertical plugins：financial-analysis、investment-banking、equity-research、private-equity、wealth-management、fund-admin、operations，以及 partner-built 的 LSEG、S&P Global 插件。
- README 列出 11 个 MCP data connectors：Daloopa、Morningstar、S&P Global、FactSet、Moody's、MT Newswires、Aiera、LSEG、PitchBook、Chronograph、Egnyte。
- 仓库包含 `claude-for-msft-365-install/`，用于为 Excel、PowerPoint、Word、Outlook 中的 Claude 部署 Microsoft 365 add-in，并可对接 Vertex AI、Bedrock 或内部 LLM gateway。

## 角度

这不是“金融 demo”，而是行业 agent 的样板间。Anthropic 把业务线、技能包、命令、连接器和部署方式放在一个仓库里，给企业和集成商一个可修改的第一版默认结构。

## 盲区

- README 明确声明不构成投资、法律、税务或会计建议，所有输出需要 qualified professional 审核。
- 仓库显示的是参考模板，不等于某家金融机构已正式上线。

## 关联

- [[managed-agents-architecture]]
- [[harness-engineering]]
- [[enterprise-content-ops]]
