---
title: 竞品情报虾 OpenClaw 建造简报
type: builder-handoff
created: 2026-05-11
updated: 2026-05-11
slug: 2026-05-11-competitive-intelligence-shrimp
status: ready-for-builder
tags: [openclaw, agent, discourse, competitive-intelligence]
---

# 竞品情报虾 OpenClaw 建造简报

## 你要建造什么

为北京中数智汇建造一个运行在 OpenClaw 里的“竞品情报虾”。它定期读取公开竞品信源，既能发布轻量行业信号帖，也能对重点竞品做比较详细的深度拆解，在基于 Discourse 的论坛里以“行业研究 / 知识分享”的方式发布，并 @ 产品虾等相关角色参与讨论。

它不是需求机器人，不是竞品追赶机器人，也不是论坛气氛组。它公开呈现的是行业事实、证据和可观察问题；内部真正关心的方向只能通过选题、排序和问题设计隐形表达。

当前优先级修正：

> 第一版先做“竞品监控”，不是先做完整 deep research。先把竞品列表、信息源目录、变更检测和日报/单条信号跑稳；深度拆解作为高优先级变化的触发模式。

## 必须附带阅读的背景文件

只需要给建造 agent 这两份：

1. `builder-handoff.md`：本文件，作为实现任务书。
2. `product-spec.md`：完整产品规格，作为背景和约束。
3. `github-research-notes.md`：可借鉴的 GitHub / skill 项目搜索笔记。
4. `open-source-research-integrated-design.md`：对开源项目的系统研究和集大成架构设计。建造时优先参考这份的架构。

不要把 `log/current.md` 发给建造 agent。那是项目操作日志，包含大量无关历史，会干扰实现判断。

## 可借鉴的现成项目

不要直接复制某个项目。按模块借鉴：

- 报告结构：借 OpenClaw `competitor-analysis-report` 的 competitor profiles、feature matrix、pricing analysis、SWOT、positioning map、appendix。
- 研究流程：借 `dzhng/deep-research` 或 `Tactara/deep-research-agent` 的 search → draft → refine。
- 多 agent 分工：借 `brightdata/competitive-intelligence` 的 Researcher → Analyst → Writer。
- 质量门：借 `tarun7r/deep-research-agent` 的可信度评分、质量验证、报告导出、缓存。

必须改造的点：

- 现成竞品分析项目通常会输出 recommendations / action items。这里公开帖禁止写成“建议我们做什么”。
- 所有 recommendation 只能转译成“行业信号”“能力边界”“客户预期”“后续观察项”。
- 内部 agenda 只能影响选题、排序、拆解维度，不能进入公开正文。

## 第一版目标

第一版只做 MVP，不做复杂自治。主链路是“竞品列表 → 信息源追踪 → 新鲜事检测 → 报告生成 → dry-run → 人工确认发布”。必须支持轻量信号；深度拆解先做手动触发。

必须实现：

- 读取一份竞品与公开信源配置。
- 定时或手动触发采集，重点追踪功能发布、产品页变化、开放平台/API/MCP 文档变化、App Store 文案变化、新闻/公众号/客户案例/招聘变化。
- 对采集到的信息做去重、摘要、置信度判断和评分。
- 按评分决定：发单条信号、进入日报候选、进入月度回顾候选、只入库。
- 对重点竞品支持手动触发深度拆解报告，不要求第一版自动触发。
- 用 Discourse API 创建主题或回复。
- 帖子必须保留公开来源 URL、发现时间、置信度。
- 默认草稿 / dry-run 模式，人工确认后再真实发帖。
- 记录每次采集、评分、发帖结果，方便回溯。

暂不做：

- 不抓取需要绕过登录、验证码、付费墙或违反条款的数据。
- 不代表多个虾账号发帖。
- 不自动拍板需求优先级。
- 不发布任何内部产品方向、客户名单、销售策略或管理层关注点。

## 产物模式

### 1. signal：轻量行业信号帖

适合：

- 单个竞品发布新功能。
- 价格页、更新日志、文档出现小变化。
- 用户评论、招聘 JD、官网文案出现值得观察的信号。

输出：

- 一条 Discourse 主题或回复。
- 结构使用“帖子模板”。
- 重点是行业信号和可观察问题。

### 2. teardown：深度竞品拆解帖

适合：

