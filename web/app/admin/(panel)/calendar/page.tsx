import type { Metadata } from "next";
import { getPublishEvents, getCalendarStats } from "@/lib/calendar";
import { getPublished } from "@/lib/schedule";
import { CalendarView } from "@/components/CalendarView";
import { TableView } from "@/components/TableView";

export const metadata: Metadata = {
  title: "投放日历",
  robots: { index: false, follow: false },
};

export default function CalendarPage() {
  const events = getPublishEvents();
  const stats = getCalendarStats();
  const published = getPublished();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">④ 投放 · 发布日历</h2>
        <p className="mt-1 text-sm text-muted">
          按日期管理多平台投放。共 {stats.totalEvents} 个发布点，
          {stats.published} 已发，{stats.scheduled} 排期中。
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat n={stats.published} label="已发布" />
        <Stat n={stats.scheduled} label="排期中" />
        <Stat n={stats.draft} label="草稿待发" />
        <Stat n={stats.totalEvents} label="总发布点" />
      </div>

      <CalendarView events={events} />

      {/* 平台分布 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          各平台投放量
        </h3>
        <div className="flex flex-wrap gap-2">
          {stats.byPlatform.map((p) => (
            <div
              key={p.platform}
              className="flex items-baseline gap-2 rounded-lg border border-line bg-white px-3 py-2"
            >
              <span className="text-sm text-ink-soft">{p.platform}</span>
              <span className="text-lg font-bold tabular-nums text-ink">
                {p.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 发布进度表 */}
      <section>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-muted">
          发布进度明细
        </h3>
        <p className="mb-3 text-xs text-muted">
          平台列空=未发；日期=已发；draft=草稿待点发。
        </p>
        <div className="flex flex-col gap-4">
          {published.slice(0, 2).map((t, i) =>
            i === 0 ? (
              <div key={i}>
                {t.caption && (
                  <p className="mb-1.5 text-xs font-medium text-ink-soft">
                    {t.caption}
                  </p>
                )}
                <TableView table={t} />
              </div>
            ) : (
              <details key={i} className="rounded-lg border border-line bg-white">
                <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-ink-soft">
                  {t.caption || `表 ${i + 1}`}
                </summary>
                <div className="p-2">
                  <TableView table={t} />
                </div>
              </details>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="text-2xl font-bold tabular-nums text-ink">{n}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
