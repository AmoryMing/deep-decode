import { getAllPosts, getAllTags, getFactoryStats } from "@/lib/content";
import { PostExplorer } from "@/components/PostExplorer";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const stats = getFactoryStats();

  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="border-b border-line py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          把一篇文章
          <span className="text-accent">拆到底</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
          AI 大厂的官方博客、arXiv 论文、顶级个人推文——每篇拆成观点密度极高的解读，
          配信息图、播客与视频。评论员视角，每个判断都有证据。
        </p>
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <Stat n={stats.total} label="篇拆解" />
          <Stat n={stats.withPodcast} label="期播客" />
          <Stat n={stats.withVideo} label="条视频" />
          <Stat n={stats.totalImages} label="张配图" />
          <Stat n={stats.tags} label="个标签" />
        </dl>
      </section>

      <section className="py-10">
        <PostExplorer posts={posts} tags={tags} />
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl font-bold tabular-nums text-ink">{n}</span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
