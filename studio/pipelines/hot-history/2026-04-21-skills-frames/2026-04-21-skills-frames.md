---
title: 脚本 1974：Anthropic 的 SKILL.md 是 Minsky 51 年前写好的
source: 多信源（基于 research-report.md）
author: 本文作者
date: 2026-04-21
decoded: 2026-04-21
tags: [AI产品, 历史, Skills, Minsky, 神经符号]
type: hot-history
pair: skills-frames
---

# 脚本 1974：Anthropic 的 SKILL.md 是 Minsky 51 年前写好的

![系列封面：1974 到 2025 的时间压缩](material/pngs/00_系列封面.png)

2025 年 10 月 Anthropic 发布 Claude Skills。两个月后，Gary Marcus 在 *Communications of the ACM* 撂下一句话：McCarthy 和 Minsky 一眼就能认出这套东西。话只说到这里就停了——其实 Skills 不只"神似老派 AI"，它是 1974 年 6 月那份 MIT AI Memo 306 的直接复活体，中间隔着一场拖了 20 年的寒冬、三代推倒重来的专家系统、还有一个死于知识获取瓶颈的黄金十年。SKILL.md 不是新东西，是 Minsky 51 年前写好的脚本。

## 一、回到 1974：Minsky 到底说了什么

那年夏天，MIT AI 实验室贴出一份内部 memo，编号 306，标题《A Framework for Representing Knowledge》，署名 Marvin Minsky。开篇一记闷棍，打的是当时符号派 AI 的主流假设——知识可以拆成原子级小命题，再靠一阶逻辑推理拼回去。Minsky 判断这条路根本走不通：

> "The 'chunks' of reasoning, language, memory, and 'perception' ought to be larger and more structured; their factual and procedural contents must be more intimately connected in order to explain the apparent power and speed of mental activities."

翻成大白话：人脑处理信息的最小单位不是命题，是**整块场景**。走进一间客厅，你不是先看到椅子、一盏灯、一堵墙再逻辑推理出"这是客厅"——是一眼认出"客厅"，然后拿客厅这个模板去套椅子、灯、墙。先有壳，再填料。

Minsky 管这个壳叫 Frame（框架，说白了就是描述一个典型场景的模板）。定义是这样写的：

> "A frame is a data-structure for representing a stereotyped situation, like being in a certain kind of living room, or going to a child's birthday party. Attached to each frame are several kinds of information. Some of this information is about how to use the frame. Some is about what one can expect to happen next. Some is about what to do if these expectations are not confirmed."

这句话值得掰开念三遍。Frame 是一个"数据结构"——不是规则，不是命题，是个结构。上面绑着三种信息：**怎么用**、**接下来会发生什么**、**预期没中时怎么办**。三层信息打成一个包，遇到新情境整块调出来用。

Frame 内部结构也讲得清楚：顶层是固定的（这是客厅，这点不会变），底层叫 terminal，也叫 slot（槽位，就是可以填具体内容的空位）。每个 slot 预先挂着**默认值**：

> "A frame's terminals are normally already filled with 'default' assignments. [...] The default assignments are attached loosely to their terminals, so that they can be easily displaced by new items that fit better the current situation."

客厅默认有沙发。进门发现没沙发、摆的是张榻榻米，这个 default 当场被替换。默认值"松绑地挂着"——这是整套理论的精髓。既让系统能快反应（大多数客厅都有沙发，不用每次从零推），又留出灵活性（例外能改）。

![Frame 骨架：顶层固定 + 底层槽位 + 默认值松绑](material/pngs/01_frame-vs-skill.png)

Minsky 这篇文章最狠的一段，是冲着数理逻辑派开的火：

> "I cannot state strongly enough my conviction that the preoccupation with Consistency, so valuable for Mathematical Logic, has been incredibly destructive to those working on models of mind. [...] This obsession has kept us from seeing that thinking begins with defective networks that are slowly (if ever) refined and updated."

