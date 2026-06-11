import Link from "next/link";
import type { DataCenter } from "@/lib/dataCenter";

function Sparkline({ values }: { values: (number | null)[] }) {
  const nums = values.filter((v): v is number => v !== null);
  if (nums.length < 2) return <span className="text-xs text-muted">数据不足</span>;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;
  const w = 120;
  const h = 28;
  const pts = values
    .map((v, i) => {
      if (v === null) return null;
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink" />
    </svg>
  );
}

export function DataCenterPanel({ dc }: { dc: DataCenter }) {
  const last = dc.trend[dc.trend.length - 1];
  return (
    <div className="flex flex-col gap-6">
      {/* 时间序列趋势 */}
      <section>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">
          账号趋势 · {dc.trend.length} 天时间序列
        </h3>
        {dc.trend.length < 2 ? (
          <p className="rounded-lg border border-dashed border-line bg-white px-4 py-3 text-xs text-muted">
            还只有 {dc.trend.length} 天数据。每天自动记一次账号数据，攒几天就能看趋势了。
            当前粉丝 {last?.followers ?? "—"}。
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "粉丝", key: "followers" as const },
              { label: "曝光", key: "impressions" as const },
              { label: "收藏", key: "collects" as const },
              { label: "净涨粉", key: "netFollowers" as const },
            ].map((m) => (
              <div key={m.key} className="rounded-lg border border-line bg-white p-3">
                <div className="text-xs text-muted">{m.label}</div>
                <div className="text-lg font-bold text-ink">{last?.[m.key] ?? "—"}</div>
                <div className="mt-1">
                  <Sparkline values={dc.trend.map((t) => t[m.key])} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 高/低赢面概念（爆款归因先验） */}
      <section>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">
          赢面概念 · 表现反哺选题（{dc.priorsComputedFrom} 篇归因）
        </h3>
        {dc.priorsComputedFrom === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white px-4 py-3 text-xs text-muted">
            还没有单篇表现数据。文章发布后回来填一次它的点赞、收藏数，
            系统就会算出"哪类话题更受欢迎"，并自动给相关的新热点在选题页加权。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-3">
              <div className="mb-1.5 text-xs font-medium text-emerald-700">高赢面 ↑ 选题加权</div>
              <div className="flex flex-wrap gap-1.5">
                {dc.goodConcepts.map((c) => (
                  <span key={c.concept} className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] text-emerald-900">
                    {c.concept} +{c.weight.toFixed(2)}
                  </span>
                ))}
                {dc.goodConcepts.length === 0 && <span className="text-xs text-muted">—</span>}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-white p-3">
              <div className="mb-1.5 text-xs font-medium text-red-700">低赢面 ↓ 选题降权</div>
              <div className="flex flex-wrap gap-1.5">
                {dc.badConcepts.map((c) => (
                  <span key={c.concept} className="rounded bg-red-100 px-1.5 py-0.5 text-[11px] text-red-800">
                    {c.concept} {c.weight.toFixed(2)}
                  </span>
                ))}
                {dc.badConcepts.length === 0 && <span className="text-xs text-muted">—</span>}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 单篇表现排行 */}
      <section>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">
          单篇表现排行（按互动率）
        </h3>
        {dc.topContent.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white px-4 py-3 text-xs text-muted">
            还没有单篇数据。记录后这里按互动率排出你的爆款/平款。
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            {dc.topContent.map((c, i) => (
              <Link
                key={c.slug + c.platform}
                href={`/post/${c.slug}`}
                className={`flex items-center gap-3 px-3 py-2 text-sm hover:bg-paper ${
                  i > 0 ? "border-t border-line/60" : ""
                }`}
              >
                <span className="w-12 shrink-0 font-mono text-xs font-bold text-ink">
                  {c.engagement}%
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink-soft">
                  {c.slug}
                </span>
                <span className="shrink-0 text-[11px] text-muted">
                  {c.platform} · 赞{c.likes} 藏{c.collects}
                  {c.collectLikeRatio !== null && (
                    <span className={c.collectLikeRatio >= 1 ? "ml-1 text-emerald-700" : "ml-1"}>
                      藏赞比{c.collectLikeRatio}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
