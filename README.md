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

站点使用 Cloudflare Workers Static Assets，并通过 `wrangler.jsonc` 绑定 `ai-learning.evanqhu.me`。

```bash
npm run deploy
```

学习进度保存在浏览器 `localStorage`，不会上传到服务器。
