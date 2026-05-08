# Article Brief #1: 1902个文件里藏了什么：Claude Code 源码泄露全景

## Core Thesis
Claude Code 的源码泄露揭示了一个事实：AI 编程助手的竞争力不在模型（harness > model），而在于围绕模型构建的工程体系——六层自研架构、六级安全、双 AI 制衡、记忆系统——这套体系的复杂度和精密程度远超行业想象。

## Key Evidence (5 items)

1. **59.8MB source map → 1902 TS 文件 / 512,000 行代码** — 完整 TypeScript 源码通过 .npmignore 配置失误泄露到 npm 包。GitHub 镜像 30,000 stars, 40,200 forks (CyberNews 数据)

2. **六层架构，全栈自研** — QueryEngine 13K 行(对话编排+Prompt组装+工具调度+Snip压缩+Token追踪), Ink UI 80+文件(React终端UI), 核心链路零外部依赖

3. **双 AI 安全架构** — 主 AI 执行 + 独立 Sonnet(T=0) 分类器 + 四道流水线(bashClassifier → yoloClassifier → 权限网关 → 熔断机制)

4. **四个隐藏功能构成产品路线图** — KAIROS(7x24后台Daemon,原计划4/1上线) / Buddy系统(18物种5稀有度RPG宠物) / Undercover Mode(抹除AI痕迹,~90行) / Anti-Distillation(fake_tools毒化竞品训练数据)

5. **同款错误犯两次** — 2025-02 v0.2.8 base64反混淆泄露, 2026-03-31 v2.1.88 完整TS源码泄露。Anthropic 收购了 Bun, runtime bug 20天前就被报了但没修(dev.to Varshith Hegde)

## Cross-Validation Signals (8 sources)

1. **VentureBeat 安全分析** — GitGuardian: Claude Code commits leak secrets at 3.2% vs 1.5% baseline; Gartner: 90% AI-generated code → diminished IP protection; 同日 axios 供应链攻击 00:21-03:29 UTC

2. **Engineer's Codex** — print.ts: 5,594行总量, 单函数3,167行, 12层嵌套; 187 spinner verbs; "LLM-oriented comments throughout, written for AI agents not humans"

3. **dev.to 反面论证** — 质疑：4/1愚人节前夕+Buddy原定4/1-7上线, 真的是意外吗?

4. **The Guardian** — Anthropic 确认 "human error"

5. **Zscaler ThreatLabz** — CVE-2025-59536, CVE-2026-21852 已知漏洞现在更容易被利用

6. **APIYI** — Chaofan Shou (@Fried_rice) at Solayer Labs first discovered; 比作 Android 开源推动生态

7. **CyberNews** — Hacker News noted regex filter for swear words (negative sentiment detection)

8. **Randal Olson** — 40 tool modules across 184 files, ~50,800 lines; 7 categories

## 6 Items for Structural Anatomy

1. Core thesis: harness > model, 工程体系才是护城河
2. Hidden assumptions: "源码泄露=护城河被削弱"是浅层判断; Anthropic从第一天就把安全当地基
3. Key evidence: above 5 items
4. Blind spots: 开源复刻版实际能力未评估; Buddy系统用混淆躲过内部扫描说明内部流程有问题; 为什么第二次还犯(DMCA/CI/CD?)
5. Reader: AI从业者/竞品工程师/投资分析
6. Visualization: 7 SVGs already produced (六层架构/双AI安全/隐藏功能矩阵/记忆系统/遥测三通道/泄露时间线/护城河矩阵)

## Image References (use these in article)
- ![六层架构](material/pngs/01_六层架构.png)
- ![双AI安全架构](material/pngs/02_双AI安全架构.png)
- ![隐藏功能矩阵](material/pngs/03_隐藏功能矩阵.png)
- ![记忆系统](material/pngs/04_记忆系统.png)
- ![遥测三通道](material/pngs/05_遥测三通道.png)
- ![泄露时间线](material/pngs/06_泄露时间线.png)
- ![护城河矩阵](material/pngs/07_护城河矩阵.png)
