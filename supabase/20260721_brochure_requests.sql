-- 소개서 받기 요청 리드 테이블
-- korhrdbusiness Supabase 프로젝트 SQL Editor에서 실행
create table if not exists public.brochure_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  mail_status text not null default 'pending', -- pending | sent | failed
  sent_at timestamptz,
  viewed_at timestamptz,     -- 최초 열람 시각
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- 서버(service role)에서만 접근 — 클라이언트 접근 차단
alter table public.brochure_requests enable row level security;
