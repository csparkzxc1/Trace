// B2B admin 통계 쿼리. 모두 익명·집계 형태로만 노출 (§13).
// 멤버 노트·메모는 어떤 쿼리에도 포함되지 않음 — 컬럼 선택 단계에서 차단.

import { createSupabaseServerClient } from "./supabase-server";

const TRACE_THRESHOLD = 4;

export type DashboardStats = {
  activeMembers: number;
  traceDayRate: number; // 0~1
  cellCount: number;
  sharedPrayers: number;
};

function isoDaysAgo(n: number): string {
  return new Date(Date.now() - n * 86400_000).toISOString().slice(0, 10);
}

export async function fetchDashboardStats(
  churchId: string,
): Promise<DashboardStats> {
  const sb = createSupabaseServerClient();
  const sevenAgo = isoDaysAgo(7);
  const oneAgo = isoDaysAgo(1);

  // 1) 활성 멤버 — 지난 7일 안에 1회 이상 흔적
  const { data: membersInChurch } = await sb
    .from("users")
    .select("id")
    .eq("church_id", churchId);
  type IdRow = { id: string };
  const memberIds = ((membersInChurch ?? []) as IdRow[]).map((m) => m.id);

  if (memberIds.length === 0) {
    return { activeMembers: 0, traceDayRate: 0, cellCount: 0, sharedPrayers: 0 };
  }

  const { data: recentChecksRaw } = await sb
    .from("daily_checks")
    .select("user_id, date, completed")
    .in("user_id", memberIds)
    .eq("completed", true)
    .gte("date", sevenAgo);
  type CheckRow = { user_id: string; date: string };
  const recentChecks = (recentChecksRaw ?? []) as CheckRow[];

  const activeIds = new Set(recentChecks.map((r) => r.user_id));

  // 2) 흔적의 날 비율 — 지난 7일 동안의 (user, date) 별 카운트 ≥ TRACE_THRESHOLD 비율
  const dayCount = new Map<string, number>();
  for (const r of recentChecks) {
    const k = `${r.user_id}|${r.date}`;
    dayCount.set(k, (dayCount.get(k) ?? 0) + 1);
  }
  const totalUserDays = memberIds.length * 7;
  const traceDays = [...dayCount.values()].filter(
    (n) => n >= TRACE_THRESHOLD,
  ).length;
  const traceDayRate = totalUserDays > 0 ? traceDays / totalUserDays : 0;

  // 3) 활성 구역
  const { count: cellCount } = await sb
    .from("cells")
    .select("id", { count: "exact", head: true })
    .eq("church_id", churchId);

  // 4) 이번 주 등록된 공유 기도제목
  const { count: sharedPrayers } = await sb
    .from("prayer_journal")
    .select("id", { count: "exact", head: true })
    .in("user_id", memberIds)
    .eq("is_shared_to_cell", true)
    .gte("created_at", `${sevenAgo}T00:00:00Z`);

  void oneAgo;
  return {
    activeMembers: activeIds.size,
    traceDayRate,
    cellCount: cellCount ?? 0,
    sharedPrayers: sharedPrayers ?? 0,
  };
}
