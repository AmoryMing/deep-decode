import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSlugs, getPost } from "@/lib/content";
import { PostMedia } from "@/components/PostMedia";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

function fmtDate(d: string): string {
  const m = d.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]} 年 ${m[2]} 月 ${m[3]} 日` : d;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-10">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← 全部拆解
      </Link>

      <header className="mb-6 mt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          <time>{fmtDate(post.date)}</time>
          {post.author && <span>· {post.author}</span>}
          {post.type && (
            <span className="rounded bg-line/70 px-1.5 py-0.5 uppercase tracking-wide">
              {post.type}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink">
          {post.title}
        </h1>
        {post.source && (
          <p className="mt-3 text-sm">
            <span className="text-muted">原文：</span>
            <a
              href={post.source}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-accent underline underline-offset-2"
            >
              {post.source}
            </a>
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <PostMedia
        podcast={post.podcast}
        videoH={post.videoH}
        videoV={post.videoV}
      />

      <div
        className="prose-article"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <footer className="mt-12 border-t border-line pt-6">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          ← 回到全部拆解
        </Link>
      </footer>
    </article>
  );
}
