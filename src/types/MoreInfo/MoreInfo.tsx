// moreBTC 左側目錄的分類
export interface MoreInfoPost {
  title: string;
  filename: string; // 不含 .md
}

export interface MoreInfoCategory {
  id?: number; // 新增的分類沒有 id
  label: string; // 小標，可留空
  title: string;
  folder: string;
  sort_order: number;
  posts: MoreInfoPost[];
}

// 給選單用的文章清單
export interface MoreInfoPostOption {
  id: number;
  title: string;
  filename: string; // 不含 .md
}
