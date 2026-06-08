---
title: 竞品监控理想报告样例
type: report-samples
created: 2026-05-12
updated: 2026-05-12
slug: 2026-05-12-competitive-monitoring-report-samples
status: draft
tags: [competitive-monitoring, report-sample, qichacha, cbinsights]
---

# 竞品监控理想报告样例

> 样例基于 2026-05-12 可访问公开信息生成，用于调试报告形态。不是完整市场调研结论。

## 0. 设计修正

上一版“深度拆解虾”偏重。按真实需求，第一版应该叫“竞品监控虾”：

- 核心不是持续写长报告，而是维护竞品列表和信息源目录。
- 日常产物是“新鲜事监控”：谁发了新功能、开放了新接口、改了价格/包装、发了新报告、接入了新渠道。
- 只有当某个变化分数高，才触发深度拆解。
- 报告语气仍然保持行业研究，不写“我们应该跟进”。

MVP 的关键判断：

> 先把“哪里会出现新消息”做稳，再谈“分析写得多深”。

## 1. 竞品池初版

### 国内

| 竞品 | 类型 | 首批监控重点 |
|---|---|---|
| 企查查 | 企业信息 / 风控 / API / MCP | MCP、开放平台、API 工具、风险数据、经营动态 |
| 天眼查 | 企业信息 / 商业关系 / API | App、开放平台、API、关系图谱、深度风险 |
| 水滴信用 | 企业信用 / 风险监控 / 找客户 | App、信用报告、实时监控、数据导出 |
| 启信宝 | 企业商业信息 / 风险监控 / 营销 | App、风险监控、企业报告、舆情和新增企业推送 |
| 企名片 | 创投 / 企业库 / 产业图谱 | 创投数据、融资事件、产业图谱 |
| IT桔子 | 创投 / 新经济公司库 | 融资、投资机构、行业报告 |
| Wind / iFinD | 金融数据 / 机构终端 | 数据终端、API、研究报告、机构客户工作流 |

### 海外

| 竞品 | 类型 | 首批监控重点 |
|---|---|---|
| CB Insights | predictive market intelligence | product updates、MCP、AI agent、watchlist、market maps |
| Crunchbase | company / funding data API | product updates、MCP、API、组织覆盖、R&D insight |
| PitchBook | private market intelligence | AI workflow、research reports、market maps、analyst workspaces |
| Dealroom | startup / ecosystem intelligence | product release、AI chat、company coverage |
| Tracxn | private market intelligence / deal sourcing | daily alerts、APIs、sector tracking |
| Dun & Bradstreet | business identity / risk / compliance | D-U-N-S、risk、compliance、API |
| Moody's Orbis / Bureau van Dijk | company ownership / compliance | ownership、AML/KYC、global entity data |
| LexisNexis Risk Solutions | risk / compliance data | identity、fraud、AML、entity risk |

## 2. 信息源目录

每个竞品配置这些源。源本身比报告模板更重要。

| 源类型 | 例子 | 更新频率 | 用途 |
|---|---|---:|---|
| 产品更新页 | CB Insights recent product updates、Crunchbase product updates | 每日 | 最可靠的新功能来源 |
| 开放平台 / API 文档 | 企查查 MCP、天眼查开放平台、Crunchbase API | 每日 | 数据能力变化、接口包装变化 |
| App Store / 应用市场 | 天眼查、水滴信用、启信宝 | 每周 | 移动端功能、面向用户的话术 |
| 官网产品页 | pricing、solutions、watchlist、risk monitoring | 每周 | 商业包装和产品定位变化 |
| 新闻 / Press release | CB Insights partnership、融资、合作 | 每日 | 渠道、生态、客户背书 |
| 招聘 | JD 中的数据工程、MCP、agent、风控岗位 | 每周 | 方向性信号 |
| 公众号 / 论坛 / 社区 | 发布稿、客户案例、活动 | 每日 | 国内竞品常见发布渠道 |
| 客户案例 | 银行、保险、互联网、政企 | 每周 | 目标行业变化 |

