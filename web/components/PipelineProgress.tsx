import Link from "next/link";
import type { ProjectState } from "@/lib/projectState";
import { StartRunButton } from "./StartRunButton";
import { ConfirmStrategyButton } from "./ConfirmStrategyButton";

const LAYER_LABEL: Record<string, string> = {
  molecule: "m",
  atom: "a",
  compound: "C",
};

/** 单个项目的节点级进度条 —— 数据来自 runner，不是 web 自算。 */
export function PipelineProgress({ state }: { state: ProjectState }) {
  const { done, total } = state.progress;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/post/${state.slug}`}
          className="min-w-0 flex-1 truncate font-mono text-xs text-ink hover:underline"
        >
          {state.slug}
        </Link>
        <span className="shrink-0 text-xs text-muted">
          {state.content_type} · {state.reader}
          {state.ready_to_distribute ? (
            <span className="ml-2 rounded bg-ink/90 px-1.5 py-0.5 text-paper">
              可分发
            </span>
          ) : !state.confirmed ? (
            <span className="ml-2 rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-amber-900">
              待确认 Strategy
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
              title={`${n.title} — ${n.status}`}
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
          <span className="rounded bg-paper px-1.5 py-0.5 font-mono text-ink-soft">
            [{LAYER_LABEL[state.next.id.split(".")[0]] ?? "·"}] {state.next.id}
          </span>
          <span className="min-w-0 flex-1 truncate text-ink-soft">
            {state.next.title}
          </span>
          {state.next.hard_stop && (
            <span className="shrink-0 rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-amber-900">
              硬停
            </span>
          )}
        </div>
      )}
    </div>
  );
}
