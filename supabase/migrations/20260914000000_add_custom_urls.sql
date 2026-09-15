-- 自訂網址
--
-- 1. 文章／新聞：slug 是自訂網址（/Post/<slug>），old_slugs 記錄改過的舊網址，
--    前台用舊網址或編號進來時會轉址到目前的 slug，已分享出去的連結不會壞。
-- 2. PageRoute：固定頁面與各區塊的網址（例如 /aboutus → /about），
--    前台 middleware 讀這張表做轉址。

-- ---------- 文章／新聞 slug ----------

alter table public."Post"
  add column if not exists slug text,
  add column if not exists old_slugs text[] not null default '{}';

alter table public."News"
  add column if not exists slug text,
  add column if not exists old_slugs text[] not null default '{}';

-- 不能有 / ? # % . 或空白；也不能是純數字（純數字保留給文章編號）
alter table public."Post" drop constraint if exists "Post_slug_format";
alter table public."Post" add constraint "Post_slug_format"
  check (slug is null or (slug ~ '^[^/?#%.[:space:]]+$' and slug !~ '^[0-9]+$'));

alter table public."News" drop constraint if exists "News_slug_format";
alter table public."News" add constraint "News_slug_format"
  check (slug is null or (slug ~ '^[^/?#%.[:space:]]+$' and slug !~ '^[0-9]+$'));

create unique index if not exists "Post_slug_key" on public."Post" (slug);
create unique index if not exists "News_slug_key" on public."News" (slug);

create index if not exists "Post_old_slugs_idx" on public."Post" using gin (old_slugs);
create index if not exists "News_old_slugs_idx" on public."News" using gin (old_slugs);

-- ---------- 固定頁面／區塊網址 ----------

-- key：前台原本的第一段路徑（大小寫要一致），例如 'aboutus'、'Post'
-- path：自訂的第一段路徑，null 表示沿用 key
create table if not exists public."PageRoute" (
  key text primary key,
  label text not null,
  path text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public."PageRoute" drop constraint if exists "PageRoute_path_format";
alter table public."PageRoute" add constraint "PageRoute_path_format"
  check (path is null or path ~ '^[^/?#%.[:space:]]+$');

create unique index if not exists "PageRoute_path_key" on public."PageRoute" (path);

-- 前台用 anon key 讀，後台用登入身分寫
alter table public."PageRoute" enable row level security;

drop policy if exists "PageRoute select for all" on public."PageRoute";
create policy "PageRoute select for all"
  on public."PageRoute" for select
  using (true);

drop policy if exists "PageRoute write for authenticated" on public."PageRoute";
create policy "PageRoute write for authenticated"
  on public."PageRoute" for all
  to authenticated
  using (true)
  with check (true);

insert into public."PageRoute" (key, label, sort_order) values
  ('Post', '文章', 0),
  ('News', '新聞', 1),
  ('Author', '作者', 2),
  ('Tag', '標籤', 3),
  ('Search', '搜尋', 4),
  ('moreBTC', '認識比特幣', 5),
  ('MoreInfo', '更多資訊', 6),
  ('aboutus', '關於', 7),
  ('supporter', '贊助', 8),
  ('Disclaimer', '聲明', 9),
  ('PrivacyPolicy', '隱私權', 10)
on conflict (key) do nothing;
