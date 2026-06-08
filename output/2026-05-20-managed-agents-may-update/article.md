---
title: agent 长出了手脚：Anthropic 把执行权交了出去，把 lock-in 留下了 [v2]
source: https://claude.com/blog/claude-managed-agents-updates
author: Anthropic
date: 2026-05-20
type: decode
slug: 2026-05-20-managed-agents-may-update
tags: [Anthropic, managed-agents, sandbox, MCP, hosting, agent工程]
---

![封面](cover.png)

两周前还在做梦，现在已经长出了独立的手脚。

5 月 8 日 Anthropic 发了 dreaming / outcomes / multiagent，给 Managed Agents 加了三件内化能力——agent 学会复盘、自评、并行拆任务。11 天之后，5 月 19 日他们发了第二章：Self-Hosted Sandboxes 公测，MCP Tunnels 研究预览。这一回更新的不是脑子里的事，是手脚伸到哪儿。

11 天迭代两次重磅更新，这种节奏在过去 Anthropic 不常见。Claude 3.5 到 4.5 中间隔过几个月，Code Interpreter 那条线半年出一次大版本。Managed Agents 现在的节奏更像一个还在打磨产品形态的早期项目——他们清楚地知道首发那一版没说完。

## 11 天的产品定型节奏

先把这次发布的事实摊清楚。

**Self-Hosted Sandboxes**，公测开放。Anthropic 原话："Agents can now execute tools in sandboxes you control. Keep sensitive files, packages, and services in your own infrastructure, while the orchestration loop runs on ours." 翻译：agent 调工具时的那一层执行环境，可以放到客户自己的基础设施里，编排循环还在 Anthropic 这边。

接入的初始 provider 四家：Cloudflare、Daytona、Modal、Vercel。每家定位不同：Cloudflare 用 MicroVM 加 zero-trust 注入 secrets，Daytona 给完整有状态机器、SSH 进得去还能暂停，Modal 主打亚秒级冷启动加 GPU 可调，Vercel 是毫秒级启动配 VPC peering。

注意这个名单里没有 AWS、没有 GCP、没有 Azure。第一批拿到 sandbox 接入资格的，全是 PaaS/Edge 这一档的新一代基础设施厂。这是个信号——后面再讲。

**MCP Tunnels**，研究预览，需要申请。"Internal databases, private APIs, knowledge bases, and ticketing systems become tools." 通过 Claude Console 的 workspace 设置接入一个轻量网关，只需要一条 outbound 连接，agent 就能像调标准工具一样调企业内网的 MCP server。

客户案例五个：Amplitude 在做 Design Agent（UI/营销设计），Clay 在做 Sculptor（GTM 工程），Rogo 做机构金融分析师 agent，Mason 跑内部工具编排，DoorDash 在评估 agentic commerce。

这五个名字凑在一起的信息量比"我们发了 sandbox"大。Amplitude 是分析工具厂，Clay 是数据丰富化厂，Rogo 是金融垂直，Mason 是内部工具，DoorDash 是 marketplace——五个完全不同行业，全在 agent 化自己最深的那块业务。Anthropic 选这几个站台，是在说"垂直行业 agent 都可以走 Managed"——比上一期 Harvey + Netflix + Spiral 那个面板的覆盖宽了一档。

## 两面托管

Self-Hosted Sandboxes 这件事单独看是个企业合规妥协——客户不想让代码和数据离开自家 VPC，Anthropic 同意了。但放回去年那条"脑手分离"的延长线上看，结构变了。

去年讲的是 agent 架构里脑和手的分离：模型推理和工具执行变成两个独立的服务边界，可以独立升级。今年的 sandbox 把这条线再切了一刀，这回切的不是架构，是 hosting。

**编排循环**——agent 的推理调度、状态机、dreaming 的复盘 agent、outcomes 的 grader——继续跑在 Anthropic 自己的 infra 上。
**执行循环**——工具调用、代码运行、文件读写——可以下放到客户自己的 sandbox 里。

我管这种拓扑叫**两面托管**。orchestration plane 在 Anthropic 那边，execution plane 在你这边。一个 agent 在物理上同时存在于两个机房，但语义上还是一个 agent。

![两面托管拓扑](01_two_plane_hosting.png)

这套拓扑解了一个企业 AI 落地真实的死结：客户能接受推理走云端 API，但不能接受 agent 拿着代码权限在云上跑文件操作。过去一年我见过的所有"我们不能用 Claude/GPT 跑 agent"的拒绝理由，几乎都卡在执行层——合规、审计、数据驻留，全是 execution 的事，不是 reasoning 的事。Anthropic 把这条缝接出来给客户填，等于把"不能上云"这个理由从根本上拆了。

