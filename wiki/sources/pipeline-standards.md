
# 多渠道交付标准与模板包 v1

> **性质**：知识文件总入口（LLM Wiki 索引层）。
> **用途**：deep-decode / decode-entity / hot-history 跑完文章后，不用再到处翻——这一份告诉你每个渠道**应该长什么样**（标准）+ **拿来直接填**（模板）+ **发出去之前必须打钩**（质量门槛）。
> **配套**：写作（`writing-style.md`）/ 润色（`polish-7steps.md`）/ SVG（`svg-design.md`）/ 播客美学（`podcast-aesthetics.md`）/ HTML（`html-template.md`）/ 渠道规范（`channel-specs.md`）。

---

## 第一部分：标准索引——什么问题查哪个文件

| 我现在要解决的事 | 翻这个文件 | 一句话总结 |
|----------------|-----------|----------|
| 怎么写得不像 AI 味 | `writing-style.md` | 七条铁律 + AI 味清单 + 双受众原则 |
| 写完怎么润色 | `polish-7steps.md` | 7 步标尺 + 声音保留刹车条款 |
| 怎么画图 | `svg-design.md` | 双风格（漫画 / Notion）+ 字体顺序 + 渲染坑 |
| 怎么配音 | `podcast-aesthetics.md` | 标杆=声动早咖啡 + 响度 -16 LUFS + 声音选型 |
| 怎么转 HTML | `html-template.md` | 邮件/公众号/小红书三套 HTML 规则 |
| 各平台特殊约束 | `channel-specs.md` | 公众号封面/小红书 9 图上限/抖音字幕 |
| **现在就拿来填的模板** | **本文件第二部分** | 5 个渠道直接复制改 |
| **发布前必须打的钩** | **本文件第四部分** | 跨渠道质量门槛矩阵 |
| **管线统一元数据** | **本文件第五部分** | 一份 frontmatter 跑所有渠道 |

---

## 第二部分：5 渠道填空模板（直接复制改）

### 模板 A：微信公众号草稿

#### A.1 主题行 / 标题（最大权重）

**格式**：`{核心论点}：{副标题}`，**总长 ≤ 26 字**（标题在首页折叠位）

- ✅ "百万 token 上下文不再震撼：DeepSeek V4 与开源中国的常态化时刻"（25 字）
- ❌ "DeepSeek V4 来了！"（标题党）
- ❌ "深度解读 DeepSeek V4 Preview 版本的技术架构与商业逻辑"（标签词太长）

**要点**：
- 副标题里必须出现一个**反直觉判断**或**自造概念**
- 不用感叹号、不用问号、不用 emoji
- 不用"震惊""重磅""炸裂""友商"

#### A.2 摘要（≤ 100 字）

公众号摘要 = 推送预览。读者决定是否点开就看这 100 字。

**结构**：1 个数据钩子 + 1 个反直觉判断 + 1 个动作锚点

**模板**：
```
{原文核心数字 / 时间锚点}。{一句话反直觉判断}。
对 PM/产品人意味着 {一个具体决策}。
```

**示例**：
```
2026-04-24，DeepSeek V4 Preview 上线，HN 1041 点赞，金融市场不动。
开源中国正在从颠覆者变成常态供应商——这本身是个信号。
对 PM 意味着：V4-Flash 输入 0.2 元/M，该列入短期切换名单。
```

#### A.3 封面图

`thumb_media_id` 必填（缺则 40007 报错）。

**优先级**：
1. 同目录文件名含"封面" / "cover" / "00_" 的图
2. 第一张主概念图（01_xxx.png）
3. 截图当封面（截原文最关键一张图）

**尺寸建议**：横版 2.35:1（约 900x383），过长会被剪裁，过窄被拉伸。

#### A.4 元信息行（h1 下方那一行）

```
2026-04-25 · AI Force 情报组 · 阅读 6 分钟
```

阅读时长按 **400 中文字 / 分钟** 估算。4500 字稿 ≈ 11 分钟（向下取整为 6-8 分钟，避免吓退读者）。

#### A.5 正文章节结构（必须）

