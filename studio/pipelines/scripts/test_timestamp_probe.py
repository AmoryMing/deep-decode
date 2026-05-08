#!/usr/bin/env python3
"""
探测豆包 TTS enable_timestamp 返回的时间戳格式。
发一句短文本，打印完整的 0xc frontend response，看格式再决定怎么解析。

用法：python3 test_timestamp_probe.py
"""
import sys
import os
import json
import logging

# 设置详细日志
logging.basicConfig(level=logging.INFO, format='%(message)s')

# 添加脚本目录到 path
sys.path.insert(0, os.path.dirname(__file__))
from tts_doubao_v2 import text_to_mp3_sync, TTSResult

def main():
    test_text = "这就是Anthropic的Claude产品负责人Cat Wu最近在一篇博客里描述的现实。"
    output_path = "/tmp/tts_timestamp_probe.mp3"

    print(f"=== 豆包 TTS 时间戳探测 ===")
    print(f"测试文本: {test_text}")
    print(f"文本长度: {len(test_text)} 字符")
    print(f"输出路径: {output_path}")
    print()

    result = text_to_mp3_sync(
        text=test_text,
        output_path=output_path,
        voice_type="zh_male_jingqiangkanye_moon_bigtts",
        enable_timestamp=True
    )

    print(f"\n=== 结果 ===")
    print(f"音频文件: {result.audio_path}")
    if result.audio_path and os.path.exists(result.audio_path):
        size = os.path.getsize(result.audio_path)
        print(f"文件大小: {size} bytes ({size/1024:.1f} KB)")

    print(f"\n时间戳条目数: {len(result.timestamps)}")
    if result.timestamps:
        print("\n--- 解析后的时间戳 ---")
        for i, ts in enumerate(result.timestamps):
            print(f"  [{i:3d}] {ts['text']:4s}  {ts['start_ms']:6d}ms - {ts['end_ms']:6d}ms  "
                  f"(时长 {ts['end_ms']-ts['start_ms']}ms)")

    print(f"\n原始前端响应数量: {len(result.raw_frontend_responses)}")
    for i, raw in enumerate(result.raw_frontend_responses):
        print(f"\n--- 原始前端响应 #{i+1} ---")
        # 尝试美化 JSON
        try:
            parsed = json.loads(raw)
            print(json.dumps(parsed, indent=2, ensure_ascii=False))
        except:
            print(raw[:2000])

    # 如果拿到了时间戳，展示 SRT 预览
    if result.timestamps:
        print(f"\n=== SRT 预览 ===")
        srt = timestamps_to_srt_preview(result.timestamps)
        print(srt)
    else:
        print("\n没有拿到时间戳。检查上面的原始前端响应来判断格式。")

def timestamps_to_srt_preview(timestamps, chars_per_subtitle=15):
    """将字级时间戳合并为句级字幕（预览用）"""
    if not timestamps:
        return ""

    lines = []
    current_text = ""
    current_start = timestamps[0]["start_ms"]
    idx = 1

    for ts in timestamps:
        current_text += ts["text"]

        # 遇到句号/问号/感叹号，或积累够字数时断句
        is_sentence_end = ts["text"] in "。？！.?!"
        is_long_enough = len(current_text) >= chars_per_subtitle and ts["text"] in "，、；：,;:"

        if is_sentence_end or is_long_enough:
            start_srt = ms_to_srt_time(current_start)
            end_srt = ms_to_srt_time(ts["end_ms"])
            lines.append(f"{idx}\n{start_srt} --> {end_srt}\n{current_text}\n")
            idx += 1
            current_text = ""
            current_start = ts["end_ms"]

    # 剩余文本
    if current_text.strip():
        start_srt = ms_to_srt_time(current_start)
        end_srt = ms_to_srt_time(timestamps[-1]["end_ms"])
        lines.append(f"{idx}\n{start_srt} --> {end_srt}\n{current_text}\n")

    return "\n".join(lines)

def ms_to_srt_time(ms):
    """毫秒转 SRT 时间格式 HH:MM:SS,mmm"""
    h = ms // 3600000
    m = (ms % 3600000) // 60000
    s = (ms % 60000) // 1000
    ms_rem = ms % 1000
    return f"{h:02d}:{m:02d}:{s:02d},{ms_rem:03d}"

if __name__ == "__main__":
    main()
