# 配图风格 prompt — paper 信息图（gpt-image-2 / OpenAI 兼容网关）

> 配图目的：**传达信息，与文段等价**（不是只放标题）。**布局符合人的思维逻辑**（因果 / 对比 / 流程 / 层级 / 同心圆）。
> 模型：`gpt-image-2`（中文渲染准确，已验证）。endpoint：`https://api.openai.com/v1/images/generations`，返回 `data[0].b64_json`。
> 旧 SVG→PNG 路径中文变 □□□ 方块，已废弃；改 gpt-image-2 直接出图。

## STYLE（每张图都拼这段）

```
Minimal editorial infographic on warm cream paper background (#F7F1E8).
Ink-black text (#2A241B), brick-red accents (#B85A3A), soft pastel fills used
sparingly (dusty rose #E1A4C2 / sage #B7C7A8 / lilac #C9BEDC / muted lemon #D6DD63).
Elegant serif headline, clean sans-serif labels. Notion-style rounded boxes
connected by thin arrows. Flat vector, NO photoreal, NO 3D, NO heavy gradients,
calm magazine layout with generous whitespace. ALL Simplified Chinese characters
must be rendered accurately and legibly, correct strokes, no garbled glyphs.
```

## 每张图 prompt 结构

```
<STYLE>
Layout: <landscape 1536x1024 | square 1024x1024>.
Cognitive logic: <因果 / 左右对比 / 三阶递进 / 同心圆 / 时间线 — 选一个，明确说>.
Topic title (serif, top): 「<章节标题>」
Render these EXACT Chinese labels and their spatial relationship:
  <把 scene_plan 的 bullets / key_example 转成"框 + 箭头 + 分组"的明确空间描述>
Keep it information-dense but uncluttered; the diagram alone should convey the
same meaning as the paragraph.
```

## 尺寸

- 章节图 / 流程图 / 对比图：`1536x1024`（横，匹配视频 16:9 + 邮件宽卡）
- 封面：`1024x1024` 或 `1536x1024`
- 同心圆 / 矩阵：`1024x1024`

## 调用（已验证）

```bash
export IMAGEGEN_BASE_URL=https://api.openai.com/v1
export IMAGEGEN_API_KEY=sk-...        # 不入库
export IMAGEGEN_MODEL=gpt-image-2
python3 tools/imagegen_relay.py --batch <batch.jsonl> --root output/<slug> --concurrency 2
# 或直接 curl /v1/images/generations，body: {"model":"gpt-image-2","prompt":"...","size":"1536x1024"}
```

## 验收

- 中文字字准确（无方块、无错字、无半字）
- 信息量 ≈ 对应文段（不是只有标题）
- 认知逻辑清晰（一眼看出因果/对比/流程方向）
- 色板与邮件 paper 主题一致（奶油纸 + 砖红 + pastel）
