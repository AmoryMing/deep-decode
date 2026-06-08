---
title: 一个人，三个月，27000 颗星：agentic engineering 长什么样
date: 2026-06-03
type: decode
slug: 2026-06-03-agentic-engineering-mvanhorn
style: default
reader: default
sources:
  - https://x.com/shao__meng/status/2061974983094755575
  - https://github.com/mvanhorn/last30days-skill
  - https://github.com/mvanhorn/cli-printing-press
  - https://github.com/mvanhorn/agentcookie
distribute: [email, xiaohongshu]
---

# 一个人，三个月，27000 颗星：agentic engineering 长什么样

Matt Van Horn（mvanhorn）说他高中毕业后从没发布过一个有人用的软件。三个月后，他做出了 last30days——一个拿到 27000 多颗 GitHub 星、发布当天冲上 GitHub 趋势榜第一的项目，外加另外两件工具，还给 Python、Go 这些主流开源项目提交了实质代码。中文圈把他这套打法转出来的是 meng shao，标题叫《Agentic Engineering 实战窍门全录》。

这件事容易被读成又一个"AI 让人变强"的爽文。它的价值不在励志，在于三件工具背后是同一套可复制的工程方法。把这三件工具拆开看，你会看到一个独立开发者怎么用 agent 跨过过去必须靠团队、靠平台、靠资历才能跨过的三道坎。本期拆的就是这套方法，以及它对"一个人能做多少事"这条线的重新定位。

![封面：一个人三个月做出 27000 星项目](assets/gpt-img/00_cover.png)

## 本期关键词

- **agentic engineering（智能体工程）** —— 不是自己写代码，而是把人放在"定义目标、设计流程、验收结果"的位置，让 AI agent 去执行具体编码。人当工头，agent 当工人。
- **agent skill（智能体技能）** —— 一份写给 AI agent 看的说明书：告诉它遇到某类任务时该按什么步骤、调什么工具、怎么判断好坏。装上一个 skill，agent 就多一项专长。
- **围墙花园（walled garden）** —— 平台把数据和能力圈在自己的登录墙后面，外部程序拿不到。Reddit、X、你的银行账户都是围墙花园。
- **Tailscale / Keychain** —— Tailscale 是一种把你的几台设备组成加密私有网络的工具；Keychain 是 macOS 系统自带的密码保险箱。下文的 Agent Cookie 同时用到这两样。

## 一、last30days：搜人，不搜编辑

![last30days 研究流程：解析对象 → 并行多源搜 → 按真实互动打分 → 跨源聚类 → AI 法官合成](assets/gpt-img/01_last30days.png)

mvanhorn 拿到 27000 星的那件工具，是一个 agent skill，叫 last30days。它干一件事：给它任意一个话题，它跨 Reddit、X、YouTube、Hacker News、Polymarket、普通网页**并行**搜一圈，合成一份带出处的简报。

它的哲学写在一句话里：**"Google aggregates editors. /last30days searches people."**（Google 聚合的是编辑，last30days 搜的是人。）这句话是整件工具的判断核心。普通搜索引擎排在前面的，是有 SEO 团队、有内容运营、有编辑把关的网站——也就是"编辑"。而一个话题最新、最真实的信号，往往躺在某个 Reddit 帖子下面 1500 个赞的评论里、某条没人转发但说到点子上的推文里。last30days 赌的是后者。

它的流程值得抄下来，因为它就是一套"怎么让 agent 做研究"的范式：

1. **先解析对象**。给一个人，它去找这个人的 X handle 和 GitHub；给一个产品，它去找官方 repo 和核心贡献者。不是直接丢关键词去搜。
2. **并行多源搜**。Reddit（带评论赞数）、Hacker News、Polymarket（预测市场赔率）、YouTube（转录文字）、TikTok / Instagram / Threads / Bluesky、普通网页，一起发出去。
3. **按真实互动打分**。它的原话是"1500 赞的 Reddit 帖 > 没人读的博客"。权重给的是人的真实反应，不是网站权威。
4. **跨源聚类**。同一个故事在不同平台有不同说法，把它们合并成一条，而不是重复罗列。
5. **AI 法官合成**。最后用一个 agent 当裁判，产出有引用的摘要，再挑出几条 "Best Takes"（最佳观点）。

