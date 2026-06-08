#!/usr/bin/env python3
"""Build podcast.mp3 from podcast_script.txt using edge-tts + ffmpeg."""
from pathlib import Path
import asyncio
import re
import subprocess

import edge_tts
from pydub import AudioSegment

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "podcast_script.txt"
SEG_DIR = ROOT / "tts_segments"
RAW = ROOT / "podcast_raw.mp3"
OUT = ROOT / "podcast.mp3"

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "+8%"


def clean_segment(text: str) -> str:
    text = text.replace("[转场]", "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


async def build_segments(chunks: list[str]) -> list[Path]:
    SEG_DIR.mkdir(exist_ok=True)
    segment_paths = []
    for i, chunk in enumerate(chunks):
        seg = SEG_DIR / f"seg_{i:03d}.mp3"
        communicate = edge_tts.Communicate(chunk, VOICE, rate=RATE)
        await communicate.save(str(seg))
        segment_paths.append(seg)
        await asyncio.sleep(0.5)
    return segment_paths


def main() -> None:
    chunks = [p.strip() for p in SCRIPT.read_text(encoding="utf-8").split("\n\n")]
    chunks = [clean_segment(p) for p in chunks if p.strip() and p.strip() != "[转场]"]
    segment_paths = asyncio.run(build_segments(chunks))

    combined = AudioSegment.silent(duration=0)
    pause = AudioSegment.silent(duration=550)
    for seg in segment_paths:
        combined += AudioSegment.from_mp3(seg) + pause
    combined.export(RAW, format="mp3", bitrate="128k")

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(RAW),
            "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-ar",
            "44100",
            "-b:a",
            "128k",
            str(OUT),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"[OK] wrote {OUT}")
    print(f"[OK] segments: {len(segment_paths)}")


if __name__ == "__main__":
    main()
