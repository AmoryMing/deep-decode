#!/usr/bin/env python3
"""把 VoxCPM 生成的 podcast.mp3 (+ scene_plan_v3.json + tts_script.txt) 转成 captions.json (字级)。

输入：
  - scene_plan_v3.json   每 scene 含 narration_text
  - tts_script.txt       所有 narration 拼接，scene 间 \n[转场]\n
  - podcast.mp3          VoxCPM 合成（loudnorm 后）
  - tts_segments_voxcpm2/seg_NNN.wav  段级（用来定位每段在 podcast.mp3 里的偏移）

输出：
  - captions.json        schema_version=v3-scene-aware
  - 同时回填 scene_plan_v3.json 的 narration_segment_idx + duration_s

实现：
  1. 对整段 podcast.mp3 跑 faster-whisper word_timestamps=True
  2. 把 word 流按 scene narration 文本切回去（贪婪匹配，容错少字/多字）
  3. 每 scene 一个或多个 chunk segment（如果文本太长 voxcpm 会切多 chunk）
  4. words[].start_ms / end_ms 来自 whisper
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def normalize_text(s: str) -> str:
    """字符级 normalize: 去空白、把全角符号/英文字母转成统一形式，便于贪婪匹配。"""
    s = re.sub(r"\s+", "", s)
    return s


def normalize_char(c: str) -> str:
    """单字符 normalize（粗略）— 用于 whisper 词 vs scene 文本字符的匹配。"""
    c = c.strip()
    if not c:
        return ""
    return c.lower()


def transcribe_with_word_timestamps(audio_path: Path, model_size: str = "large-v3") -> list[dict]:
    """跑 faster-whisper，返回 word 级时间戳列表 [{text, start_ms, end_ms}, ...]."""
    from faster_whisper import WhisperModel
    print(f"[whisper] loading model={model_size} compute=auto", flush=True)
    # CPU/Metal 上跑 large-v3 慢但准；小 mac 可换 medium
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    print(f"[whisper] transcribing {audio_path.name}", flush=True)
    segments, info = model.transcribe(
        str(audio_path),
        language="zh",
        word_timestamps=True,
        vad_filter=False,
        condition_on_previous_text=False,
        temperature=0.0,
        beam_size=5,
    )
    words: list[dict] = []
    seg_count = 0
    for seg in segments:
        seg_count += 1
        if seg.words is None:
            continue
        for w in seg.words:
            text = (w.word or "").strip()
            if not text:
                continue
            words.append({
                "text": text,
                "start_ms": int(round(w.start * 1000)),
                "end_ms": int(round(w.end * 1000)),
            })
    print(f"[whisper] got {seg_count} whisper-segments, {len(words)} words", flush=True)
    return words


def expand_to_chars(words: list[dict]) -> list[dict]:
    """faster-whisper 中文常按字/词混着返回。把多字 token 拆成单字 token，时间均分。"""
    out: list[dict] = []
    for w in words:
        text = w["text"]
        # 去掉首尾标点（如 '，' '。' 之类粘在 token 上的情况）
        chars = [c for c in text]
        if not chars:
            continue
        if len(chars) == 1:
            out.append(w)
            continue
        # 多字 token → 均分时间
        s, e = w["start_ms"], w["end_ms"]
        per = (e - s) / len(chars) if e > s else 0
        for i, c in enumerate(chars):
            out.append({
                "text": c,
                "start_ms": int(round(s + per * i)),
                "end_ms": int(round(s + per * (i + 1))),
            })
    return out


def align_words_to_text(
    words: list[dict],
    expected_text: str,
    start_pos: int,
) -> tuple[list[dict], int]:
    """从 words[start_pos:] 贪婪匹配 expected_text。返回 (matched_words, new_pos)。

    expected_text 的 normalized 字符序列长度 N。
    我们从 words[start_pos:] 取连续若干 token，让它们的 normalized 字符总数 ≈ N。
    容错：whisper 偶尔丢字/多字。允许 ±20% 余量。
    """
    expected_norm = normalize_text(expected_text)
    target_n = len(expected_norm)
    if target_n == 0:
        return [], start_pos

    # 累加 words 的 normalized 字符总数，直到接近 target_n
    accum = 0
    end_pos = start_pos
    while end_pos < len(words) and accum < target_n:
        accum += len(normalize_text(words[end_pos]["text"]))
        end_pos += 1
        # 看是否已经到/略过 target_n
        if accum >= target_n:
            break

    matched = words[start_pos:end_pos]
    return matched, end_pos


def build_captions(
    audio_path: Path,
    scene_plan: dict,
    voice_label: str,
    model_size: str,
) -> tuple[dict, dict]:
    """build (captions.json, updated scene_plan)。"""
    # 1) whisper 转录整段
    raw_words = transcribe_with_word_timestamps(audio_path, model_size=model_size)
    char_words = expand_to_chars(raw_words)

    # 2) 按 scene_plan.scenes 切分
    segments_out: list[dict] = []
    cursor = 0
    for scene_idx, scene in enumerate(scene_plan["scenes"]):
        narration = scene.get("narration_text", "").strip()
        if not narration:
            scene["narration_segment_idx"] = []
            scene["duration_s"] = 0.0
            continue

        matched, cursor = align_words_to_text(char_words, narration, cursor)
        if not matched:
            print(f"[align] WARN scene {scene_idx} ({scene.get('kind')}) — 0 words matched", file=sys.stderr)
            scene["narration_segment_idx"] = []
            scene["duration_s"] = 0.0
            continue

        start_ms = matched[0]["start_ms"]
        end_ms = matched[-1]["end_ms"]

        seg = {
            "scene_idx": scene_idx,
            "scene_kind": scene.get("kind"),
            "scene_id": scene.get("id"),
            "chunk_idx": 0,
            "text": narration,
            "start_ms": start_ms,
            "end_ms": end_ms,
            "words": matched,
        }
        segments_out.append(seg)
        scene["narration_segment_idx"] = [len(segments_out) - 1]
        scene["duration_s"] = round((end_ms - start_ms) / 1000, 2)
        print(f"[align] scene {scene_idx:2d} {scene.get('kind'):8s} "
              f"chars={len(normalize_text(narration)):3d} "
              f"matched={len(matched):3d} "
              f"dur={scene['duration_s']:.2f}s "
              f"@ {start_ms}-{end_ms}ms", flush=True)

    # 3) 拿 audio 总时长
    import subprocess
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1", str(audio_path),
    ])
    audio_dur_s = float(out.decode().strip())
    duration_ms = int(round(audio_dur_s * 1000))

    captions = {
        "audio": audio_path.name,
        "duration_ms": duration_ms,
        "fps": 30,
        "schema_version": "v3-scene-aware",
        "voice": voice_label,
        "segments": segments_out,
    }
    return captions, scene_plan


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scene-plan", required=True)
    ap.add_argument("--audio", required=True, help="podcast.mp3")
    ap.add_argument("--voice", default="voxcpm2-pm-nv", help="voice label for captions header")
    ap.add_argument("--out-captions", required=True)
    ap.add_argument("--model", default="medium", help="faster-whisper model size (medium / large-v3)")
    args = ap.parse_args()

    sp_path = Path(args.scene_plan)
    scene_plan = json.loads(sp_path.read_text(encoding="utf-8"))

    captions, scene_plan = build_captions(
        audio_path=Path(args.audio),
        scene_plan=scene_plan,
        voice_label=args.voice,
        model_size=args.model,
    )

    Path(args.out_captions).write_text(
        json.dumps(captions, ensure_ascii=False, indent=2), encoding="utf-8")
    sp_path.write_text(
        json.dumps(scene_plan, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"[OK] wrote {args.out_captions} ({len(captions['segments'])} segments, {captions['duration_ms']/1000:.1f}s)")
    print(f"[OK] back-filled {sp_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
