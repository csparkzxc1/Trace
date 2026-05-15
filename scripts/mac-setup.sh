#!/usr/bin/env bash
# 흔적 · Trace — 새 맥북 셋업 + Xcode 실행 (한 번에)
#
# 전제: Xcode + Homebrew 가 이미 설치되어 있어야 함.
#   - Xcode: App Store 에서 설치 후 한 번 실행, 라이선스 동의 + Apple ID 로그인
#   - Homebrew: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
#
# 사용:
#   chmod +x scripts/mac-setup.sh
#   ./scripts/mac-setup.sh
#
# 작업:
#   1) brew 패키지 (node@20, pnpm, watchman, cocoapods) 확인·설치
#   2) pnpm install
#   3) typecheck (실패하면 중단)
#   4) npx expo prebuild --platform ios --clean
#   5) cd ios && pod install
#   6) open ios/Trace.xcworkspace
#
# 이후 Xcode 안에서:
#   - 좌측 Trace 프로젝트 → Signing & Capabilities → Team 본인 Apple ID 선택
#   - 시뮬레이터 또는 폰 선택 후 ▶ Run

set -e

cd "$(dirname "$0")/.."
echo "📁 작업 디렉터리: $(pwd)"

# ============================================================================
# 1) brew 패키지
# ============================================================================
if ! command -v brew >/dev/null 2>&1; then
  echo "❌ Homebrew 가 설치되어 있지 않습니다."
  echo "   설치: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
  exit 1
fi

echo ""
echo "🍺 Homebrew 패키지 확인…"
for pkg in node@20 pnpm watchman cocoapods; do
  if brew list "$pkg" >/dev/null 2>&1; then
    echo "  ✓ $pkg"
  else
    echo "  → $pkg 설치 중"
    brew install "$pkg"
  fi
done

# node@20 PATH 우선순위
if ! node -v 2>/dev/null | grep -q "^v20"; then
  echo "  → node@20 PATH 적용"
  brew link --force --overwrite node@20 || true
fi

# ============================================================================
# 2) pnpm install
# ============================================================================
echo ""
echo "📦 pnpm install…"
pnpm install

# ============================================================================
# 3) typecheck
# ============================================================================
echo ""
echo "🔍 typecheck…"
pnpm typecheck

# ============================================================================
# 4) Expo prebuild (ios/ 폴더 생성)
# ============================================================================
echo ""
echo "🔧 expo prebuild (iOS native 폴더 생성)…"
npx expo prebuild --platform ios --clean

# ============================================================================
# 5) pod install
# ============================================================================
echo ""
echo "🍎 CocoaPods 설치…"
cd ios
pod install --repo-update
cd ..

# ============================================================================
# 6) Xcode 열기
# ============================================================================
echo ""
echo "🚀 Xcode 워크스페이스 열기"
open ios/Trace.xcworkspace

cat <<'EOF'

═══════════════════════════════════════════════════════════════
✓ 셋업 완료

다음 단계 (Xcode 안에서):

  1. 좌측 트리 Trace 프로젝트 클릭
  2. Signing & Capabilities 탭
     - Automatically manage signing ✅
     - Team: 본인 Apple ID 선택
     - Bundle ID 충돌 시 'faith.trace.app.cspark' 처럼 변경
  3. 상단 디바이스: iPhone 15 Pro (시뮬레이터) 또는 본인 폰
  4. ▶ Run (또는 Cmd+R)

별도 터미널에서 Metro 번들러:
  pnpm start

환경변수 (가입·로그인 동작시키려면):
  cp .env.example .env.local
  # .env.local 편집 — Supabase URL/ANON_KEY 입력

═══════════════════════════════════════════════════════════════
EOF