## 3. 报告样例 A：竞品监控日报

# 竞品监控日报｜2026-05-12

## 今日结论

今天最值得看的信号不是“企业信息查询”本身，而是企业数据正在被重新包装成 AI agent 可调用的数据能力。企查查把 MCP 工具数量、Server 分层和 T+0 实时数据放到前台；CB Insights 同期把 MCP、Watchlists、Funding Window 放进 2026 产品更新。国内外都在把“查数据的平台”改写成“被 AI 工作流调用的数据层”。

## 重点信号

| 优先级 | 竞品 | 新鲜事 | 证据 | 观察 |
|---|---|---|---|---|
| 高 | 企查查 | MCP 页面显示 179 个原子工具，2026-04-30 新增 33 个工具 | 企查查智能体数据平台 | 企业数据能力开始按 agent 工具颗粒度包装 |
| 高 | CB Insights | 2026-04 / 03 连续强化 MCP、Watchlists、Funding Window | CB Insights product updates | 海外市场情报平台把 watchlist 和 AI workflow 结合 |
| 中 | Crunchbase | 产品更新页出现 MCP Server、API、R&D Insight、4.3M+ organizations 覆盖 | Crunchbase product updates | 私有公司数据平台也在走 MCP/API 化 |
| 中 | Dealroom | Q1 2026 产品更新强调 AI chat、搜索准确性、公司覆盖 | Dealroom product release | 自然语言查询成为公司数据平台的默认入口 |
| 低 | 水滴信用 | App Store 文案强调 2.1 亿+主体、实时监控、网页数据导出 | App Store | 偏通用查询和获客场景，未看到明显 agent 化信号 |
| 低 | 启信宝 | App Store 文案强调 3.1 亿境内企业等组织机构、风险监控、新增企业推送 | App Store | 强调数据规模、风险监控和报告，暂未看到 MCP/API 新包装 |

## 可观察问题

@product-shrimp

1. 企业数据平台被 AI agent 调用以后，客户会不会更早询问“有没有 MCP / Agent 工具 / 统一 API Key”？
2. 风控、经营动态、知产、董监高这些能力，是否正在从“页面查询”变成“工作流节点”？
3. 如果同类产品都开始强调实时数据和 agent 工具颗粒度，客户对数据更新速度和接口可解释性的默认预期会不会提前？

## 证据

- 企查查智能体数据平台：<https://agent.qcc.com/data>
- CB Insights product updates：<https://www.cbinsights.com/recent-product-updates/>
- CB Insights April 2026 launch：<https://www.cbinsights.com/april-2026-product-launch/>
- Crunchbase product updates：<https://about.crunchbase.com/product-updates>
- Dealroom product release updates：<https://knowledge.dealroom.co/knowledge/product-release-updates>
- 水滴信用 App Store：<https://apps.apple.com/cn/app/id1075736286>
- 启信宝 App Store：<https://apps.apple.com/cn/app/%E5%90%AF%E4%BF%A1%E5%AE%9D-%E4%BC%81%E4%B8%9A%E5%B7%A5%E5%95%86%E4%BF%A1%E7%94%A8%E4%BF%A1%E6%81%AF%E5%BE%81%E4%BF%A1%E6%9F%A5%E8%AF%A2/id1030675668>

## 4. 报告样例 B：单条高优先级信号

# 企查查 MCP 新增 33 个工具：企业数据开始按 Agent 工作流重组

- 竞品：企查查
- 类型：产品 / API / MCP
- 发现时间：2026-05-12
- 事件时间：页面显示最新版本 2026-04-30
- 置信度：高
- 建议动作：进入本周行业观察，不自动发布为产品建议

## 发生了什么

企查查智能体数据平台页面显示，企查查 MCP 当前包含 179 个原子工具，分布在企业基座、风控大脑、知产引擎、经营罗盘、历史存档、董监高画像 6 个 Server。页面同时标注 2026-04-30 新增 33 个工具，包括风控、经营、知产相关工具。

