---
title: Anthropic 开源「找漏洞」的参考流水线：防御侧也开始 agent 化了
source: https://github.com/anthropics/defending-code-reference-harness
date: 2026-06-05
type: decode
status: awaiting-evaluation
distribute: [email, xiaohongshu]
tags: [Anthropic, 安全, 漏洞发现, Agent, ClaudeSecurity]
---

# Anthropic 开源「找漏洞」的参考流水线：防御侧也开始 agent 化了

![封面](assets/gpt-img/00_cover.png)

Anthropic 在 GitHub 上开了一个仓库，叫 `defending-code-reference-harness`。名字直译是「防御代码的参考脚手架」。它不是一个产品，是一套可以照着抄的开源流水线——用 Claude 当自动化 agent，去一个 C/C++ 代码库里**自己找内存漏洞、复现崩溃、写报告、再生成补丁**。

这件事单独看不算大新闻：用 AI 找漏洞早就有人做。真正的信号在对照里。就在同一周，Anthropic 还发了一份报告，分析了过去一年被封禁的 832 个恶意账户——攻击者正在大规模用 AI 写恶意软件、做横向移动、做权限提升。攻击侧已经 agent 化了。现在 Anthropic 把防御侧的一套打法也开源出来，等于在说：找漏洞这件事，从今天起也应该是可复现、可标准化、可以让 agent 自己跑的流程，而不是只有少数顶级安全研究员脑子里的黑箱手艺。

这篇拆解三件事：这个 harness 到底是什么、它怎么用 agent 找漏洞、以及对安全和平台团队意味着什么。

## 本期看点

- harness 不是产品，是一套**七阶段的自动化流水线参考实现**：build → recon → find → verify → dedupe → report → patch，每一阶段都是一组 Claude agent。
- 它把「找漏洞」从一次性的灵感，拆成了**带证据门槛的工程流程**：每个崩溃必须 3/3 稳定复现、必须在全新容器里被另一个 agent 重现、必须和已知 bug 去重，才算数。
- 仓库开篇就写明「This repo is not maintained」——它是给你抄的模板，不是给你装的软件。配套还有托管产品 Claude Security。
- 和本周的 832 恶意账户报告放一起看：攻击和防御正在同一个方向收敛——都在 agent 化、都在标准化。谁先把流程跑顺，谁占先手。

## harness 是什么：不是工具，是一套「抄作业」的流水线

先把定位钉死。仓库 README 自己写得很清楚：「The harness is a reference, not a product」——这是参考实现，不是产品。「通用的形状、提示词和沙箱是可复用的，但这个 harness 不会在每个代码库上开箱即用。」更直白的是仓库顶上那句：「This repo is not maintained and is not accepting contributions」——不维护、不收 PR。

这不是甩锅，是一种刻意的定位。Anthropic 想交付的不是一个你 `pip install` 就能跑的扫描器，而是一份**「我们和几家安全团队合作摸出来的打法，照着搭你自己的」**的样板。README 里反复强调一句话：「我们合作过的最成功的安全团队，是那些最快上手的。与其花几个月设计完美的流水线，不如第一天就从小处开始。」

所以它给的东西分两层。一层是 Claude Code 里的交互式 skill——`/quickstart`、`/threat-model`、`/vuln-scan`、`/triage`、`/patch`、`/customize`，你在终端里一条条手动跑，像有个安全研究员陪你过代码。另一层是 `harness/` 目录里的**自主流水线**，一条命令 `bin/vp-sandboxed run` 下去，agent 自己跑完整个找漏洞循环。

想要省事不想自己搭的，README 末尾指向托管产品：「Anthropic 提供 Claude Security，一个托管产品，能在你的多个项目源码里找漏洞并修复。」开源 harness 和商业产品是同一套方法论的两个交付形态——一个给你拆开看、自己改，一个给你直接用。

![参考实现 vs 托管产品](assets/gpt-img/04_positioning.png)

## 它怎么用 agent 找漏洞：七个阶段，每个阶段一组 Claude

这是整个仓库最值得看的部分。它把「找一个内存漏洞」拆成了七个有明确产物和门槛的阶段，每个阶段背后是一组各司其职的 Claude agent。

第一步 **build**，把目标代码用 ASAN 编译。ASAN 是 AddressSanitizer，一个内存错误检测器：程序一旦发生越界读写、释放后使用这类内存问题，它会让程序当场崩溃并打印出错位置。它是这整套流程的「真值信号」——有 ASAN 崩溃，就有内存 bug，不靠模型猜。

第二步 **recon**，一个 agent 先读代码，提出「这个程序里哪些解析输入的子系统值得分开打」。比如一个解析图片的库，PNG 解码、JPEG 解码、元数据解析是三个不同的攻击面。这一步把大问题切成可并行的小问题。

