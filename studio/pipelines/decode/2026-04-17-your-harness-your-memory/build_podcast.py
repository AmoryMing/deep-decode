"""Podcast build pipeline: edge-tts + pydub BGM mix + ffmpeg loudnorm."""
import os, subprocess, time, sys
from pathlib import Path
from pydub import AudioSegment

BASE = Path(__file__).parent
BGM_DIR = Path("/home/super/stuff_AI_force/stuff/muming/.claude/skills/deep-decode/references/bgm")
TTS_DIR = BASE / "tts_segments"
TTS_DIR.mkdir(exist_ok=True)

VOICE = "zh-CN-YunxiNeural"
RATE = "+15%"

print("[1/5] split script...")
script = (BASE / "podcast_script.txt").read_text()
paragraphs = [p.strip() for p in script.split("\n\n") if p.strip()]
content_paras = [p for p in paragraphs if not p.startswith("[转场]") and p != "[转场]"]
print(f"  {len(content_paras)} content paragraphs")

print("[2/5] edge-tts per paragraph...")
for i, p in enumerate(content_paras):
    out = TTS_DIR / f"seg_{i:03d}.mp3"
    if out.exists() and out.stat().st_size > 1000:
        continue
    text = p.replace("[转场]", "").strip()
    if not text:
        continue
    subprocess.run([
        "edge-tts", "--voice", VOICE, "--text", text,
        "--write-media", str(out), "--rate", RATE
    ], check=True, capture_output=True)
    sys.stdout.write(".")
    sys.stdout.flush()
print()

print("[3/5] concat voice with page-turn transitions...")
# paragraphs 里原始顺序，遇到 [转场] 就插 page-turn
page_turn = AudioSegment.from_mp3(BGM_DIR / "page-turn.mp3") - 6  # 稍降
voice = AudioSegment.silent(duration=0)
seg_idx = 0
for p in paragraphs:
    if p.startswith("[转场]") or p == "[转场]":
        voice += AudioSegment.silent(duration=300) + page_turn + AudioSegment.silent(duration=200)
        continue
    seg_file = TTS_DIR / f"seg_{seg_idx:03d}.mp3"
    if seg_file.exists():
        voice += AudioSegment.from_mp3(seg_file) + AudioSegment.silent(duration=200)
    seg_idx += 1

voice_duration = len(voice)
print(f"  voice duration: {voice_duration/1000:.1f}s")

print("[4/5] mix BGM...")
bgm_src = AudioSegment.from_mp3(BGM_DIR / "lofi-podcast-bg.mp3")
# 循环 BGM 到 voice 长度
bgm = bgm_src
while len(bgm) < voice_duration:
    bgm += bgm_src
bgm = bgm[:voice_duration] - 28  # 降 28dB
mixed = voice.overlay(bgm)

# 加 intro/outro
intro = AudioSegment.from_mp3(BGM_DIR / "intro.mp3")
full = intro + AudioSegment.silent(duration=300) + mixed + AudioSegment.silent(duration=500) + intro[-2000:]
raw_out = BASE / "podcast_raw.mp3"
full.export(raw_out, format="mp3", bitrate="128k")
print(f"  raw: {raw_out} ({len(full)/1000:.1f}s)")

print("[5/5] ffmpeg loudnorm...")
final_out = BASE / "podcast.mp3"
subprocess.run([
    "ffmpeg", "-y", "-i", str(raw_out),
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=4",
    "-b:a", "128k",
    str(final_out)
], check=True, capture_output=True)
final_size = final_out.stat().st_size / 1024
print(f"  DONE: {final_out} ({final_size:.0f}KB, {len(full)/1000:.1f}s)")
raw_out.unlink()
