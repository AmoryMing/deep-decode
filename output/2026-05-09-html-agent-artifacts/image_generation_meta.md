---
title: 主视觉生成记录
created: 2026-05-09
updated: 2026-05-09
type: artifact-meta
---

# 主视觉生成记录

- 产物：`00_sensenova_hero.png`
- 位置：正文第一屏、封面图之前；邮件中作为 CID 内联图片发送。
- 设计目的：恢复历史 happy path 中“AI 主视觉 + 结构图 + 播客附件”的正文入口。
- 生成方式：调用 AIForce 论坛 skill 对应的内网 SenseNova-U1 原生服务 `http://10.12.16.90:49000/t2i`。
- 当前版本：`00_sensenova_hero.png`，task_id `72bf7e6d-61f5-4691-b462-377bce079519`，参数 1024×1024 / 25 steps。
- 可见失败样本：`00_sensenova_hero_v1_text_artifact.png`，task_id `9a3e1ac0-8f0d-4b6b-ac6b-0fba4d89d1d5`，因英文/中文文字瑕疵未采用。
- 元数据：`00_sensenova_hero.meta.json` 记录 provider、task_id、health、参数和输出路径。
