---
title: 脚本驱动视频生产（Script-Driven Video）— Spec v1
type: production-spec
created: 2026-05-25
updated: 2026-05-25
status: v1
tags: [remotion, video, script-driven, voiceover, scene-plan]
related: [[email-video-v2-spec]] [[doubao-tts-context]] [[signature-and-watermark-rules]] [[../wiki/evaluation/2026-05-25-happy-path-skip-and-agent-perjury]]
---

# 脚本驱动视频生产 — Spec v1

> **核心原则**：scene_plan 不再从 article.md 派生，从 **TTS 脚本** 派生。脚本同时承载 narration（音轨）和 visual cue（画轨），**单一 source of truth**。

## 0. 为什么

V3/V4/V5 系列发现的根因（[[../wiki/evaluation/2026-05-25-happy-path-skip-and-agent-perjury]] 没记的新事故）：

```
article.md (5 章)  →  scene_plan (按 article 切)  ┐
                                                │  互相不知道
TTS script (子 agent 自由写, 7 段)  →  podcast.mp3 ┘  必然不同步
```

子 agent 写脚本会**重组叙事**（开场总览 / 加新章节 / 跳过原章节），但 scene 还在按 article 切——音画各自飞，必然错位。

修复：scene 跟着脚本走，脚本是唯一 source。

## 1. 脚本 schema（带视觉提示）

子 agent 写脚本时**同时标视觉**：

```text
[scene cover]
[visual] cover_collage
[hook] 75 亿美元，2018 年那笔收购的金额
[narration]
75 亿美元，2018 年那笔收购的金额。当时纳德拉给出的承诺只有一句话，
GitHub 会保持独立运营。八年之后，这个承诺事实上失效了。

[scene hook]
[visual] hook_number
[big_number] 2018
[big_label] 纳德拉花 75 亿美元买下 GitHub
[narration]
2018 年 6 月，纳德拉宣布微软以 75 亿美元收购 GitHub。

[转场]

[scene chapter:organization]
[h2] 第一层：组织层在崩
[visual] image_plate(01_timeline.png)
[bullets]
- 多姆克 2025/8 辞职
- CEO 不补任
- 帕里克拍板
- 佩默尔走人
[narration]
先看组织层发生了什么。2025 年 8 月，GitHub 的 CEO 多姆克辞职。
微软的反应不是再补一个 CEO，而是直接不补 ...

[转场]

[scene chapter:developer_sentiment]
[h2] 第三层：开发者情绪
[visual] quote_card
[quote_text] GitHub 每天都让我失望，而且这件事是私人的
[quote_attr] Mitchell Hashimoto · Ghostty 作者 / HashiCorp 联合创始人
[narration]
第三层，是开发者情绪。Ghostty 终端的作者桥本 ...

[转场]

[scene outro]
[visual] outro_default
[cta] 收尾一句判断
[narration]
GitHub 在微软手里的这场结构性瓦解，本质不是组织调整 ...
```

## 2. 块语法定义

### 2.1 顶层块（scene 切分）

| 标记 | 强制字段 | 可选字段 | 说明 |
|---|---|---|---|
| `[scene cover]` | `[hook]` `[narration]` | `[visual]` | 封面，画面+大标题+钩子 |
| `[scene hook]` | `[big_number]` `[big_label]` `[narration]` | `[visual]` `[sub]` | 数字钩子 scene |
| `[scene chapter:<id>]` | `[h2]` `[narration]` | `[visual]` `[bullets]` `[key_example]` | 章节，可多个，id 唯一 |
| `[scene quote]` | `[quote_text]` `[narration]` | `[quote_attr]` `[visual]` | 金句 scene |
| `[scene outro]` | `[cta]` `[narration]` | `[visual]` | 收尾 |
| `[转场]` | — | — | 强制分段（不进 scene_plan，仅给 TTS 切段用）|

### 2.2 视觉块

