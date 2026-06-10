import type { Metadata } from "next";
import { getTopics, getRadar, getTopicStats, getLatestRadar } from "@/lib/topics";
import { getQueue } from "@/lib/schedule";
import { TableView } from "@/components/TableView";
import { RadarInbox } from "@/components/RadarInbox";

export const metadata: Metadata = {
  title: "选题",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Discover() {
  const topics = getTopics();
  const stats = getTopicStats();
  const radar = getRadar();
  const queue = getQueue();
  const latestRadar = getLatestRadar();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">① 选题 · 内容发现</h2>
        <p className="mt-1 text-sm text-muted">
          雷达扫信源 → 选题库沉淀 → 待写队列。共 {stats.total} 个选题。
        </p>
      </header>

      {/* 选题收件箱（scout2 结构化雷达 → 一键建项目） */}
      {latestRadar && latestRadar.items.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            选题收件箱 · 多信号+AI 打分
          </h3>
          <RadarInbox items={latestRadar.items} date={latestRadar.date} />
        </section>
      )}

      {/* 雷达：内容发现 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          内容发现雷达
        </h3>
        {radar.length === 0 ? (
          <p className="text-sm text-muted">
            暂无雷达报告。运行 scout 扫信源后出现在这里。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {radar.slice(0, 6).map((r) => (
              <div
                key={r.date}
                className="rounded-lg border border-line bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-ink">
                    {r.date}
                  </span>
                  <span className="rounded-full bg-line/70 px-2 py-0.5 text-xs text-ink-soft">
                    {r.items} 条
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted">
                  {r.preview}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 待写队列 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          待写队列
        </h3>
        <div className="flex flex-col gap-4">
          {queue.slice(0, 3).map((t, i) => (
            <div key={i}>
              {t.caption && (
                <p className="mb-1.5 text-xs font-medium text-ink-soft">
                  {t.caption}
                </p>
              )}
              <TableView table={t} />
            </div>
          ))}
        </div>
      </section>

      {/* 选题库 */}
      <section>
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
            选题库
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {stats.byStatus.map((s) => (
              <span
                key={s.status}
                className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
              >
                {s.status} {s.count}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {topics.slice(0, 24).map((t) => (
            <div
              key={t.slug}
              className="rounded-lg border border-line bg-white p-4"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold leading-snug text-ink">
                  {t.title}
                </h4>
                <span className="shrink-0 rounded bg-line/70 px-1.5 py-0.5 text-[10px] text-muted">
                  {t.status}
                </span>
              </div>
              {t.angle && (
                <p className="line-clamp-2 text-xs text-muted">{t.angle}</p>
              )}
              {t.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-accent"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
