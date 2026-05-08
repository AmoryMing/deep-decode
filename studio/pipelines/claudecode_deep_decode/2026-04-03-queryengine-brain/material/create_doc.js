const docx = require("docx");
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, ImageRun, ShadingType, convertInchesToTwip } = docx;
const PNGS_DIR = path.join(__dirname, "pngs");
const C = { title:"1A1A1A", accent:"C47B2B", body:"333333", light:"666666", quote:"5D4E37", quoteBg:"FFF5E1", border:"E8D5B5", hi:"D2691E", white:"FFFFFF", coverBg:"FFF9EE" };
const F = { cn:"Heiti SC", en:"Georgia", mono:"Menlo", body:"Songti SC" };
const PAGE_MARGIN = { top:convertInchesToTwip(1), bottom:convertInchesToTwip(0.8), left:convertInchesToTwip(1.1), right:convertInchesToTwip(1.1) };

const h1 = (t) => new Paragraph({ spacing:{before:400,after:200}, children:[new TextRun({text:t,font:F.cn,size:36,bold:true,color:C.title})] });
const h2 = (t) => new Paragraph({ spacing:{before:360,after:160}, border:{bottom:{style:BorderStyle.SINGLE,size:1,color:C.border}}, children:[new TextRun({text:t,font:F.cn,size:28,bold:true,color:C.accent})] });
const p = (t) => new Paragraph({ spacing:{before:80,after:80,line:360}, children:[new TextRun({text:t,font:F.body,size:21,color:C.body})] });
const pb = (a,b,c="") => { const ch=[new TextRun({text:a,font:F.body,size:21,color:C.body}),new TextRun({text:b,font:F.body,size:21,bold:true,color:C.hi})]; if(c)ch.push(new TextRun({text:c,font:F.body,size:21,color:C.body})); return new Paragraph({spacing:{before:80,after:80,line:360},children:ch}); };
const li = (t) => new Paragraph({ spacing:{before:40,after:40,line:340}, indent:{left:convertInchesToTwip(0.3)}, children:[new TextRun({text:"•  ",font:F.body,size:21,color:C.accent}),new TextRun({text:t,font:F.body,size:21,color:C.body})] });
const q = (t) => new Paragraph({ spacing:{before:120,after:0,line:340}, indent:{left:convertInchesToTwip(0.4),right:convertInchesToTwip(0.4)}, border:{left:{style:BorderStyle.SINGLE,size:6,color:C.accent}}, shading:{type:ShadingType.CLEAR,fill:C.quoteBg}, children:[new TextRun({text:t,font:F.en,size:20,italics:true,color:C.quote})] });
const qt = (t) => new Paragraph({ spacing:{before:0,after:120,line:340}, indent:{left:convertInchesToTwip(0.4),right:convertInchesToTwip(0.4)}, border:{left:{style:BorderStyle.SINGLE,size:6,color:C.accent}}, shading:{type:ShadingType.CLEAR,fill:C.quoteBg}, children:[new TextRun({text:"-- ",font:F.body,size:19,color:C.light}),new TextRun({text:t,font:F.body,size:19,color:C.quote})] });
const div = () => new Paragraph({ spacing:{before:200,after:200}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"•  •  •",font:F.en,size:20,color:C.border})] });
const sp = () => new Paragraph({ spacing:{before:40,after:40}, children:[] });
const img = (name, svgH=500) => { const pp=path.join(PNGS_DIR,`${name}.png`); if(!fs.existsSync(pp)){console.warn(`[skip] ${pp}`);return sp();} const buf=fs.readFileSync(pp); const w=convertInchesToTwip(5.8); const h=convertInchesToTwip(5.8*svgH/800); return new Paragraph({spacing:{before:160,after:160},alignment:AlignmentType.CENTER,children:[new ImageRun({data:buf,transformation:{width:w/15,height:h/15}})]}); };

const COVER_META = { titleEn:"QueryEngine", subtitleEn:"13000 Lines of Code as the Brain", titleCn:"QueryEngine：13000 行代码的大脑中枢", author:"多来源综合", source:"Claude Code 源码泄露 · 2026-03-31", editor:"整理：muming", series:"Claude Code 源码拆解 #04", coverImg:"00_系列封面", coverImgH:450, originalUrl:"https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/" };

