---
title: Claude 把 computer-use 的工程说明书写出来了
source: https://claude.com/blog/best-practices-for-computer-and-browser-use-with-claude
author: Lucas Gonzalez & Luca Weihs (Anthropic)
date: 2026-05-13
type: decode
status: awaiting-evaluation
tags: [Anthropic, Claude, computer-use, browser-use, agent, engineering]
---

# Claude 把 computer-use 的工程说明书写出来了

2026 年 5 月 13 日，Anthropic 在 Claude Code 类目下发了一篇博客，作者 Lucas Gonzalez 和 Luca Weihs。题目朴素：Best Practices for Computer and Browser Use with Claude。读完之后会发现，这不是又一篇能力宣传——这是 computer-use 第一次有了说明书。

过去十八个月，Anthropic 谈 computer-use 的语气一直是 "early preview"。3.5 Sonnet 那次发布也只是承认"compared to Claude's ability to code or interact with text, computer use is still early"。但这一次，文章里没有再讲 demo 视频，没有再讲愿景，全篇都是工程师做坏过的事：分辨率多少最稳、坐标怎么换算、截图为什么不能放到 prompt 前面、为什么把图切成小 tile 没用、为什么在图上画网格也没用、什么时候用 Sonnet 什么时候用 Opus、thinking effort 拨到哪一档。

这个语气切换值得拆开看。

![Claude computer-use 进入工程化阶段](assets/png/00_cover.png)

## 从能力发布到工程文档

普通的能力发布想让客户记住一个名字。computer-use 这个名字从 2024 年起就存在。问题不是没人听过，是没人知道怎么用稳。

行业里的真实状态：很多团队试过让 Claude 操作浏览器或桌面，跑通一个 5 步 demo 没问题，跑到第 30 步开始崩——点错按钮、看不见小图标、token 烧光、context 满了之后忘掉用户最早的指令。Anthropic 自己也清楚这点，所以这篇文章的结构不再是 "what it can do"，而是按问题发生顺序排：先讲怎么准备截图，再讲怎么诊断点击失败，最后讲怎么管理一个长跑 agent 的 context。

11 个 section 覆盖的全是踩过的坑：Resolution and Scaling、Coordinate Scaling、Content Ordering、Diagnosing Click Issues、Model Selection、Handling Small Targets、Tuning Thinking Effort、Prompt Injection Classifiers、Context Management、Experimental Settings、Teaching Claude。这种排列方式只有"已经替客户踩过几百次坑"的厂商写得出来。

从 Anthropic 公司动作看，这个时间点也对。Boris 几周前刚发过 Claude Code 的隐藏功能拆解，那是给开发者群体的工程文。这一篇是给 agent 群体的工程文。两篇风格高度一致：不端架子、给具体数字、明说什么没用。Anthropic 正在系统地把过去两年的能力发布回填成可复用的工程文档。

![从 demo 视频到工程清单](assets/png/01_demo_to_manual.png)

## 四件套：分辨率、token 预算、context、prompt 模板

这篇 best practice 真正密度高的部分，是四组具体到像素级的工程建议。

第一件套是分辨率和像素预算。Anthropic 给了两个硬数字：Claude 4.6 系列 API 上传图片最长边 1568 像素，总像素 1.15 megapixel（约 115 万）；Opus 4.7 系列上限是 2576 像素长边，3.75 megapixel（约 375 万）。这两个数字之前散落在 API 文档里，没人专门讲过为什么。这次给了推荐值：4.6 系列默认 1280×720，是个 80% 像素预算的安全值；Opus 4.7 可以推到 1080p。

更有用的是 Anthropic 直接说了几件"看起来对、其实错"的做法。直接把原生分辨率截图扔进 API，会被服务端隐式降采样，模型拿到的不是你期望的图。低于 960×540 又会丢小图标信息。4.6 系列上 1920×1080 会超出 1.15 megapixel 预算被降。原生 4K 不降采样不仅烧 token，模型精度反而更差。

这套指导里夹了一个被忽视的工程信号：UI 看图任务受 patch 切分粒度的影响，不是分辨率越高越准。这一点是模型架构性事实，不是经验调参。

![四件套构成第一版工程实践](assets/png/02_four_pillars.png)

第二件套是 content array 的顺序。Anthropic 明确写：text instruction 必须出现在 image 之前。这种细节平时不会有人讲，因为开发者直觉上把 text 和 image 顺序当作无关紧要。但 transformer 看 prompt 是顺序敏感的——把指令放在图之前，模型先建立任务上下文再"看"画面；反过来，先看完图再读到指令，等于做完一遍 unguided perception 才知道要找什么。给的另一条：`display_width_px` / `display_height_px` 必须精确匹配 resized 之后的尺寸，不是 native 尺寸。这个字段错了，模型返回的坐标会乘错系数，产生整体偏移。坐标缩放的官方公式是 `screen_x = int(api_returned_x * (screen_w / display_w))`——一句不能省。