判断：last30days 的本事不在"搜得多"，在它把"什么算可信"这个判断权，从平台的排序算法手里夺回来，重新定义成"真实的人投了多少票"。这是一个独立开发者能和 Google 在同一个问题上较劲的唯一姿势——你拼不过它的索引规模，但你可以换一套信号源。它当天冲上趋势榜第一，说明很多人早就在等这个换法。

## 二、Agent Cookie：让 agent 带着你的身份醒来

![Agent Cookie：云端 agent 经 Tailscale 同步借用你 Mac 的真实浏览器会话，凭证存 Keychain](assets/gpt-img/02_agentcookie.png)

如果说 last30days 解决的是"搜什么"，Agent Cookie 解决的是一个更硬的问题：agent 怎么进得去那些需要登录的地方。

绝大多数有价值的数据在围墙花园里——你订阅的内容、你的私有面板、需要登录才能看的页面。一个云端跑的 agent 默认是个陌生人，进不去。常规做法是把账号密码、token 明文塞给 agent，既危险又只能覆盖少数提供官方 API 的平台。

Agent Cookie 的做法是：把 agent 的浏览器会话，同步到你日常在用的那台 Mac 上，中间走 **Tailscale 加密**。于是任意一个 agent runtime（运行环境）醒来时，就已经是"已登录"状态——它借用的是你这台 Mac 上真实浏览器的登录态。关键的安全设计是：凭证从 **macOS Keychain（系统密码保险箱）**里读，而不是明文存在某个文件里。

判断：这是三件工具里最能说明 agentic engineering 边界在哪的一件。单独一家公司的 API 永远只能给你它愿意开放的那部分能力，围墙花园之间互不相通。Agent Cookie 把破墙的钥匙换成了**用户自带的认证**——你能登录的地方，你的 agent 就能去。这让一个独立开发者做出的工具，覆盖面反而超过任何单一平台的官方 agent，因为它不依赖任何一家平台点头。代价是它把信任问题摆到了明面上：agent 拿着你的真实身份在网上行动，所以凭证要锁进 Keychain、链路要加密——安全不是附加项，是这条路能走通的前提。

## 三、Printing Press：把"做出能发布的软件"变成一条循环

![Printing Press 循环：调研 → 构建 → 打磨 → 发布，写成 agent 自动跑的剧本](assets/gpt-img/03_printingpress.png)

第三件工具叫 Printing Press（cli-printing-press）。给它任意一个 API，它生成一个可以直接发布（ship-ready）的命令行工具。

它的内部是一条循环：**research → build → polish → publish**（调研 → 构建 → 打磨 → 发布）。设计上是 agent-first（以 agent 为先）的——意思是这套流程不是给人手动操作的菜单，而是给 agent 按步骤自动跑的剧本。它还自带 SQLite 同步和离线搜索，让生成的 CLI 工具开箱就能用、断网也能查。

判断：Printing Press 暴露的是 agentic engineering 的第三块拼图——**节奏**。前两件工具解决了"搜什么"和"进得去"，但一个人要在三个月里产出多件有人用的软件，靠的不是单点突破，是把"从想法到能发布"压成一条可重复的循环。research→ship 的闭环写成 agent 能执行的流程后，做第二个、第三个工具的边际成本就塌下去了。这正是 mvanhorn 能在三个月里连出三件作品、还顺手给主流开源项目提交代码的机械原因：他不是更努力，是他把产出软件这件事本身做成了一个可以让 agent 反复跑的管线。

## 四、三件工具，是同一套方法的三个切面

