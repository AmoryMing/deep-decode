/**
 * Harness > Model 图文 Word 文档生成
 * 运行：NODE_PATH=/tmp/node_modules node material/create_doc.js "../【AI笔记0407】Harness大于Model"
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
const PAGE_MARGIN = {
  top: convertInchesToTwip(1), bottom: convertInchesToTwip(0.8),
  left: convertInchesToTwip(1.1), right: convertInchesToTwip(1.1),
};

const h1 = (t) => { mdLines.push(`\n## ${t}\n`); return new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: t, font: F.cn, size: 36, bold: true, color: C.title })] }); };
const h2 = (t) => { mdLines.push(`\n### ${t}\n`); return new Paragraph({ spacing: { before: 360, after: 160 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } }, children: [new TextRun({ text: t, font: F.cn, size: 28, bold: true, color: C.accent })] }); };
const p = (t) => { mdLines.push(`${t}\n`); return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: [new TextRun({ text: t, font: F.body, size: 21, color: C.body })] }); };
const pb = (a, b, c = "") => { mdLines.push(`${a}**${b}**${c}\n`); const ch = [new TextRun({ text: a, font: F.body, size: 21, color: C.body }), new TextRun({ text: b, font: F.body, size: 21, bold: true, color: C.hi })]; if (c) ch.push(new TextRun({ text: c, font: F.body, size: 21, color: C.body })); return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: ch }); };
const li = (t) => { mdLines.push(`- ${t}`); return new Paragraph({ spacing: { before: 40, after: 40, line: 340 }, indent: { left: convertInchesToTwip(0.3) }, children: [new TextRun({ text: "\u2022  ", font: F.body, size: 21, color: C.accent }), new TextRun({ text: t, font: F.body, size: 21, color: C.body })] }); };
const q = (t) => { mdLines.push(`\n> *${t}*`); return new Paragraph({ spacing: { before: 120, after: 0, line: 340 }, indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: t, font: F.en, size: 20, italics: true, color: C.quote })] }); };
const qt = (t) => { mdLines.push(`> ${t}\n`); return new Paragraph({ spacing: { before: 0, after: 120, line: 340 }, indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: "-- ", font: F.body, size: 19, color: C.light }), new TextRun({ text: t, font: F.body, size: 19, color: C.quote })] }); };
const div = () => { mdLines.push("\n---\n"); return new Paragraph({ spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\u2022  \u2022  \u2022", font: F.en, size: 20, color: C.border })] }); };
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

// ============================================================
const COVER_META = {
  titleEn: "Harness > Model",
  subtitleEn: "51 万行代码揭示的 AI 产品真相",
  titleCn: "Claude Code 源码拆解 #02",
  author: "Sebastian Raschka / LMCache Team / 源码社区",
  source: "2026-03-31 泄露源码分析",
  editor: "整理：AI Force",
  series: "AI Force 前沿拆解",
  coverImg: "00_系列封面",
  coverImgH: 450,
  originalUrl: "https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/",
};

mdLines.push(`# ${COVER_META.titleEn}`);
mdLines.push(`\n> ${COVER_META.subtitleEn}  `);
mdLines.push(`> ${COVER_META.titleCn}  `);
mdLines.push(`> ${COVER_META.author} \u00B7 ${COVER_META.source}  `);
mdLines.push(`> ${COVER_META.series}  `);
mdLines.push(`> ${COVER_META.editor}  `);
mdLines.push(`> \u539F\u6587\uFF1A${COVER_META.originalUrl}\n`);
mdLines.push("---\n");

const coverChildren = [
  (() => {
    const pngPath = path.join(PNGS_DIR, `${COVER_META.coverImg}.png`);
    if (!fs.existsSync(pngPath)) return new Paragraph({ children: [] });
    const buf = fs.readFileSync(pngPath);
    const w = convertInchesToTwip(5.8); const h = convertInchesToTwip(5.8 * COVER_META.coverImgH / 800);
    return new Paragraph({ spacing: { before: 200, after: 80 }, alignment: AlignmentType.CENTER, children: [new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } })] });
  })(),
  new Paragraph({ spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${COVER_META.series}  \u00B7  ${COVER_META.editor}`, font: F.body, size: 17, color: C.light })] }),
];

// ============================================================
//  正文
// ============================================================
const bodyChildren = [
  h2("开篇"),
  p("51.2 万行 TypeScript，1902 个源文件。这是 2026 年 3 月 31 日泄露的 Claude Code 完整代码库的体量。但真正让人愣住的不是这个数字，而是另一个：在这 51 万行里，直接跟 LLM 对话的核心代码——query.ts、QueryEngine.ts、claude.ts——加起来只有大约 6,400 行。"),
  pb("剩下的 50 万行在干什么？", "这个问题的答案，正在重塑整个 AI 产品行业对「竞争力」的理解。"),

  img("01_冰山架构", 580),

  div(),

  h1("01  一个 ML 老兵的判断"),
  p("Sebastian Raschka 是 Lightning AI 的研究工程师，写过多本机器学习畅销书。泄露事件后不到 24 小时，他在 Substack 上发了一篇文章，标题直截了当：Claude Code's Real Secret Sauce Isn't the Model。"),
  p("四天后，他把这个判断展开成了一篇更系统的技术分析——Components of a Coding Agent，识别出 coding harness 的六大核心组件：实时代码库上下文、Prompt 分层与缓存复用、结构化工具系统、上下文压缩、会话记录与记忆、子 Agent 委托。"),
  q("I suspect that if we dropped one of the latest, most capable open-weight LLMs, such as GLM-5, into a similar harness, it could likely perform on par with GPT-5.4 in Codex or Claude Opus 4.6 in Claude Code."),
  qt("把最新的开源模型放进同样的 harness，性能可能跟闭源顶级模型不相上下。-- Sebastian Raschka"),
  p("这个判断不是孤例。Reddit 上 r/ClaudeCode 的高赞帖标题就是「Claude Code's leaked source is basically a masterclass in harness engineering」。Bilgin Ibryam 在 Generative Programmer 上总结了十条实践教训，最后一条："),
  q("The best coding agent is not the one with the cleverest instructions. It is the one with the best workflow design."),
  qt("最好的 coding agent 不是指令最聪明的，而是工作流设计最好的。-- Bilgin Ibryam"),

  div(),

  h1("02  什么是 Harness"),
  p("Harness 直译是「笼具」或「驾具」。在 AI 产品语境里，它指围绕 LLM 搭建的所有工程系统——工具调度、上下文管理、安全权限、记忆持久化、多 Agent 协调。如果把 LLM 想象成一匹马力巨大的赛马，harness 就是缰绳、马鞍和赛道围栏的总和。马再快，没有缰绳它只会在草原上乱跑。"),
  pb("姑且给这个现象起个名字：", "「前缀沉重架构」", "。整个系统的重心不在模型调用本身，而在调用之前和之后的那些事：怎么组装上下文、怎么复用缓存、怎么约束工具行为、怎么在长对话中维持状态。沉重的是前缀，不是模型推理。"),

  div(),

  h1("03  92% 缓存复用率：不是运气，是架构"),
  p("这个数字来自 LMCache 团队的实测分析。他们追踪了一个真实的 Claude Code 执行 trace：92 次 LLM 调用，处理约 200 万 token，耗时 13 分钟。结果发现，prompt 前缀的复用率达到了 92%。"),
  p("92% 意味着什么？按 Anthropic 的 API 定价换算：不用缓存约 6 美元，用了缓存降到 1.15 美元。一个任务省 81%。"),

  img("02_前缀沉重架构", 520),

  p("背后有三个关键的架构决策："),
  pb("第一，System Prompt 被切成了静态段和动态段。", "源码里有个常量叫 SYSTEM_PROMPT_DYNAMIC_BOUNDARY", "，把系统提示词一分为二。工具定义、安全规则放前面走缓存；当前目录、Git 状态放后面每次装配。工具排序固定，保持字节级前缀稳定——排序一变，缓存作废。"),
  pb("第二，子 Agent 继承父 Agent 的缓存。", "Fork 机制", "让子 Agent 继承完整上下文，model='inherit' 不能换——换模型就意味着缓存归零。"),
  pb("第三，有一个「预热」阶段。", "前几次 API 调用不做实际工作", "，只把工具列表推入缓存。像数据库的 warm-up query。"),

  div(),

  h1("04  五步预处理流水线"),
  p("如果缓存复用是成本武器，五步预处理流水线就是质量武器。Claude Code 的主循环在每轮调用 API 之前，都会经过："),
  pb("Snip ", "→ 微压缩 → 上下文折叠 → 自动压缩 → ", "组装请求"),

  img("03_五步预处理流水线", 540),

  li("Snip 裁掉过时的工具调用结果，裁剪量传给后续步骤"),
  li("微压缩就地缩减过长工具返回，用户完全透明"),
  li("上下文折叠刻意放在自动压缩之前——能折叠够用就不做更激进的压缩"),
  li("自动压缩在 token 接近窗口上限时触发，预留 20K token（p99.99 = 17,387 token）"),
  li("压缩阶段有硬指令：CRITICAL - Do NOT call any tools"),
  pb("设计哲学：", "能不让模型看到的东西，就不让它看到。", "不是窗口不够大，而是无关信息分散注意力。"),

  div(),

  h1("05  但是——模型真的不重要吗？"),
  p("到这里一个过于整齐的叙事已经浮现了：harness 是一切，模型无所谓。但事实没那么简单。"),
  q("There is nothing special in the harness (it seems less sophisticated than Codex), which I think is supported by the fact that Claude Code works much better with (strong) Claude models vs Chinese OSS."),
  qt("harness 里没什么特别的，CC 搭配强模型明显更好。-- dmckinno"),
  p("这个反方值得认真对待。源码里 USER_TYPE === 'ant' 的分支显示，Anthropic 内部员工用的版本和外部版本在提示词策略上有差异。harness 不是通用适配器，它和 Claude 模型是共进化的关系。"),
  pb("更准确的说法可能是：", "模型是底座，harness 是杠杆。", "底座决定了你能站多高，杠杆决定了你能把力放大多少倍。Claude Code 的真正壁垒不是其中任何一个，而是两者之间长期磨合出来的协同效应。"),

  div(),

  // 结语
  new Paragraph({ spacing: { before: 200, after: 0 }, border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: " ", font: F.cn, size: 10 })] }),
  new Paragraph({ spacing: { before: 120, after: 80 }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\u7ED3  \u8BED", font: F.cn, size: 28, bold: true, color: C.accent })] }),
  new Paragraph({ spacing: { before: 80, after: 80, line: 380 }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) }, children: [new TextRun({ text: "\u8FD9\u573A\u300C\u610F\u5916\u5F00\u6E90\u300D\u8BA9\u6574\u4E2A\u884C\u4E1A\u63D0\u524D\u770B\u5230\u4E86\u4E00\u4E2A\u672C\u6765\u9700\u8981\u518D\u7B49\u51E0\u5E74\u624D\u80FD\u770B\u6E05\u7684\u4E8B\u5B9E\uFF1AAI Agent \u65F6\u4EE3\u7684\u5DE5\u7A0B\u7ADE\u4E89\uFF0C\u672C\u8D28\u4E0A\u662F harness \u5DE5\u7A0B\u80FD\u529B\u7684\u7ADE\u4E89\u3002", font: F.body, size: 21, color: C.body })] }),
  ...([
    ["1.  ", "AI \u4EA7\u54C1\u7684\u7ADE\u4E89\u6B63\u5728\u4ECE\u300C\u6A21\u578B\u519B\u5907\u8D5B\u300D\u8F6C\u5411\u300C\u5DE5\u7A0B\u519B\u5907\u8D5B\u300D\u3002", "\u6A21\u578B\u80FD\u529B\u5728\u8D8B\u540C\uFF0Charness \u7684\u5DEE\u8DDD\u6B63\u5728\u62C9\u5927\u3002"],
    ["2.  ", "\u300C\u4E0A\u4E0B\u6587\u5DE5\u7A0B\u300D\u6B63\u5728\u6210\u4E3A AI \u5DE5\u7A0B\u7684\u6838\u5FC3\u5B66\u79D1\u3002", "\u5DF2\u7ECF\u4E0D\u662F\u300C\u5199\u4E2A\u597D prompt\u300D\u7684\u5C42\u6B21\uFF0C\u662F\u5B8C\u6574\u7684\u5DE5\u7A0B\u4F53\u7CFB\u3002"],
    ["3.  ", "\u6295\u8D44\u56DE\u62A5\u6BD4\u6700\u9AD8\u7684\u65B9\u5411\uFF1A\u5148\u628A\u4E0A\u4E0B\u6587\u7BA1\u7406\u548C\u5DE5\u5177\u7EA6\u675F\u505A\u5BF9\u3002", "\u4E0D\u9700\u8981 51 \u4E07\u884C\uFF0C\u4F46\u9700\u8981\u60F3\u6E05\u695A\u51E0\u4E2A\u5173\u952E\u95EE\u9898\u3002"],
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

  new Paragraph({ spacing: { before: 100, after: 20 }, children: [new TextRun({ text: "AI Force 2026 \u524D\u6CBF\u62C6\u89E3\u7CFB\u5217", font: F.body, size: 18, color: C.light })] }),
  new Paragraph({ spacing: { before: 0, after: 20 }, children: [new TextRun({ text: "\u539F\u6587\u94FE\u63A5\uFF1A", font: F.body, size: 18, color: C.light }), new TextRun({ text: COVER_META.originalUrl, font: F.en, size: 18, color: C.accent })] }),
];

// MD footer
mdLines.push("\n---\n");
mdLines.push("\n## \u7ED3\u8BED\n");
mdLines.push("\u8FD9\u573A\u300C\u610F\u5916\u5F00\u6E90\u300D\u8BA9\u6574\u4E2A\u884C\u4E1A\u63D0\u524D\u770B\u5230\u4E86\uFF1AAI Agent \u65F6\u4EE3\u7684\u5DE5\u7A0B\u7ADE\u4E89\uFF0C\u672C\u8D28\u662F harness \u5DE5\u7A0B\u80FD\u529B\u7684\u7ADE\u4E89\u3002\n");
mdLines.push(`\u539F\u6587\u94FE\u63A5\uFF1A${COVER_META.originalUrl}  `);
mdLines.push(`AI Force \u524D\u6CBF\u62C6\u89E3 \u00B7 ${COVER_META.editor}`);

const document = new Document({
  styles: { default: { document: { run: { font: F.body, size: 21, color: C.body }, paragraph: { spacing: { line: 360 } } } } },
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