代价不是没有。两面托管意味着客户得自己维护 sandbox 的健康度——provider 挂了、quota 满了、机器卡死了，谁去重启？Anthropic 还是客户？发布稿里没说。我猜短期是客户自己背锅，long term 会出来一层 SLA 协议。

## 为什么第一批没有 AWS

Cloudflare、Daytona、Modal、Vercel。这四家有个共同点：都是从 Edge 或 PaaS 起家、原生设计就是短任务多租户、API-first、按毫秒计费。

AWS Lambda 名义上也满足这几条，但 cold start 慢、配置复杂、IAM 模型陈旧。EC2 更不用说，开机就是分钟级。

Anthropic 选第一批 sandbox provider 的隐含标准呼之欲出：sub-second startup + per-millisecond billing + API-native security primitive。这是 agent 的工作负载特征定的——agent 调工具是高频短任务，可能一个会话里启动几十次 sandbox，启动慢一秒钱就翻倍。

Modal 的官方描述写得很直白：sub-second startup。Vercel 用了 millisecond startup。这两家本来就是为 serverless function 优化过的，迁过来跑 agent sandbox 几乎零额外工作。

这件事还有第二层信号。AWS 在 agent infra 上一直处于落后位置——Bedrock 的 agent 框架做得保守，Q Developer 没声量，AgentCore 上个月刚发还在追产品形态。Anthropic 第一批选边没选他们，等于把"agent runtime 第一档赛道"的入场券颁给了新一代云。这件事 Anthropic 没说，但名单本身就是态度。

![第一批 sandbox provider](02_sandbox_providers.png)

## MCP Tunnels：协议变运营

MCP Tunnels 容易被低估。表面看是个网络代理——给 MCP server 装个反向通道让 agent 进得来。技术上不复杂。

但放在 MCP 这条协议的演化曲线上，这是个分水岭。

MCP 去年发布时是个纯开源协议，Anthropic 自己也明说"任何人都可以做 MCP server，agent 自己去发现"。这是 schema-first 的玩法：你写一份 schema，agent 看到就会用。一年下来生态长出来了，但企业落地一直卡在网络层——你的 CRM、你的 Jira、你的内部知识库都在防火墙后面，agent 在公网这边怎么够得着？

VPN 太重，反向 SSH 太脏，单独开 endpoint 太不安全。MCP Tunnels 给的答案是 outbound-only 网关：客户在自家网络里跑一个轻量 daemon，主动连到 Anthropic Console，agent 通过这条通道反向调进来。

这个拓扑技术上不新鲜，ngrok 和 Cloudflare Tunnel 用了很多年。但 Anthropic 把这件事产品化的瞬间，MCP 这条协议的运营模型也跟着变了：

- **以前**：MCP 是协议，谁都能跑，谁都能用。Anthropic 只是协议的发起方之一。
- **现在**：要让 agent 接你企业内网的 MCP，得走 Anthropic Console 申请 tunnel。Anthropic 同时是协议设计者 + 协议运营者。

协议变成被运营的连接层，这是 lock-in 第三段——首发那篇我说过 Anthropic 在 session 格式和 prompt 更新格式上埋了第一段第二段。现在第三段埋在连接器层。开发者一旦把企业的 5 个、10 个、20 个内部系统都通过 MCP Tunnel 接进来，搬到别家就不只是改 API 调用，是把整套连接器拓扑重建。

![MCP Tunnels 反向通道](03_mcp_tunnels.png)

跟 OpenAI 的 GPT Actions 比一下方向就清楚。OpenAI 走的是 schema-first，你写 OpenAPI spec，GPT 读 spec 调你。Anthropic 走的是 connection-first，你建 tunnel，agent 通过连接进来。schema-first 适合公网 SaaS 接入，connection-first 适合企业内网接入。两家在抢的是 agent 时代的不同入口。

![connection-first vs schema-first](05_vs_gpt_actions.png)

## 客户名单里的暗线

Amplitude / Clay / Rogo / Mason / DoorDash 五个名字摆一起，能看出来 Anthropic 在拉的是哪条垂直。

**Amplitude 的 Design Agent**——分析工具厂做设计 agent。这件事单独看怪，分析工具跟设计有什么关系？放回 Amplitude 的产品线就明白了，他们在做 product analytics 到 product design 的端到端贯通，agent 是粘合剂。

