# 흔적 · Trace · Admin

> 교회 단위 영성훈련 운영 대시보드 (B2B). Next.js 14 App Router.

## 핵심 원칙

- 멤버의 **노트·메모·기도 응답은 절대 표시되지 않습니다.**
- 모든 수치는 **가시성 설정을 거친 익명·집계** 형태입니다.
- 멤버 랭킹 · 비교 · 정죄 표현은 어떤 화면에도 들어가지 않습니다.

## 라우트

| Path | 설명 |
|---|---|
| `/dashboard` | 활성 구성원 / 흔적의 날 비율 / 구역 수 / 공유 기도제목 |
| `/members` | 구성원 목록 (이름·교회 가입일·역할만) |
| `/cells` | 구역 단위 활성도 |
| `/trainings` | 교회 단위 커스텀 훈련 항목 관리 |
| `/content` | 자체 큐티·공지 발행 |
| `/analytics` | 익명 집계 통계 |
| `/settings` | 교회 정보·라이선스·관리자 권한 |

## 로컬 실행

```bash
pnpm install
cp .env.example .env.local  # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev
```

## 배포

- Vercel (도메인: `admin.trace.faith` 또는 `흔적.한국`)
- 모바일 앱과 동일한 Supabase 프로젝트 공유, 관리자 RLS 정책 별도 검토 필요.
