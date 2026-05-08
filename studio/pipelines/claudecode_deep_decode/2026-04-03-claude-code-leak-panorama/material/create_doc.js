/**
 * Claude Code 源码泄露全景 — Word + Markdown 文档生成
 * 运行：NODE_PATH=/tmp/node_modules node material/create_doc.js "【AI笔记0406】1902个文件里藏了什么"
 */

const docx = require("docx");
const fs = require("fs");
const path = require("path");

const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle,
  ImageRun, ShadingType, convertInchesToTwip,
} = docx;

const PNGS_DIR = path.join(__dirname, "pngs");

const C = {
  title:   "1A1A1A",
  accent:  "C47B2B",
  body:    "333333",
  light:   "666666",
  quote:   "5D4E37",
  quoteBg: "FFF5E1",
  border:  "E8D5B5",
  hi:      "D2691E",
  white:   "FFFFFF",
  coverBg: "FFF9EE",
};

const F = { cn: "Heiti SC", en: "Georgia", mono: "Menlo", body: "Songti SC" };
const mdLines = [];

const h1 = (t) => {
  mdLines.push(`\n## ${t}\n`);
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: t, font: F.cn, size: 36, bold: true, color: C.title })],
  });
};

const h2 = (t) => {
  mdLines.push(`\n### ${t}\n`);
  return new Paragraph({
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } },
    children: [new TextRun({ text: t, font: F.cn, size: 28, bold: true, color: C.accent })],
  });
};

const p = (t) => {
  mdLines.push(`${t}\n`);
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 360 },
    children: [new TextRun({ text: t, font: F.body, size: 21, color: C.body })],
  });
};

const pb = (a, b, c = "") => {
  mdLines.push(`${a}**${b}**${c}\n`);
  const ch = [
    new TextRun({ text: a, font: F.body, size: 21, color: C.body }),
    new TextRun({ text: b, font: F.body, size: 21, bold: true, color: C.hi }),
  ];
  if (c) ch.push(new TextRun({ text: c, font: F.body, size: 21, color: C.body }));
  return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: ch });
};

const li = (t) => {
  mdLines.push(`- ${t}`);
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 340 },
    indent: { left: convertInchesToTwip(0.3) },
    children: [
      new TextRun({ text: "•  ", font: F.body, size: 21, color: C.accent }),
      new TextRun({ text: t, font: F.body, size: 21, color: C.body }),
    ],
  });
};

const q = (t) => {
  mdLines.push(`\n> *${t}*`);
  return new Paragraph({
    spacing: { before: 120, after: 0, line: 340 },
    indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    children: [new TextRun({ text: t, font: F.en, size: 20, italics: true, color: C.quote })],
  });
};

const qt = (t) => {
  mdLines.push(`> ${t}\n`);
  return new Paragraph({
    spacing: { before: 0, after: 120, line: 340 },
    indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    children: [
      new TextRun({ text: "-- ", font: F.body, size: 19, color: C.light }),
      new TextRun({ text: t, font: F.body, size: 19, color: C.quote }),
    ],
  });
};

const div = () => {
  mdLines.push("\n---\n");
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "•  •  •", font: F.en, size: 20, color: C.border })],
  });
};

const sp = () => {
  mdLines.push("");
  return new Paragraph({ spacing: { before: 40, after: 40 }, children: [] });
};

const img = (name, svgHeight = 500) => {
  mdLines.push(`\n![${name}](material/pngs/${name}.png)\n`);
  const pngPath = path.join(PNGS_DIR, `${name}.png`);
  if (!fs.existsSync(pngPath)) {
    console.warn(`[警告] PNG 不存在，跳过：${pngPath}`);
    return sp();
  }
  const buf = fs.readFileSync(pngPath);
  const w = convertInchesToTwip(5.8);
  const h = convertInchesToTwip(5.8 * svgHeight / 800);
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } })],
  });
};

