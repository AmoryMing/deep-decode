# Content Factory Index

> AI 每次操作后更新此文件。查询时先读 index 定位。

## Claude Code UX 源码拆解系列 -- 8 篇（新）

- [[2026-04-16-ux-ink-engine]] -- Ink 渲染引擎（79 files，React→终端管线）
- [[2026-04-20-ux-spinner-animation]] -- Spinner 动画（12 files，187 文案+Shimmer+Juiciness）✓ 已发布
- [[2026-04-16-ux-prompt-input]] -- PromptInput（21 files，输入框交互全貌）
- [[2026-04-16-ux-message-rendering]] -- 消息渲染（41 files，41 种消息类型）
- [[2026-04-16-ux-design-system]] -- 设计系统（16 files，终端主题/颜色/原子组件）
- [[2026-04-16-ux-permission-system]] -- 权限 UI（51 files，信任界面 6 级实现）
- [[2026-04-16-ux-app-screens]] -- App 全局架构（REPL+Doctor+生命周期）
- [[2026-04-16-ux-vim-keybindings]] -- Vim 状态机+快捷键（19 files）

## 已发布 decode（output/）-- 最新

- [[output/2026-05-26-dont-know-what-claude-code-doing/article|2026-05-26 思考被默认藏起来了：Claude Code v2 把可观测性押给了反蒸馏]] -- GitHub #8477 + 81 楼评论 + 6 个源码文件，拆"三层默认值合成静默坏掉"：服务端 redact header + 客户端不传 display + !isInteractive gate；anti-distillation 在 betas.ts:279 直接命名；用户工具链 UI 切换 → env var → CLI flag → binary patch 代价递增；review-ready 27/30，含 3 图
- [[output/2026-05-21-tencent-databuddy-data-agent/article|2026-05-21 云厂商开始卖"默认数据团队"]] -- 腾讯 DataBuddy 嵌入 WeData console；4/13 Snowflake Cortex Agents、4/15 阿里 DataWorks 商业化、5/19 腾讯、同周 Databricks Genie Code 拉成一条横线；统一语义层从可选变必选；通用 LLM 写不了你公司元数据是真壁垒；含 6 图 + 播客 14m11s
- [[output/2026-05-21-google-io-search-becomes-agent/article|2026-05-21 谷歌 I/O 之后：搜索框正在变成 Agent 入口]] -- 与 5/20 capex 篇切分；I/O 真正主线是 PC 时代 40 年 GUI 原语被 Agent 入口替换；Perplexity URL/OpenAI 桌面/Anthropic 工具/Google 搜索框四象限；含 6 图 + 播客 12m25s
- [[output/2026-05-21-qwen-3-7-max-china-king/article|2026-05-21 1475 分的中国闭源最高位：Qwen3.7-Max 不是新模王，是阵营换挡]] -- LM Arena 1475/第 13/Lab 第 6，半年涨 11 分头部涨 7 分；阿里把旗舰从开源里拿走是商业化决心；三件套绑定（模型+平头哥 M890+百炼）；含 6 图 + 播客 10m03s
- [[output/2026-05-19-cheap-software-trust-gap/article|2026-05-19 软件免费之后，贵的是信任]] -- 功能成本塌缩后，可信执行成为新价格；含 4 图、Remotion 视频、播客、邮件草稿
- [[output/2026-05-19-openai-ipo-musk-lawsuit/article|2026-05-19 OpenAI 的 IPO 路，不是被官司清空的]] -- Musk 败诉清掉诉讼噪音，不等于 IPO 门槛消失；含 4 图、Remotion 视频、播客、邮件草稿
- [[output/2026-05-19-anthropic-stainless-platform/article|2026-05-19 Anthropic 收购 Stainless：模型公司开始买接口层]] -- SDK/MCP 接口层成为 Agent 平台护城河；含 4 图、Remotion 视频、播客、邮件草稿
- [[output/2026-05-19-ios27-third-party-ai-models/article|2026-05-19 苹果开放第三方 AI：多模型时代不是换一个 Siri]] -- iOS 27 报道指向 OS 模型路由，而不是全面放权；含 4 图、Remotion 视频、播客、邮件草稿
- [[output/2026-05-18-claude-m5-kernel-exploit/article|2026-05-18 五年防线，五天击穿]] -- Calif blog + Apple MIE 官方说明 + Anthropic Mythos 红队页，拆"被打穿的是摩擦型安全经济学不是硬件墙"：MIE 指针级防护对 data-only 天然失效，AI 把专家数月工序压成数天
- [[output/2026-05-18-agent-memory-rewrite-harms/article|2026-05-18 记忆越改越坏：自进化 Agent 的压缩陷阱]] -- arXiv 2605.12978（UIUC + 清华 IIIS），拆"持续重写文本记忆不是自我提升引擎"：GPT-5.4 在它无记忆 100% 能解的 19 道 ARC-AGI 题上，流式重写 10 轮后掉到 52.6%；错的不是经历是重写动作，三机理=错分组/干扰/过拟合，修法=原始经历当一等公民+压缩设闸
- [[output/2026-05-18-zerostack-rust-coding-agent/article|2026-05-18 12MB 对 300MB，但内存不是 Zerostack 的护城河]] -- crates.io 1.0.0 + GitHub README + HN 536 点，拆纯 Rust 极简编程代理：真护城河是单人不可规模化的工程克制，不是 8MB
- [[output/2026-05-18-ai-execs-white-collar-end/article|2026-05-18 两份职业讣告：同一周两家最大 AI 公司在埋葬白领]] -- Suleyman FT/Fortune（18 个月白领全自动化）× Amodei WSJ/Davos（软件免费、职业消失）双高管对照，拆"预言暴露的是签发人的资产负债表，杀伤力大于命中率"：刀口任务 vs 商业模式、Frey/Osborne 47% 对核保员 +16.4%、Fed +1.9% / MIT 95% 零 P&L、斯坦福分层 -16%
- [[output/2026-05-12-anthropic-financial-services/article|2026-05-12 Anthropic 开始卖金融行业的默认工作流]] -- financial-services 仓库 + Claude for Financial Services 官方线索，拆行业 know-how 如何被产品化成默认工作流
- [[output/2026-05-12-openai-developers-plugin/article|2026-05-12 OpenAI 把 Codex 接到了 API 入口]] -- OpenAI Developers plugin + Codex plugins + Responses/Agents SDK，拆 Codex 如何变成 API 开发入口
- [[output/2026-05-12-claude-code-agent-view/article|2026-05-12 任务调度台来了]] -- Claude Code v2.1.139 agent view + `/goal`，拆 AI coding 从单会话助手转向任务调度台
- [[output/2026-05-11-ai-finished-but-human-doesnt-know/article|2026-05-11 thinking 默认隐身]] -- GitHub issue #8477 + Anthropic 源码注释 betas.ts:265，拆 v2.0.0 UI 隐藏 + 2026-02-12 redact-thinking beta 两刀连击
- [[output/2026-05-09-html-agent-artifacts/article|2026-05-09 Markdown 没死，只是退回草稿层]] -- Thariq HTML effectiveness + Berryxia 中文转述，拆 Agent 输出从文档转向工作界面
- [[output/2026-05-08-codex-pets-state-personification/article|2026-05-08 状态拟人化：Codex 为什么需要一只桌宠]] -- 官方 Codex pets 文档 + Claude buddy 源码对照，拆工作型桌宠如何把后台 Agent 状态变成低噪 overlay
- [[output/2026-04-30-amap-personal-map-skill/article|2026-04-30 高德把地图变成 Skill]] -- LBS 厂商从"卖 API 调用次数"切到"为 Agent 备货"。Tech/Money/Product 三层框架
- [[output/2026-04-30-microinteraction-ai-era/article|2026-04-30 微交互在 AI 产品里失效了]] -- Saffer 2013 范式 vs Claude Code StreamingMarkdown 稳定边界 + Esc 三层中断 + 信息论选择
- [[output/2026-04-30-claude-creative-connectors/article|2026-04-30 Anthropic 把 €240,000 一年转给了 Blender，顺手卡住了 9 把锁]] -- 9 件套 connector + Corporate Patron 转移支付。商汤 SenseNova 配图首跑
- [[output/2026-04-29-skill-graphs-2/article|2026-04-29 Skill Graph 1.0 必塌]] -- Shiv Sakhuja 三层切法 + 工厂自审

