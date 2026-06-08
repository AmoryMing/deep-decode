#!/usr/bin/env python3
"""最简版 podcast 流水线：edge-tts + pydub 拼接 + ffmpeg loudnorm。"""
import asyncio
import subprocess
from pathlib import Path
import edge_tts
from pydub import AudioSegment

ROOT = Path(__file__).parent
SCRIPT = ROOT / "podcast_script.txt"
SEG_DIR = ROOT / "tts_segments"
SEG_DIR.mkdir(exist_ok=True)
RAW = ROOT / "podcast_raw.mp3"
FINAL = ROOT / "podcast.mp3"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "+8%"


async def gen():
    text = SCRIPT.read_text(encoding="utf-8")
    paras = [p.strip() for p in text.split("\n\n") if p.strip() and p.strip() != "[转场]"]
    voice = AudioSegment.silent(duration=0)
    for i, p in enumerate(paras):
        is_break = "[转场]" in p
        clean = p.replace("[转场]", "").strip()
        if not clean:
            voice += AudioSegment.silent(800)
            continue
        seg_path = SEG_DIR / f"seg_{i:03d}.mp3"
        if not seg_path.exists():
            print(f"[TTS {i+1}/{len(paras)}] {clean[:30]}...")
            c = edge_tts.Communicate(clean, VOICE, rate=RATE)
            await c.save(str(seg_path))
        seg = AudioSegment.from_mp3(str(seg_path))
        voice += seg + AudioSegment.silent(400 if not is_break else 800)
    voice.export(str(RAW), format="mp3", bitrate="128k")
    print(f"[concat] -> {RAW} ({len(voice)/1000:.1f}s)")


def loudnorm():
    print("[loudnorm] ffmpeg ...")
    subprocess.run([
        "ffmpeg", "-y", "-i", str(RAW),
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ar", "44100", str(FINAL)
    ], check=True, capture_output=True)
    print(f"[done] {FINAL} ({FINAL.stat().st_size/1024:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(gen())
    loudnorm()