## 行业信号

这个变化说明，企业数据平台正在从“人查企业页面”转向“AI agent 调用数据工具”。值得看的不是 MCP 这个词本身，而是企查查把企业数据拆成了可组合工具：企业基座负责事实，风控大脑负责红线，经营罗盘负责动态，知产引擎负责尽调，历史存档负责时间维度，董监高画像负责人维度。

这类包装会改变客户对企业数据服务的默认期待。客户不只会问“有没有这个字段”，也会问“能不能让 agent 在审批、尽调、开户、风控、合规流程里自动调用”。

## 能力地图

| 能力层 | 公开呈现 | 观察 |
|---|---|---|
| 企业基座 | 15 个工具，工商登记、股东、实控人、受益所有人、财务数据 | 用事实层降低 AI 幻觉 |
| 风控大脑 | 35 个工具，失信、被执行、限高、司法拍卖、破产重整等 | 风控信号被包装成自动熔断节点 |
| 知产引擎 | 18 个工具，专利、商标、国际专利、APP/小程序/公众号等 | 知产从查询项变成尽调模块 |
| 经营罗盘 | 35 个工具，招投标、新闻舆情、纳税资质、产品召回等 | 经营动态适合做持续监控 |
| 历史存档 | 34 个工具，历史股东、历史法代、历史风险等 | 时间维度成为识别“洗白型”主体的工具 |
| 董监高画像 | 42 个工具，个人风险、关联企业、UBO 识别等 | 企业风险向自然人和关联网络穿透 |

## 可观察问题

@product-shrimp

1. 客户会不会把“Agent 可调用”视为企业数据服务的新基础配置？
2. 风控和经营动态这两类工具，是否最容易嵌入客户已有工作流？
3. 工具数量增加以后，客户更关心覆盖广度，还是每个工具的证据来源、延迟和误报控制？

## 证据

- 企查查智能体数据平台：<https://agent.qcc.com/data>

## 5. 报告样例 C：海外竞品信号

# CB Insights 把市场情报接进 AI 工作流

- 竞品：CB Insights
- 类型：产品更新 / MCP / 市场情报工作流
- 发现时间：2026-05-12
- 事件时间：2026-03 至 2026-04 产品更新
- 置信度：高

## 发生了什么

CB Insights 的产品更新页显示，2026 年以来其产品更新集中在 MCP、Watchlists、Funding Window、Business Relationships、AI 工作流连接上。4 月发布页进一步强调官方 MCP connectors for Claude and ChatGPT、Watchlist tagging 和全球 equity deal coverage。

## 行业信号

CB Insights 的变化不是简单增加数据字段，而是把私有公司和市场情报放进策略团队、投资团队和 AI 工具的工作流里。Watchlist 从“收藏列表”变成共享工作空间；MCP connector 让外部 LLM 直接访问市场情报；Funding Window 把静态公司资料往预测性工作流推进。

这说明海外市场情报平台正在从“研究员登录平台查资料”转向“团队在 AI 工具里调用可信数据”。

## 与国内企业数据平台的差异

| 维度 | 国内企业信息平台趋势 | CB Insights 信号 |
|---|---|---|
| 数据对象 | 商事主体、工商、司法、风险、知产 | 私有公司、融资、市场、关系、预测指标 |
| 入口变化 | MCP / API / App / 查询页 | MCP / Watchlist / AI workspace |
| 价值包装 | 风控、准入、尽调、合规 | sourcing、strategy、deal、market map |
| 新重点 | Agent 工具化 | Predictive intelligence + AI workflow |

## 可观察问题

@product-shrimp

1. 国内企业数据平台会不会也把 watchlist 从“监控名单”升级成团队协作空间？
2. 客户对企业数据的需求是否会从“查得全”转向“能在 AI 工作流里引用且可追溯”？
3. 如果海外平台把 predictive intelligence 放到 MCP 里，国内风控数据是否也会出现“预测性工具化”的包装？

## 证据

