"use client";

import { useMemo, useState } from "react";
import { PostCard } from "./PostCard";
import type { PostMeta } from "@/lib/content";

export function PostExplorer({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
}) {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (needle) {
        const hay = `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${
          p.author ?? ""
        }`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [posts, q, activeTag]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索标题、标签、作者…"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-ink"
        />
        <div className="flex flex-wrap gap-1.5">
          <Chip active={activeTag === null} onClick={() => setActiveTag(null)}>
            全部 {posts.length}
          </Chip>
          {tags.slice(0, 20).map((t) => (
            <Chip
              key={t.tag}
              active={activeTag === t.tag}
              onClick={() =>
                setActiveTag(activeTag === t.tag ? null : t.tag)
              }
            >
              {t.tag} {t.count}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mb-4 text-xs text-muted">共 {filtered.length} 篇</p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">没有匹配的拆解。</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-white text-ink-soft hover:border-ink/40"
      }`}
    >
      {children}
    </button>
  );
}
