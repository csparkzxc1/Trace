import { supabase } from "@/lib/supabase";
import { startOfMonth, addDays, todayIso } from "@/lib/utils/date";

export async function fetchMonthHeatmap(
  userId: string,
  monthStart: string = startOfMonth(todayIso()),
): Promise<{ date: string; count: number }[]> {
  const monthEnd = addDays(monthStart, 32);
  const { data, error } = await supabase
    .from("daily_checks")
    .select("date, completed")
    .eq("user_id", userId)
    .gte("date", monthStart)
    .lt("date", monthEnd);
  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    if (row.completed) {
      map.set(row.date, (map.get(row.date) ?? 0) + 1);
    }
  }

  // Build full month range
  const firstDay = new Date(monthStart);
  const month = firstDay.getMonth();
  const result: { date: string; count: number }[] = [];
  let cursor = monthStart;
  while (new Date(cursor).getMonth() === month) {
    result.push({ date: cursor, count: map.get(cursor) ?? 0 });
    cursor = addDays(cursor, 1);
  }
  return result;
}

export async function fetchCategoryStats(
  userId: string,
  monthStart: string = startOfMonth(todayIso()),
): Promise<{ category_id: string; count: number }[]> {
  const monthEnd = addDays(monthStart, 32);
  const { data, error } = await supabase
    .from("daily_checks")
    .select("category_id, completed")
    .eq("user_id", userId)
    .eq("completed", true)
    .gte("date", monthStart)
    .lt("date", monthEnd);
  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    map.set(row.category_id, (map.get(row.category_id) ?? 0) + 1);
  }
  return [...map.entries()].map(([category_id, count]) => ({
    category_id,
    count,
  }));
}
