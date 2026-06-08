# 设计这件事，正在被切成三段

4 月 17 日，Anthropic 发布 Claude Design。4 月 21 日，OpenAI 把图像生成升级成会思考的 gpt-image-2。中间那天，Anthropic 的 CPO 辞掉了 Figma 的董事席位。五天，三个动作，一个共同指向——设计这件事，正在从工具端被往意图端推了一格。

不是"AI 取代设计师"这种老生常谈。是**一个职业的中段工作正在被自动化**，而前段和后段变得比以前更值钱。这个变化的细节，值得放慢节奏看一眼。

## 一、两件事看起来不同，合起来讲的是同一件事

先把事实摆齐。

Claude Design 的产出不是图，是**代码**。给它一个 prompt，它吐出来的是可以直接跑的 HTML、CSS、React 组件，还带交互、带 shader、带视频，甚至能把团队现有的 codebase 读一遍自己总结出设计系统（颜色、字体、组件库），然后后续所有项目自动沿用。最后一步更关键：设计稿做好了，它可以打包成一个"implementation bundle"——组件代码、设计 tokens、文案、交互说明——一键扔给 Claude Code 直接写成产品。

gpt-image-2 做的事看起来完全不同。它还是在画图，但画图方式变了。旧模型拿到 prompt 就开始渲染，新模型先"读"——读 prompt、规划构图、推理空间关系、必要时上网查实时上下文、多图批处理时保持人物和物体一致、最后还自己校验一遍输出。OpenAI 给它起的名字叫"视觉思考伙伴"（visual thought partner），把这套能力压进一个付费层级叫 Thinking Mode。

两家做的事，一个在出代码、一个在出像素，表面看各走各的。但如果站远一步看：

Claude Design 把设计师"把意图变成代码"这段活自动化了。gpt-image-2 把"把意图变成视觉"这段活智能化了。两家不约而同切入的都是**设计师的中段工作**——不是前面的"这个该不该做"，也不是后面的"这个成品品牌一致吗"，而是中间那段"把已经想好的东西做出来"。

这层分工变化，用一个词概括就是：**设计三段分层**。判断段（这值得做吗、给谁用、解决什么问题），执行段（把想法变成具体设计），收尾段（把 AI 或人做出来的东西拧成一个品牌下的一致产物）。AI 这一刀，砍得很准，落在执行段。

## 二、市场用真金白银给了回答

概念讲完了。接下来看资本市场怎么想。

Claude Design 发布当天，Figma 股价跌了 7%。YTD（年初至今）累计跌约 35%。说 Figma 是 AI 工具里最惨的受害者不过分——它几乎是第一个被直接攻击工作流的独立设计工具公司。

比股价更说明问题的是人事动作。发布前一天，4 月 16 日，Anthropic 的 CPO Mike Krieger 辞去了 Figma 董事席位。时间点太精确——一个能在两家公司之间看到全部牌的人，在动手前一天先把自己从其中一家的董事会里抽出来。这不是巧合，是**利益冲突管理**。资本市场读到的信号是：这次不是小打小闹。

有意思的是 Canva 的选择。Canva 的 CEO Melanie Perkins 在 Claude Design 的发布声明里亲自站台，给出的说法是："We're excited to build on our collaboration with Claude, making it seamless for people to bring ideas and drafts from Claude Design into Canva"——把 Canva 定位成 Claude Design 的输出终点、而不是对手。这是一个典型的生态选择：在还来得及的时候选边站。Figma 当天没有对 Gizmodo 的问询作出回应。一个选择拥抱，一个选择沉默，两种姿态都在告诉行业这事不小。

再把视野拉大一点。Google 在 2025 年收购了 Galileo AI，改名 Google Stitch，3 月 19 日刚更新了多屏生成、无限画布、交互原型。赛道已经挤满了。Deloitte Digital 2025 年的数据显示，**59% 的科技创业公司已经在用 AI UI/UX 工具做原型**。Claude Design 不是去开垦荒地，是去一个已经成熟的市场里做头部压制。

## 三、会思考的像素，是一条被低估的路径

回到 gpt-image-2。图像生成这条路上，reasoning 被嵌入生成流程，这个变化的分量容易被低估。

以前的图像模型是渲染器：理解 prompt → 生成像素。一对一。prompt 写得不精确、排版逻辑复杂一点、要求文字清晰，输出就崩。新模型把这个链条改成了：读 prompt → 规划 layout → 推理空间关系 → 渲染像素 → 自己校验一遍。gpt-image-2 声称多语言文字渲染准确率 99%，一次最多可以出 10 张图，其中最多 8 张能保持人物和物体的一致性，单图最高 2000px 宽。把这些数字合起来解释：**它已经能独立完成一个"画完再修一遍"的循环**，不需要人坐在旁边反复调 prompt。

