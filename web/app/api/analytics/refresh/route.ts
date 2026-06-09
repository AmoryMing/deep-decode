import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "@/lib/repo";

/**
 * 数据拉取接口（XHS / 微信公众号）。
 *
 * 真实拉取需要凭证：
 *   - XHS_COOKIE        小红书登录 cookie（创作者后台 / Spider_XHS 同款）
 *   - WX_ACCESS_TOKEN   公众号 access_token（数据分析接口）
 * 配置后这里拉取粉丝/阅读/点赞写入 schedule/analytics.json，前台即展示实数。
 * 未配置时返回明确提示，闭环仍可用派生数据跑通。
 */
export async function POST() {
  const xhsCookie = process.env.XHS_COOKIE;
  const wxToken = process.env.WX_ACCESS_TOKEN;
  const configured = { xhs: Boolean(xhsCookie), wechat: Boolean(wxToken) };

  if (!configured.xhs && !configured.wechat) {
    return NextResponse.json({
      ok: false,
      configured,
      message:
        "数据源未配置。设置环境变量 XHS_COOKIE / WX_ACCESS_TOKEN 后可自动拉取小红书 / 公众号运营数据。当前展示的是从发布量 + 营收派生的数据。",
    });
  }

  const platforms: Record<string, unknown>[] = [];
  const errors: string[] = [];

  // —— 小红书 ——（接 Spider_XHS 本地签名 API / 创作者后台数据接口）
  if (configured.xhs) {
    try {
      // TODO: 调用 XHS 数据接口，解析粉丝 / 笔记曝光 / 点赞收藏
      // const res = await fetch("http://127.0.0.1:5005/api/.../stats", { headers: { cookie: xhsCookie! } });
      platforms.push({
        platform: "小红书",
        note: "已配置 cookie，待接入笔记数据接口",
      });
    } catch (e) {
      errors.push(`xhs: ${String(e)}`);
    }
  }

  // —— 公众号 ——（datacube 接口：getusersummary / getarticletotal）
  if (configured.wechat) {
    try {
      // TODO: 调用公众号 datacube 接口
      platforms.push({
        platform: "公众号",
        note: "已配置 token，待接入 datacube 接口",
      });
    } catch (e) {
      errors.push(`wechat: ${String(e)}`);
    }
  }

  // 持久化（部分平台）
  try {
    const f = path.join(repoRoot(), "schedule", "analytics.json");
    fs.writeFileSync(
      f,
      JSON.stringify({ updatedAt: new Date().toISOString(), platforms }, null, 2),
    );
  } catch (e) {
    errors.push(`write: ${String(e)}`);
  }

  return NextResponse.json({ ok: true, configured, platforms, errors });
}
