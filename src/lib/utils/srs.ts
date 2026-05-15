// §8.2 SRS — SM-2 변형
// 정답률(quality): 0=어려움, 1=보통, 2=쉬움, 3=완벽
// 간격: 1d → 3d → 7d → 14d → 30d → 90d → 180d (level별)

import type { SrsQuality } from "@/types/domain";

export const SRS_INTERVALS_DAYS = [1, 3, 7, 14, 30, 90, 180] as const;

export type SrsState = {
  level: number;
  easeFactor: number;
  totalReviews: number;
};

export type SrsResult = {
  level: number;
  easeFactor: number;
  totalReviews: number;
  intervalDays: number;
  nextReviewDelayMs: number;
};

export function reviewCard(state: SrsState, quality: SrsQuality): SrsResult {
  const totalReviews = state.totalReviews + 1;

  // 어려움: level 초기화, ease 감소
  if (quality === 0) {
    const easeFactor = Math.max(1.3, state.easeFactor - 0.2);
    return {
      level: 0,
      easeFactor,
      totalReviews,
      intervalDays: SRS_INTERVALS_DAYS[0],
      nextReviewDelayMs: SRS_INTERVALS_DAYS[0] * 86400_000,
    };
  }

  // 정답률에 따라 ease 조정
  const delta = quality === 1 ? -0.05 : quality === 2 ? 0 : 0.1;
  const easeFactor = Math.max(1.3, state.easeFactor + delta);

  const nextLevel = Math.min(SRS_INTERVALS_DAYS.length - 1, state.level + 1);
  const baseInterval = SRS_INTERVALS_DAYS[nextLevel] ?? SRS_INTERVALS_DAYS[0];
  const intervalDays = Math.max(
    1,
    Math.round(baseInterval * (easeFactor / 2.5)),
  );

  return {
    level: nextLevel,
    easeFactor,
    totalReviews,
    intervalDays,
    nextReviewDelayMs: intervalDays * 86400_000,
  };
}
