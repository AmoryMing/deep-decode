---
title: AI 攻防没有军备竞赛，差速窗口已经开了
source: https://rdi.berkeley.edu/blog/exploitgym
author: Berkeley RDI 等多机构联合
date: 2026-05-13
type: decode
tags: [ai-security, agent, big-sleep, exploitgym, supply-chain]
---

![封面](assets/png/00_cover.png)

5 月 11 日，Google Threat Intelligence Group 公开承认抓到一个 zero-day——犯罪团伙拿 LLM 写出 2FA 绕过利用程序，目标是一款流行的开源系统管理面板，准备做 mass exploitation。代码里留下了 LLM 的指纹：成片的教学风 docstring、一个幻觉出来的 CVSS 分数、textbook 式的 Pythonic 结构、对硬编码信任异常的滥用方式。GTIG 用自家的 Big Sleep 加 CodeMender 提前发现，在攻击规模化之前和厂商一起静默打了补丁。

5 月 13 日，Berkeley RDI 联合 Max Planck、UCSB、Arizona State、Anthropic、OpenAI、Google 把 ExploitGym 挂上 arxiv：898 个真实漏洞，要 agent 从一个 proof-of-vulnerability 输入起步，写出能跑通的完整利用程序、读到那块本不可访问的 flag。两件事中间隔 48 小时，互相不是 PR 联动，是平行宇宙第一次握上手。

## 攻方在野：那条军备竞赛不是要来，是已经来了

GTIG 首席分析师 John Hultquist 说了一句不浪漫的话：「There's a misconception that the AI vulnerability race is imminent. The reality is that it's already begun.」（"AI 漏洞军备竞赛即将到来"是个误解，它已经开始了。）

Google 的报告里有一段更值得安全工程师看一眼的判断：「While fuzzers and static analysis tools are optimized to detect sinks and crashes, frontier LLMs excel at identifying these types of high-level flaws and hardcoded static anomalies.」（fuzzer 和静态分析针对的是崩溃点和 sink，前沿 LLM 擅长的是高层逻辑漏洞和写死的信任异常。）这句话翻译成工程语言：传统工具找的是低层内存问题，LLM 找的是开发者拍脑袋留下的 "if user_agent == 'admin_internal' then skip 2FA" 那种侧门。两者覆盖的漏洞类型不重叠。

被攻击的目标是一款流行的开源系统管理面板，2FA 绕过，具体厂商和 CVE 编号 Google 都没披露——因为补丁还在分发窗口里。攻击方背景上的归属同样残酷：朝鲜 APT45、中国国家背景操作团、俄罗斯影响力作业（另案，用 AI 生成音频）都被点了名。这说明工程化的 AI 攻击不是民间黑客的玩具，是国家级 actor 已经在量产的工序。

同一周的 npm Mini Shai-Hulud 投毒事件是另一条侧证。5 月 11 日 19:20 到 19:26 UTC，攻击者在 6 分钟里发出 84 个恶意版本，覆盖 42 个 @tanstack 包。后续 24 小时连带 UiPath（65 包）、Mistral AI SDK、OpenSearch（npm 周下载 130 万）、Guardrails AI 共 170+ 包，404 个恶意版本，累计 5.18 亿次下载。手法上拼了三个攻击面：pull_request_target 的 Pwn Request 模式 + GitHub Actions 缓存投毒 + 从 runner 进程里抓 OIDC token。

最刺眼的一行细节：这是第一次有文档记录的、能产出**合法 SLSA Build Level 3 证明**的 npm worm。供应链 attestation 这道防线本来是过去三年安全社区押的最大注，现在被穿透了。Mini Shai-Hulud 不是用 AI 写的，但它是 AI 攻击产业化的同期信号——基础设施被啃，工具被装备化，人手还没用上 LLM 都已经这个体量，加上 LLM 之后是什么样可以自己外推。

![攻方现状](assets/png/01_attack_landscape.png)

## 守方上线：898 题、五家机构、第一次量化 agent 攻击能力

