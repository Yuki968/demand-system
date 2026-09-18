# Demand System · GitHub Pages 只读展示版

这是需求可视化系统的静态只读展示版，保留需求看板、需求列表、状态与阶段展示、筛选、搜索和详情查看功能。

访问地址：[https://yuki968.github.io/demand-system/](https://yuki968.github.io/demand-system/)

## 展示版特性

- Next.js 16 App Router 静态导出
- 演示数据来自 `data/requirements.json`
- 不使用 Prisma、SQLite、Server Actions、API Route 或 Node.js 服务端
- 首页和 `/board/` 均可查看需求看板
- 每条需求的详情页在构建阶段静态生成
- 支持 GitHub Pages 子路径、尾部斜杠、静态资源和刷新访问

## 本地运行

安装依赖并启动开发环境：

```bash
npm ci
npm run dev
```

生成 GitHub Pages 静态文件：

```bash
npm run build
```

构建成功后，完整站点位于 `out/`。

## 更新演示数据

直接编辑 `data/requirements.json`。数据结构由 `types/requirement.ts` 中的 `RequirementRecord` 定义。新增需求后，Next.js 会在下一次构建时自动为它生成 `/board/{id}/` 详情页。

## 自动部署

`.github/workflows/deploy-pages.yml` 会在 `main` 分支更新后执行以下流程：

1. 安装锁定版本的依赖；
2. 执行 `npm run build`；
3. 上传 `out/`；
4. 发布到 GitHub Pages。

工作流会在仓库尚未启用 Pages 时尝试自动启用，并使用 **GitHub Actions** 作为发布来源。

## 数据库版本保留说明

原 Prisma、SQLite、管理端和写入 API 的源码仍可从本仓库历史恢复；完整的后续数据库版本也保留在 `mysql-migration` 分支。当前 `main` 分支只负责可公开部署的只读展示版，避免 GitHub Pages 构建产物依赖任何数据库或服务端能力。
