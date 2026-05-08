---
title: 限制与安全 — Claude for Excel / PowerPoint
sources:
  - Anthropic 官方文档
  - Claude for Excel 安全白皮书
  - Claude 使用政策
links_to:
  - "[[最佳实践]]"
  - "[[故障排除]]"
  - "[[产品全景]]"
linked_from:
  - "[[安装与配置]]"
  - "[[最佳实践]]"
  - "[[故障排除]]"
  - "[[企业部署]]"
last_updated: 2026-04-10
---

# 限制与安全 — Claude for Excel / PowerPoint

## 数据处理

- 你输入给 Claude 的内容和 Claude 的输出，会在后端服务器上保留最多 **30 天**，之后自动删除
- 你最近关闭的文档中的数据，可能在内存中缓存**数小时**（不是永久保存）
- 聊天记录**不会**在不同会话之间保存 — 关掉窗口就没了。Team 和 Enterprise 计划也一样，没有聊天历史

## 缺失功能

以下功能目前**不支持**：

| 功能 | 说明 |
|------|------|
| 可观测性（Observability） | 无法监控 Claude 的内部推理过程 |
| 审计功能（Audit） | 无操作日志可供审计 |
| 自定义数据保留 | 不继承你组织设置的数据保留策略 |
| Enterprise 审计日志 | Claude for Excel 的操作不出现在 Enterprise 的审计日志或 Compliance API（合规接口）中 |
| 数据表（Data Tables） | Excel 的数据表功能不支持 |
| 宏（Macros） | 不支持 VBA 宏 |
| VBA | 不支持 Visual Basic for Applications 编程 |

## 不推荐用于以下场景

> 核心原则：Claude 是助手，不是决策者。所有输出都需要人工审查。

- **未经人工审查的最终客户交付物** — Claude 可能犯错，直接发给客户有风险
- **未经验证的审计关键计算** — 涉及审计的数字必须人工复核
- **替代用户的财务判断** — Claude 不理解你的业务背景和风险偏好
- **无适当控制的高度敏感/受监管数据** — 金融、医疗等受监管行业数据需要额外的安全措施

## 不支持的版本

以下版本**无法使用** Claude 加载项：

- Excel / PowerPoint 2016 / 2019（永久许可证 / 批量许可证版本）
- Excel on Android（安卓版 Excel）
- PowerPoint on iPad / Android
- 低于 SharedRuntime（共享运行时）阈值的旧版 Microsoft 365

> 简单说：只有较新的 Microsoft 365 订阅版才能用。买断制的 Office 和手机/平板版基本不行。

## 用量限制

Claude 有两种限制，容易混淆，这里说清楚：

### Usage Limits（用量限制）

控制你在**一段时间内**能和 Claude 交互多少次，可以理解为"对话预算"。

- 不同付费计划额度不同（Pro < Max < Team < Enterprise）
- **跨平台共享**：你在 claude.ai、Claude Code、Claude Desktop 用的额度是同一个池子
- 用完了怎么办？等下个周期重置、升级计划、或购买额外额度

### Length Limits（长度限制）

控制**单次对话**能处理多少内容，用 token（令牌，AI 的计量单位，约等于 0.7 个中文字）衡量。

| 计划 | 上下文窗口 |
|------|-----------|
| 标准付费（Pro/Max/Team） | 200K tokens（约 14 万中文字） |
| Enterprise | 最高 500K tokens（约 35 万中文字） |

超出长度限制怎么办？开一个新对话，或者用 Projects（项目功能）把大数据集拆分管理。

### 优化策略

想让额度用得更久？试试这些：

- 用 **Projects + RAG**（检索增强生成）处理大数据集，而不是把所有数据塞进对话
- 保持项目指令（Instructions）**简洁明了**，别写小作文
- 定期清理不再使用的项目文件
- 不需要时**关闭**以下功能：扩展思考（Extended Thinking）、网络搜索（Web Search）、Research、MCP 连接器

## 提示注入攻击风险（Prompt Injection）

### 这是什么

提示注入（Prompt Injection）是一种攻击方式：恶意用户在电子表格的单元格里藏入特殊指令，诱骗 Claude 执行非预期操作。就像在快递包裹里塞了一张假的"退货到我地址"通知单。

### 关键警告

> **只在可信的电子表格中使用 Claude。不要用来自外部不可信来源的文件。**

以下都算"不可信来源"：
- 从网上下载的模板
- 供应商发来的文件
- 多人协作的共享文档
- 从外部系统导入的数据

### 恶意指令可能造成的危害

- 通过公式、网络搜索或文件系统访问**提取和分享敏感信息**
- **修改关键财务数据**（改个数字你可能都察觉不到）
- **未经验证执行破坏性操作**

### 受保护的操作

Claude 在执行以下高风险函数时，会**弹出确认窗口**让你手动批准：

| 类别 | 函数 |
|------|------|
| 外部数据获取 | WEBSERVICE, STOCKHISTORY, STOCKSERIES, TRANSLATE, CUBE |
| 外部导入 | IMPORTDATA, IMPORTXML, IMPORTHTML, IMPORTFEED, FILTERXML |
| 动态引用 | INDIRECT |
| 命令执行 | DDE |
| 代码执行 | CALL, EVALUATE, FORMULA |
| 文件系统访问 | IMAGE, FILES, DIRECTORY, FOPEN, FWRITE, FCLOSE |
| 系统信息 | REGISTER.ID, RTD, INFO |

> 看到确认弹窗时，仔细看清楚 Claude 要执行什么操作，不确定就点"拒绝"。

---

相关页面：[[最佳实践]] · [[故障排除]] · [[产品全景]]
