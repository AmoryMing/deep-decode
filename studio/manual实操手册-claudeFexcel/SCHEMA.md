# Claude for Excel 实操手册 - Wiki Schema

## 项目目标
将 Anthropic 官方 "Claude for Excel & PowerPoint" 指南编译为高质量中文实操手册。

## 目录结构

```
context/          # 原始素材（不可变，LLM 只读）
  01-main-guide.md
  02-llm-gateway.md
  03-skills.md
  04-custom-connectors-mcp.md
  05-usage-length-limits.md
  06-powerpoint.md
  07-cross-app.md
  08-release-notes-office.md

wiki/             # LLM 生成的知识页面（LLM 读写）
  index.md        # 全部页面索引
  log.md          # 操作日志
  overview.md     # 产品全景
  getting-started.md    # 安装与配置
  excel-features.md     # Excel 核心功能
  ppt-features.md       # PowerPoint 核心功能
  cross-app.md          # 跨应用协作
  connectors.md         # 连接器（MCP）
  skills.md             # Skills 技能系统
  enterprise.md         # 企业部署（LLM Gateway）
  use-cases.md          # 场景化 Prompt 大全
  limitations.md        # 限制与安全
  troubleshooting.md    # 故障排除
  best-practices.md     # 最佳实践
  timeline.md           # 产品演进时间线

deliverable/      # 最终交付物
  manual.md       # 完整实操手册（中文）
```

## 页面规范

### Frontmatter
每个 wiki 页面以 YAML frontmatter 开头：
```yaml
---
title: 页面标题
sources: [01-main-guide.md, 02-llm-gateway.md]  # 引用的原始素材
links_to: [getting-started, excel-features]       # 出链
linked_from: [overview]                           # 入链
last_updated: 2026-04-10
---
```

### 内容要求
- 全中文，技术术语保留英文原文并括号注释
- 每个概念用大白话解释，假设读者是非技术背景的产品/运营人员
- 操作步骤带序号，关键点加粗
- 交叉引用用 [[wiki链接]] 格式

### 交叉引用规则
- 提到其他页面主题时必须加 [[链接]]
- 每个页面至少有 1 个入链和 1 个出链
- orphan 页面（无入链）在 lint 时标记

## 工作流

### Ingest（摄入）
1. 读原始素材
2. 提炼关键信息，写入/更新对应 wiki 页面
3. 更新 index.md
4. 追加 log.md

### Query（查询）
读 index.md 找到相关页面 → 读页面内容 → 综合回答

### Lint（检查）
检查：矛盾、过期、孤儿页、缺失交叉引用、数据空缺