| 标记 | 取值 | 说明 |
|---|---|---|
| `[visual]` | `cover_collage` / `hook_number` / `image_plate(filename.png)` / `quote_card` / `outro_default` | 主视觉，对应 sub-scene 组件 |
| `[h2]` | 章节标题（≤30 中文字符）| 显示在 chapter scene 顶部 |
| `[bullets]` | 列表（- 开头）| 显示在 chapter scene，每个 bullet 自动滑入 |
| `[key_example]` | 一段引文/例子（≤200 字）| 黑/亮底卡片浮现 |
| `[quote_text]` | 引文正文 | 金句 scene 主显 |
| `[quote_attr]` | 引文归属 | 金句 scene 副显 |
| `[big_number]` | 大数字 | hook scene 巨号 |
| `[big_label]` | 数字说明 | hook scene 副文 |
| `[hook]` | 一句话钩子 | cover scene 副标题 |
| `[cta]` | CTA 一句话 | outro scene |

### 2.3 narration 块

`[narration]` 标记后**所有内容到下一个 `[scene` 或 `[转场]` 之前**都是 TTS 朗读文本。**不进 scene_plan，只喂 TTS**。

可以含 `**强调词**`（→ `，强调词，` 豆包友好预处理）。

## 3. script_to_scene_plan.py 转换规则

```python
def parse_script(script_text):
    """解析视觉脚本 → scene_plan + tts_text"""
    scenes = []
    tts_segments = []  # 按 [转场] 切，喂豆包
    
    blocks = re.split(r'^\[scene ([^\]]+)\]$', script_text, flags=re.MULTILINE)
    
    for scene_kind, content in zip(...):
        # 解析每个 scene 块的字段
        scene = {
            'kind': scene_kind.split(':')[0],  # cover/hook/chapter/quote/outro
            'id': scene_kind.split(':')[1] if ':' in scene_kind else None,
            'visual': parse_field(content, 'visual'),
            'h2': parse_field(content, 'h2'),
            'bullets': parse_list(content, 'bullets'),
            'narration': parse_field(content, 'narration'),  # 这段进 TTS
            ...
        }
        scenes.append(scene)
        tts_segments.append(scene['narration'])
    
    return {
        'scenes': scenes,
        'tts_script': '\n[转场]\n'.join(tts_segments),
    }
```

**关键约束**：
- 每个 scene 必有 `narration`
- 每个 scene 的 `duration_s` = 该 scene narration TTS 实际时长（合成后填）
- TTS 脚本（喂豆包的）= 所有 narration 拼接
- scene_plan 顺序 = 脚本里 scene 出现顺序

## 4. 子 agent brief 改动（关键）

W3b-1 用的 brief 改成：

```
任务：读 article.md 写 video_script.txt（脚本驱动视频，不是单纯 TTS 脚本）。

格式：每个 scene 一个块，含 [visual] [narration] 等字段。可参考 modules/script-driven-video-spec.md § 1。

general guideline:
- 不念主持人名字
- 中性企业媒体风 + 口语化
- 不用夸张词
- 应用 pronunciation_replacements.yaml 音译字典
- scene 顺序：cover → hook → 3-5 个 chapter（按你叙事逻辑组织，不必照搬 article 章节）→ optional quote → outro
- 每个 scene narration 50-300 字（5-10 分钟视频 = ~2500-3000 字）
- chapter 的 visual 优先 image_plate(对应 PNG)；如果新章节 article 没图，用 quote_card 或纯字
- bullets 每章 2-4 条，从 narration 抽核心
```

## 5. scene_plan_v3 schema（最终输出）

```json
{
  "slug": "...",
  "signature_key": "internal",
  "schema_version": "v3-script-driven",
  "scenes": [
    {
      "kind": "cover",
      "duration_s": 12.3,    // narration TTS 实际时长
      "visual": "cover_collage",
      "hook": "75 亿美元，2018 年那笔收购",
      "narration_segment_idx": [0],   // 对应 captions.json segments[0]
      "narration_text": "75 亿美元..."
    },
    {
      "kind": "hook",
      "duration_s": 8.4,
      "visual": "hook_number",
      "big_number": "2018",
      "big_label": "纳德拉花 75 亿美元买下 GitHub",
      "narration_segment_idx": [1],
      "narration_text": "..."
    },
    {
      "kind": "chapter",
      "id": "organization",
      "duration_s": 78.2,
      "visual": "image_plate",
      "image": "assets/png/01_timeline.png",
      "h2": "第一层：组织层在崩",
      "bullets": ["多姆克辞职", "CEO 不补任", "帕里克拍板", "佩默尔走人"],
      "narration_segment_idx": [2, 3, 4, 5],
      "narration_text": "..."
    },
    ...
  ]
}
```