![三件工具汇成同一套 agentic engineering：用户自带认证 / 真实人的信号 / 闭环循环](assets/gpt-img/04_method.png)

把三件工具叠在一起，背后是同一套 agentic engineering，拆成三条可操作的原则：

- **能力来自用户自带的认证，不来自平台授权**（Agent Cookie）。别等平台开 API，让 agent 借用用户已有的登录态，去任何用户本人能去的地方。单一公司做不到的覆盖面，这样做得到。
- **信号取自真实的人，不取自编辑权威**（last30days）。判断什么可信，用真实互动量（赞、评论、赔率）而不是网站排名。这让小工具能在"信息质量"上正面对垒大平台。
- **用闭环循环快速产出，不靠单点灵感**（Printing Press）。把"调研到发布"写成 agent 能反复执行的流程，第二个产品的成本就远低于第一个。

这三条合起来回答了一个具体问题：一个高中毕业、此前没发布过有用软件的人，凭什么三个月做出 27000 星的项目？不是因为他突然变天才，是因为他把自己放在了工头的位置——定义要解决的坎（搜什么 / 进得去 / 出得快），设计让 agent 执行的流程，自己只管验收和判断方向。写代码这件过去最贵的事，被 agent 接管了。

判断：这件事的可怕之处不在 27000 这个数字，在于它的可复制性。门槛不是被降低了，是塌方了。过去"一个团队几个月"的产出，现在的下限变成"一个想清楚的人 + agent，三个月"。这意味着竞争的胜负手正在从"谁有工程师团队"挪到"谁更会定义问题、设计流程、验收结果"。

## 对从业者意味着什么

![对从业者：门槛塌方，胜负手从"有没有团队"挪到"会不会定义问题"](assets/gpt-img/05_takeaway.png)

- **对独立开发者 / 想做产品的人**：mvanhorn 的样本说明，缺工程师团队不再是不能下场的理由。把精力从"我会不会写这段代码"挪到"我要解决哪道坎、怎么设计一条 agent 能跑的流程"。先挑一个有真实围墙花园痛点的小问题（数据进不去、信号被污染、产出太慢），用一件工具啃下来。
- **对工程师 / Tech Lead**：agentic engineering 把你的价值重心从"写得快"挪到"定义得准、验收得狠"。值得现在就练的，是把自己手上重复的工作流（调研、迁移、生成脚手架）写成 agent 能执行的剧本，像 Printing Press 那样做成可复用循环，而不是每次手动重来。
- **对做 agent 工具的人**：last30days 和 Agent Cookie 给了两个清晰的产品机会——重新定义"什么算可信信号"，以及"用用户自带认证去覆盖单一平台覆盖不到的地方"。这两块都是大平台因为利益和合规绑手绑脚、反而留给小团队的缝隙。
- **对所有人**：把"我会做某件事"换成"我会定义目标、会设计流程、会验收结果"。这三件工具的作者本人就是这条迁移的活样本——他不写大部分代码，他决定写什么、怎么验、往哪走。

## 引用

1. meng shao（shao__meng）中文转述 @mvanhorn《Agentic Engineering 实战窍门全录（2026 年 6 月版）》：https://x.com/shao__meng/status/2061974983094755575
2. last30days-skill（GitHub，27000+ 星，发布当天 GitHub 趋势榜第一）：https://github.com/mvanhorn/last30days-skill
3. cli-printing-press（Printing Press，为任意 API 生成可发布 CLI）：https://github.com/mvanhorn/cli-printing-press
4. agentcookie（Agent Cookie，经 Tailscale 同步浏览器会话、凭证存 macOS Keychain）：https://github.com/mvanhorn/agentcookie

> 说明：本篇引子是 meng shao 转 @mvanhorn 的一条经验帖，工具的机制据三个项目的公开 README 与说明。星数、趋势榜名次、三件工具的设计细节均出自上述公开来源；推文是引子，机制据公开文档。