## Concepts（概念实体）-- 16 页

- [[html-artifact]] -- Agent 为一次任务临时生成的 HTML 工作界面，负责阅读、操作、导出和回流（2026-05-09 新建）
- [[state-personification]] -- 状态拟人化：把 Agent running/waiting/review 状态变成可扫视的伴侣界面（2026-05-08 新建）
- [[microinteraction-ai-era]] -- AI 时代微交互范式：从装饰转向不确定性可视化（2026-04-30 新建）
- [[stable-boundary]] -- 流式 Markdown 稳定边界算法，O(全文)→O(增量)（2026-04-30 新建）
- [[collaborative-abort]] -- Agent 协作中断三层语义，Esc 一键三义（2026-04-30 新建）
- [[skill-graph-levels]] -- atoms/molecules/compounds 三层抽象（2026-04-29 新建）

- [[harness-engineering]] -- Harness > Model，AI 产品护城河不是模型是脚手架
- [[permission-pipeline]] -- 四层权限管道：规则→Bash分类→LLM分类→用户确认
- [[context-compression]] -- 三层上下文压缩，先用最便宜的
- [[memory-system]] -- 不记代码只记人，7 层记忆架构
- [[kairos]] -- 24/7 后台守护进程，从 reactive 到 proactive
- [[autodream]] -- AI 做梦：4 阶段记忆巩固（orient/gather/consolidate/prune）
- [[undercover-mode]] -- Anthropic 员工隐身模式，最具伦理争议的发现
- [[multi-agent]] -- 三种 Agent 原语：SubAgent/Fork/Teammate
- [[buddy-system]] -- 18 物种电子宠物，留存策略不是彩蛋
- [[multi-model-strategy]] -- Opus 推理 + Haiku 杂活，双模型经济学
- [[enterprise-content-ops]] -- 企媒内容运营：结构嵌入/强调嵌入/对比嵌入，系统演进 v3→factory

