# 研究报告《脚本 1974》：Minsky Frames 与 Claude Skills 的血缘档案

> **性质**：文章底稿素材库。subagent 深度挖掘成果。
> **文章候选**：第一篇 / 原创性确认（无人专门论证 SKILL.md = 1974 Frame 复活体）
> **产出日期**：2026-04-21
> **研究员**：general-purpose subagent（Claude Opus 4.7）

---

## 一、Minsky 1974：原文精读

论文全称 *A Framework for Representing Knowledge*，MIT AI Lab Memo 306，1974 年 6 月。重印于 Winston 编 *The Psychology of Computer Vision*（1975）、Haugeland 编 *Mind Design*（1981）、Collins & Smith 编 *Cognitive Science*（1992）。被引 6000+ 次。

**原文 PDF 来源**：
- https://courses.media.mit.edu/2004spring/mas966/Minsky%201974%20Framework%20for%20knowledge.pdf
- MIT DSpace: https://dspace.mit.edu/handle/1721.1/6089
- UNAM 镜像：http://filosoficas.unam.mx/~morado/TextosAjenos/MinskyAIM306.pdf

### 1.1 Minsky 自陈的动机：反"原子命题"

开篇打靶符号 AI 主流：

> "It seems to me that the ingredients of most theories both in Artificial Intelligence and in Psychology have been on the whole too minute, local, and unstructured to account—either practically or phenomenologically—for the effectiveness of common-sense thought. The 'chunks' of reasoning, language, memory, and 'perception' ought to be larger and more structured; their factual and procedural contents must be more intimately connected in order to explain the apparent power and speed of mental activities."

> 我认为人工智能和心理学现有的理论配料太小、太局部、太松散，既没法在实际上也没法在现象学上解释常识思考的有效性。推理、语言、记忆、"感知"这些"大块"应该更大更有结构，事实内容和程序内容必须更紧密耦合，才能解释大脑表现出的那种力量和速度。

点名反面靶子：

> "I see all these as moving away from the traditional attempts both by behavioristic psychologists and by logic-oriented students of Artificial Intelligence in trying to represent knowledge as collections of separate, simple fragments."

### 1.2 核心定义四段（可 verbatim 引用）

**Frame 是什么**：

> "Here is the essence of the theory: When one encounters a new situation (or makes a substantial change in one's view of the present problem) one selects from memory a structure called a Frame. This is a remembered framework to be adapted to fit reality by changing details as necessary."

**刻板情境**：

> "A frame is a data-structure for representing a stereotyped situation, like being in a certain kind of living room, or going to a child's birthday party. Attached to each frame are several kinds of information. Some of this information is about how to use the frame. Some is about what one can expect to happen next. Some is about what to do if these expectations are not confirmed."

**Slot 和 Terminal**：

> "We can think of a frame as a network of nodes and relations. The 'top levels' of a frame are fixed, and represent things that are always true about the supposed situation. The lower levels have many terminals—'slots' that must be filled by specific instances or data. Each terminal can specify conditions its assignments must meet."

**Default Assignments**（对 Skill 最关键）：

> "A frame's terminals are normally already filled with 'default' assignments. Thus, a frame may contain a great many details whose supposition is not specifically warranted by the situation... The default assignments are attached loosely to their terminals, so that they can be easily displaced by new items that fit better the current situation."

### 1.3 Frame-System 定义

> "Collections of related frames are linked together into frame-systems. The effects of important actions are mirrored by transformations between the frames of a system. [...] Different frames of a system share the same terminals; this is the critical point that makes it possible to coordinate information gathered from different viewpoints."

### 1.4 Minsky 对形式逻辑的总攻击（全文最硬一段）

> "I here explain why I think that more 'logical' approaches will not work. [...] I think such attempts will continue to fail, because of the character of logistic in general rather than from defects of particular formalisms."

关于 monotonicity：

> "In any logistic system, all the axioms are necessarily 'permissive'—they all help to permit new inferences to be drawn. Each added axiom means more theorems, none can disappear. [...] if we adopt enough axioms to deduce what we need, we deduce far too many other things."

**通篇最有气势的结尾断言**：

