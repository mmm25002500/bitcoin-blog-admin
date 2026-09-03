// 文章底部按鈕（每篇 1～6 個，每排三個）
export interface ArticleButtonData {
  title: string;
  description: string;
  logo: string; // storage 檔名，或完整 http(s) 網址
  link: string;
}

// 編輯器用：多帶一個待上傳的檔案
export interface ArticleButtonInput extends ArticleButtonData {
  logoFile?: File | null;
}

export interface ButtonsEditorProps {
  value: ArticleButtonInput[];
  onChange: (buttons: ArticleButtonInput[]) => void;
  // 用來組出既有 logo 的預覽網址，例如 post.image / news.image
  bucket: string;
}

export const MAX_ARTICLE_BUTTONS = 6;
