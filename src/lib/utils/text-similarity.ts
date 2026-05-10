// 한국어 음성 인식 결과와 정답 구절을 비교하는 단순 유사도.
// 1) 한글·영문·숫자 외 문자 제거
// 2) 토큰화 후 Levenshtein 비율 계산
//
// SRS 음성 모드에서는 90%+ 만 "완벽", 70~89% "쉬움", 50~69% "보통",
// 50% 미만 "어려움" 으로 매핑하는 휴리스틱에 사용.

const KEEP_RE = /[^가-힯ㄱ-ㆎa-zA-Z0-9]/g;

export function normalizeText(s: string): string {
  return s.replace(KEEP_RE, "").toLowerCase();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]!;
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j]!, dp[j - 1]!);
      prev = tmp;
    }
  }
  return dp[b.length]!;
}

export function similarity(target: string, said: string): number {
  const a = normalizeText(target);
  const b = normalizeText(said);
  if (!a.length && !b.length) return 1;
  if (!a.length || !b.length) return 0;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return 1 - dist / maxLen;
}

import type { SrsQuality } from "@/types/domain";

export function qualityFromSimilarity(score: number): SrsQuality {
  if (score >= 0.9) return 3;
  if (score >= 0.7) return 2;
  if (score >= 0.5) return 1;
  return 0;
}
