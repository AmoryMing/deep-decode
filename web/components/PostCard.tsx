import Link from "next/link";
import type { PostMeta } from "@/lib/content";

function fmtDate(d: string): string {
  const m = d.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : d;
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-line/40">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col justify-between bg-ink p-4 text-paper">
            <span className="text-[10px] uppercase tracking-widest text-paper/50">
              DEEP DECODE
            </span>
            <span className="line-clamp-3 text-base font-bold leading-snug">
              {post.title}
            </span>
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          {post.hasPodcast && <Badge>播客</Badge>}
          {post.hasVideo && <Badge>视频</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center gap-2 text-xs text-muted">
          <time>{fmtDate(post.date)}</time>
          {post.type && (
            <span className="rounded bg-line/70 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
              {post.type}
            </span>
          )}
        </div>
        <h3 className="mb-2 text-[15px] font-bold leading-snug text-ink group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {post.excerpt}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-paper backdrop-blur">
      {children}
    </span>
  );
}
