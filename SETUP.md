# 🚀 Firefly 博客部署指南 — 零代码版

## 你需要准备

| 项目 | 说明 |
|------|------|
| **GitHub 账号** | 已有：131huahua |
| **Vercel 账号** | 用 GitHub 登录 https://vercel.com |
| **一个域名**（可选） | 也可以用 Vercel 送的 `xxx.vercel.app` |

---

## 第一步：创建 GitHub OAuth App（5 分钟）

这用于 CMS 后台登录鉴权。

1. 打开 https://github.com/settings/developers
2. 点击 **New OAuth App**
3. 填写：
   - **Application name**: `我的博客 CMS`
   - **Homepage URL**: `https://YOUR_SITE.vercel.app`（先随便填，部署后回来改）
   - **Authorization callback URL**: `https://YOUR_SITE.vercel.app/api/callback`
4. 点击 **Register application**
5. 点击 **Generate a new client secret**，复制保存：
   - `Client ID`（公开）
   - `Client Secret`（保密，只显示一次！）

---

## 第二步：部署到 Vercel（3 分钟）

1. 打开 https://vercel.com/new
2. 导入你的 GitHub 仓库 `131huahua/firefly-blog`
3. **环境变量** → 添加两个：
   | Key | Value |
   |-----|-------|
   | `GITHUB_CLIENT_ID` | 第一步的 Client ID |
   | `GITHUB_CLIENT_SECRET` | 第一步的 Client Secret |
4. 点击 **Deploy**
5. 等待部署完成（约 2 分钟）

---

## 第三步：配置（2 分钟）

1. 部署完成后，你会得到一个 `xxx.vercel.app` 域名
2. 回到 GitHub OAuth App 设置页面，更新：
   - **Homepage URL** → `https://xxx.vercel.app`
   - **Authorization callback URL** → `https://xxx.vercel.app/api/callback`
3. 在代码中更新 `public/admin/config.yml`，把 `YOUR_SITE.vercel.app` 改成实际域名
4. 重新 push，Vercel 自动重新部署

---

## 第四步：开始写博客！

1. 打开 `https://你的域名/admin/`
2. 点击 **Login with GitHub** → 授权
3. 进入管理后台，可以：
   - 📝 **写文章** — 富文本 Markdown 编辑器
   - 📄 **管理页面** — 关于、友链、留言板
   - 💬 **发动态** — 碎碎念/说说
   - ⚙️ **站点设置** — 改名字、头像、链接
   - 🖼️ **上传图片** — 拖拽上传，自动存到图床
4. 写完点 **发布** → 自动 commit 到 GitHub → Vercel 自动部署上线 ✅

---

## 常用命令

```bash
# 本地开发预览
pnpm dev

# 构建
pnpm build

# 创建新文章（命令行方式）
pnpm new-post my-post

# 发一条动态（命令行方式）
pnpm new-d "今天天气不错"
```

---

## 目录结构

```
firefly-blog/
├── src/
│   ├── content/
│   │   ├── posts/       ← CMS 管理的文章
│   │   ├── spec/        ← CMS 管理的独立页面
│   │   ├── dynamic/     ← CMS 管理的动态
│   │   └── settings/    ← CMS 管理的站点设置
│   └── config/          ← Firefly 原始配置文件
├── public/
│   ├── admin/           ← CMS 管理后台
│   └── assets/images/   ← CMS 上传的图片
├── api/                 ← OAuth 授权接口
└── vercel.json          ← Vercel 部署配置
```

---

## 进阶

- **自定义域名**: Vercel → Settings → Domains → 添加你的域名
- **修改主题色**: 编辑 `src/config/siteConfig.ts` 中的 `themeColor.hue`
- **更多功能**: 查看 [Firefly 使用文档](https://docs-firefly.cuteleaf.cn/)
