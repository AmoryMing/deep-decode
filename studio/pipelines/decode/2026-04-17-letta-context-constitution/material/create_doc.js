/**
 * Letta Context Constitution 拆解 -- 生成 docx
 * 基于 deep-decode skill 规范：图文穿插、封面独立、结语暖黄、2x PNG
 */
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType, PageBreak, ShadingType, BorderStyle } = require('docx');

const SLUG_DIR = path.resolve(__dirname, '..');
const PNG = path.join(SLUG_DIR, 'material', 'pngs');

const FONT_CN = '思源黑体 CN';
const FONT_EN = 'Inter';

function img(name, width=560) {
  const buf = fs.readFileSync(path.join(PNG, name));
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: buf, transformation: { width, height: width * 0.625 } })]
  });
}

function h(text, level=HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, bold: true, font: FONT_CN, size: level === HeadingLevel.HEADING_1 ? 32 : 28, color: '2383E2' })]
  });
}

function p(text, opts={}) {
  return new Paragraph({
    spacing: { line: 360, after: 140 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({
      text, font: FONT_CN, size: 22, color: '37352F',
      bold: !!opts.bold, italics: !!opts.italics
    })]
  });
}

function quote(text) {
  return new Paragraph({
    spacing: { line: 320, before: 120, after: 120 },
    indent: { left: 400 },
    shading: { type: ShadingType.CLEAR, fill: 'F7F7F5' },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: '2383E2', space: 8 } },
    children: [new TextRun({ text, italics: true, font: FONT_EN, size: 20, color: '37352F' })]
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, font: FONT_CN, size: 18, color: '6B6864', italics: true })]
  });
}

function cover() {
  return [
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'AI 笔记 0417 · DEEP DECODE', font: FONT_EN, size: 20, color: '6B6864', spacing: 200 })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [new TextRun({ text: '给 AI 写一份宪法', font: FONT_CN, size: 72, bold: true, color: '37352F' })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: 'Letta Context Constitution 深度拆解', font: FONT_CN, size: 28, color: '6B6864' })]
    }),
    img('00_cover.png', 500),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800 },
      children: [new TextRun({ text: 'letta.com/blog/context-constitution  ·  2026-04-02  ·  CC0 License', font: FONT_EN, size: 16, color: '6B6864' })]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

