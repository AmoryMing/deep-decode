#!/usr/bin/env python3
"""
SRT 字幕生成器 -- 从豆包 TTS 字级时间戳生成精确 SRT

核心难点：播客是多段拼接的（intro + 段落1 + 翻页 + 段落2 + ...），
每段 TTS 的时间戳从 0 开始，需要加上装配偏移量才能得到全局时间。

用法：
    from srt_generator import generate_srt_from_segments

    srt_text = generate_srt_from_segments(segments, assembly_offsets)
    # segments = [{"timestamps": [...], "text": "原始文本"}, ...]
    # assembly_offsets = [0, 4200, 8500, ...]  # 每段在播客中的起始时间(ms)
"""

from typing import List, Dict, Optional


def ms_to_srt_time(ms: int) -> str:
    """毫秒转 SRT 时间格式 HH:MM:SS,mmm"""
    if ms < 0:
        ms = 0
    h = ms // 3600000
    m = (ms % 3600000) // 60000
    s = (ms % 60000) // 1000
    ms_rem = ms % 1000
    return f"{h:02d}:{m:02d}:{s:02d},{ms_rem:03d}"


def timestamps_to_subtitles(
    timestamps: List[Dict],
    offset_ms: int = 0,
    max_chars: int = 25,
    sentence_ends: str = "。？！.?!",
    clause_breaks: str = "，、；：,;:"
) -> List[Dict]:
    """
    将字级时间戳合并为句级字幕条目。

    规则（来自 gotchas.md #23）：
    - 按句号/问号/感叹号断句
    - 逗号处可断但仅当单句超 max_chars 时
    - 每条字幕是完整语义单元
    - 不在句中截断

    Args:
        timestamps: [{"text": "字", "start_ms": 85, "end_ms": 205}, ...]
        offset_ms: 这段音频在全播客中的起始偏移量
        max_chars: 单条字幕最大字符数
        sentence_ends: 句末标点
        clause_breaks: 子句分隔标点（超长时才断）

    Returns:
        [{"start_ms": 全局ms, "end_ms": 全局ms, "text": "完整句子"}, ...]
    """
    if not timestamps:
        return []

    subtitles = []
    current_text = ""
    current_start = timestamps[0]["start_ms"] + offset_ms

    for ts in timestamps:
        word = ts["text"]
        current_text += word

        # 判断是否该断句
        last_char = word[-1] if word else ""
        is_sentence_end = last_char in sentence_ends
        is_clause_break = last_char in clause_breaks and len(current_text) >= max_chars

        if is_sentence_end or is_clause_break:
            subtitles.append({
                "start_ms": current_start,
                "end_ms": ts["end_ms"] + offset_ms,
                "text": current_text.strip()
            })
            current_text = ""
            # 下一条字幕的开始时间 = 当前字幕结束时间
            current_start = ts["end_ms"] + offset_ms

    # 剩余文本（没有以标点结尾的尾巴）
    if current_text.strip():
        subtitles.append({
            "start_ms": current_start,
            "end_ms": timestamps[-1]["end_ms"] + offset_ms,
            "text": current_text.strip()
        })

    return subtitles


def generate_srt_from_segments(
    segments: List[Dict],
    assembly_offsets: List[int]
) -> str:
    """
    从多段 TTS 时间戳生成完整 SRT。

    Args:
        segments: [{"timestamps": [{text, start_ms, end_ms}, ...], "text": "原始段落"}, ...]
        assembly_offsets: 每段在播客中的起始时间(ms)，与 segments 一一对应

    Returns:
        完整 SRT 字符串
    """
    all_subtitles = []

    for seg, offset in zip(segments, assembly_offsets):
        subs = timestamps_to_subtitles(seg["timestamps"], offset_ms=offset)
        all_subtitles.extend(subs)

    return subtitles_to_srt(all_subtitles)


def subtitles_to_srt(subtitles: List[Dict]) -> str:
    """将字幕条目列表转为 SRT 格式字符串"""
    lines = []
    for i, sub in enumerate(subtitles, 1):
        start = ms_to_srt_time(sub["start_ms"])
        end = ms_to_srt_time(sub["end_ms"])
        lines.append(f"{i}\n{start} --> {end}\n{sub['text']}\n")
    return "\n".join(lines)


def generate_srt_single(timestamps: List[Dict], offset_ms: int = 0) -> str:
    """单段音频的简化接口"""
    subs = timestamps_to_subtitles(timestamps, offset_ms=offset_ms)
    return subtitles_to_srt(subs)


# ---- 装配偏移量计算工具 ----

def calculate_assembly_offsets(
    intro_duration_ms: int,
    segment_durations_ms: List[int],
    has_transitions: List[bool],
    silence_ms: int = 200,
    page_turn_ms: int = 500
) -> List[int]:
    """
    计算每段 TTS 在最终播客中的起始偏移量。

    播客结构：
    [intro] [silence] [seg0] [silence] [seg1] [silence+page_turn+silence] [seg2] ...

    Args:
        intro_duration_ms: 品牌片头时长
        segment_durations_ms: 每段 TTS 音频的时长（从 TTSResult.duration_ms 获取）
        has_transitions: 每段前是否有翻页音效
        silence_ms: 段落间静音时长（默认 200ms）
        page_turn_ms: 翻页音效时长（默认 500ms）

    Returns:
        每段的起始偏移量列表
    """
    offsets = []
    current_pos = intro_duration_ms  # intro 后开始

    for i, (dur, has_trans) in enumerate(zip(segment_durations_ms, has_transitions)):
        if has_trans:
            # 翻页转场：silence + page_turn + silence
            current_pos += silence_ms + page_turn_ms + silence_ms
        else:
            # 普通段落间：silence
            current_pos += silence_ms

        offsets.append(current_pos)
        current_pos += dur

    return offsets


if __name__ == "__main__":
    # 测试用例
    test_timestamps = [
        {"text": "这", "start_ms": 85, "end_ms": 205},
        {"text": "就", "start_ms": 205, "end_ms": 285},
        {"text": "是", "start_ms": 285, "end_ms": 455},
        {"text": "一", "start_ms": 455, "end_ms": 555},
        {"text": "个", "start_ms": 555, "end_ms": 655},
        {"text": "测", "start_ms": 655, "end_ms": 755},
        {"text": "试", "start_ms": 755, "end_ms": 855},
        {"text": "句", "start_ms": 855, "end_ms": 955},
        {"text": "子。", "start_ms": 955, "end_ms": 1200},
        {"text": "第", "start_ms": 1300, "end_ms": 1400},
        {"text": "二", "start_ms": 1400, "end_ms": 1500},
        {"text": "句", "start_ms": 1500, "end_ms": 1600},
        {"text": "话。", "start_ms": 1600, "end_ms": 1900},
    ]

    print("=== 单段 SRT 测试 ===")
    srt = generate_srt_single(test_timestamps)
    print(srt)

    print("=== 带偏移量测试（模拟 intro 4000ms 后开始）===")
    srt = generate_srt_single(test_timestamps, offset_ms=4000)
    print(srt)

    print("=== 装配偏移量计算测试 ===")
    offsets = calculate_assembly_offsets(
        intro_duration_ms=4000,
        segment_durations_ms=[5424, 8000, 6000],
        has_transitions=[False, True, False]
    )
    print(f"偏移量: {offsets}")
    print(f"预期: [4200, 10524, 19424]")
    # seg0: 4000(intro) + 200(silence) = 4200
    # seg1: 4200 + 5424(seg0) + 200+500+200(transition) = 10524
    # seg2: 10524 + 8000(seg1) + 200(silence) = 18724
