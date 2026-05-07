/**
 * AI 前沿分享 · Word + Markdown 文档生成模板
 *
 * 使用方式：
 *   1. 复制此模板到 YYYY-M-DD/material/create_doc.js
 *   2. 填写 COVER_META 和正文内容
 *   3. 运行：
 *        NODE_PATH=/tmp/node_modules node YYYY-M-DD/material/create_doc.js \
 *          "YYYY-M-DD/【AI笔记MMDD】标题"
 *   4. 输出：
 *        YYYY-M-DD/【AI笔记MMDD】标题.docx
 *        YYYY-M-DD/【AI笔记MMDD】标题.md
 *
 * PNG 图片从 ./pngs/<name>.png 读取（相对于本脚本所在的 material/ 目录）
 * 依赖：npm install docx（已安装在 /tmp/node_modules/）
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
//  样式常量 —— 暖色调编辑风格
// ============================================================
const C = {
  title:   "1A1A1A",  // 标题黑
  accent:  "C47B2B",  // 古铜色强调
  body:    "333333",  // 正文深灰
  light:   "666666",  // 辅助灰
  quote:   "5D4E37",  // 引用深棕
  quoteBg: "FFF5E1",  // 引用背景暖黄
  border:  "E8D5B5",  // 分割线暖灰
  hi:      "D2691E",  // 重点棕色
  white:   "FFFFFF",
  coverBg: "FFF9EE",  // 封面底色
};

// Word 兼容字体：macOS 和 Windows 都能渲染
const F = { cn: "Heiti SC", en: "Georgia", mono: "Menlo", body: "Songti SC" };

// ============================================================
//  Markdown 并行输出
// ============================================================
const mdLines = [];

// ============================================================
//  组件函数（每个函数同时构建 docx node 和 mdLines）
// ============================================================

/** 一级标题 —— 用于 01 02 03 章节 */
const h1 = (t) => {
  mdLines.push(`\n## ${t}\n`);
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: t, font: F.cn, size: 36, bold: true, color: C.title })],
  });
};

/** 二级标题 —— 带底部分割线（用于「开篇」「结语」等） */
const h2 = (t) => {
  mdLines.push(`\n### ${t}\n`);
  return new Paragraph({
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } },
    children: [new TextRun({ text: t, font: F.cn, size: 28, bold: true, color: C.accent })],
  });
};

/** 三级标题 */
const h3 = (t) => {
  mdLines.push(`\n#### ${t}\n`);
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text: t, font: F.cn, size: 24, bold: true, color: C.hi })],
  });
};

/** 正文段落 */
const p = (t) => {
  mdLines.push(`${t}\n`);
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 360 },
    children: [new TextRun({ text: t, font: F.body, size: 21, color: C.body })],
  });
};

/** 带加粗强调的正文：pb("前缀", "加粗部分", "后缀") */
const pb = (a, b, c = "") => {
  mdLines.push(`${a}**${b}**${c}\n`);
  const ch = [
    new TextRun({ text: a, font: F.body, size: 21, color: C.body }),
    new TextRun({ text: b, font: F.body, size: 21, bold: true, color: C.hi }),
  ];
  if (c) ch.push(new TextRun({ text: c, font: F.body, size: 21, color: C.body }));
  return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: ch });
};

/** 无序列表项 */
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

/** 英文原文引用（斜体 + 左边框 + 暖黄背景） */
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

/** 引用翻译（紧跟 q() 使用） */
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

/** 章节分隔符 */
const div = () => {
  mdLines.push("\n---\n");
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "•  •  •", font: F.en, size: 20, color: C.border })],
  });
};

/** 空行 */
const sp = () => {
  mdLines.push("");
  return new Paragraph({ spacing: { before: 40, after: 40 }, children: [] });
};

/**
 * 嵌入 PNG 贴图
 * @param {string} name - SVG 文件名（不含扩展名），如 "01_前端设计循环详解"
 * @param {number} svgHeight - 对应 SVG 的 viewBox 高度（用于等比缩放）
 */
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

/** 代码块 */
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
//  ▼▼▼ 在此处修改封面信息 ▼▼▼
// ============================================================

const COVER_META = {
  titleEn:    "Article English Title",        // 大标题（英文）
  subtitleEn: "Subtitle Here",                // 副标题（英文）
  titleCn:    "文章中文标题",                   // 中文标题（小字）
  author:     "Author Name",                  // 作者
  source:     "Source · YYYY-MM-DD",          // 来源和日期
  editor:     "整理：Dave",                   // 整理人
  series:     "AI Force 前沿 AI 探索",        // 系列名
  coverImg:   "00_系列封面",                  // 封面图文件名（不含扩展名）
  coverImgH:  1131,                           // 封面图 SVG 高度
  originalUrl: "https://example.com",         // 原文链接
};

