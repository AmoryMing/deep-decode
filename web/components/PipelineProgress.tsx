import Link from "next/link";
import type { ProjectState } from "@/lib/projectState";
import { StartRunButton } from "./StartRunButton";
import { ConfirmStrategyButton } from "./ConfirmStrategyButton";
import { nodeLabel, humanize } from "@/lib/nodeLabels";

/** 单个项目的节点级进度条 —— 数据来自自动流水线，不是 web 自算。 */
export function PipelineProgress({ state }: { state: ProjectState }) {
  const { done, total } = state.progress;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/post/${state.slug}`}
          title={state.slug}
          className="min-w-0 flex-1 truncate text-sm text-ink hover:underline"
        >
          {state.title ||
            state.slug.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/-/g, " ")}
        </Link>
        <span className="shrink-0 text-xs text-muted">
          {state.content_type} · {state.reader}
          {state.ready_to_distribute ? (
            <span className="ml-2 rounded bg-ink/90 px-1.5 py-0.5 text-paper">
              可分发
            </span>
          ) : !state.confirmed ? (
            <span className="ml-2 rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-amber-900">
              等你拍板
            </span>
          ) : null}
        </span>
      </div>

      {/* 进度条：每节点一格，done=实心 */}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-line/50">
          {state.nodes.map((n) => (
            <span
              key={n.id}
              title={`${humanize(n.title)} — ${n.status === "done" ? "已完成" : n.blocked ? "等你处理" : "待办"}`}
              className={`h-full flex-1 border-r border-white/60 last:border-0 ${
                n.status === "done"
                  ? "bg-ink/85"
                  : n.blocked
                    ? "bg-transparent"
                    : "bg-amber-300"
              }`}
            />
          ))}
        </div>
        <span className="shrink-0 font-mono text-xs text-muted">
          {done}/{total} · {pct}%
        </span>
        {!state.ready_to_distribute && (
          <span className="shrink-0">
            {state.confirmed ? (
              <StartRunButton slug={state.slug} />
            ) : (
              <ConfirmStrategyButton slug={state.slug} />
            )}
          </span>
        )}
      </div>

      {/* 当前卡在哪 */}
      {state.next && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-muted">下一步</span>
          <span className="rounded bg-paper px-1.5 py-0.5 text-ink-soft">
            {nodeLabel(state.next.id)}
          </span>
          <span className="min-w-0 flex-1 truncate text-ink-soft">
            {humanize(state.next.title)}
          </span>
          {state.next.hard_stop && (
            <span className="shrink-0 rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-amber-900">
              等你拍板
            </span>
          )}
        </div>
      )}
    </div>
  );
}