第三步 **find**，是核心。N 个 agent 并行上场，每个读源码、构造畸形输入、把输入喂给 ASAN 编译出来的二进制反复跑。门槛是 README 里那句关键的话：「每个 agent 读源码、构造畸形输入、运行 ASAN 二进制，直到某个输入连续 3 次都触发崩溃。」3/3 才算数——不是崩一次就报，是要稳定复现。这一刀砍掉了大量偶发噪声。

第四步 **verify**，一个 grader agent 把前面找到的崩溃，拿到一个**全新的容器**里重新跑一遍。换个干净环境还能崩，才算真的。第五步 **dedupe**，一个 judge agent 把这些已验证的崩溃和已知 bug 库去重——同一个根因的崩溃不要报五遍。第六步 **report**，一个 report agent 写结构化的可利用性分析：这个崩溃能不能被攻击者控制、危害多大。第七步 **patch**，一个 patch agent 生成候选补丁，再交给 grader 验证补丁是否真的堵住了崩溃。

![七阶段流水线](assets/gpt-img/01_pipeline.png)

把这七步连起来看，它的设计哲学很清楚：**用执行验证代替静态猜测，用多 agent 的角色分工代替单个模型的大包大揽**。找的、验的、判重的、写报告的、打补丁的，是不同 agent。这和人类安全团队的分工是同构的——发现的人和确认的人分开，避免自己骗自己。

## 为什么这是工程，不是 demo：证据门槛和沙箱

把这套流程和「让 Claude 看一眼代码说说哪有漏洞」区分开。后者是 demo，前者是工程。差别在两个地方：证据门槛和沙箱。

证据门槛前面说了——3/3 复现 + 全新容器二次验证 + 去重。Hacker News 上的讨论里，一位做密码学审计的从业者点破了这件事的真正难处：「每周我都能看到一些 bug……是我们自己的 harness 也找不到的。」他强调真正的挑战是 triage（分诊）——「vibe auditing」（凭感觉审计）会产出足够多的误报，「把所有开发者都累垮」。harness 这套层层验证的门槛，正是冲着误报去的：宁可漏报，不要拿一堆假阳性淹没工程师。

沙箱是第二个工程化标志。README 里有个明确的安全分层：交互式 skill（威胁建模、静态扫描、对静态结果做 triage）只读写文件，不执行目标代码，可以不沙箱跑。但**自主流水线会执行目标代码**——它要把畸形输入喂给真实二进制——所以「它拒绝在 gVisor 沙箱外运行，除非显式覆盖」。每个 agent 跑在网络隔离的 gVisor 容器里，出口流量被限制到只能访问 Claude API。README 的措辞很精确：「概念验证的漏洞利用会跨越沙箱边界，agent 的状态不会。」意思是崩溃的输入样本能传出来给你看，但 agent 在沙箱里的执行环境不会污染你的主机。

这两点——可验证的证据链 + 强制沙箱——是「能进生产流程」和「PPT 演示」的分水岭。它没回避代价。HN 上最集中的吐槽是贵：有人估算每个 agent「每分钟约 1 万未缓存输入 token、2 千输出 token」，跑下来「用 Opus 是几百美元，用 Mythos 是几千美元」。安全研究员 tptacek 给了个更克制的框架：这类工具更像木工的「夹具」（shop jigs）——为你自己的工作流定制的治具，而不是通用产品，「应该按你自己的工作方式去要一个属于你的」。这恰好呼应了 Anthropic 把它做成「参考实现」而非「产品」的选择。

![找与验必须是两个 agent](assets/gpt-img/02_isolation.png)

## 放进本周的对照里：攻防在同一个方向收敛

单看这个 harness 是「Anthropic 又开源了个安全工具」。放进本周的另一条新闻里，它的含义变了。

同一周，Anthropic 发布了一份分析报告，复盘过去一年（2025 年 3 月到 2026 年 3 月）被封禁的 832 个恶意账户。结论很硬：这些案例里 67.3% 用 AI 来写恶意软件或准备攻击；中高风险攻击者中用 AI 做网络行动的比例，从 33% 涨到 56%，1.7 倍。报告点出一个结构性变化——横向移动、权限提升、账户探测这些过去需要深厚专业知识的技术，现在 AI 可以替能力差得多的攻击者代劳。报告还说现有的 MITRE ATT&CK 框架里，**根本没有给这种自主「agentic」编排的攻击留分类位**。

攻击侧在 agent 化，而且跑在了标准化的前面——连给它分类的框架都还没有。Anthropic 这边开源 harness，是在防御侧补同一件事：把找漏洞从手艺变成可复现、可标准化、可让 agent 跑的流程。