```
[h1] 标题
[元信息行]
[hr 主分割 蓝绿色]

[钩子段] 200-300 字，反直觉数据 / 时间压缩 / 措辞变化
[图 01-封面或时间线]

[h2] 一、{章节标题——动词或判断句，不用名词标签}
正文 400-600 字
[图 02-该章核心概念图]

[h2] 二、{...}
...

[hr 次分割]
[h2] 本期关键词
3-8 个新概念配中文白话解释

[h2] 原文关键引用
中英对照

[hr 次分割]
[签名段] 居中 12px 灰
"AI Force 情报组 · 衍明拆解 · {日期}"
```

#### A.6 底部 CTA

公众号文末必须有一段，模板：

```html
<p style="font-size:13px; color:#787774; text-align:center;">
  扫码关注 AI Force，下一篇拆解直达。
</p>
<p style="text-align:center;">
  <img src="cid:qr_code" style="width:120px; height:120px;">
</p>
```

#### A.7 红线

| 必须 | 不能 |
|------|------|
| 全内联样式 `style="..."` | `<style>` 标签 |
| 内联图 ≤ 1MB / 张 | class 属性（被剥） |
| `json.dumps(ensure_ascii=False)` | 外部链接图（被拦） |
| 中文字体在前（PingFang SC 优先） | "震惊体" / "友商震怒" |

---

### 模板 B：小红书图卡（3:4 卡片系列）

#### B.1 总数

**8-12 张**。少于 8 张信息密度不够，多于 9 张被 opencli 自动截断。

**目标**：9 张刚好（封面 1 + 内容 7 + CTA 1）。

#### B.2 卡片角色分配

| # | 角色 | 内容 | 字数 |
|---|------|------|------|
| 1 | 封面 | 大标题 + 1 句反直觉副标题 + "滑动 →" | 标题 ≤ 18 字 |
| 2 | 引子 | 1 个数据钩子 + 1 个判断 | ≤ 80 字 |
| 3-7 | 主体 | 每张 1 个论点 + 1 个证据 + （可选）1 张数据图 | ≤ 100 字 |
| 8 | 关键词 | 3-5 个新概念词云 | 单词 |
| 9 | CTA | "全文 + 图源链 → 公众号 AI Force" | ≤ 40 字 |

#### B.3 配文（笔记正文，不是图卡）

**前 40 字是生死线**。折叠后只看到这 40 字。

**模板**：
```
{反直觉钩子或数字} | {自造概念}。
{副论点 1}{副论点 2}{副论点 3}。
全文+图源 → 关注公众号 AI Force #ClaudeManagedAgents #AI产品 ...
```

**示例**（前 40 字）：
```
HN 1041 赞，金融市场不动 | 叙事疲劳。
开源中国正从颠覆者变常态供应商，反而是好事...
```

#### B.4 标签

- 不能有空格：`Claude Managed Agents` → `ClaudeManagedAgents`
- frontmatter 里 `tags: [claude managed agents]` 直接错——发布前 `.replace(" ", "")`
- 数量 5-10 个，混合：1 个圈内黑话 + 2 个泛话题词 + 2 个产品名

#### B.5 标题截断规则

≤ 20 字。**不能**硬截 `title[:18]`（会出"不再只.."这种半句）。

**正确做法**：
```python
# 从第 19 位向前找标点（：，、—）截断
def truncate_title(title, max_len=20):
    if len(title) <= max_len: return title
    for punct in ["：", "，", "、", "—"]:
        idx = title.rfind(punct, 0, max_len)
        if idx > 8:  # 至少保留 8 字
            return title[:idx]
    return title[:max_len-1] + "…"
```

#### B.6 配图渲染管线

```
markdown → markdown 库转 HTML（带内联 CSS） 
        → playwright headless 渲染（viewport 1080x1440）
        → 截全页长图 
        → Pillow 按 PAGE_H*DPR 切割为 3:4 页面
```

- 实际像素 2160x2880（@2x）
- 最后一页底部用 `Image.new("RGB", size, "#1a1a2e")` 补背景，避免露白

#### B.7 红线

| 必须 | 不能 |
|------|------|
| 9 张图（多了被截） | 同话题视频+图文同发（算法判水号） |
| 标签去空格 | 前 40 字没钩子 |
| 标题在标点处截 | 硬截留半句 |
| 最后一页补背景 | 底部露白 |

