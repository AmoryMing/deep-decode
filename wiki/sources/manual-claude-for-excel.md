---
title: Claude for Excel/PowerPoint 实操手册（编译类长文）
type: source
created: 2026-04-25
updated: 2026-04-25
tags: [methodology, manual-mode, content-type]
source_path: raw/vault/.../manual实操手册-claudeFexcel/
status: completed
---

# Claude for Excel 实操手册

## 性质

vault 里唯一的一份完整长篇 manual（实操手册）类内容。源是 Anthropic 官方"Claude for Excel & PowerPoint"指南，编译为高质量中文实操手册，**面向非技术背景的产品/运营/财务人员**。

## 工作流（与 decode 完全不同）

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

wiki/             # LLM 生成的中间知识页（LLM 读写）
  index.md / log.md / overview.md / getting-started.md / excel-features.md / ...

deliverable/
  manual.md       # 最终交付物：完整中文实操手册
```

3 阶段：
1. **Ingest**：读原始素材 → 提炼关键信息 → 写入对应 wiki 页 → 更新 index 和 log
2. **Query**：读 index → 找相关页 → 综合回答
3. **Lint**：检查矛盾 / 过期 / 孤儿页 / 缺失交叉引用 / 数据空缺

## 页面规范

### Frontmatter
```yaml
---
title: 页面标题
sources: [01-main-guide.md, 02-llm-gateway.md]
links_to: [getting-started, excel-features]
linked_from: [overview]
last_updated: 2026-04-10
---
```

### 内容要求
- 全中文，技术术语保留英文原文并括号注释
- 每个概念用大白话解释（**假设读者是非技术背景的产品/运营人员**）
- 操作步骤带序号，关键点加粗
- 交叉引用用 [[wiki链接]] 格式
- 截图标注用 `> **截图 X-Y：描述** ![path](screenshots/...)` 格式

## 与 decode 的关键区别

| 维度 | decode | manual |
|---|---|---|
| 目的 | 拆解一个观点/事件/产品 | 教读者操作一个工具 |
| 钩子要求 | 必须有钩子（A.7 第 1 项） | 不需要钩子（manual 不靠诱读，靠工具书价值） |
| 盲区段 | 必有 | 通常没有，被"限制与安全"章节吸收 |
| 读者落地段 | 必有，多身份 | 通常以 Q/A 或场景化 Prompt 大全形式 |
| 概念命名 | 5-8 个原创命名 | 不命名，沿用官方术语 + 中文翻译 |
| 篇幅 | 3000-8000 字 | 5000-30000 字（完整覆盖产品） |
| 章节结构 | 8 章模板 | 13+ 章按"全景→安装→功能 1→功能 2→进阶→限制→排错→演进"分 |

## 在 playbook 的位置

A.3 / A.7 / B.1 都不适用于 manual。manual 是独立 mode（已写入 playbook B.2 mode 表）。

manual 的章节模板更接近"工具书"——不是"叙事驱动"，是"导航驱动"——读者按需跳读，不需要从头读到尾。

## 关联

- [[content-strategy]] —— 总体内容策略
- [[horizontal-vertical-analysis]] —— 与 entity decode 的对照（manual 教用，entity 拆研究对象）

## 用途

下次需要写 manual 类内容时直接参考此 SCHEMA + 页面规范，不要再造。
