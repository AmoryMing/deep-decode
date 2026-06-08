#!/usr/bin/env python3
"""火山引擎 TTS（甜美小源 BV405_streaming，专业情感，音色略低）+ 5s intro + loudnorm + SRT。"""
from pathlib import Path
import asyncio, json, re, subprocess, sys, uuid, gzip
import websockets
from pydub import AudioSegment

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "podcast_script.txt"
SEG_DIR = ROOT / "tts_segments_v2"
RAW = ROOT / "podcast_raw.mp3"
OUT = ROOT / "podcast.mp3"
SRT = ROOT / "podcast.srt"

INTRO_DIR = Path("/Users/muming/项目/内容/.claude/skills/deep-decode/references/bgm")
INTRO_FILES = [INTRO_DIR / "intro.mp3", INTRO_DIR / "intro-voice.mp3"]  # 3.0 + 1.6 ≈ 4.6s

# --- 火山 TTS 配置 ---
APPID = "5196631133"
TOKEN = "JtNlEURIX18F8tJxnZ2PO5WTFWUasJky"
CLUSTER = "volcano_tts"
VOICE = "zh_female_tianmeixiaoyuan_moon_bigtts"  # 甜美小源（moon 版，BV405 同款音色，token 已授权）
SPEED = 1.0
PITCH = 0.92  # 略低
VOLUME = 1.3
EMOTION = None  # moon 系列不支持 emotion，靠 pitch+speed 模拟"专业"基调

API_URL = "wss://openspeech.bytedance.com/api/v1/tts/ws_binary"
DEFAULT_HEADER = bytearray(b"\x11\x10\x11\x00")


def parse_resp(res, fout, timestamps):
    header_size = res[0] & 0x0f
    mtype = res[1] >> 4
    flags = res[1] & 0x0f
    payload = res[header_size * 4:]
    if mtype == 0xb:
        if flags == 0:
            return False
        seq = int.from_bytes(payload[:4], "big", signed=True)
        fout.write(payload[8:])
        return seq < 0
    if mtype == 0xc:
        body = payload[4:]
        try:
            body = gzip.decompress(body)
        except Exception:
            pass
        try:
            data = json.loads(body.decode("utf-8", errors="replace"))
            if "frontend" in data and isinstance(data["frontend"], str):
                inner = json.loads(data["frontend"])
                for w in inner.get("words", []):
                    timestamps.append({
                        "text": w.get("word", ""),
                        "start_ms": int(w.get("start_time", 0)),
                        "end_ms": int(w.get("end_time", 0)),
                    })
        except Exception as e:
            print(f"  [warn] 解析时间戳失败: {e}", file=sys.stderr)
        return False
    if mtype == 0xf:
        code = int.from_bytes(payload[:4], "big")
        msg = payload[8:]
        try:
            msg = gzip.decompress(msg)
        except Exception:
            pass
        print(f"  [error] code={code} msg={msg!r}", file=sys.stderr)
        return True
    return True


async def tts_one(text: str, out_path: Path):
    req = {
        "app": {"appid": APPID, "token": "access_token", "cluster": CLUSTER},
        "user": {"uid": "388808087185088"},
        "audio": {
            "voice_type": VOICE,
            "encoding": "mp3",
            "speed_ratio": SPEED,
            "volume_ratio": VOLUME,
            "pitch_ratio": PITCH,
        },
        "request": {
            "reqid": str(uuid.uuid4()),
            "text": text,
            "text_type": "plain",
            "operation": "submit",
            "with_frontend": "1",
            "frontend_type": "unitTson",
            "with_timestamp": "1",
        },
    }
    payload = gzip.compress(json.dumps(req).encode())
    full = bytearray(DEFAULT_HEADER)
    full.extend(len(payload).to_bytes(4, "big"))
    full.extend(payload)

    timestamps = []
    headers = {"Authorization": f"Bearer; {TOKEN}"}
    with open(out_path, "wb") as f:
        async with websockets.connect(API_URL, additional_headers=headers, ping_interval=None) as ws:
            await ws.send(full)
            while True:
                res = await asyncio.wait_for(ws.recv(), timeout=30.0)
                if parse_resp(res, f, timestamps):
                    break
    return timestamps


