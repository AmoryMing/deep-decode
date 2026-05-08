   ---
title: 80 年后，Memex 终于可以兑现
source: 多信源（基于 research-report.md）
author: 本文作者
date: 2026-04-21
decoded: 2026-04-21
tags: [AI产品, 历史, LLMWiki, Memex, Karpathy]
type: hot-history
pair: memex-llm-wiki
---

## 一条 gist，把 80 年历史拉直

2026 年 4 月 3 日傍晚，Andrej Karpathy 在 X 发了条推，说他现在大部分 token 不在跑代码，在跑个人知识库。第二天把方法论做成 GitHub gist 扔出去，文件名 `llm-wiki.md`，48 小时 5000 star，4851 fork，阅读量 1200 万。他在 gist 末尾轻描淡写地提了一嘴 Vannevar Bush 的 Memex，加了一句："Bush 没能解决的是谁来维护。LLM 解决了。"

这句话把 80 年的技术史拉直了一遍。1945 年 Bush 画的那张桌子——微缩胶片、投影屏、按钮和杠杆——后面 80 年 Nelson、Engelbart、Berners-Lee 接力失败四次。这一次成了，但成的方式跟所有人预想的都不一样。量子位当天同步，知乎七篇长文接力，HN 一条 296 分的热帖 95 条评论，Reddit 三个板块同步炸开——这是一次罕见的技术社群集体顿悟。陌生人们不是在追热点，是在找一个名字。

## Bush 1945 年究竟设想了什么

先交代写文章的这个人。1945 年 7 月发《As We May Think》时，Vannevar Bush 的身份是 OSRD 主任——美国科学研究与发展办公室一把手——刚协调完 6000 名顶尖科学家为战争服务。雷达、近炸引信、青霉素量产的军民协作全过他手，曼哈顿计划也是他签字。写这篇的时候，他比任何人都清楚一件事：这些科学成果的论文记录，多到已经没人读得完了。

他的焦虑原话是这样的：

> "There is a growing mountain of research. But there is increased evidence that we are being bogged down today as specialization extends. The investigator is staggered by the findings and conclusions of thousands of other workers — conclusions which he cannot find time to grasp, much less to remember."

> 研究的山头越堆越高，而我们正在被它拖住。研究者被数以千计同行的发现压得喘不过气——这些结论他连读完的时间都找不到，更别说记住。

Bush 说这话的时候，全世界一年出几万篇论文。2025 年 arXiv 一年收 30 万篇，Semantic Scholar 累计 2 亿+。80 年前他就预言了今天研究者的默认心理状态：淹没。

为了说清信息检索失败的代价有多大，他举了孟德尔：

> "Mendel's concept of the laws of genetics was lost to the world for a generation because his publication did not reach the few who were capable of grasping and extending it; and this sort of catastrophe is undoubtedly being repeated all about us."

> 孟德尔的遗传学定律整整一代人没被世界看到，因为他的论文没触达那几个能接得住的人。这类灾难今天仍在我们身边发生。

孟德尔 1866 年发表豌豆实验，1900 年才被重新发现。Bush 一句话点穿问题——不是没人研究，是研究了但找不到。80 年后这句话是 Perplexity、Elicit、Scite 的底层 pitch。

然后他画了那张桌子：

> "Consider a future device for individual use, which is a sort of mechanized private file and library ... It consists of a desk ... On the top are slanting translucent screens, on which material can be projected for convenient reading. There is a keyboard, and sets of buttons and levers."

桌子、斜面半透明屏、键盘、按钮杠杆——合起来就是今天的个人电脑。要知道，写这段时世界上第一台商用电脑 UNIVAC I 还要等 6 年才出。他还顺嘴说了一句彻底躺平的话："如果用户每天塞 5000 页进去，也要几百年才能填满存储，所以他可以挥霍着存。"——1945 年这是科幻，今天是每个 Obsidian 用户的默认姿态。

Bush 画准的五件事是信息过载、个人化设备、储存焦虑消除、超链接、协作。画离谱的五件事是微缩胶片作载体（赌错介质）、Vocoder 语音输入（Whisper 2022 才兑现）、摄影眼镜（Meta Ray-Ban 2024 才跑起来）、trail blazer 新职业（后面专讲），以及最关键的一条：维护者的缺席。

他整篇文章把"维护"悄悄塞在用户的日常操作里——谁用谁维护。没明说"如果用户懒了怎么办"，整个设计默认了一个持续有动力、博学自律的用户。这个前提 80 年里几乎没兑现过。Karpathy 那句话的分量在这里：Bush 不是没考虑维护，他是没想到维护会成为整个系统的失败点。

