/**
 * 【AI笔记0413】一万美元买一个"你" -- docx + md 生成
 * 运行：NODE_PATH=/tmp/node_modules node material/create_doc.js "【AI笔记0413】一万美元买一个你"
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
const mdLines = [];

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

// 组件函数
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

// ============================================================
//  封面信息
// ============================================================
const COVER_META = {
  titleEn:    "Our Next 20 Years: AI, Capitalism, and Fractal Minds",
  subtitleEn: "A Gen-Z Engineer's Exponential Extrapolation",
  titleCn:    "一万美元买一个\"你\" -- 一个Z世代工程师的未来20年推演",
  author:     "Judah Anttila",
  source:     "TEDxOU · 2026-03-24",
  editor:     "整理：AI Force",
  series:     "AI Force 前沿 AI 探索",
  coverImg:   "00_系列封面",
  coverImgH:  500,
  originalUrl: "https://www.youtube.com/watch?v=FqlNhe8a_sM",
};

// 封面 MD
mdLines.push(`# ${COVER_META.titleEn}`);
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

  h2("开篇"),
  p("不到一万美元，替代一个知识工人。不是到 2050 年，是到 2030 年。"),
  p("这个数字不是来自硅谷 CEO 的年度预言，不是来自咨询公司的千页报告，而是来自一个 23 岁的工业工程系学生在 TEDx 讲台上的 16 分钟推演。Judah Anttila 是俄克拉荷马大学的加速硕士生，同时创办了两家公司，GPA 4.0。他的演讲「Our next 20 years: AI, capitalism, and fractal minds」发布两周，播放量突破 11.7 万。"),
  p("这个播放量本身就是一个信号。TEDx 频道上每周上线几十个演讲，能在两周内破 10 万的凤毛麟角。一个没有名气的学生讲 AI 替代就业和意识迁移，远超同期大部分嘉宾——说明这些话题已经不是\"前沿观点\"，而是正在变成公众焦虑。"),
  pb("这篇拆解不讨论 Anttila 的预测\"对不对\"，而是拆解一个更有意思的问题：", "当这些判断从圈内常识变成大众叙事，意味着什么？"),

  div(),

  h1("01  三重指数：同一条曲线的三个投影"),
  p("Anttila 的核心叙事手法是把三条看似无关的趋势线编织成一条指数曲线的三个投影："),
  pb("第一重：算力指数", " → 计算能力每两年翻倍（广义摩尔定律），这条曲线跑了 60 年没停。"),
  pb("第二重：劳动替代指数", " → 算力到一定阈值，AI Agent 的能力/成本比超过人类知识工人。Anttila 给出的数字是 2030 年前不到 $10,000。"),
  pb("第三重：寿命/意识指数", " → AGI 加速药物研发，推动\"长寿逃逸速度\"在 2032 年对富人实现、2040 年对大众实现。再往后，意识不再锁定在生物基底上。"),

  img("01_三重指数曲线", 500),

  p("这个叙事框架的力量在于因果链，不是三个独立预测的并列。算力增长驱动 AI 能力增长，AI 能力增长驱动劳动替代，劳动替代释放的资本灌入生物技术研发，生物技术突破反过来扩展\"什么算智能\"的定义。一条曲线，四个阶段。"),
  p("但这也恰恰是最值得追问的地方：指数曲线从来不是永动机。每一代计算范式都撞过物理极限——真空管、晶体管、光刻——每次都靠范式跳跃续命。Anttila 默认未来 20 年不会有一次\"撞墙期\"，这个假设是否成立，要打一个问号。"),

  div(),

  h1("02  大脱钩：生产力和劳动力的分手"),
  p("Anttila 用了一个概念叫 The Great Decoupling——大脱钩。过去 200 年的工业文明建立在一个隐含等式上：更高的生产力 = 更多的就业 = 更高的收入。现在这个等式第一次被拆开了。"),
  p("这不是理论推演。2026 年 3 月 31 日，Oracle 员工在凌晨 6 点收到裁员邮件。TD Cowen 估计这轮裁员波及 20,000-30,000 人，约占全公司 162,000 人的 18%。三周前刚公布了有史以来最好的季度——营收 172 亿美元，净利润增长 95% 至 61.3 亿美元。"),

  img("02_大脱钩剪刀差", 500),

  p("BCG 2026 年的报告提供了更审慎的视角：不同岗位需要不同的自动化策略——有时成本是主导因素，有时速度和质量才是。把所有知识工人放进同一个\"被替代\"的筐里，是一种叙事上的简化。"),
  p("世界经济论坛的数据更完整：到 2030 年，全球约 9,200 万个岗位可能被替代，但同时会新增约 7,800 万个岗位。净减少 1,400 万。"),
  pb("但净数字掩盖了分布问题。", "被替代的岗位和新增的岗位不在同一个地方、同一个技能维度、同一个收入层级。", "替代的速度快于重新培训的速度——这才是大脱钩的真正痛点。"),

  div(),

  h1("03  分形心智：意识不是肉做的"),
  p("Anttila 的演讲在最后一段加速进入了最大胆的领域——分形心智（Fractal Mind）。他的论点是：意识不是大脑的专利，而是一种信息模式。就像分形图案在不同尺度上重复自身，意识也可以在不同的计算基底上\"涌现\"——碳基神经元、硅基芯片、甚至是混合的生物-数字基底。"),
  p("Tufts 大学的 Michael Levin 教授和他的团队在过去十年里持续发表实验论文，展示了没有神经元的系统——细胞、黏菌、人造的 xenobots——如何表现出问题解决行为。他的核心概念叫 diverse intelligence（多元智能）。440+ 篇同行评审论文，2026 年受邀在 TSC 意识科学大会上做主题演讲。"),

  img("03_分形心智", 500),

  p("更具体地说，已经有两个实验室在做\"非神经元基底的计算\"：Cortical Labs（澳大利亚）的 CL1 生物计算机——用培养皿中的人类神经元做计算基底，2026 年 2 月已演示用 CL1 玩 Doom；FinalSpark（瑞士）的 Neuroplatform——全球首个提供云端访问的生物神经元计算平台。"),
  p("但要注意一个根本问题：\"意识是模式\"这个命题本身是一个哲学立场，不是科学定论。David Chalmers 提出的\"意识的困难问题\"至今没有被回答。从\"类认知行为\"到\"意识\"之间，有一条尚未被严格跨越的概念鸿沟。"),

  div(),

  h1("04  盲区三连：他没说的比说的更重要"),

  img("04_盲区矩阵", 500),

  pb("盲区一：能源。", "算力指数增长需要能源指数增长。", "AI 训练的耗电量在过去三年增长了 10 倍以上。Anttila 的三重指数假设算力无限供给，但物理世界不是 Excel 表格。"),
  pb("盲区二：治理。", "谁决定 AI Agent 替代哪些岗位？被替代的人怎么办？", "\"分形心智\"如果真的实现，它的产权归谁？演讲聚焦技术可行性，治理框架几乎没提。"),
  pb("盲区三：地理。", "所有引用都来自硅谷叙事。", "中国有 14 亿人口和完全不同的 AI 治理路径。印度有全球最大的 IT 外包行业——\"$10,000 替代知识工人\"对班加罗尔的程序员来说不是未来学趣谈，是生存威胁。"),
  p("这三个盲区暴露了一类思维模式的系统性缺陷：指数思维是强大的分析工具，但它天然倾向于忽略非技术约束。用指数曲线预测技术能力没问题，但用它预测社会后果——维度不对。"),

  div(),

  h1("05  对从业者意味着什么"),

  img("05_从业者行动图", 450),

  pb("1. 用户预期拉高。", "当用户默认\"AI 能替代人\"，\"辅助工具\"的定位可能不够了，\"自动完成\"才是期望值。"),
  pb("2. \"人机协作\"叙事需要升级。", "不是说人机协作不对，是说你不能只停在这个话术上——需要说清楚协作的边界在哪里。"),
  pb("3. 定价锚点在变。", "企业的 AI 采购决策越来越多地不是\"用你的 AI 还是用竞品的\"，而是\"用 AI 还是雇人\"。", "AI 产品的定价锚点在从竞品比价变成人力成本比价。"),

  div(),

  // 结语
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
  new Paragraph({
    spacing: { before: 80, after: 80, line: 380 },
    shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
    indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: "Anttila 的演讲本身不是新闻——AI 圈里这些判断已经是半共识。真正的新闻是这些判断出现在 TEDx 讲台上，由一个 23 岁的学生讲，两周破 11.7 万播放。当\"AI 替代知识工人\"从圈内判断变成公众认知，竞争维度就变了。", font: F.body, size: 21, color: C.body })],
  }),
  ...([
    ["1.  ", "指数曲线是强大的分析工具，但不是万能的预测框架。", "技术可行性 ≠ 社会可行性。"],
    ["2.  ", "\"大脱钩\"已经在发生——Oracle 裁员两万人、净利润同步大涨就是证据。", "但净数字掩盖分布问题。"],
    ["3.  ", "分形心智从哲学走向了工程。", "Cortical Labs 和 FinalSpark 正在用活体神经元做计算——这不是科幻，是实验室里的事实。"],
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

// MD 结语
mdLines.push("\n---\n");
mdLines.push("\n## 结语\n");
mdLines.push("Anttila 的演讲本身不是新闻。真正的新闻是这些判断正在从圈内共识变成公众认知。\n");
mdLines.push("\n**三个关键启示：**\n");
mdLines.push("1. **指数曲线是强大的分析工具，但不是万能的预测框架。** 技术可行性 ≠ 社会可行性。");
mdLines.push("2. **\"大脱钩\"已经在发生。** Oracle 裁员两万人、净利润同步大涨就是证据。但净数字掩盖分布问题。");
mdLines.push("3. **分形心智从哲学走向了工程。** Cortical Labs 和 FinalSpark 正在用活体神经元做计算。\n");
mdLines.push("---\n");
mdLines.push(`原文链接：${COVER_META.originalUrl}  `);
mdLines.push(`AI Force 前沿 AI 探索 · ${COVER_META.editor}`);

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

const outBase = process.argv[2] || path.join(__dirname, "../【AI笔记0413】一万美元买一个你");
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
