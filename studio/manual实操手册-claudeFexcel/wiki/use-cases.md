---
title: 场景化 Prompt 大全
sources:
  - Anthropic 官方文档 — Use Cases
  - Claude for Excel Prompt 库
links_to:
  - "[[Excel核心功能]]"
  - "[[PowerPoint核心功能]]"
  - "[[最佳实践]]"
linked_from:
  - "[[产品全景]]"
  - "[[Skills技能系统]]"
last_updated: 2026-04-10
---

# 场景化 Prompt 大全

按使用场景分类的即用 Prompt 集合。每条 Prompt 附中文说明和英文原始指令——直接复制英文部分粘贴到 Claude for Excel 聊天框即可使用。方括号 `[...]` 里的内容替换成你的实际情况。

---

## 财务建模

### 建模

| 中文说明 | Prompt |
|----------|--------|
| 三表联动财务模型 | Build a 3-statement financial model for [company/industry] |
| SaaS 指标模型（ARR、流失率、客户终身价值） | Create a SaaS metrics model with ARR, churn, and LTV calculations |
| 杠杆收购（LBO）模型 | Build an LBO model with debt schedules and returns analysis |
| 房地产投资测算 | Create a real estate pro forma for a multifamily acquisition |

### 预测

| 中文说明 | Prompt |
|----------|--------|
| 12 个月收入预测 | Build a 12-month revenue forecast using historical trends |
| 人力规划（按目标客户数反推人头） | Create a headcount capacity plan based on target client count |
| 三年现金流预测 | Model cash flow projections for the next 3 years |

### 情景分析

| 中文说明 | Prompt |
|----------|--------|
| 下行场景（收入跌 15%） | Add a downside case assuming revenue drops 15% |
| 乐观 / 基准 / 悲观三种场景 | Create base, bull, and bear scenarios with different growth assumptions |
| 敏感性分析表（IRR vs 退出倍数 vs 持有期） | Build a sensitivity table showing IRR across exit multiples and hold periods |

---

## 数据分析

### 洞察发现

| 中文说明 | Prompt |
|----------|--------|
| 年度趋势对比 | What trends stand out in 2025 vs 2024? |
| Top 10 客户及增长率 | Identify the top 10 customers by revenue and their growth rates |
| 品类预算差异分析 | Which product categories are underperforming vs budget? |

### 差异分析

| 中文说明 | Prompt |
|----------|--------|
| 预算差异解释 | Compare actuals to budget and explain the largest variances |
| 月度异常账户 | Which accounts have unusual changes vs prior month? |
| 两表核对找差异 | Reconcile these two sheets and highlight discrepancies |

### 分类打标

| 中文说明 | Prompt |
|----------|--------|
| 费用分类 | Categorize these transactions into expense types |
| 客户反馈情感 + 主题标签 | Tag customer feedback by sentiment and topic |
| 线索转化评分 | Score each lead based on likelihood to convert |

---

## 数据清洗

### 格式标准化

| 中文说明 | Prompt |
|----------|--------|
| 日期格式统一 | Convert all dates to YYYY-MM-DD format |
| 电话号码格式统一 | Standardize phone numbers to +1 (XXX) XXX-XXXX |
| 公司名清洗（去掉 Inc/LLC/Ltd 等后缀） | Clean up company names (remove Inc, LLC, Ltd variations) |

### 质量修复

| 中文说明 | Prompt |
|----------|--------|
| 去重（保留最新记录） | Find and remove duplicate rows, keeping the most recent |
| 编码错误修复（unicode/乱码） | Identify and fix unicode/encoding errors |
| 缺失值智能填充 | Fill missing values based on patterns in the data |

### 解析转换

| 中文说明 | Prompt |
|----------|--------|
| 从邮箱域名提取公司名 | Extract company name from email domain |
| 地址拆分为街道/城市/州/邮编 | Split full address into street, city, state, zip columns |
| 透视表展平为明细表 | Convert this pivot table into a flat data table |

---

## 公式

### 排错

| 中文说明 | Prompt |
|----------|--------|
| 查找所有 #REF 和 #VALUE 错误 | Find all #REF and #VALUE errors in this workbook |
| 追溯某个单元格的错误原因 | Why is cell B4 showing an error? Trace the issue |
| SUMIF 结果不对，帮我排查 | This SUMIF isn't returning the right result — what's wrong? |

### 解释

| 中文说明 | Prompt |
|----------|--------|
| 用大白话解释公式含义 | Explain what this formula does in plain English |
| 回溯单元格的输入源 | Trace this cell back to its source inputs |
| 整个工作表的公式文档化 | Document all the formulas on this sheet |

### 创建

| 中文说明 | Prompt |
|----------|--------|
| 计算库存周转天数 | Write a formula to calculate days of inventory from this data |
| VLOOKUP 从价格表取价 | Create a VLOOKUP that pulls price from the rate table |
| 逾期发票自动标记 | Build a formula that flags overdue invoices |

---

## 仪表板和报表

### 仪表板

| 中文说明 | Prompt |
|----------|--------|
| 高管看板（汇总所有工作表） | Create an executive dashboard summarizing all worksheets |
| KPI 记分卡（收入、利润率、增长） | Build a KPI scorecard with revenue, margins, and growth metrics |
| 互动摘要（图表 + 核心指标） | Make an interactive summary with key charts and metrics |

### 报表

| 中文说明 | Prompt |
|----------|--------|
| 月度财务摘要（从总账数据） | Generate a monthly financial summary from the GL data |
| 董事会级损益表（含差异说明） | Create a board-ready P&L with variance commentary |
| 区域数据汇总为全公司报表 | Consolidate regional sheets into a company-wide report |

### 图表

| 中文说明 | Prompt |
|----------|--------|
| 收入桥接瀑布图 | Create a waterfall chart showing revenue bridge |
| 组合图（收入柱状 + 利润率折线） | Build a combo chart with revenue bars and margin line |
| 留存热力图（按 cohort 分组） | Make a cohort retention heatmap from this data |

---

## 格式化

### 专业样式

| 中文说明 | Prompt |
|----------|--------|
| 投行格式（蓝色=输入，黑色=公式） | Format this model using IB conventions (blue inputs, black formulas) |
| 添加表头、边框、数字格式 | Add headers, borders, and proper number formats |
| 全表统一格式 | Apply consistent formatting across all sheets |

### 条件格式

| 中文说明 | Prompt |
|----------|--------|
| 负值标红 | Highlight negative values in red |
| 按状态色标（绿/黄/红） | Color-code rows by status (green/yellow/red) |
| 数据条显示相对表现 | Add data bars to show relative performance |

---

## 模型审计

| 中文说明 | Prompt |
|----------|--------|
| 跨表公式链接检查 | Check that all formulas link correctly across sheets |
| 资产负债表平衡验证 | Verify the balance sheet balances in all periods |
| 硬编码值检测（应该是公式的地方写死了数字） | Find any hardcoded values that should be formulas |
| 模型结构简化建议 | How can I simplify this model structure? |
| 估值模型缺失项检查 | What's missing from this valuation model? |

---

> 相关页面：[[Excel核心功能]]、[[PowerPoint核心功能]]、[[最佳实践]]
