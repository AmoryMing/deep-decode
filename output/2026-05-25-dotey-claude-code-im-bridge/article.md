---
title: Claude Code 走出终端:一条从飞书机器人开始的产业暗线
source: https://x.com/dotey/status/2058084478459826432
author: 宝玉 (@dotey)
date: 2026-05-23
type: decode
---

5 月 23 日,宝玉转了一个看起来很普通的开源项目——Zara Zhang 写的 `feishu-claude-code-bridge`,把 Claude Code 接到飞书里,从飞书指挥 Claude Code 写代码、改文档。GitHub 上 478 星,放在 Anthropic 生态里不算大事。

但同一时间,GitHub 上还有另一个项目叫 `cc-connect`,把同样的桥接思路扩展到 12 个 IM 平台、10 多个 Coding Agent,星数 10400。

把这两个数字摆在一起,故事就完全不一样了。

![Claude Code 走出终端：飞书 bridge × 10.4k 星的 cc-connect × 6/15 计费拆池](assets/png/00_cover.png)

## 这条推文真正在说什么

宝玉的推文表面是一条工具推荐:本地装个 npm 包(`npx -y lark-channel-bridge@latest run`),扫码连飞书,以后在飞书消息里发指令,本机的 Claude Code 就开始干活,执行过程通过卡片实时回写到飞书。可以设置 Workspace 切换不同的代码仓库,可以读取 `CLAUDE.md`、Skills、Hooks,效果"和直接用 Claude Code 几乎没差别"。

技术上不复杂——宝玉自己点破了:"它是一个『飞书消息 ↔ 本机 Claude Code CLI』的桥,或者说翻译。"飞书 SDK 收发消息,bridge 进程常驻本机,把收到的消息整理成 prompt,通过 `claude -p` 启动 Claude Code,再把流式输出更新回飞书。

但这条推文真正值得拆的不是它的实现,是它出现在 2026 年 5 月这个时间点。

## 一个 pattern,不是一个工具

`feishu-claude-code-bridge` 是 Zara Zhang 上线于 5 月 22 日的项目。一天之内,宝玉就发现并写了完整使用报告,顺手列了两个衍生项目——QQQingyu 和 kxn 各自把同样的桥接思路改造成了 Codex 版本。

把视野往外拉一圈,会看到这不是孤例。Anthropic 4 月已经上线了官方 `Claude Code in Slack`——在 Slack 里 @Claude,自动起一个 web session 跑任务。社区项目 `claude-slack-bridge` 走的是 MCP 服务器路线,让 Claude Code 跑任务到一半通过 Slack 向人提问,人回答了再继续。

最大的项目是前面提到的 `cc-connect`——星数 10400,主语言 Go,最新版本 v1.3.2(4 月 21 日)。它支持 Claude Code、Codex、Cursor Agent、Gemini CLI、Kimi CLI、Pi,以及"任何实现了 Agent Client Protocol(ACP)的 Agent",接入飞书、钉钉、Slack、Telegram、Discord、企业微信、QQ、微博、LINE、个人微信。大部分平台用 WebSocket 长轮询,本机不需要公网 IP。

把这些项目放一起看,模式很清楚:**Coding Agent 不再只是开发者本机的终端工具,它正在变成一个可以被远程触发的、嵌入团队协作流的"工人"**。

![一个 pattern：本机 Coding Agent 被各家 IM 远程触发](assets/png/01_bridge_pattern.png)

## ACP:把这个模式从手工活变成基础设施

宝玉推文里没提 ACP,但它是这一切的底层骨架。

ACP 全称 Agent Client Protocol,Zed 在 2025 年 8 月开源的协议,用 JSON-RPC 2.0 over stdin/stdout 描述"客户端如何调一个 Agent"。它要解决的问题很具体——以前每个编辑器要接每个 Coding Agent,都要写一份私有适配代码;现在 Agent 实现 ACP,客户端实现 ACP,大家走标准接口。