// ============================================================
//  封面页内容（单独 section，无页眉页脚）
// ============================================================

// 封面信息写入 MD frontmatter
mdLines.push(`# ${COVER_META.titleEn}`);
mdLines.push(`\n> ${COVER_META.subtitleEn}  `);
mdLines.push(`> ${COVER_META.titleCn}  `);
mdLines.push(`> ${COVER_META.author} · ${COVER_META.source}  `);
mdLines.push(`> ${COVER_META.series}  `);
mdLines.push(`> ${COVER_META.editor}  `);
mdLines.push(`> 原文：${COVER_META.originalUrl}\n`);
mdLines.push("---\n");

// 封面图已包含标题/副标题等所有信息，直接全宽展示，不在上方重复文字
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
  // 小字元数据行（系列 · 整理人）
  new Paragraph({
    spacing: { before: 0, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: `${COVER_META.series}  ·  ${COVER_META.editor}`, font: F.body, size: 17, color: C.light }),
    ],
  }),
];

// ============================================================
//  ▼▼▼ 在此处填写正文内容 ▼▼▼
// ============================================================

const bodyChildren = [

  // ====== 开篇 ======
  h2("开篇"),
  p("在此处填写开篇内容..."),

  img("01_xxx", 500),  // 第一张内容贴图（紧跟开篇）

  div(),

  // ====== 01 ======
  h1("01  第一章标题"),
  p("正文内容..."),
  q("English quote here."),
  qt("中文翻译"),
  li("要点一"),
  li("要点二"),

  img("02_xxx", 520),

  div(),

  // ====== 02 ======
  h1("02  第二章标题"),
  p("正文内容..."),

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
    children: [new TextRun({ text: "结  语", font: F.cn, size: 28, bold: true, color: C.accent })],
  }),
  // 结语正文
  new Paragraph({
    spacing: { before: 80, after: 80, line: 380 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: "结语正文...", font: F.body, size: 21, color: C.body })],
  }),
  // 三条关键启示
  ...([
    ["1.  ", "启示一标题。", "补充说明。"],
    ["2.  ", "启示二标题。", "补充说明。"],
    ["3.  ", "启示三标题。", "补充说明。"],
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
    children: [new TextRun({ text: "本文为 AI Force 2026 前沿分享系列", font: F.body, size: 18, color: C.light })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [
      new TextRun({ text: "原文链接：", font: F.body, size: 18, color: C.light }),
      new TextRun({ text: COVER_META.originalUrl, font: F.en, size: 18, color: C.accent }),
    ],
  }),
];

// ============================================================
//  写入结语和脚注到 MD
// ============================================================
mdLines.push("\n---\n");
mdLines.push("\n## 结语\n");
mdLines.push("结语正文...\n");
mdLines.push("\n**三个关键启示：**\n");
mdLines.push("1. **启示一标题。** 补充说明。");
mdLines.push("2. **启示二标题。** 补充说明。");
mdLines.push("3. **启示三标题。** 补充说明。\n");
mdLines.push("---\n");
mdLines.push(`原文链接：${COVER_META.originalUrl}  `);
mdLines.push(`AI Force 前沿 AI 探索 · ${COVER_META.editor}`);

// ============================================================
//  文档生成（无需修改）
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
    // Section 1: 封面页（无页眉页脚，titlePage 隔离）
    {
      properties: {
        titlePage: true,
        page: { margin: PAGE_MARGIN },
      },
      children: coverChildren,
    },
    // Section 2: 正文（从新页开始）
    {
      properties: {
        page: { margin: PAGE_MARGIN },
      },
      children: bodyChildren,
    },
  ],
});

// 输出路径：从 argv[2] 获取 base（不含扩展名）
const outBase = process.argv[2] || path.join(__dirname, "../../output");
const docxPath = outBase.endsWith(".docx") ? outBase : `${outBase}.docx`;
const mdPath = outBase.endsWith(".docx")
  ? outBase.replace(/\.docx$/, ".md")
  : `${outBase}.md`;

// 写入 docx
Packer.toBuffer(document).then((buf) => {
  fs.writeFileSync(docxPath, buf);
  console.log(`docx: ${docxPath}`);

  // 写入 md
  fs.writeFileSync(mdPath, mdLines.join("\n"));
  console.log(`md:   ${mdPath}`);
});
