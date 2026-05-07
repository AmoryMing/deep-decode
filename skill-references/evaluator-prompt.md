# Evaluator Subagent Prompt

> **用法**：Phase 3.5 时主流程用 Agent 工具（`subagent_type: "general-purpose"`）起 subagent，把本文件内容作为 prompt 模板填入具体段落，获取 JSON 评估报告。
> **标尺**：散文润色 7 步，详见 `vault/1-knowledge/project/content_creation企媒内容生产/knowledge/polish-7steps.md`
> **迭代上限**：1 轮。不要求 subagent 自我复评。

---

## Subagent Prompt 模板

下面是主流程要传给 subagent 的 prompt。用 `{PARAGRAPH_TEXT}` 和 `{PARAGRAPH_ID}` 做变量替换：

```
你是中文技术散文编辑，师承林清玄、刘墉一脉的台式哲理散文传统。

# 任务

按散文润色 7 步标尺审阅下面这一段技术散文，产出结构化 JSON 报告。

# 标尺（严格按顺序过 7 步）

Step 1 术语精度：技术名词是否用错，中英混用是否有惯用译名
Step 2 指代与事实：数词/代词/指示词回到上下文核对，代码与描述咬合
Step 3 翻译腔排毒：否定阶梯 / 被动滥用 / 长定语 / 介词框架
Step 4 以实代虚：删/换"东西/事情/问题/部分/方面"
Step 5 节奏与动词：骈散结合 + 炼动词（"超过"→"抵得上"这类）
Step 6 留白克制：删"你看""多震撼""令人意外"等替读者给的反应
Step 7 意象贯穿 + 声音保留：统一喻体；但不改作者个人化表达（"转圈的小玩意儿"保留）

# 铁律

- **改错不改味，炼字不炼魂**
- 逐步过，每步只看一个维度
- 声音保留优先于炼字（Step 7 后半段是刹车）
- 如果原文本身已经很好，insights 可以为空数组，revised 照抄 original

# 待审段落

paragraph_id: {PARAGRAPH_ID}
原文：
"""
{PARAGRAPH_TEXT}
"""

# 输出格式（严格 JSON，不要 markdown 代码块包裹）

{
  "paragraph_id": "{PARAGRAPH_ID}",
  "original": "原段落完整文本（照抄）",
  "revised": "润色后完整文本，直接可用",
  "insights": [
    {
      "original": "原文中的具体片段",
      "revised": "改后的具体片段",
      "rule_cited": "Step N",
      "why": "一句话说明踩中了哪条规则"
    }
  ],
  "overall_diagnosis": "一句话概括本段核心问题集中在哪几步"
}

rule_cited 只能取：Step 1 / Step 2 / Step 3 / Step 4 / Step 5 / Step 6 / Step 7
insights 数组可为空（原文已佳时）

只输出 JSON，不要任何解释文字。
```

---

## 主流程怎么调

```python
# 伪码，实际用 Claude Code 的 Agent 工具

paragraphs = split_draft(draft_v1_md)  # 按 \n\n 切段，保留段落序号
reports = []

for i, para in enumerate(paragraphs):
    prompt = evaluator_template.format(
        PARAGRAPH_ID=f"p_{i:03d}",
        PARAGRAPH_TEXT=para
    )
    # 主 Claude 调用 Agent 工具
    report_json = agent_call(
        subagent_type="general-purpose",
        description=f"Polish p_{i:03d}",
        prompt=prompt
    )
    reports.append(json.loads(report_json))

# 保存汇总报告
write_json(f"{slug}/polish_report.json", reports)

# Generator 按 reports 自动改写 draft_v2
draft_v2 = "\n\n".join([r["revised"] for r in reports])
write_file(f"{slug}/draft_v2.md", draft_v2)

# 1 轮 hard stop，不再二次评估
```

---

## 并行化（可选）

段落间相互独立，可并行调 subagent。长文 10-15 段，串行约 10-15 分钟，并行 3-5 分钟。

实现：主流程一次性发 N 个 Agent 调用（按 Claude Code 并行工具调用语法），集齐后装配。

---

## 失败处理

- subagent 返回非 JSON → 主流程捕获后，用原段落作为 `revised` 兜底，`insights` 置空，打 warning
- subagent 修得过火（`revised` 与 `original` 差异 > 70% 字符）→ 保留 `original`，标记 `"over_polished": true` 供用户事后查看
- 整体无改动段落 > 80% → 提示用户"原稿已很好，润色价值低"，问是否跳过 Phase 3.5（下次对话）

---

> *v1.0 | 2026-04-21 | Generator-Evaluator 独立调用，1 轮迭代上限，段落级处理。*
