# 比特幣中文部落格網站 - 後台管理系統文檔

## Resources
- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **CSS**: Tailwind CSS, Tailwind
- **DB**: Supabase
- **Deploy**: Vercel

## 開發環境設定

### Installation

#### pnpm(Recommanded)
```bash
pnpm install
```

#### or npm
```bash
npm install
```

#### or yarn
```bash
yarn
```

### env var
建立 `.env.local` 檔案並設定以下變數：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Hot-Reloading

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```
開發伺服器將在 `http://localhost:3000` 啟動。

### Build
```bash
pnpm build
# or
npm run build
# or
yarn build
```

### Production

```bash
pnpm start
# or
npm start
# or
yarn start
```

## 內容管理

### 文章與新聞（棄用）
注意：本段已棄用，目前已更改為 DB 的方式擷取資料，也以使用 MD 而非 MDX。

文章與新聞透過 Supabase 資料庫管理。

文章元資料格式：
```yaml
---
title: "文章標題"
description: "文章描述"
date: "YYYY-MM-DD HH:MM"
tags: ["標籤1", "標籤2"]
type: ["Post", "News"]
img: "/Author/作者ID/author.png"
image: "https://圖片網址/圖片.jpg"
---
```

**注意**：在寫 Markdown 要使用 HTML 語法的 class 的時候要使用 `className`。

## API 端點

### 內部 API 路由

所有 API 端點位於 `/api/` 路徑下，使用查詢參數傳遞資料。

路徑格式：`/api/{name}?label_1=val_1&label_2=val_2&...`

### 外部 API

專案使用 [Blockchair API](https://blockchair.com/) 取得比特幣即時資料：
- 雜湊率 (Hash Rate)
- 區塊高度 (Block Height)
- 價格 (Price)

## 部署

### 使用 Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 建立新專案並連結 GitHub 儲存庫
3. 設定環境變數（SUPABASE_URL, SUPABASE_ANON_KEY）
4. 部署

### 環境變數設定

在 Vercel 或本地環境中設定以下變數：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 開發注意事項

### Markdown 語法

在 MDX 檔案中使用 HTML 標籤時，class 屬性必須改用 `className`。

### 工具指令

擷取所有文章標籤（用於產生標籤列表）：

```bash
grep -r 'tags' . | sed -n 's/.*tags: \(.*\)/\1/p' | tr -d '[]' | tr ',' '\n' | sed 's/^ *//;s/ *$//' | tr -d '"' | tr -d "'" | sort -u | uniq | sed 's/^/"/;s/$/"/' | sed 's/$/,/'
```

## 授權

本專案為私有專案。
