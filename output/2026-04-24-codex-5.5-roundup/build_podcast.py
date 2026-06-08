#!/usr/bin/env python3
"""构建单女声播客 - GPT-5.5 周报综述
步骤：读脚本 → 按 [转场] 切段 → 豆包 TTS 逐段 → pydub 拼接+BGM → ffmpeg loudnorm → podcast.mp3"""
import os, sys, subprocess
from pathlib import Path

sys.path.insert(0, '/home/super/stuff_AI_force/stuff/muming/vault/1-knowledge/project/content_creation企媒内容生产/pipelines/scripts')
from tts_doubao_v2 import text_to_mp3_sync

BASE = Path('/home/super/stuff_AI_force/stuff/muming/vault/1-knowledge/ai-frontier/decode/2026-04-24-codex-5.5-roundup')
BGM = Path('/home/super/stuff_AI_force/stuff/muming/.claude/skills/deep-decode/references/bgm')
VOICE = 'zh_female_roumeinvyou_emo_v2_mars_bigtts'

def split_by_transition(text):
    """按 [转场] 切分段。每段可能被 [转场] 结尾分隔。"""
    parts = text.split('[转场]')
    segments = []
    for i, p in enumerate(parts):
        p = p.strip()
        if not p:
            continue
        segments.append({'text': p, 'has_transition_before': i > 0})
    return segments

def chunk_text(text, max_len=800):
    """把长段落切成小于 max_len 字符的小块，TTS 单次请求有上限。按句号断。"""
    if len(text) <= max_len:
        return [text]
    chunks, cur = [], ''
    # 按句号/问号/感叹号断
    import re
    sentences = re.split(r'([。！？\n])', text)
    buf = ''
    for i in range(0, len(sentences), 2):
        sent = sentences[i]
        sep = sentences[i+1] if i+1 < len(sentences) else ''
        piece = sent + sep
        if len(buf) + len(piece) > max_len and buf:
            chunks.append(buf.strip())
            buf = piece
        else:
            buf += piece
    if buf.strip():
        chunks.append(buf.strip())
    return chunks

def synthesize_all(segments, out_dir):
    """逐段（再细分 chunk）合成 mp3。返回 [{file, has_transition_before}]"""
    out_dir.mkdir(exist_ok=True)
    results = []
    idx = 0
    for seg in segments:
        chunks = chunk_text(seg['text'])
        for j, c in enumerate(chunks):
            path = out_dir / f'seg_{idx:03d}.mp3'
            print(f'[TTS] seg_{idx:03d} ({len(c)} 字)...', flush=True)
            r = text_to_mp3_sync(c, str(path), voice_type=VOICE, speed_ratio=1.15,
                                 volume_ratio=1.3, pitch_ratio=1.0, enable_timestamp=False)
            results.append({
                'file': str(path),
                'has_transition_before': (j == 0 and seg['has_transition_before'])
            })
            idx += 1
    return results

def assemble(results, out_path):
    """拼接 + BGM + loudnorm"""
    from pydub import AudioSegment
    from pydub.effects import normalize, compress_dynamic_range

    # 片头用预录音 + BGM intro
    intro = AudioSegment.from_mp3(str(BGM / 'intro.mp3'))
    page_turn = AudioSegment.from_mp3(str(BGM / 'page-turn.mp3'))
    bgm = AudioSegment.from_mp3(str(BGM / 'lofi-podcast-bg.mp3'))

    podcast = intro
    for seg in results:
        audio = AudioSegment.from_mp3(seg['file'])
        if seg['has_transition_before']:
            podcast += AudioSegment.silent(duration=200)
            podcast += page_turn
            podcast += AudioSegment.silent(duration=200)
        else:
            podcast += AudioSegment.silent(duration=200)
        podcast += audio
    podcast += AudioSegment.silent(duration=500)

    # 循环 BGM 到同等长度
    intro_len = len(intro)
    while len(bgm) < len(podcast):
        bgm += bgm
    bgm = bgm[:len(podcast)]
    bgm_mixed = AudioSegment.silent(duration=intro_len) + (bgm[intro_len:] - 28)
    bgm_mixed = bgm_mixed[:len(podcast)]
    podcast = podcast.overlay(bgm_mixed)

    podcast = normalize(podcast)
    podcast = compress_dynamic_range(podcast, threshold=-20.0, ratio=4.0)

    raw_path = str(out_path).replace('.mp3', '_raw.mp3')
    podcast.export(raw_path, format='mp3', bitrate='192k', parameters=['-ar', '44100', '-ac', '1'])
    print(f'[ASSEMBLE] 原始版 {raw_path} ({len(podcast)/1000:.1f}s)', flush=True)

    # ffmpeg loudnorm
    cmd = ['ffmpeg', '-y', '-i', raw_path,
           '-af', 'loudnorm=I=-16:TP=-1.5:LRA=4,compand=attacks=0.3:decays=0.8:points=-80/-80|-45/-35|-27/-25|0/-7',
           '-ar', '44100', '-ac', '1', '-b:a', '192k', str(out_path)]
    subprocess.run(cmd, check=True, capture_output=True)
    print(f'[FFMPEG] 终版 {out_path}', flush=True)

def main():
    script = (BASE / 'podcast_script.txt').read_text()
    segments = split_by_transition(script)
    print(f'[SPLIT] {len(segments)} 段', flush=True)
    results = synthesize_all(segments, BASE / 'tts_segments')
    print(f'[TTS] 共合成 {len(results)} 个 mp3', flush=True)
    assemble(results, BASE / 'podcast.mp3')
    print('[DONE]', flush=True)

if __name__ == '__main__':
    main()
