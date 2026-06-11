"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import type { CellStatus, Platform, QueueItem } from "@/lib/queue";
import { markPublished, type MarkState } from "@/app/admin/(panel)/queue/actions";
import { SendButton } from "./SendButton";

const STATUS_LABEL: Record<CellStatus, string> = {
  published: "已发",
  draft: "草稿待发",
  scheduled: "已排期",
  ready: "素材就绪",
  none: "未动",
  skip: "跳过",
  other: "其他",
};

// 状态色语义固定：amber=等人动手 / sky=已排期 / ink=已完成 / 灰=未动或跳过（非错误）
const STATUS_CHIP: Record<CellStatus, string> = {
  published: "bg-ink/90 text-paper",
  draft: "bg-amber-100 text-amber-900 border border-amber-300",
  scheduled: "bg-sky-100 text-sky-900 border border-sky-300",
  ready: "bg-amber-50 text-amber-800 border border-amber-200",
  none: "bg-white text-muted border border-line border-dashed",
  skip: "bg-line/40 text-muted line-through",
  other: "bg-paper text-ink-soft border border-line",
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="shrink-0 rounded border border-line bg-white px-2 py-0.5 text-[11px] text-ink-soft hover:bg-paper"
    >
      {copied ? "已复制 ✓" : "复制命令"}
    </button>
  );
}

