/**
 * AI 前沿分享 · Word + Markdown 文档生成
 * Claude Code 源码拆解 #12 -- 推测执行：当 AI 编程助手学会了 CPU 的老把戏
 *
 * 运行：
 *   cd 2026-04-03-speculation-prefetch
 *   NODE_PATH=/tmp/node_modules node material/create_doc.js "【AI笔记0407】推测执行：当AI编程助手学会了CPU的老把戏"
 */

const docx = require("docx");
const fs = require("fs");
const path = require("path");

const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle,
  ImageRun, ShadingType, convertInchesToTwip,
} = docx;

// ============================================================
//  路径：PNG 从本脚本同级的 pngs/ 子目录读取
// ============================================================
const PNGS_DIR = path.join(__dirname, "pngs");

// ============================================================
//  样式常量 -- 暖色调编辑风格
// ============================================================
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

// ============================================================
//  Markdown 并行输出
// ============================================================
const mdLines = [];

// ============================================================
//  组件函数
// ============================================================

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

const h3 = (t) => {
  mdLines.push(`\n#### ${t}\n`);
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text: t, font: F.cn, size: 24, bold: true, color: C.hi })],
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
      new TextRun({ text: "\u2022  ", font: F.body, size: 21, color: C.accent }),
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
    children: [new TextRun({ text: "\u2022  \u2022  \u2022", font: F.en, size: 20, color: C.border })],
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
    console.warn(`[WARNING] PNG not found, skipping: ${pngPath}`);
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

const code = (lines) => {
  mdLines.push("```");
  lines.forEach(l => mdLines.push(l));
  mdLines.push("```\n");
  return lines.map((l, i) => new Paragraph({
    spacing: { before: i === 0 ? 120 : 0, after: i === lines.length - 1 ? 120 : 0, line: 280 },
    indent: { left: convertInchesToTwip(0.4) },
    shading: { type: ShadingType.CLEAR, fill: "F5F0E8" },
    children: [new TextRun({ text: l, font: F.mono, size: 18, color: C.quote })],
  }));
};

// ============================================================
//  共用页面边距
// ============================================================
const PAGE_MARGIN = {
  top: convertInchesToTwip(1),
  bottom: convertInchesToTwip(0.8),
  left: convertInchesToTwip(1.1),
  right: convertInchesToTwip(1.1),
};

// ============================================================
//  封面信息
// ============================================================
const COVER_META = {
  titleEn:    "Speculative Execution in Claude Code",
  subtitleEn: "Intent Pipeline: From CPU Branch Prediction to AI Intent Prediction",
  titleCn:    "\u63a8\u6d4b\u6267\u884c\uff1a\u5f53 AI \u7f16\u7a0b\u52a9\u624b\u5b66\u4f1a\u4e86 CPU \u7684\u8001\u628a\u620f",
  author:     "Anthropic Engineering (\u6e90\u7801\u5206\u6790)",
  source:     "Claude Code Source \u00b7 2026-03-31",
  editor:     "\u6574\u7406\uff1aAI Force",
  series:     "Claude Code \u6e90\u7801\u62c6\u89e3 #12",
  coverImg:   "00_\u7cfb\u5217\u5c01\u9762",
  coverImgH:  500,
  originalUrl: "https://github.com/yasasbanukaofficial/claude-code",
};

// ============================================================
//  封面页
// ============================================================
mdLines.push(`# ${COVER_META.titleEn}`);
mdLines.push(`\n> ${COVER_META.subtitleEn}  `);
mdLines.push(`> ${COVER_META.titleCn}  `);
mdLines.push(`> ${COVER_META.author} \u00b7 ${COVER_META.source}  `);
mdLines.push(`> ${COVER_META.series}  `);
mdLines.push(`> ${COVER_META.editor}  `);
mdLines.push(`> \u539f\u6587\uff1a${COVER_META.originalUrl}\n`);
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
      new TextRun({ text: `${COVER_META.series}  \u00b7  ${COVER_META.editor}`, font: F.body, size: 17, color: C.light }),
    ],
  }),
];

