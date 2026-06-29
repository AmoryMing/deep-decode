---
title: AI-first 的笔记软件，开源的是壳，干活的还是别人的大脑
source: https://github.com/inkeep/open-knowledge
author: Inkeep / Nick Gomez
date: 2026-06-28
type: decode
voice: default-doubao
style: default
tags: [OpenKnowledge, Inkeep, AI-first, markdown, Obsidian, Notion, MCP, 知识库, 本地优先, 开源]
---

过去两年，"AI 笔记软件"几乎都在做同一件事：在 Obsidian、Notion 这些已有的笔记本上，挂个侧边栏，里面坐着一个 AI 帮你总结、续写、问答。软件没变，数据没变，只是多了一个会说话的助手。

OpenKnowledge 这个 2026 年 6 月才开源的项目，把这个动作反了过来。它不在老笔记本上加 AI，而是把笔记本身拆开重做——做成一个让 AI 能直接读、能直接改、能维护整套知识的东西。作者一句话概括："Notion 撞上 VSCode"。这句俏皮话底下，藏着一个对知识工作者更要紧的判断：AI-first 和"加个 AI 插件"，差的不是功能，是架构。

## 同一个词，两种做法

先把 OpenKnowledge 是什么钉死。它来自 Inkeep——一家 Y Combinator 出身、融过 1300 万美元种子轮（Khosla Ventures、GreatPoint Ventures、YC 领投）的公司，主业是给团队搭客服和运营用的 AI agent，客户里有 Anthropic、Midjourney、PostHog。GitHub 仓库 `inkeep/open-knowledge` 在 2026 年 6 月 3 日建立，6 月 25 日上 Hacker News 拿了 372 分，到 6 月 28 日 1382 个 star、GPL-3.0 开源、几乎全 TypeScript 写成，还在每天往里 push 代码。

官方描述是 "Beautiful, AI-native markdown editor and LLM Wiki"。README 里写得更直白："一个漂亮的 markdown 编辑器，原生接好 Claude、Codex 等各种 agent。给知识库、LLM wiki、规格文档和笔记用。私有、本地、免费。"

要看懂它和"插件式 AI 笔记"的区别，得看它把软件切成了哪几层。官方文档把架构拆成三层：最底下是内容层，纯 markdown 或 mdx 文件，放在 git 里做版本管理，这是唯一的真相来源；中间是编辑层，真·所见即所得，改 markdown 文件的手感跟改 Google Doc、Notion 页面一样，还能塞进可交互的 HTML/JS、Mermaid 图、LaTeX 公式、视频、PDF；最上面是 agent 工具层，开箱就有 MCP 和 skills，专门用来让 AI 搜索、吸收、组织、维护这套知识库。

关键在中间和最上面这两层是分开的。人看的是一个漂亮的富文本视图，agent 看的是底下的纯文本加一套专门的工具接口。这就是"为 agent 重做"的字面意思——不是在面向人的界面旁边接一个 AI，而是给 AI 单独开了一条进知识库的路。

插件式 AI 笔记做不到这一点，因为它的数据结构本来就是给人看的。Notion 的内容锁在自家的块结构和云数据库里，AI 插件能访问的也是被这套结构包装过的二手数据。OpenKnowledge 把这一层直接抹平：底下就是一堆纯文本文件，agent 拿到的和你拿到的是同一份东西。

## 它的"AI-first"里，AI 不在它自己手上

这是 OpenKnowledge 最反直觉、也最值得想清楚的一点：一个叫"AI-native"的软件，自己不带 AI。

官方文档说得毫不含糊："这个平台不自带模型——它靠你本来就在用的外部 agent。" 它支持 Claude、Cursor、Codex、OpenCode，靠 MCP 这套协议和外部 agent 对接。你装它的方式是一行 `npm install -g @inkeep/open-knowledge`，然后 `ok init` 会自动把 Claude Code、Cursor、Codex 接好。换句话说，OpenKnowledge 提供的是知识库这一端的"插座"和"工具箱"，插上来出力的电，是别人家的模型。

这个设计有它的道理。模型迭代太快，今天最强的明天就过时，一个笔记软件没必要也没能力把模型攒在自己身上；而 MCP 已经成了"让 agent 接外部数据"的事实标准，押注它等于押注一个还在长大的生态。把模型这件事完全甩出去，OpenKnowledge 自己只专注做好一件事：把知识库做成 agent 最好用的那个对象。

