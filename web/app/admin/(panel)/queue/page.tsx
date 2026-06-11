import type { Metadata } from "next";
import { buildQueue } from "@/lib/queue";
import { QueueBoard } from "@/components/QueueBoard";

export const metadata: Metadata = {
  title: "审核",
  robots: { index: false, follow: false },
};

// 每次请求都重读 published.md / READY.md —— 队列必须是实时的
export const dynamic = "force-dynamic";

export default function Queue() {
  const { items, summary } = buildQueue();
  const pendingItems = items.filter((i) => i.pendingCount > 0).length;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">④ 审核 · 全平台待发清单</h2>
        <p className="mt-1 text-sm text-muted">
          一页看完每篇 × 每平台还差什么。预览 → 点「发送」按钮发布
          → 回来「标记已发」。发送动作永远在人审之后。
        </p>
      </header>

      {/* 平台健康度 */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {summary.map((s) => {
          const pending = s.draft + s.scheduled + s.ready + s.none + s.other;
          return (
            <div
              key={s.platform}
              className="rounded-lg border border-line bg-white p-3"
            >
              <div className="text-sm font-bold text-ink">{s.platform}</div>
              <div className="mt-1 text-2xl font-bold text-ink">
                {pending}
                <span className="ml-1 text-xs font-normal text-muted">待处理</span>
              </div>
              <div className="mt-1 text-[11px] leading-4 text-muted">
                已发 {s.published} · 草稿 {s.draft} · 排期 {s.scheduled}
                <br />
                就绪 {s.ready} · 未动 {s.none} · 跳过 {s.skip}
              </div>
            </div>
          );
        })}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          {pendingItems} 篇有待办 / 共 {items.length} 篇
        </h3>
        <QueueBoard items={items} />
      </section>
    </div>
  );
}
