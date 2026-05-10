import { supabase } from "@/lib/supabase";
import type { Cell, Encouragement, UserProfile } from "@/types/database";

export async function joinCellByCode(
  inviteCode: string,
): Promise<Cell | null> {
  const { data: cell, error } = await supabase
    .from("cells")
    .select("*")
    .eq("invite_code", inviteCode)
    .maybeSingle();
  if (error) throw error;
  if (!cell) return null;
  const { error: upErr } = await supabase
    .from("users")
    .update({ cell_id: cell.id, church_id: cell.church_id })
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");
  if (upErr) throw upErr;
  return cell;
}

export async function fetchCellMembers(cellId: string): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("cell_id", cellId)
    .order("display_name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchCellPublicChecks(
  cellId: string,
  date: string,
): Promise<{ user_id: string; completed: boolean; category_id: string }[]> {
  const { data: members, error: e1 } = await supabase
    .from("users")
    .select("id")
    .eq("cell_id", cellId);
  if (e1) throw e1;
  if (!members || members.length === 0) return [];

  const ids = members.map((m) => m.id);
  const { data, error } = await supabase
    .from("daily_checks_public")
    .select("user_id, completed, category_id")
    .in("user_id", ids)
    .eq("date", date);
  if (error) throw error;
  return data ?? [];
}

export async function sendEncouragement(
  toUserId: string,
  emoji: string,
  message?: string,
): Promise<Encouragement> {
  const { data: me } = await supabase.auth.getUser();
  if (!me.user) throw new Error("로그인이 필요합니다");
  const { data, error } = await supabase
    .from("encouragements")
    .insert({
      from_user_id: me.user.id,
      to_user_id: toUserId,
      emoji,
      message: message ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