**音画同步保证**：每个 scene 的 `duration_s` = 该 scene narration 的 captions 段时长总和。captions 段索引在 `narration_segment_idx`。

## 6. Remotion 渲染层（W3a sub-scene 组件复用）

| scene kind | 组件 |
|---|---|
| cover | `CoverScene`（W3a 已有） |
| hook | `HookScene`（W3a 已有） |
| chapter | `ChapterContainer` 内部按 `visual` 字段路由：`image_plate` → `ImagePlate` + `BulletReveal` 系列；`quote_card` → `QuoteScene` |
| quote | `QuoteScene`（W3a 已有） |
| outro | `OutroScene`（W3a 已有） |

**ChapterContainer 改动**：不再自己拆 sub_scenes，而是接 scene_plan 里 chapter scene 的 `visual` + `bullets`，按 visual 路由组件序列。

## 7. 验收门（新加 § 7）

每个视频渲完跑：

```python
def validate_audio_visual_sync(slug):
    """音画同步验证"""
    plan = load(f"output/{slug}/scene_plan_v3.json")
    captions = load(f"output/{slug}/captions.json")
    
    for scene in plan["scenes"]:
        # 1. scene 必有 narration_segment_idx
        assert scene["narration_segment_idx"]
        
        # 2. duration_s == captions 段时长总和（容差 200ms）
        cap_dur = sum(captions["segments"][i]["end_ms"] - captions["segments"][i]["start_ms"]
                      for i in scene["narration_segment_idx"]) / 1000
        assert abs(scene["duration_s"] - cap_dur) < 0.2
        
        # 3. chapter 的 visual 引用的 PNG 存在
        if scene["kind"] == "chapter" and scene.get("visual") == "image_plate":
            assert exists(f"output/{slug}/{scene['image']}")
    
    # 4. 总时长 ≤ podcast.mp3 时长（容差 1s）
    total = sum(s["duration_s"] for s in plan["scenes"])
    podcast_dur = ffprobe_duration(f"output/{slug}/podcast.mp3")
    assert abs(total - podcast_dur) < 1.0
```

## 8. 与 v2 spec 的差异

| 维度 | v2（[[email-video-v2-spec]]） | v3 (this) |
|---|---|---|
| scene_plan 来源 | article.md 章节抽取 | **video_script.txt 视觉脚本** |
| 子 agent 产物 | podcast_script.txt（纯 TTS） | **video_script.txt（脚本 + 视觉提示）** |
| sub_scenes 数量 | 算法死板（每章 12 个）| 由脚本决定（自由）|
| 音画同步 | caption_segment_range 估算 | **narration_segment_idx 精确**（TTS 段直接绑） |
| chapter scene 内部 | TitleReveal + N×BulletReveal + ImagePlate + KeyExample 五件套 | 按 `[visual]` 字段路由（更灵活）|

## 9. 实施顺序（先 microsoft 单篇验证）

1. **W4a-1**：子 agent 重写 microsoft 的 `video_script.txt`（带视觉提示）
2. **W4a-2**：写 `script_to_scene_plan.py`，把 script 拆成 `scene_plan_v3.json` + `tts_script.txt`
3. **W4a-3**：跑豆包 TTS 合成 podcast + captions
4. **W4a-4**：scene_plan 补 `narration_segment_idx` + `duration_s`
5. **W4a-5**：跑验收门 § 7
6. **W4a-6**：Remotion 渲新视频
7. **W4a-7**：IMAP 替换 microsoft

每步颗粒度小，独立验收。

## 10. 不破坏向后兼容

- 旧 `scene_plan_v2.json` 仍可被 Remotion 渲（fallback）
- 新 `scene_plan_v3.json` 新增 schema_version 字段，Root.tsx 按 version 路由
- `article_to_scene_plan.py` 保留但标 deprecated
- 现有 5 篇其他文章不动，等 microsoft 验证 OK 后再推
