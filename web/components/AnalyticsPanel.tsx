"use client";

import { useState } from "react";
import type { AnalyticsData, AIInsight } from "@/lib/analytics";

export interface AIInput {
  platforms: { platform: string; posts?: number }[];
  revenueByMonth: { month: string; amount: number }[];
  revenueTotal: number;
  contentTotal: number;
  publishedCount: number;
  scheduledCount: number;
}

export function AnalyticsPanel({
  data,
  aiInput,
  insight,
}: {
  data: AnalyticsData;
  aiInput: AIInput;
  insight: AIInsight | null;
}) {
  const [ai, setAi] = useState<AIInsight | null>(insight);
  const [aiBusy, setAiBusy] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);
  const [refreshBusy, setRefreshBusy] = useState(false);

  const maxRev = Math.max(1, ...data.revenueByMonth.map((r) => r.amount));

  async function runAI() {
    setAiBusy(true);
    try {
      const res = await fetch("/api/analytics/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(aiInput),
      });
      const j = await res.json();
      setAi({ summary: j.summary, points: j.points, generatedAt: j.generatedAt });
    } catch (e) {
      setAi({ summary: `分析失败：${String(e)}`, points: [], generatedAt: "" });
    }
    setAiBusy(false);
  }

  async function refresh() {
    setRefreshBusy(true);
    setRefreshMsg(null);
    try {
      const res = await fetch("/api/analytics/refresh", { method: "POST" });
      const j = await res.json();
      setRefreshMsg(j.message || (j.ok ? "已拉取并写入。" : "拉取未完成。"));
    } catch (e) {
      setRefreshMsg(`拉取失败：${String(e)}`);
    }
    setRefreshBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 数据源 + 拉取 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3">
        <div className="text-sm">
          <span className="text-muted">数据源：</span>
          <span className="font-medium text-ink">
            {data.source === "manual" ? "实拉数据" : "派生（发布量+营收）"}
          </span>
        </div>
        <button
          onClick={refresh}
          disabled={refreshBusy}
          className="rounded-lg bg-ink px-3.5 py-1.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {refreshBusy ? "拉取中…" : "拉取 XHS / 公众号数据"}
        </button>
      </div>
      {refreshMsg && (
        <p className="-mt-3 text-xs text-muted">{refreshMsg}</p>
      )}

      {/* 平台数据 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          各平台
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {data.platforms.map((p) => (
            <div
              key={p.platform}
              className="rounded-xl border border-line bg-white p-4"
            >
              <div className="text-sm font-semibold text-ink">{p.platform}</div>
              <dl className="mt-2 flex flex-col gap-1 text-xs">
                {p.followers != null && <Row k="粉丝" v={p.followers} />}
                {p.newFollowers != null && <Row k="净涨粉" v={p.newFollowers} />}
                {p.reads != null && <Row k="曝光" v={p.reads} />}
                {p.views != null && <Row k="观看" v={p.views} />}
                {p.likes != null && <Row k="点赞" v={p.likes} />}
                {p.collects != null && <Row k="收藏" v={p.collects} />}
                {p.comments != null && <Row k="评论" v={p.comments} />}
                {p.shares != null && <Row k="分享" v={p.shares} />}
                {p.posts != null && <Row k="发布" v={p.posts} />}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* 营收趋势 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          营收趋势 · 累计 ¥{data.revenueTotal}
        </h3>
        <div className="flex flex-col gap-2 rounded-xl border border-line bg-white p-4">
          {data.revenueByMonth.map((r) => (
            <div key={r.month} className="flex items-center gap-3">
              <span className="w-16 shrink-0 font-mono text-xs text-muted">
                {r.month}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-line/40">
                <div
                  className="h-full rounded bg-accent"
                  style={{ width: `${(r.amount / maxRev) * 100}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                ¥{r.amount}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* AI 洞察 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
            AI 分析
          </h3>
          <button
            onClick={runAI}
            disabled={aiBusy}
            className="rounded-lg border border-ink px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
          >
            {aiBusy ? "分析中…" : ai ? "重新分析" : "生成洞察"}
          </button>
        </div>
        <div className="rounded-xl border border-line bg-white p-5">
          {ai ? (
            <>
              <p className="text-sm leading-relaxed text-ink">{ai.summary}</p>
              {ai.points.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {ai.points.map((pt, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-ink-soft"
                    >
                      <span className="text-accent">›</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
              {ai.generatedAt && (
                <p className="mt-3 text-[11px] text-muted">
                  {ai.generatedAt.slice(0, 16).replace("T", " ")}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">
              点「生成洞察」基于当前数据分析趋势与建议。配置 ANTHROPIC_API_KEY
              后由 Claude 生成，否则用规则分析。
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="font-medium tabular-nums text-ink">{v}</dd>
    </div>
  );
}
