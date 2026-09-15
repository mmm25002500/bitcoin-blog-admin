-- 前台 Footer 的「🧡 你是第 N 個支持比特幣的用戶」
--
-- 每個 IP 算一次。只存 IP 加鹽後的 SHA-256（前台 API 算好才送進來），不存原始 IP。
-- 表本身不開放任何 policy，前台只能透過 register_visitor() 登記並取得名次。

create table if not exists public."Visitor" (
  id bigint generated always as identity primary key,
  ip_hash text not null unique,
  created_at timestamptz not null default now()
);

alter table public."Visitor" enable row level security;

-- 第一次來就登記；回傳這個訪客是第幾個（依登記順序）
create or replace function public.register_visitor(p_ip_hash text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
begin
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid ip hash';
  end if;

  select id into v_id from public."Visitor" where ip_hash = p_ip_hash;

  if v_id is null then
    insert into public."Visitor" (ip_hash) values (p_ip_hash)
      on conflict (ip_hash) do nothing
      returning id into v_id;

    -- 同時有兩個請求搶著登記時，另一邊已經插入了
    if v_id is null then
      select id into v_id from public."Visitor" where ip_hash = p_ip_hash;
    end if;
  end if;

  -- 用 count 而不是 id，避免 identity 跳號讓名次不連續
  return (select count(*) from public."Visitor" where id <= v_id);
end;
$$;

revoke all on function public.register_visitor(text) from public;
grant execute on function public.register_visitor(text) to anon, authenticated;