1974 年的 Minsky 已经把自己往后 40 年的对手画像勾好了——**"有缺陷的网络缓慢更新"**。这几乎是神经网络工作方式的提前定义。一个人同时看清了自己要打的仗和自己打不赢的仗。

## 二、2025 年的 SKILL.md 怎么说

51 年后，2025 年 10 月 16 日，Anthropic 发布 Claude Skills。官方博客开篇一段：

> "Skills are folders that include instructions, scripts, and resources that Claude can load when needed. A skill is a directory containing a SKILL.md file that contains organized folders of instructions, scripts, and resources that give agents additional capabilities."

一个文件夹，里面放一份 SKILL.md，配若干脚本和资源。SKILL.md 顶部是 YAML 元数据——name、description 两项必填；正文写**什么时候该用这个 Skill、怎么用、有哪些坑**。Claude 启动时只加载元数据，判断当前任务相关才把正文拉进上下文，再相关才去读下层脚本——这套机制 Anthropic 管它叫 progressive disclosure（渐进式披露）：

> "Metadata loads at startup, the full SKILL.md loads when Claude deems it relevant, and additional linked files load only as needed."

![渐进式披露：元数据常驻 → 正文按需 → 附件再按需](material/pngs/06_progressive-disclosure.png)

发布当天，Simon Willison 在自己博客上撂下一句，圈内广泛转发：

> "Claude Skills are awesome, maybe a bigger deal than MCP. I'm predicting a Cambrian explosion in Skills which will make this year's MCP rush look pedestrian."

工程圈大多数人把这条当 Unix 文件哲学的胜利来读——markdown 加一点 YAML，简单到离谱，所以会爆发。这是实现层的视角，没错但不完整。把 2025 年 10 月这份官方定义和 1974 年 6 月 Memo 306 的定义并列放一起念，有件事很难忽略：**两边句式是一样的**。

## 三、对照表：这不是神似，是同构

|                                         | Minsky 1974 Frame                                            | Anthropic 2025 Skill                                  |
|-----------------------------------------|--------------------------------------------------------------|-------------------------------------------------------|
| 绑定什么                                | "attached to each frame are several kinds of information"    | "folders that include instructions, scripts, and resources" |
| 触发场景                                | "for representing a stereotyped situation"                   | "that Claude can load when needed"                    |
| 顶层固定层                              | "The top levels of a frame are fixed"                        | YAML frontmatter: name + description 必填            |
| 可填充槽位                              | "terminals—slots that must be filled by specific instances"  | SKILL.md body + scripts/ + references/                |
| 默认值松绑                              | "default assignments ... easily displaced"                   | 示例、模板、默认参数，运行时可覆盖                    |
| 使用说明                                | "how to use the frame"                                       | SKILL.md 的 usage instructions                        |
| 异常处理                                | "what to do if these expectations are not confirmed"         | SKILL.md 的 pitfalls / error handling 段              |
| 组合调用                                | "Collections of related frames are linked into frame-systems" | Skills composable, 可互相调用                        |
| 按需加载                                | Information retrieval network 触发 frame 切换                | Progressive disclosure 三级加载                       |

八行下来，不是类比，是结构上一一对应。"attached ... several kinds of information"对"include instructions, scripts, and resources"——51 年、两个大陆、两代人，落到纸上是同一句话。

这件事让人不安的不是巧合，是它说明**一个"遇到刻板情境就调用预绑定结构"的心智模型，1974 年就已经想清楚了**。中间那 51 年，AI 领域围着这个模型造过一批系统、死过一批公司、换过一批范式，最后 2025 年 Anthropic 交出来的东西和起点几乎一字不差。这中间到底发生了什么，才是真正的戏。

## 四、中间 20 年：一场完整的生与死

Minsky 1974 过后三年，耶鲁的 Roger Schank 和 Robert Abelson 出了《Scripts, Plans, Goals and Understanding》。Script（脚本）是 Frame 的语言学特化版——Frame 描述静态情境，Script 专盯**时序事件链**。经典例子是餐厅脚本：进门、找位、看菜单、点菜、上菜、吃、结账、走人。核心演示句是一个小魔术：

