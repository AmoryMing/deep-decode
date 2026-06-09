import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "@/lib/repo";

interface AInput {
  platforms?: { platform: string; posts?: number; followers?: number }[];
  revenueByMonth?: { month: string; amount: number }[];
  revenueTotal?: number;
  contentTotal?: number;
  publishedCount?: number;
  scheduledCount?: number;
}

function ruleBasedInsight(d: AInput): { summary: string; points: string[] } {
  const points: string[] = [];
  const rev = d.revenueByMonth || [];
  if (rev.length >= 2) {
    const delta = rev[0].amount - rev[1].amount;
    const pct = rev[1].amount ? Math.round((delta / rev[1].amount) * 100) : 0;
    points.push(
      `营收 ${rev[0].month} ¥${rev[0].amount}，环比 ${delta >= 0 ? "+" : ""}${delta}（${pct >= 0 ? "+" : ""}${pct}%）`,
    );
  } else if (rev.length === 1) {
    points.push(`营收 ${rev[0].month} ¥${rev[0].amount}`);
  }
  const plats = (d.platforms || [])
    .slice()
    .sort((a, b) => (b.posts || 0) - (a.posts || 0));
  if (plats.length)
    points.push(
      `投放最集中：${plats[0].platform}（${plats[0].posts ?? 0} 次）；最少：${plats[plats.length - 1].platform}`,
    );
  if (d.contentTotal != null)
    points.push(
      `内容库 ${d.contentTotal} 篇，已投放 ${d.publishedCount ?? 0} 个发布点，${d.scheduledCount ?? 0} 个排期待发`,
    );
  const gaps: string[] = [];
  if ((d.scheduledCount ?? 0) > (d.publishedCount ?? 0))
    gaps.push("排期多于已发，关注发布执行率");
  if (
    plats.length >= 2 &&
    (plats[0].posts || 0) > (plats[plats.length - 1].posts || 0) * 3
  )
    gaps.push("平台投放不均，可补齐弱势平台分发");
  if (gaps.length) points.push("建议：" + gaps.join("；"));
  return {
    summary: `基于发布量与营收的规则分析：本月营收 ¥${rev[0]?.amount ?? 0}，内容库 ${d.contentTotal ?? 0} 篇，覆盖 ${plats.length} 个平台。`,
    points,
  };
}

const PROMPT = (d: AInput) =>
  `你是资深内容运营分析师。基于以下运营数据，给出一句话总结 + 3-5 条可执行洞察（中文，每条一行，具体、不客套）。只输出 JSON：{"summary":"...","points":["...","..."]}\n\n数据：${JSON.stringify(d)}`;

/** DeepSeek（OpenAI 兼容，国内可达） */
async function callDeepSeek(
  key: string,
  model: string,
  d: AInput,
): Promise<{ summary: string; points: string[] }> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "你是内容运营分析师，严格只输出 JSON 对象。" },
        { role: "user", content: PROMPT(d) },
      ],
      max_tokens: 900,
      temperature: 0.4,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`deepseek ${res.status}: ${(await res.text()).slice(0, 120)}`);
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content || "";
  const m = text.match(/\{[\s\S]*\}/);
  return m ? JSON.parse(m[0]) : { summary: text.slice(0, 200), points: [] };
}

/** Anthropic（备选） */
async function callClaude(
  key: string,
  model: string,
  d: AInput,
): Promise<{ summary: string; points: string[] }> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      messages: [{ role: "user", content: PROMPT(d) }],
    }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const json = await res.json();
  const text = json?.content?.[0]?.text || "";
  const m = text.match(/\{[\s\S]*\}/);
  return m ? JSON.parse(m[0]) : { summary: text.slice(0, 200), points: [] };
}

export async function POST(req: Request) {
  let d: AInput = {};
  try {
    d = await req.json();
  } catch {
    /* ignore */
  }

  const dsKey = process.env.DEEPSEEK_API_KEY;
  const anthKey = process.env.ANTHROPIC_API_KEY;

  let insight: { summary: string; points: string[] };
  let source: string;

  if (dsKey) {
    try {
      insight = await callDeepSeek(
        dsKey,
        process.env.DEEPSEEK_MODEL || "deepseek-chat",
        d,
      );
      source = `deepseek（${process.env.DEEPSEEK_MODEL || "deepseek-chat"}）`;
    } catch (e) {
      insight = ruleBasedInsight(d);
      source = `rules（DeepSeek 失败：${String(e).slice(0, 80)}）`;
    }
  } else if (anthKey) {
    try {
      insight = await callClaude(
        anthKey,
        process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
        d,
      );
      source = "claude";
    } catch (e) {
      insight = ruleBasedInsight(d);
      source = `rules（Claude 失败：${String(e).slice(0, 60)}）`;
    }
  } else {
    insight = ruleBasedInsight(d);
    source = "rules（未配置 LLM key）";
  }

  const payload = { ...insight, generatedAt: new Date().toISOString(), source };
  try {
    fs.writeFileSync(
      path.join(repoRoot(), "schedule", "ai-insights.json"),
      JSON.stringify(payload, null, 2),
    );
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true, ...payload });
}
