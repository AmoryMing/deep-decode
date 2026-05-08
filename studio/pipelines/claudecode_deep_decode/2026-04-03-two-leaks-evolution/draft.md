---
title: "从 v0.2.8 到 v2.1.88：两次泄露的技术演进"
source: 多信源交叉验证
author: 多来源综合（ghuntley, kolkov, Chaofan Shou, Layer5, NodeSource 等）
date: 2026-03-31
decoded: 2026-04-07
tags: [Claude Code, 源码泄露, 逆向工程, 版本演进, npm安全, Agent架构]
---

同一行配置，同一个错误，14 个月后再犯一次。

2025 年 2 月，开发者 Dave Schumaker 在 Claude Code 的 cli.mjs 底部发现了一行 `sourceMappingURL`。顺着这条线索，社区还原出了早期版本的 TypeScript 源码。Anthropic 在 v0.2.9 中删掉了 sourcemap，下架了旧版本，事情似乎就这么过去了。

14 个月后的 2026 年 3 月 31 日，安全研究员 Chaofan Shou 在 X 上发了一条帖子，浏览量超过 2000 万：Claude Code v2.1.88 的 npm 包里，又带上了 sourcemap。这一次，暴露的不再是一个简单 CLI 的源码，而是 1,902 个文件、512,685 行 TypeScript——一个完整的 Agent 平台，连同它所有的秘密。

两次泄露之间的技术鸿沟，比泄露本身更值得关注。

## 第一次泄露：婴儿期的 Claude Code

2025 年 2 月的 Claude Code 还很年轻。版本号 v0.2.8，产品形态是一个相对简单的 CLI 工具——单文件 cli.mjs，内嵌 base64 编码的 sourcemap。

发现泄露后，澳大利亚开发者 Geoffrey Huntley 做了一件更有技术含义的事：他没有直接使用 sourcemap 还原代码，而是用 Claude 自己来反编译自己。

Huntley 称这种方法为 "cleanroom transpilation"——一种类似于芯片行业"洁净室逆向工程"的技术路线。传统洁净室逆向的规则是：一组人分析原产品的功能和行为，写出规格说明；另一组人只看规格说明来写代码，不碰原始代码。Huntley 的创新在于，他让 LLM 充当了两组人的角色：输入混淆后的 JavaScript，输出结构清晰的 TypeScript。

> "LLMs are shockingly good at deobfuscation, transpilation and structure to structure conversions."（大语言模型在反混淆、转译和结构转换方面的能力好得惊人。）

这个方法论本身就是一个信号。2024 年圣诞节 Huntley 发现了 LLM 的这个能力，2025 年 3 月 1 日发表文章，仓库随即归档。从"发现技巧"到"完成逆向"只用了不到三个月。这意味着从那时起，任何发布到 npm 的混淆 JavaScript 包，都面临着被 LLM 逆向还原的风险。混淆不再是安全屏障，只是减速带。

但那时还原出的 Claude Code，体量有限。早期版本的架构相对直白：一个对话循环、基本的工具调用、简单的权限检查。没有多 Agent 协作，没有记忆系统，没有 44 个 feature flag 背后的隐藏功能。那是一个刚出生的婴儿。

## 中间地带：12 个版本的手术刀追踪

大多数人只关注两次泄露的"头"和"尾"。但有一个团队做了更精细的活——他们逐版本追踪了 Claude Code 从 v2.1.74 到 v2.1.88 的 12 个连续版本。

没有 sourcemap 可用。面对的是一个 12MB 的混淆 cli.js 文件——所有变量名被替换成 X6、K8、b6 这样的字符，每次构建的变量名还不同。

他们的方法相当原始，但有效：

- **字符串常量猎手**：在混淆代码中搜索 `CLAUDE_STREAM_IDLE_TIMEOUT_MS` 这样的环境变量名，找到锚点
- **分号分割**：用 `tr ';' '\n'` 把压缩的单行代码拆成可读的语句
- **花括号深度追踪**：写 Node.js 脚本数 `{` 和 `}` 的嵌套层级，还原函数边界
- **跨版本变量映射**：人工追踪 X6 在这个版本是什么，到下个版本变成了 K8