第三件套是 context 管理。这部分密度最高。Anthropic 给了三层结构：四个 cache 断点（system prompt 一个、尾部 tool result 三个），rolling buffer 只保留最近三张截图（默认 keep_n=3、interval=25），接近 token 上限时（约 150k）触发 LLM-based compaction 把旧轨迹总结成结构化摘要。

这个三层结构是被反复打磨过的。一个长跑 computer-use agent 容易掉进两个坑：要么把每一帧截图都留着，30 步以后 context 爆炸；要么只留最新一张，模型忘掉两步前点错了什么。Rolling buffer 解决第一个，compaction 解决第二个，cache 断点解决重复 prefill 的成本。

第四件套是 compaction 模板。Anthropic 公开了八段 prompt 结构：User Instructions（逐字保留）、Task Template、Constraints and Rules、Actions Taken、Errors and Fixes、Progress Tracking、Current State、Next Step。这八段不是任意的，是从大量真实 agent 失败 case 里反推出来的——每一段对应一类常见错误。"User Instructions 逐字保留"防止 agent 跑久了忘记用户初衷；"Errors and Fixes"防止重复犯同一个错；"Current State + Next Step"分开写防止 agent 在 next step 里掺进对当前状态的判断。

把这四件套放一起看：分辨率管输入质量，content 顺序管模型注意力，context 管长跑稳定性，compaction 模板管记忆结构。任意一个写错，agent 都会在某一步崩。Anthropic 这次把四个变量都钉死，等于告诉企业：照这套配置走，你不会再卡在"为什么我的 agent 跑到第 50 步就乱了"。

## Anthropic 主动公布失败实验

文章里有一段藏得很深，价值最高。Anthropic 说他们试过几个直觉上"应该有用"的方法，结果没用：把截图切成小 tile 单独送给模型——no consistent uplift；在截图上叠坐标网格让模型"看着坐标系作答"——no reliable gains；换 resize 算法（PIL LANCZOS 和 sips）——identical results。

这种"我们试了，没用"的披露，在 AI 厂商的官方文档里很少见。大多数厂商只讲什么管用，不讲什么不管用——因为讲了显得自家模型有边界。Anthropic 选择讲，原因不是慷慨，是想止住生态里的重复实验。每个搞 agent 的团队都会自己试这些方法，浪费几周时间。一次性把负面结论说清楚，等于把整个生态的注意力从死胡同拉出来，放到真正有杠杆的地方——比如 context 管理和 compaction 模板。

模型选型这段也是同样的实用主义。Sonnet 4.6 在 click 任务上比 Opus 4.6 更精准；Opus 4.7 把这个差距补上，跟 Sonnet 4.6 "roughly on par"。所以官方建议：先从 Sonnet 4.6 起步，性价比最高，要更高 reasoning 能力再升 Opus 4.7。这种"贵的不一定好"的话，自家产品矩阵里说出来需要克制。

Thinking effort 这一节再次体现这种克制。原文给的判断："UI tasks are primarily perceptual rather than deeply logical"——UI 任务主要是感知问题，不是深度推理问题。所以 4.6 系列推荐 medium 而不是 high："close to the highest task success rate while using roughly half the output tokens of high"。4.6 系列上 max 档"no accuracy benefit over high"。一句"don't use max"省下不知道多少冤枉钱。

这套披露的工程意义大于商业意义。它告诉企业：computer-use 的瓶颈不是模型不够大，是工程链路没接对。

![Anthropic 公开自己试过没用的方法](assets/png/03_tried_didnt_work.png)

## 盲区：我们不知道的

这套工程文很强，但 Anthropic 没说的事一样要点出来。

文章全篇没有一个 task success rate 数字。一个长跑 agent 在 OSWorld、WebArena 这类公开 benchmark 上跑到多少分？跑 100 步崩盘率多少？文章绕开了。这个数字 Anthropic 内部一定有，公开不出来的原因可能是横向比较不利，可能是不同任务方差大没法给一个代表性数。但对企业决策者来说，这意味着 SLA 仍然要自己测。

文章也没有跟竞品的横向对比。OpenAI 的 Operator、Google 的 Project Mariner、Browserbase 的 Stagehand，在 2026 年都是 computer-use 赛道里的存在。Anthropic 这篇通篇只讲自家模型怎么配，不讲为什么选 Claude 不选别家。这是文章的局限，也是选题的实诚——它就是写给已经决定用 Claude 的人看的操作手册。

Hallucinated click 的发生率没说。这是 computer-use 最大的工程问题之一：模型看着一个按钮，给出一个坐标，落点却在按钮旁边几十像素。文章给了缓解策略（更高分辨率、handling small targets 章节），但没给基础发生率，意味着团队仍然要在真实 UI 上自测。

Prompt injection 防护这一段，Anthropic 说 `computer_20251124` tool type 内置分类器、"approximately zero additional latency and no additional cost"——这是好事。但漏报率（让攻击渗透的比例）和误报率（把正常网页拦下来的比例）都没披露。在金融、医疗等高风险场景，这两个数比"延迟为零"重要得多。

