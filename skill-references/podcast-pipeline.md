# 播客执行管线

> **性质**：执行脚本 / API 调用 / ffmpeg 命令。
> **听感美学 / 结构模板 / 声音选型** → `vault/.../knowledge/podcast-aesthetics.md`

---

## 总流程

```
文章 → LLM 脚本改写 → TTS 合成（豆包）→ 音效拼接 → BGM 混音 → 后处理 → podcast.mp3
```

---

## 1. 脚本改写（DeepSeek，$0.002/次）

### 单人模式（默认）

```python
from openai import OpenAI
client = OpenAI(api_key="...", base_url="https://api.deepseek.com")

SINGLE_PROMPT = """你是播客脚本编辑。把用户给的文章改写为单人口语化独白脚本。

风格参考：声动早咖啡 -- 节奏快、信息密、像朋友聊天、轻松传递严肃知识。

要求：
- 口语化：用"说到这儿"、"有意思的是"、"回过头看"、"其实"、"对吧"等连接词
- 加语气词：适当用"嗯"、"那"、"所以呢"让节奏更自然
- 不要"我认为"等主观表述，用"数据表明"、"这意味着"、"值得注意的是"
- 开头 2-3 句话直接说最重要的结论，不要铺垫
- 结尾总结 3 个关键词/要点，每个一句话
- 话题切换处标注 [转场]
- 严格控制在 2500-3000 字（这是硬性要求，超过就删减）
- 输出纯文本"""
```

### 双人模式（--dual）

```python
DUAL_PROMPT = """你是播客脚本编辑。把文章改写成两人讨论的播客脚本。
- A（男，理性分析派）+ B（女，好奇追问派）
- 对话自然有互动（"等等你刚才说的意思是..."、"对而且更有意思的是..."）
- 每段 2-4 句话，15-25 轮
- 话题切换处标注 [转场]
- 输出 JSON：[{"speaker": "A", "text": "..."}, ...]
- 严格控制总字数 2500-3000 字"""
```

---

## 2. TTS 合成（豆包 TTS）

项目已有完整代码：`archive/探索项目/完全复制体/voice_agent/src/tts_doubao.py`

```python
from tts_doubao import text_to_mp3_sync

# 声音选型见 knowledge/podcast-aesthetics.md

# 按段落逐段合成
for i, paragraph in enumerate(paragraphs):
    clean = paragraph.replace('[转场]', '').strip()
    if not clean:
        continue
    text_to_mp3_sync(clean, f"tts_segments/seg_{i:03d}.mp3",
        voice_type="zh_male_jingqiangkanye_moon_bigtts")
```

### 带时间戳的 TTS（--podcast 出视频版时需要）

```python
from tts_doubao_v2 import text_to_mp3_sync
result = text_to_mp3_sync(paragraph, f"seg_{i:03d}.mp3",
    voice_type="zh_male_jingqiangkanye_moon_bigtts",
    enable_timestamp=True)

# result.timestamps = [{"text":"这","start_ms":85,"end_ms":205}, ...]
# result.duration_ms = 5424
```

时间戳参数位置：在 `request_json["request"]` 里，不在 `audio` 里。详见 `gotchas-exec.md`。

### 备用方案（零成本原型）

```python
import edge_tts
communicate = edge_tts.Communicate(text, "zh-CN-YunjianNeural", rate="+15%")
```

---

## 3. 音效素材

存 `references/bgm/`：

| 文件 | 用途 | 时长 | 来源 |
|------|------|------|------|
| `intro.mp3` / `intro_male.mp3` / `intro_female.mp3` | 固定品牌片头 | 3-5 秒 | 自制或 Pixabay |
| `page-turn.mp3` | 话题转场 | ~0.5 秒 | Pixabay 搜 "page turn" |
| `lofi-podcast-bg.mp3` | 全程铺底 BGM | 循环 | 已下载 |

片头人声预录一句固定的（如"AI 前沿拆解"），用豆包 TTS 生成。

---

## 4. 拼接 + 混音（pydub）

