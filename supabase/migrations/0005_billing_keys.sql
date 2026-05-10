-- 흔적 · Trace — 빌링키 보관 테이블 (§13 보안 핵심)
--
-- 토스페이먼츠 빌링키는 외부 노출 시 결제 도용 위험이 있어 service_role 만
-- 접근 가능한 private 테이블에 저장한다. authenticated/anon 의 모든 권한 차단.
-- 클라이언트는 절대 직접 SELECT/INSERT/UPDATE/DELETE 하지 못한다 — Edge Function
-- (service_role 키 보유) 만 통신.

set search_path to public;

create table if not exists billing_keys (
  user_id uuid primary key references users(id) on delete cascade,
  billing_key text not null,
  card_company text,
  card_last4 text,
  status text not null default 'active' check (status in ('active','suspended','revoked')),
  issued_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at 자동 갱신 (0001 의 touch_updated_at 트리거 함수 재사용)
drop trigger if exists trg_billing_keys_touch on billing_keys;
create trigger trg_billing_keys_touch
  before update on billing_keys
  for each row execute function touch_updated_at();

-- RLS 활성화. 모든 정책 부재 = 모든 일반 사용자 접근 차단.
-- service_role 은 RLS 를 우회한다 (Supabase 정책).
alter table billing_keys enable row level security;

-- 명시적 권한 차단 (방어적 — anon/authenticated 가 어떤 쿼리도 못 던지게)
revoke all on billing_keys from anon, authenticated;

-- service_role 만 GRANT (Supabase 가 자동으로 service_role 에 전체 권한 부여하지만
-- 명시 GRANT 로 의도를 문서화)
grant select, insert, update, delete on billing_keys to service_role;

-- 본인 빌링키 존재 여부 정도는 클라이언트가 알아야 UI 가능 — 안전한 view 제공
create or replace view billing_key_summary
with (security_invoker = off) as
select
  user_id,
  card_company,
  card_last4,
  status,
  issued_at
from billing_keys;

-- 본인 row 만 노출하는 RLS-like 가드는 view 안 WHERE 절로
drop view if exists billing_key_summary cascade;
create view billing_key_summary
with (security_invoker = off) as
select
  user_id,
  card_company,
  card_last4,
  status,
  issued_at
from billing_keys
where user_id = auth.uid();

revoke all on billing_key_summary from anon, authenticated;
grant select on billing_key_summary to authenticated;

-- 검증 어서션
do $$
declare
  cnt int;
begin
  -- billing_keys 본 테이블에 정책이 0 이어야 (RLS 활성 + 정책 없음 = 차단)
  select count(*) into cnt
  from pg_policies where schemaname = 'public' and tablename = 'billing_keys';
  if cnt <> 0 then
    raise exception '0005 위반: billing_keys 에 정책이 추가됨 (% 개) — 의도된 차단을 깰 수 있음', cnt;
  end if;

  -- view 가 존재
  select count(*) into cnt
  from pg_views where schemaname = 'public' and viewname = 'billing_key_summary';
  if cnt <> 1 then
    raise exception 'billing_key_summary 뷰 누락';
  end if;
end$$;
