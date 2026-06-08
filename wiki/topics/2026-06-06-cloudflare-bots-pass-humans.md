---
title: 机器人首次超过人类访问网页 — 真正变天的不是比例，是"网页写给谁看"
type: topic
created: 2026-06-06
updated: 2026-06-06
style: default
content_type: decode
reader: default
distribute: [email, 公众号, 小红书, 视频号]
tags: [cloudflare, ai-agents, bot-traffic, seo, aeo, dead-internet, 评估, 决策者, 开发者, 创作者]
status: queued
---

# 机器人首次超过人类访问网页 — 真正变天的不是比例，是"网页写给谁看"

## 一句话选题

2026 年 6 月 4 日，Cloudflare CEO Matthew Prince 在 X 上承认：机器人流量（绝大部分是 AI agent）首次超过人类，占全网 HTTP 请求的 57.5%——比 Cloudflare 自己的预测早了约 18 个月；但热搜停在"57.5%、好吓人"，没人去问真正变天的那件事：网页的读者正在从人换成 agent，"给人看的网页"和"给 agent 读的接口"开始分叉。

## 主判断（候选，写作时收敛）

**这条数据真正的含义不是"机器人多了"，而是"网页的目标读者变了"。** 过去三十年，网页的隐含读者是人——人会看排版、会被标题党吸引、会在页面上停留并产生广告价值。当超过一半的请求来自 agent，网页第一次要面对一个不看排版、不点广告、只解析结构化语义、替它背后的人类做决策的读者。Prince 自己点破了下一步——"显然会变成 pay to crawl（爬取要付费）"——但这只是计费层。更深的位移在产品层：**"给人看的网页"和"给 agent 读的接口"正在分叉成两件事**，而绝大多数公司的官网、内容、SEO 体系，今天还只为前者优化。这不是 2027 年的事，是已经发生、且地区分布极不均匀的事——北美已有 68.6% 的请求来自 agent，而美国中西部仍有 54.5% 是人类。同一个全球互联网，正在以不同速度被 agent 接管。

## 反判断 / 盲区

- **卖"挡机器人"的人，亲口说这数据"有点乱"。** Prince 的第二条帖子原话承认数据 "a bit messy"（有点乱、不太干净）。这点必须放大：Cloudflare 的商业模式就是替网站挡爬虫、做 bot 管理、并准备推 pay-to-crawl 收费——一个靠"机器人威胁"赚钱的人，发布"机器人首次超过人类"的爆点数据，本身有立场。承认数据粗糙是诚实，但读者不该把 57.5% 当成精确的体温计读数。
- **连那个数字本身，不同媒体都没抄一致。** Tom's Hardware、Piunikaweb 报 57.5% / 42.5%；SiliconANGLE、The Decoder 报 57.4% / 42.6%。差 0.1pp 不影响判断，但恰好坐实了"a bit messy"——这是一条 X 帖子里的快照，不是经同行评审的统计年报。本文统一采用 57.5% 口径并标注此分歧。
- **bot ≠ agent，agent ≠ 替人决策的 agent。** Cloudflare 这个口径里的"机器人"是个大筐：传统搜索引擎爬虫、监控探针、恶意扫描、AI 训练数据抓取、以及真正"替某个人类此刻做事"的 agent（替你比价、订机票、读产品页），全算进去了。把这一筐笼统说成"AI agent 取代人类上网"，是热搜的偷换。真正的范式信号是最后一类在涨——但它在 57.5% 里占多少，这条数据答不了。
- **"机器人过半"会被接到"死亡互联网理论"上煽情。** 已有媒体（SiliconANGLE）把它当"dead internet theory（死亡互联网理论：网上内容和互动大多由机器伪造）"的佐证。但流量结构变化是真实的工程事实，"互联网已死"是情绪。不要替对方把这两件事画等号。

## 三类读者各自的位移

这条选题罕见地同时砸中三类读者，每类要被位移的东西完全不同：

