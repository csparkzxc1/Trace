# 흔적 · Trace — 브랜드 가이드라인

> 이 문서는 [`CLAUDE.md`](../../CLAUDE.md) §2의 발췌·확장입니다. 충돌 시 CLAUDE.md가 우선합니다.

## 0. 핵심 원칙

**브랜드는 타이포그래피다.** 심볼·아이콘·일러스트가 아닙니다. "흔적"이라는 단어 자체와 그것이 종이 위에 놓이는 방식이 정체성입니다.

## 1. 표기

| 맥락 | 표기 |
|---|---|
| 한국 시장 | 흔적 |
| 글로벌 | Trace |
| 정식 (스토어·법적 문서) | 흔적 · Trace |
| 모노그램 (파비콘·작은 아이콘) | 흔 |

**태그라인:**
- 한글: *신앙은 점수가 아닌 흔적입니다.*
- 영문: *Leave a trace, not a score.*

## 2. 금지 / 허용

### 금지
- 십자가, 비둘기, 성경책 일러스트
- 그라데이션, 네온, 글로우
- 캐릭터, 마스코트
- 임의의 아이콘·이모지를 로고에 추가
- 라운드 코너 16px 이상 (절제된 모서리 사용)

### 허용
- 활자 그 자체 (Noto Serif KR · Cormorant Garamond Italic)
- 절제된 금색 가는 선 (구분자, 0.8px)
- 종이 톤 배경 + 깊은 잉크색 텍스트
- 모노그램 "흔" (단일 한글 자소)

## 3. 색상

| 토큰 | HEX | 용도 |
|---|---|---|
| `cream` | `#F5F1E8` | 종이 — 메인 배경 |
| `creamDeep` | `#ECE5D3` | 종이 그림자 |
| `paper` | `#FAF7EE` | 카드 배경 |
| `ink` | `#1F2A37` | 먹 — 메인 텍스트 |
| `inkSoft` | `#4A5568` | 보조 텍스트 |
| `gold` | `#B8924F` | 금 — 라벨, 악센트, 분리자 |
| `goldSoft` | `#D4B57A` | 금 — 다크모드 악센트 |
| `burgundy` | `#7A2E2E` | 자주 — 강조, 태그라인 |
| `sage` | `#6B7F5A` | 평안 그린 — 긍정 상태 |

## 4. 폰트 패밀리

| 역할 | 폰트 | 비고 |
|---|---|---|
| Display (한글 세리프) | Noto Serif KR | 제목, 말씀, 워드마크 |
| Body (한글 산세리프) | Gowun Dodum | 본문, 버튼 |
| Accent (영문 이탤릭) | Cormorant Garamond | 라벨, 숫자, "Trace" |

**원칙:**
- 한글과 영문은 항상 다른 폰트 가족을 사용 (혼합되어도 구분되도록)
- 숫자는 항상 Cormorant Garamond — 통계가 "활자"처럼 보이게
- 영문 라벨은 항상 Italic — 한국어 본문과 시각적 분리

## 5. 로고 락업

### 5.1 Primary Lockup (가로형)

```
흔적 · Trace
```

| 요소 | 폰트 | 색상 |
|---|---|---|
| `흔적` | Noto Serif KR Medium | `ink` |
| `·` (분리자) | Cormorant Garamond Regular | `gold`, 양쪽 0.15em 마진 |
| `Trace` | Cormorant Garamond Italic Medium | `ink` |

### 5.2 Stacked Lockup (앱 헤더용)

```
흔적
TRACE
```

- `흔적` 큰 글씨 (Noto Serif KR Medium)
- `TRACE`는 작은 영문 대문자 + 자간 0.3em + `gold` 컬러

### 5.3 Monogram

```
흔
```

용도: 앱 아이콘 작은 사이즈, 파비콘, 소셜 프로필.

| 모드 | 배경 | 글자 |
|---|---|---|
| Light | `cream` | `ink` |
| Dark  | `ink` | `cream` |
| Gold (특별) | `cream` | `gold` |

## 6. 앱 아이콘 스펙

| 사이즈 | 콘텐츠 | 비고 |
|---|---|---|
| 1024×1024 (마스터) | "흔" 모노그램 | App Store 마스터 |
| 512×512, 256×256 | "흔" 모노그램 | 마켓플레이스 |
| 180×180, 120×120 | "흔" 모노그램 | iOS 홈 스크린 |
| 96×96 이하 | "흔" 모노그램 (Bold) | 알림, 위젯 |
| 32×32, 16×16 | "흔" 모노그램 (Bold) | 파비콘 |

**iOS 라운드 코너:** 시스템이 자동으로 클리핑함. 정사각형 위에 `cream` 배경 + 모노그램 중앙 배치만. 아이콘 자체엔 라운드 코너 적용하지 않음.

**작은 사이즈에서 가독성을 위해 글자 굵기를 한 단계 올림 (Medium → Bold).**

## 7. 스플래시

- 배경: `cream` (#F5F1E8)
- 중앙: `흔적 · Trace` 워드마크 (페이드인 0.6s)
- 하단: 태그라인 *신앙은 점수가 아닌 흔적입니다.* (페이드인 0.4s, 0.3s 지연)
- 총 시간: 1.2~1.5초

## 8. 자산 폴더

```
assets/brand/
├─ wordmark/
│  ├─ wordmark-horizontal.svg
│  ├─ wordmark-stacked.svg
│  ├─ wordmark-en-only.svg     # Trace 단독
│  └─ wordmark-ko-only.svg     # 흔적 단독
├─ monogram/
│  ├─ monogram-light.svg       # cream bg + ink
│  ├─ monogram-dark.svg        # ink bg + cream
│  └─ monogram-gold.svg        # 특별 사용
├─ app-icons/
│  ├─ ios/
│  └─ android/
└─ splash/
   ├─ splash-light.svg
   └─ splash-dark.svg
```

## 9. 검수 체크리스트

새 화면·자산을 추가할 때 확인:

- [ ] 그라데이션·네온·글로우를 쓰지 않았는가?
- [ ] 십자가·비둘기·성경 일러스트를 추가하지 않았는가?
- [ ] 한글과 영문에 다른 폰트 가족을 사용했는가?
- [ ] 숫자는 Cormorant Garamond를 썼는가?
- [ ] 영문 라벨은 Italic + 자간 0.2em인가?
- [ ] 라운드 코너가 과하지 않은가 (≤ 4px)?
- [ ] 다크모드 콘트라스트가 충분한가?
- [ ] 작은 사이즈(48px 이하)에서 모노그램이 읽히는가?
