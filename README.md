# deep-decode

**AI 内容深度拆解套装**。三种输入 × 五件套产出的一整套深度解读工作流 —— 一条 URL 进去，深度长文、信息图、图文文档、播客、**带字级字幕的解说视频**出来。

不是翻译，不是摘要 —— 是**用自己的框架重构原文逻辑**。

## 三种输入模式

| 输入 | Skill 主体 | 适用 |
|------|-----------|------|
| 博客 / 推文 URL | [`SKILL.md`](./SKILL.md)（deep-decode 主线） | claude.com/blog、anthropic.com、openai.com、langchain.dev、x.com 长推等 |
| 产品 / 公司 / 人物名 | [`decode-entity-SKILL.md`](./decode-entity-SKILL.md)（横纵分析：时间轴 + 同期竞品） | 「拆 Cursor」「起底 Anthropic」「Karpathy 是谁」 |
| 热点话题 | [`hot-history-SKILL.md`](./hot-history-SKILL.md)（热点 × 历史先驱配对） | 「LLM Wiki 配 Bush 1945 Memex」「Skill 系统配 Minsky 1974 Frames」 |

## 五件套产出

每种模式都产出五件套：

1. **深度解读 .md** —— 观点密度极高，每段判断都带证据
2. **信息图** —— 通过 `gpt-image-2` 直接生成 paper 风格中文信息图（图的信息量与文段等价、布局符合认知逻辑），见 [`tools/imagegen_paper_style.md`](./tools/imagegen_paper_style.md)
3. **图文 Word 文档** —— 正文 + 配图嵌入
4. **播客 .mp3** —— 第一人称口语，TTS 合成（VoxCPM 零样本克隆 / 豆包）
5. **解说视频 .mp4** —— **脚本驱动 + 字级字幕高亮 + 音画严格同步**（详下）

## 视频生产（脚本驱动）

视频不从文章硬切，而是从一份**带视觉提示的 TTS 脚本**派生 —— 同一份脚本同时承载旁白（音轨）和分镜（画轨），单一 source of truth，音画天然同步。

- **scene 从脚本派生**：每个 scene 自带 `[visual]` 视觉块 + `[narration]` 旁白，`narration_segment_idx` 把每个画面精确绑到字幕段，保证任意时刻"念到哪、画到哪"对齐。详 [`modules/script-driven-video-spec.md`](./modules/script-driven-video-spec.md)。
- **字级字幕**：[`tools/voxcpm_align_to_captions.py`](./tools/voxcpm_align_to_captions.py) 用 faster-whisper 把 TTS 音频做字级对齐，生成字级 `captions.json`，渲染时正在朗读的字逐字高亮。
- **配图同源**：章节信息图用 [`tools/gen_images.py`](./tools/gen_images.py)（`gpt-image-2`）批量生成，paper 风格统一，渲进视频与文档一致。
- **渲染**：React / Remotion 把 scene plan + 字级字幕 + 配图 + 音轨合成 mp4。

## 路线图

- [ ] **GSAP 驱动的定制动效组件库** —— 视频渲染目前用基础组件（静态图 plate + 简单转场）。下一步默认改用 [GSAP](https://gsap.com/) 做定制 React 动效组件：时间线编排、spring / scroll 转场、关键词强调动画，让解说视频从"图 + 字幕"升级到有节奏的动态信息图。当前仓库尚未包含这套定制组件，是优先级最高的未来工作。
- [ ] 字幕本地化（英文版视频）
- [ ] 动态主题切换（多套视觉风格）

## 这是什么

一套写给 AI Agent（Claude Code / Cursor / 其他支持 Skill 的环境）的**可复用工作流**。Skill 文件 + 写作风格知识库 + 完整生产现场快照 + 知识图谱索引，clone 下来就能让你的 agent 立刻具备这套能力。

## 快速上手

### 给 AI Agent 用

直接读 [`AGENTS.md`](./AGENTS.md) — 那是为 agent 写的入口索引，告诉它「想做什么 → 该读哪个文件 → 文件之间什么关系」。

### 给人看

1. 拆解效果长什么样 → 翻 [`examples/2026-04-09-managed-agents-architecture/`](./examples/2026-04-09-managed-agents-architecture/)（含 6 张 SVG + 完整 .docx）
2. 信息图风格怎么定义 → [`tools/imagegen_paper_style.md`](./tools/imagegen_paper_style.md)
3. 视频管线怎么保证音画同步 → [`modules/script-driven-video-spec.md`](./modules/script-driven-video-spec.md)
4. 写作风格怎么定义的 → [`knowledge/writing-style.md`](./knowledge/writing-style.md)
5. 横纵分析框架 → [`knowledge/horizontal-vertical-analysis-prompt.md`](./knowledge/horizontal-vertical-analysis-prompt.md)
6. 项目设计哲学 → [`docs/ground-truth.md`](./docs/ground-truth.md)
7. 全量生产现场快照 → [`studio/`](./studio/)（37 MB，1800+ 文件）

## 目录

```
SKILL.md                  # deep-decode 主 Skill（输入 URL）
decode-entity-SKILL.md    # decode-entity Skill（输入实体名，横纵分析）
hot-history-SKILL.md      # hot-history Skill（输入热点话题，历史配对）
tools/                    # 出图 / 字级对齐等可复用脚本
  gen_images.py           #   gpt-image-2 批量出 paper 信息图（凭证从环境变量读）
  imagegen_paper_style.md #   paper 风格 prompt 模板
  voxcpm_align_to_captions.py  # faster-whisper 字级对齐 → captions.json
modules/                  # 生产规范
  script-driven-video-spec.md  # 脚本驱动视频 spec（音画同步）
skill-references/         # Skill 内部引用：评分提示、播客管线、踩坑清单
knowledge/                # 写作 / SVG / 播客 / 渠道规范 / 横纵 / 热点配对
context/                  # 范文标注（拆开看「好文章为什么好」）
examples/                 # 4 篇精选代表作（含 managed-agents 完整四件套二进制）
docs/                     # 项目级文档：ground-truth / changelog / next_steps
studio/                   # 完整生产现场快照（37 MB）
graphify-out/             # 知识图谱：markdown-index.json + GRAPH_REPORT（AST 15k 节点）
```

## 状态

**早期开源版本，欢迎在此基础上改造。** 文 / 图 / 文档 / 播客 / 视频五件套管线已跑通；GSAP 定制动效组件库是下一步重点（见路线图）。

## License

MIT
