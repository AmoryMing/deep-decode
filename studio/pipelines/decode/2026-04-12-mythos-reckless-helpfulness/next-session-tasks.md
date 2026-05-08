# Mythos Deep Decode 下一 Session 任务清单

> 确认时间：2026-04-12 16:30
> 状态：待执行

## 执行顺序：B -> A -> C

---

## B 组：XHS 配图模板重写（优先，影响全部 5 篇）

- [ ] B1: 分析参考风格（万有引力 AI）- 字号/行距/边距/高亮/标题/列表/留白
- [ ] B2: 设计色板 - 主高亮绿色 + 辅色淡黄背景 + 正文黑 + 辅助灰
- [ ] B3: 重写渲染模板 `md2xhs_v2.py` - 卡片逻辑排版（非 markdown 截图）
- [ ] B4: 卡片类型定义 - 封面/正文/引用/列表/结语 5 种卡片
- [ ] B5: 篇五试跑验证

## A 组：篇五修复

- [ ] A1: md 图片路径改 wikilink `![[文件名]]`
- [ ] A2: 补 SVG/PNG 到 6-8 张（证据矩阵/风险热力图/监控架构/免疫盲区）
- [ ] A3: 用 B 组新模板重新生成 XHS 配图

## C 组：剩余 4 篇生产（每篇 --deep 全流程）

- [ ] C1: 篇三「老练的登山向导」(slug: mythos-alignment-frontier)
- [ ] C2: 篇四「Anthropic 的自我审判」(slug: mythos-risk-report-decoded)
- [ ] C3: 篇一「零日通胀」(slug: mythos-zero-day-inflation)
- [ ] C4: 篇二「不发布就是最大的发布」(slug: mythos-business-chess)
- [ ] C5: 每篇用新模板生成 XHS 配图

## 参考资料位置

- 参考账号风格：`vault/.../pipelines/小红书参考/`（3张截图 + 账号名）
- 篇五已有产出：`vault/.../pipelines/decode/2026-04-12-mythos-reckless-helpfulness/`
- Alignment Risk Update PDF：`.claude/projects/.../tool-results/webfetch-*.pdf`（60页已全文读取）
- 选题规划：本 session 对话中，5篇完整章节大纲 + 信源清单

## 色板方向

| 用途 | 颜色 | 备注 |
|------|------|------|
| 主高亮 | 绿色 `#2D9B6E` 或 `#4DB6AC` | 替代万有引力AI的蓝色 |
| 辅色背景 | 淡黄 `#FFFDE7` 或 `#FFF8E1` | 引用块/重点区域底色 |
| 正文 | `#1A1A1A` | 近黑 |
| 辅助灰 | `#666666` | 次要信息 |
| 页面底 | `#FFFFFF` | 纯白 |