代价也在这里。Hacker News 上有人一句话戳破："把'开源'这个词用在一个绑死专有 AI 服务的东西上，真该付出点代价。" 这话刻薄，但点到了要害——OpenKnowledge 开源的是编辑器外壳，真正干智力活的仍然是 Claude、Codex 这些闭源模型。你拥有了软件，没拥有智能。

更要命的是它对"本地优先""数据所有权"的主张，只在文件这一层成立。你的 markdown 确实躺在自己硬盘上，确实是纯文本，确实不被任何人锁定——这部分是真的。但一旦你让 Claude 或 Codex 去读你的知识库帮你改写，内容就出了本地、进了模型厂商的服务器。要彻底闭环，你得换成 OpenCode 这类能接本地模型的 harness。所以"私有、本地"这个承诺，对你的文件是兑现的，对你的 AI 能力是有条件的——这个条件 OpenKnowledge 没替你解决，它把决定权原样交还给了你。

## 它真正的对手不是 Notion，是“直接拿编辑器打开文件夹”

OpenKnowledge 把自己定位成 Obsidian 和 Notion 的替代品，这个站位本身很精明：它想同时要 Notion 的编辑体验和 Obsidian 的纯文本可移植性。

跟 Obsidian 比，它赌的是 UI 和协作。Obsidian 也是纯 markdown，插件生态有一千多个扩展，但编辑器偏极客、协作偏弱、AI 全靠第三方插件硬接。OpenKnowledge 给的是 Notion 级的所见即所得，外加原生的 agent 通道。迁移成本也压到了最低——作者在 HN 上说，“Obsidian 本质就是一堆 markdown，你可以直接用 OpenKnowledge 打开一个 Obsidian 仓库。” 不过 Obsidian 那套 dataview 和插件生态它不支持，重度插件用户搬不过来。

跟 Notion 比，它赌的是不锁定。Notion 协作和富文本无敌，但内容压在自家闭源云里，导出是二等公民，AI 也是自己的黑盒。OpenKnowledge 用 git/GitHub 做同步和团队共享，文件始终是你的。

但它真正难缠的对手，是 HN 上另一句大白话：“我直接拿 VS Code 打开 Obsidian 文件夹，BOOM，它就对 AI 友好了。” 这句话点破了一个尴尬：如果你的笔记已经是 markdown，而你已经在用 Cursor 或 Claude Code，那你其实已经有了一个“AI 能读写的纯文本知识库”，一分钱没花。OpenKnowledge 要证明的是，它在这套零成本组合之外多给的——真·WYSIWYG、graph 视图、专为知识库调过的 MCP 和 skills、agentic search——值得你专门换一个软件。这个证明，目前还没完全做完。

## 盲区：我们不知道的

这个项目太新，几个关键问题还悬着。

营销材料里展示的 in-app "Ask AI" 聊天体验，作者在 HN 首发时承认还没真正上线，说"数天内"会发；到底上没上、好不好用，得装了才知道。同步目前只有 git/GitHub 一条路，大文件、二进制资产、非技术团队怎么办没有好答案，作者说中心化的 CRDT 协同服务"在路上"——这又是一句"在路上"。发布时桌面原生 app 只有 macOS，Linux 和 Windows 用户只能用 CLI 加网页版，全平台桌面同样"在路上"。

还有一个更大的问号是 Inkeep 自己。一家主业做团队 AI agent 的商业公司，免费开源一个"喂给 agent 的知识库前端"，图什么。是把它当 Inkeep 主产品的分发入口和数据格式标准，还是真心做一个独立的开源工具，目前看不出来。这关系到它会不会在某个版本之后开始把好东西放进付费云——README 现在写着"免费"，但商业公司的免费往往有保质期。

另外要点名一篇二手文章。有个叫 PromptZone 的站发过一篇 OpenKnowledge 介绍，说它内置了一个 embedded 模型、要你接 Ollama 或 LM Studio 做语义搜索和自动打标签。这套描述和官方仓库、官网文档、作者本人的说法全都对不上——OpenKnowledge 明确不带模型、走的是 MCP 接外部 agent，根本不是 Ollama 那条路。那篇大概率是 AI 代写的失真稿。把它拎出来不是为了批评谁，是提醒一件正在变普遍的事：关于一个新工具，二手内容已经开始批量生产"听起来对但其实错"的描述，看新东西越来越得回到一手仓库去对。

## 对 AI 从业者/实践者意味着什么

