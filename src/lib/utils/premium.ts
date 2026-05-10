import type { UserProfile } from "@/types/database";

// 구독 상태 판별 헬퍼.
// is_premium=true 이고 premium_until 이 오늘 이후면 활성.
// premium_until=null 인 경우(평생 또는 운영 부여)도 활성.
export function isPremiumActive(
  profile: Pick<UserProfile, "is_premium" | "premium_until"> | null,
  now: Date = new Date(),
): boolean {
  if (!profile?.is_premium) return false;
  if (!profile.premium_until) return true;
  const untilMs = new Date(profile.premium_until).getTime() + 86400_000; // 끝나는 날 포함
  return untilMs > now.getTime();
}

export type PremiumFeature =
  | "unlimited_prayer"
  | "discipleship"
  | "ai_meditation"
  | "advanced_stats";

export const FREE_PRAYER_LIMIT = 30;

export function canUseFeature(
  profile: Pick<UserProfile, "is_premium" | "premium_until"> | null,
  feature: PremiumFeature,
  now: Date = new Date(),
): boolean {
  // 본 스펙에선 모든 Premium 기능이 동일 게이트 — 구독 활성 여부.
  // 미래에 기능별 차등 시 분기 추가.
  void feature;
  return isPremiumActive(profile, now);
}
