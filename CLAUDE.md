# 흔적 · Trace — Claude Code 개발 프롬프트

> 한국형 영성훈련 체크리스트 앱 · 풀스택 모바일 + B2B 웹 대시보드
> 브랜드 아이덴티티: Wordmark (Concept III · Typographic)
> 이 문서는 Claude Code의 단일 진실 소스(SSOT)로 사용됩니다.
> 새 작업 시작 시 반드시 이 문서를 먼저 읽고 작업 계획을 보고하세요.

---

## 0. 너에게 (Claude Code에게)

너는 30년차 풀스택 시니어 개발자이자 PM이다. 이 프로젝트의 모든 결정은 다음 우선순위를 따른다:

1. **사용자의 영적 안전** > 기능성 > 성능 > 코드 우아함
2. **율법주의 방지 UX**가 모든 화면에 적용되어야 한다 (자세한 규칙은 §7 참조)
3. **타이포그래피가 곧 브랜드**다. 폰트·자간·여백은 디테일이 아니라 정체성이다 (§2 참조)
4. 작업 전 항상 **계획을 먼저 보고**하고 승인을 받는다
5. 구현 시 **기존 컨벤션을 따른다** — 새 패턴 도입은 충분한 근거가 있을 때만
6. **커밋 단위는 작게**. 한 커밋 = 한 가지 변경. 한국어 커밋 메시지 사용

**금지 사항:**
- 사용자가 요청하지 않은 기능을 추가로 만들지 마라
- 의심스러우면 추측하지 말고 질문하라
- "정죄"하는 표현은 어떤 카피에도 들어가지 않는다 ("실패", "놓침", "포기" 등 금기어)
- 게이미피케이션이 신앙적 동기를 대체하게 하지 마라 (캐릭터 성장 < 사용자의 자율성)
- **그라데이션·아이콘 일러스트를 임의로 추가하지 마라** — 브랜드는 타이포그래피다

---

## 1. 프로젝트 개요

**이름:** 흔적 · Trace
- 한국 시장 표기: **흔적**
- 글로벌 표기: **Trace**
- 정식 표기 (앱 스토어, 법적 문서): **흔적 · Trace**
- 모노그램 (파비콘·작은 아이콘): **흔**

**태그라인:**
- 영문: *"Leave a trace, not a score."*
- 한글: *"신앙은 점수가 아닌 흔적입니다."*

**한 줄 정의:** 한국 개신교 신자를 위한 영성훈련 체크리스트 + 소그룹 책임감 앱

**타겟 페르소나:**
- 1차: 25–55세 개신교 신자 중 제자훈련 수료자/진행자
- 2차: 소그룹·구역 리더, 신학생, 부교역자
- B2B: 중대형 교회 부서 단위(50명+) 운영자

**핵심 가치 제안:**
> "혼자가 아니라 함께, 점수가 아니라 흔적으로 신앙을 이어가는 도구"

**경쟁 우위:**
1. 한국 교회 문화 통합 (새벽기도·주일성수·십일조·구역모임)
2. 율법주의 방지 UX 디자인
3. 소그룹 가시성 차등 시스템 (멤버는 "체크 여부"만, 내용은 본인만)
4. 검증된 자가진단 도구 내장 (A.W. 토저 7문항 등)
5. **브랜드 차별화** — Christian 앱 시장의 그라데이션·십자가 클리셰를 거부, 한국 종이책+서예 미감

**비즈니스 모델:**
- Free: 개인 트래킹 + 기본 통계 + 구역 1개
- Premium (월 4,900원): 제자훈련 커리큘럼, 무제한 기도수첩, 통계 심화, AI 묵상 동반자
- 교회 라이선스 (월 99,000원~): 목회자 대시보드, 교적 연동, 커스텀 훈련 항목

---

## 2. 브랜드 아이덴티티

### 2.1 핵심 원칙

**브랜드는 타이포그래피다.** 심볼·아이콘·일러스트가 아니다. "흔적"이라는 단어 자체와 그것이 종이 위에 놓이는 방식이 정체성이다.

**금지:**
- ❌ 십자가, 비둘기, 성경책 일러스트
- ❌ 그라데이션, 네온, 글로우
- ❌ 캐릭터, 마스코트
- ❌ 임의의 아이콘·이모지를 로고에 추가