---

### 模板 C：企业邮件

#### C.1 主题行

**格式**：`【AI 笔记 MMDD】{标题}` —— MMDD = 4 位月日

- ✅ `【AI 笔记 0425】百万 token 上下文不再震撼：DeepSeek V4 拆解`
- ❌ `Re: Fwd: deepseek 的事`

#### C.2 收件人分级

| 类型 | 默认收件人 | 抄送 |
|------|----------|------|
| 团队周更 | 团队邮件组 | — |
| 给老板/Dave | dave@chinadaas.com | 自己 |
| 单点人物 | {对方} | 自己 |
| 跨部门 | 主收件人 + 团队组抄送 | — |

收件人地址规则：**全拼@chinadaas.com**（薛泓涛 → xuehongtao@...）。详见 `references/contacts.md`。

#### C.3 正文模板（HTML 版）

```html
<table width="680" style="background:#FFFFFF; border-radius:8px;">
  <tr><td style="padding:36px 40px;">

    <!-- 称呼 -->
    <p style="font-size:15px; color:#37352F; margin:0 0 16px 0;">
      Hi {名字 / 团队}，
    </p>

    <!-- 一句话结论（带橙底高亮） -->
    <p style="font-size:15px; line-height:1.9; color:#37352F; margin:0 0 16px 0;">
      <strong style="background:#FFF3E0; padding:1px 5px; border-radius:3px;">
        {一句话结论 + 1 个数据点}
      </strong>
    </p>

    <!-- 3 个关键判断 -->
    <p style="font-size:15px; line-height:1.9; color:#37352F; margin:0 0 16px 0;">
      具体看 3 件事：
    </p>
    <ol style="font-size:15px; line-height:1.8; color:#37352F; margin:0 0 24px 24px;">
      <li>{判断 1}</li>
      <li>{判断 2}</li>
      <li>{判断 3}</li>
    </ol>

    <!-- 信息图（CID 内联） -->
    <div style="text-align:center; margin:24px 0;">
      <img src="cid:infographic_01" style="max-width:100%; border-radius:6px;">
    </div>

    <!-- 具体执行（可选） -->
    <p style="font-size:15px; line-height:1.9; color:#37352F; margin:16px 0;">
      具体执行（如果你要拍板）：
    </p>
    <ol style="font-size:15px; line-height:1.8; color:#37352F; margin:0 0 24px 24px;">
      <li>{动作 1，含执行人 + 时间窗}</li>
      <li>{动作 2}</li>
    </ol>

    <!-- 全文链接 -->
    <p style="font-size:13px; color:#787774; margin:24px 0 0 0;">
      全文 + 图源 + 引用清单见附件 / 公众号「AI Force」。
    </p>

    <hr style="border:none; border-top:1px solid #E3E2E0; margin:24px 0;">

    <!-- 签名 -->
    <p style="font-size:12px; color:#787774; text-align:center; margin:0;">
      AI Force 情报组 · 衍明拆解 · 2026-04-25
    </p>

  </td></tr>
</table>
```

#### C.4 默认存草稿（用户偏好硬规则）

```bash
# 永远先 draft 不 send
python3 email_client.py draft \
  --to "..." \
  --subject "【AI 笔记 0425】..." \
  --body "$(cat email_body.html)" \
  --html
```

#### C.5 红线

| 必须 | 不能 |
|------|------|
| 主题含日期 + 标题 | 「Re: Fwd:」开头 |
| 全内联样式 | `<style>` / class |
| 图片 CID 内联 | 外链 / `localhost` / `file://` |
| 默认 draft 子命令 | 直接 send 未确认 |
| 表格 ≤ 680px | flexbox / grid |
| 行高 1.8+ | line-height: 1.4（邮件场景太挤）|

---

### 模板 D：播客脚本（10-12 分钟单人版）

#### D.1 总字数

**2500-3000 字**（中文朗读 ~300 字/分钟，目标 10 分钟）

#### D.2 结构模板