## 失败的继承人排成一条队

1962 年到 2019 年，至少有 9 个人接过这根接力棒。

Engelbart 的 NLS 定义了大纲、鼠标、屏幕分屏——但只能在 SRI 的大机器上跑，平民用不起。Ted Nelson 1965 年造了两个后来人人用的词——hypertext、transclusion（用人话说就是"引用不复制"——一段话存一份原件，所有引用都是活链接）——然后花 30 年没能把系统做出来。Nelson 和 van Dam 1967 年做的 HES 第一次跑在商用硬件上，被 NASA 买去做阿波罗文档。van Dam 1968 年的 FRESS 第一次有 undo 按钮。Alan Kay 1972 年的 Dynabook 把 Memex 从桌子变成随身——小孩能用的个人电脑——硬件等了 40 年才等到 iPad。Bill Atkinson 1987 年的 HyperCard 让普通 Mac 用户第一次摸到超文本——Atkinson 后来自己说，要不是他当时只想做本地 stacks，它本该是第一个网页浏览器。Berners-Lee 1991 年的 WWW 终于全球部署了，代价是把 Bush 要的"双向关联+私人策展"全部砍掉，只剩单向链接。2019 年 Conor White-Sullivan 的 Roam Research 用双向链接+块引用把 Nelson 1965 年的 transclusion 复活，结果维护成本把 90% 的用户劝退。

这里面最值得细看的是 Nelson。WIRED 1995 年 6 月写过一篇《The Curse of Xanadu》，开头一句话点破了后面 30 年：

> "Establishing a habit that would persist, Nelson failed to finish the coding, and had to take an incomplete for the course."

> Nelson 养成了一个会跟他一辈子的习惯：没把代码写完，只好把那门课挂掉。

这是 Nelson 1960 年在哈佛一年级的事。那门没写完的 term project 就是超文本原型。后面 30 年他一模一样的模式——设想完美、交付不了。1989 年在 Autodesk 重启 Xanadu 时，技术方案跟 1979 年几乎没变，1979 年的方案跟 1965 年的草图也几乎没变。1994 年 Xanadu 破产。一个叫 Charlie Smith 的人把遗产买走，组了家叫 Memex 的公司——没错，致敬 Bush——想给保险行业做记录系统。然后连保险系统都没做成，程序员们不拿工资把机器搬走抵债。

Memex 这个词在 1995 年的状态就是这样——一家倒闭公司的名字，在致敬一个永远没实现的想法，被另一个永远没实现的想法继承。

每一代接力者都在补前一代的洞。Engelbart 补 Bush 的交互，Nelson 补 Engelbart 的语义，Kay 补 Engelbart 的平民化，Atkinson 补 Kay 的硬件落地，Berners-Lee 补全部人的规模化——然后到了 Roam、Obsidian、Notion 这一代，问题兜了 80 年又兜回到了 Bush 的起点：**谁来维护？**

## Luhmann 是唯一的反例，但他不是反驳

1952 年到 1997 年，德国社会学家 Niklas Luhmann 维护了大约 90000 张索引卡片，每张一个原子想法，互相编号引用。他一生出 58 本书、数百篇论文，自己把 Zettelkasten 称作 "communication partner"。

Luhmann 是过去 80 年唯一一个证明"一个人能维护得动"的存在。但他的系统有三个苛刻条件：第一，他把 Zettelkasten 当成本职工作的一部分，每天花几小时写卡；第二，"每张卡一个想法"的原子纪律几十年不松懈；第三，tag 和编号方案非常克制，不追求完备。

即便如此，他写得动还有一个更本质的原因——他本人就是知识的加工者，不是整理者。他不是在"整理别人写的东西"，他是在"想"。卡片是他想的中间产物，不是他想之前要先做完的预处理工作。

所以 Luhmann 是反例，不是反驳。他证明了个人知识系统在"知识生产者本人、专职、数十年"的窄条件下可以跑起来。但对 99% 只想保存读过的东西以便日后找到的人来说，他的案例没复用价值。

## 「维护税」——80 年里大家都交过的那笔账

过去所有 Memex 继承者收的税都是一句话：你想用？先维护。Bush 让你手动拉 trail，Nelson 让你守协议，Berners-Lee 让你写 HTML，Roam 让你做双链，Obsidian 让你定标签体系。税的名字不同，税基都一样——**你的时间**。

