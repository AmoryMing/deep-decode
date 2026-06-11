import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import matter from "gray-matter";

marked.setOptions({ gfm: true, async: false });

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node export-pdf.mjs <slug>");
  process.exit(1);
}
const repo = path.resolve(process.cwd(), "..");
const dir = path.join(repo, "output", slug);
const { data, content } = matter(
  fs.readFileSync(path.join(dir, "article.md"), "utf8"),
);
const body = marked.parse(content);

const html = `<!doctype html><html lang="zh"><head><meta charset="utf-8">
<style>
@page { margin: 1.4cm; }
body { font-family: -apple-system, "PingFang SC", "Hiragino Sans GB", sans-serif;
  max-width: 740px; margin: 0 auto; line-height: 1.85; color: #18181b; font-size: 15px; }
h1 { font-size: 25px; line-height: 1.3; margin: 0 0 6px; }
.meta { color: #71717a; font-size: 12px; margin-bottom: 28px; border-bottom: 1px solid #e4e4e7; padding-bottom: 14px; word-break: break-all; }
h2 { font-size: 19px; border-top: 2px solid #18181b; padding-top: 8px; display: inline-block; margin: 30px 0 12px; }
h3 { font-size: 16px; margin: 22px 0 8px; }
p { margin: 12px 0; }
img { max-width: 100%; height: auto; border: 1px solid #e4e4e7; border-radius: 8px; margin: 18px 0; display: block; break-inside: avoid; }
a { color: #d4541e; text-decoration: none; }
strong { color: #000; }
blockquote { border-left: 3px solid #d4541e; padding-left: 14px; color: #52525b; margin: 16px 0; }
code { background: #f4f4f5; padding: 2px 5px; border-radius: 4px; font-size: .9em; }
pre { background: #18181b; color: #e4e4e7; padding: 14px; border-radius: 8px; overflow: auto; break-inside: avoid; }
pre code { background: none; color: inherit; }
table { border-collapse: collapse; width: 100%; font-size: 13px; margin: 16px 0; }
td, th { border: 1px solid #e4e4e7; padding: 6px 9px; text-align: left; }
th { background: #f4f4f5; }
</style></head><body>
<h1>${data.title || slug}</h1>
<div class="meta">${data.author ? data.author + " · " : ""}${data.date || ""}${data.source ? " · 原文 " + data.source : ""}</div>
${body}
</body></html>`;

const out = path.join(dir, "_export.html");
fs.writeFileSync(out, html);
console.log(out);
