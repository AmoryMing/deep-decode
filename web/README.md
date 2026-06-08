# 内容工厂 · Web

把内容工厂（`../output`、`../schedule`、`../skillgraph.yaml`）做成一个三合一 Web 应用：

| 板块 | 路由 | 访问 | 说明 |
|---|---|---|---|
| 内容门户 | `/`、`/post/[slug]` | 公开 | 全部深度拆解，文章 + 信息图 + 播客 + 视频 |
| 流程 | `/process` | 公开 | 三动词 + 技能图谱三层（读真实 `skillgraph.yaml`）|
| 运营后台 | `/admin` | 登录 | 排期 / 在写 / 待写 / 营收 Dashboard，仅本人可见 |

## 架构要点

- **Next.js 15（App Router）+ TypeScript + Tailwind v4**，全站 SSG。
- **媒体零部署**：图片 ~2.4G、音视频 ~2.2G 不进部署包。数据层在 build 时只读 markdown 文本，把 `![](xx.png)` 重写成 **jsDelivr CDN**（图片/音频）/ **GitHub raw**（视频）地址，仓库已在 GitHub，零额外存储。
- **内容数据在仓库根**：`web/` 是子目录，`lib/` 用 `fs` 读上一级的 `output/` `schedule/`。`next.config.ts` 已把 `outputFileTracingRoot` 指向仓库根。
- **后台认证**：HMAC 签名 cookie（`lib/auth.ts`），`middleware.ts` 保护 `/admin`。默认 `muming` / `muming`。

## 本地开发

```bash
cd web
npm install
cp .env.example .env.local   # 可改后台密码 / 锁定 CDN 分支
npm run dev                  # http://localhost:3000
```

## 部署到 Vercel

1. 把整个仓库（含 `web/`）push 到 GitHub `AmoryMing/deep-decode`。
2. Vercel → New Project → 选该仓库。
3. **Root Directory** 设为 `web`，并开启 **Include source files outside of the Root Directory in the Build Step**（让 build 能读 `../output`）。
4. Framework 自动识别为 Next.js，保持默认 build 命令。
5. **Environment Variables**：

   | 变量 | 值 |
   |---|---|
   | `ADMIN_USER` | `muming` |
   | `ADMIN_PASS` | `muming`（建议改强）|
   | `AUTH_SECRET` | 一段随机长字符串 |
   | `NEXT_PUBLIC_CDN_BASE` | `https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@main` |
   | `NEXT_PUBLIC_RAW_BASE` | `https://raw.githubusercontent.com/AmoryMing/deep-decode/main` |

6. Deploy。

> CDN 取的是 GitHub `@main` 分支的内容。新内容须先 push 到 main，jsDelivr 才能拉到（首次访问会触发缓存，约数秒）。要预览未合并分支，把 `@main` 换成 `@<分支名>` 或 `@<commit-sha>`。

## 更新内容

内容更新（新拆解、改排期）后 `git push`，Vercel 自动重新构建即可刷新站点与后台数据。
