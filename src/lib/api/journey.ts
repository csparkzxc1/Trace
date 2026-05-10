import { supabase } from "@/lib/supabase";
import { startOfMonth, addDays, todayIso, rangeDays } from "@/lib/utils/date";
import type { CategorySlug, TrainingCategory } from "@/types/database";
import type { DayActivity } from "@/lib/utils/rhythm";

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

export async function fetchYearActivity(
  userId: string,
  year: number,
  categories: TrainingCategory[],
): Promise<DayActivity[]> {
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year + 1}-01-01`;
  const { data, error } = await supabase
    .from("daily_checks")
    .select("date, completed, category_id")
    .eq("user_id", userId)
    .eq("completed", true)
    .gte("date", yearStart)
    .lt("date", yearEnd);
  if (error) throw error;

  const slugById = new Map(categories.map((c) => [c.id, c.slug as CategorySlug]));
  const map = new Map<string, DayActivity>();
  const allDays = rangeDays(yearStart, 366).filter((d) => d.startsWith(`${year}-`));
  for (const d of allDays) {
    map.set(d, { date: d, count: 0, byCategory: {} });
  }

  for (const row of data ?? []) {
    const day = map.get(row.date);
    if (!day) continue;
    day.count += 1;
    const slug = slugById.get(row.category_id);
    if (slug) {
      day.byCategory[slug] = (day.byCategory[slug] ?? 0) + 1;
    }
  }

  return [...map.values()];
}

export async function fetchRecentTraces(
  userId: string,
  limit = 7,
): Promise<{ date: string; categorySlug: CategorySlug; categoryKo: string; note: string | null }[]> {
  const { data, error } = await supabase
    .from("daily_checks")
    .select("date, category_id, note, scripture_ref, training_categories(slug, name_ko)")
    .eq("user_id", userId)
    .eq("completed", true)
    .order("updated_at", { ascending: false })
    .limit(limit * 2);
  if (error) throw error;

  return (data ?? []).map((row) => {
    const cat = (row as { training_categories: { slug: string; name_ko: string } | null }).training_categories;
    return {
      date: row.date,
      categorySlug: (cat?.slug ?? "worship") as CategorySlug,
      categoryKo: cat?.name_ko ?? "흔적",
      note: row.note ?? row.scripture_ref ?? null,
    };
  });
}