- CB Insights recent product updates：<https://www.cbinsights.com/recent-product-updates/>
- CB Insights April 2026 launch：<https://www.cbinsights.com/april-2026-product-launch/>
- CB Insights Perplexity partnership：<https://www.cbinsights.com/perplexity-pr/>

## 6. 报告样例 D：国内竞品源发现报告

# 国内竞品信息源可用性检查

## 结论

国内竞品的“官方产品更新页”普遍不如海外平台稳定，第一版监控不能只盯官网。更可靠的组合是：

1. 官网 / 开放平台 / API 文档。
2. App Store 和安卓应用市场更新。
3. 公众号、新闻稿、客户案例。
4. 招聘 JD。
5. 第三方云市场 / API 市场。

## 源检查

| 竞品 | 可用公开源 | 当前可抓信号 | 源质量 |
|---|---|---|---|
| 企查查 | MCP 页面、API 文档、官网、应用市场 | 工具数量、Server 分类、版本日期、API 包装 | 高 |
| 天眼查 | App Store、开放平台文档、第三方 API 接入文档 | 数据维度、关系图谱、深度风险、API 接口范围 | 中 |
| 水滴信用 | App Store、官网、应用市场 | 覆盖主体数、实时监控、数据导出、信用报告 | 中 |
| 启信宝 | App Store、官网、应用市场、母公司新闻 | 3.1 亿境内企业等组织机构、风险监控、新增企业推送 | 中 |

## 对监控虾的要求

- 对国内竞品，必须支持“多源弱信号合并”，不能等官网发布正式 release note。
- App Store 文案变化、开放平台文档新增字段、云市场商品上架，都应视为产品信号。
- 每条信号要标注来源等级：官方产品页 > 官方开放平台 > App Store > 云市场 > 第三方转载。

## 证据

- 天眼查 App Store：<https://apps.apple.com/cn/app/id1048918751>
- 水滴信用 App Store：<https://apps.apple.com/cn/app/id1075736286>
- 启信宝 App Store：<https://apps.apple.com/cn/app/%E5%90%AF%E4%BF%A1%E5%AE%9D-%E4%BC%81%E4%B8%9A%E5%B7%A5%E5%95%86%E4%BF%A1%E7%94%A8%E4%BF%A1%E6%81%AF%E5%BE%81%E4%BF%A1%E6%9F%A5%E8%AF%A2/id1030675668>
- 企查查 API 文档：<https://www.qichacha.dev/api/>

## 7. 理想报告格式建议

最终 Discourse 上不宜每天长篇。建议三种固定格式：

### 日报

- 今日结论：1 段。
- 重点信号：表格 3-8 条。
- 可观察问题：3 个。
- 证据：链接列表。

### 单条高优先级信号

- 发生了什么。
- 行业信号。
- 能力地图 / 对比表。
- 可观察问题。
- 证据。

### 月度竞品回顾

- 本月最大变化。
- 国内外共性趋势。
- 重点竞品变化清单。
- 源质量评估。
- 下月 watchlist。

## 8. 配置样例

```yaml
competitors:
  - name: 企查查
    category: domestic_company_data
    priority: high
    sources:
      - name: 企查查智能体数据平台
        url: https://agent.qcc.com/data
        type: mcp_product_page
        trust: official
        check: daily
      - name: 企查查 API 文档
        url: https://www.qichacha.dev/api/
        type: api_docs
        trust: official_like
        check: weekly

  - name: CB Insights
    category: overseas_market_intelligence
    priority: high
    sources:
      - name: Recent Product Updates
        url: https://www.cbinsights.com/recent-product-updates/
        type: product_updates
        trust: official
        check: daily
      - name: Research
        url: https://www.cbinsights.com/research/
        type: research
        trust: official
        check: weekly

  - name: 水滴信用
    category: domestic_company_data
    priority: medium
    sources:
      - name: App Store
        url: https://apps.apple.com/cn/app/id1075736286
        type: app_store
        trust: platform
        check: weekly
```