这笔税最狡猾的地方在于它是慢性的。第 1 天写 5 条笔记很快乐，第 50 天标签体系开始乱，第 200 天你打开笔记库想找一件事情，发现搜索结果里有 30 条风格不一致的旧笔记，哪一条是最新的？不知道。然后你就不再打开这个 vault 了。Evernote、Notion、Roam、Obsidian 的用户流失曲线长得都一模一样——前 50 天陡升，第 200 天往下掉。

Karpathy 在 gist 里一句话点穿了这件事：

> "The tedious part of maintaining a knowledge base is not the reading or the thinking — it's the bookkeeping."

> 维护知识库里最烦人的部分不是读，不是想，是记账。

他的方案是把记账这一步交给 LLM：原始文件扔进 `raw/`（只读、不动），LLM 读完 raw/ 自己编译出 `wiki/`——合成摘要、打标签、补双向链接、发现矛盾。用户做的事只剩两件：往 raw/ 扔材料、问 wiki/ 问题。

这里就有了一个值得命名的现象，姑且叫它「**维护税**」。

过去 80 年所有 Memex 继承者收的税都以"人力"为税基。LLM Wiki 第一次把税基换成了"token"。税基换了，其他全连锁变了——以前 Obsidian 用户那条 50 天陡升、200 天断崖的流失曲线，和今天 Karpathy gist 下面 5000 人同时动手的热情曲线，是同一条曲线翻过了一个拐点。

这个切换为什么重要？人力税是**非线性累加**——你今天多写 5 条笔记，第 200 天的整理成本不是多 5 条，是多 5×N 条（要重新关联到已有的 N 条上）。token 税是**线性可预算**——一次 compaction 多少钱清清楚楚，脚本凌晨跑完交差。一个是让用户半路弃坑的复利陷阱，一个是能写进月度预算的 SaaS 订阅费。

Bush、Nelson、Engelbart、Berners-Lee 80 年没做成的事，Karpathy 一条 gist 48 小时里让 5000 人点头——不是技术突破，是问题被重新定义。

## Karpathy 那条 gist 做对了一件很小的事

gist 的方法论本身并不复杂：目录分成 raw/（只读源材料）、wiki/（LLM 合成层）、memory/（状态记录）；一份 CLAUDE.md 当 schema 规定 LLM 怎么合成；每次更新只追加不覆盖原文；查询走 wiki/ 但可回溯到 raw/。总共不到 200 行配置。

真正戳中社群的是 Karpathy 事后补的那句话——Bush 没解决维护，LLM 解决了。这不是代码层面的突破，是叙事层面的确认：你可以用 LLM 管个人知识库这件事，很多人已经在做了，但没人把它挂到 Bush 的谱系上。挂上去的一瞬间，一个散落的民间实践突然被接入了 80 年的技术史。

gist 被 fork 4851 次，浮出四个值得看的扩展。rohitg00（一个做 agentmemory 的工程师）做的 v2 加了记忆生命周期——facts、observations、beliefs 三层——以及混合检索（BM25+向量+图）、置信度评分、多 agent 协作。Astro-Han 把它打包成 Agent Skill，Claude Code、Cursor、Codex、OpenCode 都能装。lewislulu 做了个带 Obsidian audit 插件的版本，314 star。ethanjoffe 做了个带 ingestion pipeline 的 Python 实现。rohitg00 v2 的结尾一句话概括了整个运动的情绪：

> "The Memex is finally buildable. Not because we have better documents or better search, but because we have librarians that actually do the work."

> Memex 终于可以造了。不是因为我们有更好的文档或更好的搜索，是因为我们终于有了真愿意干活的图书馆员。

一个叫 Farza 的开发者做了个 Farzapedia——喂 LLM 2500 条日记加 Apple Notes 加 iMessage 全部历史对话，编出 400 篇文章。这是 Bush 1945 年写 trail blazer 这个词时想象中最接近的一次实例——一个人放出一条高质量的思考路径，陌生人扑上来继承。

## 批评者：税没消失，只是换了形式

并不是所有人都买账。最值钱的反驳是 foundanand 在 Medium 上那篇《The Hidden Flaw in Karpathy's LLM Wiki》：

> "When the LLM is a librarian who writes new books and shelves them next to the originals, you eventually can't tell the difference. When the LLM is a librarian who writes index cards pointing at the originals, you always can."

> 当 LLM 是一个会写新书然后把新书摆到原著旁边的图书馆员，你迟早分不清哪本是原著。当 LLM 是一个只写索引卡片指向原著的图书馆员，你永远分得清。

foundanand 主张的方案技术上叫 **query-time synthesis**——查询时合成——摄入的时候 LLM 只抽结构化元数据（实体、关系、tag），不写新 prose；要用的时候再对着原文现合成。Karpathy 的方案是反过来的 **write-time synthesis**——写入时合成——LLM 摄入的时候就把 wiki/ 编好，查询走 wiki/ 不走 raw/。

