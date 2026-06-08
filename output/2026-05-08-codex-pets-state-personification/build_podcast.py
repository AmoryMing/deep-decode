import asyncio
import json
from pathlib import Path

import edge_tts
from pydub import AudioSegment


BASE = Path(__file__).resolve().parent
SCRIPT = BASE / "podcast_script.txt"
SEG_DIR = BASE / "tts_segments"
RAW = BASE / "podcast_raw.mp3"
OUT = BASE / "podcast.mp3"
META = BASE / "podcast_meta.json"


def split_script(text: str) -> list[str]:
    parts: list[str] = []
    buf: list[str] = []
    for block in text.split("\n\n"):
        block = block.strip()
        if not block:
            continue
        if block == "[转场]":
            if buf:
                parts.append("\n\n".join(buf).strip())
                buf = []
            continue
        buf.append(block)
    if buf:
        parts.append("\n\n".join(buf).strip())
    return parts


async def synth_segment(text: str, path: Path) -> None:
    communicate = edge_tts.Communicate(
        text=text,
        voice="zh-CN-XiaoxiaoNeural",
        rate="+8%",
    )
    await communicate.save(str(path))


async def main() -> None:
    SEG_DIR.mkdir(exist_ok=True)
    parts = split_script(SCRIPT.read_text(encoding="utf-8"))

    segment_paths: list[Path] = []
    for i, text in enumerate(parts):
        out = SEG_DIR / f"seg_{i:03d}.mp3"
        await synth_segment(text, out)
        segment_paths.append(out)
        print(f"generated {out.name}")

    audio = AudioSegment.silent(duration=300)
    for path in segment_paths:
        audio += AudioSegment.from_mp3(path)
        audio += AudioSegment.silent(duration=650)
    audio.export(RAW, format="mp3", bitrate="128k")

    META.write_text(
        json.dumps(
            {
                "tts": "edge-tts",
                "voice": "zh-CN-XiaoxiaoNeural",
                "rate": "+8%",
                "segments": len(segment_paths),
                "raw_file": RAW.name,
                "output_file": OUT.name,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    asyncio.run(main())