更硬核的是他们造了一个诊断工具 `ccdiag`——一个 Go CLI，分析了 1,571 个会话和 148,444 次工具调用的 JSONL 日志。

这套"版本考古学"方法挖出了几个 sourcemap 泄露看不到的东西：

**看门狗定时 bug**：watchdog 在 do-while 循环启动之后才初始化，初始连接阶段完全不受保护。他们观察到的所有挂起，100% 发生在连接建立阶段——恰好是看门狗还没上岗的时候。

**5.4% 的工具调用被静默丢弃**：工具执行成功了，但结果从未返回给模型。这意味着每 20 次工具调用中，就有一次模型"看不到"自己干了什么。

**静默降级**：连续 3 次收到 529 错误后，系统会悄悄从 Opus 切换到 Sonnet，不通知用户。一个号称用顶级模型推理的工具，在服务器压力大时偷偷换成了便宜模型。

**16.3% 的失败率**：3,539 次 API 请求中，576 次失败——每六次请求就有一次出问题。328 次服务器过载、157 次用户手动中断、45 次看门狗超时、46 次非流式降级。

这些数字在 sourcemap 泄露的源码中完全看不到，因为它们不是代码问题，而是运行时行为。代码逆向看到的是蓝图，日志逆向看到的是工地。

## 第二次泄露：成年体的 Agent 平台

2026 年 3 月 31 日。Chaofan Shou——一位安全研究员——在 npm 上发现 Claude Code v2.1.88 的包里躺着一个 59.8MB 的 cli.js.map 文件。

Sourcemap 的结构很简单。一个 JSON 文件，两个数组：`sources`（文件路径列表）和 `sourcesContent`（对应的完整源代码）。两个数组一一对应，不需要反编译，不需要逆向，写十行脚本就能把 512,685 行源码原封不动还原出来。

```json
{
  "version": 3,
  "sources": ["../src/main.tsx", "../src/tools/BashTool.ts", "..."],
  "sourcesContent": ["// 每个文件的完整源码", "..."],
  "mappings": "AAAA,SAAS,OAAO..."
}
```

消息在 X 上扩散后，GitHub 上几小时内冒出数十个镜像仓库，其中一个在两小时内拿到 50,000 stars——很可能创下了 GitHub 历史上最快的仓库增长记录。Anthropic 当天撤下了 .map 文件，次日发出大规模 DMCA 下架通知。但 npm 的镜像缓存机制意味着源码早已在全球各地的 registry 中留下了副本，无法彻底回收。

这次暴露的，不再是那个婴儿。

1,902 个 TypeScript 文件。35 个顶层目录。utils/ 占了 180K 行——超过总代码量的三分之一。components/ 有 81K 行、140 多个 Ink 终端 UI 组件。services/ 53K 行封装所有外部服务。tools/ 50K 行实现 40 多个 Agent 工具。一个"CLI 工具"的 UI 代码量接近总量的五分之一，交互复杂度已经逼近 GUI 应用。

还有一大堆从未对外公布的隐藏系统：KAIROS 后台 daemon 模式、autoDream 记忆巩固引擎、Buddy 虚拟宠物、Undercover 卧底模式、44 个 feature flag 门控的未发布功能。一个看起来像终端工具的产品，内部已经是一个操作系统级别的 Agent 平台。

## 版本考古学：两次泄露之间发生了什么

把两次泄露的技术切片并排摆在一起，差距不是线性的，是指数的。姑且叫这种分析方法"版本考古学"——通过对比不同时期泄露的源码，像考古断层一样还原产品的真实进化轨迹。

**规模**：从单文件 CLI 到 1,902 文件、512K 行代码。14 个月，代码量膨胀了至少两个数量级。

**架构**：v0.2.8 是一个简单的 while 循环调 API。v2.1.88 的核心循环 query.ts 在每次 API 调用前要走五步预处理流水线——Snip 裁剪、微压缩、上下文折叠、自动压缩、组装请求。五步之间有精心设计的依赖关系：上下文折叠刻意放在自动压缩之前，如果折叠就能把 token 降到阈值以下，自动压缩就不会触发，保留更细粒度的上下文。这不是简单的功能堆砌，是经过多轮迭代优化的流水线工程。

