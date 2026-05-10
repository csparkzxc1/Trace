# 흔적 · Trace

> *"신앙은 점수가 아닌 흔적입니다."*
> *"Leave a trace, not a score."*

한국 개신교 신자를 위한 영성훈련 체크리스트 + 소그룹 책임감 앱.

## 단일 진실 소스 (SSOT)

이 프로젝트의 모든 결정은 [`CLAUDE.md`](./CLAUDE.md)를 따릅니다. 새로운 작업을 시작하기 전 반드시 해당 문서를 먼저 읽어주세요.

## 브랜드

**브랜드는 타이포그래피다.** 심볼·아이콘·일러스트가 아닙니다. 자세한 사용 규칙은 [`assets/brand/guidelines.md`](./assets/brand/guidelines.md) 참조.

- 한국 시장 표기: **흔적**
- 글로벌 표기: **Trace**
- 정식 표기: **흔적 · Trace**
- 모노그램: **흔**

## 구조

```
.
├─ src/                  # 모바일 앱 (Expo + React Native)
│  ├─ app/               # Expo Router 라우트
│  ├─ components/        # UI · 브랜드 컴포넌트
│  ├─ features/          # 기능 단위 모듈
│  ├─ lib/               # supabase, stores, utils, hooks
│  ├─ theme/             # 디자인 토큰
│  ├─ types/
│  └─ i18n/
├─ assets/
│  ├─ brand/             # 워드마크 · 모노그램 · 앱 아이콘
│  └─ fonts/
├─ supabase/
│  ├─ migrations/        # SQL 스키마 + RLS
│  └─ functions/         # Edge Functions
├─ admin/                # B2B Next.js 대시보드
└─ docs/
```

## 핵심 원칙 (요약)

1. **사용자의 영적 안전** > 기능성 > 성능 > 코드 우아함
2. **율법주의 방지 UX** — 점수화·비교·죄책감 트리거 금지
3. **타이포그래피가 곧 브랜드** — 폰트·자간·여백은 정체성
4. 한국어 커밋 메시지, 작은 단위 커밋

자세한 규칙은 [`CLAUDE.md`](./CLAUDE.md) §0 · §6 · §7 참조.
