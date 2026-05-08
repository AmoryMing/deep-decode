---
title: MCP（Model Context Protocol）
type: concept
sources: [../../context/claude-code-best-practice/best-practice/claude-mcp.md]
created: 2026-04-10
updated: 2026-04-10
tags: [mcp, 扩展层, 核心概念]
---

# MCP（Model Context Protocol）

## 一句话定义

MCP 是让 Claude 连接外部工具、数据库和 API 的标准协议——相当于给 Claude 装"插头"，插上不同的 MCP Server 就能用不同的外部能力。

## 大白话解释

Claude 本身只能读写文件、执行命令。如果你想让它操作浏览器、查数据库、调第三方 API，就需要通过 MCP Server。每个 MCP Server 就是一个"适配器"，把外部工具翻译成 Claude 能理解的格式。

一个实际经验："装了 15 个 MCP Server 觉得越多越好，结果每天只用 4 个。" ——Reddit 高赞帖。

## 核心机制

### 推荐的日常 MCP Server（5 个）

| Server | 功能 | 场景 |
|--------|------|------|
| **Context7** | 拉取最新库文档 | 防止用过时 API |
| **Playwright** | 浏览器自动化 | 测试和验证 UI |
| **Claude in Chrome** | 连接真实 Chrome | 调试用户实际看到的页面 |
| **DeepWiki** | GitHub 仓库 wiki | 理解开源项目架构 |
| **Excalidraw** | 生成架构图 | 文档和沟通 |

工作流：Research（Context7/DeepWiki）→ Debug（Playwright/Chrome）→ Document（Excalidraw）

### 配置方式

项目级 `.mcp.json`（提交到 git）：
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

两种传输类型：
- **stdio**：启动本地进程（npx、python、binary）
- **http**：连接远程 URL

### 三个作用域

| 范围 | 位置 | 用途 |
|------|------|------|
| 项目级 | `.mcp.json` | 团队共享，提交到 git |
| 用户级 | `~/.claude.json` | 个人全局配置 |
| Agent 级 | agent frontmatter 的 `mcpServers` 字段 | 特定 agent 专属 |

优先级：Agent > 项目 > 用户

### 权限控制

MCP 工具遵循 `mcp__<server>__<tool>` 命名规则：
```json
{
  "permissions": {
    "allow": ["mcp__context7__*"],
    "deny": ["mcp__dangerous-server__*"]
  }
}
```

## 与其他概念的关系

- **[[Settings]] 控制审批**：`enableAllProjectMcpServers` 自动审批所有项目 MCP
- **[[Subagents]] 专属 MCP**：每个 agent 可以有自己的 MCP Server 配置
- **[[Plugins]] 包含 MCP**：Plugin 是 Skills + Agents + Hooks + MCP 的打包分发

## 实操要点

1. **不要贪多**：4-5 个日常够用，多了反而干扰
2. **密钥用环境变量**：`${MCP_API_TOKEN}` 而不是明文写在 .mcp.json
3. **用 `enableAllProjectMcpServers`** 避免每次启动都要确认