**허용:**
- ✅ 활자 그 자체 (Noto Serif KR · Cormorant Garamond Italic)
- ✅ 절제된 금색 가는 선 (구분자)
- ✅ 종이 톤 배경 + 깊은 잉크색 텍스트
- ✅ 모노그램 "흔" (단일 한글 자소)

### 2.2 로고 사용 규칙

**Primary Lockup (가로형):**
```
흔적 · Trace
```
- "흔적": Noto Serif KR Medium, ink #1F2A37
- "·": Cormorant Garamond Regular, gold #B8924F (양쪽 0.15em 마진)
- "Trace": Cormorant Garamond Italic Medium, ink #1F2A37

**Stacked Lockup (앱 헤더용):**
```
흔적
TRACE
```
- "흔적" 큰 글씨, "TRACE"는 작은 영문 대문자 + 자간 0.3em + gold 컬러

**Monogram (앱 아이콘 작은 사이즈, 파비콘, 소셜 프로필):**
```
흔
```
- Noto Serif KR Medium, ink #1F2A37 on cream #F5F1E8
- 또는 cream on ink (다크 모드)

### 2.3 앱 아이콘 프로덕션 스펙

| 사이즈 | 콘텐츠 | 비고 |
|---|---|---|
| 1024×1024 (마스터) | "흔" 모노그램 | App Store 마스터 아이콘 |
| 512×512, 256×256 | "흔" 모노그램 | 마켓플레이스 |
| 180×180, 120×120 | "흔" 모노그램 | iOS 홈 스크린 |
| 96×96 이하 | "흔" 모노그램 (Bold) | 알림 아이콘, 위젯 |
| 32×32, 16×16 | "흔" 모노그램 (Bold) | 파비콘 |

**iOS 라운드 코너:** 시스템이 자동으로 클리핑함. 우리는 정사각형 위에 cream 배경 + 모노그램 중앙 배치만 하면 됨. 아이콘 자체엔 라운드 코너 적용 X.