这是方法论级别的分歧，两种方案账算得完全不同。write-time 是一次合成 N 次复用，单位查询极便宜，代价是合成层和源文件会漂——今天读 2024 年的旧合成层，拿到的东西可能已经跟原文不一致，而用户看不见这种漂。query-time 是摄入只抽元数据、查询回原文现合成，信任链永远短且透明，代价是每次查询贵、慢，长尾关联要跨 500 个原子笔记时拼不起。

谁对？这场分歧本身就说明维护税没消失，只是换了形式。write-time 的税交给"守住 schema"——要有长期的守门人；query-time 的税交给"每次查询预算"——用户要么接受慢，要么付更多 token 费。更残酷的是两种方案都假设 raw/ 是干净的，但现实 raw/ 是从网上抓的、从聊天复制的、从 PDF OCR 的，源头已经是脏的。

HN 上 296 分那条帖子的顶楼回复更直接。devnullbrain 说：

> "I don't see why this wouldn't just lead to model collapse ... the compounding will just be rewriting valid information with less terse information."

> 我不明白这凭什么不会导致模型塌缩，复合效应就是用啰嗦的信息一遍遍重写掉原来精准的信息。

这句话和另一位 @ranjankumar-gh 的三段论拼起来才完整——后者的意思是：LLM 持续摘要比一次性建 embedding 贵得多；"压缩知识"是在解决一个不存在的磁盘问题的同时摧毁了细粒度的搜索精度；一个生成的 markdown 页面是源文件的一个假身份副本——没人控制它、没人为它背书、它和原文冲突的时候系统无话可说。

三条批评合起来的判断是：LLM 没消除维护税，它把税从"人的时间"转移到了"模型的幻觉"。Karpathy 留了一扇门——raw/ 只读，LLM 只写 wiki/——但批评者指出，日子一长，查询的时候 LLM 读的是 wiki/ 不是 raw/，信任就从源头飘到了合成层上。

这个批评是成立的。但它不是推翻 Karpathy，它是把 Karpathy 没讲清的边界条件讲清楚了——LLM Wiki 能跑，前提是模型足够强、源文件足够干净、schema 足够严格、compaction 频率可控。这四个条件里有一个崩了，系统就从 Karpathy 描述的样子滑向 devnullbrain 描述的样子。

## 写这篇文章的过程本身就在吃自己的狗粮

得说一句稍微尴尬的事。

写这篇文章的这个 vault，它的 CLAUDE.md 规定了渐进式披露（主文件只写触发条件，完整决策框架放到 protocol-*.md 里按需读取）、memory/ 目录（LLM 维护的画像、项目状态、经验教训）、graph.json 索引（跨文件关联时走图遍历而不是 grep）。说白了，它就是 Karpathy 那条 gist 描述的 LLM Wiki，只是早在 gist 发出来之前就已经在跑。

这篇文章的所有素材——调研报告、写作风格规范、作者画像、历史事件时间线——都来自 vault 内部的 markdown 文件。调研素材是另一个 subagent 跑出来的一份 research-report.md，它在生成的时候读了 Bush 1945 原文、WIRED 1995 年的 Xanadu 报道、Karpathy 的 gist 原文、HN 评论区、Medium 上的批评文章，然后按这个 vault 的 schema（渐进披露+证据驱动判断+钩子开头）组织好。写作的这一步是另一个 agent 读这份报告+风格规范，产出这篇稿子。然后稿子会进 wiki/ 层，供未来的 agent 做 hot-history 类内容时继承。

这正好是 Karpathy 描述的回路——raw/ 存原始对话和 URL 抓取，wiki/ 存合成出来的知识页面，memory/ 存用户画像和项目状态，CLAUDE.md 是 schema，agent 按 schema 编译。这个 vault 在 2025 年中就已经这么跑了，只是当时没给它挂一个 80 年的名字。

所以这段话冷静地留在这里——这篇文章的作者在写"LLM 解决了谁维护"时，维护这篇文章 vault 的正是一个 LLM。调研被调研对象这件事没什么新鲜的，但被调研对象在调研过程中一句都没掉链子，这种 dogfood 本身就是 Karpathy 那个赌注的一次实盘回测。

## 对 AI 从业者意味着几件事

