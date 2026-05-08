#coding=utf-8
"""
豆包 TTS v2 -- 支持字级时间戳
基于 archive/探索项目/完全复制体/voice_agent/src/tts_doubao.py 改造

核心改动：
1. request_json["audio"] 新增 enable_timestamp: true
2. parse_response 解析 0xc frontend response 中的时间戳 JSON
3. text_to_mp3 返回 (audio_path, timestamps) 元组

用法：
    from tts_doubao_v2 import text_to_mp3_sync
    audio_path, timestamps = text_to_mp3_sync("你好世界", "output.mp3")
    # timestamps = [{"text": "你", "start_ms": 0, "end_ms": 200}, ...]
"""

import asyncio
import websockets
import uuid
import json
import gzip
import os
import logging
import time
from typing import Optional, Union, Tuple, List, Dict

logger = logging.getLogger(__name__)

MESSAGE_TYPES = {11: "audio-only server response", 12: "frontend server response", 15: "error message from server"}
MESSAGE_TYPE_SPECIFIC_FLAGS = {0: "no sequence number", 1: "sequence number > 0",
                               2: "last message from server (seq < 0)", 3: "sequence number < 0"}

appid = "5196631133"
token = "JtNlEURIX18F8tJxnZ2PO5WTFWUasJky"
cluster = "volcano_tts"
default_voice = "zh_female_roumeinvyou_emo_v2_mars_bigtts"
host = "openspeech.bytedance.com"
api_url = f"wss://{host}/api/v1/tts/ws_binary"

default_header = bytearray(b'\x11\x10\x11\x00')


class TTSResult:
    """TTS 结果容器，同时持有音频和时间戳"""
    def __init__(self):
        self.audio_path: Optional[str] = None
        self.audio_bytes: Optional[bytes] = None
        self.timestamps: List[Dict] = []
        self.raw_frontend_responses: List[str] = []  # 原始响应，调试用
        self.duration_ms: int = 0


def parse_response(res, file, result: TTSResult, request_id=None, chunk_index=None):
    """
    解析豆包 TTS 服务器响应

    关键改动：message_type 0xc 时解析时间戳 JSON 并存入 result.timestamps
    """
    try:
        protocol_version = res[0] >> 4
        header_size = res[0] & 0x0f
        message_type = res[1] >> 4
        message_type_specific_flags = res[1] & 0x0f
        serialization_method = res[2] >> 4
        message_compression = res[2] & 0x0f
        reserved = res[3]
        header_extensions = res[4:header_size*4]
        payload = res[header_size*4:]

        log_prefix = f"[TTS-v2] {request_id or '?'}"

        if message_type == 0xb:  # audio-only server response
            if message_type_specific_flags == 0:
                return False
            else:
                sequence_number = int.from_bytes(payload[:4], "big", signed=True)
                payload_size = int.from_bytes(payload[4:8], "big", signed=False)
                audio_payload = payload[8:]

                file.write(audio_payload)

                if sequence_number < 0:
                    logger.info(f"{log_prefix} 音频流传输完成")
                    return True
                return False

        elif message_type == 0xf:  # error message
            code = int.from_bytes(payload[:4], "big", signed=False)
            msg_size = int.from_bytes(payload[4:8], "big", signed=False)
            error_msg = payload[8:]
            if message_compression == 1:
                error_msg = gzip.decompress(error_msg)
            error_msg = str(error_msg, "utf-8")
            logger.error(f"{log_prefix} 服务器错误 code={code}: {error_msg}")
            return True

        elif message_type == 0xc:  # frontend server response -- 时间戳在这里！
            msg_size = int.from_bytes(payload[:4], "big", signed=False)
            frontend_payload = payload[4:]
            if message_compression == 1:
                frontend_payload = gzip.decompress(frontend_payload)

            # 保存原始响应用于调试
            raw_str = frontend_payload.decode("utf-8", errors="replace")
            result.raw_frontend_responses.append(raw_str)
            logger.info(f"{log_prefix} 前端响应 (len={len(raw_str)}): {raw_str[:500]}")

            # 尝试解析为 JSON 提取时间戳
            try:
                data = json.loads(raw_str)
                _extract_timestamps(data, result)
            except json.JSONDecodeError:
                logger.warning(f"{log_prefix} 前端响应不是 JSON，跳过时间戳解析")

            return False

        else:
            logger.warning(f"{log_prefix} 未知消息类型: {message_type:#x}")
            return True

    except Exception as e:
        logger.error(f"[TTS-v2] 解析响应失败: {e}", exc_info=True)
        return True