**Clay 的 Sculptor**——GTM 工程。Clay 本来就是个数据丰富化平台，给 sales 团队拼接 contact 数据用。现在他们把 GTM 流程整个 agent 化，agent 直接去拉 contact、写邮件、跟 CRM 同步。这是 vertical agent 的 reference 案例。

**Rogo / Mason**——一个金融分析，一个内部工具，两个名字背后都是垂直行业 agent 厂。Rogo 之前融了 5400 万美元做 institutional finance agent，他们站台 Managed Agents 说明 vertical agent 厂愿意把 hosting 让给 Anthropic 而不是自建——比起去年大家都想"自家 agent 自家 host"的氛围，这是个明显的态度转向。

**DoorDash**——"evaluating for agentic commerce"。这条最弱，只是在评估，但 DoorDash 这种规模的 marketplace 出现在面板上本身就是营销价值。

整体看面板的策略：**纵向**——金融、设计、GTM、commerce 各放一个；**深度**——从 still evaluating 到 in production 全档位都有，给后来的客户铺心理预期。

跟首发那一期 Harvey + Netflix + Spiral 比，这次的客户面板更像"垂直行业全景"而不是"flagship 客户三件套"。这个变化也暗示 Anthropic 的销售策略在从 top-of-the-line logo 转向 industry-by-industry penetration。

![客户名单 · vertical 全景](04_first_party_clouds.png)

## 盲区

四件官方稿没说、应该问的事。

**自托管 sandbox 的失败拓扑**。客户 infra 挂了，agent 收到 sandbox 不可达的错误之后怎么办？fallback 到 Anthropic 自家 sandbox 吗？还是直接报错让用户重试？文档里这件事没明确。这个语义在企业部署里很关键——agent 长任务跑到一半 sandbox 没响应，你是丢任务、是降级、还是排队？Anthropic 应该给一份 sandbox failure mode 的明文规范。

**定价的真实结构**。Self-Hosted Sandbox 用 Cloudflare 那家，钱付给 Cloudflare 还是 Anthropic？Anthropic 抽不抽过路费？发布稿一个字没提。我个人猜测短期不抽——这是先把生态铺开的策略，等接入量大了再谈分成。但客户 budget owner 不能靠猜，应该有官方定价表。

**和 Claude Code subagent 的关系**。Claude Code 里 SubagentTask 这条线现在也在跑工具，跑代码、写文件、装包。那条 SubagentTask 走的是哪个 sandbox？老的 Anthropic-hosted 还是新的 self-hosted？两条线会不会合并？这是 agent infra 内部最大的一个未答问题——Claude Code 是面向开发者的 agent，Managed Agents 是面向企业的 agent，长期看应该收敛到一套底层 runtime。

**MCP Tunnels 的访问门槛**。研究预览 + request access only。多少企业能拿到？批准标准是什么？商务条款是什么？这种"先看是谁"的模式在 Anthropic 过去 12 个月用了很多次，包括 Computer Use、Claude Code 早期。模式是熟的，但门槛具体卡在哪儿外人看不到。

## 对 AI 从业者意味着什么

**做企业 agent 落地的**：Self-Hosted Sandbox 解的是合规拒绝，不是性能问题。如果之前因为"代码不能跑在 Anthropic 服务器上"被甲方否过，现在可以重启对话。但有个新评估项要加——你的 Cloudflare/Modal/Vercel 选哪个？四家的 SLA 和 quota 模型完全不同，挑错了影响 agent 实际可用性。建议先跑 PoC 测两三家再下单。

**做 vertical agent 厂的**：客户名单里 Rogo / Clay / Amplitude 都把 hosting 交给 Anthropic，去年还流行"自建 harness 自家 host"的氛围现在弱了。把 hosting 自建的边际收益要重新算——你能比 Anthropic 做得更好吗？除非你的客户合规对"不出云"有死要求，否则迁到 Managed Agents 的 ROI 现在比一年前高。这个判断方向是反直觉的：随着 Managed Agents 功能越完整，自建反而越没必要。

**做 MCP 生态的**：MCP Tunnels 出来之后开源 MCP 生态和 Anthropic 运营版会分叉。开源版继续做 schema 和工具发现，Anthropic 版做企业级连接和 quota 治理。如果你在做 MCP server 业务，这两条线得分开规划——给个人开发者的版本继续走开源 registry，给企业的版本得考虑 Tunnels 这条通道。一鱼两吃。