// ============================================================
//  正文内容
// ============================================================
const bodyChildren = [

  // ====== 开篇 ======
  h2("\u5f00\u7bc7"),

  p("1969 \u5e74\uff0cIBM System/360 Model 91 \u7b2c\u4e00\u6b21\u5728\u786c\u4ef6\u91cc\u5b9e\u73b0\u4e86\u5206\u652f\u9884\u6d4b\u2014\u2014CPU \u4e0d\u518d\u50bb\u7b49\u6761\u4ef6\u5224\u65ad\u7684\u7ed3\u679c\uff0c\u800c\u662f\u8d4c\u4e00\u628a\uff1a\u731c\u4f60\u63a5\u4e0b\u6765\u8981\u8d70\u54ea\u6761\u8def\uff0c\u63d0\u524d\u628a\u90a3\u6761\u8def\u4e0a\u7684\u6307\u4ee4\u7b97\u597d\u3002\u731c\u5bf9\u4e86\uff0c\u7701\u6389\u51e0\u5341\u4e2a\u65f6\u949f\u5468\u671f\uff1b\u731c\u9519\u4e86\uff0c\u628a\u7b97\u597d\u7684\u7ed3\u679c\u6254\u6389\uff0c\u5047\u88c5\u4ec0\u4e48\u90fd\u6ca1\u53d1\u751f\u3002"),

  p("57 \u5e74\u540e\uff0cClaude Code \u7684\u6e90\u7801\u91cc\u51fa\u73b0\u4e86\u540c\u6837\u7684\u903b\u8f91\u3002\u53ea\u4e0d\u8fc7\u8fd9\u6b21\u9884\u6d4b\u7684\u5bf9\u8c61\u4e0d\u662f\u673a\u5668\u6307\u4ee4\u7684\u8df3\u8f6c\u65b9\u5411\uff0c\u800c\u662f\u4eba\u7c7b\u5f00\u53d1\u8005\u7684\u4e0b\u4e00\u6b65\u64cd\u4f5c\u3002"),

  pb("\u6cc4\u9732\u7684 992 \u884c speculation.ts \u63ed\u793a\u4e86\u4e00\u5957\u5b8c\u6574\u7684", "\u610f\u56fe\u6d41\u6c34\u7ebf\uff08Intent Pipeline\uff09", "\uff1a\u9884\u6d4b\u4f60\u8981\u8f93\u4ec0\u4e48 \u2192 \u5728\u6c99\u7bb1\u91cc\u66ff\u4f60\u5148\u505a\u4e86 \u2192 \u4f60\u6309\u56de\u8f66\u786e\u8ba4\u5c31\u76f4\u63a5\u7528\u7ed3\u679c\uff0c\u6539\u4e3b\u610f\u5c31\u5168\u4e22\u3002\u8fd9\u5957\u7cfb\u7edf\u5185\u90e8\u4ee3\u53f7 Tengu\uff08\u5929\u72d7\uff09\uff0c\u76ee\u524d\u4ec5\u9650 Anthropic \u5185\u90e8\u5458\u5de5\u4f7f\u7528\uff0c\u4f46\u6240\u6709\u57fa\u7840\u8bbe\u65bd\u5df2\u7ecf\u5b8c\u5168\u5c31\u4f4d\u3002"),

  pb("\u8fd9\u7bc7\u62c6\u89e3\u8bb2\u7684\u662f\u4e00\u79cd\u6b63\u5728\u6d6e\u73b0\u7684\u8bbe\u8ba1\u8303\u5f0f\uff1a", "AI \u5de5\u5177\u7684\u4e0b\u4e00\u4e2a\u7ade\u4e89\u7ef4\u5ea6\u4e0d\u662f\u66f4\u806a\u660e\uff0c\u800c\u662f\u66f4\u5feb\u2014\u2014\u4e0d\u662f\u6a21\u578b\u63a8\u7406\u66f4\u5feb\uff0c\u800c\u662f\u8ba9\u4eba\u611f\u89c9\u66f4\u5feb\u3002"),

  img("00_\u7cfb\u5217\u5c01\u9762", 500),

  div(),

  // ====== 01 ======
  h1("01  \u9884\u6d4b\u4f60\u4e0b\u4e00\u53e5\u8bdd\uff1aPrompt Suggestion \u7684\u8bbe\u8ba1\u54f2\u5b66"),

  p("\u6574\u5957\u610f\u56fe\u6d41\u6c34\u7ebf\u7684\u8d77\u70b9\uff0c\u662f\u4e00\u4e2a\u770b\u8d77\u6765\u4e0d\u8d77\u773c\u7684\u529f\u80fd\uff1a\u8f93\u5165\u5efa\u8bae\u3002\u6bcf\u8f6e\u5bf9\u8bdd\u7ed3\u675f\u540e\uff0cClaude Code \u4f1a\u5728\u540e\u53f0 fork \u4e00\u4e2a\u5b50 agent\uff0c\u7528\u5f53\u524d\u5bf9\u8bdd\u4e0a\u4e0b\u6587\u53bb\u9884\u6d4b\u7528\u6237\u4e0b\u4e00\u6b65\u4f1a\u8f93\u5165\u4ec0\u4e48\u3002"),

  q("Your job is to predict what THEY would type - not what you think they should do. THE TEST: Would they think 'I was just about to type that'?"),
  qt("\u4f60\u7684\u4efb\u52a1\u662f\u9884\u6d4b\u7528\u6237\u4f1a\u6253\u4ec0\u4e48\u2014\u2014\u4e0d\u662f\u4f60\u89c9\u5f97\u4ed6\u4eec\u5e94\u8be5\u505a\u4ec0\u4e48\u3002\u68c0\u9a8c\u6807\u51c6\uff1a\u4ed6\u4eec\u4f1a\u4e0d\u4f1a\u89c9\u5f97\u201c\u6211\u521a\u60f3\u6253\u8fd9\u4e2a\u201d\uff1f"),

  pb("\u6ce8\u610f\u8fd9\u4e2a\u8bbe\u8ba1\u6296\u62e9\u3002\u5efa\u8bae\u7cfb\u7edf\u7684\u76ee\u6807\u4e0d\u662f\u201c\u7ed9\u51fa\u6700\u597d\u7684\u4e0b\u4e00\u6b65\u201d\uff0c\u800c\u662f", "\u201c\u731c\u4e2d\u7528\u6237\u81ea\u5df1\u60f3\u505a\u7684\u4e0b\u4e00\u6b65\u201d", "\u3002\u524d\u8005\u662f\u987e\u95ee\u601d\u7ef4\uff0c\u540e\u8005\u662f\u52a9\u624b\u601d\u7ef4\u3002"),

  p("\u4e3a\u4e86\u786e\u4fdd\u5efa\u8bae\u201c\u50cf\u7528\u6237\u81ea\u5df1\u4f1a\u6253\u7684\u8bdd\u201d\uff0c\u6e90\u7801\u91cc\u5806\u4e86 12 \u6761\u8fc7\u6ee4\u89c4\u5219\u3002\u592a\u77ed\u7684\u4e22\uff08\u5355\u4e2a\u8bcd\uff0c\u9664\u4e86 yes/no/push/commit\uff09\u3002\u592a\u957f\u7684\u4e22\uff08\u8d85\u8fc7 12 \u4e2a\u8bcd\u6216 100 \u5b57\u7b26\uff09\u3002\u542c\u8d77\u6765\u50cf AI \u5728\u8bf4\u8bdd\u7684\u4e22\u2014\u2014\u201cLet me...\u201d\u3001\u201cI'll...\u201d\u3001\u201cHere's...\u201d \u5168\u90e8\u62e6\u622a\u3002"),

  pb("\u8fd9\u4e0d\u662f\u7b80\u5355\u7684\u6587\u672c\u8fc7\u6ee4\uff0c\u8fd9\u662f\u4e00\u5957\u4e25\u683c\u7684", "\u89d2\u8272\u6821\u51c6\u7cfb\u7edf", "\u3002\u5efa\u8bae\u5fc5\u987b\u662f\u201c\u7528\u6237\u8bed\u6c14\u201d\uff0c\u4e0d\u80fd\u662f\u201cAI \u8bed\u6c14\u201d\u3002\u4e00\u65e6\u7528\u6237\u611f\u89c9\u201c\u8fd9\u4e0d\u50cf\u6211\u4f1a\u8bf4\u7684\u8bdd\u201d\uff0c\u4fe1\u4efb\u5c31\u5d29\u4e86\u3002"),

  img("01_\u5efa\u8bae\u751f\u6210\u8fc7\u6ee4\u6f0f\u6597", 550),

  p("\u8fd8\u6709\u4e00\u5c42\u66f4\u7cbe\u5999\u7684\u7ecf\u6d4e\u5b66\u8003\u91cf\u3002\u5efa\u8bae\u751f\u6210\u672c\u8eab\u662f\u4e00\u6b21 LLM \u8c03\u7528\uff0c\u8981\u82b1\u94b1\u3002\u6e90\u7801\u91cc\u6709\u4e00\u4e2a getParentCacheSuppressReason \u51fd\u6570\uff1a\u5982\u679c\u4e0a\u4e00\u8f6e\u5bf9\u8bdd\u7684\u672a\u7f13\u5b58 token \u6570\u8d85\u8fc7 10,000\uff0c\u5c31\u4e0d\u751f\u6210\u5efa\u8bae\u3002\u539f\u56e0\u662f fork \u51fa\u6765\u7684\u5b50 agent \u5fc5\u987b\u590d\u7528\u7236\u8fdb\u7a0b\u7684 prompt cache \u624d\u5212\u7b97\u3002"),

  pb("\u8fd9\u4e2a\u7ec6\u8282\u8bf4\u660e\u4e00\u4ef6\u4e8b\uff1a", "\u5efa\u8bae\u7cfb\u7edf\u4e0d\u662f\u201c\u6709\u603b\u6bd4\u6ca1\u6709\u597d\u201d\u3002\u53ea\u6709\u5728\u7f13\u5b58\u547d\u4e2d\u7387\u8db3\u591f\u9ad8\u7684\u65f6\u5019\uff0c\u5b83\u624d\u6709\u6b63\u7684 ROI\u3002", " \u505a\u4e0d\u5230\u5c31\u5b81\u53ef\u4e0d\u505a\u3002"),

  div(),

  // ====== 02 ======
  h1("02  \u9884\u6d4b\u4e86\u8fd8\u4e0d\u591f\uff0c\u76f4\u63a5\u66ff\u4f60\u505a\uff1aSpeculation \u7cfb\u7edf"),

  p("\u5efa\u8bae\u53ea\u662f\u5f00\u80c3\u83dc\u3002Claude Code \u771f\u6b63\u6fc0\u8fdb\u7684\u8bbe\u8ba1\u5728\u4e0b\u4e00\u6b65\uff1a\u63a8\u6d4b\u6267\u884c\uff08Speculation\uff09\u3002\u5f53 Prompt Suggestion \u751f\u6210\u4e00\u6761\u5efa\u8bae\u4e4b\u540e\uff0c\u7cfb\u7edf\u4e0d\u662f\u5e72\u7b49\u7740\u7528\u6237\u6309 Tab \u63a5\u53d7\u3002\u5b83\u7acb\u523b\u542f\u52a8\u4e00\u4e2a\u9694\u79bb\u7684 forked agent\uff0c\u62ff\u8fd9\u6761\u5efa\u8bae\u5f53\u4f5c\u7528\u6237\u7684\u771f\u5b9e\u8f93\u5165\uff0c\u5728\u540e\u53f0\u6267\u884c\u3002"),

  p("\u6e90\u7801\u4e2d startSpeculation \u51fd\u6570\u7684\u6d41\u7a0b\uff1a"),
  li("\u751f\u6210\u4e00\u4e2a\u552f\u4e00 speculation ID\uff08UUID \u524d 8 \u4f4d\uff09"),
  li("\u5728\u4e34\u65f6\u76ee\u5f55\u521b\u5efa overlay \u6587\u4ef6\u7cfb\u7edf\uff1a~/.claude/speculation/<pid>/<id>/"),
  li("fork \u4e00\u4e2a\u5b50 agent\uff0c\u628a\u5efa\u8bae\u6587\u672c\u4f5c\u4e3a\u7528\u6237\u6d88\u606f\u4f20\u5165"),
  li("\u5b50 agent \u5f00\u59cb\u6267\u884c\u5de5\u5177\u8c03\u7528\u2014\u2014\u8bfb\u6587\u4ef6\u3001\u641c\u7d22\u4ee3\u7801\u3001\u751a\u81f3\u7f16\u8f91\u6587\u4ef6\uff08\u5199\u5165 overlay\uff09"),
  li("\u6bcf\u4e2a\u5de5\u5177\u8c03\u7528\u90fd\u7ecf\u8fc7\u4e25\u683c\u7684\u6743\u9650\u68c0\u67e5"),
  li("\u6267\u884c\u6700\u591a 20 \u8f6e\uff0c\u6216 100 \u6761\u6d88\u606f"),

  p("\u7b49\u7528\u6237\u51b3\u5b9a\u7684\u65f6\u5019\uff0c\u4e24\u79cd\u7ed3\u5c40\uff1a"),

  pb("\u6309 Tab \u63a5\u53d7\u5efa\u8bae \u2192 ", "overlay \u91cc\u4fee\u6539\u8fc7\u7684\u6587\u4ef6\u590d\u5236\u56de\u4e3b\u6587\u4ef6\u7cfb\u7edf", "\uff0c\u63a8\u6d4b\u8fc7\u7a0b\u4e2d\u7684\u6240\u6709\u6d88\u606f\u6ce8\u5165\u5bf9\u8bdd\u5386\u53f2\uff0c\u5c31\u597d\u50cf\u7528\u6237\u4eb2\u81ea\u6267\u884c\u4e86\u4e00\u6837\u3002"),
  pb("\u7528\u6237\u81ea\u5df1\u6253\u4e86\u522b\u7684\u8bdd \u2192 ", "overlay \u6574\u4e2a\u5220\u9664\uff0c\u63a8\u6d4b\u8fc7\u7a0b\u4e2d\u7684\u6d88\u606f\u5168\u90e8\u4e22\u5f03", "\u3002\u51e0\u79d2\u5230\u51e0\u5341\u79d2\u7684\u8ba1\u7b97\u8d44\u6e90\uff0c\u8bf4\u6254\u5c31\u6254\u3002"),

  pb("\u8fd9\u5c31\u662f\u5206\u652f\u9884\u6d4b\u7684\u7cbe\u9ad3\uff1a", "\u8d4c\u8d62\u4e86\uff0c\u4f60\u7701\u4e86\u7b49\u5f85\u65f6\u95f4\uff1b\u8d4c\u8f93\u4e86\uff0c\u4f60\u4ec0\u4e48\u90fd\u6ca1\u611f\u89c9\u5230\u3002"),

  img("02_\u63a8\u6d4b\u6267\u884c\u72b6\u6001\u673a", 520),

  div(),

  // ====== 03 ======
  h1("03  \u6c99\u7bb1\u91cc\u7684\u5e73\u884c\u5b87\u5b99\uff1aOverlay \u6587\u4ef6\u7cfb\u7edf"),

  p("\u63a8\u6d4b\u6267\u884c\u6700\u5927\u7684\u5de5\u7a0b\u6311\u6218\u4e0d\u662f\u9884\u6d4b\u2014\u2014\u9884\u6d4b\u9519\u4e86\u5927\u4e0d\u4e86\u4e22\u6389\u3002\u771f\u6b63\u5371\u9669\u7684\u662f\uff1a\u5982\u679c\u63a8\u6d4b\u8fc7\u7a0b\u4e2d\u4fee\u6539\u4e86\u6587\u4ef6\uff0c\u7136\u540e\u9884\u6d4b\u9519\u4e86\uff0c\u600e\u4e48\u56de\u6eda\uff1f"),

  pb("Claude Code \u7684\u89e3\u6cd5\u501f\u9274\u4e86\u5bb9\u5668\u6280\u672f\u4e2d\u7684 overlay filesystem \u601d\u60f3\uff0c\u6838\u5fc3\u673a\u5236\u662f ", "Copy-on-Write\uff08\u5199\u65f6\u590d\u5236\uff09", "\u3002"),

  li("\u7b2c\u4e00\u6b21\u5199\u67d0\u4e2a\u6587\u4ef6\u65f6\uff1a\u5148\u628a\u539f\u6587\u4ef6\u590d\u5236\u5230 overlay \u76ee\u5f55\uff0c\u7136\u540e\u5728\u526f\u672c\u4e0a\u4fee\u6539"),
  li("\u540e\u7eed\u8bfb\u540c\u4e00\u4e2a\u6587\u4ef6\u65f6\uff1a\u5982\u679c\u4e4b\u524d\u88ab\u5199\u8fc7\uff0c\u4ece overlay \u8bfb\uff1b\u6ca1\u88ab\u5199\u8fc7\uff0c\u4ece\u4e3b\u6587\u4ef6\u7cfb\u7edf\u8bfb"),
  li("\u5199\u5de5\u4f5c\u76ee\u5f55\u4e4b\u5916\u7684\u6587\u4ef6\uff1a\u76f4\u63a5\u62d2\u7edd\uff0c\u65e0\u6761\u4ef6"),

  p("\u8fd9\u5957\u673a\u5236\u7684\u7cbe\u5999\u4e4b\u5904\u5728\u4e8e\u6210\u672c\u6781\u4f4e\u3002\u4e0d\u9700\u8981\u771f\u6b63\u7684\u6587\u4ef6\u7cfb\u7edf\u5feb\u7167\uff0c\u4e0d\u9700\u8981 git stash\uff0c\u4e0d\u9700\u8981 Docker \u5bb9\u5668\u3002\u5c31\u662f\u4e00\u4e2a\u4e34\u65f6\u76ee\u5f55 + \u8def\u5f84\u91cd\u5b9a\u5411\u3002\u63a5\u53d7\u65f6 copyOverlayToMain \u628a\u6587\u4ef6\u590d\u5236\u56de\u53bb\uff0c\u62d2\u7edd\u65f6 rm -rf \u6574\u4e2a\u76ee\u5f55\u3002"),

  ...code([
    "\u4e3b\u6587\u4ef6\u7cfb\u7edf\uff08\u771f\u5b9e\u4e16\u754c\uff09          Overlay\uff08\u5e73\u884c\u5b87\u5b99\uff09",
    "\u251c\u2500\u2500 src/                       \u251c\u2500\u2500 src/",
    "\u2502   \u251c\u2500\u2500 app.ts \u2500\u2500\u2500\u2500\u8bfb\u2500\u2500\u2500\u2192      \u2502   \u251c\u2500\u2500 app.ts\uff08\u526f\u672c\uff0c\u88ab\u4fee\u6539\u8fc7\uff09",
    "\u2502   \u251c\u2500\u2500 test.ts \u2500\u2500\u8bfb\u2500\u2500\u2500\u2192       \u2502   \u2502",
    "\u2502   \u2514\u2500\u2500 utils.ts               \u2502   \u2514\u2500\u2500\uff08\u4e0d\u5b58\u5728\uff0c\u4ece\u4e3bFS\u8bfb\uff09",
    "",
    "\u7528\u6237\u6309 Tab \u2500\u2500\u2192 \u590d\u5236\u56de\u6765          \u7528\u6237\u6253\u5b57 \u2500\u2500\u2192 rm -rf \u6574\u4e2a\u76ee\u5f55",
  ]),

  img("03_overlay\u6587\u4ef6\u7cfb\u7edf", 500),

  p("\u4f46 overlay \u53ea\u89e3\u51b3\u4e86\u6587\u4ef6\u64cd\u4f5c\u7684\u53ef\u9006\u6027\u3002\u5bf9\u4e8e\u4e0d\u53ef\u9006\u7684\u64cd\u4f5c\u2014\u2014\u6bd4\u5982\u8fd0\u884c\u4e00\u4e2a\u4f1a\u4fee\u6539\u6570\u636e\u5e93\u7684\u811a\u672c\uff0c\u6216\u8005\u53d1\u9001 HTTP \u8bf7\u6c42\u2014\u2014\u63a8\u6d4b\u6267\u884c\u9009\u62e9\u4e86\u66f4\u7b80\u5355\u7c97\u66b4\u7684\u7b56\u7565\uff1a\u4e0d\u505a\u3002\u78b0\u5230\u8fd9\u7c7b\u64cd\u4f5c\u5c31\u505c\u4e0b\u6765\uff0c\u8bb0\u5f55\u4e00\u4e2a\u201c\u8fb9\u754c\u201d\uff0c\u7b49\u7528\u6237\u786e\u8ba4\u540e\u518d\u7ee7\u7eed\u3002"),

  div(),

  // ====== 04 ======
  h1("04  \u4e09\u5c42\u63a8\u6d4b\u6d41\u6c34\u7ebf\uff1a\u7cfb\u7edf\u6027\u6d88\u9664\u7b49\u5f85"),

  p("\u62c6\u5230\u8fd9\u91cc\uff0c\u4e00\u4e2a\u66f4\u5927\u7684\u56fe\u666f\u6d6e\u73b0\u4e86\u3002\u63a8\u6d4b\u6267\u884c\u4e0d\u662f Claude Code \u91cc\u552f\u4e00\u5728\u201c\u62a2\u8dd1\u201d\u7684\u673a\u5236\u3002\u4ece\u5fae\u89c2\u5230\u5b8f\u89c2\uff0c\u81f3\u5c11\u6709\u4e09\u5c42\u6d41\u6c34\u7ebf\u5728\u540c\u65f6\u5de5\u4f5c\uff1a"),

  h3("\u7b2c\u4e00\u5c42\uff1aBash \u5206\u7c7b\u5668\u9884\u53d6\uff08\u5fae\u79d2\u7ea7\uff09"),

  p("\u5f53\u6a21\u578b\u8fd8\u5728\u6d41\u5f0f\u8f93\u51fa Bash \u547d\u4ee4\u7684\u53c2\u6570\u65f6\u2014\u2014\u53c2\u6570\u8fd8\u6ca1\u8f93\u51fa\u5b8c\u2014\u2014\u7cfb\u7edf\u5c31\u5df2\u7ecf\u5f00\u59cb\u5e76\u884c\u8fd0\u884c\u5b89\u5168\u5206\u7c7b\u5668\u4e86\u3002\u4e32\u884c\u53d8\u5e76\u884c\uff0c\u7528\u6237\u65e0\u611f\u4f46\u7701\u4e86\u4e00\u4e2a\u5b8c\u6574\u7684\u5206\u7c7b\u5668\u8c03\u7528\u5ef6\u8fdf\u3002"),

  h3("\u7b2c\u4e8c\u5c42\uff1aMemory/Skill \u9884\u53d6\uff08\u767e\u6beb\u79d2\u7ea7\uff09"),

  p("\u6bcf\u4e2a\u7528\u6237 turn \u5f00\u59cb\u65f6\uff0c\u7cfb\u7edf\u542f\u52a8\u5f02\u6b65\u67e5\u8be2\u53bb\u627e\u76f8\u5173\u8bb0\u5fc6\u6587\u4ef6\u3002\u8fd9\u4e2a\u67e5\u8be2\u4e0d\u963b\u585e\u4e3b\u5faa\u73af\u2014\u2014\u6bcf\u6b21\u8fed\u4ee3\u7528 zero-wait \u65b9\u5f0f\u68c0\u67e5\u7ed3\u679c\u3002"),

  q("the prefetch gets as many chances as there are loop iterations before the turn ends"),
  qt("\u9884\u53d6\u5728 turn \u7ed3\u675f\u524d\u6709\u548c\u5faa\u73af\u8fed\u4ee3\u6b21\u6570\u4e00\u6837\u591a\u7684\u673a\u4f1a"),

  pb("Skill Discovery \u540c\u6837\u7684\u6a21\u5f0f\u3002\u6e90\u7801\u63d0\u5230\u4e00\u4e2a\u5173\u952e\u6570\u636e\uff1a\u4e4b\u524d\u7684\u963b\u585e\u5f0f skill \u53d1\u73b0\u5728\u751f\u4ea7\u73af\u5883\u4e2d ", "97% \u7684\u8c03\u7528\u4ec0\u4e48\u90fd\u6ca1\u627e\u5230", "\u3002\u628a\u5b83\u6539\u6210\u9884\u53d6\u540e\uff0c\u90a3 97% \u7684\u7a7a\u7b49\u5f85\u5c31\u88ab\u85cf\u5230\u4e86\u6a21\u578b\u63a8\u7406\u7684\u65f6\u95f4\u91cc\u3002"),

  h3("\u7b2c\u4e09\u5c42\uff1a\u63a8\u6d4b\u6267\u884c + \u9012\u5f52 Pipelining\uff08\u79d2\u7ea7\uff09"),

  p("\u8fd9\u662f\u6700\u6fc0\u8fdb\u7684\u4e00\u5c42\u3002\u63a8\u6d4b\u6267\u884c\u5b8c\u6210\u540e\uff0c\u7cfb\u7edf\u4e0d\u662f\u505c\u4e0b\u6765\u7b49\u7528\u6237\u2014\u2014\u5b83\u7acb\u523b\u751f\u6210\u4e0b\u4e00\u6761\u5efa\u8bae\uff0c\u7136\u540e\u5f00\u59cb\u63a8\u6d4b\u6267\u884c\u90a3\u6761\u5efa\u8bae\u3002"),

  ...code([
    "\u7528\u6237\u8f93\u5165 \u2192 Claude \u56de\u590d \u2192 \u751f\u6210\u5efa\u8bae A \u2192 \u63a8\u6d4b\u6267\u884c A",
    "                                         \u2193 \uff08A \u6267\u884c\u5b8c\u6bd5\uff09",
    "                                    \u751f\u6210\u5efa\u8bae B \u2192 \u63a8\u6d4b\u6267\u884c B",
    "                                                    \u2193 \uff08B \u6267\u884c\u5b8c\u6bd5\uff09",
    "                                               \u751f\u6210\u5efa\u8bae C \u2192 ...",
  ]),

  p("\u5bf9\u4e8e\u9ad8\u5ea6\u53ef\u9884\u6d4b\u7684\u5de5\u4f5c\u6d41\uff08\u6bd4\u5982\u201c\u6539 bug \u2192 \u8dd1\u6d4b\u8bd5 \u2192 \u63d0\u4ea4 \u2192 \u63a8\u9001\u201d\uff09\uff0c\u6574\u6761\u94fe\u8def\u53ef\u4ee5\u5728\u7528\u6237\u7b2c\u4e00\u6b21\u6309 Tab \u4e4b\u524d\u5c31\u5168\u90e8\u9884\u6267\u884c\u5b8c\u6bd5\u3002"),

  img("04_\u4e09\u5c42\u6d41\u6c34\u7ebf\u65f6\u5e8f", 500),

  pb("\u8fd9\u8ba9\u4eba\u60f3\u8d77 CPU \u6d41\u6c34\u7ebf\u7684\u6df1\u5ea6\u3002Claude Code \u7684\u4e09\u5c42\u6d41\u6c34\u7ebf\u662f\u540c\u4e00\u4e2a\u601d\u8def\uff1a", "\u4eba\u7c7b\u601d\u8003\u7684\u6bcf\u4e00\u6beb\u79d2\uff0c\u673a\u5668\u90fd\u4e0d\u5e94\u8be5\u95f2\u7740\u3002"),

  div(),

  // ====== 05 ======
  h1("05  Prompt Cache \u590d\u7528\uff1a\u63a8\u6d4b\u6267\u884c\u7684\u7ecf\u6d4e\u5b66"),

  pb("\u63a8\u6d4b\u6267\u884c\u542c\u8d77\u6765\u5f88\u9177\uff0c\u4f46\u6709\u4e00\u4e2a\u5173\u952e\u95ee\u9898\uff1a", "\u5b83\u5212\u7b97\u5417\uff1f"),

  p("\u6bcf\u6b21\u63a8\u6d4b\u6267\u884c\u90fd\u662f\u4e00\u6b21\u5b8c\u6574\u7684 forked agent \u8c03\u7528\u3002\u5982\u679c\u9884\u6d4b\u51c6\u786e\u7387\u53ea\u6709 30%\uff0c\u90a3 70% \u7684\u63a8\u6d4b\u8c03\u7528\u90fd\u662f\u6d6a\u8d39\u3002Claude Code \u7684\u7b54\u6848\u662f prompt cache \u590d\u7528\u3002"),

  p("forkedAgent.ts \u91cc\u5b9a\u4e49\u4e86\u4e00\u4e2a CacheSafeParams \u7c7b\u578b\uff0c\u5305\u542b\u4e94\u4e2a\u5b57\u6bb5\uff1a\u7cfb\u7edf\u63d0\u793a\u8bcd\u3001\u7528\u6237\u4e0a\u4e0b\u6587\u3001\u7cfb\u7edf\u4e0a\u4e0b\u6587\u3001\u5de5\u5177\u4f7f\u7528\u4e0a\u4e0b\u6587\u3001\u7236\u8fdb\u7a0b\u5bf9\u8bdd\u5386\u53f2\u3002\u8fd9\u4e94\u4e2a\u5b57\u6bb5\u5fc5\u987b\u548c\u7236\u8fdb\u7a0b\u5b8c\u5168\u4e00\u81f4\uff0c\u624d\u80fd\u547d\u4e2d prompt cache\u3002"),

  q("PR #18143 tried effort:'low' and caused a 45x spike in cache writes (92.7% -> 61% hit rate)."),
  qt("\u6709\u4eba\u5c1d\u8bd5\u8bbe\u7f6e effort:'low' \u6765\u7701 token\uff0c\u7ed3\u679c cache \u547d\u4e2d\u7387\u4ece 92.7% \u66b4\u8dcc\u5230 61%\uff0ccache write \u98d9\u5347 45 \u500d\u3002"),

  pb("\u8fd9\u4e2a\u4e8b\u6545\u63ed\u793a\u4e86\u63a8\u6d4b\u6267\u884c\u7684\u7ecf\u6d4e\u5b66\u672c\u8d28\uff1a", "fork \u7684\u8fb9\u9645\u6210\u672c\u53d6\u51b3\u4e8e cache hit rate", "\u3002\u5728 92.7% \u7684 cache hit rate \u4e0b\uff0cfork \u53ea\u9700\u4e3a\u65b0\u589e\u5185\u5bb9\u4ed8\u8d39\uff0c\u6210\u672c\u6781\u4f4e\u3002\u4e00\u65e6 cache \u5931\u6548\uff0cfork \u7684\u6210\u672c\u5c31\u7b49\u4e8e\u4e00\u6b21\u5b8c\u6574\u7684\u5bf9\u8bdd\u8bf7\u6c42\u3002"),

  img("05_cache\u590d\u7528\u5bf9\u6bd4", 450),

  p("\u6240\u4ee5\u6e90\u7801\u91cc\u5230\u5904\u90fd\u662f\u5bf9 cache \u7684\u5c0f\u5fc3\u7ffc\u7ffc\uff1a"),
  li("fork \u4e0d\u8bbe\u7f6e maxOutputTokens\u2014\u2014\u56e0\u4e3a\u8fd9\u4f1a\u5f71\u54cd budget_tokens\uff0c\u8fdb\u800c\u7834\u574f cache key"),
  li("fork \u4e0d\u8986\u76d6 effortValue\u2014\u2014\u540c\u4e0a"),
  li("\u5efa\u8bae\u751f\u6210\u4f7f\u7528 skipCacheWrite: true\u2014\u2014\u56e0\u4e3a\u5efa\u8bae\u7684 fork \u662f\u201c\u7528\u5b8c\u5373\u5f03\u201d\u7684"),
  li("\u5982\u679c\u7236\u8fdb\u7a0b\u7684\u672a\u7f13\u5b58 token \u8d85\u8fc7 10,000\uff0c\u76f4\u63a5\u653e\u5f03\u751f\u6210\u5efa\u8bae"),

  pb("\u8fd9\u4e9b\u7ec6\u8282\u52a0\u5728\u4e00\u8d77\uff0c\u753b\u51fa\u4e86\u4e00\u6761\u6e05\u6670\u7684\u8bbe\u8ba1\u7ea2\u7ebf\uff1a", "\u80fd\u590d\u7528\u7f13\u5b58\u624d\u505a\u63a8\u6d4b\uff0c\u4e0d\u80fd\u590d\u7528\u5c31\u4e0d\u505a\u3002\u7ecf\u6d4e\u5b66\u5148\u4e8e\u529f\u80fd\u3002"),

  div(),

  // ====== 06 ======
  h1("06  \u8fb9\u754c\u4e0e\u514b\u5236\uff1a\u63a8\u6d4b\u6267\u884c\u7684\u5239\u8f66\u7cfb\u7edf"),

  pb("", "\u77e5\u9053\u4ec0\u4e48\u4e0d\u80fd\u63a8\u6d4b\uff0c\u6bd4\u77e5\u9053\u80fd\u63a8\u6d4b\u4ec0\u4e48\u66f4\u91cd\u8981\u3002"),

  p("speculation.ts \u91cc\u5b9a\u4e49\u4e86\u4e24\u7ec4\u5de5\u5177\u767d\u540d\u5355\uff1a"),

  li("\u5b89\u5168\u53ea\u8bfb\u5de5\u5177\uff08\u81ea\u7531\u4f7f\u7528\uff09\uff1aRead\u3001Glob\u3001Grep\u3001ToolSearch\u3001LSP\u3001TaskGet\u3001TaskList"),
  li("\u5199\u5de5\u5177\uff08\u91cd\u5b9a\u5411\u5230 overlay\uff09\uff1aEdit\u3001Write\u3001NotebookEdit\u2014\u2014\u4f46\u524d\u63d0\u662f\u6743\u9650\u6a21\u5f0f\u5141\u8bb8"),
  li("Bash \u547d\u4ee4\uff1a\u53ea\u5141\u8bb8\u53ea\u8bfb\u547d\u4ee4\uff0c\u4efb\u4f55\u53ef\u80fd\u4ea7\u751f\u526f\u4f5c\u7528\u7684\u547d\u4ee4\u90fd\u88ab\u62d2\u7edd"),
  li("\u6240\u6709\u5176\u4ed6\u5de5\u5177\uff1a\u65e0\u6761\u4ef6\u62d2\u7edd\u3002WebFetch\u3001Agent\u3001MCP \u5de5\u5177\u2014\u2014\u78b0\u5230\u5c31\u505c"),

  p("\u6bcf\u79cd\u505c\u6b62\u90fd\u88ab\u5206\u7c7b\u4e3a\u4e00\u4e2a\u5b8c\u6210\u8fb9\u754c\uff08CompletionBoundary\uff09\uff1abash\u3001edit\u3001denied_tool\u3001complete\u3002\u8fd9\u4e9b\u8fb9\u754c\u6570\u636e\u5168\u90e8\u901a\u8fc7 tengu_speculation \u4e8b\u4ef6\u4e0a\u62a5\u5206\u6790\u3002"),

  img("06_\u6743\u9650\u8fb9\u754c\u77e9\u9635", 420),

  p("\u4e00\u4e2a\u7ec6\u8282\u503c\u5f97\u6ce8\u610f\uff1a\u63a8\u6d4b\u6267\u884c\u4e2d\u7684 Bash \u547d\u4ee4\u4e0d\u4ec5\u8981\u901a\u8fc7\u53ea\u8bfb\u68c0\u67e5\uff0c\u8fd8\u8981\u901a\u8fc7 commandHasAnyCd \u68c0\u6d4b\u2014\u2014\u5982\u679c\u547d\u4ee4\u91cc\u6709 cd\uff0c\u4e5f\u4f1a\u88ab\u62e6\u622a\u3002\u56e0\u4e3a\u6539\u53d8\u5de5\u4f5c\u76ee\u5f55\u4f1a\u5f71\u54cd\u540e\u7eed\u6240\u6709\u6587\u4ef6\u64cd\u4f5c\u7684\u8def\u5f84\u89e3\u6790\u3002"),

  pb("\u8fd9\u5957\u8fb9\u754c\u8bbe\u8ba1\u7684\u54f2\u5b66\u662f", "\u201c\u5b89\u5168\u9ed8\u8ba4\u62d2\u7edd\u201d\uff08deny by default\uff09", "\u2014\u2014\u4e0d\u5728\u767d\u540d\u5355\u91cc\u7684\u4e00\u5f8b\u4e0d\u505a\u3002\u5b81\u53ef\u5c11\u63a8\u6d4b\u51e0\u6b65\uff0c\u4e5f\u4e0d\u5192\u4ea7\u751f\u4e0d\u53ef\u9006\u526f\u4f5c\u7528\u7684\u98ce\u9669\u3002"),

  div(),

  // ====== 07 ======
  h1("07  \u5bf9\u4ece\u4e1a\u8005\u610f\u5473\u7740\u4ec0\u4e48"),

  pb("\u8fd9\u5957\u7cfb\u7edf\u80cc\u540e\u6709\u4e00\u4e2a\u6e05\u6670\u7684\u4ea7\u54c1\u6d1e\u5bdf\uff1a", "\u5f00\u53d1\u8005\u5728\u7f16\u7a0b\u5de5\u4f5c\u6d41\u4e2d\u7684\u201c\u64cd\u4f5c\u7c7b\u201d\u52a8\u4f5c\u662f\u9ad8\u5ea6\u53ef\u9884\u6d4b\u7684\u3002"),

  p("\u5199\u5b8c\u4ee3\u7801\u4e4b\u540e\uff0c\u4e0b\u4e00\u6b65\u5927\u6982\u7387\u662f\u201c\u8dd1\u6d4b\u8bd5\u201d\u3002\u6d4b\u8bd5\u901a\u8fc7\u4e4b\u540e\uff0c\u5927\u6982\u7387\u662f\u201c\u63d0\u4ea4\u201d\u3002\u63d0\u4ea4\u4e4b\u540e\uff0c\u5927\u6982\u7387\u662f\u201c\u63a8\u9001\u201d\u3002\u8fd9\u4e9b\u64cd\u4f5c\u4e0d\u9700\u8981\u521b\u9020\u529b\uff0c\u4e0d\u9700\u8981\u5224\u65ad\u529b\uff0c\u53ea\u9700\u8981\u6709\u4eba\uff08\u6216\u6709 AI\uff09\u6309\u7167\u60ef\u6027\u53bb\u505a\u3002"),

  ...code([
    "After code written \u2192 \"try it out\"",
    "Task complete, obvious follow-up \u2192 \"commit this\" or \"push it\"",
    "Claude asks to continue \u2192 \"yes\" or \"go ahead\"",
    "After error or misunderstanding \u2192 silence (let them assess/correct)",
  ]),

  pb("\u524d\u4e09\u6761\u662f\u53ef\u9884\u6d4b\u7684\u64cd\u4f5c\u6d41\uff0c\u6700\u540e\u4e00\u6761\u662f\u9700\u8981\u4eba\u7c7b\u5224\u65ad\u7684\u573a\u666f\u3002\u8fd9\u6761\u8fb9\u754c\u7684\u4f4d\u7f6e\uff0c\u6070\u6070\u5b9a\u4e49\u4e86 AI \u7f16\u7a0b\u52a9\u624b\u7684\u4e0b\u4e00\u4e2a\u8fdb\u5316\u65b9\u5411\uff1a", "\u63a5\u7ba1\u64cd\u4f5c\u6d41\uff0c\u91ca\u653e\u5224\u65ad\u529b\u3002"),

  p("Google \u5728 2022 \u5e74\u53d1\u8868\u7684 Speculative Decoding \u8bba\u6587\uff0c\u628a CPU \u63a8\u6d4b\u6267\u884c\u7684\u601d\u60f3\u7528\u5728\u4e86 LLM \u63a8\u7406\u52a0\u901f\u4e0a\u3002Claude Code \u505a\u4e86\u7b2c\u4e8c\u6b21\u8de8\u57df\u8fc1\u79fb\uff1a\u4ece\u6a21\u578b\u63a8\u7406\u5c42\u5230\u4eba\u673a\u4ea4\u4e92\u5c42\u2014\u2014\u7528 LLM \u9884\u6d4b\u4eba\u7c7b\u7684\u610f\u56fe\u3002"),

  pb("\u4e24\u6b21\u8fc1\u79fb\u7684\u5171\u540c\u903b\u8f91\u662f\uff1a", "\u5728\u4efb\u4f55\u5b58\u5728\u7b49\u5f85\u7684\u5730\u65b9\uff0c\u90fd\u53ef\u4ee5\u7528\u9884\u6d4b+\u56de\u6eda\u6765\u6362\u53d6\u901f\u5ea6\u3002"),

  p("\u5bf9\u4e8e AI \u4ea7\u54c1\u7684\u4ece\u4e1a\u8005\u6765\u8bf4\uff0c\u8fd9\u610f\u5473\u7740\u201c\u4eba\u673a\u4ea4\u4e92\u5ef6\u8fdf\u201d\u6b63\u5728\u6210\u4e3a\u548c\u201c\u6a21\u578b\u80fd\u529b\u201d\u540c\u7b49\u91cd\u8981\u7684\u7ade\u4e89\u7ef4\u5ea6\u3002\u6a21\u578b\u7684\u80fd\u529b\u5dee\u8ddd\u5728\u7f29\u5c0f\uff0c\u4f46\u7528\u6237\u4f53\u9a8c\u7684\u5dee\u8ddd\u53ef\u4ee5\u901a\u8fc7\u5de5\u7a0b\u624b\u6bb5\u62c9\u5f00\u3002"),

  pb("Claude Code \u7684\u610f\u56fe\u6d41\u6c34\u7ebf\u7ed9\u51fa\u4e86\u4e00\u4e2a\u65b9\u5411\uff1a", "\u4e0d\u8981\u8ba9\u4eba\u7b49\u673a\u5668\uff0c\u8ba9\u673a\u5668\u62a2\u8dd1\u4eba\u3002"),

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
    children: [new TextRun({ text: "\u7ed3  \u8bed", font: F.cn, size: 28, bold: true, color: C.accent })],
  }),
  new Paragraph({
    spacing: { before: 80, after: 80, line: 380 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: "\u4ece CPU \u7684\u5206\u652f\u9884\u6d4b\u5230 LLM \u7684 Speculative Decoding\uff0c\u518d\u5230 Claude Code \u7684\u610f\u56fe\u6d41\u6c34\u7ebf\u2014\u2014\u540c\u4e00\u4e2a\u601d\u60f3\u5b8c\u6210\u4e86\u4e09\u6b21\u8de8\u57df\u8fc1\u79fb\u3002\u6bcf\u4e00\u6b21\u8fc1\u79fb\u7684\u6838\u5fc3\u90fd\u662f\uff1a\u7528\u9884\u6d4b\u6362\u65f6\u95f4\uff0c\u7528\u56de\u6eda\u4fdd\u5b89\u5168\u3002", font: F.body, size: 21, color: C.body })],
  }),
  ...([
    ["1.  ", "\u610f\u56fe\u6d41\u6c34\u7ebf\u662f AI \u5de5\u5177\u7684\u4e0b\u4e00\u4e2a\u7ade\u4e89\u7ef4\u5ea6\u3002", "\u4e0d\u662f\u66f4\u806a\u660e\uff0c\u800c\u662f\u66f4\u5feb\u2014\u2014\u8ba9\u4eba\u611f\u89c9\u66f4\u5feb\u3002"],
    ["2.  ", "\u7ecf\u6d4e\u5b66\u5148\u4e8e\u529f\u80fd\u3002", "\u80fd\u590d\u7528\u7f13\u5b58\u624d\u505a\u63a8\u6d4b\uff0c\u4e0d\u80fd\u590d\u7528\u5c31\u4e0d\u505a\u3002"],
    ["3.  ", "\u77e5\u9053\u4ec0\u4e48\u4e0d\u80fd\u63a8\u6d4b\uff0c\u6bd4\u77e5\u9053\u80fd\u63a8\u6d4b\u4ec0\u4e48\u66f4\u91cd\u8981\u3002", "Deny by default\uff0c\u5b89\u5168\u7b2c\u4e00\u3002"],
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
    children: [new TextRun({ text: "\u672c\u6587\u4e3a AI Force 2026 \u524d\u6cbf\u5206\u4eab\u7cfb\u5217", font: F.body, size: 18, color: C.light })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [
      new TextRun({ text: "\u539f\u6587\u94fe\u63a5\uff1a", font: F.body, size: 18, color: C.light }),
      new TextRun({ text: COVER_META.originalUrl, font: F.en, size: 18, color: C.accent }),
    ],
  }),
];

