import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getFactoryStats } from "@/lib/content";
import { getInProgress } from "@/lib/schedule";
import { TableView } from "@/components/TableView";

export const metadata: Metadata = {
  title: "产出",
  robots: { index: false, follow: false },
};

function Dot({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      title={label}
      className={`inline-flex h-5 items-center gap-1 rounded px-1.5 text-[11px] ${
        on ? "bg-ink/90 text-paper" : "bg-line/60 text-muted line-through"
      }`}
    >
      {label}
    </span>
  );
}

export default function Produce() {
  const posts = getAllPosts();
  const stats = getFactoryStats();
  const inProgress = getInProgress();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">② 产出 · Deep-Decode 四件套</h2>
        <p className="mt-1 text-sm text-muted">
          每篇拆解 = 文章 + 信息图 + 播客 + 视频。共 {stats.total} 篇成稿，
          {stats.withPodcast} 带播客，{stats.withVideo} 带视频。
        </p>
      </header>

      {/* 在写 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          在写队列
        </h3>
        <div className="flex flex-col gap-4">
          {inProgress.map((t, i) => (
            <TableView key={i} table={t} />
          ))}
        </div>
      </section>

      {/* 成稿四件套齐全度 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          成稿四件套齐全度
        </h3>
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          {posts.map((p, i) => (
            <Link
              key={p.slug}
              href={`/post/${p.slug}`}
              className={`flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-paper ${
                i > 0 ? "border-t border-line/60" : ""
              }`}
            >
              <span className="w-20 shrink-0 font-mono text-xs text-muted">
                {p.date.slice(0, 10)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink">
                {p.title}
              </span>
              <span className="flex shrink-0 gap-1">
                <Dot on label="文" />
                <Dot on={p.imageCount > 0} label={`图${p.imageCount}`} />
                <Dot on={p.hasPodcast} label="播客" />
                <Dot on={p.hasVideo} label="视频" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