到 2026 年 3 月,已经有 25 个以上的 Agent 实现了 ACP——Claude Code、Codex、GitHub Copilot CLI、OpenCode、Gemini CLI 都在列。Zed 和 JetBrains IDE 都内置了 ACP 客户端,可以一键切换不同的 Agent 后端。

ACP 出来的时候,行业以为它只是"编辑器 ↔ Agent"的统一接口。但 `cc-connect` 走的更远:既然 ACP 把 Agent 抽象成了一个标准的 JSON-RPC 进程,那"客户端"就不必是编辑器。可以是 Slack 的 webhook 处理器,可以是飞书的 bot,可以是任何能发收 JSON 的东西。

这就是为什么 `cc-connect` 能用一份代码同时支持 10 多个 Agent——它不在乎你后面跑的是 Claude 还是 Kimi,只要符合 ACP 它就能转发。这个解耦比 Anthropic 上个月那篇 Managed Agents 博客里的"脑手分离"更激进:Managed Agents 还在卖自家整套基础设施,ACP 把整个 Agent 层拆成了可替换组件。

![ACP 四层栈：客户端 → 协议 → Agent 后端 → 模型工具](assets/png/02_acp_stack.png)

## 这条路 18 天后被堵了一半

这里有个时间窗口必须说清。

Anthropic 在 5 月 14 日(宝玉推文前 9 天)宣布,从 6 月 15 日开始,`claude -p` 命令、Agent SDK、Claude Code GitHub Actions,以及所有通过 Agent SDK 认证的第三方应用,会被踢出 Claude Pro / Max 订阅的共享额度池,进入一个独立的"Agent SDK Credit"额度池。

新额度池的数字:Pro $20/月、Max 5x $100/月、Max 20x $200/月。按 API 价格计费,月底清零不结转。

宝玉自己在推文末尾就提到了这件事——"Bridge 使用的是 `claude -p` 模式,自 2026 年 6 月 15 日起,Claude 订阅计划对 `claude -p` 和 Agent SDK 的使用将独立计费,不走订阅额度。如果你是用 API,不受影响。或者也可以考虑使用上面的 Codex bridge 项目。"

这句话被埋在推文最后,但它是整个 bridge 生态的转折点。社区已经在算细账——按典型 Coding Agent 工作负载,$200 信用差不多支撑一个重度用户 1-2 天,等效 12 倍到 175 倍涨价。所有靠"Pro 订阅 + `claude -p` 跑生产负载"的 bridge 用户,要么转 API 按用量付,要么换 Codex / Kimi / Gemini 的桥。

Anthropic 这一刀切得没错——交互式 Claude Code 跑订阅,程序化 `claude -p` 跑 API 价。订阅本来就是补贴个人开发者交互体验的,不是给团队架 bridge 跑生产的。但这把 bridge 类项目的经济性整个改写了:**ACP + bridge 这条路在技术上越通,在 Anthropic 上越贵**。

宝玉推荐的 Codex bridge 其实就是退路——OpenAI 还没收紧程序化调用的口子。

![6/15 前后：claude -p 从订阅池剥离的经济性突变](assets/png/03_credit_pool.png)

## 中国 B 端在这件事上的真实位置

`feishu-claude-code-bridge` 出现在飞书上不是偶然。中国大企业能用的国际化协同工具,实际上只有飞书。钉钉、企业微信都是国内体系。飞书是字节系唯一可以双向桥接海外 SaaS 的入口。

但中国 B 端要落地这个模式,有三道坎,顺序不能错。

第一道是合规。`lark-channel-bridge` 跑在员工本机,飞书消息内容、本地代码、`CLAUDE.md` 里写的内部规范,这些都会经过 Claude API 出境。任何一家做受监管行业的公司,这一步走不通。这意味着这条路的中国适配版本必须接国产模型:DeepSeek、Kimi、通义、智谱。`cc-connect` 已经支持 Kimi CLI,但 ACP 在国产模型生态里的实现还稀薄。

