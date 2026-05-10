# 흔적 · Trace — 베타 출시 체크리스트

> CLAUDE.md §11 Sprint 8 · §12.3 베타 운영 보강.
> 5개 교회 · 100명 · 2주 운영을 목표로 한다.

## 0. 사전 준비 (1회)

### 0.1 계정·키
- [ ] Apple Developer Program 등록 ($99/yr)
- [ ] Google Play Console 등록 ($25 1회)
- [ ] Expo 계정 + EAS 활성화
- [ ] Supabase 프로젝트 생성 (region: ap-northeast-2 권장)
- [ ] Supabase Edge Functions 활성, Service Role Key 백업
- [ ] 토스페이먼츠 가맹점 신청 (KYC 1~2주 소요)
- [ ] Anthropic API Key (ai-meditation 용)
- [ ] Sentry / Mixpanel 프로젝트 (선택)

### 0.2 Supabase 마이그레이션
```bash
supabase link --project-ref <ref>
supabase db push                       # 0001 → 0002 → 0003 → 0004
psql "$DB_URL" -f supabase/tests/0001_visibility_rls.sql   # 모든 시나리오 통과 확인
```

### 0.3 Edge Function 배포 + Secrets
```bash
supabase functions deploy daily-notification
supabase functions deploy weekly-summary
supabase functions deploy srs-update
supabase functions deploy payment-webhook
supabase functions deploy ai-meditation

supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxx
supabase secrets set TOSS_SECRET_KEY=test_sk_xxx
supabase secrets set TOSS_WEBHOOK_SECRET=whsec_xxx
```

### 0.4 Cron 등록 (Supabase Dashboard → Database → Cron)
| 함수 | 일정 (KST) | 비고 |
|---|---|---|
| daily-notification (slot=morning_prayer) | `*/5 * * * *` | 사용자별 시간 매칭은 함수 내부 |
| daily-notification (slot=qt) | `*/5 * * * *` | 동일 |
| daily-notification (slot=evening_review) | `*/5 * * * *` | 동일 |
| weekly-summary | `0 19 * * 0` | 일요일 저녁 7시 (§7.3) |

## 1. 환경변수

### 1.1 모바일 앱
`.env.local` (개발용, 커밋 X) — `.env.example` 참조

EAS 빌드 시 Expo Secrets 등록:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value https://...
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value ...
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value ...
```

### 1.2 admin (Vercel)
Vercel 프로젝트 → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. 빌드 (EAS)

`eas.json` 프로파일:
- `development` — 개발 클라이언트 (DevTools, Reanimated debug)
- `preview` — TestFlight / Internal Track 배포 (베타 운영용)
- `production` — App Store / Play Store 심사용

```bash
# 1) 첫 빌드 (자격증명 자동 생성)
eas build --platform ios --profile preview
eas build --platform android --profile preview

# 2) TestFlight / Internal Track 업로드
eas submit --platform ios --profile preview --latest
eas submit --platform android --profile preview --latest

# 3) 베타 종료 후 production 빌드
eas build --platform all --profile production
eas submit --platform all --profile production --latest
```

## 3. 앱 아이콘 / 스플래시 자산 보강

현재 SVG 아이콘은 system font fallback 의존. 출시 전:
- [ ] 디자이너가 모노그램 SVG를 outline path로 변환 (폰트 비종속)
- [ ] 1024 PNG 마스터 → 모든 iOS/Android 사이즈 렌더 (App Icon Kit 또는 expo-cli)
- [ ] 다크모드 tinted 아이콘 (iOS 18+) 검증
- [ ] 스플래시 다크 변형 시각 검증

## 4. 사전 검증 (체크리스트)

### 4.1 코드
- [ ] `pnpm typecheck` (모바일 + admin) 통과
- [ ] `pnpm test` 통과
- [ ] `eslint .` 0 에러
- [ ] CLAUDE.md §15 PR 체크리스트 모두 통과

### 4.2 데이터·보안 (§13)
- [ ] `supabase/tests/0001_visibility_rls.sql` 모든 시나리오 통과
- [ ] 컬럼 권한(0004) 적용 확인 (`\dp daily_checks` 에서 anon 권한 없음)
- [ ] 개인정보처리방침·이용약관 페이지 게시
- [ ] KISA 가이드 준수 검토
- [ ] Sentry breadcrumb에 PII 마스킹 확인

### 4.3 율법주의 방지 UX (§7)
- [ ] 모든 화면 카피가 §6.3 금기어 체크 통과 (`isSafeCopy()` 단위 테스트)
- [ ] 푸시는 옵트인 디폴트 OFF 확인
- [ ] 새벽기도 알림 채널 sound:null + LOW importance
- [ ] 구역 보드에 랭킹·점수 표시 없음
- [ ] 끊긴 streak 후 화면이 "오늘 다시 시작" 톤

### 4.4 브랜드 (§2)
- [ ] 모든 화면에서 폰트 5종이 정상 렌더 (iOS 16/17/18, Android 12/13/14)
- [ ] 워드마크 자간·커닝 시각 검증
- [ ] 모노그램 작은 사이즈(≤48px) 가독성
- [ ] 다크모드 콘트라스트
- [ ] 그라데이션·이모지 일러스트 일체 없음

### 4.5 결제·구독
- [ ] 토스페이먼츠 샌드박스 결제 성공
- [ ] 웹훅 시그니처 검증 통과
- [ ] Premium 게이팅 작동 (구독 만료 후 Free 다운그레이드)
- [ ] 환불 처리 흐름 검증

## 5. 베타 운영

### 5.1 5개 교회 모집
- [ ] 협력 교회 5곳 컨택 (1차: 25-55세 제자훈련 수료자 보유)
- [ ] 교회별 안내 자료 + Onboarding 영상 (3분 이내)
- [ ] TestFlight 초대 / Play Internal 초대 발송

### 5.2 일일 모니터링
- Mixpanel 대시보드: DAU·체크인율·구역 가입율
- Sentry: 에러율 / Crash-Free Sessions ≥ 99.5%
- 사용자 문의 채널 (카카오톡 채널 또는 이메일)

### 5.3 출구 인터뷰 (10건+)
질문 예시:
- 율법주의·죄책감을 느낀 순간이 있었습니까?
- 구역 가시성 설정이 직관적이었습니까?
- 알림 빈도/시간이 적절했습니까?
- 가장 자주 쓴 기능 / 한 번도 안 쓴 기능?
- 브랜드 톤(타이포·종이 미감)에 대한 인상?

## 6. 출시

- [ ] 베타 피드백 반영 패치
- [ ] App Store 심사 제출 (한국·영문 양쪽 메타데이터)
- [ ] Play Store Rolling Release (10% → 50% → 100%)
- [ ] 출시 후 24시간 모니터링 당직

## 부록 A — 자주 막히는 지점

- **iOS 알림 권한 거부 후 재요청 불가**: 시스템 설정 안내 카피 (§7.3 정책상 죄책감 트리거 X)
- **Android 13+ POST_NOTIFICATIONS**: targetSdk 33+ 시 expo-notifications 기본 처리됨
- **Supabase RLS Pessimistic 동작**: SELECT 0 row 시 에러가 아닌 빈 배열. 본인 데이터 누락은 cell_id 미설정 의심.
- **토스 웹훅 IP 화이트리스트**: 가맹점 페이지에서 Edge Function 도메인 등록 필요.
