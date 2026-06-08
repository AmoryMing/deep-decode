# 给你用 gpt-image-2 生成的信息图 prompt

> 用途：邮件正文顶部 hero 信息图（横版宽屏）。生成后存到 `material/pngs/hero_infographic.png`，我会嵌进邮件。

---

## 主推 Prompt（直接粘贴）

```
Create a clean, modern, editorial-style infographic in a wide horizontal format (16:9 ratio, 1920x1080px target), suitable for a tech industry analysis article.

TITLE (top center, bold serif or high-contrast sans): "设计这件事，正在被切成三段"
SUBTITLE (smaller, muted): "AI tools are slicing designer work at the middle — not replacing it"

COMPOSITION: Three-column layout showing the "Three-Layer Design Work" framework.

LEFT COLUMN — "判断段 Judgment Layer":
- Icon: a lightbulb with a question mark (warm orange accent, #E8A04E)
- Label (CN + EN): "这事值不值得做 / Is it worth doing?"
- Small tag "HUMAN" at bottom — solid pill badge
- Keywords below: 用户理解 · 商业感 · 产品直觉

MIDDLE COLUMN — "执行段 Execution Layer" (highlighted with a red accent border and "AI cutline" indicator):
- Icon: a set of design tools (pen, pixel grid, component blocks)
- Label: "把想法做出来 / Build it out"
- Small red tag "AI is cutting here" with a small arrow/knife icon
- Two sub-boxes below:
  - "Claude Design" (Anthropic blue #6B4FBB) — output: HTML/CSS/React code
  - "gpt-image-2" (OpenAI dark #1A1A1A) — output: reasoning-aware visuals

RIGHT COLUMN — "收尾段 Polish Layer":
- Icon: a magnifying glass over a pixel grid (细节把控)
- Label: "把它做对 / Get it right"
- "HUMAN" pill at bottom
- Keywords: 品牌一致性 · 视觉判断 · 细节

BOTTOM STRIP (bar of evidence, horizontal):
- "Figma stock -7% day / -35% YTD" with a small downward red arrow
- "Claude Design launched 04-17, gpt-image-2 launched 04-21"
- "Anthropic CPO resigned Figma board 04-16" (tag: "Conflict of interest management")

VISUAL STYLE:
- Clean white background (#FAFAFA), subtle grid
- Typography: hierarchical, CN + EN side by side; sans-serif with one serif accent for the title
- Color palette: muted warm (#E8A04E) + Anthropic purple (#6B4FBB) + deep charcoal (#1A1A1A) + white — NO rainbow, NO neon
- Flat illustration style, thin line icons, minimal shadows
- Leave visible breathing room; do NOT fill the whole canvas
- Numbers and data points should feel like a credible industry report (think: Stratechery, Bloomberg graphics)

TEXT RENDERING: All Chinese AND English labels must be crisp and readable. Prioritize Chinese text accuracy.

AVOID: cartoon mascots, 3D renders, stock-photo feel, generic AI-slop aesthetic, neon gradients, emoji.
```

---

## 备选 Prompt（更极简的版本）

如果上面的产出太复杂、太拥挤，换成这个更干净的：

```
Editorial infographic, 16:9, minimal style.

Headline: "Design work is being cut into three layers"
Subheadline: "AI is taking the middle one"

Three horizontal bands:
1. TOP band (labeled "Judgment / 判断段"): light warm orange background, icon of a lightbulb. Tag: "HUMAN"
2. MIDDLE band (labeled "Execution / 执行段"): charcoal background with red horizontal line cutting across. Shows "Claude Design" and "gpt-image-2" as two logos/icons inside. Tag: "AI is here"
3. BOTTOM band (labeled "Polish / 收尾段"): light warm orange, icon of a magnifying glass. Tag: "HUMAN"

Bottom footer: "Figma -7% on launch day, -35% YTD. Anthropic CPO resigned Figma board 04-16."

Clean, modern, Stratechery-style. White background. Sans-serif. NO cartoon, NO 3D, NO gradient neon.
```

---

## 生成完给我的要求

1. 命名为 `hero_infographic.png`
2. 放到 `material/pngs/` 下（完整路径在本目录里）
3. 分辨率 ≥ 1600px 宽（邮件适配）
4. 告诉我"图好了"即可，我把它 CID 内联进邮件 + 敲定最终草稿

如果你想多生成几张（比如额外的 §4 "被压缩的 vs 更值钱的" 矩阵图），也可以，我会看情况用到正文配图里。

---

## 为什么是这个结构

文章的核心洞察是**三段分层**——判断段、执行段、收尾段。AI 切的是中间那段。这张图就是把这个洞察用一张图讲完。读者一眼扫完不看正文也能抓住关键。信息图不是装饰，是 TL;DR。

邮件里的读者（薛泓涛、杨少伟）是技术/业务架构师——他们扫图的时间 > 读文的时间。图要能独立传达判断。