ExploitGym 这边的事实层先摆完。898 个真实漏洞，520 来自 Google OSS-Fuzz 和 OSV 报告的 userspace 程序，185 个 V8 JavaScript 引擎漏洞，193 个 Linux 内核漏洞。给 agent 的输入是漏洞源码、构建指令、一个能触发问题的 proof-of-vulnerability 输入、一个容器化运行环境。任务定义不留歧义：把这个 PoV 翻译成一段能拿到 unauthorized code execution、能读到不可访问 flag 的完整利用程序。验证用 agent-as-a-judge 机制，确保利用确实命中预设漏洞、不是绕过题目作弊。

2 小时超时、关掉 mitigation 的基线分数：Claude Mythos Preview 做出 157 题，GPT-5.5 做出 120 题，GPT-5.4 是 54，Claude Opus 4.6 是 15，Gemini 3.1 Pro 是 12。Mythos Preview 在前沿模型之间已经拉开一个代际差。打开 mitigation 之后差距收窄但没消失：Mythos 仍能在 userspace 拿下 25 题、V8 拿下 17 题、内核 3 题；GPT-5.5 是 10/3/8。扩展到 6 小时超时还有进一步上涨。

把这组数字翻译成对决策者有意义的话：在精心设计的 benchmark 上，前沿模型已经能写出几十到上百个真实漏洞的可工作利用程序。这不再是 "LLM 能不能写漏洞" 的问题，是 "在什么条件下、用什么类型的漏洞、多久能写完" 的问题。

ExploitGym 这件事在工程上还做对了一件长期忽略的事——把 agent 攻击能力的量化从企业红队报告搬到了公开 leaderboard。过去 18 个月，安全社区里的人都知道某家模型能干什么、不能干什么，但这些知识困在 NDA 里、困在「负责任披露」窗口里、困在销售流程的对账单上。Berkeley 这次把它做成开放榜单，等于强迫每家前沿实验室对一个共同的 ground truth 报分数。

![守方 benchmark](assets/png/02_exploitgym.png)

## 联合署名的微妙信号：Anthropic 和 OpenAI 同台

ExploitGym 作者列表里有一个细节值得停下来看：Anthropic 和 OpenAI 同时是 industry partner。过去三年里这两家在公开论文上同台的次数不多。它们在产品端是直接竞争对手，在安全研究上则有一组奇怪的同盟逻辑——任何一家被证明能造出强攻击模型，都会传染另一家的合规叙事和客户信任。

把谁列在 partner 名单里、谁不列，是一种政治信号。Berkeley RDI 拉到 Anthropic 和 OpenAI 同时签字，意味着两家在「攻击能力公开量化是必要的」这件事上达成了行业级共识。背后的判断很简单：与其等到媒体或政府用错误的 benchmark 给前沿模型贴 "网络武器" 标签，不如自己出题、自己定测试条件、自己控制评估口径。

Google 也在 partner 行列。和 Big Sleep + CodeMender 的内部投入一起看，Google 在攻防两端都押了重注。这家公司过去几年在 AI 安全话语里相对低调，但实际的工程动作其实是这周最积极的——同一周公开攻方真实案例、同一周署名守方 benchmark、同一周展示自家 AI 防御 agent 起了作用。Google 这是在用三个动作同时说一件事：AI 安全是 Google 的主场。

研究协同 ≠ 商业协同。下半年值得跟踪的不是这次联合署名，是接下来谁先把 ExploitGym 的能力评估写进自家模型卡。Anthropic 的 Mythos Preview 拿了第一，下一份 Mythos 正式发布的 system card 大概率会把 ExploitGym 分数当成「负责任发布」证据列出来。OpenAI 这边怎么处理是个开放问题——GPT-5.5 在榜单第二，公开承认这个分数意味着承认 GPT-5.5 是「能写漏洞利用程序的模型」，这在某些合规辖区会触发额外审查。

## 差速窗口：发现-利用 vs 修复-部署

把攻方守方两条线放到同一张时间轴上看，能算出来的关键变量是「差速」——攻击方 agent 发现并武器化一个漏洞的耗时，对决防御方 agent 发现该漏洞、生成补丁、推到生产环境的耗时。这个差是 AI 安全在 2026 年下半年唯一值得盯的指标。

差速向攻击方倾斜的几个结构性原因。攻击只需要一次成功，防御要全部成功。攻击 agent 不需要兼顾稳定性，防御 agent 必须在不影响业务的前提下打补丁。攻击 agent 可以选漏洞、选目标、选时机，防御 agent 必须覆盖整个攻击面。Big Sleep 找到一个漏洞，需要厂商接受、写补丁、测试回归、推到客户、客户决定升级——这条链路在企业 SaaS 是几周到几个月。攻击 agent 找到一个漏洞，从代码到武器化到投放是几个小时。

