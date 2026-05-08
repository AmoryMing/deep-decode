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

const PAGE_MARGIN = {
  top: convertInchesToTwip(1), bottom: convertInchesToTwip(0.8),
  left: convertInchesToTwip(1.1), right: convertInchesToTwip(1.1),
};

// Components
const h1 = (t) => new Paragraph({
  spacing: { before: 400, after: 200 },
  children: [new TextRun({ text: t, font: F.cn, size: 36, bold: true, color: C.title })],
});
const h2 = (t) => new Paragraph({
  spacing: { before: 360, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } },
  children: [new TextRun({ text: t, font: F.cn, size: 28, bold: true, color: C.accent })],
});
const p = (t) => new Paragraph({
  spacing: { before: 80, after: 80, line: 360 },
  children: [new TextRun({ text: t, font: F.body, size: 21, color: C.body })],
});
const pb = (a, b, c = "") => {
  const ch = [
    new TextRun({ text: a, font: F.body, size: 21, color: C.body }),
    new TextRun({ text: b, font: F.body, size: 21, bold: true, color: C.hi }),
  ];
  if (c) ch.push(new TextRun({ text: c, font: F.body, size: 21, color: C.body }));
  return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: ch });
};
const li = (t) => new Paragraph({
  spacing: { before: 40, after: 40, line: 340 },
  indent: { left: convertInchesToTwip(0.3) },
  children: [
    new TextRun({ text: "\u2022  ", font: F.body, size: 21, color: C.accent }),
    new TextRun({ text: t, font: F.body, size: 21, color: C.body }),
  ],
});
const q = (t) => new Paragraph({
  spacing: { before: 120, after: 0, line: 340 },
  indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) },
  border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } },
  shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
  children: [new TextRun({ text: t, font: F.en, size: 20, italics: true, color: C.quote })],
});
const qt = (t) => new Paragraph({
  spacing: { before: 0, after: 120, line: 340 },
  indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) },
  border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } },
  shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
  children: [
    new TextRun({ text: "-- ", font: F.body, size: 19, color: C.light }),
    new TextRun({ text: t, font: F.body, size: 19, color: C.quote }),
  ],
});
const div = () => new Paragraph({
  spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "\u2022  \u2022  \u2022", font: F.en, size: 20, color: C.border })],
});
const sp = () => new Paragraph({ spacing: { before: 40, after: 40 }, children: [] });
const img = (name, svgHeight = 500) => {
  const pngPath = path.join(PNGS_DIR, `${name}.png`);
  if (!fs.existsSync(pngPath)) { console.warn(`[skip] ${pngPath}`); return sp(); }
  const buf = fs.readFileSync(pngPath);
  const w = convertInchesToTwip(5.8);
  const h = convertInchesToTwip(5.8 * svgHeight / 800);
  return new Paragraph({
    spacing: { before: 160, after: 160 }, alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } })],
  });
};

// ============================================================
const COVER_META = {
  coverImg: "00_\u7CFB\u5217\u5C01\u9762", coverImgH: 450,
  series: "Claude Code \u6E90\u7801\u62C6\u89E3\u7CFB\u5217",
  editor: "\u6574\u7406\uFF1A\u6155\u94ED",
  originalUrl: "https://dev.to/kolkov/we-reverse-engineered-12-versions-of-claude-code-then-it-leaked-its-own-source-code-pij",
};

const coverChildren = [
  (() => {
    const pngPath = path.join(PNGS_DIR, `${COVER_META.coverImg}.png`);
    if (!fs.existsSync(pngPath)) return new Paragraph({ children: [] });
    const buf = fs.readFileSync(pngPath);
    const w = convertInchesToTwip(5.8); const h = convertInchesToTwip(5.8 * COVER_META.coverImgH / 800);
    return new Paragraph({
      spacing: { before: 200, after: 80 }, alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } })],
    });
  })(),
  new Paragraph({
    spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `${COVER_META.series}  \u00B7  ${COVER_META.editor}`, font: F.body, size: 17, color: C.light })],
  }),
];