def srt_ts(ms: int) -> str:
    h = ms // 3600000
    m = (ms % 3600000) // 60000
    s = (ms % 60000) // 1000
    ms_ = ms % 1000
    return f"{h:02d}:{m:02d}:{s:02d},{ms_:03d}"


def build_subtitles(per_seg, gap_ms, intro_ms):
    """把每段字时间戳合并成 SRT。每行最多 18 字，按标点切。"""
    subs = []
    cur_offset = intro_ms
    for ts_list, seg_dur_ms in per_seg:
        if not ts_list:
            cur_offset += seg_dur_ms + gap_ms
            continue
        # 按标点+长度切行
        line_text = ""
        line_start = None
        line_end = None
        for w in ts_list:
            if line_start is None:
                line_start = w["start_ms"]
            line_text += w["text"]
            line_end = w["end_ms"]
            if (w["text"] in "，。！？；：" and len(line_text) >= 8) or len(line_text) >= 18:
                subs.append((cur_offset + line_start, cur_offset + line_end, line_text.strip("，。！？；：").strip()))
                line_text = ""
                line_start = None
        if line_text:
            subs.append((cur_offset + line_start, cur_offset + line_end, line_text.strip("，。！？；：").strip()))
        cur_offset += seg_dur_ms + gap_ms

    out = []
    for i, (s, e, t) in enumerate(subs, 1):
        if not t:
            continue
        out.append(f"{i}\n{srt_ts(s)} --> {srt_ts(e)}\n{t}\n")
    return "\n".join(out)


async def main():
    raw = SCRIPT.read_text(encoding="utf-8")
    chunks = [c.strip() for c in raw.split("\n\n") if c.strip() and c.strip() != "[转场]"]
    chunks = [re.sub(r"\s+", " ", c.replace("[转场]", "")).strip() for c in chunks]

    SEG_DIR.mkdir(exist_ok=True)
    per_seg = []
    seg_paths = []
    for i, c in enumerate(chunks):
        sp = SEG_DIR / f"seg_{i:03d}.mp3"
        print(f"[TTS {i+1}/{len(chunks)}] {len(c)} 字 ...")
        ts = await tts_one(c, sp)
        seg_paths.append(sp)
        seg_dur = len(AudioSegment.from_mp3(sp))
        per_seg.append((ts, seg_dur))
        await asyncio.sleep(0.3)

    # --- 拼接 voice ---
    voice = AudioSegment.silent(duration=0)
    pause = AudioSegment.silent(duration=550)
    for sp in seg_paths:
        voice += AudioSegment.from_mp3(sp) + pause

    # --- intro ---
    intro = AudioSegment.silent(duration=0)
    for ip in INTRO_FILES:
        if ip.exists():
            intro += AudioSegment.from_mp3(ip)
    # pad to ~5s
    if len(intro) < 5000:
        intro += AudioSegment.silent(duration=5000 - len(intro))
    # 从 intro 末尾 fade 到 voice
    intro = intro.fade_out(400)

    combined = intro + voice
    combined.export(RAW, format="mp3", bitrate="128k")

    subprocess.run(
        ["ffmpeg", "-y", "-i", str(RAW), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
         "-ar", "44100", "-b:a", "128k", str(OUT)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )

    srt = build_subtitles(per_seg, gap_ms=550, intro_ms=len(intro))
    SRT.write_text(srt, encoding="utf-8")

    print(f"\n[OK] {OUT}  时长 ≈ {len(combined)/1000:.1f}s  (intro={len(intro)/1000:.1f}s)")
    print(f"[OK] {SRT}  {srt.count(chr(10)+chr(10))} 行字幕")


if __name__ == "__main__":
    asyncio.run(main())
