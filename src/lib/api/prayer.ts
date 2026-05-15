import { supabase } from "@/lib/supabase";
import type { PrayerJournalEntry } from "@/types/database";

export async function fetchMyPrayerEntries(
  userId: string,
): Promise<PrayerJournalEntry[]> {
  const { data, error } = await supabase
    .from("prayer_journal")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchSharedCellPrayers(
  cellId: string,
): Promise<{ id: string; user_id: string; title: string | null; request: string; scripture_ref: string | null; created_at: string }[]> {
  const { data: members, error: e1 } = await supabase
    .from("users")
    .select("id")
    .eq("cell_id", cellId);
  if (e1) throw e1;
  if (!members?.length) return [];

  const { data, error } = await supabase
    .from("prayer_journal_shared")
    .select("*")
    .in(
      "user_id",
      members.map((m) => m.id),
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addPrayerEntry(input: {
  userId: string;
  title?: string;
  request: string;
  scriptureRef?: string;
  shareToCell?: boolean;
}): Promise<PrayerJournalEntry> {
  const { data, error } = await supabase
    .from("prayer_journal")
    .insert({
      user_id: input.userId,
      title: input.title ?? null,
      request: input.request,
      scripture_ref: input.scriptureRef ?? null,
      is_shared_to_cell: input.shareToCell ?? false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markPrayerAnswered(
  id: string,
  answerNote?: string,
): Promise<PrayerJournalEntry> {
  const { data, error } = await supabase
    .from("prayer_journal")
    .update({
      answered_at: new Date().toISOString(),
      answer_note: answerNote ?? null,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