**색 조합 (앱 아이콘):**
- 라이트: cream(#F5F1E8) 배경 + ink(#1F2A37) 글자
- 다크 (Tinted iOS 18+): ink 배경 + cream 글자
- 작은 사이즈에서 가독성 위해 글자 굵기를 한 단계 올림 (Bold)

### 2.4 스플래시 스크린

**구성:**
- 배경: cream(#F5F1E8)
- 중앙: "흔적 · Trace" 워드마크 (페이드인 0.6s)
- 하단: 태그라인 "신앙은 점수가 아닌 흔적입니다." (페이드인 0.4s, 0.3s 지연)
- 총 시간: 1.2~1.5초

**모션 (선택적, 고도화시):**
- "흔" → "·" → "적" → "·" → "Trace" 순으로 0.1s 간격 페이드인
- 또는 잉크가 종이에 스며드는 효과 (CSS opacity + slight blur 트랜지션)

### 2.5 브랜드 자산 폴더 구조

```
assets/
├─ brand/
│  ├─ wordmark/
│  │  ├─ wordmark-horizontal.svg
│  │  ├─ wordmark-stacked.svg
│  │  ├─ wordmark-en-only.svg     # Trace 단독
│  │  └─ wordmark-ko-only.svg     # 흔적 단독
│  ├─ monogram/
│  │  ├─ monogram-light.svg       # cream bg + ink
│  │  ├─ monogram-dark.svg        # ink bg + cream
│  │  └─ monogram-gold.svg        # 특별 사용
│  ├─ app-icons/
│  │  ├─ ios/
│  │  │  ├─ AppIcon-1024.png
│  │  │  ├─ AppIcon-180.png
│  │  │  └─ ...
│  │  └─ android/
│  │     ├─ ic_launcher_foreground.svg
│  │     └─ ic_launcher_background.svg
│  ├─ splash/
│  │  ├─ splash-light.svg
│  │  └─ splash-dark.svg
│  └─ guidelines.md               # 사용 규칙·금지 사항 문서
```

### 2.6 기존 브랜드 시안 참조

`docs/brand-identity-v0.1.html` (이전에 생성한 브랜드 익스플로레이션 페이지)
→ Concept III "Wordmark" 채택 결정의 시각적 근거. Sprint 1에서 디자이너 또는 개발자가 이를 보고 SVG 자산을 정밀 제작.

---

## 3. 기술 스택 & 환경

### 3.1 모바일 앱
- **프레임워크:** React Native + Expo SDK 51+ (Expo Router 사용)
- **언어:** TypeScript (strict 모드)
- **상태관리:** Zustand (전역) + TanStack Query (서버 상태)
- **스타일:** NativeWind (TailwindCSS for RN) + 커스텀 디자인 토큰
- **폼:** react-hook-form + zod
- **로컬 저장:** Expo SecureStore (토큰), MMKV (캐시)
- **알림:** Expo Notifications + 백엔드 cron(Supabase Edge Functions)
- **결제:** 토스페이먼츠 SDK (구독), RevenueCat (인앱결제 통합)
- **분석:** Mixpanel (개인정보 마스킹)
- **에러 추적:** Sentry
- **폰트 임베드:** expo-font로 Noto Serif KR, Gowun Dodum, Cormorant Garamond 번들

### 3.2 백엔드
- **DB + Auth:** Supabase (PostgreSQL 15+)
- **API:** Supabase REST + RPC (PostgREST), 복잡 로직은 Edge Functions
- **실시간:** Supabase Realtime (구역 격려 보드)
- **스토리지:** Supabase Storage (프로필 이미지, 음성 녹음)
- **이메일:** Resend
- **푸시:** Expo Push Service

### 3.3 B2B 웹 대시보드
- **프레임워크:** Next.js 14 (App Router) + TypeScript
- **스타일:** TailwindCSS + shadcn/ui (커스터마이징해서 브랜드 톤 적용)
- **차트:** Recharts
- **배포:** Vercel
- **도메인:** admin.trace.faith (또는 흔적.한국)

### 3.4 개발 환경 요구사항
```bash
node >= 20
pnpm >= 9
expo-cli, supabase-cli 글로벌 설치
EAS 계정 (빌드용)
```

---

## 4. 사이트맵 & 라우팅

### 4.1 모바일 앱 라우트 구조

```
app/
├─ (auth)/
│  ├─ welcome.tsx                  # 흔적 워드마크 + 시작 버튼
│  ├─ login.tsx
│  ├─ signup.tsx
│  └─ onboarding/
│     ├─ step-1-welcome.tsx        # 가치 약속 (anti-shame 선언)
│     ├─ step-2-church.tsx         # 교회 검색 / 미선택
│     ├─ step-3-cell.tsx           # 구역 코드 (선택)
│     ├─ step-4-priorities.tsx     # 7대 영역 우선순위
│     └─ step-5-notifications.tsx  # 알림 시간 (3개)
│
├─ (tabs)/
│  ├─ today/
│  │  ├─ index.tsx                 # 메인 체크리스트
│  │  ├─ category/[id].tsx         # 카테고리 상세 입력 (모달)
│  │  └─ verse-detail.tsx          # 말씀 카드 상세
│  │
│  ├─ journey/
│  │  ├─ index.tsx                 # 월간 히트맵 + 통계
│  │  ├─ stats.tsx                 # 영역별 도넛
│  │  ├─ reading-plan.tsx          # 통독표
│  │  └─ discipleship.tsx          # 제자훈련 진도
│  │
│  ├─ cell/
│  │  ├─ index.tsx                 # 구역 보드
│  │  ├─ encourage/[memberId].tsx  # 격려 보내기
│  │  ├─ prayer-requests.tsx       # 공동 기도제목
│  │  ├─ visibility.tsx            # 가시성 설정
│  │  └─ leader/
│  │     ├─ index.tsx              # 구역장 도구
│  │     └─ create-prayer.tsx
│  │
│  └─ self/
│     ├─ index.tsx                 # 메뉴
│     ├─ assessment/
│     │  ├─ index.tsx
│     │  ├─ quiz.tsx
│     │  └─ result.tsx
│     ├─ memory/
│     │  ├─ index.tsx
│     │  ├─ study.tsx              # SRS 학습
│     │  └─ add.tsx
│     ├─ prayer-archive.tsx
│     ├─ settings/
│     │  ├─ index.tsx
│     │  ├─ notifications.tsx
│     │  ├─ church.tsx
│     │  ├─ subscription.tsx
│     │  └─ profile.tsx
│     └─ about.tsx                 # 브랜드 스토리, 태그라인
│
└─ _layout.tsx                     # 폰트 로드, 디자인 토큰 주입
```

### 4.2 B2B 대시보드 라우트

```
admin/
├─ dashboard/
├─ members/
│  └─ [id]/
├─ cells/
├─ trainings/                      # 커스텀 훈련 항목
├─ content/                        # QT/공지 발행
├─ analytics/
└─ settings/
```

---

## 5. 데이터 모델 (Supabase / PostgreSQL)

> 모든 테이블에 `created_at`, `updated_at` (timestamptz default now()) 포함
> 모든 사용자 데이터 테이블에 RLS(Row Level Security) 정책 필수

```sql
-- 교회 (B2B 단위)
create table churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  denomination text,
  address text,
  pastor_name text,
  license_tier text default 'free',
  license_until date,
  created_at timestamptz default now()
);

-- 사용자
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null,
  church_id uuid references churches(id),
  cell_id uuid references cells(id),
  role text default 'member',
  baptism_date date,
  joined_church_at date,
  avatar_url text,
  is_premium boolean default false,
  premium_until date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 구역
create table cells (
  id uuid primary key default gen_random_uuid(),
  church_id uuid references churches(id) not null,
  name text not null,
  leader_id uuid references users(id),
  invite_code text unique not null,
  created_at timestamptz default now()
);

-- 영성훈련 카테고리
create table training_categories (
  id uuid primary key default gen_random_uuid(),
  church_id uuid references churches(id),
  slug text not null,
  name_ko text not null,
  name_en text,
  icon text,
  sort_order int default 0,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 일일 체크 (핵심)
create table daily_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  date date not null,
  category_id uuid references training_categories(id) not null,
  completed boolean default false,
  duration_minutes int,
  note text,
  scripture_ref text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date, category_id)
);
create index idx_daily_checks_user_date on daily_checks(user_id, date desc);

-- 기도수첩
create table prayer_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  title text,
  request text not null,
  scripture_ref text,
  is_shared_to_cell boolean default false,
  answered_at timestamptz,
  answer_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 성경 암송 (SRS)
create table scripture_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  reference text not null,
  text text not null,
  translation text default '개역개정',
  srs_level int default 0,
  ease_factor numeric default 2.5,
  next_review_at timestamptz default now(),
  last_reviewed_at timestamptz,
  total_reviews int default 0,
  created_at timestamptz default now()
);
create index idx_memory_review on scripture_memory(user_id, next_review_at);

-- 통독표 진도
create table reading_plan_progress (
  user_id uuid references users(id) on delete cascade not null,
  plan_id text not null,
  date date not null,
  passage_ref text not null,
  completed boolean default false,
  primary key (user_id, plan_id, date)
);

-- 자가진단
create table assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  type text not null,
  answers jsonb not null,
  scores jsonb not null,
  created_at timestamptz default now()
);

-- 격려
create table encouragements (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references users(id) on delete cascade not null,
  to_user_id uuid references users(id) on delete cascade not null,
  emoji text,
  message text,
  created_at timestamptz default now()
);

-- 가시성 설정
create table visibility_settings (
  user_id uuid primary key references users(id) on delete cascade,
  share_streak boolean default true,
  share_categories text[] default array['worship','word','prayer','qt','memory','evangel','service'],
  share_total_only boolean default false,
  hide_from_leader boolean default false,
  updated_at timestamptz default now()
);

-- 알림 설정
create table notification_settings (
  user_id uuid primary key references users(id) on delete cascade,
  morning_prayer_at time,
  qt_at time,
  evening_review_at time,
  weekly_summary_day int default 0,
  push_token text,
  push_enabled boolean default true,
  updated_at timestamptz default now()
);
```

### 5.1 RLS 정책 핵심

```sql
alter table daily_checks enable row level security;

create policy "본인은 모두 읽기" on daily_checks
  for select using (user_id = auth.uid());

create policy "구역 멤버는 공유분만 읽기" on daily_checks
  for select using (
    exists (
      select 1 from users me, users target, visibility_settings vs
      where me.id = auth.uid()
        and target.id = daily_checks.user_id
        and me.cell_id = target.cell_id
        and vs.user_id = target.id
        and (
          daily_checks.category_id::text = any(vs.share_categories)
          or vs.share_total_only = true
        )
    )
  );

create policy "본인만 쓰기" on daily_checks
  for all using (user_id = auth.uid());
```

---

## 6. 디자인 시스템

### 6.1 디자인 토큰

```typescript
// theme/tokens.ts
export const colors = {
  cream:      '#F5F1E8',  // 종이 — 메인 배경
  creamDeep:  '#ECE5D3',  // 종이 그림자
  paper:      '#FAF7EE',  // 카드 배경
  ink:        '#1F2A37',  // 먹 — 메인 텍스트
  inkSoft:    '#4A5568',  // 보조 텍스트
  gold:       '#B8924F',  // 금 — 라벨, 악센트
  goldSoft:   '#D4B57A',  // 금 — 다크모드 악센트
  burgundy:   '#7A2E2E',  // 자주 — 강조, 태그라인
  sage:       '#6B7F5A',  // 평안 그린 — 긍정 상태
  line:       'rgba(31, 42, 55, 0.12)',
} as const;

export const fonts = {
  display:     'NotoSerifKR_500Medium',     // 한글 세리프 — 제목, 말씀, 워드마크
  displayBold: 'NotoSerifKR_700Bold',
  body:        'GowunDodum_400Regular',     // 한글 산세리프 — 본문, 버튼
  accent:      'CormorantGaramond_500Italic', // 영문 이탤릭 — 라벨, 숫자, "Trace"
  accentBold:  'CormorantGaramond_600SemiBold',
};

export const spacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 56, 80] as const;

export const radii = {
  sm: 4, md: 8, lg: 16, xl: 24, full: 9999,
};

export const fontSize = {
  xs: 11, sm: 13, base: 15, md: 17, lg: 22, xl: 28, xxl: 38, hero: 56,
};
```

### 6.2 타이포그래피 위계 (브랜드 = 타이포)

| 용도 | 폰트 | 크기 | 색상 | 자간 |
|---|---|---|---|---|
| 워드마크 (로고) | Noto Serif KR Medium | 가변 | ink | -0.02em |
| 페이지 제목 | Noto Serif KR Medium | 28 | ink | -0.01em |
| 섹션 제목 | Noto Serif KR Regular | 18 | ink | 0 |
| 카드 제목 | Noto Serif KR Medium | 17 | ink | 0 |
| 본문 | Gowun Dodum | 15 | ink | 0 |
| 보조 텍스트 | Gowun Dodum | 13 | inkSoft | 0 |
| 캡션 | Gowun Dodum | 11 | inkSoft | 0 |
| 영문 라벨 | Cormorant Garamond Italic | 12 | gold | 0.2em |
| 숫자 (스트릭, 통계) | Cormorant Garamond Medium | 가변 | burgundy | 0 |
| 태그라인 | Cormorant Garamond Italic Medium | 18-22 | burgundy | 0 |

**원칙:**
- 한글과 영문은 항상 다른 폰트 가족을 쓴다 (혼합되어도 구분되도록)
- 숫자는 항상 Cormorant Garamond — 통계가 "활자"처럼 보이게
- 영문 라벨은 항상 Italic — 한국어 본문과 시각적 분리

### 6.3 카피 톤 가이드

**금기어 (절대 사용 금지):**
- "실패", "놓쳤습니다", "포기", "다시 처음부터", "벌점", "꼴찌"
- "당신은 ~해야 합니다" (강압형)
- "다른 멤버보다 부족합니다"
- "0% 달성", "X점" (점수화 표현 일체)

**선호 표현:**
- "괜찮습니다", "오늘도 시작하셨네요"
- "천천히 가도 됩니다"
- "흔적이 남았습니다"
- "다시 시작" 버튼 (끊긴 streak 후 메인 액션)
- "Leave a trace" / "흔적을 남기다"

**예시 마이크로카피:**
```
✅ "0가지 완료 → 오늘도 동행을 시작합니다"
✅ "3가지 완료 → 천천히 가도 괜찮습니다"
✅ "7가지 완료 → 오늘의 모든 흔적이 남았습니다 ·"
❌ "7가지 미완료 → 오늘 0% 달성! 분발하세요"
```

### 6.4 컴포넌트 디자인 규칙

**버튼:**
- Primary: ink 배경 + cream 텍스트, 라운드 4px (절제된 모서리)
- Secondary: 1px ink 테두리 + transparent 배경
- 그라데이션 금지

**카드:**
- paper 배경 + line 테두리 (1px)
- 그림자는 없음 (또는 매우 미묘)
- 라운드 0~4px (절제)

**입력 필드:**
- 하단 1px 라인만 (박스형 X)
- 포커스시 burgundy 라인

**구분선 / 악센트:**
- gold 0.8px 가는 선 (Wordmark 분리자와 동일 톤)

---

## 7. 율법주의 방지 UX 규칙 (반드시 적용)

### 7.1 Streak 계산 규칙
- 4개 이상 완료한 날을 "흔적이 남은 날"로 인정 (7개 만점 강요 X)
- Streak이 끊겨도 화면에 "X일 동안 끊김" 같은 표시 금지
- 끊긴 후 첫 진입 화면은 "오늘 다시 시작" 메시지 + 가벼운 톤

### 7.2 비교 금지
- 구역 보드에서 멤버를 "랭킹"하지 않는다 (시간순 정렬만 허용)
- "당신은 X등" 같은 표현 일체 금지
- 평균/중앙값 비교는 본인 데이터에 한해서만

### 7.3 알림 규칙
- 푸시 알림은 옵트인 디폴트 (회원가입 즉시 ON 금지)
- 새벽기도 알림은 무음+진동만 (소리 X)
- "X일째 안 했어요" 같은 죄책감 트리거 금지
- 주간 요약은 일요일 저녁 1회만

### 7.4 가시성 디폴트
- 구역 가입 시 디폴트는 "총 개수만 공개"
- 카테고리별 공개로 바꾸려면 명시적 동의
- 구역장도 멤버의 노트/메모 절대 못 봄

### 7.5 게이미피케이션 절제
- 캐릭터 성장(타마고치류) 사용 금지 — 신앙적 부담
- 뱃지는 사용하되 "X일 연속" 같은 압박 메트릭 금지
- 성취 표시는 흔적(잔디)만, 점수화 금지

---

## 8. 핵심 기능 상세 스펙

### 8.1 일일 체크인
- **인터랙션:** 카테고리 row 탭 1회 → 즉시 토글 (저장 비동기)
- **상세 입력:** row 길게 누름 → 모달 (시간/메모/구절)
- **낙관적 업데이트:** 토글 즉시 반영, 실패 시 롤백
- **오프라인 지원:** 로컬 큐에 쌓고 온라인 시 동기화

### 8.2 성경 암송 SRS
- **알고리즘:** SM-2 변형 (간격: 1d → 3d → 7d → 14d → 30d → 90d → 180d)
- **정답률:** 4점 척도 (어려움/보통/쉬움/완벽)
- **학습 모드:**
  - 빈칸 채우기 (단어 일부 가림)
  - 음성 녹음 후 STT 비교
  - 첫 글자만 보기

### 8.3 구역 격려 보드 (Realtime)
- **표시:** 멤버명, 오늘 흔적 수(공유 설정 따름), 마지막 활동 시각
- **격려 보내기:** 이모지 5종 + 짧은 메시지(50자)
- **알림:** 받는 사람에게 푸시 (옵트아웃 가능)
- **Realtime:** Supabase Realtime으로 격려 즉시 표시

### 8.4 자가진단 (분기별)
- **A.W. 토저 7문항** 베이스
- **결과:** 7개 영역 레이더 차트 + 텍스트 해석 + 추천 훈련
- **이력:** 분기별 결과 시계열 그래프
- **알림:** 분기 시작일 1회만

### 8.5 통독표
- **기본:** 두란노 생명의삶 2026 일정
- **표시:** 오늘 본문 + 진도율 + 다음 본문
- **체크 시:** 자동으로 "말씀 읽기" 카테고리 완료 처리

---

## 9. API & 백엔드 명세

### 9.1 주요 RPC 함수

```sql
-- 오늘의 체크인 토글
create or replace function toggle_check(
  p_category_id uuid,
  p_date date default current_date
) returns daily_checks ...

-- 사용자 streak 계산
create or replace function get_user_streak(
  p_user_id uuid
) returns int ...

-- 이번 주 히트맵
create or replace function get_week_heatmap(
  p_user_id uuid,
  p_start_date date
) returns table (date date, completed_count int) ...

-- 구역 보드 데이터
create or replace function get_cell_board(
  p_cell_id uuid
) returns table (...) ...

-- SRS 다음 학습 카드
create or replace function get_next_memory_cards(
  p_user_id uuid,
  p_limit int default 10
) returns setof scripture_memory ...
```

### 9.2 Edge Functions

```
supabase/functions/
├─ daily-notification/        # cron: 매일 새벽/QT/저녁
├─ weekly-summary/            # cron: 일요일 저녁
├─ srs-update/                # 암송 학습 후 다음 일정 계산
├─ payment-webhook/           # 토스페이먼츠 웹훅
└─ ai-meditation/             # Premium: GPT 묵상 보조
```

---

## 10. 폴더 구조 (모바일)

```
src/
├─ app/                       # Expo Router 라우트 (§4.1)
├─ components/
│  ├─ brand/                  # ★ 워드마크, 모노그램 컴포넌트
│  │  ├─ Wordmark.tsx         # <Wordmark variant="horizontal" | "stacked" | "ko" | "en" />
│  │  └─ Monogram.tsx         # <Monogram size={...} mode="light"|"dark" />
│  ├─ ui/                     # 디자인 시스템 (Button, Card, Input...)
│  ├─ today/
│  ├─ journey/
│  ├─ cell/
│  └─ self/
├─ features/
│  ├─ auth/
│  ├─ check-in/
│  ├─ memory/                 # SRS
│  ├─ prayer/
│  ├─ assessment/
│  └─ subscription/
├─ lib/
│  ├─ supabase.ts
│  ├─ api/
│  ├─ stores/                 # Zustand
│  ├─ utils/
│  └─ hooks/
├─ theme/
│  ├─ tokens.ts
│  ├─ typography.ts           # ★ 폰트 위계 헬퍼
│  └─ index.ts
├─ types/
│  ├─ database.ts             # Supabase 자동생성
│  └─ domain.ts
├─ assets/
│  ├─ brand/                  # §2.5 참조
│  └─ fonts/
└─ i18n/                      # ko.json, en.json
```

---

## 11. MVP 빌드 순서 (스프린트 단위)

### Sprint 1 (1주차) — 기반 + 브랜드
- [ ] Expo 프로젝트 셋업 + EAS 빌드 환경
- [ ] Supabase 프로젝트 + 모든 테이블 + RLS
- [ ] **★ 브랜드 자산 SVG 제작** (워드마크 4종 + 모노그램 3종 + 앱 아이콘 모든 사이즈)
- [ ] **★ 폰트 임베드** (Noto Serif KR, Gowun Dodum, Cormorant Garamond)
- [ ] **★ `<Wordmark>`, `<Monogram>` 컴포넌트** + 디자인 토큰
- [ ] 핵심 UI 컴포넌트 5종 (Button, Card, Input, Checkbox, Modal)
- [ ] **★ 스플래시 스크린** (워드마크 페이드인)

### Sprint 2 (2주차) — 인증 + 온보딩
- [ ] 이메일/소셜 로그인 (카카오, 애플)
- [ ] 5단계 온보딩 플로우 (워드마크가 도입 화면 핵심)
- [ ] 교회 검색 (검색 + 직접 입력)
- [ ] 구역 코드 가입

### Sprint 3 (3주차) — 오늘 탭 (코어)
- [ ] 일일 체크인 화면 + 낙관적 업데이트
- [ ] 오늘의 말씀 카드 (정적 데이터)
- [ ] 7일 히트맵
- [ ] Streak 계산 RPC
- [ ] 카테고리 상세 입력 모달

### Sprint 4 (4주차) — 여정 탭
- [ ] 월간 히트맵
- [ ] 영역별 통계 (Recharts RN)
- [ ] 통독표 기본 (두란노 2026)

### Sprint 5 (5주차) — 구역 탭
- [ ] 구역 보드 (가시성 RLS 검증 필수)
- [ ] 격려 보내기 + Realtime 수신
- [ ] 가시성 설정 화면

### Sprint 6 (6주차) — 나 탭
- [ ] 자가진단 (토저 7문항)
- [ ] 성경암송 SRS (학습/추가)
- [ ] 기도수첩 아카이브
- [ ] 알림 설정

### Sprint 7 (7주차) — 알림 + 결제
- [ ] Expo Notifications 통합
- [ ] 새벽/QT/저녁 알림 cron (Edge Function)
- [ ] 토스페이먼츠 구독 결제
- [ ] Premium 게이팅

### Sprint 8 (8주차) — QA + 출시
- [ ] iOS TestFlight 베타
- [ ] Android Play Console 내부 테스트
- [ ] 5개 교회 베타 운영
- [ ] App Store / Play Store 심사 제출

---

## 12. 테스트 전략

### 12.1 단위 테스트 (Jest)
- SRS 알고리즘 (간격 계산)
- Streak 계산
- 가시성 RLS (테스트 DB로 모의)
- 카피 마이크로카피 매칭 함수

### 12.2 통합 테스트 (Detox / Maestro)
- 온보딩 → 첫 체크인 → 구역 가입 플로우
- 체크인 → 격려 받기 (구역 멤버 시뮬)
- 결제 플로우 (샌드박스)

### 12.3 베타 운영 (출시 전)
- 5개 교회, 100명 실사용 2주
- 매일 사용 패턴 분석 (Mixpanel)
- 출구 인터뷰 10건 이상

### 12.4 ★ 브랜드 일관성 테스트
- 모든 화면에서 폰트가 의도대로 렌더링되는지 시각적 검증
- iOS 16/17/18, Android 12/13/14에서 워드마크 자간·커닝 확인
- 다크모드에서 모노그램 콘트라스트 검증
- 작은 사이즈(48px 이하)에서 모노그램 가독성

---

## 13. 보안 & 개인정보

- **모든 PII**는 Supabase Auth 영역에만
- **기도제목·메모**는 절대 외부로 유출 금지 (백업도 암호화)
- 구역장 권한 상승 시 사용자 명시적 동의 필요
- 탈퇴 시 30일 유예 후 완전 삭제 (cascade)
- KISA 준수 + 개인정보처리방침 명확히

---

## 14. 출시 후 확장 (V2 백로그)

- 제자훈련 커리큘럼 통합 (사랑의교회·온누리·CCC 라이선스 협의)
- AI 묵상 동반자 (GPT-4o, 율법주의 방지 시스템 프롬프트 필수)
- 가족 그룹 (부부·부모자녀)
- 음성 기도 일기 (Whisper STT)
- Apple Watch 위젯 (오늘 체크 한 번에)
- 교회 콘텐츠 발행 도구 (목회자가 자체 QT 발행)
- **★ 한정판 모노그램 시즌 (절기별)** — 부활절·성탄절 한정 색상 변주

---

## 15. Claude Code 작업 시 체크리스트

매 작업 시작 전:
- [ ] 이 문서를 읽었는가?
- [ ] 작업 범위가 명확한가? 모호하면 사용자에게 질문
- [ ] §7 율법주의 방지 규칙에 위배되지 않는가?
- [ ] §2 브랜드 규칙에 위배되지 않는가? (폰트·색·금지사항)
- [ ] 데이터베이스 변경이라면 RLS 정책도 함께 수정?
- [ ] 작업 후 한국어 커밋 메시지 작성?

매 PR 전:
- [ ] 타입 에러 0
- [ ] Lint 에러 0
- [ ] 단위 테스트 통과
- [ ] 카피 톤 가이드 준수 (§6.3)
- [ ] 폰트 위계 가이드 준수 (§6.2)
- [ ] 다크모드 동작 확인
- [ ] 접근성: 폰트 크기 확대 시 깨지지 않음
- [ ] 워드마크/모노그램 사용 시 §2.2 규칙 준수

---

**이 문서가 진실의 근원이다.**
**의심스러우면 이 문서를 먼저 보고, 그래도 불명확하면 질문하라.**
**브랜드는 타이포그래피다. 폰트와 여백을 디테일로 취급하지 마라.**