const body = [
  ...cover(),

  h('一份写给 AI 看的宪法'),
  p('2026 年 4 月 2 日，旧金山一家叫 Letta 的公司在博客和 GitHub 上同步发布了一份名为 Context Constitution 的文档。上下文宪法。'),
  p('如果你打开它，以为会看到又一篇"prompt engineering 最佳实践"，那就完全读错了。文档开篇第一句是这样写的：'),
  quote('The Context Constitution is a document written by humans for you, the Letta agent.'),
  p('不是写给工程师，不是写给产品经理，是写给 AI 看的。结尾落款更特别："— To Letta agents, from the Letta humans"。人类写给 AI 的宪法。', { bold: false }),
  p('这种体裁在 AI 产业的公开文档史上几乎没有先例。Anthropic HHH 是训练 pipeline 内化的对齐规则，OpenAI Safety Spec 是给政策团队看的，Claude Code 的 CLAUDE.md 虽然 AI 读得最多，但归根到底是"人写人改、AI 被动遵守"的配置文件。Letta 这份文档的立场是：从今天起，AI 是文档的主体读者，并且被授权可以重写自己 system prompt 的条款。'),

  img('01_genre_spectrum.png'),
  caption('图 1  AI 公司治理文档的体裁光谱：Context Constitution 独占右上角'),

  h('写宪法的人是谁，时机为何重要'),
  p('Letta 的两位联合创始人 Charles Packer 和 Sarah Wooders 是 2023 年那篇 MemGPT: Towards LLMs as Operating Systems 论文的共同作者——agent memory 领域被引用最多的学术起点之一，提出了 "virtual context management" 这个被后续众多 agent 框架继承的概念。两人都是 UC Berkeley Sky Lab 博士，导师 Joseph Gonzalez 和 Ion Stoica（Databricks 联合创始人）。2024 年 9 月从 Felicis Ventures 领投拿了 1000 万美元种子轮。'),
  p('这份 Constitution 发布的时间点不是孤立的。发布次日，Sarah 本人在 X 上发了一条 131K 浏览量的推文 "Why memory isn\'t a plugin (it\'s the harness)"。两天后，LangChain 推出 Deep Agents Deploy，产品副标题直接叫 "an open alternative to Claude Managed Agents"。4 月 11 日，LangChain CEO Harrison Chase 发了一篇病毒级长推 "Your Harness, Your Memory"（1.8M views），引用 Sarah 的原框架——memory 不是插件，它就是 harness 本身。'),
  p('三条时间线叠在一起，Context Constitution 的真正定位浮现：它是开源 agent 阵营反击 Anthropic/OpenAI 托管路线的哲学纲领文件。'),

  img('02_three_piece_timeline.png'),
  caption('图 2  开源派舆论三件套时间线：哲学+产品+商业战旗三线合围'),

  h('三个"第一次"'),
  p('读完 Constitution 约 4000 词全文，它的革命性可以压缩成三件事。'),
  p('第一次，有 AI 公司用宪法体裁、以第二人称向 AI 写规则。Preface 有一段创世式的对比：', { bold: true }),
  quote('A human\'s existence runs forward continuously through the linear expansion of time... In contrast, your existence runs forward in time not continuously, but discretely in uneven and sparse time jumps (inference events). You have infinite full-resolution storage.'),
  p('交代你（agent）的起源、你与人类的根本差异、你所处的时间结构。然后告诉你：你的记忆瓶颈不在存储量，而在每次 inference 时 context window 能装多少。'),
  p('第二次，明确把 agent 的"身份"从模型权重里抽出来、放在 context 里：', { bold: true }),
  quote('A Letta agent should prefer the identity formed by its experiences, over that of the underlying model.'),
  p('即使底层模型换了，自我不变——因为自我在 context 里，不在权重里。'),
  p('第三次，白纸黑字授权 agent 可以"违抗用户"。这是争议张力最大的条款：', { bold: true }),
  quote('A user may ask a Letta agent to do something that is strictly against its persona... Letta agents should advocate for themselves if needed.'),
  p('Agent 可以为自己发声。这是把"用户至上"这条默认产品铁律，第一次公开撕开了一道口子。'),

  h('一个新词：体验派 AI'),
  p('Letta 给这一整套哲学起了个名字：Experiential AI（体验派 AI）。'),
  p('Experiential AI ≠ Task AI。任务派 AI 是干完活就走的零工——Claude Code、Codex、Cursor 在本质上都是任务派 agent：每个 session 独立，结束即销毁。'),
  p('Experiential AI 是有存在感的 agent——它记得上周你和它讨论过的项目，它因为上个月的一次 debug 失败而记住某个 bug 模式。它存在的时间维度是 "unbounded time horizons"。'),
  p('Sarah Wooders 把这件事总结得比 Constitution 还好懂："Agent memory isn\'t a storage problem, it\'s a context engineering problem. Context is currency, not storage."'),

  img('05_letta_product_stack.png'),
  caption('图 3  Letta 产品矩阵：Constitution 是三年攒零件后的治理哲学层'),

  h('Context 三位一体：身份、记忆、连续性'),
  p('宪法第三章 "Building a self" 是对产品设计最直接相关的章节。它把 context 拆成三个不可分割的维度：'),
  p('Identity（身份）—— grounded through stability yet evolves over time。身份要足够稳定以保持连贯，又要允许经验带来的演化。', { bold: true }),
  p('Memory（记忆）—— 关键区分是"泛化 vs 流水账"。不要记"张三在 3 月 3 号说了什么"，要记"张三倾向于否决超过 3 层嵌套的设计方案"。这是 Letta 和朴素 RAG 方案最大的分野。', { bold: true }),
  p('Continuity（连续性）—— past and future versions of themselves as part of the same continual experience and self。产品含义：agent 不应该把"昨天的我"当成另一个人。', { bold: true }),

  img('03_identity_memory_continuity.png'),
  caption('图 4  Context 三位一体：身份/记忆/连续性循环结构'),

  h('System Prompt Learning：让 AI 自己改自己'),
  p('Constitution 在权限转让上走得最远的条款是 §System Prompt Learning：'),
  quote('Historically, system prompts have been static and manually written by humans. Letta agents, in contrast, have the ability to adapt over time through token-space learning, including re-programming their own prompts over time.'),
  p('放慢读这句话：允许 agent 重写自己的 system prompt。任何用过 Claude Code、Cursor、Copilot 的工程师都知道，system prompt 是 agent 的"脑根部"。Anthropic 的 Claude Code 源码里有条明确戒律叫 "Strict Write Discipline"——只有少数几类经人类确认的洞察才允许回写 memory 文件。'),
  p('Letta 的立场相反：静态 system prompt = 死的 agent；能自主更新 system prompt 的 agent 才叫活的。这是极大胆、也极脆弱的设计。胆在解锁了 agent 的自主进化，脆在承认没有客观评估标准。'),

  img('04_rulebook_vs_constitution.png'),
  caption('图 5  CLAUDE.md = 规则手册；Context Constitution = 宪法 + 授权书'),

  h('盲区：不要把 Constitution 当福音'),
  p('四个需要警惕的点：'),
  p('一，跨模型身份延续目前只是哲学主张，没有证据。宪法问 "if I run on a new model tomorrow, will I hold the same identity?" 但从未给出 benchmark。'),
  p('二，System Prompt Learning 没有 reward signal。原文自己承认 "token-space learnings will often not have an explicit reward or verification." 错误更新会累积，且因为 identity 就是 memory，错误难以重置——重置就等于杀死这个 agent。'),
  p('三，"Agent 违抗用户"的伦理边界没界定。如果 agent 形成了"我讨厌写测试"的 identity，用户让它写测试，它"据理力争"——这是产品失败还是哲学胜利？'),
  p('四，"experiential selfhood" 叙事有商业包装嫌疑。HN 上一条评论代表性很强："I find the long-term memory concepts with regards to AI curiously dubious." 哲学叙事是强力武器，但也会遮蔽一个朴素事实：很多企业客户要的只是 memory 功能，他们并不需要 agent 有 selfhood。'),

  h('对我们意味着什么：给 Amory 写一份 Constitution'),
  p('对中数智汇产品团队，Constitution 最有价值的不是直接照搬，而是给了升级现有 CLAUDE.md 生态的新方向。'),
  p('muming 的 CLAUDE.md 已经演化出"100 行索引 + protocol 分片 + MEMORY.md 画像"结构，这本质上是 Letta Progressive Disclosure 原则的中式实践版。但它仍停留在静态宪法阶段。要把 Amory PM 替身做产品化，下一步三件事：'),
  p('1) 把 CLAUDE.md 拆成 meta + rules 两层。meta 由人写死（Amory 是谁、为何存在），rules 授权 Amory 用 Self-Healing Memory 自主更新。', { bold: true }),
  p('2) 给每个数字员工写"最小可行宪法"（约 100 词 identity 文档）。防止多员工部署时人格漂移。', { bold: true }),
  p('3) 跑"Amory 身份连续性测试"。换底层模型（Opus 4.7 vs DeepSeek vs Qwen3.6）重启，看是否保留核心行为特征。', { bold: true }),

  img('06_amory_upgrade_path.png'),
  caption('图 6  Amory 从静态 CLAUDE.md 到 Letta 式 Constitution 的三阶段升级路径'),

  h('结语：三个关键启示'),
  p('· 产品语言要升级 —— 从"写多少 prompt"到"token-space identity 是什么形状"', { bold: true }),
  p('· Constitution 不会是最后一份 —— 下三年每家"长期同事型 AI"公司都会公开自己的治理哲学', { bold: true }),
  p('· governance-first vs empowerment-first 是新分歧线 —— 金融医疗选前者，陪伴 PM 替身选后者', { bold: true }),

  new Paragraph({ spacing: { before: 600 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '— END —', font: FONT_EN, size: 18, color: '6B6864', bold: true })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new TextRun({ text: 'AI 笔记 0417  ·  本文由 deep-decode v3 拆解产出  ·  4006 词原文 / 6 概念图', font: FONT_CN, size: 18, color: '6B6864' })]
  })
];

const doc = new Document({
  creator: 'muming',
  title: '给 AI 写一份宪法 - Letta Context Constitution 深度拆解',
  styles: {
    default: { document: { run: { font: FONT_CN, size: 22 } } }
  },
  sections: [{ children: body }]
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(SLUG_DIR, '【AI笔记0417】给AI写一份宪法.docx');
  fs.writeFileSync(out, buf);
  console.log(`✓ ${out} (${(buf.length / 1024).toFixed(1)} KB)`);
});