最后一个盲区更结构性：这篇文章把 computer-use 当成"已经稳定到可以工程化"的能力。但 Anthropic 2026 年 3 月还在 SiliconANGLE 上承认 computer-use 是 preview。preview 状态下没有 SLA，企业生产部署的风险敞口仍在客户侧。"可工程化使用"这个判断，更准确的说法是"Anthropic 给了工程化的脚手架"——真正的生产稳定性，还要客户自己测出来。

## 对从业者意味着什么

对 PM：本周回去 review 你现在的 agent 项目，问自己 context 管理这一层做了没。如果 agent 跑 30 步以上还稳定，多半已经有了类似 Anthropic 这套三层结构；如果跑 10 步就忘指令，照八段 compaction 模板加进去，下周看效果。

对架构师：本周拿一份现有的 computer-use 接入代码，对照原文检查三件事。一是 content array 里 text 是不是在 image 之前；二是 `display_width_px` / `display_height_px` 是不是匹配 resized 之后的尺寸；三是有没有人在用 native 4K 截图直送 API。这三处任何一处错了，agent 精度问题就不是模型问题。

对 CTO：本周和团队复盘一次：computer-use agent 项目的成本结构里，"模型选型"和"context 管理"哪一项更主导。Anthropic 给的信号是后者——大多数预算浪费在重复 prefill、过长 context、错档 thinking effort。如果团队还在为 Opus 比 Sonnet 贵纠结，这个判断顺序就反了。

对 agent 工程师：本周读一遍原文 Context Management 这一节，把八段 compaction 模板和 keep_n / interval 的默认值落到代码里。再翻一遍自己项目最近一次的失败 trace，看错在哪一段——多半在 Errors and Fixes 或 Current State 这两段没建好。

对企业解决方案团队：computer-use 进入"可工程化使用"阶段，意味着传统 RPA 替代窗口正在打开。但这个窗口的入场券不是"会调 Claude API"，是"会把 Claude 接成稳定 agent"。本周可以把这篇 best practice 翻译并打印发给团队，作为内部 agent 工程基线文档。

## 本期关键词

- **可工程化阶段**：一项 AI 能力从"能 demo"过渡到"能写工程文档"的标志。看的是厂商自己有没有沉淀出可复用的配置、模板和反例。computer-use 在 2024 年发布时还停留在能力宣传阶段；2026 年 5 月这篇博客是它进入可工程化阶段的明确标志。能力没变多少，可信度变了。

- **像素预算**：API 端对单张图片设置的总像素上限。Claude 4.6 系列是 115 万像素，Opus 4.7 是 375 万像素。超出预算服务端会隐式降采样，导致开发者本地看到的图和模型实际读到的图不一致。像素预算是 computer-use 工程链路里最容易踩、也最难自查的一环。

- **rolling buffer**：长跑 agent 的截图记忆窗口。只保留最近 N 张截图（Anthropic 默认 N=3），更老的截图按 interval 批量删除。它不是节省 token 的优化，是防止 context 被噪声淹没的结构性手段。

- **LLM-based compaction**：当 context 接近上限时，调用一个轻量模型把历史轨迹压缩成结构化摘要的过程。Anthropic 公开的八段模板（User Instructions、Task Template、Constraints、Actions Taken、Errors and Fixes、Progress、Current State、Next Step）不是任意分类，是从大量失败 case 反推出来的最小记忆单元。

- **perceptual not logical**：Anthropic 对 UI 任务本质的判断——主要是感知问题，不是推理问题。这个判断决定了 thinking effort 不该拉满、4.6 系列推荐 medium 而不是 high。它颠覆了"模型越多想越准"的直觉。

- **content ordering**：content array 里 text 和 image 的顺序问题。text 必须在 image 之前，让模型先建立任务上下文再"看"。这条规则在普通 vision 调用里几乎没人提，因为影响小；在 computer-use 这种连续看图任务里影响显著。

- **失败披露**：厂商主动公开"我们试过、不管用"的方法。Anthropic 这次披露了 tile 切分、坐标网格、resize 算法三件没用的事。它的价值不在告诉你别做什么，而在让生态停止重复浪费同一段时间。

## 引用

1. [Best Practices for Computer and Browser Use with Claude](https://claude.com/blog/best-practices-for-computer-and-browser-use-with-claude) — Anthropic 官博，2026-05-13
2. [Computer use tool — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) — 官方 API 文档
3. [Claude Computer Use in 2026: API Tool vs Cowork vs Claude Code](https://blog.laozhang.ai/en/posts/claude-computer-use) — 三种调用形态对照
4. [Anthropic's Claude gets computer use capabilities in preview](https://siliconangle.com/2026/03/23/anthropics-claude-gets-computer-use-capabilities-preview/) — 2026 年 3 月仍标 preview 的二手证据
5. [Introducing computer use, a new Claude 3.5 Sonnet, and Claude 3.5 Haiku](https://www.anthropic.com/news/3-5-models-and-computer-use) — 2024 年首发能力公告，对照本次工程文转向
