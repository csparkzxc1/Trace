import { TRACE_THRESHOLD, type CheckSummary } from "@/types/domain";
import { addDays, todayIso } from "./date";

export function isTraceDay(completedCount: number): boolean {
  return completedCount >= TRACE_THRESHOLD;
}

export function calculateStreak(
  summaries: CheckSummary[],
  reference: string = todayIso(),
): number {
  const map = new Map(summaries.map((s) => [s.date, s.isTraceDay]));
  let streak = 0;
  let cursor = reference;
  while (map.get(cursor) === true) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
