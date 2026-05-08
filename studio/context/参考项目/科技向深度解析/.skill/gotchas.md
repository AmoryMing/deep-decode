# Gotchas

## 1. Node.js 运行路径
docx 包安装在 `/tmp/node_modules/`，运行时必须加前缀：
```bash
NODE_PATH=/tmp/node_modules node YYYY-M-DD/material/create_doc.js "YYYY-M-DD/【AI笔记MMDD】标题"
```
如果包不存在，先运行：`npm install --prefix /tmp docx`

## 2. 脚本存放在 material/ 目录内
`img()` 函数用 `path.join(__dirname, "pngs", name + ".png")` 来定位 PNG 文件。
脚本必须存放在 `YYYY-M-DD/material/create_doc.js`，否则 `__dirname` 指向错误，PNG 读取失败。
不要把脚本放在 `/tmp/` 或其他位置。

## 3. SVG 转 PNG 依赖链
需要 `brew install cairo` + `pip3 install cairosvg`。cairocffi 需要系统级 libcairo，仅 pip install 不够。

## 4. ImageRun 尺寸单位
`transformation: { width, height }` 的单位是 EMU（English Metric Units）。
从 twips 转换：`convertInchesToTwip(5.8) / 15` 得到合适的像素值。
SVG 宽度固定 800，通过 `5.8 * svgHeight / 800` 计算等比高度。

## 5. PNG 必须 2x 渲染
`cairosvg.svg2png(scale=2)` 确保高清。1x 在 Word 中会模糊。

## 6. 封面页必须是独立的 section
封面用 Document 的第一个 `section`，正文内容用第二个 `section`。
不要用 PageBreak 来模拟——用两个 section 才能保证封面无页眉/页脚、正文页码从 1 开始。
模板中已有封面 section 的正确写法，直接填 `coverMeta` 对象即可。

## 7. 不要连续放多张图
图文穿插原则：每张贴图前后应有文字内容。连续两张图会让排版显得松散。

## 8. 引用块的视觉连续性
`q()` 和 `qt()` 应紧挨使用。q 的 after spacing 为 0，qt 的 before spacing 为 0，确保视觉上是一体的。

## 9. 颜色值不带 #
docx 库的 color 属性不接受 `#` 前缀。写 `"D2691E"` 而不是 `"#D2691E"`。

## 10. 不写「我的思考」
0316 期确立的风格：只做原文观点整理 + 案例补充，不加整理人主观评论。

## 11. 文件命名约定
输出 base path 以 `【AI笔记MMDD】` 开头，脚本自动生成 `.docx` 和 `.md` 两个文件。
SVG 以 `00_` `01_` 编号 + 中文描述命名。

## 12. SVG 中文字体（关键！）
cairosvg 的 font-family fallback 机制：**中文字体必须在英文字体前面**，否则中文渲染为方框。
- 正确：`font-family="PingFang SC, Georgia, serif"`
- 错误：`font-family="Georgia, PingFang SC, serif"` — 中文全是 □□□
- 错误：`font-family="Georgia, 'PingFang SC', serif"` — 引号无效

## 13. Word 中文字体（与 SVG 分开）
docx 库中用 `PingFang SC` 在 Windows 上会缺字体。实际使用：
- 标题：`Heiti SC`
- 正文：`Songti SC`
- 英文引用：`Georgia`
- 代码：`Menlo`

## 14. SVG 中避免特殊 Unicode 符号
`✕` `✓` `√` `☑` 等符号在 cairosvg + PingFang SC 下会渲染为方框。
用纯文字替代：`✓` → 去掉或用「通过」，`✕` → 去掉或用「X」。
`→` 是安全的，可以正常使用。

## 15. MD 输出：mdLines 与 docx 内容保持同步
每次调用 `h1/h2/p/li/q` 等函数，内部都会同时向 `mdLines` 数组追加 Markdown 文本。
如果手写 `new Paragraph(...)` 绕过这些函数，MD 输出会缺失对应内容。
封面信息由脚本顶部单独写入 `mdLines`，不经过 helper 函数。

## 16. 结语模板
每篇文章必须包含结语区块（暖黄背景 + 上下边线 + 3 条关键启示）。
结语不是「我的思考」个人观点，而是从原文中提炼的可操作要点。
呼应开篇的核心问题，形成首尾闭环。