> "John went to a restaurant and ate lobster."

一个 Script 系统读到这一句，能自己补完 John 看了菜单、点了龙虾、付了钱、走出去——原文一个字没提。"一句话点亮整个场景"的能力，是 Frame/Script 理论最诱人的 promise。

![时间轴：Frames 1974 → Scripts 1977 → KEE/CYC → 1987 崩盘 → 2022 GPT → 2025 Skills](material/pngs/05_timeline.png)

80 年代围着这个 promise 起了一整片产业。KRL（1977，Bobrow 和 Winograd）——头一个通用 frame 语言。KL-ONE（1978）——把 Frame 数学化成描述逻辑，这条血脉后来长成了 W3C 的 OWL。KEE（1983，IntelliCorp 商业化）——跑在 Symbolics LISP 机器上的旗舰 frame 系统，一套卖几万美元。LOOPS（1983，Xerox PARC）——frame 和面向对象的杂交。CYC（1984，Lenat 启动）——野心最大的那一个，目标是把**人类全部常识**编成 frame，四十年干到今天，2500 万条，还在干。

然后 1987 年，整个行业在 12 个月内崩掉。

崩盘三重原因，交织推倒。**第一重是硬件**。Symbolics、LISP Machines Inc、Lucid 这批专门跑符号 AI 的昂贵硬件，被 Sun 工作站配 CLIPS 这种通用方案打穿——性价比差出一个数量级。半年内 AI 硬件行业蒸发 5 亿美元。这是外因。

**第二重是 XCON 的维护崩溃**。XCON 是 DEC 做的配置专家系统，一度每年给公司省 4000 万美元，是当年专家系统商业化的招牌。问题是规则越堆越多，1989 年过万条，任何一处改动都可能让别处逻辑崩掉。维护成本开始超过收益，项目被砍。这是内因。

**第三重，也最致命，是知识获取瓶颈**。1981 年斯坦福的 Edward Feigenbaum 给这现象命了名：

> "Knowledge acquisition is a bottleneck in the construction of expert systems. The knowledge engineer's job is to act as a go-between to help an expert build a system."

![专家系统之冬：三重崩溃同时发生](material/pngs/03_expert-system-winter.png)

翻过来就是：要让一个 frame 系统懂医学，你得请一位医学专家和一位"知识工程师"坐几个月，把专家脑里的诊断流程一条一条挖出来，翻成 frame 的 slot 格式。MYCIN 的 600 条规则，斯坦福医学院团队耗了好几年。CYC 从 1984 干到 2025，四十年常识库 2500 万条，离"覆盖常识"还不知道有多远。

问题的根子不在人懒。是**人类专家的大半知识是 tacit（默会的）**——老医生看一眼就能判断，你让他把判断过程说清楚、拆成 if-then，他说不出来。这是 Frame 结构的死穴：Frame 要求你**提前把 slot 定义清楚**，偏偏人脑里的 slot 本来就没被"定义"过。

![知识获取瓶颈：Frames 手工开槽 vs Skills 自然语言 + LLM 解读](material/pngs/02_knowledge-bottleneck.png)

结果就是：理论上 Minsky 说 Frame 的 default 可替换、结构开放；实现上 80 年代每一个 frame 系统都是封闭的——slot 必须预声明，默认值必须预写死，新情境来了只能回去找 knowledge engineer 再写几个月。Frame 就死在了进不去人脑这一步。

## 五、为什么 2025 年它又活了

2026 年回头看，Minsky 那句"思考是从有缺陷的网络开始的"几乎是一个寓言——他自己的理论，得等那个"有缺陷的网络"长出来才能跑起来。

Transformer 2017 年发表，GPT-3 2020 年出世，2022 年底 ChatGPT 面世以后，几件事在两年内接连发生：prompt engineering 早期实践里，人们开始在 prompt 里手写"few-shot examples + role + format"——行为层面就是在当场手写 Frame。2023 年 11 月 OpenAI 推出 GPTs，一个 GPT 等于一组 system prompt 加工具加知识库——SKILL.md 的直系雏形。2024 年 Anthropic 推出 Artifacts 和 MCP。2025 年 10 月，Skills 落地。