个人知识库产品的价值链条要重做。过去 Notion、Roam、Obsidian 卖的是"更好的编辑器+更好的链接"，接下来卖的是"更好的 schema+更好的合成层"——编辑器变成 commodity，schema 和 agent 才是壁垒。Agent 生态会分化出一个新品类——策展型 agent，它的工作不是回答问题，是维护一个知识系统不让它腐烂。而 trail blazer 这个 1945 年画的职业可能真的会冒出来：过去 80 年被 SEO 农场和博主接去，信噪比极低；Karpathy 这次就是一次复活，未来一年能在某个垂直领域持续产出高质量 LLM Wiki 的人，可能会被付费订阅。

## 一个 80 年的故事，又到了新的起点

把所有证据串起来，一个更精确的判断是：**LLM 没让 Memex 从"做不出"变成"做得出"，它让 Memex 的失败模式从"用户半路弃坑"变成"模型幻觉污染"**。

这是一次失败模式的转移，不是失败的消除。但关键是，前者 80 年没人愿意碰，后者 Karpathy 放出 gist 48 小时 5000 人在解。

Bush 1945 年写下 "a new relationship between thinking man and the sum of our knowledge" 时，他心里是一条"个人和全人类记录之间的私人管道"。Nelson 想用协议实现它，Engelbart 想用工具实现它，Berners-Lee 实现了但把"私人"丢了，Roam 和 Obsidian 找回了"私人"但没找回"管道"。

Karpathy 没解决所有问题。他只做了一件前面 80 年所有继承人都没做的事——把维护这一步从"用户意志"的不可规模化问题降维成"token 成本"的可预算问题。前者价格只有 0 用户愿意付，后者价格是每千 token 几美分，而且每年都在降。

所以 Memex 这一次是真的可以兑现了。但兑现的前提是——用户接受一条新税：不再花自己的时间维护，而是花模型的钱对抗模型的幻觉。剩下的事——谁来守住 schema，谁来验证合成层不飘——就是接下来 80 年的事了。

## 本期关键词

- **维护税（Maintenance Tax）**—— 所有个人知识管理系统对用户隐性收取的那笔账。过去 80 年税基是人力（你的时间和注意力），LLM Wiki 时代税基切换成了 token（可预算的 API 调用成本）。税基切换是 Memex 这次能兑现的真实拐点。
- **Memex** —— Bush 1945 年在《As We May Think》里造的词，字面"memory extender"，设想中的个人知识桌。后来 80 年被 Nelson、Engelbart、Berners-Lee 等人接力，Roam/Obsidian 最接近但卡在维护。
- **路径开拓者（Trail Blazer）**—— Bush 原文用词，指以"为公共知识库开辟有用路径"为职业的人。过去 80 年被 SEO 和博主接去、信噪比极低，Karpathy 这次 gist 让这个角色短暂复活。
- **虚拟引用（Transclusion）**—— Nelson 1965 年造的词，一段话只存一份原件、所有引用都是指向原件的活链接。Roam Research 2019 年才算真正做出来。
- **渐进式披露（Progressive Disclosure）**—— LLM Wiki 风格 schema 的核心设计：主文件只写触发条件和一句话规则，完整决策框架放到子文件里按需读取。作者的 vault CLAUDE.md 就是这个架构。
- **写入时合成 vs 查询时合成（Write-time vs Query-time Synthesis）**—— LLM Wiki 路线的核心分歧。Karpathy 走 write-time（摄入就编好 wiki/），foundanand 主张 query-time（摄入只提元数据，查询时回原文合成）。谁对谁错未定，但分歧本身说明维护税并没消失，只是换形式。
- **Schema 策展（Schema-based Curation）**—— 未来个人知识库产品的新壁垒。编辑器是 commodity，决定质量的是 schema 严不严、合成层会不会飘。

## 引用

- Bush, V. (1945). *As We May Think*. The Atlantic Monthly. [w3.org archive](https://www.w3.org/History/1945/vbush/vbush.shtml)
- Karpathy, A. (2026-04-04). *llm-wiki.md* gist. https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Wolf, G. (1995-06). *The Curse of Xanadu*. WIRED. https://www.wired.com/1995/06/xanadu/
- foundanand (2026-04). *The Hidden Flaw in Karpathy's LLM Wiki*. Medium.
- rohitg00. *LLM Wiki v2*. https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
- Hacker News 热帖 #47640875（296 points, 95 comments）+ Reddit r/LocalLLaMA、r/ObsidianMD 同步讨论
- Wikipedia 条目：Project Xanadu / HyperCard / NLS / FRESS / Dynabook
- Kay, A. (1972). *A Personal Computer for Children of All Ages*
- Tabrez Syed. *From Second Brain to Shared Brain*. BoxCars AI
- 量子位 / 智源社区 2026-04-04 中文同步报道