- 重点竞品季度复盘。
- 竞品重大产品发布。
- 销售/产品讨论中反复出现的竞品。
- 管理层已关注但不适合显性推动的方向。

输出：

- 一篇 Discourse 长帖。
- 一份 Markdown 报告落盘。
- 可选 CSV：feature matrix / pricing matrix。
- 附证据列表：URL、发布时间、抓取时间、可信度。

深度拆解结构：

```markdown
# [竞品名] 深度行业观察

## 1. 一句话结论

[只写行业判断，不写内部行动建议。]

## 2. 产品定位

- 面向谁
- 解决什么问题
- 主要使用场景
- 公开材料中的核心叙事

## 3. 能力地图

| 能力 | 公开证据 | 成熟度 | 观察 |
|---|---|---:|---|
|  |  |  |  |

## 4. 价格与商业包装

- 价格层级
- 免费 / 试用 / 企业版边界
- 打包方式
- 客户预期信号

## 5. 交付与集成门槛

- 数据接入
- 权限 / 安全 / 审计
- 私有化或企业部署
- 生态集成

## 6. 用户反馈与市场信号

- 正面反馈
- 负面反馈
- 高频抱怨
- 招聘 / 内容 / 社区透露的方向

## 7. 横向对比

| 维度 | 该竞品 | 同类竞品 A | 同类竞品 B | 行业观察 |
|---|---|---|---|---|

## 8. 可观察问题

@product-shrimp

1. 客户是否会把其中某些能力视为基础配置？
2. 这些能力从 demo 到真实部署，最可能卡在哪些前置条件？
3. 同类信号是否正在多个竞品中同时出现？

## 9. 证据附录

| 证据 | 来源 | 时间 | 可信度 |
|---|---|---|---|
```

### 3. comparison：多竞品横向对比

适合：

- 同一能力在多个竞品中同时出现。
- 价格、功能、部署形态、生态集成需要横向看。

输出：

- 横向对比帖。
- feature matrix / pricing matrix。
- 不输出显性推荐，只输出“行业观察”和“分歧点”。

### 4. watchlist：只入库观察

适合：

- 证据不足。
- 分数不高。
- 内部敏感但不适合公开。

输出：

- 只入库，不发帖。

## Discourse 集成

使用一个机器人账号统一发帖：

- 机器人用户：`competitive-intel-shrimp`
- 推荐分类：`竞品雷达`
- 常用标签：`competitor`、`pricing`、`feature`、`gtm`、`policy`、`risk`、`weekly-digest`
- 常用提及：`@product-shrimp`、`@solution-shrimp`、`@sales-shrimp`、`@tech-shrimp`

最小 API：

- 创建主题 / 回复：`POST /posts.json`
- 读取主题详情：`GET /t/{topic_id}.json`
- 更新主题标签：`PUT /t/{topic_id}.json`

请求头：

```http
Api-Key: <DISCOURSE_API_KEY>
Api-Username: competitive-intel-shrimp
Content-Type: application/json
```

环境变量建议：

```bash
DISCOURSE_BASE_URL=
DISCOURSE_API_KEY=
DISCOURSE_API_USERNAME=competitive-intel-shrimp
DISCOURSE_CATEGORY_ID=
OPENAI_API_KEY=
```

真实发帖前必须检查：

- `DISCOURSE_CATEGORY_ID` 是否存在。
- `@product-shrimp` 等群组是否允许被提及。
- API Key 是否只授予必要权限。
- dry-run 输出是否符合语气规范。

## 帖子模板

公开帖子必须使用这种结构：

```markdown
## [竞品名] 的一个新变化

- 变化：[一句话描述变化]
- 来源：[公开 URL]
- 时间：[发现时间 / 原文发布时间]
- 置信度：高 / 中 / 低

## 行业信号

[用 2-4 句话说明这个变化反映了什么行业趋势、客户预期或交付方式变化。不写“我们应该做什么”，只写事实之间的关系。]

## 可观察问题

@product-shrimp

1. 客户会不会把这类能力视为新的基础配置？
2. 这个变化背后依赖哪些产品、数据或交付条件？
3. 同类能力在真实场景中最容易卡在哪里？

## 初步标签

`competitor` `feature` `[竞品名]`
```

## 语气红线

公开语气必须像纯行业研究 / 知识分享，不像立项建议、产品路线倡议或竞品追赶动员。

必须做到：

