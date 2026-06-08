#!/usr/bin/env python3
"""TTS via edge-tts, concat with pydub, loudnorm via ffmpeg."""
import asyncio, edge_tts, subprocess, shutil
from pathlib import Path
from pydub import AudioSegment

HERE = Path(__file__).parent
SCRIPT = HERE / "podcast_script.txt"
SEG_DIR = HERE / "tts_segments"
RAW = HERE / "podcast_raw.mp3"
OUT = HERE / "podcast.mp3"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "+8%"

async def main():
    SEG_DIR.mkdir(exist_ok=True)
    text = SCRIPT.read_text()
    paras = [p.strip() for p in text.split("\n\n") if p.strip()]
    audio = AudioSegment.silent(duration=400)
    for i, p in enumerate(paras):
        if p == "[转场]":
            audio += AudioSegment.silent(duration=700)
            continue
        seg_path = SEG_DIR / f"seg_{i:03d}.mp3"
        comm = edge_tts.Communicate(p, VOICE, rate=RATE)
        await comm.save(str(seg_path))
        audio += AudioSegment.from_mp3(seg_path) + AudioSegment.silent(duration=300)
    audio.export(RAW, format="mp3", bitrate="192k")
    print(f"raw: {RAW} ({len(audio)/1000:.1f}s)")

    # loudnorm
    subprocess.run([
        "ffmpeg", "-y", "-i", str(RAW),
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ar", "44100", "-b:a", "192k", str(OUT)
    ], check=True)
    print(f"final: {OUT}")

if __name__ == "__main__":
    asyncio.run(main())
