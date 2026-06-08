import type { Metadata } from "next";
import {
  getScheduleSummary,
  getPublished,
  getInProgress,
  getQueue,
  getRevenue,
} from "@/lib/schedule";
import { getFactoryStats } from "@/lib/content";
import { TableView } from "@/components/TableView";
import type { MdTable } from "@/lib/schedule";

export const metadata: Metadata = {
  title: "后台",
  robots: { index: false, follow: false },
};

export default function Dashboard() {
  const summary = getScheduleSummary();
  const stats = getFactoryStats();
  const revenue = getRevenue();
  const published = getPublished();
  const inProgress = getInProgress();
  const queue = getQueue();

  return (
    <div className="flex flex-col gap-10">
      {/* 概览 */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          概览
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Metric n={summary.queueCount} label="待写" />
          <Metric n={summary.inProgressCount} label="在写" />
          <Metric n={stats.total} label="已成稿" />
          <Metric n={stats.withPodcast} label="带播客" />
          <Metric n={stats.withVideo} label="带视频" />
          <Metric
            n={summary.revenueThisMonth}
            label={`营收 ${revenue[0]?.month ?? ""}`}
            prefix="¥"
          />
        </div>
      </section>

      {/* 营收 */}
      {revenue.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            营收明细
          </h2>
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted">
                    月份
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted">
                    渠道
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-muted">
                    金额
                  </th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-line/60 last:border-0"
                  >
                    <td className="px-3 py-2 text-ink-soft">{r.month}</td>
                    <td className="px-3 py-2 text-ink-soft">{r.channel}</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums text-ink">
                      ¥{r.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 发布进度 */}
      <TableGroup
        title="发布进度"
        hint="平台列空 = 未发；日期 = 已发；draft = 草稿待点发。"
        tables={published}
        collapseFrom={1}
      />

      {/* 在写 */}
      <TableGroup title="在写队列" tables={inProgress} collapseFrom={99} />

      {/* 待写 */}
      <TableGroup title="待写队列" tables={queue} collapseFrom={99} />
    </div>
  );
}

function Metric({
  n,
  label,
  prefix,
}: {
  n: number;
  label: string;
  prefix?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="text-2xl font-bold tabular-nums text-ink">
        {prefix}
        {n}
      </div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

function TableGroup({
  title,
  hint,
  tables,
  collapseFrom,
}: {
  title: string;
  hint?: string;
  tables: MdTable[];
  collapseFrom: number;
}) {
  const live = tables.filter(
    (t) => t.rows.filter((r) => !/^~~/.test(r[0] || "")).length > 0,
  );
  if (live.length === 0) return null;
  return (
    <section>
      <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-muted">
        {title}
      </h2>
      {hint && <p className="mb-3 text-xs text-muted">{hint}</p>}
      <div className="flex flex-col gap-4">
        {live.map((t, i) =>
          i >= collapseFrom ? (
            <details key={i} className="rounded-lg border border-line bg-white">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-ink-soft">
                {t.caption || `表 ${i + 1}`}
              </summary>
              <div className="p-2">
                <TableView table={t} />
              </div>
            </details>
          ) : (
            <div key={i}>
              {t.caption && (
                <p className="mb-1.5 text-xs font-medium text-ink-soft">
                  {t.caption}
                </p>
              )}
              <TableView table={t} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
