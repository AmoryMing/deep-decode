"use client";

import { useState } from "react";
import type { XhsSnapshot, XhsDerived } from "@/lib/xhs";

function fmtNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}万`;
  return n.toLocaleString();
}

function Change({ change }: { change: number | null }) {
  if (change == null) return <span className="text-xs text-muted">—</span>;
  const up = change >= 0;
  // 早期号环比基数低，>1000% 用倍数更直观
  const txt =
    Math.abs(change) >= 1000
      ? `${up ? "↑" : "↓"}${Math.round(Math.abs(change) / 100)}×`
      : `${up ? "↑" : "↓"}${Math.abs(change)}%`;
  return (
    <span
      className={`text-xs font-medium ${up ? "text-emerald-600" : "text-accent"}`}
    >
      {txt}
    </span>
  );
}

const ORDER = [
  "impressions",
  "views",
  "likes",
  "collects",
  "comments",
  "shares",
  "netFollowers",
  "visitors",
];

export function XhsDashboard({
  snapshot,
  derived,
}: {
  snapshot: XhsSnapshot;
  derived: XhsDerived;
}) {
  const { account: a, metrics: m } = snapshot;
  const [ai, setAi] = useState<{ summary: string; points: string[] } | null>(
    null,
  );
  const [aiBusy, setAiBusy] = useState(false);

  const maxFunnel = Math.max(1, ...derived.funnel.map((f) => f.value));

  async function runAI() {
    setAiBusy(true);
    try {
      const res = await fetch("/api/analytics/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          platforms: [{ platform: "小红书", posts: m.shares ? 77 : 0 }],
          revenueByMonth: [],
          revenueTotal: 0,
          contentTotal: 133,
          xhs: {
            account: a.name,
            followers: a.followers,
            period: snapshot.period,
            impressions: m.impressions?.value,
            views: m.views?.value,
            likes: m.likes?.value,
            collects: m.collects?.value,
            comments: m.comments?.value,
            shares: m.shares?.value,
            netFollowers: m.netFollowers?.value,
            viewRate: derived.viewRate,
            engageRate: derived.engageRate,
            collectLikeRatio: derived.collectLikeRatio,
            latestNote: snapshot.latestNote,
          },
        }),
      });
      const j = await res.json();
      setAi({ summary: j.summary, points: j.points || [] });
    } catch (e) {
      setAi({ summary: `分析失败：${String(e)}`, points: [] });
    }
    setAiBusy(false);
  }

  const followerPct = Math.min(
    100,
    Math.round((a.followers / a.followerGoal) * 100),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 账号头部 */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-ink">{a.name}</span>
              <span className="rounded bg-[#ff2741]/10 px-1.5 py-0.5 text-[11px] font-medium text-[#ff2741]">
                小红书 @{a.handle}
              </span>
            </div>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted">
              {a.bio}
            </p>
          </div>
          <div className="flex gap-5 text-center">
            <Kpi n={a.following} label="关注" />
            <Kpi n={a.followers} label="粉丝" />
            <Kpi n={a.totalLikesCollects} label="获赞与收藏" />
          </div>
        </div>
        {/* 粉丝里程碑进度 */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>距 {a.followerGoal} 粉里程碑</span>
            <span className="tabular-nums">
              {a.followers}/{a.followerGoal}（{followerPct}%）
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line/50">
            <div
              className="h-full rounded-full bg-[#ff2741]"
              style={{ width: `${followerPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 周期标记 */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-ink px-2.5 py-1 font-medium text-paper">
          {snapshot.range}
        </span>
        <span className="text-muted">统计周期 {snapshot.period}</span>
        <span className="text-muted">· 更新 {snapshot.updatedAt}</span>
        <span className="rounded-full border border-line px-2 py-0.5 text-muted">
          快照模式 · 手动刷新
        </span>
      </div>

      {/* 核心指标网格 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          近 7 日核心指标
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ORDER.map((k) => {
            const x = m[k];
            if (!x) return null;
            return (
              <div
                key={k}
                className="rounded-xl border border-line bg-white p-4"
              >
                <div className="text-xs text-muted">{x.label}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tabular-nums text-ink">
                    {x.unit === "%" ? x.value : fmtNum(x.value)}
                    {x.unit === "%" ? "%" : ""}
                  </span>
                  <Change change={x.change} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted">
          环比基数低（账号早期高增长期），&gt;1000% 用倍数表示
        </p>
      </section>

      {/* 转化漏斗 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          转化漏斗
        </h3>
        <div className="flex flex-col gap-2 rounded-xl border border-line bg-white p-4">
          {derived.funnel.map((f, i) => (
            <div key={f.stage} className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-ink-soft">
                {f.stage}
              </span>
              <div className="h-7 flex-1 overflow-hidden rounded bg-line/40">
                <div
                  className="flex h-full items-center justify-end rounded bg-[#ff2741]/80 pr-2"
                  style={{
                    width: `${Math.max(6, (f.value / maxFunnel) * 100)}%`,
                  }}
                >
                  <span className="text-xs font-medium text-white">
                    {fmtNum(f.value)}
                  </span>
                </div>
              </div>
              <span className="w-16 shrink-0 text-right text-xs text-muted">
                {i === 0 ? "—" : `转化 ${f.rate}%`}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 健康度 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          内容健康度
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {derived.health.map((h) => (
            <div
              key={h.label}
              className={`rounded-xl border p-4 ${
                h.good
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-amber-200 bg-amber-50/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">{h.label}</span>
                <span className={h.good ? "text-emerald-600" : "text-amber-600"}>
                  {h.good ? "●" : "○"}
                </span>
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums text-ink">
                {h.value}
              </div>
              <p className="mt-1 text-[10px] leading-tight text-muted">
                {h.hint}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI 洞察 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
            AI 洞察（DeepSeek）
          </h3>
          <button
            onClick={runAI}
            disabled={aiBusy}
            className="rounded-lg border border-ink px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
          >
            {aiBusy ? "分析中…" : ai ? "重新分析" : "分析这份数据"}
          </button>
        </div>
        <div className="rounded-xl border border-line bg-white p-5">
          {ai ? (
            <>
              <p className="text-sm leading-relaxed text-ink">{ai.summary}</p>
              {ai.points.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {ai.points.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-soft">
                      <span className="text-[#ff2741]">›</span>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">
              点「分析这份数据」让 DeepSeek 基于曝光/互动/涨粉给出诊断与下一步建议。
            </p>
          )}
        </div>
      </section>

      <p className="text-[11px] text-muted">
        最新笔记：{snapshot.latestNote}
      </p>
    </div>
  );
}

function Kpi({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="text-lg font-bold tabular-nums text-ink">
        {fmtNum(n)}
      </div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}