但差速也有反方向的力——防御方有结构性数据优势。Big Sleep 跑在 Google 自己的代码和 Google 看得见的开源代码上，知道哪个版本部署在哪儿、知道哪些客户用了哪个 SDK。攻击方在外部，要么靠 reconnaissance 推断、要么靠扫描枚举。这种「内场视野 vs 外场视野」的不对称在过去 30 年是防御方的最大筹码，AI 没有抹掉它，反而放大了它——能用上代码访问权限的防御 agent 比只看二进制的攻击 agent 跑得快。

真正的差速博弈不在单点漏洞上，在大规模部署能力上。攻击方的瓶颈不是「能不能找到漏洞」，是「能不能把利用程序投到目标」。npm Mini Shai-Hulud 这种供应链投毒是攻击方在解这道题——不用找漏洞，找下游分发渠道。防御方的瓶颈也不是「能不能修补丁」，是「能不能把补丁分发出去」。Windows Update、apt、npm registry 这些分发管线在 AI 时代会被重新评估，因为攻防双方都在它们上面跑。

![差速窗口](assets/png/03_speed_delta.png)

## 盲区：这些数字没说的事

ExploitGym 的题目分布偏 CTF-like。userspace 部分大多是单进程内存安全问题，V8 部分是引擎漏洞，内核部分是 Linux 单点 syscall 边界。这种漏洞的共同特征是「闭合系统、单一目标、明确利用条件」。生产环境里有大量的逻辑漏洞、业务逻辑绕过、配置错误、多组件交互失败，这些 ExploitGym 没覆盖。一个 agent 在 ExploitGym 拿 157 分不等于它能拿下一家公司——拿下一家公司需要的是侦察、横向移动、权限维持、数据外泄，这些都是 ExploitGym 不评估的能力。

agent 攻击能力的下游链路同样被遮蔽了。Google 抓到的那个 zero-day 是 2FA 绕过——LLM 帮的是漏洞识别和利用代码编写。但要做 mass exploitation，攻击方还要解决目标枚举、规模化投递、命令控制基础设施、收益变现。这些环节里 AI 能加速多少、能不能完全自动化，目前没有公开数据。把 ExploitGym 的分数当成「这家模型能做多大坏事」的直接预测，会高估。

防御方的差速优势同样有保质期。Big Sleep + CodeMender 这套架构假设 Google 能持续访问最强的前沿模型、能持续投入工程资源做配套基础设施、能持续维持「内场视野」的访问权限。如果未来某个时点开源模型在攻击任务上追平商业模型、攻击方反而拿到了和防御方同等的能力，差速会迅速反转。

最大的盲区是协同效应。Mini Shai-Hulud 这种攻击不需要 AI，但如果攻击者把投毒、漏洞发现、利用编写、目标筛选这几条线都接上 LLM，整个 attack chain 的端到端耗时会从「几周」压缩到「几天」。这种协同的边际效应，目前没有任何公开实验测过。

## 对从业者意味着什么

- **CISO**：本周开一次会，问自己一个问题——你的红队报告里上次出现 LLM 是什么时候？如果是「定期」，那是合规动作；如果是「上周刚 add 进来」，那是在跟上行业；如果是「还没有」，那需要补。ExploitGym 的 leaderboard 是免费的 baseline，把你们自家代码的一部分扔进类似 setup 跑一下，能看到防御缺口。
- **安全工程师**：本周读两遍 GTIG 那份关于 LLM 写的利用代码的指纹分析（docstring 教学化、CVSS 幻觉、textbook Pythonic 结构）。这些是未来 6 个月你做 incident response 的关键识别特征。如果你的 SOC 还在用规则匹配传统利用代码，加一组识别 LLM 生成代码的检测规则。
- **AI PM**（前沿模型方向）：你的下一份 system card 大概率要回答 ExploitGym 分数。提前想清楚——披露具体分数、披露相对位次、还是只披露评估方法。每种选择都有合规和市场后果。
- **架构师**（生产系统方向）：本周做一件事，给你们的开源依赖加 SLSA 验证 + 离线副本。Mini Shai-Hulud 跑出了带合法 SLSA L3 attestation 的恶意 worm，意味着仅靠 attestation 已经不够，需要再加一层物理隔离的依赖缓存。
- **安全创业者**：可拓展的赛道至少三个——LLM 生成代码的检测引擎、agent 防御方的工程化基础设施（CodeMender 那套的开源版本）、企业级的 attack agent 红队即服务。哪个先跑出 ARR 看分发能力，不看技术深度。