```
[品牌片头 0:00-0:04]
固定音频：intro_male.mp3 / intro_female.mp3（与主讲声音匹配）

[钩子 0:04-0:20]（约 80 字）
"今天聊一个反直觉的事 —— {数据} {反直觉判断}。
说到底就是 {自造概念}。我们一条条讲。"

[转场音效] page-turn.mp3（0.5 秒）

[正文章节 1（200-300 字）]
"先说第一件事：{章节核心论点}。{论据 1，含数据}。{论据 2}。
所以这意味着 {推论}。"

[转场]
[正文章节 2-7]（每段 200-300 字，对应文章主章节）

[结尾 30 秒]
"最后总结三个关键词：
第一，{关键词 1} —— {一句话}。
第二，{关键词 2} —— {一句话}。
第三，{关键词 3} —— {一句话}。
{短结语，1 句话}。"

[品牌片尾 2-3 秒]
固定音频
```

#### D.3 文字风格（口语化）

**必须有的连接词**：
- "说到这儿" / "有意思的是" / "回过头看" / "其实" / "对吧" / "话说回来"

**必须避免的书面词**：
- "我认为" → 用"数据表明" / "这意味着" / "值得注意的是"
- "首先...其次...最后" → 用"先说" / "再看" / "最后这件事"
- "综上所述" → 直接说结论

**节奏标记**（脚本里写，TTS 时跳过，拼接时换音效）：
- `[转场]` → 翻页音效 0.5s + 200ms 停顿
- `[强调]` → 该句 TTS 调高 5%
- `[停顿]` → 700ms 静音

#### D.4 双人对话版本（可选）

A 男（理性分析派）+ B 女（好奇追问派）

格式：
```
A: 今天我们聊一个奇怪的事。
B: 什么事？
A: {数据}，{判断}。
B: 等等，你刚才说的意思是...
A: 对，而且更有意思的是...
```

每段 2-4 句话，15-25 轮对话。

#### D.5 红线

| 必须 | 不能 |
|------|------|
| 响度 -16 LUFS | 单调语速 / 无语气词 |
| 字级时间戳（豆包 v2） | Whisper 后处理（已废弃，时间戳偏 0.5-2s）|
| 片头声音匹配主讲 | 男声播客用女声片头 |
| BGM 极低（-28dB） | BGM 抢戏 |
| 时长 8-15 分钟 | <8 分钟（信息不够）/ >15 分钟（注意力衰退）|

---

### 模板 E：视频字幕（视频号 / 抖音 / B 站）

#### E.1 视频结构

```
[封面卡 3 秒]
全屏 PNG（标题 + 反直觉副标题 + 「📍AI Force」logo）
背景音：BGM 渐入

[主体 8-12 分钟]
PNG 序列 + 播客音轨
每张 PNG 对应一个章节（停留 = 该章节朗读时长）
切换：硬切（cross-fade 0.3s）

[结尾卡 3 秒]
全屏 PNG（关键词 + CTA "公众号 AI Force" + 二维码）
背景音：BGM 渐出
```

#### E.2 字幕规格

| 维度 | 竖版（小红书/抖音/视频号） | 横版（B 站/YouTube） |
|------|--------------------------|---------------------|
| FontSize | 14 | 12 |
| MarginV | 20（贴近底部）| 24 |
| 颜色 | 白字黑边（OutlineColour=&H000000，Outline=2） | 同 |
| 字体 | 思源黑体 / PingFang SC | 同 |
| 字数 | 单条 ≤ 18 字 | 单条 ≤ 24 字 |

#### E.3 SRT 断句规则

**必须满足**：
- 句号/问号/感叹号必断
- 单句超 30 字时可在逗号断
- 每条字幕是**完整语义单元**——不能 "发起的一个自主小实验" 这种半句

**不能满足**：
- 任何位置硬截断
- 跨句拼接

#### E.4 字幕生成管线（v2，已验证）

旧方案废弃：~~Whisper base → DeepSeek 修字 → SRT~~ （时间戳偏 0.5-2 秒，专有名词全错）