**安全**：早期版本的安全检查是基础级别的。v2.1.88 有 9,300 行安全代码、四层纵深防御：静态模式匹配（23 种危险模式）→ 语义分析（tree-sitter AST 解析）→ AI 分类器（独立 LLM 判断）→ 用户确认。其中的细节令人印象深刻——比如 `stripSafeRedirections` 函数去除 `> /dev/null` 时必须加尾部边界 `(?=\s|$)`，否则 `> /dev/nullo` 会匹配前缀，安全检查被绕过。一个正则少几个字符，就是一个安全漏洞。

**记忆**：v0.2.8 没有独立的记忆系统。v2.1.88 有三层：CLAUDE.md（用户手写持久指令，不受压缩影响）、auto memory（自动提取的学习记录，200 行 + 25KB 双重截断）、autoDream（后台记忆巩固引擎，24 小时 + 5 个会话的三门触发机制）。MEMORY.md 的双重截断为什么存在？因为有人在 200 行以内塞了 197KB——把整个索引压成了超长单行。源码注释说得直白：这个字节限制是被逼出来的兜底。

**Agent 体系**：从单体到三层架构。子 Agent 通过 `disallowedTools` 在工具注册层面做硬约束——不是靠 prompt 说"你不能编辑文件"，而是直接把写操作工具从工具列表中移除。Fork Agent 继承父 Agent 完整上下文和 system prompt，共享 prompt cache，通过 `useExactTools` 确保 API 请求前缀完全一致来最大化缓存命中。Coordinator 模式让多个 Agent 通过 `<task-notification>` XML 消息通信。

**隐藏功能冰山**：v0.2.8 是你看到的就是全部。v2.1.88 的编译时 feature flag 系统用 Bun 的 `feature()` 函数做常量折叠和死代码消除，外部构建中看不到内部功能。KAIROS（7x24 后台助手）、BUDDY（虚拟宠物）、BRIDGE_MODE（远程控制）、COORDINATOR_MODE（多 Agent 编排）、VOICE_MODE（语音输入）……44 个 flag 门控着一整座功能冰山。

14 个月，从婴儿长成了怪物。这个进化速度本身就是数据点：AI 编程工具的工程复杂度正在以远超传统软件的速度膨胀。

## 三种逆向方法论的技术含金量

这两次泄露事件催生了三种截然不同的逆向方法论，每一种都反映了不同的技术哲学。

**LLM Cleanroom（ghuntley，2025）**：用 AI 反编译 AI。输入混淆的 JavaScript，让 Claude 输出结构化的 TypeScript。这个方法的革命性在于：它把逆向工程的门槛从"需要精通编译原理"降到了"会写 prompt"。Huntley 的仓库在 2025 年 3 月归档，但他开创的范式影响深远——此后所有 JavaScript 混淆策略都必须假设 LLM 能看穿它。

**手工逆向 + 运行时诊断（kolkov 团队，2026）**：最苦但最有深度。字符串猎手、花括号计数、跨版本变量映射——这些方法看起来原始，但能发现 sourcemap 看不到的运行时问题。ccdiag 工具分析 148,444 次工具调用的日志数据，挖出了 5.4% 的 orphaned tool calls 和 16.3% 的 API 失败率。代码是蓝图，日志是工地——两者看到的是不同的真相。

**Sourcemap 提取（Chaofan Shou，2026）**：技术含量最低但信息量最大。十行脚本还原 51 万行源码。这不是什么高超的黑客技术，这是 Anthropic 自己把源码放在了 npm 上。但正因为信息量完整，它揭示了所有架构细节、内部代号、未发布功能——手工逆向可能需要几个月才能拼凑出的全景图，sourcemap 一秒钟就给了。

三种方法的互补关系值得注意：LLM cleanroom 证明了混淆不再安全，手工逆向挖出了运行时真相，sourcemap 提供了完整蓝图。没有任何单一方法能给出全貌。

