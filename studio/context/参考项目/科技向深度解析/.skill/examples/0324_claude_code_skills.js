const docx = require("docx");
const fs = require("fs");

const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle,
  ImageRun, TableRow, TableCell, Table, WidthType,
  ShadingType, convertInchesToTwip
} = docx;

// ============ 样式常量 ============
const C = {
  title: "1A1A1A", accent: "C47B2B", body: "333333",
  light: "666666", quote: "5D4E37", quoteBg: "FFF5E1",
  border: "E8D5B5", hi: "D2691E", white: "FFFFFF",
};
// Word 兼容字体：macOS 和 Windows 都能渲染
const F = { cn: "Heiti SC", en: "Georgia", mono: "Menlo", body: "Songti SC" };

// ============ 辅助函数 ============
const h1 = (t) => new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: t, font: F.cn, size: 36, bold: true, color: C.title })] });
const h2 = (t) => new Paragraph({ spacing: { before: 360, after: 160 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } }, children: [new TextRun({ text: t, font: F.cn, size: 28, bold: true, color: C.accent })] });
const h3 = (t) => new Paragraph({ spacing: { before: 280, after: 120 }, children: [new TextRun({ text: t, font: F.cn, size: 24, bold: true, color: C.hi })] });
const p = (t) => new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: [new TextRun({ text: t, font: F.body, size: 21, color: C.body })] });
const pb = (a, b, c) => {
  const ch = [new TextRun({ text: a, font: F.body, size: 21, color: C.body }), new TextRun({ text: b, font: F.body, size: 21, bold: true, color: C.hi })];
  if (c) ch.push(new TextRun({ text: c, font: F.body, size: 21, color: C.body }));
  return new Paragraph({ spacing: { before: 80, after: 80, line: 360 }, children: ch });
};
const li = (t) => new Paragraph({ spacing: { before: 40, after: 40, line: 340 }, indent: { left: convertInchesToTwip(0.3) }, children: [new TextRun({ text: "•  ", font: F.body, size: 21, color: C.accent }), new TextRun({ text: t, font: F.body, size: 21, color: C.body })] });
const q = (t) => new Paragraph({ spacing: { before: 120, after: 0, line: 340 }, indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: t, font: F.en, size: 20, italics: true, color: C.quote })] });
const qt = (t) => new Paragraph({ spacing: { before: 0, after: 120, line: 340 }, indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: C.accent } }, shading: { type: ShadingType.CLEAR, fill: C.quoteBg }, children: [new TextRun({ text: "—— ", font: F.body, size: 19, color: C.light }), new TextRun({ text: t, font: F.body, size: 19, color: C.quote })] });
const div = () => new Paragraph({ spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "•  •  •", font: F.en, size: 20, color: C.border })] });
const sp = () => new Paragraph({ spacing: { before: 40, after: 40 }, children: [] });

function img(name) {
  const buf = fs.readFileSync(`/tmp/sharing_pngs/${name}.png`);
  // 800x400 SVG at 2x = 1600x800 PNG, display at ~5.8 inches wide
  const w = convertInchesToTwip(5.8);
  // read actual PNG dimensions for aspect ratio
  // All our SVGs are 800 wide, heights vary: 400, 340, 420, 420, 360, 330, 300
  const heights = {
    "01_封面总览": 400, "02_核心认知纠偏": 340, "03_六类Skills上": 420,
    "04_六类Skills下": 420, "05_Skill结构解剖": 360, "06_Gotchas飞轮": 330, "07_四条实践": 300,
  };
  const svgH = heights[name] || 400;
  const h = convertInchesToTwip(5.8 * svgH / 800);
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({ data: buf, transformation: { width: w / 15, height: h / 15 } }),
    ],
  });
}

const code = (lines) => lines.map((l, i) => new Paragraph({
  spacing: { before: i === 0 ? 120 : 0, after: i === lines.length - 1 ? 120 : 0, line: 280 },
  indent: { left: convertInchesToTwip(0.4) },
  shading: { type: ShadingType.CLEAR, fill: "F5F0E8" },
  children: [new TextRun({ text: l, font: F.mono, size: 18, color: C.quote })],
}));