这里值得给一个命名：**意图到像素的短链路**。以前这条路要经过"设计师翻译 prompt → 工具渲染 → 人肉检查 → 重写 prompt"四到五次往返。现在模型内部自己完成一次完整循环。外面的人只需要给一个意图，等结果。

意图到像素的短链路，对谁最受益？答案不是设计师，是**手上没设计师的产品人、PM、founder**——他们以前是"做不出来所以干脆不做"的那群人，现在这条路通了。

## 四、设计师自己怎么说

一位设计师在 Medium 上发了一篇文章，标题是《What Claude Design actually changes for designers》。她的判断比 Anthropic 的 PR 稿要冷静。

她承认工作流变了，而且是实质的变化——以前一个 idea 到一个上线功能要走一套冗长的交接流程，brief、mockup、评审、对齐、交付；Claude Design 把这段压成一次对话。她引用了 Datadog 的实际反馈："tasks going from a week of back-and-forth to a single conversation"，把一个星期的拉锯压缩进一次对话。Brilliant 的设计师给的数字是："20+ prompts in competing tools → 2 prompts in Claude Design"。这些数字摆出来很漂亮，但她紧接着抛了一句刹车：

> "Pipelines optimize for throughput, and design isn't always a throughput problem."

流水线优化吞吐量，但设计不总是一个吞吐量问题。这句话是全文的核心判断。她接着说：被压缩掉的那些"两像素反复调整、跟自己争论"的时间，不是效率损失，是**创意摩擦**——它本身在做事，只是肉眼看不见在做什么事。

她对 Claude Code 做了一个更有意思的观察：没有结构化规划时，Claude Code 一次性成功的概率只有大约 33%；给它足够的空间先写规范、讨论方案、推演边界，成功率大幅提升。她的结论是：**Claude Code 最大的强项不是速度，是规划深度**。这个观察反过来证明了前面那条判断——判断段不能被压缩，能被压缩的只是执行段。

她列了一个明确的"不会被替代"清单：品味、判断、原则、对人类心理的理解、对商业战略的理解。这份清单有意思的地方在于，它恰好**全部落在判断段和收尾段**，没有一项落在执行段。换句话说，她完全同意"中段会被吃掉"，只是在提醒："别把前后两段也一起交出去"。

## 五、两个"不会被说破"的盲区

Anthropic 和 OpenAI 的官方措辞里，有两个细节值得放大。

第一个是 Anthropic 官方关于 Claude Design 的定位原话："intended to complement Canva rather than replace it"。只字不提 Figma。但市场不会说假话——7% 的跌幅、35% 的 YTD、CPO 的董事席位辞职时机，所有信号都指向同一件事。官方措辞是外交辞令，读者如果只看措辞会漏掉事实。

第二个是 gpt-image-2 的访问分层。Instant Mode 免费，Thinking Mode 付费。这个分层设计意味着 **"会思考"这个能力被明码标价了**。图像生成从过去的"免费 + 限量"分层，变成现在的"快 vs 深思"分层。付费买的不是更多次数，是更深的推理。这个定价结构说明 OpenAI 认为 reasoning 本身是可以单独出售的商品。这在图像生成领域是第一次。

还有一个无法忽视的事实：两款产品目前都处于 Research Preview 状态。产品没准备好到可以大规模稳定使用，边界场景会翻车，产出一致性在某些场景下还没保证。这条真话官方不会明着说，但"Research Preview"这个标签本身就是在说。

## 六、三个不同身份读到的东西不一样

这一节把前面的分析落回到具体工作场景。

**对 PM 来说**：这是第一次，你可以不跪求设计师就能完成 pitch 稿、产品提案图、早期原型 demo。Claude Design 做前端可交互原型，gpt-image-2 做视觉资产和营销配图。内部评审、融资 pitch、跨部门沟通这些场景，产出质量已经够用。但要注意：Research Preview 状态下，产品细节、品牌一致性、交互边界都不稳定，做到 demo 可以，做到 production 还得找人。这是一个**"demo 可以自理，产品需要配合"**的状态。

**对设计师来说**：中段工作被压缩是事实，这不是行业焦虑话术，是已经发生的产品现实。但这不是终点——护城河从"做得出来"转移到了"判断该做什么"（前段）和"把 AI 产出拧成品牌一致的东西"（后段）。前段需要的是产品直觉、用户理解、商业感；后段需要的是视觉判断、品牌一致性、细节把控。两段都不是可以被下一代模型继续压缩的东西。学 prompt engineering、跑一遍 Claude Design 到 Claude Code 的 handoff 流水线，这些是把 AI 装进自己工具箱的操作——不是自贬，是升级。