**新方案**：
```python
# 1. 豆包 TTS v2，原生字级时间戳
audio, timestamps = text_to_mp3_sync(script, "podcast.mp3")

# 2. SRT 生成器（按句号/问号/感叹号断）
from srt_generator import build_srt
build_srt(timestamps, "podcast.srt", max_line_chars=18)

# 3. ffmpeg 烧字幕
ffmpeg -i video_raw.mp4 -vf "subtitles=podcast.srt:force_style='FontName=PingFang SC,FontSize=14,OutlineColour=&H000000,Outline=2,MarginV=20'" video.mp4
```

#### E.5 发布前样本测试（铁律）

**全量渲染前**先出 10 秒样本（前 10 秒 + 字幕）：
- 字号在手机屏上能不能看清
- 字幕位置有没有被 UI 遮挡（小红书/抖音底部 CTA 区是 ~80px 高的"死区"）
- 颜色对比度够不够

样本通过后再 ffmpeg 全量。

#### E.6 红线

| 必须 | 不能 |
|------|------|
| 硬字幕（burnt-in）| 依赖平台自动识别 |
| 完整语义单元断句 | 句中截断 |
| 10 秒样本测试 | 全量后才发现字号问题 |
| 16:9 / 9:16 单一选择 | 同时上传两版 |

---

## 第三部分：跨渠道复用矩阵——一份内容能怎么复用

| 源产物 | → 公众号 | → 小红书 | → 邮件 | → 播客 | → 视频 |
|--------|---------|---------|--------|--------|--------|
| article.md | 直接转 HTML | 转 HTML 切 3:4 卡 | 节选前 3 章 + 信息图 | 改写口语化 | 朗读 + PNG 序列 |
| infographic.svg | CDN 上传 | 嵌入图卡 | CID 内联 | — | 视频主体帧 |
| podcast.mp3 | 嵌入文末 | — | 附件（如要听）| 主产物 | 音轨 |
| video.mp4 | 嵌入文末 | 上传草稿 | 链接（云盘）| — | 主产物 |

**复用顺序**：article.md 永远先做完 → infographic.svg → podcast.mp3 → video.mp4 → 然后才分发。**任何一步偷懒，下游全偷懒**。

---

## 第四部分：跨渠道质量门槛矩阵（发布前打钩）

### 内容层（所有渠道）

- [ ] 钩子不是"今天 XX 发布了..."（用了反直觉数据 / 时间压缩 / 措辞变化）
- [ ] 至少 3 处基于证据的判断（"这意味着" / "数据表明"）
- [ ] 至少 1 个原创概念 / 自造词
- [ ] 至少 3 个外部信源交叉验证
- [ ] 原文关键金句保留原话引号 + 中文翻译
- [ ] 盲区/反面论证至少 1 段
- [ ] "对我们意味着什么"具体到可执行
- [ ] 没有"震惊" / "重磅" / "炸裂" / "友商震怒"
- [ ] 没有未标注来源的最高级（"最 XX"必须有数据）

### 视觉层（--deep / --podcast）

- [ ] 原站截图已截取并嵌入
- [ ] SVG ≥ 2 张 + 封面，概念清晰可独立传播
- [ ] SVG 字体 PingFang SC 在前
- [ ] PNG 2x 渲染（cairosvg.svg2png(scale=2)）
- [ ] 没有 ✕ ✓ √ 这类 cairosvg 不支持的 Unicode
- [ ] 没有嵌套 foreignObject

### 音频层（--podcast）

- [ ] 响度 -16 LUFS
- [ ] LRA ≤ 4
- [ ] 时长 8-15 分钟
- [ ] 字级时间戳已生成（豆包 v2）
- [ ] 片头声音匹配主讲
- [ ] BGM 在 -28dB 不抢戏

### 渠道层

| 渠道 | 必打钩 |
|------|--------|
| 公众号 | 标题 ≤ 26 字 / 摘要 ≤ 100 字 / 封面图存在 / 内联样式 / 无 class / 无外链图 / IP 在白名单 / `ensure_ascii=False` |
| 小红书 | 9 张图 / 标签去空格 / 标题在标点截断 / 配文前 40 字有钩子 / 最后一页补背景 / 不同话题不发两条 |
| 邮件 | 主题含日期+标题 / 称呼正确 / 全内联 / 图 CID / 表格 ≤ 680px / 高亮底色 / 浏览器预览过 / 默认 draft |
| 播客 | 响度达标 / 时长合格 / 片头匹配 / 字幕生成 / SRT 断句完整 |
| 视频 | 硬字幕 / 10 秒样本测过 / 字号合格 / 不在死区 / 单尺寸 |

