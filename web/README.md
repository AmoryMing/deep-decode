# 内容工厂 · Web

把内容工厂（`../output`、`../schedule`、`../skillgraph.yaml`）做成一个三合一 Web 应用：

| 板块 | 路由 | 访问 | 说明 |
|---|---|---|---|
| 内容门户 | `/`、`/post/[slug]` | 公开 | 全部深度拆解，文章 + 信息图 + 播客 + 视频 |
| 流程 | `/process` | 公开 | 三动词 + 技能图谱三层（读真实 `skillgraph.yaml`）|
| 运营后台 | `/admin` | 登录 | 排期 / 在写 / 待写 / 营收 Dashboard，仅本人可见 |

## 架构要点

- **Next.js 15（App Router）+ TypeScript + Tailwind v4**，全站 SSG。
- **媒体零部署**：图片 ~2.6G、音视频 ~0.5G 不进部署包。数据层 build 时只读 markdown 文本，把 `![](xx.png)` 重写成 **jsDelivr CDN**（图片/音频）/ **GitHub raw**（视频）地址，仓库已在 GitHub，零额外存储。
- **内容数据在仓库根**：`web/` 是子目录，`lib/` 用 `fs` 读上一级的 `output/` `schedule/`。`next.config.ts` 已把 `outputFileTracingRoot` 指向仓库根。
- **后台认证**：HMAC 签名 cookie（`lib/auth.ts`），`middleware.ts` 保护 `/admin`。默认 `muming` / `muming`。

## 分支说明（重要）

内容与媒体推送在**孤儿分支 `deploy`**，不是 `cleanup`/`main`。原因：`cleanup` 历史含 600MB+ 的大 commit，经国内代理推送会触发 GitHub HTTP 408 超时；`deploy` 用一连串小 commit 分批推送，可穿过波动的代理。

- Vercel 的 **Production Branch 必须设为 `deploy`**。
- CDN 默认指向 `@deploy`（见 `lib/cdn.ts`）。
- 内容更新后，把改动同步到 `deploy` 分支再分批推（脚本见下）。

## 本地开发

```bash
cd web
npm install
cp .env.example .env.local
npm run dev                  # http://localhost:3000
```

## 部署到 Vercel

1. 仓库已在 GitHub `AmoryMing/deep-decode`，内容在 `deploy` 分支。
2. Vercel → New Project → 选该仓库。
3. **Root Directory** 设为 `web`，开启 **Include source files outside of the Root Directory in the Build Step**。
4. **Production Branch** 设为 `deploy`（Settings → Git）。
5. Framework 自动识别 Next.js，保持默认。
6. **Environment Variables**：

   | 变量 | 值 |
   |---|---|
   | `ADMIN_USER` | `muming` |
   | `ADMIN_PASS` | `muming`（建议改强）|
   | `AUTH_SECRET` | 一段随机长字符串 |
   | `NEXT_PUBLIC_CDN_BASE` | `https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy` |
   | `NEXT_PUBLIC_RAW_BASE` | `https://raw.githubusercontent.com/AmoryMing/deep-decode/deploy` |

7. Deploy。

> 媒体走 jsDelivr `@deploy`，新文件 push 后首次访问触发缓存（约数秒）。媒体仍在分批推送时，已推的图片可见，未推的暂时 404，推完即补齐。

## 更新内容

```bash
# 把当前内容同步到 deploy 分支并分批推送
git checkout deploy
git checkout cleanup -- output schedule wiki skillgraph.yaml index.md web
# 然后分批 git add output/<目录> + commit + push（小批，穿过代理）
```