活过来的关键不是结构变了——结构和 1974 几乎一样。关键是 slot 的**填充机制**换了。

80 年代的 KEE 里，一个 slot 叫 `patient.age`，你得预先声明它是整数、范围 0-120、默认值是 null。Skill 里的 slot 是什么？是 SKILL.md 正文里一段自然语言：**"这个 Skill 是做 PPT 用的。用户说'准备汇报'，优先考虑它。需要留意的坑是中文字体兼容。"** 没有 schema，没有类型，没有预声明。模型自己读，自己判断什么时候调、怎么填、怎么和上下文对齐。

换句话说：**Skill 不需要 slot 的形式化定义，它把解释 slot 这件事外包给了 LLM**。

![神经符号：Frames 提供骨架，LLM 提供肉](material/pngs/04_neurosymbolic.png)

这才是 neurosymbolic（神经符号主义）的真实含义。不是"一半神经一半符号对半拼接"，是**结构来自符号、语义来自神经**。Frames 供骨架——分层、默认、可替换、按需加载。LLM 供肉——把自然语言描述的 slot 运行时解读成具体动作。1974 年 Minsky 凭直觉搭出来的那副骨架，2025 年终于等到能挂上去的肉。

Feigenbaum 1981 命名的那条死穴，**用一种 1981 年没人能想象的方式**被绕开了：专家不用再说清楚自己怎么想，只要把场景和步骤用自然语言大致写下来，模型自己读懂。知识工程师这个职业就此消失——或者说，换了个名字叫 prompt 作者。

## 六、但这不等于 Minsky 对了

有件事得正面讲清楚：Skills 活下来不是因为 Frames 结构对了，是因为底下那个 LLM 能补 Frame 补不了的洞。

Frame 理论栽的地方——常识推理、语义消歧、新情境泛化——**Skills 时代一个都没被"结构"解决**。这些问题是靠规模、预训练语料、RLHF 绕过去的，不是靠 frame/skill 的分层机制解决的。把 SKILL.md 这套格式丢给 2015 年的系统去跑，结局就是又一个 KEE——slot 填不满，例外处理不了，一年后维护爆炸，被甲方砍掉。

换个角度：把 Claude 背后那个模型抽掉，只剩 SKILL.md 这套协议，Skills 就是一个更轻的 frame 系统，同样死在知识获取瓶颈上。它活着的全部原因是它**站在一个已经懂很多的东西身上**，Frames 理论里最难的那一步——"让机器真的理解这个 slot 是什么意思"——不再需要机器自己理解，有个上游模型替它理解了。

这不是贬低 Skills 的价值。这是说清楚它是**什么样的胜利**。Minsky 提出的那个命题——"用刻板情境的结构化模板来组织知识"——2025 年被证明是对的，但证明方式是它的对立派把活干完了：神经网络替符号结构做了最难的语义解读，然后把结构主义请回台上主持后续的流程调度。

Frames 时代的目标是"做一个懂行的东西"。Skills 时代的目标是"让已经懂很多的东西按你的方式干活"。**前者是知识论项目，后者是配置项目**。这是两个时代产业界心智模型的根本差别——从"造大脑"收缩到"给大脑写指令"——收缩掉的那块，恰好是 Frame 当年最想啃的硬骨头。

## 七、对 AI 从业者意味着什么

三条具体启示。

第一条是**历史复用判断**。每次看到一个新的 AI 产品形态，值得花十分钟去翻符号 AI 年代有没有结构同构的前辈。Frame、Script、Blackboard architecture、Case-based reasoning——这些东西被埋了 30 年不是因为它们错了，是因为它们的执行基底没跟上。执行基底换了，老结构就会回来。回得越干净，说明当初的抽象越准。选产品方向时，"1980 年代试过一次、当时没成"不是劝退理由，是线索——要判断的是**现在有什么不一样**，而不是过去死过所以现在也死。

