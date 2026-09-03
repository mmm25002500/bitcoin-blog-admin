-- 文章底部按鈕（1～6 個，每排三個）
-- 每個元素格式：
--   { "title": string, "description": string, "logo": string, "link": string }
--   logo 存 storage 內的檔名（bucket: post.image / news.image），或完整 http(s) 網址

alter table public."Post"
  add column if not exists buttons jsonb not null default '[]'::jsonb;

alter table public."News"
  add column if not exists buttons jsonb not null default '[]'::jsonb;

-- 必須是陣列，且最多 6 個
alter table public."Post"
  drop constraint if exists "Post_buttons_is_array";
alter table public."Post"
  add constraint "Post_buttons_is_array"
  check (jsonb_typeof(buttons) = 'array' and jsonb_array_length(buttons) <= 6);

alter table public."News"
  drop constraint if exists "News_buttons_is_array";
alter table public."News"
  add constraint "News_buttons_is_array"
  check (jsonb_typeof(buttons) = 'array' and jsonb_array_length(buttons) <= 6);