第二道是权限。一个员工启动了 bridge,理论上飞书群里任何人发消息都能触发本机 Claude Code 干活,而且默认 `--dangerously-skip-permissions` 是开发者自我选择的捷径。在企业场景里,这意味着群里一条消息可能修改生产仓库代码。需要的是会话权限、操作审计、危险操作二次确认——这些功能 `lark-channel-bridge` 目前都没有。

第三道是商业模式。社区 bridge 项目本质上都假设"每个人都有自己的 Anthropic / OpenAI 订阅"。中国 B 端典型场景是公司统一采购、按部门分配。bridge 要在中国 B 端跑起来,需要的不是"个人 Mac 上扫码连飞书",而是"运维部署一台服务器,管理多人会话,接公司统一的 LLM 网关"。

`cc-connect` 的 Go 版本(而不是 TypeScript)、企业微信支持、admin UI——这些信号说明它在往这个方向走。`feishu-claude-code-bridge` 还停留在第一阶段。

![中国 B 端三道坎：合规 → 权限 → 商业模式](assets/png/04_china_3_gates.png)

## 盲区:这种模式到底适不适合多人协作

现在所有的 bridge 项目都默认"一个 Claude session 服务一个人"。Zara Zhang 的设计是 1 chat = 1 session,`cc-connect` 是每个会话一个独立 Agent 进程。

但 Coding Agent 走进 IM 工具的下一步,理论上应该是"团队共享一个 Agent",像 GitHub PR review bot 那样。这一步还没有人证明可行。Claude 的 context 是按 session 隔离的,几个人同时给同一个 Claude 发指令,Claude 怎么知道现在该听谁的、怎么处理冲突的修改意图?这是个开放问题。

另一个盲区:bridge 类项目把 Agent 暴露到 IM 后,Agent 跑任务时的状态可见性差。终端里你能看到每一步,IM 里只能看到流式的卡片更新。出问题之后回溯比纯 CLI 难得多。

## 对中国 B 端 AI 决策者意味着什么

**短期(3 个月内)**:把"远程触发 Coding Agent"这个模式当成一个内部实验项跟一下。`cc-connect` 是更稳的选择(Go、活跃、多端),`feishu-claude-code-bridge` 适合飞书重度用户的轻量尝试。但不要在生产仓库上开,先在 staging 或 personal sandbox 验证流程价值。

**中期(6-12 个月)**:盯三个动态——ACP 在国产 Coding Agent(Kimi / 通义 / 智谱 Coding)里的支持情况、企业级 bridge 方案(带审计、权限、统一计费)有没有出现、以及国内是否会出现"ACP 中国化"的协议变种。这三个里如果有任何一个起来,意味着这条路在中国 B 端可以落地。

**给技术决策者的核心判断**:不要把这条推文当成"宝玉又推荐了一个开源项目"。`feishu-claude-code-bridge` 在技术上没有创新,创新在它的位置——它是 ACP 协议下放、Coding Agent 去终端化、IM 工具变成 Agent 入口这三条线交汇的一个具体案例。下一年里,你在飞书、企业微信、钉钉里看到的 AI 助手,大概率不再是"接了某个 LLM API 的对话机器人",而是"通过 ACP 连接到本地 Coding Agent / 文档 Agent / 数据 Agent 的远程控制器"。

终端是开发者的私有空间。IM 是团队的共享空间。这两个空间的边界正在被一根 JSON-RPC 管子打通。

宝玉转的这条推文是这件事在 5 月份的一个截面。截面背后的事更值得追。

---

## 本期关键词

