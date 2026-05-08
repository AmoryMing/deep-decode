/**
 * 脑手分离：Anthropic 不再只卖模型了 -- docx + md 生成
 * 运行: NODE_PATH=/tmp/node_modules node material/create_doc.js `【AI笔记0409】脑手分离-Anthropic不再只卖模型了
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
  title: "1A1A1A", accent: "C47B2B", body: "333333", light: "666666",
  quote: "5D4E37", quoteBg: "FFF5E1", border: "E8D5B5", hi: "D2691E",
  white: "FFFFFF", coverBg: "FFF9EE",
};
const F = { cn: "Heiti SC", en: "Georgia", mono: "Menlo", body: "Songti SC" };
const mdLines = [];

const h1 = (t) => { mdLines.push(\n## ${t}\n`); return new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: t, font: F.cn, size: 36, bold: true, color: C.title })] }); };
const h2 = (t) => { mdLines.push(`\n### ${t}\n`); return new Paragraph({ spacing: { before: 360, after: 160 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } }, children: [new TextRun({ text: t, font: F.cn, size: 28, bold: true, color: C.accent })] }); };
const h3 = (t) => { mdLines.push(`\n#### ${t}\n`); return new Paragraph({ spacing: { before: 280, after: 120 }, children: [new TextRun({ text: t, font: F.cn, size: 24, bold: true, color: C.hi })] }); };
const p = (t) => { mdLines.push(`${t}\n`); return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: [new TextRun({ text: t, font: F.body, size: 21, color: C.body })] }); };
const pb = (a, b, c = "") => { mdLines.push(`${a}**${b}**${c}\n`); const ch = [new TextRun({ text: a, font: F.body, size: 21, color: C.body }), new TextRun({ text: b, font: F.body, size: 21, bold: true, color: C.hi })]; if (c) ch.push(new TextRun({ text: c, font: F.body, size: 21, color: C.body })); return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: ch }); };
const li = (t) => { mdLines.push(`- ${t}`); return new Paragraph({ spacing: { before: 40, after: 40, line: 340 }, indent: { left: convertInchesToTwip(0.3) }, children: [new TextRun({ text: "•  ", font: F.body, size: 21, color: C.accent }), new TextRun({ text: t, font: F.body, size: 21, color: C.body })] }); };
const q = (t) => { mdLines.push(`\n> *${t}*`); return new Paragraph({ spacing: { before: 120, after: 0, line: 340 }, indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: t, font: F.en, size: 20, italics: true, color: C.quote })] }); };
const qt = (t) => { mdLines.push(`> ${t}\n`); return new Paragraph({ spacing: { before: 0, after: 120, line: 340 }, indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: "-- ", font: F.body, size: 19, color: C.light }), new TextRun({ text: t, font: F.body, size: 19, color: C.quote })] }); };
const div = () => { mdLines.push("\n---\n"); return new Paragraph({ spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "•  •  •", font: F.en, size: 20, color: C.border })] }); };
const sp = () => { mdLines.push(""); return new Paragraph({ spacing: { before: 40, after: 40 }, children: [] }); };
const img = (name, svgHeight = 500) => {
  mdLines.push(`\n![${name}](material/pngs/${name}.png)\n`);
  const pngPath = path.join(PNGS_DIR, `${name}.png`);
  if (!fs.existsSync(pngPath)) { console.warn(`[WARN] PNG missing: ${pngPath}`); return sp(); }
  const buf = fs.readFileSync(pngPath);
  const w = convertInchesToTwip(5.8);
  const h = convertInchesToTwip(5.8 * svgHeight / 800);
  return new Paragraph({ spacing: { before: 160, after: 160 }, alignment: AlignmentType.CENTER, children: [new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } })] });
};

const PAGE_MARGIN = { top: convertInchesToTwip(1), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(1.1), right: convertInchesToTwip(1.1) };

const COVER_META = {
  titleEn: "Scaling Managed Agents",
  subtitleEn: "Decoupling the Brain from the Hands",
  titleCn: `脑手分离：Anthropic 不再只卖模型了`,
  author: "Lance Martin, Gabe Cemaj, Michael Cohen",
  source: "Anthropic Engineering · 2026-04-08",
  editor: `整理：muming`,
  series: `AI Force 前沿 AI 探索`,
  coverImg: `00_系列封面`,
  coverImgH: 450,
  originalUrl: "https://www.anthropic.com/engineering/managed-agents",
};

mdLines.push(`# ${COVER_META.titleCn}`);
mdLines.push(`\n> ${COVER_META.subtitleEn}  `);
mdLines.push(`> ${COVER_META.author} · ${COVER_META.source}  `);
mdLines.push(`> ${COVER_META.series} · ${COVER_META.editor}  `);
mdLines.push(`> 原文：${COVER_META.originalUrl}\n`);
mdLines.push("---\n");

const coverChildren = [
  (() => {
    const pngPath = path.join(PNGS_DIR, `${COVER_META.coverImg}.png`);
    if (!fs.existsSync(pngPath)) return new Paragraph({ children: [] });
    const buf = fs.readFileSync(pngPath);
    const w = convertInchesToTwip(5.8); const h = convertInchesToTwip(5.8 * COVER_META.coverImgH / 800);
    return new Paragraph({ spacing: { before: 200, after: 80 }, alignment: AlignmentType.CENTER, children: [new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } })] });
  })(),
  new Paragraph({ spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${COVER_META.series}  ·  ${COVER_META.editor}`, font: F.body, size: 17, color: C.light })] }),
];

// ============================================================
//  正文内容
// ============================================================
const bodyChildren = [

  h2(`开篇`),
  p(`Anthropic 卖 Claude API 的时候，按 token 收费。现在他们推出了 Managed Agents，按小时收费——$0.08 一个 session-hour。`),
  p(`从按字数卖到按工时卖，这不是定价变了，是商业模式变了。`),
  sp(),
  p(`2026 年 4 月 8 日，Anthropic 同时发布了三样东西：一篇工程博客、一套完整的 API 文档体系、和一个公测产品。工程博客的标题是「Scaling Managed Agents: Decoupling the Brain from the Hands」，作者是 Agents API 团队的 Lance Martin、Gabe Cemaj 和 Michael Cohen。`),
  p(`标题里的关键词是 decoupling——解耦。这不是产品发布的常见措辞，这是架构设计的核心原则。Anthropic 选择在产品发布日用一篇工程博客而不是产品博客来打头阵，说明他们认为架构本身就是卖点。`),
  pb(`WIRED 的报道用了一���更直白的说法：Anthropic 从\u201C卖模型访问权\u201D变成了`, `\u201C卖一个你可以派遣的工人\u201D`, `。Notion、Sentry、Rakuten、Asana �� Vibecode 已经在用。`),

  div(),

  h1(`01  脑手分离：操作系统级的设计决策`),
  p(`Anthropic 的工程团队在博客里提出了一个架构原则，用大白话说就是三件事分开放：`),
  li(`Session（会话日志）：一个 append-only 的事件流，记录 Agent 做过的所有事。不可改，只追加。`),
  li(`Harness（调度器）：调用 Claude、把工具调用路由到正确位置的循环——脑。`),
  li(`Sandbox（沙箱）：Claude 实际执行代码、编辑文件的容器环境——手。`),
  sp(),
  p(`为什么要分开？博客里有一个特别有说服力的案例。`),
  pb(`Claude Sonnet 4.5 在接近上下文窗口极限时会表现出一种行为——工程团队叫它 `, `context anxiety（上下文焦虑）`, `：模型会提前结束任务，仿佛害怕自己记不住接下来的事。团队为此在 Harness 里加了上下文重置机制。但当同一个 Harness 跑在 Opus 4.5 上时，这种焦虑消失了——上下文重置变成了无意义的开销。`),
  q(`Harnesses encode assumptions about model capabilities that become obsolete as models improve.`),
  qt(`Harness 编码了关于模型能力的假设，这些假设随着模型进步而过时。`),
  pb(`这句话是整篇博客的精髓。这里浮现出一个值得命名的现象，姑且叫它`, `「Harness 保质期」`, `。传统做法是：模型出了怪癖，在 Harness 里打补丁，补丁固化成基础设施代码。但模型能力进化的速度远快于基础设施更新的速度，于是补丁堆积，Harness 变成了一个记录了所有历史模型怪癖的「技术债博物馆」。解耦的核心价值不是性能优化，是让 Harness 可以被整体替换。`),

  img(`01_耦合vs解耦架构`, 520),

  div(),

  h1(`02  从宠物到牲畜`),
  p(`博客里用了 DevOps 界一个经典隐喻：Pets vs Cattle（宠物 vs 牲畜）。早期架构里，一个 Agent 的所有组件住在同一个容器里。容器就像一只宠物——你给它起名字，精心维护，它生病了你心疼。问题是：容器挂了整个 session 丢失；容器不响应需要人工介入；Harness 无法连接容器外的资源；调试需要暴露用户数据。`),
  p(`新架构把容器变成了牲畜：编号、可替换、挂了就扔。Harness 搬到容器外面，通过极简接口调用容器：execute(name, input) -> string。容器挂了？Harness 把它当成一个 tool call error，重新初始化一个新的。Session 日志在外面，什么都不丢。`),
  pb(`这个设计直接带来了性能飞跃。原来每个 session 启动前要先启动容器，推理得排队等。解耦后，推理立即开始，容器只在需要时才启动。效果是：`, `p50 TTFT 降了约 60%，p95 降了超过 90%`, `。`),

  div(),

  h1(`03  安全边界：凭证永不触达沙箱`),
  p(`耦合架构还有一个隐蔽但致命的问题：prompt injection 可以触达凭证。Claude 生成的代码和访问凭证住在同一个容器里——注入攻击只需要一步。`),
  p(`解耦后，Anthropic 用了两种隔离策略：`),
  pb(``, `资源绑定认证（Resource-bundled auth）`, `：Git 访问令牌在沙箱初始化时写入仓库配置。之后的 push/pull 操作正常工作，但令牌本身对 Claude 不可见。`),
  pb(``, `金库令牌（Vault-based tokens）`, `：OAuth 令牌存在外部金库。Claude 调用工具时，请求经过代理层，代理层从金库取凭证、发起外部调用、把结果返回给 Claude。Claude 从头到尾看不到任何凭证。`),
  p(`Harness 本身也不知道凭证的存在。即使 Harness 被攻破，攻击者也拿不到任何有价值的东西。`),

  img(`03_安全隔离设计`, 440),

  div(),

  h1(`04  完整的产品拼图：四层认知基建`),
  p(`工程博客只讲了架构。但 Anthropic 同时发布的文档体系揭示了完整的产品版图，远比博客暗示的要大。`),
  pb(``, `基础层（公测）`, `：Agent + Environment + Session + Events。创建一个 Agent 配好模型和工具，定义 Environment 配好容器参数，启动 Session 发消息，通过 SSE 流式接收结果。8 个内置工具，支持自定义工具，7 种 SDK 加 CLI。`),
  pb(``, `目标层（研究预览）—— Outcomes`, `：你可以定义完成长什么样——写一个 rubric（评分标准），系统自动用独立的 grader 评估产出是否达标。没达标？Agent 自动迭代，最多 20 轮。Grader 独立于主 Agent，避免既当运动员又当裁判。`),
  pb(``, `协作层（研究预览）—— Multi-agent`, `：一个协调者 Agent 可以调度其他 Agent，每个 Agent 在自己的线程里运行，有独立的上下文，但共享同一个容器文件系统。目前限制一级委派。`),
  pb(``, `记忆层（研究预览）—— Memory Stores`, `：跨 Session 的持久化记忆。支持版本历史、乐观并发控制、脱敏操作。上限 100KB/条，每个 Session 最多挂 8 个。`),

  img(`02_四层认知基建`, 560),

  div(),

  h1(`05  盲区与未说出口的`),
  pb(``, `锁定风险`, `。整套基础设施跑在 Anthropic 的云上，用的是 Anthropic 的容器、事件格式、Memory API。一旦深度集成，切换成本极高。博客里那个操作系统抽象的比喻很漂亮，但 read() 系统调用是标准化的——Anthropic 的 Session API 不是。`),
  pb(``, `研究预览不等于生产就绪`, `。Outcomes、Multi-agent、Memory 都标注了 Research Preview，需要单独申请。最有想象力的三个功能在生产环境的可靠性还没被验证。`),
  pb(``, `自主性的边界`, `。OpenAI 最近发表了一篇关于监控内部编程 Agent 的文章，讨论了 Agent 试图修改自身安全机制的风险。当 Agent 可以跑几个小时、调用多个子 Agent、还有持久记忆时，行为监控比单次 API 调用复杂得多。`),

  div(),

  // ====== 结语 ======
  new Paragraph({ spacing: { before: 200, after: 0 }, border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: " ", font: F.cn, size: 10 })] }),
  new Paragraph({ spacing: { before: 120, after: 80 }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: `结  语`, font: F.cn, size: 28, bold: true, color: C.accent })] }),
  new Paragraph({
    spacing: { before: 80, after: 80, line: 380 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: `Anthropic 用操作系统来比喻自己的架构。这个比喻的潜台词是——操作系统厂商不只是卖 kernel，他们定义了整个生态的接口标准。如果 Managed Agents 成为 Agent 世界的事实标准，Anthropic 就从模型提供商变成了平台提供商。这是云计算历史里回报最高的位置。`, font: F.body, size: 21, color: C.body })],
  }),
  ...([
    ["1.  ", `Harness 是有保质期的。`, `模型每升级一次，Harness 里的补丁就有一部分过期。解耦的核心价值是让 Harness 可以被整体替换。],
    ["2.  ", 从卖 token 到卖 session-hour。`, `Anthropic 实质上在卖调度税减免——$0.08/小时让你跳过自建 Agent 基础设施的工程量。],
    ["3.  ", 关注 Outcomes。`, "`定义完成标准 + 自动评分 + 迭代到达标这个模式，本质上是把产品经理的验收流程 API 化了。"],
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
  new Paragraph({ spacing: { before: 80, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: " ", font: F.cn, size: 10 })] }),

  div(),

  new Paragraph({ spacing: { before: 100, after: 20 }, children: [new TextRun({ text: 本文为 AI Force 2026 前沿分享系列`, font: F.body, size: 18, color: C.light })] }),
  new Paragraph({ spacing: { before: 0, after: 20 }, children: [new TextRun({ text: `原文链接：`, font: F.body, size: 18, color: C.light }), new TextRun({ text: COVER_META.originalUrl, font: F.en, size: 18, color: C.accent })] }),
];

mdLines.push("\n---\n");
mdLines.push(`\n## 结语\n`);
mdLines.push("Anthropic 用`操作系统来比喻自己的架构。这是云计算历史里回报最高的位置。\n");
mdLines.push("\n**三个关键启示：**\n");
mdLines.push(1. **Harness 是有保质期的。** 模型每升级一次，Harness 里的补丁就有一部分过期。`);
mdLines.push(`2. **从卖 token 到卖 session-hour。** Anthropic 在卖调度税减免"。");
mdLines.push(3. **关注 Outcomes。** 把产品经理的验收流程 API 化了。\n`);
mdLines.push("---\n");
mdLines.push(`原文链接：${COVER_META.originalUrl}  `);
mdLines.push(`AI Force 前沿 AI 探索 · ${COVER_META.editor}`);

const docStyles = { default: { document: { run: { font: F.body, size: 21, color: C.body }, paragraph: { spacing: { line: 360 } } } } };
const document = new Document({
  styles: docStyles,
  sections: [
    { properties: { titlePage: true, page: { margin: PAGE_MARGIN } }, children: coverChildren },
    { properties: { page: { margin: PAGE_MARGIN } }, children: bodyChildren },
  ],
});

const outBase = process.argv[2] || path.join(__dirname, "../output");
const docxPath = outBase.endsWith(".docx") ? outBase : `${outBase}.docx`;
const mdPath = outBase.endsWith(".docx") ? outBase.replace(/\.docx$/, ".md") : `${outBase}.md`;

Packer.toBuffer(document).then((buf) => {
  fs.writeFileSync(docxPath, buf);
  console.log(`docx: ${docxPath}`);
  fs.writeFileSync(mdPath, mdLines.join("\n"));
  console.log(`md:   ${mdPath}`);
});
