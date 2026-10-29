-- 文章內文頂部的封面改用比特幣即時價格走勢圖
-- true：內文頂部顯示走勢圖；縮圖、分享預覽（og:image）仍用封面圖

alter table public."Post"
  add column if not exists cover_chart boolean not null default false;

alter table public."News"
  add column if not exists cover_chart boolean not null default false;