**对 founder 和小团队来说**：融资前、MVP 阶段、demo 阶段，不雇设计师是可行的路径。省下的是前期现金，但要意识到这是一个**时间窗口**，不是永久状态。产品一旦需要规模化、需要品牌资产、需要跨平台一致性，设计师回到必要位置上。把 AI 当作时间窗口的工具，而不是永久的解决方案。

## 七、结构在变，但结构还在

把前面的分析合起来看：

设计师这个职业不会消失。设计师做的事情会被切成三段——判断段、执行段、收尾段。AI 能吃掉的是执行段，不是整个职业。Figma 这类中间态工具会被压缩，Canva 这类生活化工具选择融入生态，Claude 和 OpenAI 这类模型公司直接把 endpoint 打到创意工作流的入口和出口。工具层在重新分区，职业内部的价值重心也在迁移。

Fanny 在她的文章结尾写了一句话："You still need taste, judgment, and principles. You need people who understand human psychology and business strategy." 翻译成中文就是：你仍然需要品味、判断、原则，以及理解人类心理和商业战略的人。这句话看起来像是对设计师的安慰，但它其实是在描述**设计这个职业 2026 年之后的新分工**。

五天里发生的这些事，不是设计师的墓志铭，是设计这件事第一次被正式拆开看——拆开了才知道哪一段可以交给机器，哪一段还得自己来。知道这个，比焦虑谁会被替代要有用得多。

---

## 本期关键词

**设计三段分层（Three-Layer Design Work）** —— 判断段（这值得做吗）、执行段（怎么做出来）、收尾段（怎么做对）。AI 当前切入的是执行段，前段和后段仍是人的领地。

**意图到像素的短链路（Intent-to-Pixel Shortcut）** —— gpt-image-2 把"意图 → 设计思考 → 渲染 → 校验"这条原本需要人工多次往返的链条压进模型内部，一次完成。

**Implementation Bundle（实现交接包）** —— Claude Design 的核心输出形态。不是设计稿，是可以直接塞给 Claude Code 落地的组件代码+设计 tokens+文案+交互说明的完整打包。

**创意摩擦（Creative Friction）** —— 设计师反复调整两个像素、跟自己的方案争论的那段时间。从流水线角度看是浪费，从成品质量角度看是价值所在。

**Research Preview（研究预览态）** —— 两家公司给新产品的共同标签。产品的能力天花板足够高可以发布，但边界场景、稳定性、产出一致性还没保证到可以大规模生产环境使用。

**Thinking Mode（思考模式）** —— OpenAI 把 reasoning 能力作为单独付费层级。这是图像生成领域第一次把"会思考"本身作为商品定价。

**Visual Thought Partner（视觉思考伙伴）** —— OpenAI 给 gpt-image-2 的定位。从"渲染工具"升级为"在图像维度上进行规划和推理的伙伴"。

## 原文关键引用

> "Pipelines optimize for throughput, and design isn't always a throughput problem." —— Fanny, Design Bootcamp

> "You still need taste, judgment, and principles. You need people who understand human psychology and business strategy." —— Fanny, Design Bootcamp

> "Claude Design gives designers room to explore widely and everyone else a way to produce visual work." —— Anthropic 官方

> "We're excited to build on our collaboration with Claude, making it seamless for people to bring ideas and drafts from Claude Design into Canva." —— Melanie Perkins, Canva CEO

## 引用

1. [Introducing Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs) —— Anthropic 官方发布稿
2. [Introducing ChatGPT Images 2.0](https://openai.com/index/introducing-chatgpt-images-2-0/) —— OpenAI 官方发布稿
3. [OpenAI's new image model reasons before it draws](https://thenextweb.com/news/openai-chatgpt-images-2-0-reasoning-image-generation) —— TheNextWeb 技术解读
4. [What Claude Design actually changes for designers](https://medium.com/design-bootcamp/what-claude-design-actually-changes-for-designers-0c5b04fae343) —— Fanny @ Design Bootcamp
5. [Anthropic Launches Claude Design, Figma Stock Immediately Nosedives](https://gizmodo.com/anthropic-launches-claude-design-figma-stock-immediately-nosedives-2000748071) —— Gizmodo 市场反应
6. [Anthropic launches Claude Design, a new product for creating quick visuals](https://techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals/) —— TechCrunch