// ============================================================
const bodyChildren = [
  h2("\u5F00\u7BC7"),
  p("\u540C\u4E00\u884C\u914D\u7F6E\uFF0C\u540C\u4E00\u4E2A\u9519\u8BEF\uFF0C14 \u4E2A\u6708\u540E\u518D\u72AF\u4E00\u6B21\u3002"),
  p("2025 \u5E74 2 \u6708\uFF0C\u5F00\u53D1\u8005 Dave Schumaker \u5728 Claude Code \u7684 cli.mjs \u5E95\u90E8\u53D1\u73B0\u4E86\u4E00\u884C sourceMappingURL\u3002\u987A\u7740\u8FD9\u6761\u7EBF\u7D22\uFF0C\u793E\u533A\u8FD8\u539F\u51FA\u4E86\u65E9\u671F\u7248\u672C\u7684 TypeScript \u6E90\u7801\u3002Anthropic \u5728 v0.2.9 \u4E2D\u5220\u6389\u4E86 sourcemap\uFF0C\u4E0B\u67B6\u4E86\u65E7\u7248\u672C\uFF0C\u4E8B\u60C5\u4F3C\u4E4E\u5C31\u8FD9\u4E48\u8FC7\u53BB\u4E86\u3002"),
  p("14 \u4E2A\u6708\u540E\u7684 2026 \u5E74 3 \u6708 31 \u65E5\uFF0C\u5B89\u5168\u7814\u7A76\u5458 Chaofan Shou \u5728 X \u4E0A\u53D1\u4E86\u4E00\u6761\u5E16\u5B50\uFF0C\u6D4F\u89C8\u91CF\u8D85\u8FC7 2000 \u4E07\uFF1AClaude Code v2.1.88 \u7684 npm \u5305\u91CC\uFF0C\u53C8\u5E26\u4E0A\u4E86 sourcemap\u3002\u8FD9\u4E00\u6B21\uFF0C\u66B4\u9732\u7684\u4E0D\u518D\u662F\u4E00\u4E2A\u7B80\u5355 CLI \u7684\u6E90\u7801\uFF0C\u800C\u662F 1,902 \u4E2A\u6587\u4EF6\u30014512,685 \u884C TypeScript\u2014\u2014\u4E00\u4E2A\u5B8C\u6574\u7684 Agent \u5E73\u53F0\uFF0C\u8FDE\u540C\u5B83\u6240\u6709\u7684\u79D8\u5BC6\u3002"),
  p("\u4E24\u6B21\u6CC4\u9732\u4E4B\u95F4\u7684\u6280\u672F\u9E3F\u6C9F\uFF0C\u6BD4\u6CC4\u9732\u672C\u8EAB\u66F4\u503C\u5F97\u5173\u6CE8\u3002"),

  img("01_\u6CC4\u9732\u65F6\u95F4\u7EBF", 400),
  div(),

  // Chapter 1
  h1("01  \u7B2C\u4E00\u6B21\u6CC4\u9732\uFF1A\u5A74\u513F\u671F\u7684 Claude Code"),
  p("2025 \u5E74 2 \u6708\u7684 Claude Code \u8FD8\u5F88\u5E74\u8F7B\u3002\u7248\u672C\u53F7 v0.2.8\uFF0C\u4EA7\u54C1\u5F62\u6001\u662F\u4E00\u4E2A\u76F8\u5BF9\u7B80\u5355\u7684 CLI \u5DE5\u5177\u2014\u2014\u5355\u6587\u4EF6 cli.mjs\uFF0C\u5185\u5D4C base64 \u7F16\u7801\u7684 sourcemap\u3002"),
  p("\u53D1\u73B0\u6CC4\u9732\u540E\uFF0C\u6FB3\u5927\u5229\u4E9A\u5F00\u53D1\u8005 Geoffrey Huntley \u505A\u4E86\u4E00\u4EF6\u66F4\u6709\u6280\u672F\u542B\u4E49\u7684\u4E8B\uFF1A\u4ED6\u6CA1\u6709\u76F4\u63A5\u4F7F\u7528 sourcemap \u8FD8\u539F\u4EE3\u7801\uFF0C\u800C\u662F\u7528 Claude \u81EA\u5DF1\u6765\u53CD\u7F16\u8BD1\u81EA\u5DF1\u3002"),
  p("Huntley \u79F0\u8FD9\u79CD\u65B9\u6CD5\u4E3A\u201Ccleanroom transpilation\u201D\u2014\u2014\u4E00\u79CD\u7C7B\u4F3C\u4E8E\u82AF\u7247\u884C\u4E1A\u201C\u6D01\u51C0\u5BA4\u9006\u5411\u5DE5\u7A0B\u201D\u7684\u6280\u672F\u8DEF\u7EBF\u3002\u4ED6\u8BA9 LLM \u5145\u5F53\u4E86\u4E24\u7EC4\u4EBA\u7684\u89D2\u8272\uFF1A\u8F93\u5165\u6DF7\u6DC6\u540E\u7684 JavaScript\uFF0C\u8F93\u51FA\u7ED3\u6784\u6E05\u6670\u7684 TypeScript\u3002"),
  q("LLMs are shockingly good at deobfuscation, transpilation and structure to structure conversions."),
  qt("\u5927\u8BED\u8A00\u6A21\u578B\u5728\u53CD\u6DF7\u6DC6\u3001\u8F6C\u8BD1\u548C\u7ED3\u6784\u8F6C\u6362\u65B9\u9762\u7684\u80FD\u529B\u597D\u5F97\u60CA\u4EBA\u3002\u2014\u2014 Geoffrey Huntley"),
  pb("\u8FD9\u4E2A\u65B9\u6CD5\u8BBA\u672C\u8EAB\u5C31\u662F\u4E00\u4E2A\u4FE1\u53F7\u3002\u4ECE\u90A3\u65F6\u8D77\uFF0C\u4EFB\u4F55\u53D1\u5E03\u5230 npm \u7684\u6DF7\u6DC6 JavaScript \u5305\uFF0C\u90FD\u9762\u4E34\u7740\u88AB LLM \u9006\u5411\u8FD8\u539F\u7684\u98CE\u9669\u3002", "\u6DF7\u6DC6\u4E0D\u518D\u662F\u5B89\u5168\u5C4F\u969C\uFF0C\u53EA\u662F\u51CF\u901F\u5E26\u3002"),
  p("\u4F46\u90A3\u65F6\u8FD8\u539F\u51FA\u7684 Claude Code\uFF0C\u4F53\u91CF\u6709\u9650\u3002\u65E9\u671F\u7248\u672C\u7684\u67B6\u6784\u76F8\u5BF9\u76F4\u767D\uFF1A\u4E00\u4E2A\u5BF9\u8BDD\u5FAA\u73AF\u3001\u57FA\u672C\u7684\u5DE5\u5177\u8C03\u7528\u3001\u7B80\u5355\u7684\u6743\u9650\u68C0\u67E5\u3002\u6CA1\u6709\u591A Agent \u534F\u4F5C\uFF0C\u6CA1\u6709\u8BB0\u5FC6\u7CFB\u7EDF\uFF0C\u6CA1\u6709 44 \u4E2A feature flag \u80CC\u540E\u7684\u9690\u85CF\u529F\u80FD\u3002\u90A3\u662F\u4E00\u4E2A\u521A\u51FA\u751F\u7684\u5A74\u513F\u3002"),

  div(),

  // Chapter 2
  h1("02  \u4E2D\u95F4\u5730\u5E26\uFF1A12 \u4E2A\u7248\u672C\u7684\u624B\u672F\u5200\u8FFD\u8E2A"),
  p("\u5927\u591A\u6570\u4EBA\u53EA\u5173\u6CE8\u4E24\u6B21\u6CC4\u9732\u7684\u201C\u5934\u201D\u548C\u201C\u5C3E\u201D\u3002\u4F46\u6709\u4E00\u4E2A\u56E2\u961F\u505A\u4E86\u66F4\u7CBE\u7EC6\u7684\u6D3B\u2014\u2014\u4ED6\u4EEC\u9010\u7248\u672C\u8FFD\u8E2A\u4E86 Claude Code \u4ECE v2.1.74 \u5230 v2.1.88 \u7684 12 \u4E2A\u8FDE\u7EED\u7248\u672C\u3002"),
  p("\u6CA1\u6709 sourcemap \u53EF\u7528\u3002\u9762\u5BF9\u7684\u662F\u4E00\u4E2A 12MB \u7684\u6DF7\u6DC6 cli.js \u6587\u4EF6\u2014\u2014\u6240\u6709\u53D8\u91CF\u540D\u88AB\u66FF\u6362\u6210 X6\u3001K8\u3001b6 \u8FD9\u6837\u7684\u5B57\u7B26\uFF0C\u6BCF\u6B21\u6784\u5EFA\u7684\u53D8\u91CF\u540D\u8FD8\u4E0D\u540C\u3002"),
  p("\u4ED6\u4EEC\u7684\u65B9\u6CD5\u76F8\u5F53\u539F\u59CB\uFF0C\u4F46\u6709\u6548\uFF1A"),
  li("\u5B57\u7B26\u4E32\u5E38\u91CF\u730E\u624B\uFF1A\u5728\u6DF7\u6DC6\u4EE3\u7801\u4E2D\u641C\u7D22 CLAUDE_STREAM_IDLE_TIMEOUT_MS \u8FD9\u6837\u7684\u73AF\u5883\u53D8\u91CF\u540D\uFF0C\u627E\u5230\u951A\u70B9"),
  li("\u82B1\u62EC\u53F7\u6DF1\u5EA6\u8FFD\u8E2A\uFF1A\u5199 Node.js \u811A\u672C\u6570 { \u548C } \u7684\u5D4C\u5957\u5C42\u7EA7\uFF0C\u8FD8\u539F\u51FD\u6570\u8FB9\u754C"),
  li("\u8DE8\u7248\u672C\u53D8\u91CF\u6620\u5C04\uFF1A\u4EBA\u5DE5\u8FFD\u8E2A X6 \u5728\u8FD9\u4E2A\u7248\u672C\u662F\u4EC0\u4E48\uFF0C\u5230\u4E0B\u4E2A\u7248\u672C\u53D8\u6210\u4E86 K8"),
  p("\u66F4\u786C\u6838\u7684\u662F\u4ED6\u4EEC\u9020\u4E86\u4E00\u4E2A\u8BCA\u65AD\u5DE5\u5177 ccdiag\u2014\u2014\u4E00\u4E2A Go CLI\uFF0C\u5206\u6790\u4E86 1,571 \u4E2A\u4F1A\u8BDD\u548C 148,444 \u6B21\u5DE5\u5177\u8C03\u7528\u7684 JSONL \u65E5\u5FD7\u3002"),
  pb("\u8FD9\u5957\u201C\u7248\u672C\u8003\u53E4\u5B66\u201D\u65B9\u6CD5\u6316\u51FA\u4E86\u51E0\u4E2A sourcemap \u6CC4\u9732\u770B\u4E0D\u5230\u7684\u4E1C\u897F\uFF1A", "5.4% \u7684\u5DE5\u5177\u8C03\u7528\u88AB\u9759\u9ED8\u4E22\u5F03", "\uFF0C\u5DE5\u5177\u6267\u884C\u6210\u529F\u4E86\u4F46\u7ED3\u679C\u4ECE\u672A\u8FD4\u56DE\u7ED9\u6A21\u578B\u3002"),
  pb("API \u5931\u8D25\u7387\u8FBE\u5230 ", "16.3%", "\u2014\u2014\u6BCF\u516D\u6B21\u8BF7\u6C42\u5C31\u6709\u4E00\u6B21\u51FA\u95EE\u9898\u3002"),
  p("\u8FD9\u4E9B\u6570\u5B57\u5728 sourcemap \u6CC4\u9732\u7684\u6E90\u7801\u4E2D\u5B8C\u5168\u770B\u4E0D\u5230\uFF0C\u56E0\u4E3A\u5B83\u4EEC\u4E0D\u662F\u4EE3\u7801\u95EE\u9898\uFF0C\u800C\u662F\u8FD0\u884C\u65F6\u884C\u4E3A\u3002\u4EE3\u7801\u9006\u5411\u770B\u5230\u7684\u662F\u84DD\u56FE\uFF0C\u65E5\u5FD7\u9006\u5411\u770B\u5230\u7684\u662F\u5DE5\u5730\u3002"),

  div(),

  // Chapter 3
  h1("03  \u7B2C\u4E8C\u6B21\u6CC4\u9732\uFF1A\u6210\u5E74\u4F53\u7684 Agent \u5E73\u53F0"),
  p("2026 \u5E74 3 \u6708 31 \u65E5\u3002\u5B89\u5168\u7814\u7A76\u5458 Chaofan Shou \u5728 npm \u4E0A\u53D1\u73B0 Claude Code v2.1.88 \u7684\u5305\u91CC\u8EBA\u7740\u4E00\u4E2A 59.8MB \u7684 cli.js.map \u6587\u4EF6\u3002\u5341\u884C\u811A\u672C\u5C31\u80FD\u628A 512,685 \u884C\u6E90\u7801\u539F\u5C01\u4E0D\u52A8\u8FD8\u539F\u51FA\u6765\u3002"),
  p("\u6D88\u606F\u5728 X \u4E0A\u6269\u6563\u540E\uFF0CGitHub \u4E0A\u51E0\u5C0F\u65F6\u5185\u5192\u51FA\u6570\u5341\u4E2A\u955C\u50CF\u4ED3\u5E93\uFF0C\u5176\u4E2D\u4E00\u4E2A\u5728\u4E24\u5C0F\u65F6\u5185\u62FF\u5230 50,000 stars\u3002Anthropic \u5F53\u5929\u64A4\u4E0B\u4E86 .map \u6587\u4EF6\uFF0C\u6B21\u65E5\u53D1\u51FA\u5927\u89C4\u6A21 DMCA \u4E0B\u67B6\u901A\u77E5\u3002\u4F46 npm \u7684\u955C\u50CF\u7F13\u5B58\u673A\u5236\u610F\u5473\u7740\u6E90\u7801\u65E9\u5DF2\u5728\u5168\u7403\u5404\u5730\u7684 registry \u4E2D\u7559\u4E0B\u4E86\u526F\u672C\u3002"),
  p("\u8FD9\u6B21\u66B4\u9732\u7684\uFF0C\u4E0D\u518D\u662F\u90A3\u4E2A\u5A74\u513F\u30021,902 \u4E2A TypeScript \u6587\u4EF6\u300235 \u4E2A\u9876\u5C42\u76EE\u5F55\u3002utils/ \u5360\u4E86 180K \u884C\uFF0Ccomponents/ \u6709 81K \u884C\uFF0Cservices/ 53K \u884C\uFF0Ctools/ 50K \u884C\u3002\u8FD8\u6709\u4E00\u5927\u5806\u4ECE\u672A\u5BF9\u5916\u516C\u5E03\u7684\u9690\u85CF\u7CFB\u7EDF\uFF1AKAIROS \u540E\u53F0 daemon\u3001autoDream \u8BB0\u5FC6\u5F15\u64CE\u3001Buddy \u865A\u62DF\u5BA0\u7269\u3001Undercover \u5367\u5E95\u6A21\u5F0F\u300144 \u4E2A feature flag\u3002"),

  div(),

  // Chapter 4
  h1("04  \u7248\u672C\u8003\u53E4\u5B66\uFF1A\u516D\u7EF4\u6280\u672F\u6F14\u8FDB"),
  p("\u628A\u4E24\u6B21\u6CC4\u9732\u7684\u6280\u672F\u5207\u7247\u5E76\u6392\u6446\u5728\u4E00\u8D77\uFF0C\u5DEE\u8DDD\u4E0D\u662F\u7EBF\u6027\u7684\uFF0C\u662F\u6307\u6570\u7684\u3002"),

  img("02_\u6280\u672F\u6F14\u8FDB\u5BF9\u6BD4", 520),

  pb("\u89C4\u6A21\uFF1A", "\u4ECE\u5355\u6587\u4EF6 CLI \u5230 1,902 \u6587\u4EF6\u3001512K \u884C\u4EE3\u7801\u3002", " 14 \u4E2A\u6708\uFF0C\u4EE3\u7801\u91CF\u81A8\u80C0\u4E86\u81F3\u5C11\u4E24\u4E2A\u6570\u91CF\u7EA7\u3002"),
  pb("\u67B6\u6784\uFF1A", "\u4ECE\u7B80\u5355 while \u5FAA\u73AF\u5230\u4E94\u6B65\u9884\u5904\u7406\u6D41\u6C34\u7EBF", "\u2014\u2014Snip \u88C1\u526A\u3001\u5FAE\u538B\u7F29\u3001\u4E0A\u4E0B\u6587\u6298\u53E0\u3001\u81EA\u52A8\u538B\u7F29\u3001\u7EC4\u88C5\u8BF7\u6C42\u3002"),
  pb("\u5B89\u5168\uFF1A", "\u4ECE\u57FA\u7840\u68C0\u67E5\u5230 9,300 \u884C\u56DB\u5C42\u7EB5\u6DF1\u9632\u5FA1\u3002", " \u9759\u6001\u6A21\u5F0F\u5339\u914D\u2192\u8BED\u4E49\u5206\u6790\u2192AI \u5206\u7C7B\u5668\u2192\u7528\u6237\u786E\u8BA4\u3002"),
  pb("\u8BB0\u5FC6\uFF1A", "\u4ECE\u65E0\u5230\u4E09\u5C42\u4F53\u7CFB", "\u2014\u2014CLAUDE.md + auto memory + autoDream \u8BB0\u5FC6\u5DE9\u56FA\u5F15\u64CE\u3002"),
  pb("Agent\uFF1A", "\u4ECE\u5355\u4F53\u5230\u4E09\u5C42\u67B6\u6784", "\u2014\u2014\u5B50Agent + Fork(\u7F13\u5B58\u5171\u4EAB) + Coordinator(\u591A\u667A\u80FD\u4F53\u534F\u8C03)\u3002"),
  pb("\u9690\u85CF\u529F\u80FD\uFF1A", "\u4ECE\u96F6\u5230 44 \u4E2A feature flags", "\u2014\u2014KAIROS\u3001Buddy\u3001Undercover\u3001Bridge\u3001Voice...\u4E00\u5EA7\u529F\u80FD\u51B0\u5C71\u3002"),
  pb("14 \u4E2A\u6708\uFF0C\u4ECE\u5A74\u513F\u957F\u6210\u4E86\u602A\u7269\u3002", "\u8FD9\u4E2A\u8FDB\u5316\u901F\u5EA6\u672C\u8EAB\u5C31\u662F\u6570\u636E\u70B9\u3002"),

  div(),

  // Chapter 5
  h1("05  \u4E09\u79CD\u9006\u5411\u65B9\u6CD5\u8BBA"),

  img("03_\u9006\u5411\u65B9\u6CD5\u8BBA\u5BF9\u6BD4", 420),

  pb("LLM Cleanroom\uFF08ghuntley\uFF09\uFF1A", "\u7528 AI \u53CD\u7F16\u8BD1 AI\u3002", " \u95E8\u69DB\u4ECE\u201C\u7CBE\u901A\u7F16\u8BD1\u539F\u7406\u201D\u964D\u5230\u201C\u4F1A\u5199 prompt\u201D\u3002"),
  pb("\u624B\u5DE5\u9006\u5411 + \u8FD0\u884C\u65F6\u8BCA\u65AD\uFF08kolkov\uFF09\uFF1A", "\u4EE3\u7801\u662F\u84DD\u56FE\uFF0C\u65E5\u5FD7\u662F\u5DE5\u5730\u3002", " \u6316\u51FA\u4E86 sourcemap \u770B\u4E0D\u5230\u7684\u8FD0\u884C\u65F6\u771F\u76F8\u3002"),
  pb("Sourcemap \u63D0\u53D6\uFF08Chaofan Shou\uFF09\uFF1A", "\u6280\u672F\u542B\u91CF\u6700\u4F4E\u4F46\u4FE1\u606F\u91CF\u6700\u5927\u3002", " \u5341\u884C\u811A\u672C\u8FD8\u539F 51 \u4E07\u884C\u6E90\u7801\u3002"),
  p("\u4E09\u79CD\u65B9\u6CD5\u7684\u4E92\u8865\u5173\u7CFB\u503C\u5F97\u6CE8\u610F\uFF1ALLM cleanroom \u8BC1\u660E\u4E86\u6DF7\u6DC6\u4E0D\u518D\u5B89\u5168\uFF0C\u624B\u5DE5\u9006\u5411\u6316\u51FA\u4E86\u8FD0\u884C\u65F6\u771F\u76F8\uFF0Csourcemap \u63D0\u4F9B\u4E86\u5B8C\u6574\u84DD\u56FE\u3002\u6CA1\u6709\u4EFB\u4F55\u5355\u4E00\u65B9\u6CD5\u80FD\u7ED9\u51FA\u5168\u8C8C\u3002"),

  div(),

  // Chapter 6
  h1("06  \u540C\u4E00\u4E2A\u9519\u8BEF\u72AF\u4E24\u6B21"),
  p("\u8868\u9762\u4E0A\u770B\uFF0C\u4E24\u6B21\u6CC4\u9732\u7684\u6839\u56E0\u90FD\u662F sourcemap \u6CA1\u4ECE\u53D1\u5E03\u5305\u4E2D\u6392\u9664\u3002\u4F46\u6DF1\u6316\u4E00\u5C42\uFF0C\u7B2C\u4E8C\u6B21\u7684\u6280\u672F\u6839\u56E0\u6BD4 .npmignore \u7F3A\u5931\u66F4\u590D\u6742\u3002"),
  pb("Layer5 \u548C NodeSource \u7684\u72EC\u7ACB\u5206\u6790\u90FD\u6307\u51FA\u4E86\u4E00\u4E2A ", "Bun bundler \u7684 bug", "\uFF1A\u5373\u4F7F\u663E\u5F0F\u8BBE\u7F6E development: false\uFF0CBun \u4ECD\u7136\u4F1A\u751F\u6210 sourcemap\u3002"),
  p("\u66F4\u5DE7\u5408\u7684\u662F\u65F6\u95F4\u7EBF\u3002\u540C\u4E00\u5929\u2014\u20142026 \u5E74 3 \u6708 31 \u65E5\u2014\u2014npm \u4E0A\u7684 axios \u5305\u906D\u5230\u4E86\u4F9B\u5E94\u94FE\u653B\u51FB\u3002\u5728 00:21 \u5230 03:29 UTC \u4E4B\u95F4\u5B89\u88C5\u6216\u66F4\u65B0 Claude Code \u7684\u7528\u6237\uFF0C\u53EF\u80FD\u540C\u65F6\u62C9\u5165\u4E86\u5305\u542B\u8FDC\u7A0B\u8BBF\u95EE\u6728\u9A6C\u7684\u6076\u610F axios \u7248\u672C\u3002"),
  p("\u6700\u8BBD\u523A\u7684\u7EC6\u8282\u85CF\u5728\u6CC4\u9732\u7684\u6E90\u7801\u672C\u8EAB\u91CC\u3002Claude Code \u5185\u90E8\u6709\u4E00\u4E2A\u53EB Undercover Mode \u7684\u7CFB\u7EDF\uFF0C\u4E13\u95E8\u9632\u6B62 Anthropic \u5185\u90E8\u4FE1\u606F\u901A\u8FC7 commit \u548C PR \u6CC4\u9732\u3002system prompt \u91CC\u660E\u786E\u5199\u7740\u201CDo not blow your cover\u201D\u2014\u2014\u7136\u540E\u901A\u8FC7\u4E00\u4E2A .npmignore \u914D\u7F6E\u628A\u5168\u90E8\u6E90\u7801\u9001\u4E86\u51FA\u53BB\u3002"),
  pb("\u4E00\u4E2A\u7EC4\u7EC7\u5728\u4EA7\u54C1\u5C42\u9762\u505A\u4E86\u7CBE\u5BC6\u7684\u4FE1\u606F\u5B89\u5168\u8BBE\u8BA1\uFF0C\u5728\u53D1\u5E03\u6D41\u7A0B\u5C42\u9762\u5374\u72AF\u4E86\u6700\u57FA\u7840\u7684\u914D\u7F6E\u9519\u8BEF\u3002", "\u8FD9\u4E0D\u662F\u6280\u672F\u95EE\u9898\uFF0C\u662F\u7EC4\u7EC7\u8BB0\u5FC6\u95EE\u9898\u3002"),

  div(),

  // Closing
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
    children: [new TextRun({ text: "\u7ED3  \u8BED", font: F.cn, size: 28, bold: true, color: C.accent })],
  }),
  new Paragraph({
    spacing: { before: 80, after: 80, line: 380 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: "\u4E24\u6B21\u6CC4\u9732\uFF0C\u540C\u4E00\u4E2A\u9519\u8BEF\uFF0C\u4E24\u4E2A\u5B8C\u5168\u4E0D\u540C\u7684\u201C\u5C38\u4F53\u201D\u3002\u8FD9\u4E2A\u5DEE\u8DDD\u672C\u8EAB\u5C31\u662F AI \u7F16\u7A0B\u5DE5\u5177\u8FDB\u5316\u901F\u5EA6\u7684\u6700\u4F73\u8BC1\u636E\u3002", font: F.body, size: 21, color: C.body })],
  }),
  ...([
    ["1.  ", "AI \u5DE5\u5177\u7684\u5DE5\u7A0B\u590D\u6742\u5EA6\u6B63\u5728\u6307\u6570\u81A8\u80C0\u3002", " 14 \u4E2A\u6708\u4ECE\u7B80\u5355 CLI \u5230 51 \u4E07\u884C Agent \u5E73\u53F0\uFF0C\u8FFD\u8D76\u7684\u4E0D\u662F\u9759\u6001\u76EE\u6807\uFF0C\u662F\u52A0\u901F\u7684\u706B\u8F66\u3002"],
    ["2.  ", "\u6DF7\u6DC6\u5DF2\u6B7B\uFF0C\u53D1\u5E03\u5B89\u5168\u624D\u662F\u6B63\u4E8B\u3002", " npm \u53D1\u5E03\u524D\u5FC5\u987B\u663E\u5F0F\u7981\u7528 sourcemap\u3001\u53CC\u91CD\u8FC7\u6EE4\u3001CI \u626B\u63CF\u3002"],
    ["3.  ", "\u7EC4\u7EC7\u8BB0\u5FC6\u6BD4\u6280\u672F\u503A\u66F4\u9690\u853D\u3002", " \u540C\u4E00\u4E2A\u9519\u8BEF\u72AF\u4E24\u6B21\uFF0C\u8BF4\u660E\u7B2C\u4E00\u6B21\u4E8B\u6545\u7684\u590D\u76D8\u6CA1\u6709\u56FA\u5316\u5230 CI \u6D41\u7A0B\u91CC\u3002"],
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
  new Paragraph({
    spacing: { before: 100, after: 20 },
    children: [new TextRun({ text: "Claude Code \u6E90\u7801\u62C6\u89E3\u7CFB\u5217 \u00B7 AI Force 2026", font: F.body, size: 18, color: C.light })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [
      new TextRun({ text: "\u539F\u6587\u94FE\u63A5\uFF1A", font: F.body, size: 18, color: C.light }),
      new TextRun({ text: COVER_META.originalUrl, font: F.en, size: 18, color: C.accent }),
    ],
  }),
];

// ============================================================
const document = new Document({
  styles: { default: { document: { run: { font: F.body, size: 21, color: C.body }, paragraph: { spacing: { line: 360 } } } } },
  sections: [
    { properties: { titlePage: true, page: { margin: PAGE_MARGIN } }, children: coverChildren },
    { properties: { page: { margin: PAGE_MARGIN } }, children: bodyChildren },
  ],
});

const outBase = process.argv[2] || path.join(__dirname, "../../output");
const docxPath = outBase.endsWith(".docx") ? outBase : `${outBase}.docx`;
Packer.toBuffer(document).then((buf) => {
  fs.writeFileSync(docxPath, buf);
  console.log(`docx: ${docxPath}`);
});
