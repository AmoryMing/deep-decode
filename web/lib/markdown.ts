import { marked } from "marked";
import { cdnUrl } from "./cdn";

marked.setOptions({ gfm: true, breaks: false, async: false });

/**
 * 把正文里相对的图片引用重写成 CDN 绝对地址，再渲染为 HTML。
 * 形如 ![alt](00_系列封面.png) → ![alt](https://cdn.jsdelivr.net/.../output/<slug>/00_系列封面.png)
 * 已是 http(s)/data 的不动。
 */
export function rewriteAndRender(md: string, slug: string): string {
  const rewritten = md.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (whole, alt: string, src: string) => {
      const s = src.trim();
      if (/^(https?:|data:|\/\/)/.test(s)) return whole;
      const clean = s.replace(/^\.\//, "");
      return `![${alt}](${cdnUrl(`output/${slug}/${clean}`)})`;
    },
  );
  return marked.parse(rewritten) as string;
}
