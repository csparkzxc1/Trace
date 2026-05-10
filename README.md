# 흔적 · Trace

> *"신앙은 점수가 아닌 흔적입니다."*
> *"Leave a trace, not a score."*

한국 개신교 신자를 위한 영성훈련 체크리스트 + 소그룹 책임감 앱.

## 단일 진실 소스 (SSOT)

이 프로젝트의 모든 결정은 [`CLAUDE.md`](./CLAUDE.md)를 따릅니다.
새로운 작업을 시작하기 전 반드시 해당 문서를 먼저 읽어주세요.

## 브랜드

**브랜드는 타이포그래피다.** 자세한 사용 규칙은
[`assets/brand/guidelines.md`](./assets/brand/guidelines.md) 참조.

## 구조

```
.
├─ src/                    # 모바일 앱 (Expo + React Native)
│  ├─ app/                 # Expo Router 라우트
│  │  ├─ (auth)/           # welcome / login / signup / onboarding × 5
│  │  └─ (tabs)/           # today / journey / cell / self
│  ├─ components/
│  │  ├─ brand/            # Wordmark · Monogram · BrandSplash
│  │  ├─ ui/               # Button · Card · Input · Checkbox · Modal · ScreenContainer · StepHeader
│  │  ├─ today/            # CategoryRow · VerseCard · WeekHeatmap
│  │  ├─ journey/          # MonthHeatmap · CategoryStats
│  │  └─ cell/             # MemberRow
│  ├─ features/            # auth(onboarding-store) · check-in(use-today)
│  ├─ lib/
│  │  ├─ api/              # auth · categories · checkin · cell · memory · prayer · settings · assessment · journey
│  │  ├─ stores/           # Zustand (auth · checkin)
│  │  ├─ utils/            # date · microcopy · streak · srs · categories
│  │  ├─ data/             # verses · reading-plan · tozer-assessment
│  │  └─ hooks/            # useColorTone · useSessionBootstrap
│  ├─ theme/               # tokens · typography
│  ├─ types/               # database (Supabase 1:1 매칭) · domain
│  └─ i18n/                # ko.json
├─ assets/
│  ├─ brand/               # 워드마크 4종 · 모노그램 3종 · 스플래시 2종 · guidelines.md
│  └─ fonts/
├─ supabase/
│  ├─ migrations/          # 0001 schema · 0002 RLS · 0003 RPC functions
│  └─ functions/           # daily-notification · weekly-summary · srs-update · payment-webhook · ai-meditation
├─ admin/                  # B2B Next.js 14 대시보드
│  └─ src/app/             # dashboard · members · cells · trainings · content · analytics · settings
└─ docs/
```

## 시작하기

```bash
# 모바일 앱
pnpm install
cp .env.example .env.local      # Supabase URL/ANON_KEY 입력
pnpm start

# B2B admin
cd admin
pnpm install
cp ../.env.example .env.local
pnpm dev

# Supabase 마이그레이션
supabase link --project-ref <ref>
supabase db push                # 0001 → 0002 → 0003 순차 적용
supabase functions deploy daily-notification
supabase functions deploy weekly-summary
supabase functions deploy srs-update
supabase functions deploy payment-webhook
supabase functions deploy ai-meditation
```

## 핵심 원칙 (요약)

1. **사용자의 영적 안전** > 기능성 > 성능 > 코드 우아함
2. **율법주의 방지 UX** — 점수화·비교·죄책감 트리거 금지 (§7)
3. **타이포그래피가 곧 브랜드** — 폰트·자간·여백은 정체성 (§2 · §6.2)
4. 한국어 커밋 메시지, 작은 단위 커밋

## 테스트

```bash
pnpm test               # SRS · streak · microcopy · date · tozer
pnpm typecheck
```

## 진척 상황

| Sprint | 항목 | 상태 |
|---|---|---|
| 1 | Expo 셋업, 디자인 토큰, 브랜드 컴포넌트, UI 5종, 스플래시, Supabase 스키마+RLS | 완료 |
| 2 | 인증, 5단계 온보딩 | 완료 |
| 3 | 오늘 탭 (체크인·히트맵·말씀) | 완료 |
| 4 | 여정 탭 (월간 히트맵·영역별·통독표) | 완료 |
| 5 | 구역 탭 (보드·격려·가시성·기도제목·구역장) | 완료 |
| 6 | 나 탭 (자가진단·SRS·기도수첩·설정) | 완료 |
| 7 | Edge Functions + Realtime 보드 + 푸시 클라 등록 + 오프라인 큐 | 완료 (실제 키·cron은 사용자 환경) |
| 8 | QA · 베타 · 출시 | RLS 통합 테스트 10개 시나리오 작성, 베타 운영 사용자 환경 |

추가:
- B2B Admin Next.js 스켈레톤
- 단위 테스트 5개 파일

## 자세한 명세는 CLAUDE.md를 보세요.