## Topics（选题库）-- 34 个

### 已发布 (status: published) -- 8 个
- [[2026-04-03-claude-code-leak-panorama]] -- 1902个文件里藏了什么
- [[2026-04-03-harness-greater-than-model]] -- Harness > Model 秘密武器
- [[2026-04-03-two-leaks-evolution]] -- 从 v0.2.8 到 v2.1.88 技术演进
- [[2026-04-03-queryengine-brain]] -- QueryEngine 13000 行大脑中枢
- [[2026-04-03-kairos-daemon]] -- KAIROS 7x24 后台 Daemon
- [[2026-04-03-undercover-mode]] -- Undercover Mode 隐身衣
- [[2026-04-03-agent-loop-single-thread]] -- 单线程 Agent Loop 不用 Swarm
- [[2026-04-03-speculation-prefetch]] -- 推测执行流水线预生成

### 待写 - 素材充足 (strong) -- 5 个
- [[2026-04-03-buddy-pet]] -- Buddy 电子宠物系统
- [[2026-04-03-autodream]] -- AutoDream 四阶段记忆巩固
- [[2026-04-03-feature-flags-44]] -- 44 个 Feature Flags 未发布功能
- [[2026-04-03-business-moat]] -- 从源码看商业护城河
- [[2026-04-03-system-prompt-philosophy]] -- System Prompt 设计哲学

### 待写 - 素材中等 (moderate) -- 13 个
- [[2026-04-03-anti-distillation]] -- fake_tools 毒化竞品
- [[2026-04-03-dual-model-economics]] -- Opus+Haiku 双模型分工
- [[2026-04-03-six-level-security]] -- 6 级安全架构
- [[2026-04-03-45-tools-panorama]] -- 45 个内置工具全景
- [[2026-04-03-context-compression]] -- 92% 缓存复用率
- [[2026-04-03-bashtool-security]] -- BashTool 23 项安全检查
- [[2026-04-03-webfetchtool-deep-dive]] -- WebFetchTool 1173 行深潜
- [[2026-04-03-sub-agent-coordinator]] -- 子 Agent 最小权限
- [[2026-04-03-bash-yolo-classifier]] -- LLM 做安全门卫
- [[2026-04-03-unicode-injection]] -- Unicode 零宽字符注入防护
- [[2026-04-03-leak-pr-stunt]] -- 泄露始末：事故还是 PR
- [[2026-04-03-skills-hooks-mcp]] -- Skills+Hooks+MCP 三位一体
- [[2026-04-03-megathink-ultrathink]] -- 思考模式分级机制

### 待写 - 素材不足 (weak) -- 8 个
- [[2026-04-03-snip-mechanism]] -- Snip 长对话不丢语义
- [[2026-04-03-toolsearch-lazy-loading]] -- ToolSearch 冷启动优化
- [[2026-04-03-team-protocol]] -- TeamCreate 多 Agent 协调协议
- [[2026-04-03-rejection-tracking]] -- 拒绝追踪系统
- [[2026-04-03-ink-terminal-ui]] -- Ink 终端 React UI
- [[2026-04-03-vim-mode]] -- Vim 模态编辑器
- [[2026-04-03-bridge-remote]] -- Bridge 远程会话
- [[2026-04-03-telemetry-three-channels]] -- 三大遥测通道

## Sources（信源摘要）-- 13 页