**ACP(Agent Client Protocol)** -- Zed 于 2025 年 8 月开源的协议,用 JSON-RPC 2.0 over stdin/stdout 定义"客户端如何调 Agent"。原本为编辑器集成设计,实际效果是把"Agent 后端"标准化为可替换组件。截至 2026 年 3 月,Claude Code、Codex、GitHub Copilot CLI、Gemini CLI 等 25+ Agent 已实现 ACP。本文核心论点的底层基础——没有 ACP,bridge 项目要为每个 Agent 写一份适配代码。

**Bridge(桥接器)** -- 一类新型项目的代号:把本机 Coding Agent CLI 和某个 IM 工具(飞书/Slack/Telegram/钉钉等)双向打通,IM 里发消息触发 CLI 干活,CLI 输出回流到 IM。典型代表:`feishu-claude-code-bridge`(478★)、`cc-connect`(10.4k★)、`claude-slack-bridge`。技术核心是把 IM 消息转成 ACP/SDK 调用、把流式输出实时回写。

**claude -p(非交互模式)** -- Claude Code CLI 的脚本化入口,接收 prompt、执行完任务、输出到 stdout、退出。所有 bridge 项目的底层调用方式。Anthropic 6 月 15 日起将 `claude -p` 从订阅额度池中剥离,移入独立计费的 Agent SDK Credit 池(Pro $20/Max 5x $100/Max 20x $200,API 价格)。这是整个 bridge 生态在 Anthropic 上经济性突变的分界线。

**Agent SDK Credit Pool** -- Anthropic 2026 年 5 月 14 日宣布、6 月 15 日生效的独立额度池。覆盖 Agent SDK、`claude -p`、Claude Code GitHub Actions、所有通过 Agent SDK 认证的第三方 App(OpenClaw、Conductor、Zed、Jean 等)。月底清零不结转。社区估算,按典型 Coding Agent 工作负载,等效涨价 12 倍到 175 倍。

**Dangerously-skip-permissions** -- Claude Code 的命令行标志,跳过所有工具调用的确认弹窗。在交互式开发场景下是效率优化,在 bridge 远程触发场景下是定时炸弹——意味着 IM 群里任何一条消息都可能直接修改本地文件、提交代码、发请求。企业级 bridge 必须重新设计权限模型,这块目前是空白。

**Workspace(工作区)** -- bridge 项目里的核心概念:每个 IM 会话绑定一个本机目录,Claude Code 启动时 cd 到该目录,能读到该目录下的 `CLAUDE.md`、Skills、Hooks。`feishu-claude-code-bridge` 用 `/ws list/save/use/remove` 切换,本质上是把"打开哪个项目"这个 IDE 概念搬到了 IM 里。

## 引用

1. [宝玉推文原文](https://x.com/dotey/status/2058084478459826432) -- 2026-05-23,73332 次浏览,231 次收藏
2. [Zara Zhang 项目介绍推文](https://x.com/zarazhangrui/status/2057710284920520906) -- 项目作者 5 月 22 日发布的英文介绍
3. [feishu-claude-code-bridge GitHub](https://github.com/zarazhangrui/feishu-claude-code-bridge) -- 478 星 / TypeScript / MIT,本文主项目
4. [cc-connect GitHub](https://github.com/chenhg5/cc-connect) -- 10400 星 / Go,通用 Agent×IM 桥接器
5. [Zed Agent Client Protocol](https://zed.dev/acp) -- ACP 协议主页与规范
6. [Anthropic splits billing: Agent SDK gets separate credit pools](https://thenewstack.io/anthropic-agent-sdk-credits/) -- The New Stack 报道 6/15 计费变化(译文摘录:"Anthropic 把订阅计划拆成两个池,一个走第一方工具,另一个走第三方 Agent 和 SDK,后者按 API 价格扣费")
7. [Claude Code in Slack 官方文档](https://code.claude.com/docs/en/slack) -- Anthropic 官方 Slack 集成对照
8. [Claude Code Headless Mode 实操指南](https://amux.io/guides/claude-code-headless/) -- bridge 类项目共同的技术底座
