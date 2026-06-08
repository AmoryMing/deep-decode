#!/usr/bin/env python3
"""探测「爽快思思」voice_type。
策略：直接用 TTS 尝试一组候选 voice_type，能合成就是有效的。"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path('/Users/muming/项目/内容/raw/vault/1-knowledge/project/content_creation企媒内容生产/pipelines/scripts')))
from tts_doubao_v2 import text_to_mp3_sync

OUT = Path('/Users/muming/项目/内容/output/2026-04-27-flipbook-pixel-browser/voice_probe')
OUT.mkdir(exist_ok=True)

CANDIDATES = [
    'zh_female_shuangkuaisisi_moon_bigtts',
    'zh_female_shuangkuaisisi_mars_bigtts',
    'zh_female_shuangkuaisisi_bigtts',
    'zh_female_shuangkuaisisi_emo_v2_mars_bigtts',
    'zh_female_shuangkuaisisi_emo_mars_bigtts',
    'zh_female_shuangkuaisisi_emo_v2_moon_bigtts',
]

TEST_TEXT = '你好，我是爽快思思，今天来聊一个有意思的话题。'

for v in CANDIDATES:
    out = OUT / f'{v}.mp3'
    try:
        r = text_to_mp3_sync(TEST_TEXT, str(out), voice_type=v, speed_ratio=1.15,
                             volume_ratio=1.3, pitch_ratio=1.0, enable_timestamp=False)
        size = out.stat().st_size if out.exists() else 0
        if size > 1000:
            print(f'[OK] {v}  size={size} bytes')
        else:
            print(f'[SMALL] {v}  size={size}')
    except Exception as e:
        msg = str(e)[:200]
        print(f'[FAIL] {v}  err={msg}')