const coverChildren = [
  (() => { const pp=path.join(PNGS_DIR,`${COVER_META.coverImg}.png`); if(!fs.existsSync(pp))return new Paragraph({children:[]}); const buf=fs.readFileSync(pp); const w=convertInchesToTwip(5.8); const h=convertInchesToTwip(5.8*COVER_META.coverImgH/800); return new Paragraph({spacing:{before:200,after:80},alignment:AlignmentType.CENTER,children:[new ImageRun({data:buf,transformation:{width:w/15,height:h/15}})]}); })(),
  new Paragraph({ spacing:{before:0,after:0}, alignment:AlignmentType.CENTER, children:[new TextRun({text:`${COVER_META.series}  ·  ${COVER_META.editor}`,font:F.body,size:17,color:C.light})] }),
];

const bodyChildren = [
  h2("开篇"),
  pb("88 行和 13000 行之间，隔着什么？",""),
  p("有人用 Rust 重写了 Claude Code 的核心循环，精简到 88 行代码。while 循环、工具调用、结果回填——骨架就这么简单。但真正的 Claude Code 源码里，query.ts 加上 QueryEngine.ts 加上 processUserInput.ts，三个文件合计超过 13000 行。"),
  pb("差出来的那 12900 行，不是冗余。","那是一个 AI 编程工具从\u201C能跑\u201D到\u201C能用\u201D的全部距离。"),

  img("02_三文件脊椎", 550),
  div(),

  h1("01  五步净化：每次 API 调用前的认知预处理"),
  p("query.ts 的核心循环里，在真正调用 Claude API 之前，每一轮都要经过一条五步预处理流水线——就像自来水厂把原水变成饮用水，这条流水线把原始对话历史变成优化后的 API 请求。"),
  pb("第一步：Snip（裁剪）。","按边界截断历史消息，裁剪掉的 token 数向下传递给后续步骤。"),
  pb("第二步：微压缩（MicroCompact）。","就地缩减工具调用结果。与内容替换解耦，两者正交叠加。"),
  pb("第三步：上下文折叠（Context Collapse）。","折叠大块中间内容。刻意放在自动压缩之前。"),
  q("Runs BEFORE autocompact so that if collapse gets us under the autocompact threshold, autocompact is a no-op and we keep granular context instead of a single summary."),
  qt("先于 autocompact 执行，如果折叠就够了就不触发压缩，保留细粒度上下文。"),
  pb("第四步：自动压缩（AutoCompact）。","预留 AUTOCOMPACT_BUFFER_TOKENS = 13,000（p99.99 摘要输出 17,387 token）。连续失败 3 次则停止。"),
  pb("第五步：组装请求。","净化后的消息、系统提示词、工具定义打包为 API 请求。"),

  img("01_五步净化流水线", 520),
  p("Agent 系统消耗约 4 倍于普通 chat 的 token，多 Agent 高达 15 倍。压缩效率直接影响 API 成本和响应速度——不是锦上添花，是生死线。"),
  div(),

  h1("02  StreamingToolExecutor：不等模型说完就动手"),
  p("传统 Agent 循环是串行的：模型输出完 → 解析 → 执行工具 → 回填。Claude Code 打破了这个串行等待。"),
  pb("StreamingToolExecutor：","模型还在流式输出时就开始准备和执行工具调用。投机性分类器检查（startSpeculativeClassifierCheck）并行运行安全判断。"),
  pb("tombstone 消息类型：","清理 fallback 切换时的\u201C孤儿\u201D thinking blocks，防签名错误。"),
  pb("用户中断处理：","为每个未完成的 tool_use block 补 error 类型 tool_result，保持协议一致性。"),
  p("siblingAbortController 实现细粒度中断控制——取消兄弟进程而不中断父级查询循环。这种控制精度是工业级 Agent 和 demo 的关键差异。"),
  div(),

  h1("03  \u201C胖核心\u201D哲学：为什么不拆散它"),
  p("读完 query.ts 第一反应是太大了。但源码给出了反直觉的答案：刻意不拆。Agent 系统最难管理的不是单模块复杂度，而是跨轮次状态。"),
  q("The rules of thinking are lengthy and fortuitous. They require plenty of thinking of most long duration and deep meditation for a wizard to wrap one's noggin around... Heed these rules well, young wizard."),
  qt("思考的规则冗长曲折，需要长时间深度冥想才能理解……好好记住，年轻的巫师。"),
  p("这种注释说明维护者已被这段逻辑坑过很多次。但他们选择保留\u201C胖核心\u201D——Agent 的 bug 不在模块内部，在模块之间。集中管理跨轮次状态比分散管理更可调试。"),

  img("03_胖核心vs过度拆分", 480),
  div(),

  h1("04  feature() 编译时消除"),
  p("Bun 的 feature() 在编译时求值——flag 为 false 时，整个模块被物理删除，反编译都看不到。外部用户看到的 Claude Code 只是完整系统的子集。"),
  p("内部版本（USER_TYPE === 'ant'）有更激进的 prompt 策略、Verification Agent、Explore & Plan Agent 等实验功能。Anthropic 用自己的产品开发自己的产品。"),
  div(),

  h1("05  盲区：没有回答的问题"),
  li("压缩的信息损耗：微压缩定义\u201C相关\u201D的标准是什么？autocompact 连续失败后的降级体验？"),
  li("单线程天花板：Bash 命令执行 30 秒时主循环被阻塞，用户看到冻结的终端。"),
  li("胖核心演进困境：query/ 子模块已经开始出现——胖核心正在悄悄减肥。"),
  li("内外版本分叉：ant 用户和外部用户体验的是两个不同的 Claude Code，这是透明度问题。"),
  div(),

  // 结语
  new Paragraph({ spacing:{before:200,after:0}, border:{top:{style:BorderStyle.SINGLE,size:2,color:C.accent}}, shading:{type:ShadingType.CLEAR,fill:C.quoteBg}, children:[new TextRun({text:" ",font:F.cn,size:10})] }),
  new Paragraph({ spacing:{before:120,after:80}, shading:{type:ShadingType.CLEAR,fill:C.quoteBg}, alignment:AlignmentType.CENTER, children:[new TextRun({text:"结  语",font:F.cn,size:28,bold:true,color:C.accent})] }),
  new Paragraph({ spacing:{before:80,after:80,line:380}, shading:{type:ShadingType.CLEAR,fill:C.quoteBg}, indent:{left:convertInchesToTwip(0.3),right:convertInchesToTwip(0.3)}, children:[new TextRun({text:"QueryEngine 这 13000 行代码告诉我们：Agent 产品的核心不是接了哪个模型，而是中间这条\u201C脊椎\u201D怎么设计。88 行的 Agent Loop 谁都能写，但让它在真实场景下稳定运行，需要的工程量比直觉预期大两个数量级。",font:F.body,size:21,color:C.body})] }),
  ...([ ["1.  ","上下文工程不是可选项，是基础设施。","200K 窗口上还做六层压缩，每层解决不同粒度问题。"], ["2.  ","工具执行的串行等待可以打破。","StreamingToolExecutor + 投机性分类器，每次省 200ms 就是竞争优势。"], ["3.  ","Agent 核心状态机，慎拆。","胖核心违反直觉但有合理性——但注意临界点。"] ].map(([num,bold,rest]) => new Paragraph({ spacing:{before:40,after:40,line:340}, shading:{type:ShadingType.CLEAR,fill:C.quoteBg}, indent:{left:convertInchesToTwip(0.5),right:convertInchesToTwip(0.3)}, children:[ new TextRun({text:num,font:F.body,size:21,color:C.accent}), new TextRun({text:bold,font:F.body,size:21,bold:true,color:C.body}), new TextRun({text:rest,font:F.body,size:21,color:C.body}) ] }))),
  new Paragraph({ spacing:{before:80,after:200}, border:{bottom:{style:BorderStyle.SINGLE,size:2,color:C.accent}}, shading:{type:ShadingType.CLEAR,fill:C.quoteBg}, children:[new TextRun({text:" ",font:F.cn,size:10})] }),
  div(),
  new Paragraph({ spacing:{before:100,after:20}, children:[new TextRun({text:"Claude Code 源码拆解系列 #04",font:F.body,size:18,color:C.light})] }),
  new Paragraph({ spacing:{before:0,after:20}, children:[ new TextRun({text:"原文链接：",font:F.body,size:18,color:C.light}), new TextRun({text:COVER_META.originalUrl,font:F.en,size:18,color:C.accent}) ] }),
];

const document = new Document({
  styles: { default: { document: { run:{font:F.body,size:21,color:C.body}, paragraph:{spacing:{line:360}} } } },
  sections: [
    { properties: { titlePage:true, page:{margin:PAGE_MARGIN} }, children: coverChildren },
    { properties: { page:{margin:PAGE_MARGIN} }, children: bodyChildren },
  ],
});

const outBase = process.argv[2] || path.join(__dirname, "../output");
const docxPath = outBase.endsWith(".docx") ? outBase : `${outBase}.docx`;
Packer.toBuffer(document).then((buf) => { fs.writeFileSync(docxPath, buf); console.log(`docx: ${docxPath}`); });