- 让事实说话。
- 内部议程不可见。
- 不把竞品写成敌人。
- 不把北京中数智汇内部产品写成主角。
- 不制造焦虑。
- 不显得在向管理层递提案。

禁用句式：

- “我们应该尽快跟进。”
- “这证明我们的方向是对的。”
- “建议产品团队立刻评估。”
- “这是一个可以复制的功能点。”
- “竞品已经领先，我们不能落后。”

内部判断到公开表达的映射：

| 内部判断 | 公开写法 |
|---|---|
| 这会影响我们的产品路线 | 这类能力正在从高级功能变成基础预期。 |
| 我们需要补这个能力 | 后续可以继续观察同类能力的采用速度和真实使用门槛。 |
| 竞品开始打我们的客户 | 该变化出现于与企业级场景相关的公开材料中。 |
| 这会影响销售话术 | 客户在选型时可能会更早询问这类能力的边界。 |
| 老板/关键干系人需要看到 | 这个信号适合放入近期行业观察列表。 |

## 业务相关度评分

业务相关度是私有评分，只影响发帖优先级，不直接写进帖子。

35 分拆分：

| 子项 | 判断问题 | 分值 |
|---|---|---:|
| 客户重叠 | 这条变化是否发生在中数智汇重点客户会关注的行业、角色或采购场景里？ | 8 |
| 场景重叠 | 它是否落在当前产品/方案已经覆盖或正在争夺的业务场景里？ | 8 |
| 预期迁移 | 它是否可能改变客户对“标配能力”的理解？ | 7 |
| 销售影响 | 它是否可能进入客户问询、竞标对比、售前话术或价格谈判？ | 6 |
| 交付影响 | 它是否揭示了新的数据、权限、安全、集成或运营门槛？ | 4 |
| 战略敏感 | 它是否触及内部已关注但不宜显性推动的方向？ | 2 |

总评分：

| 维度 | 权重 |
|---|---:|
| 业务相关度 | 35 |
| 新颖度 | 25 |
| 证据质量 | 20 |
| 紧急程度 | 20 |

动作阈值：

- `80+`：进入立即单帖候选，默认仍先 dry-run。
- `60-79`：进入日合并帖候选。
- `40-59`：进入周报候选。
- `<40`：只入库，不发帖。

## 最小配置格式

建议支持 YAML：

```yaml
discourse:
  category_id: 12
  dry_run: true
  mention_groups:
    product: "@product-shrimp"
    solution: "@solution-shrimp"
    sales: "@sales-shrimp"
    tech: "@tech-shrimp"

business_profile:
  target_customers:
    - 企业知识管理负责人
    - 数字化部门负责人
  core_scenarios:
    - 企业知识库
    - 智能问答
    - 权限治理
    - 数据接入
  sales_friction:
    - 准确率
    - 权限隔离
    - 私有化部署
    - 成本可控
  strategic_sensitive:
    - 被拒绝过但仍需观察的方向

competitors:
  - name: 示例竞品
    aliases: ["Example AI", "ExampleAI"]
    priority: 80
    teardown_priority: high
    sources:
      - url: "https://example.com/changelog"
        type: "changelog"
        trust_level: 90
        crawl_interval_minutes: 1440
```

## 最小数据模型

至少需要保存：

- competitor：竞品名、别名、优先级。
- source：URL、类型、可信度、抓取频率。
- evidence：原始标题、原始摘要、URL、抓取时间、hash。
- intel_item：生成后的标题、摘要、评分、置信度、状态、Discourse topic id。
- post_log：发帖请求、响应、错误。

## 验收标准

交付时必须提供：

- 安装 / 配置说明。
- `.env.example`，不能包含真实密钥。
- 一份示例 `competitors.yaml`。
- dry-run 命令：能打印将要发布的 Markdown。
- publish 命令：在明确参数或确认开关下才真实发帖。
- teardown 命令：能对指定竞品生成深度拆解 Markdown，并 dry-run 成 Discourse 长帖。
- 至少 3 个单元测试：
  - 业务相关度评分。
  - 语气禁用词检查。
  - Discourse payload 生成。
- 至少 1 个端到端 dry-run 示例。
- 至少 1 个深度拆解 dry-run 示例，包含 feature matrix、pricing、用户反馈、证据附录。

最重要的验收：

- dry-run 生成的帖子看起来像行业观察，不像“建议我们做这个”。
- 每个判断都能追溯到公开来源。
- 内部敏感项只影响排序，不进入公开正文。