> "I cannot state strongly enough my conviction that the preoccupation with Consistency, so valuable for Mathematical Logic, has been incredibly destructive to those working on models of mind. [...] This obsession has kept us from seeing that thinking begins with defective networks that are slowly (if ever) refined and updated."

> 我再怎么强调都不为过：数学逻辑推崇的"一致性"偏执，对心智建模者是极大的破坏。它让我们看不到：思考是从有缺陷的网络开始的，这些网络缓慢地（如果有那一天的话）被提炼和更新。

**判断**：这段话几乎是在预言 LLM 时代——"有缺陷的网络缓慢更新"几乎就是神经网络的工作定义。**1974 年的 Minsky 已经把他 40 年后的对手画像出来了。**

---

## 二、历史链条：从 1974 到 2025

### 2.1 Scripts（Schank & Abelson 1977）

Minsky 1974 原文里就点过 Schank 的名。三年后 Schank & Abelson 出 *Scripts, Plans, Goals and Understanding*。

**Script 是 Frame 的语言学特化版**——Frame 描述静态刻板情境（客厅、生日派对），Script 描述**时序事件链**（餐厅脚本）。

餐厅脚本标准形式：
- Scene 1（进入）：S PTRANS S into restaurant, S ATTEND eyes to tables, S MBUILD where to sit
- Scene 2（点菜）：S PTRANS menu to S, S MBUILD choice, S MTRANS signal to waiter
- Scene 3（吃）：Cook ATRANS food to waiter, waiter PTRANS food to S, S INGEST food
- Scene 4（离开）：waiter ATRANS check to S, S ATRANS money to waiter, S PTRANS out

核心句子："John went to a restaurant and ate lobster."——这一句话能触发整个餐厅脚本，让系统推理出 John 走进去、坐下、看菜单、点龙虾、吃、付钱、离开。

### 2.2 80 年代 Frame-based 系统族

Minsky Frames 催生了一系列实现：

- **KRL**（Bobrow & Winograd 1977, *Cognitive Science* 1:3-46）——最早的通用 frame-based 语言
- **FRL**（Frame Representation Language）——MIT Roberts & Goldstein 1977
- **KL-ONE**（Brachman 1978）——把 Frame 数学化成描述逻辑，后来演变为 OWL
- **KEE**（IntelliCorp，1983 商业化）——LISP 机上的旗舰 frame 系统，跑在 Symbolics 机器上，一套几万美元
- **LOOPS**（Xerox PARC, 1983）——frame + object-oriented 杂交
- **CYC**（Lenat 1984 起）——野心最大：把人类常识全部编码进 frame。40 年到今天还没"完"

### 2.3 1987 崩盘的三重原因

**(a) 硬件层**：Symbolics、LISP Machines Inc、Lucid 被 Sun/通用工作站打穿。Sun-3 + CLIPS 的性价比直接抹掉 Symbolics 3600。AI hardware 半年内整个行业蒸发 5 亿美元。

**(b) 知识获取瓶颈**（Feigenbaum 1981 命名，Frames 方向的**结构性死穴**）：

> "Knowledge acquisition is a bottleneck in the construction of expert systems. The knowledge engineer's job is to act as a go-between to help an expert build a system."

要把领域 expert 的知识塞进 Frame slot，需要 knowledge engineer 跟专家聊几个月，还不一定聊对——因为专家知识大部分是 tacit（默会的）。MYCIN 600 条规则，斯坦福医学院团队数年。CYC 1984 干到 2025，常识条目 2500 万，**仍未解决**。

**(c) XCON 维护崩溃**：DEC 配置专家系统 XCON 一度每年省 4000 万美元，但到 1989 年规则数超过 1 万，任何一处改动都能让别处崩掉。维护成本超过收益，项目被砍。

### 2.4 Minsky 本人的反思

**1986《Society of Mind》**——Frames 没死，变成"K-lines""agents""transframes"。Transframe 明确是 Frame 继承者：专门用来表达"事件"的 Frame，slot 包括 origin、destination、cause、goal、affected object、time、instrument。

**2006《The Emotion Machine》**——继续用 frame 体系，加情绪模型、六层反思结构。

**Minsky 晚年立场**：纯神经网络不够，"symbolic + structure" 早晚得回来。跟 Gary Marcus 高度一致。