const PAGE_MARGIN = {
  top: convertInchesToTwip(1),
  bottom: convertInchesToTwip(0.8),
  left: convertInchesToTwip(1.1),
  right: convertInchesToTwip(1.1),
};

const COVER_META = {
  titleEn:    "What's Hidden in 1,902 Files",
  subtitleEn: "Claude Code Source Leak Panorama",
  titleCn:    "1902个文件里藏了什么：Claude Code 源码泄露全景",
  author:     "多信源交叉验证",
  source:     "2026-03-31 泄露 · 2026-04-06 拆解",
  editor:     "整理：AI Force",
  series:     "Claude Code 源码拆解系列 01/34",
  coverImg:   "00_系列封面",
  coverImgH:  1131,
  originalUrl: "https://cybernews.com/security/anthropic-claude-code-source-leak/",
};

mdLines.push(`# ${COVER_META.titleCn}`);
mdLines.push(`\n> ${COVER_META.subtitleEn}  `);
mdLines.push(`> ${COVER_META.titleCn}  `);
mdLines.push(`> ${COVER_META.author} · ${COVER_META.source}  `);
mdLines.push(`> ${COVER_META.series}  `);
mdLines.push(`> ${COVER_META.editor}  `);
mdLines.push(`> 原文：${COVER_META.originalUrl}\n`);
mdLines.push("---\n");

const coverChildren = [
  (() => {
    const pngPath = path.join(PNGS_DIR, `${COVER_META.coverImg}.png`);
    if (!fs.existsSync(pngPath)) return new Paragraph({ children: [] });
    const buf = fs.readFileSync(pngPath);
    const w = convertInchesToTwip(5.8);
    const h = convertInchesToTwip(5.8 * COVER_META.coverImgH / 800);
    return new Paragraph({
      spacing: { before: 200, after: 80 },
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } })],
    });
  })(),
  new Paragraph({
    spacing: { before: 0, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: `${COVER_META.series}  ·  ${COVER_META.editor}`, font: F.body, size: 17, color: C.light }),
    ],
  }),
];

// ============================================================
//  正文内容
// ============================================================

