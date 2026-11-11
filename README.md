# next.mamayahuhu.com

麻麻呼呼（[mamayahuhu.com](https://mamayahuhu.com)）的 Instagram 分享圖產生器。

## 功能

- **首頁 `/`**：貼上文章網址，即可預覽並下載 1024×1024 的 IG 分享圖。
- **API `GET /api/instagram?url=<文章網址>`**：讀取該頁的 Open Graph 標題、描述與封面圖，回傳 PNG。
  - `400`：缺少 `url` 或不是 http(s) 網址
  - `502`：無法讀取該網址的 Open Graph 資料，或字型載入失敗

字型使用 Google Fonts 的 Noto Sans TC（僅下載用到的字）。

## 開發

需要 Node.js 20.9 以上。

```bash
npm install
npm run dev
```

其他指令：`npm run build`、`npm run start`、`npm run lint`。