// ============================================================
//  写入结语和脚注到 MD
// ============================================================
mdLines.push("\n---\n");
mdLines.push("\n## \u7ed3\u8bed\n");
mdLines.push("\u4ece CPU \u7684\u5206\u652f\u9884\u6d4b\u5230 LLM \u7684 Speculative Decoding\uff0c\u518d\u5230 Claude Code \u7684\u610f\u56fe\u6d41\u6c34\u7ebf\u2014\u2014\u540c\u4e00\u4e2a\u601d\u60f3\u5b8c\u6210\u4e86\u4e09\u6b21\u8de8\u57df\u8fc1\u79fb\u3002\u6bcf\u4e00\u6b21\u8fc1\u79fb\u7684\u6838\u5fc3\u90fd\u662f\uff1a\u7528\u9884\u6d4b\u6362\u65f6\u95f4\uff0c\u7528\u56de\u6eda\u4fdd\u5b89\u5168\u3002\n");
mdLines.push("\n**\u4e09\u4e2a\u5173\u952e\u542f\u793a\uff1a**\n");
mdLines.push("1. **\u610f\u56fe\u6d41\u6c34\u7ebf\u662f AI \u5de5\u5177\u7684\u4e0b\u4e00\u4e2a\u7ade\u4e89\u7ef4\u5ea6\u3002** \u4e0d\u662f\u66f4\u806a\u660e\uff0c\u800c\u662f\u66f4\u5feb\u2014\u2014\u8ba9\u4eba\u611f\u89c9\u66f4\u5feb\u3002");
mdLines.push("2. **\u7ecf\u6d4e\u5b66\u5148\u4e8e\u529f\u80fd\u3002** \u80fd\u590d\u7528\u7f13\u5b58\u624d\u505a\u63a8\u6d4b\uff0c\u4e0d\u80fd\u590d\u7528\u5c31\u4e0d\u505a\u3002");
mdLines.push("3. **\u77e5\u9053\u4ec0\u4e48\u4e0d\u80fd\u63a8\u6d4b\uff0c\u6bd4\u77e5\u9053\u80fd\u63a8\u6d4b\u4ec0\u4e48\u66f4\u91cd\u8981\u3002** Deny by default\uff0c\u5b89\u5168\u7b2c\u4e00\u3002\n");
mdLines.push("---\n");
mdLines.push(`\u539f\u6587\u94fe\u63a5\uff1a${COVER_META.originalUrl}  `);
mdLines.push(`Claude Code \u6e90\u7801\u62c6\u89e3 #12 \u00b7 \u6574\u7406\uff1aAI Force`);

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
      properties: {
        titlePage: true,
        page: { margin: PAGE_MARGIN },
      },
      children: coverChildren,
    },
    {
      properties: {
        page: { margin: PAGE_MARGIN },
      },
      children: bodyChildren,
    },
  ],
});

const outBase = process.argv[2] || path.join(__dirname, "../../output");
const docxPath = outBase.endsWith(".docx") ? outBase : `${outBase}.docx`;
const mdPath = outBase.endsWith(".docx")
  ? outBase.replace(/\.docx$/, ".md")
  : `${outBase}.md`;

Packer.toBuffer(document).then((buf) => {
  fs.writeFileSync(docxPath, buf);
  console.log(`docx: ${docxPath}`);

  fs.writeFileSync(mdPath, mdLines.join("\n"));
  console.log(`md:   ${mdPath}`);
});