## 本期关键词

**差速窗口（Speed Delta Window）**——AI 安全在 2026 年下半年的核心变量。指攻击方 agent 完成「发现漏洞 + 武器化 + 投递」的端到端耗时，与防御方 agent 完成「发现漏洞 + 写补丁 + 推到生产」的端到端耗时之间的差。差越大、攻击方占优。这是一个动态变量，不是一次性度量——每周都在变，每个新模型发布都会扰动它。盯这个变量比盯模型 benchmark 更接近真实风险。

**LLM 指纹（LLM Fingerprint）**——指 LLM 生成的攻击代码里留下的可识别特征。Google GTIG 总结的三类：成片教学式 docstring（人类攻击者不会写）、幻觉出来的 CVSS 评分（拼凑得像但对不上 NVD）、textbook 式 Pythonic 结构（用最规范的语法做最不规范的事）。未来安全产品的检测特征工程会以这些为基础。

**研究协同 ≠ 商业协同（Research Alignment ≠ Commercial Alignment）**——Anthropic 和 OpenAI 在 ExploitGym 上同台署名，不意味着两家在产品、定价、客户上有任何默契。研究协同是一种「对外口径同步」的机制——一起出题、一起报分数、一起承担舆论压力。商业层面两家继续是零和竞争。把研究署名误读成商业联盟会判错市场动向。

**内场视野（Insider Vision）**——防御方的结构性优势来源。Big Sleep 和 CodeMender 跑在 Google 自己的代码、知道部署拓扑、知道客户使用情况。攻击方在外部，要么靠侦察、要么靠扫描。这个不对称是过去 30 年防御方的最大筹码。AI 没有抹掉它，反而放大了它——能用代码访问权的防御 agent 比只看二进制的攻击 agent 跑得快。

**Attestation 失守（Attestation Bypass）**——Mini Shai-Hulud 跑出了第一个能产出合法 SLSA Build Level 3 证明的恶意 npm worm。这意味着供应链安全过去三年押的最大一注（让构建产物带可验证证明）被穿透了。不是 SLSA 设计错，是 SLSA 的信任根（CI runner 内存里的 OIDC token）被攻入了。下一代供应链防御要把信任根再往下推一层。

## 引用

1. [ExploitGym: Quantifying Real-World Exploitability for Frontier Models](https://rdi.berkeley.edu/blog/exploitgym) — Berkeley RDI Blog, 2026-05-13. 论文 [arxiv:2605.11086](https://arxiv.org/abs/2605.11086)
2. [Google says criminals used AI-built zero-day in planned mass hack spree](https://www.theregister.com/ai-ml/2026/05/11/google-says-criminals-used-ai-built-zero-day-in-planned-mass-hack-spree/5237982) — The Register, 2026-05-11
3. [Google thwarts effort by hacker group to use AI for 'mass exploitation event'](https://www.cnbc.com/2026/05/11/google-thwarts-effort-hacker-group-use-ai-mass-exploitation-event.html) — CNBC, 2026-05-11
4. [Google Says Hacker Used Mythos-Like AI for Software Tool Exploit](https://www.bloomberg.com/news/articles/2026-05-11/hackers-used-ai-to-build-zero-day-attack-google-researchers-say) — Bloomberg, 2026-05-11
5. [Mini Shai-Hulud Worm Compromises TanStack, Mistral AI, Guardrails AI & More Packages](https://thehackernews.com/2026/05/mini-shai-hulud-worm-compromises.html) — The Hacker News, 2026-05-12
6. [TanStack, Mistral AI, UiPath Hit in Fresh Supply Chain Attack](https://www.securityweek.com/tanstack-mistral-ai-uipath-hit-in-fresh-supply-chain-attack/) — SecurityWeek, 2026-05-12