**做基础设施投资判断的**：第一批 sandbox provider 名单（Cloudflare / Daytona / Modal / Vercel）值得当一个市场信号。AWS 不在意味着 agent runtime 这一档至少现在是新一代云的主场。Daytona 之前不太出圈，这次入选含金量很高，融资和估值大概率会动。Modal 也是。Vercel 是把 serverless 复用成 agent runtime 的最直接案例。这条赛道下一年值得关注 build-vs-buy 的拐点。

把这次更新放回 5 月 8 日那篇拆解的延长线上看，方向更清楚。首发讲 agent 学会做梦——内化，给 agent 加跨 session 的反思能力。本期讲 agent 长出手脚——外化，把执行权交给客户、把内网连接产品化。两步走完，Managed Agents 的形态基本定型了：脑在我这边长，手伸到你那边去。

更深一层的变化在 lock-in 的地理学。首发那篇我说过，Anthropic 把锁点埋在 session 格式、dreaming 输出、Outcomes rubric 这三个地方。这次又埋了两个新的——sandbox provider 适配层、MCP Tunnels 协议层。每加一个产品功能就多一层锁。lock-in 不再是"模型不让你换"，是"基础设施不让你换"。这条曲线 OpenAI 也在走，只是路径不同。Anthropic 走 connection-first，OpenAI 走 schema-first，两边都在把 agent 时代的 IaaS 标准位往自己这边拽。

![lock-in 五层结构](06_lockin_layers.png)

下一篇 Managed Agents 更新应该会聚焦在 cost、observability 或者 SLA 上——前两章铺完功能，第三章该收钱了。我赌时间是 6 月中。

---

## 本期关键词

**Self-Hosted Sandboxes（自托管沙箱）** -- Managed Agents 的新执行层。agent 调工具时的 sandbox 可以放到客户自己的基础设施里跑，编排循环还在 Anthropic。首批接入 Cloudflare / Daytona / Modal / Vercel 四家 provider。解的是企业合规拒绝，不是性能问题。

**MCP Tunnels（MCP 内网通道）** -- 客户在自家网络里跑一个轻量 daemon 主动连到 Anthropic Console，agent 通过这条 outbound-only 通道反向调用企业内网的 MCP server。让 MCP 从开源协议变成被运营的连接层。

**两面托管（two-sided hosting）** -- 本期原创框架。orchestration plane 在 Anthropic、execution plane 在客户的拓扑结构。一个 agent 在物理上同时存在于两个机房，但语义上还是一个 agent。是去年"脑手分离"在 hosting 维度上的延伸。

**Orchestration plane** -- agent 的推理调度、状态机、dreaming 复盘、Outcomes grader 跑的那一层。在 Anthropic 自家 infra。

**Execution plane** -- agent 调工具、跑代码、读写文件的那一层。Self-Hosted Sandboxes 之后可以下放到客户 sandbox。

**Connection-first vs. schema-first** -- agent 接入企业系统的两种方向。OpenAI GPT Actions 走 schema-first（你写 OpenAPI spec），Anthropic MCP Tunnels 走 connection-first（你建反向通道）。前者适合公网 SaaS，后者适合企业内网。

**Sub-second sandbox startup** -- 第一批 sandbox provider 的隐性准入标准。agent 调工具频次高，sandbox 启动慢一秒成本翻倍。Modal、Vercel 入选都是因为亚秒/毫秒级冷启动，AWS Lambda 不在名单是 cold start 模型不匹配。

**Vertical agent hosting shift** -- 客户名单（Amplitude / Clay / Rogo / Mason / DoorDash）反映的态度转向：vertical agent 厂从"自建 harness 自家 host"转向"把 hosting 交给 Anthropic"。一年前的氛围反过来了。

## 引用

1. [Claude Managed Agents Updates](https://claude.com/blog/claude-managed-agents-updates) -- 本期拆解原文，2026-05-19 发布。
2. [New in Claude Managed Agents](https://claude.com/blog/new-in-claude-managed-agents) -- 5-08 首发原文，本文延长线起点。
3. [Scaling Managed Agents: Decoupling the Brain from the Hands](https://www.anthropic.com/engineering/managed-agents) -- 去年 4 月"脑手分离"原文，本期"两面托管"是它在 hosting 维度的递进。
4. [Modal: Run AI workloads in the cloud](https://modal.com) -- sub-second startup 描述出处。
5. [Daytona Cloud](https://www.daytona.io) -- stateful sandbox 的官方定位。