---

## 第五部分：统一元数据 schema

每个 decode 文件夹根目录放一份 `meta.yaml`，所有渠道脚本共享：

```yaml
# meta.yaml — 多渠道交付统一元数据
slug: 2026-04-25-deepseek-v4
title: 百万 token 上下文不再震撼：DeepSeek V4 与开源中国的常态化时刻
subtitle: 开源中国从颠覆者变成常态供应商
date: 2026-04-25
authors: [AI Force 情报组]
decoded_by: 衍明
tags: [AI模型, DeepSeek, 开源, 长上下文, MoE, 行业观察]

# 统计
word_count: 4500
read_minutes: 11
source_count: 20

# 各渠道分发状态
distribution:
  wechat:
    status: draft       # pending | draft | scheduled | published
    draft_id: ""
    cover_image: material/pngs/00-cover.png
    publish_at: ""
    final_url: ""
  xhs:
    status: pending
    image_count: 9
    image_dir: distribute/xiaohongshu/
    note_caption: ""    # 配文前 40 字
    tags_clean: [ClaudeManagedAgents, AIPM, AI产品]
  email:
    status: draft
    recipients: []
    subject: 【AI 笔记 0425】百万 token 上下文不再震撼
    sent_at: ""
  podcast:
    status: produced
    duration_s: 720
    voice_type: zh_female_roumeinvyou_emo_v2_mars_bigtts
    audio_path: podcast.mp3
    srt_path: podcast.srt
    lufs: -16
  video:
    status: produced
    orientation: vertical   # vertical | horizontal
    has_subtitle: true
    duration_s: 720
    video_path: video.mp4
  douyin:
    status: pending
    needs_login: true
    draft_id: ""
  shipinhao:
    status: manual_only     # 没自动化方案

# 质量门槛打钩状态
quality_gates:
  factcheck: passed         # passed | failed | skipped
  polish_round: 1
  svg_count: 5
  png_2x: true
  hooks_used: ["反直觉数据", "金融市场对比"]
  red_flags_avoided: true   # 无震惊体 / 无外链 / 无 class
```

每个渠道脚本读这份 `meta.yaml` 决定干什么、跳什么。

---

## 第六部分：发布前最后一公里 checklist（一张图）

```
                  article.md ✓
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   svg ≥2 张      podcast.mp3    video.mp4
   PNG 2x       -16 LUFS        硬字幕
        │             │             │
        ▼             ▼             ▼
   [质量门槛矩阵 4 张表全过]
        │
        ▼
  meta.yaml 元数据齐
        │
        ▼
   ┌────┴────┬─────────┬───────┬────────┐
   ▼         ▼         ▼       ▼        ▼
公众号草稿  小红书图  邮件草稿  抖音    视频号
[draft]   [生成]    [draft]  [需要    [手动
  ↓                   ↓     登录]    上传]
人工审 → mp.weixin    人工审 → 发
  ↓                   ↓
公众号发布           SMTP send
```

**铁律**：每个渠道的"最后一公里"都是**人工确认**：
- 公众号：API 创建草稿 → 人工 mp.weixin 点发布
- 小红书：脚本生成图 → 人工 creator.xiaohongshu.com 审 → 发
- 邮件：脚本存 draft → 人工腾讯企业邮箱审 → 发
- 抖音：opencli draft → 人工抖音 App 审 → 定时发
- 视频号：完全手动

**不能跳过的人工节点**：因为这些渠道的 reach 是不可逆的，发出去等于喊出去。

---

## 第七部分：常见踩坑速查