function MarkForm({ slug, platform }: { slug: string; platform: Platform }) {
  const [state, action, pending] = useActionState<MarkState, FormData>(
    markPublished,
    { ok: true, message: "" },
  );
  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="platform" value={platform} />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-ink px-2 py-0.5 text-[11px] text-paper hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "写入中…" : "标记已发(今天)"}
      </button>
      {state.message && (
        <span
          className={`text-[11px] ${state.ok ? "text-muted" : "text-red-700"}`}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}

export function QueueBoard({ items }: { items: QueueItem[] }) {
  // 默认只看「真正待发」——有草稿/已排期/素材就绪。纯「未动」的历史不默认摊开（降噪）。
  const [actionableOnly, setActionableOnly] = useState(true);
  const [platform, setPlatform] = useState<Platform | "全部">("全部");
  const [open, setOpen] = useState<string | null>(null);

  const [showAll, setShowAll] = useState(false);
  const CAP = 30; // 默认最多 30 行，避免上百行历史糊脸
  const isActionable = (it: QueueItem) =>
    it.cells.some((c) => ["draft", "scheduled", "ready"].includes(c.status));

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        if (actionableOnly && !isActionable(it)) return false;
        if (platform === "全部") return true;
        const c = it.cells.find((x) => x.platform === platform);
        return (
          !!c && c.status !== "published" && c.status !== "skip"
        );
      }),
    [items, actionableOnly, platform],
  );
  const shown = showAll ? filtered : filtered.slice(0, CAP);
  const hiddenCount = filtered.length - shown.length;

  const platforms = ["全部", "邮件", "公众号", "小红书", "视频号", "抖音"] as const;

  return (
    <div className="flex flex-col gap-3">
      {/* 过滤器 */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="inline-flex items-center gap-1.5 text-ink-soft">
          <input
            type="checkbox"
            checked={actionableOnly}
            onChange={(e) => setActionableOnly(e.target.checked)}
          />
          只看真正待发（藏未动历史）
        </label>
        <span className="text-line">|</span>
        {platforms.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p as Platform | "全部")}
            className={`rounded px-2 py-0.5 text-xs ${
              platform === p
                ? "bg-ink text-paper"
                : "bg-line/40 text-ink-soft hover:bg-line"
            }`}
          >
            {p}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted">{shown.length} 行</span>
      </div>

      {/* 清单 */}
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        {shown.map((it, idx) => {
          const expanded = open === it.slug;
          return (
            <div
              key={it.slug}
              className={idx > 0 ? "border-t border-line/60" : ""}
            >
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : it.slug)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-paper"
              >
                <span className="w-40 shrink-0 truncate font-mono text-xs text-muted">
                  {it.slug}
                </span>
                <span className="flex min-w-0 flex-1 flex-wrap gap-1">
                  {it.cells.map((c) => (
                    <span
                      key={c.platform}
                      title={c.raw || STATUS_LABEL[c.status]}
                      className={`inline-flex h-5 items-center rounded px-1.5 text-[11px] ${STATUS_CHIP[c.status]}`}
                    >
                      {c.platform} · {STATUS_LABEL[c.status]}
                    </span>
                  ))}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {it.pendingCount > 0 ? `${it.pendingCount} 待办` : "完结"}
                  <span className="ml-2">{expanded ? "▲" : "▼"}</span>
                </span>
              </button>

              {expanded && (
                <div className="flex flex-col gap-3 border-t border-line/40 bg-paper/60 px-4 py-3">
                  {/* 预览入口 */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {it.hasArticle && (
                      <Link
                        href={`/post/${it.slug}`}
                        target="_blank"
                        className="rounded border border-line bg-white px-2 py-0.5 text-ink-soft hover:bg-paper"
                      >
                        文章预览 ↗
                      </Link>
                    )}
                    {it.hasEmailPreview && (
                      <a
                        href={`/api/media/output/${it.slug}/email_preview.html`}
                        target="_blank"
                        className="rounded border border-line bg-white px-2 py-0.5 text-ink-soft hover:bg-paper"
                      >
                        邮件预览 ↗
                      </a>
                    )}
                    {it.hasReady && (
                      <a
                        href={`/api/media/output/${it.slug}/READY.md`}
                        target="_blank"
                        className="rounded border border-line bg-white px-2 py-0.5 text-ink-soft hover:bg-paper"
                      >
                        READY.md ↗
                      </a>
                    )}
                    {it.hasPodcast && (
                      <a
                        href={`/api/media/output/${it.slug}/podcast.mp3`}
                        target="_blank"
                        className="rounded border border-line bg-white px-2 py-0.5 text-ink-soft hover:bg-paper"
                      >
                        播客 ▶
                      </a>
                    )}
                    {it.hasVideo && (
                      <a
                        href={`/api/media/output/${it.slug}/video.mp4`}
                        target="_blank"
                        className="rounded border border-line bg-white px-2 py-0.5 text-ink-soft hover:bg-paper"
                      >
                        视频 ▶
                      </a>
                    )}
                    <span className="self-center text-muted">
                      {it.produced && `生产完成：${it.produced}`}
                    </span>
                  </div>

                  {/* 每平台待办 */}
                  {it.cells
                    .filter(
                      (c) => c.status !== "published" && c.status !== "skip",
                    )
                    .map((c) => (
                      <div
                        key={c.platform}
                        className="flex flex-col gap-1.5 rounded border border-line/60 bg-white p-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-5 items-center rounded px-1.5 text-[11px] ${STATUS_CHIP[c.status]}`}
                          >
                            {c.platform} · {STATUS_LABEL[c.status]}
                          </span>
                          {c.raw && (
                            <span className="truncate text-xs text-muted">
                              {c.raw}
                            </span>
                          )}
                          <span className="ml-auto flex items-center gap-2">
                            <SendButton slug={it.slug} platform={c.platform} />
                            <MarkForm slug={it.slug} platform={c.platform} />
                          </span>
                        </div>
                        {c.nextStep && (
                          <details className="text-[11px] text-muted">
                            <summary className="cursor-pointer select-none">
                              高级：手动命令
                            </summary>
                            <div className="mt-1 flex items-start gap-2">
                              <code className="min-w-0 flex-1 whitespace-pre-wrap break-all rounded bg-paper px-2 py-1 font-mono text-ink-soft">
                                {c.nextStep}
                              </code>
                              <CopyBtn text={c.nextStep} />
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
        {shown.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted">
            没有匹配的行——要么真清零了，要么把过滤器放宽。
          </div>
        )}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="w-full border-t border-line/60 px-4 py-2.5 text-center text-xs text-muted hover:bg-paper"
          >
            还有 {hiddenCount} 篇历史 · 点开看全部
          </button>
        )}
      </div>
    </div>
  );
}
