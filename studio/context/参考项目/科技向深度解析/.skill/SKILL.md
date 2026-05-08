---
name: ai-sharing-docx
description: 将前沿 AI 博客/文章解读为图文穿插的 Word 文档（.docx）和 Markdown 笔记（.md），包含精美 SVG→PNG 贴图嵌入排版。当用户提供一篇文章链接并要求生成解读/笔记/分享文档时触发。也在用户说「做成文档」「整理成笔记」「生成 AI 笔记」时触发。
---

# AI 前沿分享 · 文档生成 Skill

将 AI 领域的前沿博客/文章解读为图文穿插的 .docx + .md 文档，风格参考「AI笔记」系列。

## 触发条件

用户提供了一篇 AI 相关文章（链接或内容），并要求生成解读、笔记、Word 文档或 Markdown 笔记。

## 工作流程

### Step 1: 内容获取与理解
1. 通过 WebFetch / WebSearch 获取原文内容
2. 提炼核心观点、结构、金句
3. **补充具体案例**——避免抽象，每个观点至少配一个实际案例

### Step 2: 制作精美 SVG 贴图
1. 为每个关键章节设计 SVG 信息图（暖黄底色 #FFF5E1 风格）
2. SVG 尺寸固定宽度 800，高度按内容适配（400-620）
3. 存放到日期目录：`AI_sharing_files/前沿分享/YYYY-M-DD/`

### Step 3: 建立 material 目录，SVG 转 PNG（2x 高清）

```bash
mkdir -p AI_sharing_files/前沿分享/YYYY-M-DD/material/pngs
```

```python
import cairosvg, os
date_dir = "AI_sharing_files/前沿分享/YYYY-M-DD"
for svg in os.listdir(date_dir):
    if svg.endswith(".svg"):
        name = svg[:-4]
        cairosvg.svg2png(
            url=f"{date_dir}/{svg}",
            write_to=f"{date_dir}/material/pngs/{name}.png",
            scale=2
        )
```

依赖：`pip3 install cairosvg` + `brew install cairo`

### Step 4: 生成文档脚本

1. 基于 `scripts/create_sharing_doc_template.js` 修改内容
2. **将定制好的脚本保存到 `YYYY-M-DD/material/create_doc.js`**
3. 脚本自动从 `./pngs/` 读取 PNG（相对于脚本所在的 material 目录）
4. 运行（节点模块已在 /tmp/node_modules）：

```bash
NODE_PATH=/tmp/node_modules node YYYY-M-DD/material/create_doc.js \
  "YYYY-M-DD/【AI笔记MMDD】标题"
```

这会同时生成：
- `YYYY-M-DD/【AI笔记MMDD】标题.docx`
- `YYYY-M-DD/【AI笔记MMDD】标题.md`

### Step 5: 输出规范

**最终目录结构：**
```
YYYY-M-DD/
├── 00_系列封面.svg
├── 01_xxx.svg
├── ...
├── material/
│   ├── pngs/
│   │   ├── 00_系列封面.png
│   │   └── ...
│   └── create_doc.js        ← 定制脚本（中间产物）
├── 【AI笔记MMDD】标题.docx   ← 最终输出
└── 【AI笔记MMDD】标题.md    ← 最终输出
```

- 文件名格式：`【AI笔记MMDD】标题`（无需扩展名，脚本自动加）
- SVG 文件留在日期目录根部（方便预览）
- 所有中间产物（PNG、脚本）归入 `material/`

---

## 文档风格规范

### 排版原则
- **暖色调**：强调 #C47B2B（古铜色）、正文 #333333、引用背景 #FFF5E1
- **字体**：中文 Songti SC（正文）/ Heiti SC（标题）、英文引用 Georgia、代码 Menlo
- **行距**：正文 1.5 倍行距（360 twips），紧凑段落 1.2 倍
- **页边距**：上 1 英寸，下 0.8 英寸，左右各 1.1 英寸
- **图文穿插**：每 1-2 个章节配一张信息图贴图，不要连续放多张图

### 内容结构
```
封面页（独立页）  大标题 / 副标题 / 中文标题 / 作者 / 日期 / 系列标识
                 封面贴图（00_系列封面.png）居中展示
正文（新页开始）  开篇：1-2 段背景 + 第一张内容贴图
                 分 01 02 03... 章节，每章：
                   - 核心观点
                   - 原文引用（英文斜体 + 中文翻译）
                   - 具体案例（至少 1 个）
                   - 信息图贴图（关键章节）
结语             暖黄背景 + 上下边线 + 3 条关键启示
脚注             原文链接、系列说明
```

**注意**：不写「我的思考」「个人洞察」等主观评论段落，只做原文观点整理。

### SVG 贴图设计规范
- 背景色 #FFF5E1，卡片底色 #FFF9EE，边框 #E8D5B5
- 强调色梯度：#C47B2B → #B8860B → #A0522D → #8B4513
- 字体：`PingFang SC, Georgia, serif`（中文在前，cairosvg 渲染要求）
- 每张图信息密度要够：包含案例、关键数据、对比

### 组件函数清单

| 函数 | 用途 | MD 对应 |
|------|------|---------|
| `h1(t)` | 一级标题（01 02 章节） | `## t` |
| `h2(t)` | 二级标题（带分割线） | `### t` |
| `h3(t)` | 三级标题 | `#### t` |
| `p(t)` | 正文段落 | `t` |
| `pb(a, b, c)` | 带加粗强调的段落 | `a **b** c` |
| `li(t)` | 无序列表项 | `- t` |
| `q(t)` | 英文原文引用 | `> *t*` |
| `qt(t)` | 引用翻译 | `> t` |
| `div()` | 章节分隔符 | `---` |
| `code(lines)` | 代码块 | `` ``` `` 块 |
| `img(name)` | 嵌入 PNG（从 ./pngs/ 读取） | `![name](material/pngs/name.png)` |
| `sp()` | 空行 | 空行 |

---

## 文件结构
```
.skill/
├── SKILL.md                              # 本文档
├── gotchas.md                            # 避坑指南
├── scripts/
│   └── create_sharing_doc_template.js    # Node.js 模板（复制到 material/ 后修改）
└── examples/
    └── 0324_claude_code_skills.js        # 完整参考实现（旧格式，仅供内容参考）
```
