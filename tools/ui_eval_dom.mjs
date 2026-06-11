// ui_eval_dom.mjs — 用 playwright 取「渲染后真实 DOM」的可见文本 + 动线信号。
// 解决 ui_eval.py 旧版盲区：客户端组件("use client")文本进 Next RSC <script> chunk，
// urllib+剥标签看不见。这里用浏览器 innerText，所见即用户所见。
// 输出 JSON 到 stdout：{ pages: {path: innerText}, flow: {...动线断言} }。
// storageState（登录 cookie）由 ui_eval.py 写到 /tmp/ui-critique/state.json。
import { chromium } from "playwright";

const PORT = process.env.UI_PORT || "3100";
const BASE = `http://localhost:${PORT}`;
const PATHS = ["/", "/admin", "/admin/setup", "/admin/discover", "/admin/produce",
  "/admin/runs", "/admin/queue", "/admin/analytics", "/admin/calendar"];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  storageState: "/tmp/ui-critique/state.json",
  viewport: { width: 1440, height: 900 },
});
const page = await ctx.newPage();
const pages = {};
for (const p of PATHS) {
  try {
    await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);
    pages[p] = await page.evaluate(() => document.body.innerText);
  } catch (e) {
    pages[p] = "";
  }
}

// 动线信号（DOM 结构断言，不真执行——便宜、可每轮跑）
const flow = {};
try {
  await page.goto(BASE + "/admin/queue", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1000);
  // 展开第一行看发布动作
  const firstRow = await page.$('div.overflow-hidden > div button');
  if (firstRow) { await firstRow.click(); await page.waitForTimeout(500); }
  flow.publish_button = await page.evaluate(() =>
    [...document.querySelectorAll("button,a")].some((b) =>
      /^(发送|发邮件|传公众号|一键发|发布)/.test((b.textContent || "").trim())));
  // 终端命令是否「默认可见」（坏）——折叠进 <details> 的高级 fallback 不算（可接受）。
  flow.terminal_visible = await page.evaluate(() => {
    const isTerm = (t) => /python3|\.py --send|cd output\//.test(t || "");
    return [...document.querySelectorAll("code, pre")].some((el) => {
      if (!isTerm(el.textContent)) return false;
      // 在某个 closed <details> 里 = 不算默认可见
      let n = el;
      while (n) {
        if (n.tagName === "DETAILS" && !n.open) return false;
        n = n.parentElement;
      }
      return true; // 终端命令默认就摆在外面
    });
  });
} catch (e) { flow.error = String(e).slice(0, 80); }
try {
  await page.goto(BASE + "/admin/discover", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1000);
  flow.discover_oneclick_create = await page.evaluate(() =>
    [...document.querySelectorAll("button,a")].some((b) =>
      /建项目/.test((b.textContent || "").trim())));
} catch (e) { /* ignore */ }
try {
  await page.goto(BASE + "/admin/produce", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1000);
  // 产出页"待确认"能否就地确认（不跨页）——看有无确认按钮
  flow.inline_confirm = await page.evaluate(() =>
    [...document.querySelectorAll("button")].some((b) =>
      /确认|按这个写|查看策略|策略草案|草案/.test((b.textContent || "").trim())));
} catch (e) { /* ignore */ }

// F 内容呈现/降噪
const content = {};
try {
  // 图文混排：随便找一篇有图的成品看正文里有没有配图
  await page.goto(BASE + "/post/2026-06-10-content-factory-demo", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1500);
  content.post_figures = await page.evaluate(() =>
    document.querySelectorAll(".prose-article img, article figure img").length);
} catch (e) { content.post_figures = 0; }
try {
  await page.goto(BASE + "/admin/produce", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1200);
  // slug→标题：进度卡主行是否还在裸用 2026-..-slug（坏）vs 显示中文标题
  content.produce_shows_slug = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("section a, section .font-mono")]
      .map((e) => (e.textContent || "").trim()).filter(Boolean);
    const slugLike = rows.filter((t) => /^20\d{2}-\d{2}-\d{2}-[a-z]/.test(t)).length;
    return slugLike >= 3; // 还有≥3 行裸 slug = 没换标题
  });
} catch (e) { content.produce_shows_slug = true; }
try {
  await page.goto(BASE + "/admin/queue", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1200);
  // 队列降噪：默认是否把上百行历史全摊出来
  content.queue_rows_default = await page.evaluate(() =>
    document.querySelectorAll('div.overflow-hidden > div').length);
} catch (e) { content.queue_rows_default = 999; }

await browser.close();
process.stdout.write(JSON.stringify({ pages, flow, content }));