## 同一个错误犯两次：不只是配置疏漏

表面上看，两次泄露的根因都是 sourcemap 没从发布包中排除。但深挖一层，第二次的技术根因比 .npmignore 缺失更复杂。

Layer5 和 NodeSource 的独立分析都指出了一个 Bun bundler 的 bug：即使显式设置 `development: false`，Bun 仍然会生成 sourcemap。这个 bug 从 2026 年初就有人在 Bun 的 issue tracker 上报告，但一直没修。Anthropic 的构建流程依赖 Bun——Claude Code 本身就是用 Bun 打包的——这意味着他们需要额外的步骤来确保 sourcemap 不被包含在发布产物中。

更巧合的是时间线。同一天——2026 年 3 月 31 日——npm 上的 axios 包遭到了供应链攻击。在 00:21 到 03:29 UTC 之间安装或更新 Claude Code 的用户，可能同时拉入了包含远程访问木马的恶意 axios 版本。一次泄露暴露了源码，一次攻击可能入侵了用户环境。两件事在同一天发生，纯属巧合，但放大了影响。

最讽刺的细节藏在泄露的源码本身里。Claude Code 内部有一个叫 Undercover Mode 的系统，专门防止 Anthropic 内部信息通过 commit message 和 PR 泄露到公开仓库。他们为信息安全建了一整套子系统，system prompt 里明确写着"Do not blow your cover"（不要暴露你的身份）——然后通过一个 .npmignore 配置把全部源码送了出去。

一个组织在产品层面做了精密的信息安全设计，在发布流程层面却犯了最基础的配置错误。而且这个错误 14 个月前已经犯过一次。这不是技术问题，是组织记忆问题。第一次泄露后，要么没有建立发布前的 sourcemap 检查流程，要么建了但没执行。

## 对从业者意味着什么

**AI 工具的工程复杂度正在指数膨胀。** 14 个月从简单 CLI 到 51 万行 Agent 平台。这个速度意味着：今天决定"自建 AI 编程工具"的团队，追赶的不是一个静态目标，而是一辆在加速的列车。Claude Code 的架构——五步上下文流水线、四层安全纵深、三层 Agent 体系、记忆巩固引擎——每一个子系统都是几个月的工程投入。这不是模型 API 加一层壳能追上的。

**混淆已死，发布安全才是正事。** ghuntley 在 2025 年初就证明了 LLM 能看穿 JavaScript 混淆。Bun 的 sourcemap bug 进一步说明，依赖构建工具的默认行为是危险的。npm 发布前的安全检查清单应该包括：显式禁用 sourcemap 生成、.npmignore 和 package.json files 字段双重过滤、CI 中加入发布包内容扫描。这不是 Anthropic 独有的问题——任何用 Bun/Webpack/esbuild 打包的 npm 项目都面临同样的风险。

**运行时行为比源码更诚实。** kolkov 团队的 ccdiag 数据揭示的 16.3% 失败率和 5.4% orphaned tool calls，是任何代码审查都看不到的。对于 AI Agent 这类复杂系统，代码只是冰山一角——真正的质量指标在运行时日志里。这对所有做 Agent 产品的团队都是提醒：不只要做 code review，还要做 runtime behavior audit。

**组织记忆比技术债更隐蔽。** 同一个错误犯两次，说明第一次事故后的复盘要么没做，要么没落地。这在高速迭代的 AI 产品团队中尤其常见——紧急修复后就赶下一个 feature，根因没有固化到 CI 流程里。值得每个技术团队自问：上一次事故的修复措施，现在还在生效吗？

## 本期关键词

**Cleanroom Transpilation**（洁净室转译）——用 LLM 做"洁净室逆向工程"的新范式。传统洁净室逆向需要两组人（分析组+实现组）物理隔离，ghuntley 用一个 LLM 同时完成分析和重写。这个方法论意味着：从此所有 JavaScript 混淆都只是减速带，不是安全屏障。