const bodyChildren = [

  // ====== 开篇 ======
  h2("开篇"),

  p("59.8 MB。这是一个 source map 文件的大小。"),

  p("2026 年 3 月 31 日，Solayer Labs 研究员 Chaofan Shou 在 npm 包 @anthropic-ai/claude-code 的 v2.1.88 中发现了这个异常文件。解压后是 1,902 个 TypeScript 源码文件，512,000 行代码——Anthropic 最赚钱的产品之一，Claude Code 的完整实现，就这么躺在了全世界每一个开发者的 node_modules 里。"),

  p("GitHub 镜像仓库在 48 小时内拿到了 30,000 颗星、40,200 次 fork（CyberNews 数据）。Anthropic 官方回应只有两个词：「human error」（The Guardian 报道）。"),

  p("但这不是一篇关于"某公司出了安全事故"的文章。事故本身只是一扇窗。透过这 1,902 个文件，能看到的是：当今最复杂的 AI 编程助手到底长什么样，以及——它的竞争力到底在哪里。"),

  div(),

  // ====== 01 同一个坑 ======
  h1("01  同一个坑，摔了两次"),

  p("先说让人不舒服的部分。"),

  p("这不是 Anthropic 第一次因为 source map 泄露源码。2025 年 2 月，v0.2.8 版本就出过一次——当时的代码量小得多，base64 反混淆后能看到的信息有限，行业没当回事。"),

  pb("16 个月后，同一类错误以更大规模重演。dev.to 作者 Varshith Hegde 在复盘文章中提到了一个关键细节：", "Anthropic 收购了 Bun（Claude Code 的 JavaScript runtime），而 Bun 的 source map 生成 bug 在事发 20 天前就被社区报告了，但没有修复。"),

  img("06_泄露时间线", 500),

  pb("这暴露了什么？不是某个工程师的疏忽——这种说法太轻了。数据表明这是 ", "CI/CD 流水线的系统性缺陷", "：从代码构建到 npm 发布的链路上，没有一个环节检测到一个 59.8MB 的异常文件混进了分发包。"),

  p("Varshith Hegde 还提出了一个更尖锐的问题：事发日是 3 月 31 日，愚人节前夜；源码中发现的 Buddy 宠物系统原定 4 月 1-7 日上线。真的是意外？还是一次精心设计的 PR 事件？"),

  pb("Anthropic 不太可能故意泄露自己的安全架构细节和未发布功能。但这个质疑之所以值得记录，是因为它指向了一个更深层的问题：", "当一家以安全著称的公司连续犯同类错误，行业对它的信任评估需要重新校准。"),

  div(),

  // ====== 02 六层自研 ======
  h1("02  六层自研：不是「模型加壳」"),

  p("拆开这 512,000 行代码，第一个感受是：这不是大多数人想象中的"聊天机器人加个终端壳"。"),

  p("Engineer's Codex 的分析最直观——整个代码库按功能分为 7 大类、40 个工具模块、184 个文件，仅工具系统就有约 50,800 行代码（Randal Olson 统计）。而这只是冰山水面上的部分。"),

  img("01_六层架构", 500),

  p("从底层到顶层，整套系统可以归纳为六层架构："),

  pb("L1 运行时层。", "Bun 作为 JavaScript runtime，", "负责启动和底层 I/O。这是 Anthropic 收购 Bun 后的直接产物——自己控制运行时，不受 Node.js 生态的节奏约束。"),

  pb("L2 核心引擎层。", "QueryEngine 是整个系统的大脑中枢，", "仅这一个模块就有 13,000 行代码，负责对话编排、Prompt 组装、工具调度、上下文压缩（Snip 机制）和 Token 追踪。PromptLayer 的技术分析用"master agent loop"来描述这个引擎——单线程循环，不用 Swarm 多 Agent 架构，所有决策在一个循环里完成。"),

  p("这个设计选择值得停下来说一下。行业里有一股明显的趋势是用多 Agent 编排（如 AutoGen、CrewAI）来处理复杂任务。但 Claude Code 选择了相反的路：单线程、单循环、所有工具平等接入。这意味着它赌的是单个模型足够强，不需要多个弱模型协调。从当前 Opus 的能力来看，这个赌注是成立的——但它也意味着这套架构对模型能力有硬性下限要求。"),

  pb("L3 工具层。", "45 个内置工具，每个工具都是一等公民", "——有独立的描述、参数 schema、权限声明。Randal Olson 把它们分成 7 类：File IO、Shell、Web、Multi-Agent、Planning、MCP/Skills、Internal。值得注意的是 MCP（Model Context Protocol）的接入——这意味着 Claude Code 的工具系统不是封闭的，任何人可以通过 MCP 协议扩展它的能力边界。"),

  p("L4 安全层。下一章单独说，这是整个系统最值得深挖的部分。"),

  pb("L5 记忆层。", "四分类记忆系统（user/feedback/project/reference），", "加上 Snip 压缩机制处理长对话的上下文衰减。LMCache 的分析提到了一个惊人的数据：92% 的缓存复用率——意味着 Claude Code 在多轮对话中，有超过九成的 prompt 前缀是从缓存读取而非重新计算的。这直接决定了响应速度和 API 成本。"),

  img("04_记忆系统", 500),

  pb("L6 终端 UI 层。", "用 Ink（React for CLI）搭建，80+ 个组件文件。", "这一层经常被忽视，但它决定了用户体验的"手感"——187 个 spinner 动词（Wes Bos 发现的彩蛋）、Vim 模态编辑器、全键盘操作。这些细节说明 Claude Code 的目标用户画像非常明确：重度终端用户，不是鼠标流。"),

  pb("这六层架构有一个共同特征：", "核心链路零外部依赖。", "不用 LangChain，不用 AutoGen，不用 Semantic Kernel。对比市面上大多数 AI 编码工具（底层几乎都依赖 LangChain 或类似框架），Anthropic 选择全栈自研的成本极高，但换来的是对每一层行为的完全控制。"),

  pb("这里可以给一个更结构化的判断：把这个现象命名为「自研溢价」。", "当产品的核心竞争力是"可靠性"时，每一层外部依赖都是一个不可控的风险源。", "自研的成本在前期是负担，但在产品成熟期会变成护城河。"),

  div(),

  // ====== 03 双 AI 制衡 ======
  h1("03  双 AI 制衡：安全不是功能，是地基"),

  p("如果只看一层，看安全层。"),

  pb("Claude Code 的安全架构不是"在执行前加一道审核"这么简单。它本质上是一个 ", "双 AI 制衡系统", "：主 AI（Opus/Sonnet）负责执行任务，一个独立的 Sonnet 分类器（Temperature=0，确保确定性输出）负责判断每一步操作的风险等级。"),

  img("02_双AI安全架构", 500),

  p("每一条 bash 命令在执行前，要过四道门："),
  li("bashClassifier——用 LLM 判断命令的风险类别（只读/写入/破坏性/网络访问）"),
  li("yoloClassifier——在用户开启"自动模式"时做二次确认"),
  li("权限网关——根据用户设定的权限等级（从 default 到 auto，共 6 级）决定是放行、提示确认还是直接拒绝"),
  li("熔断机制——累计异常达到阈值后自动中断会话"),

  q("Don't give agent access to everything just because you're lazy."),
  qt("CrowdStrike CTO，VentureBeat 引用"),

  pb("这句话精确描述了 Claude Code 安全架构的设计哲学——", "信任不是开关，是阶梯。", "6 级权限不是 6 个选项，而是信任从零到最大的连续光谱。"),

  pb("但也要看到边界。Zscaler ThreatLabz 的安全分析指出，源码泄露后，两个已知漏洞（CVE-2025-59536、CVE-2026-21852）的利用门槛显著降低。GitGuardian 的数据更值得警惕：", "Claude Code 辅助的代码提交中，密钥泄露率为 3.2%，是行业平均水平 1.5% 的两倍多。"),

  pb("这里浮现出一个值得命名的现象，称之为「信任传递悖论」：", "你越信任工具、越频繁地让它自动执行，它帮你犯错的概率就越高。"),

  div(),

  // ====== 04 隐藏功能 ======
  h1("04  四个隐藏功能：泄露的不是代码，是路线图"),

  p("源码泄露最让竞品工程师兴奋的部分，不是已上线的功能，而是 Feature Flags 后面藏着的未发布功能。"),

  img("03_隐藏功能矩阵", 500),

  pb("KAIROS——7x24 后台 Daemon。", "源码注释显示原计划 4 月 1 日上线。", "Daemon 意味着 Claude Code 可以在用户不操作时持续监控代码仓库、自动处理 CI/CD 失败、主动发起 PR review。如果上线，Claude Code 就不再是"你问它答"的工具，而是一个始终在线的工程搭档。"),

  pb("Buddy 系统——18 个物种、5 级稀有度、1% 闪光率、RPG 属性。", "这是一个完整的电子宠物系统，藏在 AI 编码工具里。", "为什么？因为 Buddy 系统本质上是用户留存机制——编码工具的使用黏性天然比社交产品低，宠物系统创造了一个与编码任务无关的"每天打开"理由。"),

  pb("Undercover Mode——约 90 行代码，功能是", "抹除所有 AI 辅助痕迹。", "代码注释、提交信息、文件头中的 AI 标记都会被清除。讽刺的是，这个用来"反泄露"的功能本身被泄露了。"),

  pb("Anti-Distillation——最值得关注。fake_tools 机制会在检测到输出可能被用于训练竞品模型时，", "注入虚假的 tool definitions，本质上是数据投毒。"),

  pb("四个功能放在一起看，能拼出一张清晰的产品路线图：", "KAIROS 是使用深度的延伸，Buddy 是使用频度的延伸，Undercover 是企业客户需求，Anti-Distillation 是竞争防御。", "每一个都不是拍脑袋做的功能，而是商业目标的直接映射。"),

  div(),

  // ====== 05 屎山 ======
  h1("05  屎山也在：3167 行的单函数"),

  p("在赞叹架构精密的同时，源码也暴露了工程质量的另一面。"),

  pb("Engineer's Codex 提到了一个让所有工程师倒吸凉气的数据：print.ts 文件总计 5,594 行，其中一个单独的函数就有 ", "3,167 行", "，嵌套深度达到 12 层。"),

  pb("但更有趣的是另一个发现：代码中充满了", "写给 AI 而不是人类的注释。", "「LLM-oriented comments throughout, written for AI agents not humans.」这意味着 Claude Code 的代码库本身就是被 AI 辅助编写和维护的——它在用自己来开发自己。"),

  pb("Gartner 的判断在这里找到了注脚：Claude Code 的源码被评估为 90% 由 AI 生成，这在美国版权法下意味着", "大部分代码可能不受 IP 保护。", "这个法律灰区对 Anthropic 的影响尚不明确，但它指向了一个行业级问题：当 AI 工具开发 AI 工具时，代码的知识产权归属需要新的法律框架。"),

  img("05_遥测三通道", 500),

  p("源码还揭示了完整的遥测架构：Datadog（实时监控）+ BigQuery（数据分析）+ GrowthBook（A/B 测试），三个通道覆盖了从系统健康到用户行为到功能实验的全链路。这确认了 Claude Code 不只是一个工程项目，而是一个被严肃运营的商业产品。"),

  div(),

  // ====== 06 护城河 ======
  h1("06  护城河评估：被削弱的和没被动摇的"),

  p("最后回到核心问题：源码泄露后，Claude Code 的竞争优势还在吗？"),

  img("07_护城河矩阵", 500),

  h2("被削弱的"),
  li("安全架构的隐蔽性。四道安全门的具体实现、分类器判断逻辑、熔断阈值，以前是黑箱，现在是白箱。"),
  li("未发布功能的先发优势。KAIROS、Buddy 的设计思路被公开，竞品可以提前布局。"),
  li("代码实现的独占性。竞品工程师可以直接参考 QueryEngine、Snip、权限系统的实现。"),

  h2("没被动摇的"),
  li("工程判断力。知道"怎么做"不等于知道"为什么这么做"。六层架构中的每一个设计取舍，存在于团队认知中，不在源码里。"),
  li("模型-工具协同调优。工具描述、Prompt 模板、参数默认值，都是针对 Claude 模型特性调优的结果。换模型底座，同样的架构不会有同样的效果。"),
  li("迭代速度。源码是某个时间点的快照。以 Anthropic 当前的迭代速度，公开的代码很快就会过时。"),
  li("92% 缓存复用率。这个数据背后是 prompt engineering 和缓存策略的长期打磨，不是看了代码就能复制的。"),

  pb("给出一个更凝练的判断——称之为「护城河迁移」：", "源码泄露把 Claude Code 的护城河从"代码壁垒"迁移到了"能力壁垒"。", "代码壁垒是静态的、可复制的；能力壁垒是动态的、需要持续投入的。从长期看，这反而可能是更健康的竞争态势。"),

  div(),

  // ====== 结语 ======
  new Paragraph({
    spacing: { before: 200, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.accent } },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    children: [new TextRun({ text: " ", font: F.cn, size: 10 })],
  }),
  new Paragraph({
    spacing: { before: 120, after: 80 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "对 AI 从业者和实践者意味着什么", font: F.cn, size: 28, bold: true, color: C.accent })],
  }),
  new Paragraph({
    spacing: { before: 80, after: 80, line: 380 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: "三条可执行的判断：", font: F.body, size: 21, color: C.body })],
  }),
  ...([
    ["1.  ", "Harness > Model 已被实证。", "围绕模型的工程体系决定产品天花板。与其对比哪个模型 benchmark 高 2%，不如打磨 Agent loop、安全机制和上下文管理。"],
    ["2.  ", "供应链安全需要从"做了"升级到"持续做"。", "产品安全和发布安全是两个独立的问题。Source map、env 文件的排除检查应该是 CI/CD 的必选项。"],
    ["3.  ", "AI 生成代码的 IP 归属是悬而未决的风险。", "关键的架构决策和核心算法应该保留人工编写的记录，至少在法律框架明确之前。"],
  ].map(([num, bold, rest]) => new Paragraph({
    spacing: { before: 40, after: 40, line: 340 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    indent: { left: convertInchesToTwip(0.5), right: convertInchesToTwip(0.3) },
    children: [
      new TextRun({ text: num, font: F.body, size: 21, color: C.accent }),
      new TextRun({ text: bold, font: F.body, size: 21, bold: true, color: C.body }),
      new TextRun({ text: rest, font: F.body, size: 21, color: C.body }),
    ],
  }))),
  new Paragraph({
    spacing: { before: 80, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent } },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    children: [new TextRun({ text: " ", font: F.cn, size: 10 })],
  }),

  div(),

  // ====== 脚注 ======
  new Paragraph({
    spacing: { before: 100, after: 20 },
    children: [new TextRun({ text: "Claude Code 源码拆解系列 01/34 · AI Force 前沿探索", font: F.body, size: 18, color: C.light })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [
      new TextRun({ text: "信源：CyberNews / VentureBeat / Engineer's Codex / Zscaler / The Guardian / dev.to / Randal Olson / APIYI / PromptLayer / LMCache", font: F.en, size: 16, color: C.light }),
    ],
  }),
];