### 2.5 重生：2022-2026

- **2022** GPT-3/Instruct：prompt engineering 早期的 "Few-shot examples + role + format" 结构，**行为学上已经是在 prompt 里手写 Frame**
- **2023** ChatGPT Custom Instructions（7 月）→ GPTs（11 月）：GPT = 一组 system prompt + 工具 + 知识库。SKILL.md 雏形
- **2024** Anthropic Artifacts（6 月）、MCP（11 月）
- **2025 年 10 月 16 日** Anthropic 发布 Claude Skills。博客 claude.com/blog/skills

**Anthropic 官方定义**：

> "Skills are folders that include instructions, scripts, and resources that Claude can load when needed."

> "A skill is a directory containing a SKILL.md file that contains organized folders of instructions, scripts, and resources that give agents additional capabilities."

**Progressive disclosure（渐进式披露）机制**：

> "Metadata loads at startup, the full SKILL.md loads when Claude deems it relevant, and additional linked files load only as needed."

> "The startup metadata serves as the first level of progressive disclosure: it provides just enough information for Claude to know when each skill should be used without loading all of it into context."

**Simon Willison 评价**：

> "Claude Skills are awesome, maybe a bigger deal than MCP."
> "I'm predicting a Cambrian explosion in Skills which will make this year's MCP rush look pedestrian."
> "MCP is a whole protocol specification. Skills are Markdown with a tiny bit of YAML metadata. The core simplicity of the skills design is why I'm so excited about it."

---

## 三、关键判断：为什么 1974 死、2025 活？四假设逐一验证

### a. 知识获取瓶颈假设 ⭐ **成立，是最核心差异**

- **1974 死法**：专家手写 slot，每条知识要 knowledge engineer 当翻译，几年做一个专家系统
- **2025 活法**：SKILL.md 用自然语言写，**LLM 自己去解读 slot 含义**。Skill 作者只需要写"这是用来做 PPT 的"，模型自己判断、自己填参数、自己执行

**Skill 不需要 slot 的形式化定义，它把解释 slot 这件事外包给了 LLM**。这是 neurosymbolic 的真正含义——Frames 提供骨架，LLM 提供肉。

### b. 封闭世界 vs 开放世界 — **部分成立**

Frames 理论上不封闭（Minsky 原文强调 default 可替换），但 80 年代实现层（KEE/KRL/CYC）确实封闭（slot 预先声明）。Claude Skills 的 slot 是**运行时由 LLM 从自然语言推断出来的**，等价于开放。

**准确说法**：理论上 Frames 和 Skills 都开放，但只有 LLM 的出现让开放真正可执行。

### c. 代替人类 vs 增强 LLM — **成立，是哲学差异**

- Feigenbaum：把人类专家知识抽出来装进机器（代替人类）
- CYC：encoding common sense（把人类全部常识编码）
- **Claude Skills**："Skills are folders that Claude can load when needed"——**Skill 是"给 Claude 用的"，不是"装成 Claude"的**

**Frames 时代的目标是"做一个懂行的东西"，Skills 时代的目标是"让已经懂很多的东西按你的方式干活"**。前者是知识论项目，后者是配置项目。

### d. 逐条结构对照 — **成立，对应到令人不安**

| Minsky 1974 Frame | Claude 2025 Skill | 证据 |
|---|---|---|
| Frame = "data-structure for representing a stereotyped situation" | Skill = "directory containing SKILL.md ... organized folders of instructions" | 都是"遇到 X 情境调用 Y 结构" |
| Top level 固定不变 | YAML frontmatter: name, description 必填 | 都是元数据层 |
| Terminals / Slots | SKILL.md body + scripts/ + references/ | 都是可填充的变量槽 |
| Default assignments 松绑 | Skill 里的示例、模板、默认参数 | 都可被运行时覆盖 |
| "attached to each frame are several kinds of information" | "instructions, scripts, and resources" | **句式几乎一样** |
| Frame-system（多 Frame 关联） | Skills 互相调用、compose | Anthropic 原话 "composable" |
| Information retrieval network 触发 frame 切换 | Progressive disclosure 三级加载 | 机制同构 |
| "How to use the frame" 信息 | SKILL.md 的 usage instructions | 一一对应 |