| 症状 | 诊断 | 解决 | 详见 |
|------|------|------|------|
| 公众号中文乱码 `\uXXXX` | json.dumps 默认 ASCII | `json.dumps(d, ensure_ascii=False).encode('utf-8')` | channel-specs §A |
| 公众号 40007 错误 | thumb_media_id 缺失 | 找含"封面"/"cover"的图，调 add_material | channel-specs §A |
| 公众号 40164 错误 | IP 不在白名单 | 把脚本放在固定 IP 服务器 | channel-specs §A |
| 小红书 "Too many images" | 超 9 张被截 | 设计阶段限定 9 张 | channel-specs §B |
| 小红书标签变碎片 | tags 含空格 | `.replace(" ", "")` 发布前 | channel-specs §B |
| 小红书底部露白 | 最后一页未填满 | Image.new() 先建底色画布 | channel-specs §B |
| SVG 中文方框 | font-family 顺序错 | "PingFang SC, Inter, sans-serif"（中文在前）| svg-design §字体 |
| SVG 转 PNG 模糊 | scale=1 | `cairosvg.svg2png(scale=2)` | svg-design §渲染约束 |
| SVG ✕ ✓ 渲染方框 | cairosvg 不支持 | 改文字 / 用 → | svg-design §渲染约束 |
| 字幕时间戳偏 0.5-2s | 用了 Whisper 修正 | 改用豆包 v2 原生时间戳 | channel-specs §D |
| 字幕半句出现 | 在中间硬截 | 按句号/问号/感叹号断 | channel-specs §D |
| 邮件图片不显示 | 用了外链 | CID 内联 + MIMEImage | html-template §邮件 |
| 邮件表格溢出 | 超过 680px | 限定 max-width:680px | html-template §邮件 |
| 邮件直接发了未确认 | 没用 draft 子命令 | 默认改用 `email_client.py draft` | channel-specs §E |
| 抖音上传失败 | 没登录 cookie | `opencli douyin draft login` 先 | — |
| 视频号无法自动化 | opencli 无端 | 手动上传，没办法 | — |

---

## 第八部分：Skill 调用入口对应

| 我现在要 | 命令 | 产出位置 |
|---------|------|---------|
| 拆解一篇博客 | `/deep-decode <url>` | `vault/.../decode/<slug>/` |
| 起底一家公司 | `/decode-entity <名字>` | 同上 |
| 写自己经验 | `/practice-decode` | 同上 |
| 公众号草稿 | `python3 wechat_publish.py <md>` | mp.weixin 草稿箱 |
| 小红书图卡 | `python3 xhs_pipeline.py --article <slug>` | `<slug>/distribute/xiaohongshu/` |
| 邮件草稿 | `python3 email_client.py draft --to ... --subject ... --body ... --html` | 腾讯企业邮箱草稿箱 |
| 播客 | 在 deep-decode 加 `--podcast` 参数 | `<slug>/podcast.mp3` |
| 视频 | 暂无统一脚本，参考本文 §E.4 拼 | `<slug>/video.mp4` |
| 抖音 | `opencli douyin draft <video> --title ...` | 抖音草稿箱 |
| 视频号 | 手动 | — |

---

## 第九部分：决策树——某个产出物该上哪些渠道

```
有 article + svg？
  ├─ 是 → 公众号必上 + 小红书必上 + 邮件必上
  └─ 否 → 不发布

有 podcast？
  ├─ 是 → 公众号文末嵌入 + 小宇宙手动上传 + 视频底音轨
  └─ 否 → 跳过

有 video？
  ├─ 是 → 视频号 + 抖音 + B 站
  └─ 否 → 公众号文末用静态封面图

是否含敏感事实声明？
  ├─ 是 → 必跑 /fact-checker，未通过不发
  └─ 否 → 进 polish-7steps

读者是 leader / 老板？
  ├─ 是 → 邮件 + PPT 双产出
  └─ 否 → 公众号 + 小红书

时效性 < 24 小时？
  ├─ 是 → 优先公众号 + 邮件，跳过播客（生产慢）
  └─ 否 → 全套
```

---

## 版本日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-04-25 | 初版：从 channel-specs / podcast-aesthetics / svg-design / html-template 抽出"模板层"补齐，新增统一元数据 schema 与跨渠道质量门槛矩阵 |

---

> 这一份是入口。所有"标准"指向具体文件，所有"模板"在本文件第二部分直接复制改。
> 发布前必须打勾，meta.yaml 必须填齐，跑哪个渠道看第八部分入口表。
