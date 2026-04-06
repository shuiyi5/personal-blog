# personal-blog

探索 AI 产品的边界，记录从 0 到 1 的思考。

基于 Next.js + Notion 构建的中英双语个人博客，内容管理完全依托 Notion 数据库，部署于 Vercel。

**在线地址：** https://sentoe.vercel.app

---

## 技术栈

- **框架：** Next.js 16 + React 19
- **样式：** Tailwind CSS 4
- **内容：** Notion API（文章、项目、图库）
- **代码高亮：** Shiki
- **部署：** Vercel
- **统计：** Umami（可选）

---

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/shuiyi5/personal-blog.git
cd personal-blog
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

在 `.env.local` 中填入以下内容：

```env
NOTION_API_KEY=          # Notion Integration Secret
NOTION_POSTS_DB_ID=      # 文章数据库 ID
NOTION_PROJECTS_DB_ID=   # 项目数据库 ID
NOTION_GALLERY_DB_ID=    # 图库数据库 ID
```

> 详细的 Notion 数据库配置步骤见 [.env.example](./.env.example)

### 3. 本地开发

```bash
pnpm dev
```

访问 http://localhost:3000

---

## Notion 数据库结构

### 文章数据库（Posts）

| 字段 | 类型 | 说明 |
|------|------|------|
| Title | title | 文章标题 |
| Slug | text | URL 路径，如 `gpt-product-analysis` |
| Language | select | `zh` 或 `en` |
| Status | select | `Draft` 或 `Published` |
| Category | select | 文章分类 |
| Tags | multi-select | 标签 |
| Summary | text | 摘要，不超过 120 字 |
| Date | date | 发布日期 |
| Cover | files | 封面图 |

### 项目数据库（Projects）

| 字段 | 类型 | 说明 |
|------|------|------|
| Name | title | 项目名称 |
| Description | text | 一行描述 |
| Language | select | `zh` 或 `en` |
| Role | text | 担任角色 |
| Tags | multi-select | 技术/工具标签 |
| Cover | files | 封面图 |
| Link | url | Demo 地址 |
| GitHub | url | 仓库地址 |
| Order | number | 排序（1, 2, 3...） |

---

## 部署

推荐部署到 Vercel：

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 填入环境变量
4. 部署完成

---

## License

MIT