第二条是**知识获取的边界**。Skills 能替代知识工程师的部分，是"把场景和步骤用自然语言写下来"这一层。替代不了的部分是**专家连自己都没意识到的那种 tacit 判断**——资深医生一眼的直觉、架构师三十年的品味。这类东西写不进 SKILL.md，也写不进 CYC，2025 年和 1985 年一样写不进。区别只是现在可以靠模型从海量语料里做近似。所以选"做什么产品自动化"时，先问这件事的 know-how 到底长在显性流程里还是长在 tacit 直觉里——前者 Skills 能吃，后者现在还是个深坑。

第三条是**对"简单就是强大"的冷静一点**。Skills 简单（markdown 加 YAML，学十分钟），Unix philosophy 的胜利没错，但简单背后垫着一个 51 年前的认知结构，加一个花了行业几千亿美元训出来的模型。简单的是表面，深的是下面那两层——别以为抄一份 markdown 规范就能在别的系统上复制 Skills 的体验。

## 本期关键词

- **框架（Frame）**——Minsky 1974 提出，描述刻板情境的数据结构，上头挂着"怎么用、接下来发生什么、异常怎么处理"三种信息。SKILL.md 的直系祖先。
- **槽位（Slot）**——Frame 底层可填充的变量位，预挂默认值、运行时可被新信息替换。在 Skill 里表现为 SKILL.md 中那些"待模型理解再展开"的自然语言描述。
- **知识获取瓶颈（Knowledge Acquisition Bottleneck）**——Feigenbaum 1981 命名，指把人类专家的 tacit 判断翻译成可执行规则这一步的代价，高到让专家系统商业化落不了地。Skills 绕开它的方式不是解决它，是把解读工作外包给 LLM。
- **渐进式披露（Progressive Disclosure）**——Anthropic Skills 三级加载机制：元数据常驻、正文按需、附件再按需。对应 Minsky 原文里 frame 按情境激活的 information retrieval network。
- **神经符号主义（Neurosymbolic AI）**——Minsky 1991 年《Logical Vs. Analogical》就主张的路线：结构来自符号、语义来自神经。Skills 是这条路线到 2025 年为止最干净的产品化落地。
- **默会知识（Tacit Knowledge）**——专家脑子里但说不清的那部分判断。Frame 时代栽在这上面，Skills 时代靠预训练语料的统计平均绕过去，但真正的硬骨头还没被啃动。

---

1974 年 Minsky 没有错，他只是早了一个 Transformer。

---

## 引用

1. Minsky, M. (1974). *A Framework for Representing Knowledge*. MIT AI Lab Memo 306. [PDF](https://courses.media.mit.edu/2004spring/mas966/Minsky%201974%20Framework%20for%20knowledge.pdf)
2. Schank, R. & Abelson, R. (1977). *Scripts, Plans, Goals and Understanding*. Lawrence Erlbaum.
3. Bobrow, D. & Winograd, T. (1977). *An Overview of KRL*. Cognitive Science 1:3-46.
4. Feigenbaum, E. (1981). Knowledge acquisition bottleneck. Semantic Web Journal archives.
5. Minsky, M. (1986). *The Society of Mind*. Simon & Schuster.
6. Minsky, M. (1991). *Logical Vs. Analogical or Symbolic Vs. Connectionist or Neat Vs. Scruffy*. AI Magazine 12(2). [AAAI](https://www.aaai.org/ojs/index.php/aimagazine/article/view/894/812)
7. Anthropic (2025-10-16). *Introducing Agent Skills*. [claude.com/blog/skills](https://claude.com/blog/skills)
8. Anthropic Engineering. *Equipping agents for the real world with Agent Skills*. [anthropic.com](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
9. Willison, S. (2025-10-16). *Claude Skills are awesome, maybe a bigger deal than MCP*. [simonwillison.net](https://simonwillison.net/2025/Oct/16/claude-skills/)
10. Marcus, G. (2025). *The Biggest Advance in AI Since the LLM*. [Substack](https://garymarcus.substack.com/p/the-biggest-advance-in-ai-since-the)
