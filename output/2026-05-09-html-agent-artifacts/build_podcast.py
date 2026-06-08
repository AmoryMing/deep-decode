import asyncio
from pathlib import Path

import edge_tts
from pydub import AudioSegment


ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "podcast_script.txt"
SEG_DIR = ROOT / "tts_segments"
RAW = ROOT / "podcast_raw.mp3"
OUT = ROOT / "podcast.mp3"
VOICE = "zh-CN-XiaoxiaoNeural"


def split_script(text: str) -> list[str]:
    parts = []
    for block in text.split("\n\n"):
        block = block.strip()
        if not block or block == "[转场]":
            continue
        block = block.replace("[转场]", "").strip()
        if block:
            parts.append(block)
    return parts


async def synthesize() -> None:
    SEG_DIR.mkdir(exist_ok=True)
    parts = split_script(SCRIPT.read_text(encoding="utf-8"))
    audio = AudioSegment.silent(duration=500)
    for idx, text in enumerate(parts):
        seg = SEG_DIR / f"seg_{idx:03d}.mp3"
        if not seg.exists():
            communicate = edge_tts.Communicate(text, VOICE, rate="+8%")
            await communicate.save(str(seg))
        audio += AudioSegment.from_mp3(seg) + AudioSegment.silent(duration=450)
    audio.export(RAW, format="mp3", bitrate="128k")


if __name__ == "__main__":
    asyncio.run(synthesize())
    # Keep a normalized final filename even without BGM. ffmpeg loudnorm may be run
    # by the caller after this script; if not, RAW is already a valid mp3.
    OUT.write_bytes(RAW.read_bytes())
    print(OUT)
