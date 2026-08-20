# Agent Shift

为前端开发工程师设计的 24 周 AI Agent 工程师转型路线网站。

## 本地运行

```bash
npm install
npm run dev
```

## 检查与构建

```bash
npm run check
npm run build
```

## 部署

站点使用 Cloudflare Pages，并关联 GitHub 仓库的 `main` 分支。推送到 `main` 后，Cloudflare 会自动运行 `npm run build` 并发布 `dist` 目录。

也可以手动部署当前工作区：

```bash
npm run deploy
```

生产地址：<https://ai-learning.evanqhu.me>

学习进度保存在浏览器 `localStorage`，不会上传到服务器。
