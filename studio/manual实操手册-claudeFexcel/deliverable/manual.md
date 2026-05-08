# Claude for Excel / PowerPoint 实操手册

> 基于 Anthropic 官方文档编译，适用于非技术背景的产品、运营、财务人员。
> 最后更新：2026-04-13

---

## 目录

1. [产品全景](#1-产品全景)
2. [安装与配置](#2-安装与配置)
3. [Excel 核心功能](#3-excel-核心功能)
4. [PowerPoint 核心功能](#4-powerpoint-核心功能)
5. [跨应用协作](#5-跨应用协作)
6. [连接器（MCP）](#6-连接器mcp)
7. [Skills 技能系统](#7-skills-技能系统)
8. [企业部署](#8-企业部署)
9. [场景化 Prompt 大全](#9-场景化-prompt-大全)
10. [最佳实践](#10-最佳实践)
11. [限制与安全](#11-限制与安全)
12. [故障排除](#12-故障排除)
13. [产品演进时间线](#13-产品演进时间线)

---

## 1. 产品全景

### 这个产品是什么

Claude for Excel 是一个 Excel 加载项（Add-in，装在 Excel 里的小插件），把 Claude AI 直接嵌入你日常用的 Excel 工作流。你不需要切换到浏览器问 AI，直接在表格里对话就行。

目前处于 beta（公测）阶段，支持以下付费计划：

| 计划 | 说明 |
|------|------|
| Pro | 个人专业版（$20/月） |
| Max | 个人高级版（$100+/月） |
| Team | 团队版 |
| Enterprise | 企业版 |

同时还有一个 PowerPoint 加载项，两者可以跨应用协作 -- 比如 Excel 里算好的数据，直接让 Claude 帮你生成 PPT 图表。

**支持的 AI 模型：** Sonnet 4.6（快速响应）和 Opus 4.6（深度推理）

**支持的文件格式：** .xlsx 和 .xlsm（含宏的工作簿）

> **截图 1-1：Claude for Excel 侧边栏整体界面**
> `![Claude 侧边栏](screenshots/01-sidebar-overview.png)`
> 拍摄要求：打开一个有数据的 Excel 表格，右侧显示 Claude 侧边栏，能看到对话区和输入框

### 能帮你做什么

| 能力 | 一句话说明 |
|------|----------|
| 工作簿问答 | 对着打开的表格提问，Claude 引用具体单元格位置回答 |
| 安全更新假设 | 改参数时保留公式依赖关系，不搞坏下游公式 |
| 调试错误 | 定位 #REF!、#VALUE!、循环引用等报错的根因并修复 |
| 从零建模 | 一句话描述需求，搭出完整财务模型 |
| 填充模板 | 上传数据源，自动映射到模板对应位置 |
| 导航多标签页 | 跨 Sheet 查找和操作数据 |
| 连接外部工具 | 通过 MCP 连接器从 S&P、FactSet 等平台拉数据 |
| 原生编辑格式化 | 排序、筛选、条件格式、数据验证、图表、打印设置 |

### 适合谁用

- **财务/FP&A 人员：** 建模、改假设、调试公式
- **数据分析师：** 快速问答、数据清洗、生成透视表
- **运营/产品经理：** 整理报表、填充模板、生成汇报 PPT
- **任何重度 Excel 用户：** 用自然语言替代复杂公式操作

---

## 2. 安装与配置

### 支持的版本

| 平台 | 最低版本要求 |
|------|------------|
| Excel / PPT 网页版 | 任意现代浏览器 |
| Excel / PPT Windows 版 | Microsoft 365，Build 16.0.13127.20296+ |
| Excel / PPT Mac 版 | Version 16.46+，Build 21011600+ |
| Excel iPad 版 | Version 2.51+ |

**不支持：** Excel 2016/2019 买断版、Android 设备、低版本 Microsoft 365

> 怎么查版本号：Excel → 文件 → 账户（Account）→ 关于 Excel（About Excel）

### 个人安装（3 步搞定）

**第 1 步：获取加载项**

1. 打开 Excel
2. 进入 Microsoft Marketplace（插入 → 获取加载项）
3. 搜索 **"Claude for Excel"**
4. 点击 **"Get it now"**

> **截图 2-1：Microsoft Marketplace 搜索 Claude for Excel**
> `![Marketplace搜索](screenshots/02-marketplace-search.png)`
> 拍摄要求：打开 Excel 的"获取加载项"窗口，搜索框输入 Claude，显示搜索结果

**第 2 步：激活加载项**

1. 回到 Excel，在功能区（Ribbon，顶部那排工具栏）找到 Claude 图标
2. 点击打开 Claude 面板

> **截图 2-2：Excel 功能区中的 Claude 图标**
> `![功能区图标](screenshots/02-ribbon-icon.png)`
> 拍摄要求：Excel 顶部功能区，箭头指向 Claude 图标位置

**第 3 步：登录**

用你的 Claude 账号（claude.ai 网站的账号）登录，即可开始使用。

> **截图 2-3：Claude 登录界面**
> `![登录界面](screenshots/02-login.png)`
> 拍摄要求：侧边栏显示登录界面

> PowerPoint 加载项安装流程完全一样，搜索时换成 "Claude for PowerPoint"。

### 管理员部署（批量安装）

**方法一：通过应用商店部署**

1. 打开 **Microsoft 365 Admin Center**（`admin.microsoft.com`）
2. 进入 Settings → Org Settings → User owned apps and services → 确保 Office Store 已启用
3. 进入 Settings → Integrated apps → Add-ins
4. 搜索 **"Claude by Anthropic for Excel"**
5. 选择部署范围（全组织 / 特定用户组）

**方法二：通过 Manifest XML 部署**（防火墙限制时）

1. 下载 Manifest 文件：`pivot.claude.ai/manifest-excel.xml`
2. Admin Center → Settings → Integrated apps → Upload custom apps
3. 上传 XML 文件，设置部署范围

### 跨应用协作设置

同时装了 Excel 和 PowerPoint 两个加载项后：

1. 打开 Claude 面板 → Settings
2. 找到 **"Let Claude work across files"** → 打开开关

> **截图 2-4：跨应用设置开关**
> `![跨应用设置](screenshots/02-cross-app-setting.png)`
> 拍摄要求：Claude 侧边栏的 Settings 页面，能看到跨应用开关

---

## 3. Excel 核心功能

### 3.1 读取和理解模型

对着打开的工作簿直接提问，Claude 能读取单元格内容、公式结构、多标签页之间的关系，并在回答中引用具体的单元格位置。

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 找到关键假设 | "Q3 收入预测的驱动假设是什么？" |
| 理解公式逻辑 | "解释 WACC 计算如何流入 DCF 模型" |
| 跨 Sheet 查找 | "哪些标签页引用了 Revenue 这个 Sheet？" |

**使用提示：**
- Claude 会标注单元格引用（如 B15、Sheet2!D3），点击可跳转
- 多标签页工作簿也能处理，Claude 会自动导航各 Sheet

> **截图 3-1：Claude 回答中的单元格引用**
> `![单元格引用](screenshots/03-cell-citations.png)`
> 拍摄要求：对话中 Claude 的回答包含可点击的单元格引用（蓝色链接样式）

### 3.2 安全更新假设

修改假设参数时，Claude 会维护公式依赖关系（Formula Dependencies，公式之间的引用链条）。改一个数不会把下游一串公式搞坏。

每次修改后 Claude 会：高亮所有被更新的单元格 + 解释每个变更的影响 + 保留原有公式结构和格式。

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 调整增长假设 | "把增长率提高 2%，展示对终值的影响" |
| 更新利率 | "根据最新美联储指引更新利率假设" |
| 场景分析 | "创建基础、乐观、悲观三种场景" |

> **截图 3-2：Claude 高亮变更后的单元格**
> `![高亮变更](screenshots/03-highlighted-changes.png)`
> 拍摄要求：表格中有黄色/蓝色高亮的单元格，旁边有 Claude 的变更说明

### 3.3 构建和填充模板

两种用法：

1. **从零建模** -- 一句话描述，Claude 从空白表格搭出完整模型（含公式、格式和标签页结构）
2. **填充现有模板** -- 上传数据源（PDF、其他 Excel），Claude 把数据映射到模板对应位置

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 从零建模 | "为 SaaS 公司构建三表模型" |
| 填充模板 | "用上传的 10-K 数据填充这个 DCF 模板" |
| 定制模型 | "建一个 LBO 模型，包含债务计划和回报分析" |

> **截图 3-3：Claude 从零构建的财务模型**
> `![从零建模](screenshots/03-model-from-scratch.png)`
> 拍摄要求：一个由 Claude 生成的多标签页财务模型，能看到公式和结构

### 3.4 调试和修复错误

| 错误类型 | 含义 | Claude 怎么帮 |
|----------|------|---------------|
| `#REF!` | 引用错误（被引用的单元格被删了） | 定位断裂的引用，建议修复路径 |
| `#VALUE!` | 值类型错误（文本和数字混算） | 找出类型不匹配的位置 |
| 循环引用 | A 引用 B、B 又引用 A 的死循环 | 画出引用链条，指出断环点 |

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 诊断单个错误 | "为什么这个 NPV 计算返回 #VALUE?" |
| 全局扫描 | "找出这个工作簿中所有循环引用" |

### 3.5 变更追踪和引用

Claude 操作工作簿时自动做两件事：

1. **高亮变更** -- 每个被更新的单元格高亮标记，附带解释性注释
2. **可点击引用** -- Claude 解释计算逻辑时，单元格引用可点击跳转

> **截图 3-5：Claude Log 标签页**
> `![操作日志](screenshots/03-claude-log-tab.png)`
> 拍摄要求：Excel 底部标签栏能看到"Claude Log"标签页，点开后显示操作记录

### 3.6 原生编辑和格式化

Claude 直接执行 Excel 原生操作（不是生成宏或 VBA）：

| 操作类型 | 说明 |
|----------|------|
| 排序和筛选（Sort/Filter） | 按条件排列、筛选数据 |
| 数据透视表（Pivot Table） | 修改字段、布局 |
| 图表（Chart） | 调整类型、数据范围、样式 |
| 条件格式（Conditional Formatting） | 根据条件自动变色、加图标 |
| 数据验证（Data Validation） | 设置下拉菜单、输入限制 |
| 打印设置（Print Setup） | 打印区域、网格线 |

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 排序 | "按收入降序排列这个表格" |
| 条件格式 | "低于目标阈值的单元格加红色" |
| 下拉菜单 | "状态列设置下拉：Active、Pending、Closed" |
| 投行格式 | "用 IB 惯例格式化（蓝色输入、黑色公式）" |

> **截图 3-6：条件格式效果**
> `![条件格式](screenshots/03-conditional-formatting.png)`
> 拍摄要求：表格中有条件格式效果（红绿色标、数据条等）

### 3.7 文档导入

Claude 可以从 PDF 提取表格数据导入 Excel，或从上传文档提取数据填入模板。

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| PDF 转 Excel | "从这个 PDF 中提取财务表格到 Excel" |
| 发票提取 | "把这张发票 PDF 的行项目拉到我的模板里" |

---

## 4. PowerPoint 核心功能

### 4.1 从模板构建

Claude 会先读取你演示文稿中的幻灯片母版（Slide Master）、布局、字体和配色方案，生成的每张幻灯片自动符合模板要求。

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 市场分析 | "创建市场规模分析 -- 3 张幻灯片涵盖 TAM、SAM、SOM" |
| 执行摘要 | "使用单栏布局添加执行摘要幻灯片" |
| 竞品对比 | "建一张竞品对比幻灯片，比较 4 家竞争对手" |

**使用提示：** 先打开包含母版和配色方案的模板文件，再让 Claude 生成内容。

> **截图 4-1：Claude 在 PowerPoint 中的侧边栏**
> `![PPT侧边栏](screenshots/04-ppt-sidebar.png)`
> 拍摄要求：PowerPoint 界面 + 右侧 Claude 侧边栏，正在编辑幻灯片

### 4.2 编辑现有幻灯片

选中某张幻灯片，用自然语言描述修改。Claude 会保留原有格式、字体、配色。

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 精简文字 | "简化这张幻灯片的文字" |
| 添加图表 | "添加展示季度趋势的图表" |
| 重构叙事 | "重构第 4-7 张幻灯片的故事线" |

### 4.3 生成完整演示文稿

从一段描述出发，一次性生成完整 PPT（结构、文字、图表、过渡页）。

| 你想做的事 | 对 Claude 说 |
|------------|-------------|
| 项目更新 | "构建内部项目更新演示，含时间线和后续步骤" |
| 融资路演 | "做一套 15 页的融资路演 PPT" |

### 4.4 原生图表和图形

Claude 生成的是**可编辑的原生 PowerPoint 对象**（不是截图或静态图片）。生成后你可以双击修改数据、调整样式、拖拽节点。

> **截图 4-4：Claude 生成的原生 PPT 图表**
> `![原生图表](screenshots/04-native-chart.png)`
> 拍摄要求：PPT 中一个由 Claude 生成的图表（柱状图或折线图），能看到是原生可编辑对象

### 4.5 模板感知

Claude 自动读取并遵循以下模板设置：

| 模板元素 | Claude 怎么用 |
|----------|--------------|
| 幻灯片母版 | 遵循全局样式 |
| 布局 | 选择合适的布局 |
| 字体 | 使用模板指定字体 |
| 配色方案 | 图表、文字颜色与模板一致 |

### 4.6 持久指令

在 PowerPoint 加载项的 Instructions 字段设置每次对话自动生效的偏好：

- "所有幻灯片标题用中文"
- "图表配色使用公司品牌色"
- "每张幻灯片正文不超过 5 个要点"

> PowerPoint 和 Excel 的持久指令分开管理，互不影响。

---

## 5. 跨应用协作

### 前提条件

| 条件 | 说明 |
|------|------|
| 付费计划 | Pro / Max / Team / Enterprise |
| 两个加载项都装好 | Excel 和 PowerPoint 各激活至少一次 |
| 开启跨应用开关 | 每个应用的 Settings 中打开 "Let Claude work across files" |
| 管理员授权 | Team/Enterprise 需管理员先在组织级别启用 |

### 工作方式

1. **Claude 同时使用两个加载项** -- 读取 Excel 数据，写入 PowerPoint 幻灯片（反过来也行）
2. **自动传递上下文** -- Excel 中已理解的模型结构，切到 PPT 时不用重新解释
3. **你留在一个应用就行** -- 在 PPT 里说"把 Excel 里的收入数据做成图表"，Claude 自己去 Excel 读

**典型场景：**
- "把 Excel 模型中的 Q3 收入预测做成 PPT 图表"
- "用 Excel 里最新的财务数据更新这张幻灯片的图表"

> **截图 5-1：跨应用工作时的连接指示器**
> `![连接指示器](screenshots/05-connected-indicator.png)`
> 拍摄要求：Claude 侧边栏顶部显示"Connected to Excel/PPT"之类的连接状态指示

### 当前限制

| 限制 | 说明 |
|------|------|
| 只能访问当前打开的文件 | 没打开的文件 Claude 看不到 |
| 不能创建/打开/关闭文件 | 需要你自己操作文件 |
| 聊天记录不保留 | 关闭后跨应用对话历史丢失 |

---

## 6. 连接器（MCP）

### 连接器是什么

连接器让 Claude for Excel 能读取外部工具和数据源的信息。底层技术是 MCP（Model Context Protocol，模型上下文协议）-- Anthropic 发布的开放标准，解决"AI 怎么跟外部工具对接"的问题。你可以把它理解成一个统一的插口规范。

### 已集成的数据供应商

| 供应商 | 说明 |
|--------|------|
| S&P Global | 标普全球，金融数据 |
| LSEG | 伦敦证券交易所集团，市场数据 |
| Daloopa | 财务数据自动化 |
| Pitchbook | 私募/VC 投资数据 |
| Moody's | 穆迪，信用评级和风险数据 |
| FactSet | 金融分析数据平台 |

### 添加自定义连接器

**Team/Enterprise 管理员：**
1. Organization settings > Connectors → Add → Custom → Web
2. 输入远程 MCP 服务器 URL
3. 可选填 OAuth Client ID 和 Secret

**Pro/Max 个人用户：**
Customize > Connectors → "+" → Add custom connector → 输入 MCP 服务器 URL

> **截图 6-1：连接器配置界面**
> `![连接器配置](screenshots/06-connectors-panel.png)`
> 拍摄要求：Claude 侧边栏中的连接器配置页面，能看到已连接的数据源列表

### 安全注意事项

- **只连接你信任的服务器** -- 不明来源的 MCP 服务器可能窃取数据
- **仔细审查 OAuth 权限** -- 看清楚授权了哪些访问权限
- **谨慎使用 "Allow always"** -- 先审查具体操作再决定是否永久授权

---

## 7. Skills 技能系统

### Skills 是什么

Skills（技能）是 Claude 的能力扩展包。每个 Skill 给 Claude 注入一套专业知识和工作流程。你可以把它理解成"给 Claude 装上专业插件"。

### 启用步骤

1. Settings > Capabilities → 打开 **"Code execution and file creation"**（前提条件）
2. Customize > Skills → 启用/禁用各个技能

### 内置技能

| 技能 | 作用 |
|------|------|
| Excel 增强 | 增强 Excel 表格的创建和操作能力 |
| Word 文档 | 专业 Word 文档创建 |
| PowerPoint | 演示文稿生成 |
| PDF 处理 | PDF 创建和处理 |

### 自定义技能

1. 创建 `Skill.md` 文件定义技能指令和行为
2. 打包为 ZIP（文件夹名 = 技能名）
3. Customize > Skills → "+" → Create skill → Upload a skill

### 在 Excel / PPT 中使用

- 已启用的 Skills **自动可用**，不需要额外配置
- 聊天框输入 **"/"** 查看当前可用 Skills 列表
- Claude 自动判断该用哪个技能

> **截图 7-1：Skills 列表（输入 / 后弹出）**
> `![Skills列表](screenshots/07-skills-list.png)`
> 拍摄要求：在 Claude 聊天框输入"/"后弹出的 Skills 下拉列表

---

## 8. 企业部署

> 本章面向 IT 管理员。个人用户可跳过。

### 核心概念

企业用户**不需要个人 Claude 账号**。通过自己公司的"中转站"（LLM Gateway）连接，数据不经过 Anthropic。

### 三种连接路径

| 路径 | 适合谁 | 需要准备 |
|------|--------|---------|
| **LLM Gateway**（推荐） | 大多数企业 | Gateway URL + API token |
| **Bedrock Direct** | 已用 AWS 的企业 | AWS 账号 + Claude 模型权限 |
| **Vertex AI Direct** | 已用 Google Cloud 的企业 | GCP 项目 + Vertex AI API |

### LLM Gateway 连接步骤

1. 打开 Excel → 启动 Claude 加载项
2. 选择 **"Enterprise gateway"**
3. 输入 Gateway URL（HTTPS 开头）
4. 输入 API token（找 IT 要）
5. 测试连接 → 成功后进入主界面

> 凭证存在浏览器 localStorage 的沙箱 iframe 中，**不会同步到 Anthropic 服务器**。

### 网络白名单

IT 需要在防火墙中放行以下域名：

| 域名 | 用途 |
|------|------|
| `pivot.claude.ai` | 加载项界面和遥测 |
| `claude.ai/api/` | 功能标记评估 |
| `appsforoffice.microsoft.com` | Office.js 运行时 |
| `login.microsoftonline.com` | 微软企业登录 |
| 你的 LLM Gateway URL | AI 推理路由 |

### Gateway 技术要求

- API 格式：仅支持 Anthropic Messages API
- CORS：`Access-Control-Allow-Origin: https://pivot.claude.ai`
- 必需端点：`/v1/messages`（流式）+ `/v1/models`（模型列表）
- 认证：接受 `x-api-key` 或 `Authorization`

### 数据隐私

- Anthropic **会收集**：功能使用情况、性能指标、错误率
- Anthropic **不会传输**：你的 prompt 和 Claude 的回答
- Anthropic **无权访问**：你的云实例

> 简单说：Anthropic 知道你用了什么功能、用了多久，但不知道你问了什么。

---

## 9. 场景化 Prompt 大全

> 直接复制粘贴到 Claude 聊天框使用。方括号 `[...]` 替换成你的实际情况。

### 财务建模

**建模**

| 中文说明 | Prompt |
|----------|--------|
| 三表联动财务模型 | Build a 3-statement financial model for [company/industry] |
| SaaS 指标模型 | Create a SaaS metrics model with ARR, churn, and LTV calculations |
| 杠杆收购模型 | Build an LBO model with debt schedules and returns analysis |
| 房地产投资测算 | Create a real estate pro forma for a multifamily acquisition |

**预测**

| 中文说明 | Prompt |
|----------|--------|
| 12 个月收入预测 | Build a 12-month revenue forecast using historical trends |
| 人力规划 | Create a headcount capacity plan based on target client count |
| 三年现金流预测 | Model cash flow projections for the next 3 years |

**情景分析**

| 中文说明 | Prompt |
|----------|--------|
| 下行场景 | Add a downside case assuming revenue drops 15% |
| 三种场景对比 | Create base, bull, and bear scenarios with different growth assumptions |
| 敏感性分析表 | Build a sensitivity table showing IRR across exit multiples and hold periods |

### 数据分析

| 中文说明 | Prompt |
|----------|--------|
| 年度趋势对比 | What trends stand out in 2025 vs 2024? |
| Top 10 客户 | Identify the top 10 customers by revenue and their growth rates |
| 品类预算差异 | Which product categories are underperforming vs budget? |
| 预算差异解释 | Compare actuals to budget and explain the largest variances |
| 两表核对 | Reconcile these two sheets and highlight discrepancies |
| 费用分类 | Categorize these transactions into expense types |
| 情感分析 | Tag customer feedback by sentiment and topic |

### 数据清洗

| 中文说明 | Prompt |
|----------|--------|
| 日期格式统一 | Convert all dates to YYYY-MM-DD format |
| 电话号码标准化 | Standardize phone numbers to +1 (XXX) XXX-XXXX |
| 公司名清洗 | Clean up company names (remove Inc, LLC, Ltd variations) |
| 去重 | Find and remove duplicate rows, keeping the most recent |
| 编码修复 | Identify and fix unicode/encoding errors |
| 缺失值填充 | Fill missing values based on patterns in the data |
| 地址拆分 | Split full address into street, city, state, zip columns |

### 公式

| 中文说明 | Prompt |
|----------|--------|
| 查错 | Find all #REF and #VALUE errors in this workbook |
| 追溯错误 | Why is cell B4 showing an error? Trace the issue |
| 公式解释 | Explain what this formula does in plain English |
| 回溯输入源 | Trace this cell back to its source inputs |
| 创建 VLOOKUP | Create a VLOOKUP that pulls price from the rate table |
| 逾期标记 | Build a formula that flags overdue invoices |

### 仪表板和报表

| 中文说明 | Prompt |
|----------|--------|
| 高管看板 | Create an executive dashboard summarizing all worksheets |
| KPI 记分卡 | Build a KPI scorecard with revenue, margins, and growth metrics |
| 月度财务摘要 | Generate a monthly financial summary from the GL data |
| 董事会级 P&L | Create a board-ready P&L with variance commentary |
| 收入瀑布图 | Create a waterfall chart showing revenue bridge |
| 组合图 | Build a combo chart with revenue bars and margin line |

> **截图 9-1：Claude 生成的 Dashboard 效果**
> `![Dashboard](screenshots/09-dashboard.png)`
> 拍摄要求：一个由 Claude 生成的包含图表和指标的 Dashboard 标签页

### 格式化

| 中文说明 | Prompt |
|----------|--------|
| 投行格式 | Format this model using IB conventions (blue inputs, black formulas) |
| 统一格式 | Apply consistent formatting across all sheets |
| 负值标红 | Highlight negative values in red |
| 状态色标 | Color-code rows by status (green/yellow/red) |

### 模型审计

| 中文说明 | Prompt |
|----------|--------|
| 公式链接检查 | Check that all formulas link correctly across sheets |
| 资产负债表平衡 | Verify the balance sheet balances in all periods |
| 硬编码检测 | Find any hardcoded values that should be formulas |
| 结构简化 | How can I simplify this model structure? |

---

## 10. 最佳实践

### 四条铁律

1. **始终审查变更再定稿** -- Claude 的修改可能不完全符合预期。保存前通读一遍，尤其是公式和数字
2. **验证输出匹配组织方法论** -- 不同公司的财务计算标准不同（折旧方法、收入确认规则等），Claude 不知道你公司的规矩
3. **使用适当的权限和访问控制** -- 尤其在 Team/Enterprise 环境
4. **对客户交付物保持人工监督** -- Claude 是你的助手，不是你的替身

### Excel 专项建议

- **复杂操作前先保存**（Ctrl+S）-- Claude 改错了你还能恢复
- 用 **"Claude Log" 标签页**追踪操作记录
- 出错随时用 **Ctrl+Z** 撤销
- **告诉 Claude 具体区域**，比如"修改 B3:B12 的公式"，不要说"帮我看看哪里有问题"

### PowerPoint 专项建议

- **先应用模板，再让 Claude 生成** -- 这样 Claude 会沿用你的模板风格
- **具体说明要修改哪张幻灯片** -- "修改第 3 页的标题"而不是"改一下标题"
- **验证输出符合品牌指南** -- Claude 不知道你公司的 logo 用什么颜色

### Prompt 技巧

**说清楚目标和约束：**
```
好：把 B3:B12 的数值格式改为千分位，保留 2 位小数，保持现有公式不变
坏：帮我格式化一下表格
```

**用具体的单元格引用：**
```
好：在 D2 写一个 VLOOKUP，从 Sheet2 的 A:C 查找 A2 的值
坏：帮我做一个查找公式
```

**分步骤给复杂指令：**
1. 先让 Claude 理解数据结构
2. 再让它执行第一步操作
3. 确认结果后继续下一步

**利用持久指令（Instructions）：**

在 Claude 侧边栏的 Instructions 区域设置反复用到的偏好，如"所有金额显示为人民币格式"。这些指令在整个对话中持续生效。

### 用量优化

| 策略 | 效果 |
|------|------|
| 用 Projects + RAG 处理大数据集 | 避免把所有数据塞进单次对话 |
| 不需要时关闭扩展思考、网络搜索 | 减少 token 消耗 |
| 保持项目指令简洁 | 指令越长，每次消耗越多 |
| 定期清理不用的项目文件 | 减少不必要的上下文加载 |

### 安全守则

- **只用可信来源的电子表格** -- 不要用网上下载的、供应商发来的、来路不明的文件
- **审查 Claude 对外部数据的获取请求** -- 看确认弹窗时仔细看清楚
- **连接器只连可信的 MCP 服务器**

---

## 11. 限制与安全

### 数据处理

- 输入和输出在后端保留最多 **30 天**，之后自动删除
- 最近关闭文档的数据可能缓存**数小时**
- 聊天记录**不保留** -- 关掉窗口就没了

### 不支持的功能

| 功能 | 说明 |
|------|------|
| 可观测性 | 无法监控 Claude 内部推理过程 |
| 审计日志 | 不出现在 Enterprise 审计日志中 |
| 自定义数据保留 | 不继承组织设置的保留策略 |
| 数据表（Data Tables） | 不支持 |
| 宏（Macros）和 VBA | 不支持 |

### 不推荐用于

- 未经人工审查的最终客户交付物
- 未经验证的审计关键计算
- 替代用户的财务判断
- 无适当控制的高敏感/受监管数据

### 用量限制

**Usage Limits（用量限制）** -- 一段时间内能对话多少次（"对话预算"）

- 不同计划额度不同（Pro < Max < Team < Enterprise）
- 跨平台共享：claude.ai、Claude Code、Claude Desktop 用同一个池子

**Length Limits（长度限制）** -- 单次对话能处理多少内容

| 计划 | 上下文窗口 |
|------|-----------|
| Pro/Max/Team | 200K tokens（约 14 万中文字） |
| Enterprise | 最高 500K tokens（约 35 万中文字） |

### 提示注入攻击风险

提示注入（Prompt Injection）是恶意用户在单元格里藏入特殊指令，诱骗 Claude 执行非预期操作。

**关键警告：只在可信的电子表格中使用 Claude。**

以下都算"不可信来源"：网上下载的模板、供应商发来的文件、多人协作的共享文档、外部系统导入的数据。

恶意指令可能造成：提取和分享敏感信息、修改关键财务数据、执行破坏性操作。

Claude 对高风险函数会**弹出确认窗口**：

| 类别 | 函数 |
|------|------|
| 外部数据获取 | WEBSERVICE, STOCKHISTORY 等 |
| 外部导入 | IMPORTDATA, IMPORTXML 等 |
| 命令/代码执行 | DDE, CALL, EVALUATE 等 |
| 文件系统访问 | IMAGE, FILES, FOPEN 等 |

> **截图 11-1：高风险操作确认弹窗**
> `![确认弹窗](screenshots/11-confirmation-popup.png)`
> 拍摄要求：Claude 执行高风险操作时弹出的确认对话框

---

## 12. 故障排除

### 通用问题

| 问题 | 解决方案 |
|------|----------|
| 加载项不显示 | 确认 Office 版本满足最低要求；检查管理员是否已部署 |
| Skills 不可见 | Settings > Capabilities → 确认代码执行已启用 |
| Claude 不用某个 Skill | 验证 Skill 已启用、描述清晰 |
| 跨应用文件不可见 | 确认两个加载项都已激活 + 跨应用开关已开 |
| Claude 的修改没出现 | 等 Claude 完成操作；检查目标文件是否正确；手动刷新 |

### LLM Gateway 问题

| 问题 | 解决方案 |
|------|----------|
| 连接拒绝 / 网络错误 | 验证 URL、服务运行状态、域名白名单 |
| 401 未授权 | 确认 API token 有效期；验证 Entra ID 组分配 |
| 404 未找到 | 使用 Gateway 基础 URL，不加 `/v1/messages` |
| 500 服务器错误 | 检查 Gateway 日志中的上游错误 |
| 流式响应失败 | 验证 Gateway 支持 SSE 透传 |

### 排查步骤（按顺序）

1. 检查版本 → 2. 检查网络 → 3. 检查权限 → 4. 重启加载项 → 5. 重启 Office → 6. 清除缓存 → 7. 联系管理员

---

## 13. 产品演进时间线

核心脉络：**单应用 → 多模型 → 跨应用 → 企业级**

```
Excel 单应用 → 加入 PPT → 跨应用联动 → 企业级部署
   (2025.11)    (2026.02)    (2026.03)       (2026.03)
```

| 日期 | 事件 | 关键内容 |
|------|------|---------|
| 2025.11.24 | Excel Beta 发布 | 侧边栏对话、透视表、图表、文件上传 |
| 2026.02.05 | PPT 加载项 + Excel 升级 | PowerPoint 上线；Excel 升级到 Opus 4.6 + 原生操作 |
| 2026.03.11 | 跨应用 + Skills + 企业级 | Excel↔PPT 联动；技能系统；LLM Gateway（Bedrock/Vertex/Azure） |
| 近期 | 持续更新 | Sonnet 4.6、Pro 开放 PPT、双倍用量促销 |

---

## 附录：截图清单

供手动截图时参考，按章节编号：

| 编号 | 文件名 | 内容 | 操作要求 |
|------|--------|------|---------|
| 1-1 | 01-sidebar-overview.png | Claude 侧边栏整体界面 | 打开有数据的表格 + Claude 侧边栏 |
| 2-1 | 02-marketplace-search.png | Marketplace 搜索结果 | 插入→获取加载项→搜索 Claude |
| 2-2 | 02-ribbon-icon.png | 功能区 Claude 图标 | Excel 顶部功能区 |
| 2-3 | 02-login.png | 登录界面 | 侧边栏登录页 |
| 2-4 | 02-cross-app-setting.png | 跨应用设置开关 | Settings 页面 |
| 3-1 | 03-cell-citations.png | 单元格引用效果 | 问 Claude 一个问题，回答含单元格链接 |
| 3-2 | 03-highlighted-changes.png | 高亮变更 | 让 Claude 修改假设后的高亮效果 |
| 3-3 | 03-model-from-scratch.png | 从零建模 | 让 Claude 建一个财务模型 |
| 3-5 | 03-claude-log-tab.png | Claude Log 标签页 | 底部标签栏→Claude Log |
| 3-6 | 03-conditional-formatting.png | 条件格式效果 | 让 Claude 加条件格式 |
| 4-1 | 04-ppt-sidebar.png | PPT 侧边栏 | PowerPoint + Claude 侧边栏 |
| 4-4 | 04-native-chart.png | 原生图表 | Claude 生成的可编辑图表 |
| 5-1 | 05-connected-indicator.png | 跨应用连接指示器 | 同时打开 Excel 和 PPT |
| 6-1 | 06-connectors-panel.png | 连接器配置 | 连接器设置页面 |
| 7-1 | 07-skills-list.png | Skills 下拉列表 | 聊天框输入"/" |
| 9-1 | 09-dashboard.png | Dashboard 效果 | Claude 生成的仪表板 |
| 11-1 | 11-confirmation-popup.png | 高风险操作确认弹窗 | 触发高风险函数时的弹窗 |

> 截图建议：统一分辨率 1920x1080，PNG 格式，文件存放在 `screenshots/` 文件夹下。

---

*本手册基于 Anthropic 官方文档编译，内容截至 2026 年 4 月。产品持续更新中，最新信息请参考 [Claude Help Center](https://support.claude.com)。*