def _extract_timestamps(data: dict, result: TTSResult):
    """
    从前端响应 JSON 中提取时间戳。

    豆包 TTS 实际返回格式（已验证）：
    {
      "frontend": "{\"words\":[{\"confidence\":0.89,\"end_time\":205,\"start_time\":85,\"word\":\"这\"}, ...]}"
    }
    注意：frontend 的值是双重编码的 JSON 字符串！需要再 parse 一次。

    也处理 duration/first_pkg 响应（第二个 0xc 消息）。
    """
    # 格式 1（已验证）：双重编码的 frontend JSON 字符串
    if "frontend" in data and isinstance(data["frontend"], str):
        try:
            inner = json.loads(data["frontend"])
            if "words" in inner and isinstance(inner["words"], list):
                for item in inner["words"]:
                    ts = _normalize_timestamp_item(item)
                    if ts:
                        result.timestamps.append(ts)
                logger.info(f"[TTS-v2] 从 frontend 提取到 {len(inner['words'])} 个字级时间戳")
                return
        except json.JSONDecodeError:
            logger.warning("[TTS-v2] frontend 字段不是有效 JSON")

    # 格式 2：duration 信息（记录总时长）
    if "duration" in data:
        result.duration_ms = int(data["duration"])
        logger.info(f"[TTS-v2] 音频总时长: {result.duration_ms}ms")
        return

    # 兜底：递归搜索
    timestamps = _find_timestamp_arrays(data)
    if timestamps:
        result.timestamps.extend(timestamps)
        logger.info(f"[TTS-v2] 兜底搜索提取到 {len(timestamps)} 个时间戳")
    else:
        logger.info(f"[TTS-v2] 未找到时间戳，keys: {list(data.keys())}")


def _find_timestamp_arrays(obj, depth=0) -> List[Dict]:
    """递归搜索 JSON 中的时间戳数组"""
    if depth > 10:
        return []

    results = []

    if isinstance(obj, dict):
        # 检查当前层级是否有 words/phonemes/chars 等时间戳数组
        for key in ("words", "word_timestamps", "chars", "phonemes", "timestamps", "segments"):
            if key in obj and isinstance(obj[key], list):
                for item in obj[key]:
                    ts = _normalize_timestamp_item(item)
                    if ts:
                        results.append(ts)

        # 如果当前层级没找到，递归搜索所有值
        if not results:
            for v in obj.values():
                results.extend(_find_timestamp_arrays(v, depth + 1))

    elif isinstance(obj, list):
        # 如果是列表，检查元素是否像时间戳
        for item in obj:
            if isinstance(item, dict):
                ts = _normalize_timestamp_item(item)
                if ts:
                    results.append(ts)
                else:
                    results.extend(_find_timestamp_arrays(item, depth + 1))

    return results


def _normalize_timestamp_item(item: dict) -> Optional[Dict]:
    """将各种格式的时间戳条目归一化为 {text, start_ms, end_ms}"""
    if not isinstance(item, dict):
        return None

    # 提取文本
    text = item.get("text") or item.get("word") or item.get("char") or item.get("phoneme")
    if not text:
        return None

    # 提取开始时间（尝试多种 key 名）
    start = None
    for k in ("start_time", "start", "begin", "start_ms", "begin_time", "startTime"):
        if k in item:
            start = item[k]
            break

    # 提取结束时间
    end = None
    for k in ("end_time", "end", "finish", "end_ms", "endTime"):
        if k in item:
            end = item[k]
            break

    if start is not None and end is not None:
        return {"text": str(text), "start_ms": int(start), "end_ms": int(end)}

    return None