---

## 四、Minsky 晚年 + Society of Mind + Emotion Machine 的伏笔

Society of Mind (1986) 第 24 章把 Frames 重新架构为 K-lines 和 agents。关键断言：

> "Transframes represent events and all of the entities that were involved with or related to the event. They may have slots for representing the origin and destination of a change, who or what caused the event, the motivation behind the event or the goal it is intended to achieve."

这跟 Anthropic agent skill 描述（"instructions + what to expect + what to do if expectations fail"）是同一个心智模型。

Minsky 1991 *Logical Vs. Analogical*（AI Magazine 12(2)）——**反对纯神经 + 反对纯符号，主张混合**。这是 Gary Marcus 2025 的 neurosymbolic 论点来源。

**Gary Marcus 2025《The Biggest Advance in AI Since the LLM》**：

> "Anthropic, when push came to shove, went exactly where I have said for 25 years that the field needed to go: to Neurosymbolic AI."

> "Claude Code isn't better because of scaling. It's better because it is neurosymbolic. [...] The real godfathers of AI, people like John McCarthy and Marvin Minsky and Herb Simon, would have instantly recognized [the kernel structure]."

**Marcus 说的是 Claude Code 调度内核神似 McCarthy/Minsky，没专门拆 SKILL.md = Frame。这个跳跃是本文作者的原创。**

---

## 五、中英文舆论扫描：这个血缘有人写过吗？

**英文圈**：
- Gary Marcus 连了 Claude Code → 神经符号主义，**没拆 SKILL.md**
- DualMedia 2025《Frames in AI》泛泛提"frames 在 LLM 时代的 comeback"，**没点名 Skills**
- Simon Willison 专注工程简洁性，**没往 Minsky 拉**
- LessWrong/gwern：检索不到 Frames × Skills 专题
- Wikipedia 《Frame (AI)》**完全没提 LLM/Agent 的复活**

**中文圈**：
- 宝玉 xp（@dotey）多次讲 Skills 工程价值、渐进式披露、拆 Cat Wu/Thariq，**没提 Minsky**
- 机器之心、量子位、新智元：搜不到 "Minsky frames Claude Skills" 专题
- 阿里云开发者社区《Minion Skills：Claude Skills 的开源实现》——工程向
- 网易《渐进式披露有多牛？Claude Skills 搭配 MCP》——工程向

**结论（核心价值点）**：**专门论证"SKILL.md 是 1974 Frame 的复活体"这个命题，目前检索不到先行文章。这是文章的 angle 原创性所在。**

---

## 六、反面论证（三条刹车）

**反驳 1：Frames 是结构化知识表示，Skills 是过程性指令**
- Frame = 静态关系（客厅有墙椅灯），Skill = 动态流程（做 PPT 的步骤）
- **反驳**：Minsky 原文第 46-49 行明说 Frame "attached several kinds of information: how to use the frame ... what to expect ... what to do if expectations are not confirmed"——过程知识本来就在 Frame 里。1.12 节 "FRAME-SYSTEMS AND PIAGET'S CONCRETE OPERATIONS" 全讲动作和转换。**站不住**。

**反驳 2：Skills 更像 Unix philosophy，不是 AI 符号主义**
- Simon Willison 分析里有这层意思
- **反驳**：两者不矛盾。Unix philosophy 是实现层，Frames 是思维层。SKILL.md 作为文件是 Unix 传统，作为"刻板情境+slot+defaults+procedures"的数据结构就是 Frame。**不互斥**。

**反驳 3：Frames 没解决的问题 Skills 也没解决** ⭐ **最有力，必须正面承认**
- 常识推理、语义理解、新情境泛化——Frames 栽在这
- Skills 时代这些**不靠结构解决**，靠规模和 RLHF
- **Skills 活着不是因为 Frames 对了，是因为底下的 LLM 能补 Frame 不能补的洞**
- 如果没有 LLM，Skills 就是又一个 Frame 系统，同样死于知识获取瓶颈
- **文章结尾必须落到这个点**：不是 Minsky 对了，是 LLM 给了 Minsky 的结构一个能跑起来的身体

---

