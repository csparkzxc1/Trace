-- 흔적 · Trace — RPC 함수 (§9.1)
-- toggle_check / get_user_streak / get_week_heatmap / get_cell_board

set search_path to public;

-- ============================================================================
-- toggle_check: 오늘의 카테고리 체크 토글 (낙관적 업데이트 후 백엔드 정합성)
-- ============================================================================
create or replace function toggle_check(
  p_category_id uuid,
  p_date date default current_date
) returns daily_checks
language plpgsql
security invoker
as $$
declare
  v_user uuid := auth.uid();
  v_existing daily_checks%rowtype;
  v_result daily_checks%rowtype;
begin
  if v_user is null then
    raise exception '인증이 필요합니다';
  end if;

  select * into v_existing
  from daily_checks
  where user_id = v_user and date = p_date and category_id = p_category_id;

  if not found then
    insert into daily_checks (user_id, date, category_id, completed)
    values (v_user, p_date, p_category_id, true)
    returning * into v_result;
  else
    update daily_checks
    set completed = not v_existing.completed,
        updated_at = now()
    where id = v_existing.id
    returning * into v_result;
  end if;

  return v_result;
end;
$$;

grant execute on function toggle_check(uuid, date) to authenticated;

-- ============================================================================
-- get_user_streak: 4개 이상(흔적의 날) 기준 연속 일수 계산 (§7.1)
-- ============================================================================
create or replace function get_user_streak(p_user_id uuid)
returns int
language plpgsql
security invoker
stable
as $$
declare
  v_streak int := 0;
  v_cursor date := current_date;
  v_count int;
begin
  loop
    select count(*) into v_count
    from daily_checks
    where user_id = p_user_id
      and date = v_cursor
      and completed = true;

    exit when v_count < 4;
    v_streak := v_streak + 1;
    v_cursor := v_cursor - 1;

    -- 안전 가드 (1년 이상 체크 방지)
    exit when v_streak >= 365;
  end loop;

  return v_streak;
end;
$$;

grant execute on function get_user_streak(uuid) to authenticated;

-- ============================================================================
-- get_week_heatmap: 시작일부터 7일간 일자별 완료 카운트
-- ============================================================================
create or replace function get_week_heatmap(
  p_user_id uuid,
  p_start_date date
) returns table (date date, completed_count int)
language sql
security invoker
stable
as $$
  with days as (
    select generate_series(p_start_date, p_start_date + 6, interval '1 day')::date as date
  )
  select
    d.date,
    coalesce(
      (select count(*)::int
       from daily_checks dc
       where dc.user_id = p_user_id
         and dc.date = d.date
         and dc.completed = true),
      0
    ) as completed_count
  from days d
  order by d.date;
$$;

grant execute on function get_week_heatmap(uuid, date) to authenticated;

-- ============================================================================
-- get_cell_board: 같은 구역 멤버의 오늘 흔적 수 + 마지막 활동 시각
-- 가시성 설정 적용 (share_total_only / hide_from_leader)
-- ============================================================================
create or replace function get_cell_board(p_cell_id uuid)
returns table (
  user_id uuid,
  display_name text,
  today_count int,
  last_active_at timestamptz
)
language sql
security invoker
stable
as $$
  select
    u.id as user_id,
    u.display_name,
    coalesce(
      (select count(*)::int
       from daily_checks_public dc
       where dc.user_id = u.id
         and dc.date = current_date
         and dc.completed = true),
      0
    ) as today_count,
    (select max(updated_at)
     from daily_checks dc
     where dc.user_id = u.id) as last_active_at
  from users u
  where u.cell_id = p_cell_id
  order by u.display_name asc;
$$;

grant execute on function get_cell_board(uuid) to authenticated;

-- ============================================================================
-- get_next_memory_cards: SRS due 카드 (§9.1)
-- ============================================================================
create or replace function get_next_memory_cards(
  p_user_id uuid,
  p_limit int default 10
) returns setof scripture_memory
language sql
security invoker
stable
as $$
  select *
  from scripture_memory
  where user_id = p_user_id
    and next_review_at <= now()
  order by next_review_at asc
  limit p_limit;
$$;

grant execute on function get_next_memory_cards(uuid, int) to authenticated;
