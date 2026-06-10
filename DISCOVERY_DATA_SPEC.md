# DISCOVERY_DATA_SPEC — 选题引擎 + 数据闭环 生产级大改版

> status: **active build**（/loop 驱动）
> created: 2026-06-11
> 主干补充：本文档接 [PLATFORM_SPEC.md](PLATFORM_SPEC.md) 的 M4（选题）+ M6（数据），升级为生产级。

## 为什么要改（侦察结论，2026-06-11）

两个漏斗端各自半死，中间完全断：

- **选题（前端）**：scout 框架在但**已死一个月**（radar 停在 2026-05-09，launchd 没触发）；打分是纯关键词子串（source weight + persona +3 + concept +4 + recency），**已抓的热度信号没用**（HN score、aihot category 都丢了）；web `/discover` 只读、`getRadar` 只数条数不解析单条，**没有"雷达条目→建项目"的入口**。
- **数据（后端）**：**零真实拉取**——`api/analytics/refresh` 是空壳（TODO 注释掉了 XHS/公众号），所有数手抄创作者后台；单点覆盖无时间序列；账号级聚合**无法归因到单篇**。可复用的好东西：`web/lib/xhs.ts` 衍生指标引擎（漏斗+健康度+收藏点赞比）、`api/analytics/ai` 三级降级 AI 洞察、`compliance.ts` 文本门。
- **闭环**：**完全没有**"表现→选题"的实现，只有口号。published.md 无表现列，pick.py 打分无 performance 信号。

## 北极星（闭环）

```
真实信源(热点) ──┐
                ├─→ 选题引擎v2(打分+灵感) ─→ 选题收件箱(可选→建项目) ─→ 产出/分发(记录帖ID)
概念/选题库 ─────┘                                                          │
      ▲                                                                     ▼
      └────── 选题加权(爆款归因) ←── 表现监控v2(真拉数据+时序+单篇归因) ←──┘
```

## 三根支柱

### 支柱 1 · 选题引擎 v2（"如何遴选热点和灵感"）

**遴选热点 = 多信号融合打分**，不再纯关键词：
- **热度信号**（已抓未用）：HN score（全球开发者注意力）、aihot category+weight（人工编辑过的中文 AI 资讯，精选权重最高）、arxiv（研究前沿）、recency。归一化加权。
- **相关性**：用 deepseek-v4-flash（便宜）给每条打 0-10 分——对照 reader persona + 抽样 wiki concepts，判"这条值不值得本号写"。
- **新颖度/去重**：与 `wiki/topics/` + 已发 slug 做标题相似度，已覆盖的降权（避免重复选题）。
- **表现先验**（支柱 3 接通后）：命中"过去爆款概念"的加权。

**遴选灵感 = 角度生成**，不止转述新闻：
- 对 top-N 热点，LLM 生成「切入角度」（decode 的非显然解读）+ 建议 content_type + 候选标题钩子。
- 概念缺口挖掘：wiki concepts 里被引用多但没单独成文的 → evergreen 选题。
- （已有 hot-history 模式可挂）热点 × 历史先驱配对。

**产物升级**：`wiki/radar/YYYY-MM-DD.json`（结构化，每条含 url/summary/category/score 分项/angle/建议配置）+ 保留 .md（obsidian 可读）。
**入口升级**：`/admin/discover` 变收件箱——按分排序的雷达卡，显示角度，勾选→一键 createProject（复用 M5）。
**生产级**：成本护栏（flash 批量打分有上限）、优雅失败（单源/单条失败不崩）、cron 复活（每日自动跑）。

### 支柱 2 · 表现监控 v2（真拉数据 + 时序 + 单篇归因）

- **真实拉取**：先打通小红书（Spider_XHS 本地签名 API，扩 `tools/xhs_api_publish.py` 读 note 指标）；公众号 datacube（需 access_token）。拉不到的优雅降级到手填快照（保留现状不倒退）。
- **时间序列**：`schedule/analytics/YYYY-MM-DD.json` 按日追加（不再单点覆盖），趋势真实算而非手填 change。
- **单篇归因**：分发时记录 `slug ↔ 平台帖ID`（send.sh 终端回填 `output/<slug>/distribute/post_ids.json`），表现采集按帖 ID 归到单篇 → `output/<slug>/performance.json`。
- **监控+告警**：复用 xhs.ts 衍生引擎 + ai 路由；新增异常检测（某篇暴跌/某篇起飞 → 标记）。
- **看板合并**：`/admin/analytics` 与 `/admin/xhs` 功能重叠，合并为一个数据中心（账号总览 + 单篇排行 + AI 诊断）。

### 支柱 3 · 闭环（爆款归因 → 选题加权）

- 单篇 performance.json 的表现（互动率/收藏点赞比/涨粉）→ 反推该篇的 concepts/角度/content_type 的"赢面"。
- 写 `wiki/_performance_priors.json`（concept→score 加权表）。
- 选题引擎 v2 打分加一项 `performance_prior`：命中高赢面概念的新热点排更前；翻车模式降权。
- `/admin/discover` 显示"为什么推荐它"（含表现先验解释）。

## 里程碑（按依赖排序）

- **D1 · 选题引擎 v2 核心**：`tools/scout2.py`（融合打分 + flash 相关性 + 去重）→ 结构化 radar JSON。复活 cron。
- **D2 · 灵感层**：top-N 角度生成 + 建议配置，写进 radar JSON。
- **D3 · 选题收件箱 UI**：`/admin/discover` 读 JSON → 排序卡 + 勾选建项目（复用 createProject）。
- **D4 · 数据时序 + 单篇归因**：analytics 按日追加 + slug↔帖ID + performance.json。
- **D5 · 真实拉取**：小红书 note 指标 API（优雅降级手填）。
- **D6 · 数据中心合并**：analytics+xhs 合并，单篇排行 + 异常告警。
- **D7 · 闭环**：performance_priors → scout2 打分加权 + discover 解释。

## 决策记录
- 打分用 deepseek-v4-flash（便宜），不用 pro（选题打分不需要推理深度）；批量+上限控成本。
- radar 双产物：JSON（机器/web）+ MD（人/obsidian），单一来源是 JSON，MD 由它生成。
- 真实拉取拉不到就降级手填，绝不因 API 失败让数据页空白（不倒退）。
- 发送动作仍人审后；本改版只动"选题进"和"数据回"，不碰分发合规边界。