async def text_to_mp3(
    text: str,
    output_path: Optional[str] = None,
    voice_type: str = default_voice,
    speed_ratio: float = 1.2,
    volume_ratio: float = 1.5,
    pitch_ratio: float = 1.0,
    enable_timestamp: bool = True,
    return_bytes: bool = False
) -> TTSResult:
    """
    豆包 TTS v2 -- 返回音频 + 时间戳

    与 v1 的区别：
    - 默认开启 enable_timestamp
    - 返回 TTSResult 对象（含 audio_path, timestamps, raw_frontend_responses）
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    result = TTSResult()

    logger.info(f"[TTS-v2] 开始 {request_id} | 文本={len(text)}字 voice={voice_type} timestamp={enable_timestamp}")

    request_json = {
        "app": {
            "appid": appid,
            "token": "access_token",
            "cluster": cluster
        },
        "user": {
            "uid": "388808087185088"
        },
        "audio": {
            "voice_type": voice_type,
            "encoding": "mp3",
            "speed_ratio": speed_ratio,
            "volume_ratio": volume_ratio,
            "pitch_ratio": pitch_ratio,
        },
        "request": {
            "reqid": request_id,
            "text": text,
            "text_type": "plain",
            "operation": "submit"
        }
    }

    # v2 关键改动：开启时间戳
    # 注意：时间戳参数在 request 对象里，不是 audio 里！
    # - with_frontend: "1" → 音素级时间戳（0xc frontend response）
    # - with_timestamp: "1" → 原文文本时间戳
    # - frontend_type: "unitTson" → 返回格式
    if enable_timestamp:
        request_json["request"]["with_frontend"] = "1"
        request_json["request"]["frontend_type"] = "unitTson"
        request_json["request"]["with_timestamp"] = "1"

    payload_bytes = gzip.compress(json.dumps(request_json).encode())
    full_client_request = bytearray(default_header)
    full_client_request.extend(len(payload_bytes).to_bytes(4, 'big'))
    full_client_request.extend(payload_bytes)

    if not output_path and not return_bytes:
        output_path = f"tts_output_{uuid.uuid4().hex[:8]}.mp3"

    import io
    audio_buffer = io.BytesIO() if return_bytes else None
    file_to_save = audio_buffer if return_bytes else open(output_path, "wb")

    try:
        headers = {"Authorization": f"Bearer; {token}"}
        async with websockets.connect(api_url, additional_headers=headers, ping_interval=None) as ws:
            await ws.send(full_client_request)

            while True:
                try:
                    res = await asyncio.wait_for(ws.recv(), timeout=30.0)
                    done = parse_response(res, file_to_save, result, request_id)
                    if done:
                        break
                except asyncio.TimeoutError:
                    raise Exception("接收音频数据超时(30s)")

    except websockets.exceptions.ConnectionClosed as e:
        raise Exception(f"WebSocket连接异常: {e}")
    finally:
        if not return_bytes and hasattr(file_to_save, 'close'):
            file_to_save.close()

    total_time = time.time() - start_time

    if return_bytes:
        result.audio_bytes = audio_buffer.getvalue()
        logger.info(f"[TTS-v2] 完成 {request_id} | {len(result.audio_bytes)}bytes {total_time:.2f}s | 时间戳={len(result.timestamps)}条")
    else:
        result.audio_path = output_path
        logger.info(f"[TTS-v2] 完成 {request_id} | {output_path} {total_time:.2f}s | 时间戳={len(result.timestamps)}条")

    return result


def text_to_mp3_sync(
    text: str,
    output_path: Optional[str] = None,
    voice_type: str = default_voice,
    speed_ratio: float = 1.2,
    volume_ratio: float = 1.5,
    pitch_ratio: float = 1.0,
    enable_timestamp: bool = True,
    return_bytes: bool = False
) -> TTSResult:
    """同步包装器"""
    return asyncio.run(text_to_mp3(
        text=text,
        output_path=output_path,
        voice_type=voice_type,
        speed_ratio=speed_ratio,
        volume_ratio=volume_ratio,
        pitch_ratio=pitch_ratio,
        enable_timestamp=enable_timestamp,
        return_bytes=return_bytes
    ))