判断一个工具是不是真的“AI-first”，以后可以就问一个问题：它的 AI 是嫁接在面向人的数据结构上，还是数据结构本身就为 agent 设计。OpenKnowledge 给了一个清晰的样板——纯文本当真相、git 做版本、MCP 当 agent 的进出口。下次再看到“AI 笔记”“AI 知识库”，可以拿这三样去比对，看它是真改了架构，还是只在侧边栏摆了个助手。

对手里有 markdown 知识库、又天天用 Claude Code 或 Cursor 的人，OpenKnowledge 值得装来试试，但试的时候带一个具体问题：相比你现在“VS Code 打开文件夹 + agent”的零成本组合，它的 WYSIWYG、graph 视图和那套调过的 MCP 工具，有没有真正帮你省下时间。省到了，换；没省到，你本来就已经有 AI-first 知识库了。

而对所有把笔记当“第二大脑”的人，这里有个更根本的决定要提前想。OpenKnowledge 这类工具的真正主张，是让你的知识库从“给自己看的东西”变成“agent 可读可写的对象”。一旦接受这个设定，你记笔记的方式会变——你会开始为机器能不能读懂、能不能改而组织内容，而不只是为未来的自己。这是个会改写习惯的决定，不是换个皮肤那么轻。值不值得，取决于你愿不愿意让 agent 成为你知识库的常驻合作者，以及你信不信得过那个出力的大脑，并不在自己手上。

## 本期关键词

- **AI-first / AI-native（AI 优先）** —— 形容一个软件不是“做完了再加 AI”，而是从设计第一天就把“AI 要怎么用它”当成核心。落到 OpenKnowledge 身上，具体表现是：它的数据结构（纯文本文件）和接口（MCP 工具层）首先是为 agent 准备的，人用的漂亮界面反而是在这套底子上再搭出来的。区别于“插件式 AI”——后者是软件先为人做好，AI 再从旁边接进来。

- **MCP（Model Context Protocol，模型上下文协议）** —— 一套让 AI agent 能统一接入外部数据和工具的“通用插座”标准。有了它，一个软件只要按这个标准把自己的能力暴露出来，各家 agent（Claude、Cursor、Codex 等）就都能接进来用，不用每家单独适配。OpenKnowledge 不自带模型，正是靠这套协议把外部的 AI 接到自己的知识库上。

- **WYSIWYG（所见即所得）** —— “What You See Is What You Get”，意思是你编辑时看到的样子，就是最终成品的样子。markdown 原本要靠一堆符号（比如用 `#` 表示标题），WYSIWYG 编辑器让你像在 Word、Notion 里那样直接看到排好版的效果，符号在背后自动生成。OpenKnowledge 的卖点之一就是给纯 markdown 文件套上这层 Notion 级的编辑手感。

- **本地优先 / 数据所有权（local-first / data ownership）** —— 主张你的数据首先存在你自己的设备上、用开放格式（这里是纯 markdown）保存，不被任何厂商的云和私有格式锁死，你想搬走随时能搬。OpenKnowledge 在“文件”这一层兑现了这个承诺，但要注意它不覆盖“AI 能力”——你用的模型仍可能在别人的服务器上。

- **harness / agent（AI 执行壳）** —— 这里的 harness 指像 Claude Code、Cursor、Codex、OpenCode 这类“能调用模型、能动手干活”的 AI 工具外壳。模型本身只是会预测文字，harness 给它配上读文件、改文件、调工具的手脚。OpenKnowledge 自己只做知识库，把“动手”这件事交给你已经在用的 harness。

## 引用

1. [inkeep/open-knowledge（GitHub 仓库）](https://github.com/inkeep/open-knowledge) —— 一手，项目本体、README、安装命令、star/license 数据
2. [OpenKnowledge 官方文档 · Overview](https://openknowledge.ai/docs/get-started/overview) —— 一手，三层架构、"不自带模型"的明确表述。原文："The platform does not bundle its own model—it relies on external agents you already use."（这个平台不自带模型——它靠你本来就在用的外部 agent。）
3. [Show HN: OpenKnowledge（Hacker News，372 分）](https://news.ycombinator.com/item?id=48675435) —— 一手，作者 engomez（Inkeep CEO Nick Gomez）本人发言与社区批评
4. [Inkeep $13M 种子轮公告](https://inkeep.com/blog/inkeep-funding-announcement) —— 一手，母公司背景与融资
5. [Inkeep · Y Combinator 公司页](https://www.ycombinator.com/companies/inkeep) —— 二手，公司与创始人信息交叉验证
