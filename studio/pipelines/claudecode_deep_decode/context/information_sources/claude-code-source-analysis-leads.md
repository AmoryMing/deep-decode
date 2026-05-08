# Claude Code 源码解读 -- 精选信息源表

> 最后更新: 2026-04-02
> 两次泄露: 2025-02 (v0.2.8 base64 sourcemap) + 2026-03-31 (v2.1.88 .npmignore 缺失, 512K+ 行)

---

## 一、从哪开始读 -- 精选入口

> 东西太多不知道从哪看？按你的角色选一个入口。

| 你是谁 | 推荐入口 | 为什么 |
|--------|----------|--------|
| **快速了解** | [Claude Code源码泄露7小时：8大新功能/26个隐藏指令/6级安全架构，全被扒光了](https://mp.weixin.qq.com/s/cJGWji1XeOEXgYGvIxGCtA) | 中文，通俗，5分钟读完全貌 |
| **技术团队，全景架构** | [waiterxiaoyy/Deep-Dive-Claude-Code](https://github.com/waiterxiaoyy/Deep-Dive-Claude-Code) | 13章逐层拆解，配可视化+agent模拟器 |
| **技术团队，挑模块深读** | [awesome-claude-code-postleak-insights](https://github.com/nblintao/awesome-claude-code-postleak-insights) | 英文世界最佳 awesome list，按主题索引 |
| **产品人，学设计决策** | [Sebastian Raschka: Secret Sauce Isn't the Model](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html) | ML 大佬论证 harness > model，产品视角最强 |
| **想动手跑** | [NanmiCoder/claude-code-haha](https://github.com/NanmiCoder/claude-code-haha) | 中文README，修复可运行，接自定义API |
| **社区情报汇总** | [Latent.Space: AINews 泄露专刊](https://www.latent.space/p/ainews-the-claude-code-source-leak) | swyx 监控 12 个 subreddit + 544 Twitter 账号的综合情报 |

---

## 二、源码在哪 -- 版本对照表

> "泄露了几次？源码去哪下？"

| 版本 | 时间 | 泄露方式 | 仓库/来源 | 状态 |
|------|------|----------|-----------|------|
| **v0.2.8** (早期) | 2025-02 | cli.mjs 内嵌 base64 sourcemap | [ghuntley/deobfuscation](https://github.com/ghuntley/claude-code-source-code-deobfuscation) -- LLM cleanroom 反混淆还原 TS | 已归档 |
| **v0.2.8** (早期) | 2025-02 | 同上，sourcemap 解析路线 | [leeyeel/claude-code-sourcemap](https://github.com/leeyeel/claude-code-sourcemap) | 已归档 |
| **v2.1.88** (完整泄露) | 2026-03-31 | .npmignore 缺失，59.8MB cli.js.map 暴露 1,884 个 TS 文件 | [sanbuphy/claude-code-source-code](https://github.com/sanbuphy/claude-code-source-code) -- 含中文 README | npm 已撤 |
| **v2.1.88** 合集 | 2026-03-31 | 多镜像汇总 | [chauncygu/collection-claude-code-source-code](https://github.com/chauncygu/collection-claude-code-source-code) | 合集索引 |
| **12 版本逆向对比** | 2025-2026 | 跨版本逆向工程 | [12 Versions Reverse-Engineered](https://dev.to/kolkov/we-reverse-engineered-12-versions-of-claude-code-then-it-leaked-its-own-source-code-pij) | 版本演进分析 |
| **ghuntley 方法论** | 2025 | 用 LLM 做 cleanroom 反混淆的技术文章 | [ghuntley.com/tradecraft](https://ghuntley.com/tradecraft/) | 方法论参考 |

---

## 三、跑起来 -- 可运行版本

> "我能本地跑吗？接什么模型？"

| 仓库 | 语言 | 自定义 API | 中国模型 | 中文 README | 说明 |
|------|------|-----------|----------|------------|------|
| [NanmiCoder/claude-code-haha](https://github.com/NanmiCoder/claude-code-haha) | TypeScript | 是 | 是（任意兼容API） | 是 | 泄露源码修复版，3.2k stars，快速上手首选 |
| [claude-code-best/claude-code](https://github.com/claude-code-best/claude-code) | TypeScript | 是 | 是 | 是 | 原汁原味，Bun 编译，TS 类型全修复，`bun i && bun run dev` |
| [pengchengneo/Claude-Code](https://github.com/pengchengneo/Claude-Code) | TypeScript | 是 | 是 | 是 | 含完整功能（ultraplan/宠物系统） |
| [Rito-w/ClaudeCode](https://github.com/Rito-w/ClaudeCode) | TypeScript | 是 | 待确认 | 否 | 可运行源码 |
| [cfrs2005/claude-init](https://github.com/cfrs2005/claude-init) | TypeScript | 是 | 是 | 是 | 中文开发套件，零门槛，集成 MCP/安全扫描，免翻墙 |
| [musistudio/claude-code-router](https://github.com/musistudio/claude-code-router) | TypeScript | 是（路由层） | 是 | 是 | API 路由服务，自定义端点接入 |
| [Kuberwastaken/claurst](https://github.com/Kuberwastaken/claurst) | **Rust** | 是 | 待确认 | 否 | Rust 重写版，性能更高 |
| [Piebald-AI/tweakcc](https://github.com/Piebald-AI/tweakcc) | TypeScript | 是 | 待确认 | 否 | 修改器：自定义 prompt/工具集/主题/解锁隐藏功能 |
| [lyzcodebool/claude-code-api](https://github.com/lyzcodebool/claude-code-api) | TypeScript | 是 | 是 | 是 | 三步本地安装教程 |

**接入国内模型说明**: 支持"自定义 API"的版本均可通过设置 `API_BASE_URL` 接入 DeepSeek/Qwen/GLM/Kimi 等兼容 Anthropic API 格式的服务。标注"是（中国模型）"的仓库在文档中明确提及了这一用法。

---

## 四、架构怎么设计的

> "内部怎么工作的？我能学什么？" 按子系统拆解，每个子系统下混排仓库、博客、视频。

### 4.1 Agent Loop -- 核心调度

> 单线程主循环 + h2A 异步双缓冲队列，刻意不用 swarm/多角色竞争。

| 来源 | 类型 | URL | 要点 |
|------|------|-----|------|
| PromptLayer Blog | 博客 | [链接](https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/) | 核心 agent loop 深度拆解，含配套演讲视频 |
| PromptLayer 演讲 | 视频 | [链接](https://blog.promptlayer.com/watch-my-ai-engineering-talk/) | AI Engineering 大会演讲版 |
| George Sung | 博客 | [链接](https://medium.com/@georgesung/tracing-claude-codes-llm-traffic-agentic-loop-sub-agents-tool-use-prompts-7796941806f5) | 通过 Ollama 追踪实际请求，揭示双模型策略（Opus 推理 + Haiku 杂活） |
| 掘金 | 博客 | [链接](https://juejin.cn/post/7623066322222153728) | 中文: ReAct 机制 agent 循环引擎，40+ 内置工具安全设计 |
| B站 -- 19模块拆解 | 视频 | [链接](https://www.bilibili.com/video/BV1Dp9VBpEJS/) | 19 个模块逐一拆解内部架构 |

### 4.2 工具系统 -- 40+ Tools

> 文件读写、Bash 执行、子 Agent 生成，每条 bash 命令经过 23 项安全检查。

| 来源 | 类型 | URL | 要点 |
|------|------|-----|------|
| Engineer's Codex | 博客 | [链接](https://read.engineerscodex.com/p/diving-into-claude-codes-source-code) | 工具系统 + 查询引擎 + 多 agent 编排全景 |
| nblintao (WebFetchTool) | 博客 | [链接](https://medium.com/@nblintao/how-an-ai-reads-the-web-a-deep-dive-into-claude-codes-webfetchtool-0abee4446343) | 单模块深潜: 1,173 行，域名白名单、重定向沙箱、Haiku 摘要 |
| Randal S. Olson | 博客 | [链接](https://www.randalolson.com/2026/04/02/claude-code-leak-four-charts/) | 4 张图拆解 40 个工具模块分布 |

### 4.3 上下文工程 -- 缓存与压缩

> Prompt prefix 复用率 92%，三层压缩：MicroCompact → AutoCompact → Full Compact。

| 来源 | 类型 | URL | 要点 |
|------|------|-----|------|
| LMCache Blog | 博客 | [链接](https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/) | 92% 缓存复用率，预热步骤确保命中 |
| Sebastian Raschka | 博客 | [链接](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html) | 静态段全局缓存、子 agent 复用父缓存 |
| B站 -- 为什么这么好用 | 视频 | [链接](https://www.bilibili.com/video/BV1iapXzDE6W/) | 从源码角度解释性能来源 |

### 4.4 System Prompt 与 Skill 系统

> 24 个内置工具描述、megathink/ultrathink 思考模式、子 agent prompt 设计。

| 来源 | 类型 | URL | 要点 |
|------|------|-----|------|
| Piebald-AI/system-prompts | 仓库 | [链接](https://github.com/Piebald-AI/claude-code-system-prompts) | 全量 system prompt 文本，每版分钟级同步 |
| asgeirtj/system_prompts_leaks | 仓库 | [链接](https://github.com/asgeirtj/system_prompts_leaks) | 跨产品 prompt 合集（ChatGPT/Claude/Gemini/Grok） |
| Lee Hanchung | 博客 | [链接](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/) | Skill 系统第一原理分析，含 megathink/ultrathink |
| 微信 -- 核心提示词曝光 | 微信 | [链接](https://mp.weixin.qq.com/s/bqU5wj7JIMlwSa1LkFdxsg) | Anthropic system prompt 设计哲学 |

### 4.5 多 Agent 协作

> 子 agent 最小权限原则，Coordinator 模式，Opus+Haiku 双模型分工。

| 来源 | 类型 | URL | 要点 |
|------|------|-----|------|
| George Sung | 博客 | [链接](https://medium.com/@georgesung/tracing-claude-codes-llm-traffic-agentic-loop-sub-agents-tool-use-prompts-7796941806f5) | Opus 做主推理，Haiku 做元数据/探索/摘要 |
| HN 讨论 | 社区 | [链接](https://news.ycombinator.com/item?id=47597085) | "Claude Code Unpacked" 架构可视化讨论 |
| 腾讯新闻 | 报道 | [链接](https://news.qq.com/rain/a/20260331A07EUY00) | 中文: 从泄漏源码看第一梯队 AI Agent 工程架构 |

### 4.6 安全与权限

> 23 项 bash 安全检查，unicode 零宽字符注入防护，6 级安全架构。

| 来源 | 类型 | URL | 要点 |
|------|------|-----|------|
| 36氪 -- 6级安全架构 | 博客 | [链接](https://36kr.com/p/3747481076417289) | 中文: 8大未发布功能、26个隐藏指令、6级安全架构 |
| Blockchain Council | 博客 | [链接](https://www.blockchain-council.org/claude-ai/inside-claude-source-code-leak-technical-takeaways-llm-developers-prompt-engineers/) | memory 弹性系统、权限审计机制 |

### 4.7 全景架构（多子系统综合）

> 以下来源覆盖多个子系统，适合系统性阅读。

| 来源 | 类型 | URL | 要点 |
|------|------|-----|------|
| waiterxiaoyy/Deep-Dive-Claude-Code | 仓库 | [链接](https://github.com/waiterxiaoyy/Deep-Dive-Claude-Code) | 13 章逐层拆解，**系统学习首选** |
| tvytlx/claude-code-deep-dive | 仓库 | [链接](https://github.com/tvytlx/claude-code-deep-dive) | 中文源码深度研究报告 |
| catyans/claude-code-source-analysis | 仓库 | [链接](https://github.com/catyans/claude-code-source-analysis) | 中文: 逐模块架构解读 |
| JimmyWangJimmy/claude-code-source-analysis | 仓库 | [链接](https://github.com/JimmyWangJimmy/claude-code-source-analysis) | 中文: 13 张架构图 + 正反示例 |
| shareAI-lab/analysis_claude_code | 仓库 | [链接](https://github.com/shareAI-lab/analysis_claude_code) | 中文分析仓库 |
| ComeOnOliver/claude-code-analysis | 仓库 | [链接](https://github.com/ComeOnOliver/claude-code-analysis) | 逆向工程全面分析 |
| bcefghj/ClaudeCode-Source-Analysis | 仓库 | [链接](https://github.com/bcefghj/ClaudeCode-Source-Analysis) | 完整技术分析报告 |
| 阿里云开发者 | 博客 | [链接](https://developer.aliyun.com/article/1722081) | 中文: 架构全景解读，"价值亿元的 AI 工程公开课" |
| 知乎专栏 | 博客 | [链接](https://zhuanlan.zhihu.com/p/2022442135182406883) | 中文: 系统性深度解析 |
| 微信 -- 逆向工程架构曝光 | 微信 | [链接](https://mp.weixin.qq.com/s/VYcxn8c1r11s3EH4kuHfrg) | 五层架构拆解 + Steering 实时纠偏机制 |
| V2EX -- 8个机制 | 社区 | [链接](https://www.v2ex.com/t/1199006) | 8 个机制把 Chat 变成 Agent |
| B站 -- 内部功能与准确性 | 视频 | [链接](https://www.bilibili.com/video/BV11B9TYBE7Z/) | 揭秘内部功能与准确性优化 |

---

## 五、隐藏功能与争议

> "有什么没公开的秘密？" 每个功能一行速查，附最佳解读来源。

| 功能 | 一句话说明 | 最佳来源 |
|------|-----------|----------|
| **KAIROS** | 常驻后台 daemon 模式，7x24 在线，主动修 bug/跑任务/推送通知，原计划 2026-04-01 上线 | [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1s8ijfb/) |
| **Buddy 系统** | Tamagotchi 虚拟宠物，18 物种、5 稀有度、基于用户 ID 哈希确定性生成 | [Randal Olson](https://www.randalolson.com/2026/04/02/claude-code-leak-four-charts/) |
| **Undercover Mode** | ~90 行代码，Anthropic 员工在公开 GitHub 操作时自动激活，抹除 AI 痕迹，无强制关闭开关 | [Alex Kim](https://alex000kim.com/posts/2026-03-31-claude-code-source-leak/) |
| **Anti-Distillation** | 注入 fake_tools 毒化竞品训练数据，防止其他公司用 Claude 输出来训练自家模型 | [Alex Kim](https://alex000kim.com/posts/2026-03-31-claude-code-source-leak/) |
| **AutoDream** | 用户闲置时四阶段记忆巩固：合并观察→消除矛盾→模糊洞察→绝对事实 | 多个来源 |
| **44 Feature Flags** | 编译完成但未发布的功能，编译时 flag=false，108 个门控模块仅存在于内部 monorepo | [noya21th/claude-source-leaked](https://github.com/noya21th/claude-source-leaked) |
| **沮丧检测** | regex 匹配用户沮丧情绪，触发安抚/遥测 | [HN 主帖讨论](https://news.ycombinator.com/item?id=47584540) |
| **内部代号** | Capybara = Claude 4.6 变体, Fennec = Opus 4.6, Numbat = 测试中 | [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/comments/1s8ifm6/) |
| **cch 认证** | 自定义 Bun runtime + Zig 编译的 token 生成，connector-text 加密签名 | [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/comments/1s8ifm6/) |

**综合来源**:
- [36氪: 8大新功能/26个隐藏指令](https://36kr.com/p/3747481076417289) -- 中文，管理层可读
- [53AI: 扒出这些隐藏功能](https://www.53ai.com/news/LargeLanguageModel/2026033157429.html) -- 中文，功能解读
- [B站: 11个隐藏秘密](https://www.bilibili.com/video/BV1ZB9EBmEAU/) -- 视频，直观
- [noya21th/claude-source-leaked](https://github.com/noya21th/claude-source-leaked) -- 87 个 feature flags 全列表

---

## 六、泄露事件经过

> "发生了什么？Anthropic 怎么处理的？" 精简为时间线 + 6 篇核心报道。

### 时间线

| 时间 | 事件 |
|------|------|
| 2025-02 | v0.2.8 cli.mjs 内嵌 base64 sourcemap，社区开始反混淆 |
| 2026-03-31 04:23 ET | Chaofan Shou (@Fried_rice) 在 X 上首发公开泄露（2880万+ 浏览） |
| 2026-03-31 +2h | GitHub 镜像仓库超 50,000 stars，1,900+ fork |
| 2026-03-31 | Anthropic 确认为"发布打包人为错误"，撤下 .map 文件 |
| 2026-04-01 | Anthropic 发出大规模 DMCA，GitHub 下架数千个仓库（TechCrunch 称"意外"） |
| 2026-04-01 | 同日 axios npm 包遭供应链攻击，影响部分同期安装 Claude Code 的用户 |


### 社区讨论

| 平台 | URL | 讨论焦点 |
|------|-----|----------|
| Hacker News 主帖 | [链接](https://news.ycombinator.com/item?id=47584540) | regex 情绪检测 vs 用自家模型、代码质量 |
| 知乎 | [链接](https://www.zhihu.com/question/2022394365436248248) | "如何看待源码泄露事件？" |
| DEV Community | [链接](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm) | "事故、无能、还是史上最佳 PR？" |

---

## 七、产品与商业

### 核心

| 总结 | 一句话 | 来源 |
|------|--------|------|
| **Harness > Model** | Claude Code 的强不在模型，在外围工程（工具编排/缓存/安全/子agent管理），同模型换 harness 效果天差地别 | [Sebastian Raschka](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html) |
| **双模型省成本** | 贵模型(Opus)只做高价值推理，便宜模型(Haiku)做所有杂活，92% prompt 前缀缓存复用 | [LMCache](https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/) |
| **反蒸馏壁垒** | fake_tools 注入毒化竞品训练数据，产品层面的竞争护城河 | [Alex Kim](https://alex000kim.com/posts/2026-03-31-claude-code-source-leak/) |
| **营收占比** | Claude Code 年收入占 Anthropic 总营收 18%，2026 Q1 翻倍增长，2.5x OpenAI Codex | 新闻综合 |
| **IPO 影响** | 第二次安全事故（Mythos之后），在 IPO 筹备期 | [Fortune](https://fortune.com/2026/03/31/anthropic-source-code-claude-code-data-leak-second-security-lapse-days-after-accidentally-revealing-mythos/) |
| **安全责任** | "With Great Agency Comes Great Responsibility" | [Straiker](https://www.straiker.ai/blog/claude-code-source-leak-with-great-agency-comes-great-responsibility) |

### 分析资料

| 来源 | URL | 交付物 |
|------|-----|---------------|
| phodal/claude-code-codex-slide | [链接](https://github.com/phodal/claude-code-codex-slide) | 现成幻灯片，可直接用 |
| JimmyWangJimmy 源码分析 | [链接](https://github.com/JimmyWangJimmy/claude-code-source-analysis) | 中文，13 张架构图，直接截图放 PPT |
| 36氪 -- 王牌提前曝光 | [链接](https://36kr.com/p/3746770616627968) | 中文，商业影响分析 |
| 华尔街见闻 | [链接](https://wallstreetcn.com/articles/3768915) | 财经视角 |
| 微信 -- 断供 OpenAI 竞争升级 | [链接](https://mp.weixin.qq.com/s/lEStBu5Be_Mfqq8zZtZ_vA) | 竞争格局分析 |
| 知乎 -- 用 CC 解读 CC | [链接](https://zhuanlan.zhihu.com/p/2022433246449780672) | 元分析视角，有话题性 |

### 知名开发者观点

| 人物 | 身份 | 核心观点 |
|------|------|----------|
| **Sebastian Raschka** | ML 研究者/畅销书作者 | "真正的秘密武器不是模型，是 harness" |
| **Andrej Karpathy** | 前 Tesla AI 总监 | 评价泄露代码为 "Claude Claw" |
| **Chaofan Shou** | Solayer Labs 安全研究员 | 首个发现并公开泄露，X 帖 2880万+ 浏览 |
| **swyx** | Latent.Space 创始人 | 综合社区情报汇总 |
