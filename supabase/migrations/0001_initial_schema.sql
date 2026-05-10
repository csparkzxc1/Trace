-- 흔적 · Trace — 초기 스키마
-- CLAUDE.md §5 데이터 모델 그대로 구현
-- 모든 사용자 데이터 테이블에 RLS 정책 활성

set search_path to public;

-- ============================================================================
-- 1. 교회 (B2B 단위)
-- ============================================================================
create table if not exists churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  denomination text,
  address text,
  pastor_name text,
  license_tier text not null default 'free' check (license_tier in ('free','church','enterprise')),
  license_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 2. 구역 (cells) — users.cell_id 참조 전에 정의
-- ============================================================================
create table if not exists cells (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references churches(id) on delete cascade,
  name text not null,
  leader_id uuid,
  invite_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 3. 사용자 프로필
-- ============================================================================
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  church_id uuid references churches(id) on delete set null,
  cell_id uuid references cells(id) on delete set null,
  role text not null default 'member' check (role in ('member','cell_leader','pastor','admin')),
  baptism_date date,
  joined_church_at date,
  avatar_url text,
  is_premium boolean not null default false,
  premium_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 순환 FK: cells.leader_id → users.id (deferred)
alter table cells
  add constraint cells_leader_id_fkey
  foreign key (leader_id) references users(id) on delete set null;

-- ============================================================================
-- 4. 영성훈련 카테고리
-- ============================================================================
create table if not exists training_categories (
  id uuid primary key default gen_random_uuid(),
  church_id uuid references churches(id) on delete cascade,
  slug text not null,
  name_ko text not null,
  name_en text,
  icon text,
  sort_order int not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (church_id, slug)
);

-- ============================================================================
-- 5. 일일 체크 (핵심)
-- ============================================================================
create table if not exists daily_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  category_id uuid not null references training_categories(id) on delete cascade,
  completed boolean not null default false,
  duration_minutes int check (duration_minutes is null or duration_minutes >= 0),
  note text,
  scripture_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date, category_id)
);
create index if not exists idx_daily_checks_user_date on daily_checks(user_id, date desc);

-- ============================================================================
-- 6. 기도수첩
-- ============================================================================
create table if not exists prayer_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text,
  request text not null,
  scripture_ref text,
  is_shared_to_cell boolean not null default false,
  answered_at timestamptz,
  answer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 7. 성경 암송 (SRS)
-- ============================================================================
create table if not exists scripture_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  reference text not null,
  text text not null,
  translation text not null default '개역개정',
  srs_level int not null default 0,
  ease_factor numeric not null default 2.5,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  total_reviews int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_memory_review on scripture_memory(user_id, next_review_at);

-- ============================================================================
-- 8. 통독표 진도
-- ============================================================================
create table if not exists reading_plan_progress (
  user_id uuid not null references users(id) on delete cascade,
  plan_id text not null,
  date date not null,
  passage_ref text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, plan_id, date)
);

-- ============================================================================
-- 9. 자가진단
-- ============================================================================
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  answers jsonb not null,
  scores jsonb not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 10. 격려 (구역 멤버 간)
-- ============================================================================
create table if not exists encouragements (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references users(id) on delete cascade,
  to_user_id uuid not null references users(id) on delete cascade,
  emoji text,
  message text check (message is null or char_length(message) <= 50),
  created_at timestamptz not null default now()
);
create index if not exists idx_encouragements_to_user on encouragements(to_user_id, created_at desc);

-- ============================================================================
-- 11. 가시성 설정 (구역 보드 차등 공개)
-- ============================================================================
create table if not exists visibility_settings (
  user_id uuid primary key references users(id) on delete cascade,
  share_streak boolean not null default true,
  share_categories text[] not null default array['worship','word','prayer','qt','memory','evangel','service'],
  share_total_only boolean not null default true, -- §7.4 디폴트는 총 개수만
  hide_from_leader boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 12. 알림 설정 (§7.3 옵트인)
-- ============================================================================
create table if not exists notification_settings (
  user_id uuid primary key references users(id) on delete cascade,
  morning_prayer_at time,
  qt_at time,
  evening_review_at time,
  weekly_summary_day int not null default 0 check (weekly_summary_day between 0 and 6),
  push_token text,
  push_enabled boolean not null default false, -- §7.3 옵트인 디폴트 OFF
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- updated_at 자동 갱신 트리거
-- ============================================================================
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in select unnest(array[
    'churches','cells','users','daily_checks','prayer_journal',
    'scripture_memory','reading_plan_progress','visibility_settings',
    'notification_settings'
  ]) loop
    execute format('drop trigger if exists trg_%I_touch on %I', t, t);
    execute format('create trigger trg_%I_touch before update on %I
                    for each row execute function touch_updated_at()', t, t);
  end loop;
end$$;

-- ============================================================================
-- 기본 7대 영성훈련 카테고리 시드 (church_id NULL = 글로벌)
-- ============================================================================
insert into training_categories (slug, name_ko, name_en, sort_order, is_default)
values
  ('worship', '예배', 'Worship', 10, true),
  ('word',    '말씀', 'Word', 20, true),
  ('prayer',  '기도', 'Prayer', 30, true),
  ('qt',      '큐티', 'Quiet Time', 40, true),
  ('memory',  '암송', 'Memory', 50, true),
  ('evangel', '전도', 'Evangelism', 60, true),
  ('service', '봉사', 'Service', 70, true)
on conflict do nothing;