**Sourcemap**（源码映射）——前端构建工具生成的调试辅助文件，JSON 格式，包含原始源码的完整文本。本来只该存在于开发环境，但如果被打包进发布产物，就等于把源码公开。两次 Claude Code 泄露的直接原因都是 sourcemap 未被排除。

**版本考古学**——本文提出的分析框架。通过对比不同时期泄露的源码，像考古断层一样还原产品的技术演进轨迹。Claude Code 的两次泄露提供了一个罕见的"双断面"，让外界能直接测量 AI 编程工具的进化速度。

**Feature Flag**（功能开关）——编译时或运行时控制功能是否启用的开关。Claude Code 用 Bun 的 `feature()` 函数做编译时常量折叠，外部构建中 flag 为 false 的代码会被彻底删除（dead code elimination）。但 sourcemap 不关心死代码消除——所有内部功能的源码都在 .map 文件里。

**Orphaned Tool Calls**（孤儿工具调用）——Agent 发起了工具调用、工具也执行成功了，但结果没有返回给模型。kolkov 团队通过日志分析发现 5.4% 的工具调用被静默丢弃。这种"Agent 干了活但不知道自己干了"的情况，是 AI Agent 系统中一个容易被忽视的可靠性问题。

**autoDream**（自动做梦）——Claude Code 的后台记忆巩固引擎。三门触发（24小时+5个会话+锁）、四阶段执行（定位→采集→巩固→裁剪），在用户不活跃时整理和压缩记忆。命名灵感来自人类睡眠中的记忆巩固过程。

## 原文关键引用

> "LLMs are shockingly good at deobfuscation, transpilation and structure to structure conversions."（大语言模型在反混淆、转译和结构转换方面的能力好得惊人。） —— Geoffrey Huntley

> "100% of observed hangs occur during connection establishment."（观察到的所有挂起，100% 发生在连接建立阶段。） —— kolkov 团队 12 版本逆向分析

> "Anthropic preaches AI safety and full transparency while shipping a closed-source agent that silently downgrades you to a dumber model when servers struggle."（Anthropic 宣扬 AI 安全和完全透明，却在服务器压力大时悄悄把你降级到更笨的模型。） —— kolkov 团队

> "They built a whole subsystem to stop their AI from accidentally revealing internal codenames in git commits... and then shipped the entire source in a .map file."（他们建了一整套子系统来防止 AI 在 git commit 中泄露内部代号……然后在 .map 文件里把全部源码都送了出去。） —— DEV Community 分析

## 引用

1. [We Reverse-Engineered 12 Versions of Claude Code](https://dev.to/kolkov/we-reverse-engineered-12-versions-of-claude-code-then-it-leaked-its-own-source-code-pij) —— 12 版本逆向分析，含 ccdiag 运行时数据
2. [ghuntley/claude-code-source-code-deobfuscation](https://github.com/ghuntley/claude-code-source-code-deobfuscation) —— LLM cleanroom 反混淆方法论
3. [Yes, Claude Code can decompile itself](https://ghuntley.com/tradecraft/) —— Huntley 原文（部分 paywalled）
4. [The Claude Code Source Leak: 512,000 Lines](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history/) —— Layer5 技术根因分析（含 Bun bug 细节）
5. [Anthropic Claude Code Leak](https://nodesource.com/blog/anthropic-claude-code-source-leak-bun-bug) —— NodeSource 分析 Bun bundler bug
6. [Claude Code's Entire Source Code Got Leaked](https://dev.to/kolkov/claude-codes-entire-source-code-got-leaked-via-a-sourcemap-in-npm-lets-talk-about-it) —— DEV Community 全面解读
7. [Anthropic Claude Code Leak](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak) —— Zscaler ThreatLabz 安全分析
8. [Source Code for Anthropic's Claude Code Leaks](https://gizmodo.com/source-code-for-anthropics-claude-code-leaks-at-the-exact-wrong-time-2000740379) —— Gizmodo 报道（IPO 时机）
9. [leeyeel/claude-code-sourcemap](https://github.com/leeyeel/claude-code-sourcemap) —— v0.2.8 sourcemap 解析版本