- [[thariq-html-effectiveness]] -- Claude Code 团队 Thariq：HTML artifact 比 Markdown 更适合复杂 Agent 输出
- [[openai-codex-pets]] -- OpenAI Codex pets 官方设置说明：/pet、Wake/Tuck Away、floating overlay、hatch-pet 自定义路径
- [[2026-05-07-voxcpm-official]] -- VoxCPM2 官方资料与产品页
- [[lenny-cat-wu-anthropic-product-team]] -- Lenny 访谈 Cat Wu：Anthropic 产品团队如何高速移动
- [[writing-methodology]] -- 写作方法论：6篇范文分析 + 15条技法 + 11条禁忌
- [[content-strategy]] -- 内容策略：选题方向 + 信息源体系 + 企媒风格适配
- [[visual-pipeline]] -- SVG 技术规范：双风格体系 + 配色 + 字体 + 避坑
- [[concept-diagram-design]] -- 概念图解设计原则：6条原则 + 隐喻词汇表 + 自检清单（Olah/Carter/Tufte）
- [[distribution-pipeline]] -- 多渠道分发管线：邮件/微信/小红书/播客，6 个脚本
- [[deep-decode-v3]] -- Deep Decode v3 技能规范：七阶段/五模式/七铁律
- [[production-gotchas]] -- 内容生产踩坑录：40 条实战经验（SVG/DOCX/播客/微信/小红书）
- [[ground-truth]] -- 内容生产系统总纲：信号评分/三层信源/企媒适配/HTML模板标准
- [[harness-design-patterns]] -- Anthropic Generator-Evaluator 架构：Sprint Contract/六维评分/分阶段上线

## Developer Diary（开发者日记）

- [[2026-05-23-generative-visual-identity-system]] -- 生成式视觉识别系统：把 VIS、Character Bible、Controlled Vocabulary 和 Prompt Atom Library 合成一套品牌安全的生成式管线

## Modules（模块规范）

- [ingest](modules/ingest.md) -- 知识管理（吃 → wiki 页面），3 个决策点
- [project](modules/project.md) -- 主编式项目流水线（Strategy Spec → spec_lock → 执行器）
- [produce](modules/produce.md) -- 内容生产（写 → 文章 + 评审），Generator 3 点 + Evaluator 3 点

## 排期 & 评审

- [schedule/queue.md](schedule/queue.md) -- 待写
- [schedule/in-progress.md](schedule/in-progress.md) -- 在写
- [schedule/published.md](schedule/published.md) -- 已发（多平台进度表）
- [schedule/calendar.md](schedule/calendar.md) -- 月历视图
- `wiki/evaluation/` -- 质量评审报告

## Published（发布复盘）-- 8 页

- [[2026-05-12-anthropic-financial-services]] -- Anthropic 金融行业默认工作流（2026-05-12，financial-services 仓库 + 官方金融服务产品线）
- [[2026-05-12-openai-developers-plugin]] -- Codex 接到 OpenAI API 入口（2026-05-12，OpenAI Developers plugin + Responses/Agents 官方文档）
- [[2026-05-12-claude-code-agent-view]] -- Claude Code 任务调度台（2026-05-12，v2.1.139 agent view + `/goal`）
- [[2026-05-09-html-agent-artifacts]] -- Markdown 退回草稿层（2026-05-09，Thariq HTML effectiveness + Berryxia 中文转述）
- [[2026-05-08-codex-pets-state-personification]] -- 状态拟人化（2026-05-08，Codex pets 官方文档 + Claude buddy 源码对照）
- [[anthropic-product-launchroom]] -- 发射台产品学（2026-04-27，Cat Wu 访谈）
- [[pm-ai-exponential]] -- PM遇上指数级AI（2026-03-29，Cat Wu）
- [[capability-overhang]] -- AI能力悬置（2026-03-29，Aaron Levie）
- [[boris-claude-code-tips]] -- Boris 15条隐藏功能（2026-03-31）
- [[managed-agents-architecture]] -- 脑手分离（2026-04-09，标杆文章）
- [[buddy-pet]] -- 五个文件一整套灵魂（2026-04-13，含冰山/硬币/阶梯概念图解）
- [[claude-code-addiction]] -- 老虎机效应（2026-04-15，Enrico Tartarotti 视频拆解，游戏心理学+Tesler定律）
- [[2026-05-18-gbrain-personal-ai-memory]] -- GBrain 没有 8 层（2026-05-18，Garry Tan 开源 GBrain；拆穿"8 层"框架错位，真正突破在 compiled-truth+timeline 数据模型）

## Styles（风格套件，多套并存）

- [styles/README.md](styles/README.md) -- 套件机制说明
- [styles/default/](styles/default/) -- 默认套件（voice + feedback + best）
- [styles/enterprise/](styles/enterprise/) -- 企业向套件
- [styles/_shared/](styles/_shared/) -- 跨套件共享（personality / gotchas / playbook）