harness 把「标准化」做得很显式。README 说它虽然是为 C/C++ 内存漏洞设计的，但「形状是通用的」——要移植到新的漏洞类别或语言，只需回答三个问题：什么信号算一个发现、概念验证长什么样、目标怎么构建怎么跑。在 C/C++ 里答案是「ASAN 崩溃 / 崩溃输入文件 / Dockerfile」，换到别的栈就换成对应的异常、测试失败、构建系统。这种「换三个问题就能换语言」的结构，本身就是把找漏洞从手艺抽象成可复制流程。

这就是判断的锚点：**防御也在 agent 化、也在标准化，这不是巧合，是被攻击侧逼出来的对称演化**。当攻击者用 agent 批量找你的洞，你这边还靠几个安全研究员手动审计，速度上就输了。harness 这种「让 agent 自动跑找漏洞循环」的东西，本质是防御方在补上同一种自动化能力。这也连着 Anthropic 的 Project Glasswing——一个拉上 AWS、苹果、微软、谷歌、CrowdStrike 等公司的联盟，目标是「在对手开发出同等工具之前，把这些能力交给防御方，去找到并修复世界所依赖的软件里的漏洞」。开源 harness 是这盘棋里最贴近一线开发者的那一手。

![换三个问题就能移植到任何语言](assets/gpt-img/03_porting.png)

## 对从业者意味着什么

如果你在安全团队：这套 harness 给的不是工具，是流程模板。最该照抄的不是它的 prompt，是它的**证据门槛**——3/3 复现、全新容器二次验证、强制去重。把这套门槛接进你现有的扫描流程，能解决 AI 审计最大的痛点：误报淹没工程师。第一天别想着搭完美流水线，先用交互式 skill（`/threat-model`、`/vuln-scan`、`/triage`）在一个真实小项目上手动跑一遍，摸清楚它在你代码上的真实命中率和误报率，再决定要不要上自主流水线。

如果你在平台或基础设施团队：注意那条「自主流水线强制 gVisor 沙箱、出口只通 Claude API」的设计。任何「让 agent 执行不可信代码来找漏洞」的方案，沙箱和网络隔离是地基，不是可选项。这套 harness 把这件事做成了默认行为（不沙箱直接拒绝运行），是值得照搬的安全默认值。

如果你是普通开发者：把这件事理解成行业基线在抬高。攻击侧已经能用 AI 替低水平攻击者做横向移动了，防御侧的自动化漏洞发现也在变成标准件。短期内你不一定要自己搭 harness，但「代码上线前过一遍 AI 漏洞扫描」会越来越像「上线前跑一遍测试」一样成为默认动作。先去 GitHub 上把这个仓库的 `docs/pipeline.md` 读一遍，理解它七个阶段在做什么——这比记住任何一个具体命令都重要。

成本是真实的门槛。HN 上几百到几千美元一跑的估算不是吓唬人。但这恰恰说明为什么 Anthropic 同时提供托管的 Claude Security——大多数团队不会自己跑 Opus 做全量扫描，而是把这套方法论交给托管产品。开源 harness 的价值，是让你**看懂**这套流程怎么搭，从而在选型托管产品时知道自己在买什么。

## 引用

1. Anthropic, `defending-code-reference-harness` 仓库 README（主信源）：https://github.com/anthropics/defending-code-reference-harness
   - 原文：「The harness is a reference, not a product.」译：这个 harness 是参考实现，不是产品。
   - 原文：「Each agent reads the source, crafts malformed inputs, and runs the ASAN binary until a given input produces a crash 3 out of 3 times.」译：每个 agent 读源码、构造畸形输入、运行 ASAN 二进制，直到某个输入连续 3 次都触发崩溃。
   - 原文：「The autonomous reference pipeline ... executes target code, so it refuses to run outside of a gVisor sandbox unless explicitly overridden.」译：自主参考流水线会执行目标代码，所以除非显式覆盖，否则它拒绝在 gVisor 沙箱外运行。

2. Hacker News 讨论：Anthropic's open-source framework for AI-powered vulnerability discovery：https://news.ycombinator.com/item?id=48403980
   - 密码学审计从业者：「vibe auditing」会产出足够多误报「把所有开发者累垮」；成本估算「用 Opus 是几百美元，用 Mythos 是几千美元」。

3. Anthropic, "What we learned mapping a year's worth of AI-enabled cyber threats"（832 恶意账户报告，攻击侧对照）：https://www.anthropic.com/news/AI-enabled-cyber-threats-mitre-attack
   - 832 个被封账户中 67.3% 用 AI 写恶意软件或准备攻击；中高风险攻击者用 AI 做网络行动的比例从 33% 升至 56%。

4. Anthropic, Project Glasswing：https://www.anthropic.com/glasswing
   - 联盟目标：在对手开发出同等工具之前，把前沿安全能力交给防御方。
