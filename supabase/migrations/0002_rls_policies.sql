-- 흔적 · Trace — RLS 정책
-- §5.1 본인은 모두 / 구역 멤버는 공유분만 / 구역장도 노트는 못 봄
-- 모든 사용자 데이터 테이블에 RLS 활성화

set search_path to public;

-- ============================================================================
-- 헬퍼: 같은 구역 소속인가?
-- ============================================================================
create or replace function is_same_cell(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from users me
    join users target on target.id = target_user
    where me.id = auth.uid()
      and me.cell_id is not null
      and me.cell_id = target.cell_id
  );
$$;

-- ============================================================================
-- users
-- ============================================================================
alter table users enable row level security;

drop policy if exists "본인 프로필 읽기" on users;
create policy "본인 프로필 읽기" on users
  for select using (id = auth.uid());

drop policy if exists "같은 구역 멤버 기본정보 읽기" on users;
create policy "같은 구역 멤버 기본정보 읽기" on users
  for select using (is_same_cell(id));

drop policy if exists "본인만 프로필 수정" on users;
create policy "본인만 프로필 수정" on users
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "본인 가입" on users;
create policy "본인 가입" on users
  for insert with check (id = auth.uid());

-- ============================================================================
-- churches / cells / training_categories — 인증된 사용자 읽기 전용 (관리는 admin)
-- ============================================================================
alter table churches enable row level security;
drop policy if exists "교회 읽기" on churches;
create policy "교회 읽기" on churches
  for select using (auth.role() = 'authenticated');

alter table cells enable row level security;
drop policy if exists "구역 읽기" on cells;
create policy "구역 읽기" on cells
  for select using (auth.role() = 'authenticated');

alter table training_categories enable row level security;
drop policy if exists "카테고리 읽기" on training_categories;
create policy "카테고리 읽기" on training_categories
  for select using (auth.role() = 'authenticated');

-- ============================================================================
-- daily_checks — 핵심
-- 본인은 모두 / 구역 멤버는 공유분만 (note·scripture_ref 제외)
-- ============================================================================
alter table daily_checks enable row level security;

drop policy if exists "본인은 모두 읽기" on daily_checks;
create policy "본인은 모두 읽기" on daily_checks
  for select using (user_id = auth.uid());

drop policy if exists "구역 멤버는 공유분만 읽기" on daily_checks;
create policy "구역 멤버는 공유분만 읽기" on daily_checks
  for select using (
    exists (
      select 1
      from users me, users target, visibility_settings vs, training_categories tc
      where me.id = auth.uid()
        and target.id = daily_checks.user_id
        and me.cell_id is not null
        and me.cell_id = target.cell_id
        and vs.user_id = target.id
        and tc.id = daily_checks.category_id
        and (
          tc.slug = any(vs.share_categories)
          or vs.share_total_only = true
        )
        -- §7.4 구역장도 노트 못 봄: SELECT 허용 자체는 하되 클라이언트는
        -- note·scripture_ref 컬럼을 제외하도록 별도 뷰 사용 권장.
        and not (vs.hide_from_leader and me.role = 'cell_leader')
    )
  );

drop policy if exists "본인만 쓰기" on daily_checks;
create policy "본인만 쓰기" on daily_checks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 구역 멤버에 노출되는 안전한 뷰 (note·scripture_ref 제외)
create or replace view daily_checks_public as
select
  id, user_id, date, category_id, completed, duration_minutes,
  created_at, updated_at
from daily_checks;

-- ============================================================================
-- prayer_journal — 본인 전용. 단, is_shared_to_cell=true는 같은 구역 읽기.
-- 노트(answer_note)는 어떤 경우에도 외부에 공개되지 않음.
-- ============================================================================
alter table prayer_journal enable row level security;

drop policy if exists "본인 기도수첩" on prayer_journal;
create policy "본인 기도수첩" on prayer_journal
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "구역에 공유한 기도제목 읽기" on prayer_journal;
create policy "구역에 공유한 기도제목 읽기" on prayer_journal
  for select using (
    is_shared_to_cell = true
    and is_same_cell(user_id)
  );

create or replace view prayer_journal_shared as
select id, user_id, title, request, scripture_ref, created_at
from prayer_journal
where is_shared_to_cell = true;

-- ============================================================================
-- scripture_memory / reading_plan_progress / assessments — 본인 전용
-- ============================================================================
alter table scripture_memory enable row level security;
drop policy if exists "본인 암송" on scripture_memory;
create policy "본인 암송" on scripture_memory
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table reading_plan_progress enable row level security;
drop policy if exists "본인 통독" on reading_plan_progress;
create policy "본인 통독" on reading_plan_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table assessments enable row level security;
drop policy if exists "본인 자가진단" on assessments;
create policy "본인 자가진단" on assessments
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- encouragements — 보낸/받은 본인만
-- ============================================================================
alter table encouragements enable row level security;

drop policy if exists "내가 보낸/받은 격려 읽기" on encouragements;
create policy "내가 보낸/받은 격려 읽기" on encouragements
  for select using (
    from_user_id = auth.uid() or to_user_id = auth.uid()
  );

drop policy if exists "같은 구역에만 격려 보내기" on encouragements;
create policy "같은 구역에만 격려 보내기" on encouragements
  for insert with check (
    from_user_id = auth.uid()
    and is_same_cell(to_user_id)
  );

-- ============================================================================
-- visibility_settings / notification_settings — 본인 전용
-- ============================================================================
alter table visibility_settings enable row level security;
drop policy if exists "본인 가시성 설정" on visibility_settings;
create policy "본인 가시성 설정" on visibility_settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table notification_settings enable row level security;
drop policy if exists "본인 알림 설정" on notification_settings;
create policy "본인 알림 설정" on notification_settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
