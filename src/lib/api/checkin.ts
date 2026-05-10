import { supabase } from "@/lib/supabase";
import type { DailyCheck } from "@/types/database";
import { todayIso } from "@/lib/utils/date";

export async function fetchTodayChecks(
  userId: string,
  date: string = todayIso(),
): Promise<DailyCheck[]> {
  const { data, error } = await supabase
    .from("daily_checks")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date);
  if (error) throw error;
  return data ?? [];
}

export async function toggleCheckRpc(
  categoryId: string,
  date: string = todayIso(),
): Promise<DailyCheck> {
  const { data, error } = await supabase.rpc("toggle_check", {
    p_category_id: categoryId,
    p_date: date,
  });
  if (error) throw error;
  return data as DailyCheck;
}

export async function updateCheckDetails(
  id: string,
  patch: Partial<Pick<DailyCheck, "duration_minutes" | "note" | "scripture_ref">>,
): Promise<DailyCheck> {
  const { data, error } = await supabase
    .from("daily_checks")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchHeatmap(
  userId: string,
  startDate: string,
): Promise<{ date: string; completed_count: number }[]> {
  const { data, error } = await supabase.rpc("get_week_heatmap", {
    p_user_id: userId,
    p_start_date: startDate,
  });
  if (error) throw error;
  return data ?? [];
}

export async function fetchUserStreak(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc("get_user_streak", {
    p_user_id: userId,
  });
  if (error) throw error;
  return Number(data ?? 0);
}