// MD 结语
mdLines.push("\n---\n");
mdLines.push("\n## 对 AI 从业者和实践者意味着什么\n");
mdLines.push("三条可执行的判断：\n");
mdLines.push("1. **Harness > Model 已被实证。** 围绕模型的工程体系决定产品天花板。");
mdLines.push("2. **供应链安全需要从"做了"升级到"持续做"。** 产品安全和发布安全是两个独立的问题。");
mdLines.push("3. **AI 生成代码的 IP 归属是悬而未决的风险。** 关键架构决策应保留人工编写记录。\n");
mdLines.push("---\n");
mdLines.push(`信源：CyberNews / VentureBeat / Engineer's Codex / Zscaler / The Guardian / dev.to / Randal Olson / APIYI / PromptLayer / LMCache  `);
mdLines.push(`Claude Code 源码拆解系列 01/34 · AI Force 前沿探索`);

// ============================================================
//  文档生成
// ============================================================
const docStyles = {
  default: {
    document: {
      run: { font: F.body, size: 21, color: C.body },
      paragraph: { spacing: { line: 360 } },
    },
  },
};

const document = new Document({
  styles: docStyles,
  sections: [
    {
      properties: { titlePage: true, page: { margin: PAGE_MARGIN } },
      children: coverChildren,
    },
    {
      properties: { page: { margin: PAGE_MARGIN } },
      children: bodyChildren,
    },
  ],
});

const outBase = process.argv[2] || path.join(__dirname, "../../【AI笔记0406】1902个文件里藏了什么");
const docxPath = outBase.endsWith(".docx") ? outBase : `${outBase}.docx`;
const mdPath = outBase.endsWith(".docx") ? outBase.replace(/\.docx$/, ".md") : `${outBase}.md`;

Packer.toBuffer(document).then((buf) => {
  fs.writeFileSync(docxPath, buf);
  console.log(`docx: ${docxPath}`);
  fs.writeFileSync(mdPath, mdLines.join("\n"));
  console.log(`md:   ${mdPath}`);
});
