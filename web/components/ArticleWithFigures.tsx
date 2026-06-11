/**
 * ArticleWithFigures — 把成品配图回插正文（critique 硬伤：文章页是纯文本墙）。
 * 封面置顶，其余按章（<h2> 边界）交错插入。文章本身不含 ![]，图来自 output/<slug>/ 资产。
 * 服务端组件：纯字符串切分 + 渲染，无客户端开销。
 */

function isFigure(url: string): boolean {
  return /\.(png|jpe?g|webp)$/i.test(url); // svg 信息图也可，但优先位图避免与 png 重复
}

export function ArticleWithFigures({
  html,
  images,
  title,
}: {
  html: string;
  images: string[];
  title: string;
}) {
  const figs = images.filter(isFigure);
  // 封面：文件名带 cover/00 的优先，否则第一张
  const coverIdx = figs.findIndex((u) => /cover|\/0*0[._]/i.test(u));
  const cover = coverIdx >= 0 ? figs[coverIdx] : figs[0];
  const sectionImgs = figs.filter((u) => u !== cover);

  // 按 <h2 切成 [引言, 段1, 段2, …]
  const parts = html.split(/(?=<h2)/);
  const intro = parts[0] || "";
  const sections = parts.slice(1);

  const Figure = ({ src, idx }: { src: string; idx: number }) => (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${title} 配图 ${idx + 1}`}
        loading="lazy"
        className="w-full rounded-lg border border-line"
      />
    </figure>
  );

  return (
    <div className="prose-article">
      {cover && <Figure src={cover} idx={0} />}
      {intro && <div dangerouslySetInnerHTML={{ __html: intro }} />}
      {sections.map((sec, i) => (
        <div key={i}>
          <div dangerouslySetInnerHTML={{ __html: sec }} />
          {sectionImgs[i] && <Figure src={sectionImgs[i]} idx={i + 1} />}
        </div>
      ))}
      {/* 章节用完后还剩的图，补在文末 */}
      {sectionImgs.slice(sections.length).map((src, i) => (
        <Figure key={`extra-${i}`} src={src} idx={sections.length + i + 1} />
      ))}
    </div>
  );
}
