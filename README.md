# 比特幣中文部落格網站 後台 - 文檔
## 使用說明
1. 在寫 Markdown 要使用 HTML 語法的 class的時候要使用 className。
### 文章
1. 文章路徑為 `Article/${name}/${mdx name}`
2. 文章元標頭為：
> title: "文章標題" <br>
> description: "文章描述" <br>
> date: "YYYY-MM-DD HH:MM" <br>
> tags: ["標籤1", "標籤2", "標籤n"] <br>
> type: ['News','Post'] （類別：文章為Post，新聞為 News） <br>
> img: "/Author/JohnCarter/author.png"（必須放在本地，其位置於`public/Author/${name}/author.png`） <br>
> image: "https://網址/圖片檔名.副檔名" <br>

## 網站架構
### 內部API
#### ADDR
路徑：`/api/{name}?lebel_1=val_1&label2=val_2&...`
#### 功能表
| API | Input | Output | 簡介 |
| --- | --- | --- | --- |
|  | req.query: {  } | res: {  } |  |

### 外部API
| Hash Rate | Block Height | Price |
| -------- | -------- | -------- |
| BlockChair | BlockChair | BlockChair |

### 使用資源
| 內容 | 服務 |
| ---- | ---- |
| Post Backend | Supabase |
| Backend Server | Vercel |
| Frontend Server | Vercel |
| BTC info Provider | BlockChair |

### 擷取 Tags
```sh
grep -r 'tags' . | sed -n 's/.*tags: \(.*\)/\1/p' | tr -d '[]' | tr ',' '\n' | sed 's/^ *//;s/ *$//' | tr -d '"' | tr -d "'" | sort -u | uniq | sed 's/^/"/;s/$/"/' | sed 's/$/,/'
```

## Hot Reloading & Deployment
### pnpm (recommendation)
```bash
# install necessary pkg
pnpm i
# hot reloading dev
pnpm dev
# deploy & compile
pnpm build
```
### npm (Not recommended)
```bash
# install necessary pkg
npm i
# hot reloading dev
npm run dev
# deploy & compile
npm run build
```
### yarn (Not recommended)
```bash
# install necessary pkg
yarn
# hot reloading dev
yarn dev
# deploy & compile
yarn build
```