```python
from pydub import AudioSegment
from pydub.effects import normalize, compress_dynamic_range

def assemble_podcast(segments, output_path="podcast.mp3", voice_type="male"):
    # 加载音效（片头按主讲人声音选）
    intro_file = f"references/bgm/intro_{voice_type}.mp3"
    intro = AudioSegment.from_file(intro_file)
    page_turn = AudioSegment.from_file("references/bgm/page-turn.mp3")
    bgm = AudioSegment.from_file("references/bgm/lofi-podcast-bg.mp3")

    # 1. 开场：品牌片头（原始音量）
    podcast = intro

    # 2. 拼接正文段落
    for seg in segments:
        audio = AudioSegment.from_mp3(seg["file"])

        if seg.get("has_transition"):
            # 话题切换：翻页音效
            podcast += AudioSegment.silent(duration=200)
            podcast += page_turn
            podcast += AudioSegment.silent(duration=200)
        else:
            # 普通段落间：短停顿 200ms
            podcast += AudioSegment.silent(duration=200)

        podcast += audio

    # 3. 结尾：短静音
    podcast += AudioSegment.silent(duration=500)

    # 4. 混入 BGM（全程铺底）
    intro_len = len(intro)
    while len(bgm) < len(podcast):
        bgm += bgm
    bgm = bgm[:len(podcast)]

    # 片头部分 BGM 静音，正文部分降 28dB（极低铺底）
    bgm_mixed = AudioSegment.silent(duration=intro_len) + (bgm[intro_len:] - 28)
    bgm_mixed = bgm_mixed[:len(podcast)]

    # 混合
    podcast = podcast.overlay(bgm_mixed)

    # 5. 后处理
    podcast = normalize(podcast)
    podcast = compress_dynamic_range(podcast, threshold=-20.0, ratio=4.0)

    raw_path = output_path.replace('.mp3', '_raw.mp3')
    podcast.export(raw_path, format="mp3", bitrate="192k",
                   parameters=["-ar", "44100", "-ac", "1"])
    return raw_path
```

---

## 5. ffmpeg 后处理

```bash
ffmpeg -y -i podcast_raw.mp3 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=4,compand=attacks=0.3:decays=0.8:points=-80/-80|-45/-35|-27/-25|0/-7" \
  -ar 44100 -ac 1 -b:a 192k \
  podcast.mp3
```

**响度标准**：-16 LUFS，LRA=4（参考声动早咖啡的 4.1）。

---

## 6. 字幕生成（v2，豆包原生时间戳）

```python
# 1. 装配偏移量
from srt_generator import generate_srt_from_segments, calculate_assembly_offsets

offsets = calculate_assembly_offsets(
    intro_duration_ms=len(intro),  # PyDub 的 len() 返回 ms
    segment_durations_ms=[seg.duration_ms for seg in results],
    has_transitions=[seg.get("has_transition", False) for seg in segments]
)

# 2. 生成 SRT
srt = generate_srt_from_segments(
    [{"timestamps": r.timestamps} for r in results],
    offsets
)
with open("subtitles.srt", "w") as f:
    f.write(srt)
```

代码位置：
- `vault/1-knowledge/project/企媒运营/pipelines/scripts/tts_doubao_v2.py`
- `vault/1-knowledge/project/企媒运营/pipelines/scripts/srt_generator.py`

### 精度对比

| 方案 | 时间精度 | 文字准确率 | 步骤数 | 成本/期 |
|------|---------|-----------|--------|---------|
| Whisper base + DeepSeek（旧） | 0.5-2 秒 | ~85%（需修正） | 5 步 | ~$0.01 |
| 豆包原生时间戳（新） | 10ms | 100%（用原始脚本） | 2 步 | $0（TTS 已含） |

旧方案已废弃，Whisper base 中文时间戳偏差 0.5-2 秒，专有名词全错（"Claude Code"→"Clawed Code"）。

---

## 成本估算

| 环节 | 方案 | 成本/期 |
|------|------|---------|
| 脚本改写 | DeepSeek | $0.002 |
| TTS | 豆包 | ~$0.03 |
| 音效 | Pixabay 免费 | $0 |
| 后处理 | ffmpeg 本地 | $0 |
| **总计** | | **~$0.03/期** |

---

> *v3.0 | 2026-04-21 | 拆分：听感美学（标杆/结构模板/声音选型/响度目标/不贩卖焦虑）已迁到 knowledge/podcast-aesthetics.md。本文件只保留执行层（prompt/API/代码/命令）。*