// ============ 文档内容 ============
const doc = new Document({
  styles: { default: { document: { run: { font: F.body, size: 21, color: C.body }, paragraph: { spacing: { line: 360 } } } } },
  sections: [{
    properties: { page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(1.1), right: convertInchesToTwip(1.1) } } },
    children: [
      // ====== 封面区 ======
      new Paragraph({ spacing: { before: 200, after: 40 }, children: [
        new TextRun({ text: "Lessons from Building Claude Code", font: F.en, size: 44, bold: true, color: C.title }),
      ]}),
      new Paragraph({ spacing: { before: 0, after: 40 }, children: [
        new TextRun({ text: "How We Use Skills", font: F.en, size: 32, color: C.accent }),
      ]}),
      new Paragraph({ spacing: { before: 0, after: 30 }, children: [
        new TextRun({ text: "构建 Claude Code 的经验：我们如何使用 Skills", font: F.body, size: 22, color: C.light }),
      ]}),
      new Paragraph({ spacing: { before: 40, after: 10 }, children: [
        new TextRun({ text: "Thariq Shihipar", font: F.en, size: 20, color: C.body }),
        new TextRun({ text: " · Anthropic Claude Code Team · 2026-03-17", font: F.en, size: 20, color: C.light }),
      ]}),
      new Paragraph({ spacing: { before: 20, after: 60 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent } }, children: [
        new TextRun({ text: "AI Force 前沿 AI 探索", font: F.body, size: 20, bold: true, color: C.accent }),
      ]}),
      new Paragraph({ spacing: { before: 20, after: 10 }, children: [
        new TextRun({ text: "整理：Dave", font: F.body, size: 19, color: C.light }),
      ]}),

      // ====== 开篇 ======
      h2("开篇"),
      p("3 月 17 日，Anthropic Claude Code 团队的 Thariq Shihipar 发布了一篇关于 Skills 的深度文章。Skills 是 Claude Code 中最常用的扩展点——Anthropic 内部已有数百个活跃 Skills。"),
      p("这篇文章不是一份功能介绍文档，而是来自实战的经验总结：什么样的 Skill 真正有用？怎么组织内容？踩过哪些坑？以下是原文的核心观点整理。"),

      // ====== 封面贴图 ======
      img("01_封面总览"),

      div(),

      // ====== 01 ======
      h1("01  Skills 不是 Markdown——而是完整的文件夹"),
      p("如果你之前以为 Skill 就是写一段提示词、存成 .md 文件，那你只用了 Skill 10% 的能力。Thariq 明确指出了这个最大的误解："),
      q("The most interesting part about skills is that they're not just text files — they're folders that can include scripts, assets, data, etc. that the agent can discover, explore and manipulate."),
      qt("Skills 最有趣的地方在于它们不只是文本文件——而是包含脚本、资产、数据等内容的文件夹，Agent 可以自主发现、探索和操作。"),

      img("02_核心认知纠偏"),

      h3("一个真实的 Skill 长什么样？"),
      p("以 Anthropic 内部的「内部 API 接入指南」Skill 为例，它的文件结构大约是这样的："),
      ...code([
        "internal-api-skill/",
        "├── skill.md              # 主指令：何时触发、总体说明",
        "├── gotchas.md            # 避坑指南：已知的 8 个常见错误",
        "├── examples/             # 参考代码片段",
        "│   ├── basic_query.ts",
        "│   └── pagination.ts",
        "├── scripts/              # 可执行脚本",
        "│   └── validate.sh",
        "├── templates/            # 脚手架模板",
        "│   └── new_endpoint.ts",
        "└── data/                 # 配置数据",
        "    └── endpoints.json",
      ]),
      p("当 Claude 收到一个使用该 API 的任务时，它不是一次性加载所有文件，而是：先读 skill.md 获取概览 → 按需查看 gotchas.md → 如果需要写新代码，参考 examples/。"),
      pb("Thariq 把这种模式叫做 ", "Progressive Disclosure（渐进式信息披露）", "——不一次性塞满上下文窗口，让 Agent 按需发现。"),

      img("05_Skill结构解剖"),

      div(),

      // ====== 02 ======
      h1("02  六大 Skills 分类"),
      p("Anthropic 内部在使用了数百个 Skills 后，发现它们自然地聚类为六种类型。最好的 Skill 通常只属于一个类别："),

      h3("① Library & API Reference（库 / API 参考）"),
      p("教 Claude 正确使用某个库或 SDK。特别适用于内部库、以及 Claude 训练数据中覆盖不足的公共库。"),
      li("案例：Anthropic 内部有一个 Skill 专门教 Claude 使用他们的部署工具链，包含 12 个 gotchas（如「deploy 命令的 --region 参数是必选项，不是可选」）"),
      li("案例：为 AKShare 金融库写一个 Skill，包含正确的分页参数用法（offset 从 1 开始不是 0）"),

      h3("② Product Verification（产品验证）"),
      p("描述如何测试和验证 Claude 的代码输出是否正确工作。常与 Playwright、tmux 等外部工具配合。Thariq 的原话："),
      q("It can be worth having an engineer spend a week just making verification skills excellent."),
      qt("让一个工程师花一整周只做验证类 Skill，是值得的。"),
      li("案例：前端 Skill 要求 Claude 写完组件后，用 Playwright 打开浏览器截图，对比 UI 是否符合设计稿"),
      li("案例：API Skill 要求 Claude 跑完代码后执行 curl 验证返回值的 schema 是否匹配"),

      h3("③ Code Quality & Review（代码质量审查）"),
      p("在组织内强制执行代码标准，可包含 linter/formatter 规则的确定性脚本，可通过 Hooks 或 GitHub Actions 自动运行。"),
      li("案例：Python 项目的 Skill 包含 ruff.toml 和 review.sh，Claude 写完代码后自动跑 lint"),
      li("案例：GitHub Actions 中的 Skill 在 PR 中自动检查团队命名规范"),

      img("03_六类Skills上"),

      h3("④ Data & Monitoring（数据与监控）"),
      p("连接组织的数据和监控系统，包含凭证配置、Dashboard ID、常用查询工作流。"),
      li("案例：Grafana Skill 包含 10 个最常用 Dashboard 的 ID 和查询模板，Claude 直接帮查看告警指标"),
      li("案例：funnel-query Skill 封装了公司的漏斗分析 SQL 模板，只需说「看下注册转化漏斗」就能出数据"),

      h3("⑤ Business Process Automation（业务流程自动化）"),
      p("将重复性团队操作封装为一条命令。指令通常简单，但依赖链可能复杂。"),
      li("案例：发版流程 Skill——一条命令完成 changelog 生成、版本号 bump、git tag、npm publish"),
      li("案例：On-call 交接 Skill——自动汇总过去一周的告警、未关闭的 issue、pending 的 PR"),

      h3("⑥ Framework & Scaffolding（框架脚手架）"),
      p("为特定功能生成框架样板代码，特别适合有自然语言需求描述的场景。"),
      li("案例：「新建 API endpoint」Skill——输入 endpoint 描述，自动生成路由、handler、测试、类型定义"),
      li("案例：React 组件 Skill——基于团队的组件库规范，生成带 Storybook 故事的完整组件结构"),

      img("04_六类Skills下"),

      div(),

      // ====== 03 ======
      h1("03  Gotchas：Skill 的灵魂"),
      p("如果你只能在 Skill 中写一个部分，Thariq 的建议是：写 Gotchas。"),
      q("The highest-signal content in any skill is the Gotchas section, which should be built up from common failure points that Claude runs into when using the skill, and ideally updated over time."),
      qt("任何 Skill 中信号量最高的内容是 Gotchas 部分，应该从 Claude 使用 Skill 时的常见失败点中积累，并随时间持续更新。"),

      h3("什么是好的 Gotcha？"),
      p("一个好的 Gotcha 应该是具体的、可操作的、来自真实失败的。对比两种写法："),
      li("差：「注意 API 的参数」——太模糊，Claude 无法采取行动"),
      li("好：「offset 参数从 1 开始，不是 0。Claude 默认写 offset=0 导致第一页数据重复」——具体、可操作"),
      sp(),
      li("差：「小心类型错误」——等于没说"),
      li("好：「createUser() 的 role 参数是 string 枚举 'admin'|'user'|'viewer'，传 number 不报错但会静默失败」"),

      h3("Gotcha 飞轮效应"),
      p("Thariq 描述的是一个持续改进的正循环："),
      li("第 1 周：Claude 用错了 API 的分页参数 → 记录 Gotcha"),
      li("第 2 周：Claude 忘了设置请求头的 Content-Type → 补充 Gotcha"),
      li("第 3 周：Claude 在错误处理中遗漏了 rate limit 的 429 状态码 → 再补充"),
      li("第 N 周：Skill 积累了 15 个 Gotchas，Claude 的成功率从 60% 提升到 95%"),
      pb("Skill 不是一次性写完的产品，而是一个", "持续进化的知识资产", "。"),

      img("06_Gotchas飞轮"),

      div(),

      // ====== 04 ======
      h1("04  四条黄金实践"),

      h3("实践一：验证类 Skill 的 ROI 最高"),
      p("验证类 Skill 的价值在于：它不仅让当前任务更可靠，还为所有使用该 Skill 的人兜底。"),
      li("让 Claude 写完代码后自动运行测试，而不是靠人 review 发现问题"),
      li("用 Playwright 截图对比 UI 渲染结果，确保视觉一致性"),
      li("对 API 响应做 schema 校验，防止字段缺失或类型不匹配"),
      p("Anthropic 内部有一个 Skill 会让 Claude 写完前端组件后，启动一个临时浏览器实例，用 Playwright 截图，然后把截图展示给用户确认。这比人肉 review 代码高效得多。"),

      h3("实践二：避免过于具体，保留灵活性"),
      q("Give Claude the information it needs, but give it the flexibility to adapt to the situation."),
      qt("给 Claude 需要的信息，但给它灵活适应具体情况的空间。"),
      p("Skills 是高度可复用的。对比两种写法："),
      ...code([
        "# 差：过于具体",
        "当用户要创建 React 组件时，必须使用 functional component，",
        "必须用 useState 管理状态，必须导出为 default export。",
        "",
        "# 好：给信息，留空间",
        "团队偏好 functional component 和 hooks。",
        "参考 examples/counter.tsx 了解团队的组件风格。",
        "根据具体场景选择合适的状态管理方式。",
      ]),

      h3("实践三：知识型 Skill 聚焦「反直觉」信息"),
      p("Claude 的训练数据已经覆盖了大量公共知识。如果你的 Skill 只是重复 Claude 已知的内容，那就是在浪费上下文窗口。重点应该放在 Claude 不知道的、容易搞错的、和你的项目特有的信息上。例如："),
      li("你的 API 认证方式和公共 API 不同（用 X-Internal-Token 而非 Bearer）"),
      li("你的数据库表名用 snake_case 但 ORM 映射用 camelCase"),
      li("你的 CI 流程有非标准步骤（deploy 前必须先跑 migration check）"),

      h3("实践四：Gotchas 是最高价值内容"),
      p("核心逻辑：Claude 犯过一次的错误，不应该再犯第二次。但如果不记录，Claude 每次都会从零开始。Gotchas 就是组织级别的「错误记忆」，让每个人都受益。"),

      img("07_四条实践"),

      div(),

      // ====== 05 ======
      h1("05  三个应用场景"),

      h3("场景一：新人 Onboarding"),
      p("一个新工程师加入团队，需要了解内部工具、代码规范、部署流程。传统做法是读文档（通常过时）+ 找人问。有了 Skills，新人在 Claude Code 中开始工作，Skill 在需要的时候自动提供正确指引。"),

      h3("场景二：跨团队协作"),
      p("前端团队需要调用后端 API。传统做法是读 Swagger 文档 + 在 Slack 问后端同事。后端团队维护一个 API Skill，包含所有 endpoint 的用法、Gotchas 和示例代码。前端工程师在 Claude Code 中直接使用，遇到问题 Claude 自动参考 Gotchas。"),

      h3("场景三：运维标准化"),
      p("On-call 工程师半夜被叫起来处理告警。传统做法是翻 Runbook（通常也过时了）。运维 Skill 包含最新的处理流程、常见告警排查步骤、关键 Dashboard 链接。Claude 可以引导工程师一步步排查，甚至自动执行安全的诊断操作。"),

      div(),

      // ====== 06 ======
      h1("06  Thariq 的两个判断"),

      q("Using Skills well is a skill issue."),
      qt("善用 Skills 本身就是一种能力。"),
      p("言下之意：工具已经足够好了，差距在于你怎么用它。一个精心打磨的 Skill 和一个随手写的 .md 文件，效果天差地别。"),
      sp(),
      q("Skills are the abstraction that all agents will build on."),
      qt("Skills 是所有 Agent 都将构建的抽象层。"),
      p("这个判断把 Skills 的意义从「Claude Code 的一个功能」提升到「Agent 时代的基础设施」层面。不管未来的 Agent 框架怎么演化，可复用的知识封装单元一定是核心。"),

      div(),

      // ====== 结语 ======
      new Paragraph({
        spacing: { before: 200, after: 160 },
        border: {
          top: { style: BorderStyle.SINGLE, size: 2, color: C.accent },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent },
        },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        children: [
          new TextRun({ text: "\n", font: F.cn, size: 10 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 0, after: 80 },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "结  语", font: F.cn, size: 28, bold: true, color: C.accent }),
        ],
      }),
      new Paragraph({
        spacing: { before: 80, after: 80, line: 380 },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: "这篇文章给出了一个清晰的信号：", font: F.body, size: 21, color: C.body }),
          new TextRun({ text: "Agent 时代的核心竞争力不在模型本身，而在于你如何组织和工程化给模型的上下文。", font: F.body, size: 21, bold: true, color: C.hi }),
        ],
      }),
      new Paragraph({
        spacing: { before: 80, after: 80, line: 380 },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: "Skills 本质上是「可复用的 Context Engineering 单元」——它把散落在文档、Wiki、Slack 对话、老员工脑子里的知识，变成了 Agent 可以直接使用的结构化资产。", font: F.body, size: 21, color: C.body }),
        ],
      }),
      new Paragraph({
        spacing: { before: 120, after: 40, line: 360 },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: "三个关键启示：", font: F.body, size: 21, bold: true, color: C.accent }),
        ],
      }),
      new Paragraph({
        spacing: { before: 40, after: 40, line: 340 },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        indent: { left: convertInchesToTwip(0.5), right: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: "1.  ", font: F.body, size: 21, color: C.accent }),
          new TextRun({ text: "从今天开始记录 Gotchas。", font: F.body, size: 21, bold: true, color: C.body }),
          new TextRun({ text: "每次 AI 工具犯错，就是一个 Gotcha 的素材。", font: F.body, size: 21, color: C.body }),
        ],
      }),
      new Paragraph({
        spacing: { before: 40, after: 40, line: 340 },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        indent: { left: convertInchesToTwip(0.5), right: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: "2.  ", font: F.body, size: 21, color: C.accent }),
          new TextRun({ text: "验证优先。", font: F.body, size: 21, bold: true, color: C.body }),
          new TextRun({ text: "与其纠结指令写得多完美，不如先解决「怎么确认输出是对的」。", font: F.body, size: 21, color: C.body }),
        ],
      }),
      new Paragraph({
        spacing: { before: 40, after: 40, line: 340 },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        indent: { left: convertInchesToTwip(0.5), right: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: "3.  ", font: F.body, size: 21, color: C.accent }),
          new TextRun({ text: "Skills 是团队知识管理的新范式。", font: F.body, size: 21, bold: true, color: C.body }),
          new TextRun({ text: "它不是给人看的文档，而是给 Agent 用的操作手册。", font: F.body, size: 21, color: C.body }),
        ],
      }),
      new Paragraph({
        spacing: { before: 0, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent },
        },
        shading: { type: ShadingType.CLEAR, fill: C.quoteBg },
        children: [
          new TextRun({ text: "\n", font: F.cn, size: 10 }),
        ],
      }),

      div(),

      // ====== 脚注 ======
      new Paragraph({ spacing: { before: 100, after: 40 }, children: [
        new TextRun({ text: "原文链接", font: F.body, size: 18, color: C.light }),
      ]}),
      new Paragraph({ spacing: { before: 0, after: 20 }, children: [
        new TextRun({ text: "x.com/trq212/status/2033949937936085378", font: F.en, size: 18, color: C.accent }),
      ]}),
      sp(),
      new Paragraph({ spacing: { before: 40, after: 0 }, children: [
        new TextRun({ text: "AI Force 前沿 AI 探索  ·  整理：Dave", font: F.body, size: 18, color: C.light }),
      ]}),
    ],
  }],
});

const out = process.argv[2] || "/tmp/output.docx";
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(out, buf); console.log(`✓ ${out}`); });
