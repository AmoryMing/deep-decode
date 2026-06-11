import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getFactoryStats } from "@/lib/content";
import { getInProgress } from "@/lib/schedule";
import {
  getProjectStates,
  listPipelineProjects,
} from "@/lib/projectState";
import { getSetupInventory } from "@/lib/setup";
import { TableView } from "@/components/TableView";
import { PipelineProgress } from "@/components/PipelineProgress";
import { NewProjectForm } from "@/components/NewProjectForm";

export const metadata: Metadata = {
  title: "产出",
  robots: { index: false, follow: false },
};

// 进度要实时（跑 runner 取），不能静态化
export const dynamic = "force-dynamic";

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

export default async function Produce() {
  const posts = getAllPosts();
  const stats = getFactoryStats();
  const inProgress = getInProgress();

  // 真实流水线进度：跑 runner 取每个已进 runner（有 spec_lock）的项目状态
  const inv = getSetupInventory();
  const pipelineSlugs = listPipelineProjects();
  const states = await getProjectStates(pipelineSlugs.slice(0, 20));
  const liveStates = pipelineSlugs
    .map((s) => states.get(s))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .sort((a, b) => {
      // 没跑完的排前面，再按进度从低到高（最需要推进的在最上）
      const af = a.ready_to_distribute ? 1 : 0;
      const bf = b.ready_to_distribute ? 1 : 0;
      if (af !== bf) return af - bf;
      return a.progress.done / a.progress.total - b.progress.done / b.progress.total;
    });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">② 产出 · Deep-Decode 四件套</h2>
        <p className="mt-1 text-sm text-muted">
          每篇拆解 = 文章 + 信息图 + 播客 + 视频。共 {stats.total} 篇成稿，
          {stats.withPodcast} 带播客，{stats.withVideo} 带视频。
        </p>
      </header>

      {/* 新建项目：配置 5 原子 → 写 spec_lock → 可启动 */}
      <NewProjectForm
        opts={{
          readers: inv.readers.map((r) => ({ key: r.key, displayName: r.displayName })),
          styles: inv.styles.map((s) => ({ key: s.key })),
          contentTypes: inv.contentTypes.map((c) => ({ key: c.key, title: c.title })),
          channels: inv.channels,
        }}
      />

      {/* 流水线实时进度（runner 驱动） */}
      {liveStates.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            流水线进度 · 实时（{liveStates.length} 个项目）
          </h3>
          <div className="flex flex-col gap-3">
            {liveStates.map((st) => (
              <PipelineProgress key={st.slug} state={st} />
            ))}
          </div>
        </section>
      )}

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