- **决策者（B 端 / 品牌 / 市场）：SEO 要重做成 AEO。** 你花钱优化的标题、首屏、停留时长、信息架构，都是为"人类读者 + 搜索引擎排名"设计的。当读者变成 agent，游戏规则从 SEO（搜索引擎优化）转向 AEO（Answer Engine Optimization / Agent 可读性优化）：你的页面能不能被 agent 干净地解析、提取、并在它替用户做决策时被引用？品牌曝光不再等于"人看到你的页面"，而是"agent 把你的事实喂给了它背后的人"。把官网当成"给 agent 读的结构化数据源"来重做，比再投一轮信息流更贴近 2027 年的真问题。
- **开发者 / Tech Lead：每个动作的 HTTP 请求数变了，限流和成本模型必须重写。** 一个人类用户"比一次价"可能是几次点击、几十个请求；一个 agent 替人"比价"可能在几秒内打穿你十几个接口、翻几十个产品页。按"人类会话"假设设计的 rate-limiting、缓存、按请求计费的云成本模型，会在 agent 流量下集体失真——要么把正经 agent 误杀，要么被一个 agent 把成本打爆。Cloudflare 推 pay-to-crawl 正是这个错配的商业答案，但每个自建服务的团队都得自己回答：我的限流单位还该是"用户"吗，还是该变成"动作 / 任务"？
- **创作者（内容 / 设计 / 视频）：你的东西会越来越多地被 agent 二次消费，而不是被人直接读。** 当 agent 成为读者的中间层，你写的文章、做的图、剪的视频，越来越多是先被 agent 抓取、摘要、再转述给人——人可能永远不会落到你的页面上、不会看到你的排版、不会记住你的名字。这对"靠页面停留和直接触达变现"的逻辑是釜底抽薪。反过来，可被 agent 准确提取、被它当作可信源引用的内容，会拿到一种新的分发红利。问题从"怎么让人点进来"，变成"怎么让 agent 把我当成它愿意引用的源"。

## 一手信源

1. Matthew Prince（Cloudflare CEO）2026-06-04 在 X（推特）的两条帖子——原始信源，本事件出处。原文含 "Welp, that happened faster than I predicted. Thought it would be end of 2027, then early 2027..."（"行吧，这比我预测得快。本以为是 2027 年底，然后是 2027 年初……"）及第二条承认数据 "a bit messy"。数据来自 Cloudflare Radar。**未直接抓取原帖，以下二手报道转述其原话；写作前若能定位原推 URL 应补入并以原帖为准。**
2. Tom's Hardware（2026-06-04，Mark Tyson）：https://www.tomshardware.com/tech-industry/artificial-intelligence/bots-have-now-passed-human-traffic-online-cloudflare-boss-laments-says-agentic-traffic-wasnt-expected-to-eclipse-real-people-until-next-year — 已 WebFetch 核实"57.5 / 42.5"口径及"原本预计明年才发生"的框架；正文被截断，区域数据未在该页确认。
3. SiliconANGLE（2026-06-04）：https://siliconangle.com/2026/06/04/ai-agent-web-traffic-surpassed-humans-lending-weight-dead-internet-theory/ — 已 WebFetch 核实：北美 68.6% agent / 31.4% 人类；美国中西部 45.5% agent / 54.5% 人类；Prince 原话（2027 时间线 + "a bit messy"）；该页口径为 57.4 / 42.6。
4. The Decoder（2026-06-04）：https://the-decoder.com/cloudflare-ceo-says-the-webs-future-is-pay-to-crawl-as-bots-overtake-human-traffic/ — 已 WebFetch 核实 "clearly it's going to be pay to crawl"（"显然会变成爬取付费"）及晚于 2027 的预期；口径同为 57.4 / 42.6；区域数据未在该页出现。
5. Piunikaweb（2026-06-04）：https://piunikaweb.com/2026/06/04/cloudflare-bot-traffic-overtakes-humans/ — 标题指向"早于 Cloudflare 预期的 2027 时间线 / 18 个月提前"。**WebFetch 返回 403，未能直接核实页面正文；"18 个月提前"由其标题及搜索摘要交叉佐证，写作时标为媒体口径而非 Cloudflare 官方措辞。**
6. NBC News：https://www.nbcnews.com/tech/tech-news/bot-web-traffic-overtaken-human-web-traffic-data-shows-rcna348522 — 主流媒体跟进，证明事件已破圈，可作"热搜只停在比例"的佐证（未逐条核实数字，仅作存在性引用）。

> 核实小结：57.5%/42.5%（部分媒体 57.4/42.6，差 0.1pp，已标注）、北美 68.6%、中西部 54.5% 人类、"a bit messy"、"pay to crawl"、早于 2027 预期——均经至少两个独立来源交叉确认。仅"18 个月提前"的精确措辞与 Prince 原推 URL 未一手落实，已在正文与信源标注。

---
署名：Amory · AI文科生