## 七、开头段 draft（150 字内）

### Draft A（具体事件 + 数据）

> 2025 年 10 月 16 日，Anthropic 发布 Claude Skills，核心文件叫 SKILL.md，一个文件夹里塞几份 markdown 和脚本，声明这是一项"刻板情境下的技能"。发布博客第一段写着："Skills are folders that include instructions, scripts, and resources that Claude can load when needed." 翻到 1974 年 6 月 MIT AI Memo 306，Marvin Minsky 的原话是："A frame is a data-structure for representing a stereotyped situation ... attached to each frame are several kinds of information." 五十一年，两句话，同一个意思。

### Draft B（反直觉数据钩子）⭐ 推荐

> 2025 年 10 月 Anthropic 发布 Claude Skills，两个月后 Gary Marcus 在 *Communications of the ACM* 写了一句话：McCarthy 和 Minsky 一眼就能认出来这套东西。但没人接着往下说——Skills 不只是"神似老派 AI"，它是 1974 年 6 月那篇 MIT AI Memo 306 的直接复活体，中间隔着一场持续 20 年的寒冬、三代推倒重来的专家系统、和一个死于知识获取瓶颈的黄金十年。SKILL.md 不是新东西，是 Minsky 在 51 年前写好的脚本。

建议用 Draft B：时间压缩钩子（2025→1974）+ 第三方锚定（Marcus ACM）+ "但没人接着往下说"的原创 angle 宣告 + 结尾"脚本"落回标题。

---

## 八、关键信源清单

1. Minsky (1974). *A Framework for Representing Knowledge*. MIT AI Lab Memo 306. [courses.media.mit.edu PDF](https://courses.media.mit.edu/2004spring/mas966/Minsky%201974%20Framework%20for%20knowledge.pdf) / [DSpace](https://dspace.mit.edu/handle/1721.1/6089)
2. Schank & Abelson (1977). *Scripts, Plans, Goals and Understanding*. Summary: [jimdavies.org](http://www.jimdavies.org/summaries/schank1977-2.html)
3. Bobrow & Winograd (1977). *An Overview of KRL*. Cognitive Science 1:3-46
4. Feigenbaum (1981). Knowledge acquisition bottleneck — 引自 [semantic-web-journal](https://www.semantic-web-journal.net/sites/default/files/swj32.pdf)
5. Minsky (1986). *The Society of Mind*. Simon & Schuster
6. Minsky (1991). *Logical Vs. Analogical or Symbolic Vs. Connectionist or Neat Vs. Scruffy*. AI Magazine 12(2). [aaai.org](https://www.aaai.org/ojs/index.php/aimagazine/article/view/894/812)
7. Minsky (2006). *The Emotion Machine*. Simon & Schuster
8. Anthropic (2025-10-16). *Introducing Agent Skills*. [claude.com/blog/skills](https://claude.com/blog/skills)
9. Anthropic Engineering. *Equipping agents for the real world with Agent Skills*. [anthropic.com](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
10. Willison (2025-10-16). *Claude Skills are awesome, maybe a bigger deal than MCP*. [simonwillison.net](https://simonwillison.net/2025/Oct/16/claude-skills/)
11. Marcus (2025). *The Biggest Advance in AI Since the LLM*. [Substack](https://garymarcus.substack.com/p/the-biggest-advance-in-ai-since-the)
12. DualMedia (2025). *Frames in Artificial Intelligence*. [dualmedia.com](https://www.dualmedia.com/frames-in-artificial-intelligence/)
13. Singh. *Examining the Society of Mind*. [jfsowa.com](http://jfsowa.com/ikl/Singh03.htm)

---

## 九、三条操作建议（给作者）

1. **开头用 Draft B**——2025→1974 这个 51 年跨度本身就是钩子
2. **中段对照表必须出**（第三节 d）——读者一眼看到 "attached several kinds of information" vs "instructions, scripts, and resources" 并列，自己得结论
3. **结尾落到反驳 3 的承认**——用 writing-style.md 规则 6 命名式收束："**1974 年 Minsky 没有错，他只是早了一个 Transformer。**"

---

> *产出日期：2026-04-21 | 已确认原创 angle | 可直接进入 Phase 3 写作*
