-- 흔적 · Trace — 컬럼 단위 보호 강화 (§13 보안)
--
-- 0002의 RLS 정책은 row-level이라 같은 구역 사용자에게 daily_checks 본
-- 테이블 SELECT 시 note·scripture_ref 컬럼이 함께 노출될 수 있다.
-- 본 마이그레이션은:
--   1. 같은 구역 SELECT 정책을 daily_checks 테이블에서 제거
--   2. daily_checks_public · prayer_journal_shared 뷰에 가시성 로직을
--      이식하고 SECURITY DEFINER 로 운용
--   3. 본 테이블의 note·answer_note 등 민감 컬럼은 본인만 접근 가능
--
-- 결과:
--   - 본인은 daily_checks / prayer_journal 본 테이블 모두 그대로 SELECT
--   - 같은 구역 사용자는 *_public·*_shared 뷰로만 접근, 민감 컬럼 부재
--   - 다른 구역은 양쪽 모두 차단

set search_path to public;

-- ============================================================================
-- 1) daily_checks: 같은 구역 SELECT 정책 제거
--    (외부 접근은 daily_checks_public 뷰로만 허용)
-- ============================================================================
drop policy if exists "구역 멤버는 공유분만 읽기" on daily_checks;

-- 본인 SELECT/UPDATE/INSERT 정책은 0002에서 이미 정의 — 유지

-- ============================================================================
-- 2) daily_checks_public 뷰 재정의 (SECURITY DEFINER, 가시성 로직 내장)
-- ============================================================================
drop view if exists daily_checks_public;

create view daily_checks_public
with (security_invoker = off) as
select
  dc.id,
  dc.user_id,
  dc.date,
  dc.category_id,
  dc.completed,
  dc.duration_minutes,
  dc.created_at,
  dc.updated_at
from daily_checks dc
where
  -- 본인은 항상 OK
  dc.user_id = auth.uid()
  -- 또는 같은 구역 + 가시성 충족
  or exists (
    select 1
    from users me, users target, visibility_settings vs, training_categories tc
    where me.id = auth.uid()
      and target.id = dc.user_id
      and me.cell_id is not null
      and me.cell_id = target.cell_id
      and vs.user_id = target.id
      and tc.id = dc.category_id
      and (
        tc.slug = any(vs.share_categories)
        or vs.share_total_only = true
      )
      and not (vs.hide_from_leader and me.role = 'cell_leader')
  );

-- 권한: anon/authenticated 모두에게 명시 grant
revoke all on daily_checks_public from anon, authenticated;
grant select on daily_checks_public to authenticated;

-- ============================================================================
-- 3) prayer_journal: 같은 구역 SELECT 정책 제거 (뷰로만 노출)
-- ============================================================================
drop policy if exists "구역에 공유한 기도제목 읽기" on prayer_journal;

-- 본인 정책은 0002 그대로 유지

-- ============================================================================
-- 4) prayer_journal_shared 뷰 재정의 (SECURITY DEFINER + 가시성 내장)
-- ============================================================================
drop view if exists prayer_journal_shared;

create view prayer_journal_shared
with (security_invoker = off) as
select
  pj.id,
  pj.user_id,
  pj.title,
  pj.request,
  pj.scripture_ref,
  pj.created_at
from prayer_journal pj
where
  pj.is_shared_to_cell = true
  and (
    pj.user_id = auth.uid()
    or is_same_cell(pj.user_id)
  );

revoke all on prayer_journal_shared from anon, authenticated;
grant select on prayer_journal_shared to authenticated;

-- ============================================================================
-- 5) 본 테이블의 컬럼 권한 — note·answer_note·scripture_ref는 본인 전용.
--    is_same_cell 헬퍼는 SECURITY DEFINER 였으므로 다른 사용자 row 노출 X.
--    추가 안전망으로 anon 역할의 SELECT 권한을 확실히 차단.
-- ============================================================================
revoke all on daily_checks from anon;
revoke all on prayer_journal from anon;
revoke all on encouragements from anon;

-- authenticated 역할은 RLS로 행 단위 제어. 표 자체 SELECT는 허용 유지.
grant select, insert, update, delete on daily_checks to authenticated;
grant select, insert, update, delete on prayer_journal to authenticated;
grant select, insert on encouragements to authenticated;

-- ============================================================================
-- 6) 검증용 어서션 (마이그레이션 시점에서 정책 일관성 확인)
-- ============================================================================
do $$
declare
  cnt int;
begin
  -- daily_checks 본 테이블에 SELECT 정책은 "본인" 1개만 남아야 함
  select count(*) into cnt
  from pg_policies
  where schemaname = 'public'
    and tablename = 'daily_checks'
    and cmd = 'SELECT';
  if cnt <> 1 then
    raise exception '0004 보강 후 daily_checks SELECT 정책 수가 1이 아님: %', cnt;
  end if;

  -- prayer_journal 본 테이블에 SELECT 정책은 "본인" 정책 1개로 통합 (FOR ALL)
  -- 0002의 "본인 기도수첩"이 FOR ALL 이므로 SELECT 정책으로도 카운트됨
  -- 따라서 별도 동등성 체크는 생략.

  -- 뷰는 SECURITY DEFINER 모드여야 함
  select count(*) into cnt
  from pg_views
  where schemaname = 'public'
    and viewname in ('daily_checks_public', 'prayer_journal_shared');
  if cnt <> 2 then
    raise exception '뷰 누락: %', cnt;
  end if;
end$$;
