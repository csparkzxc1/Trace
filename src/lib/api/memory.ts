import { supabase } from "@/lib/supabase";
import type { ScriptureMemory } from "@/types/database";
import { reviewCard, type SrsState } from "@/lib/utils/srs";
import type { SrsQuality } from "@/types/domain";

export async function fetchDueCards(
  userId: string,
  limit = 10,
): Promise<ScriptureMemory[]> {
  const { data, error } = await supabase
    .from("scripture_memory")
    .select("*")
    .eq("user_id", userId)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllCards(
  userId: string,
): Promise<ScriptureMemory[]> {
  const { data, error } = await supabase
    .from("scripture_memory")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addCard(input: {
  userId: string;
  reference: string;
  text: string;
  translation?: string;
}): Promise<ScriptureMemory> {
  const { data, error } = await supabase
    .from("scripture_memory")
    .insert({
      user_id: input.userId,
      reference: input.reference,
      text: input.text,
      translation: input.translation ?? "개역개정",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function gradeCard(
  card: ScriptureMemory,
  quality: SrsQuality,
): Promise<ScriptureMemory> {
  const state: SrsState = {
    level: card.srs_level,
    easeFactor: card.ease_factor,
    totalReviews: card.total_reviews,
  };
  const result = reviewCard(state, quality);
  const next = new Date(Date.now() + result.nextReviewDelayMs);

  const { data, error } = await supabase
    .from("scripture_memory")
    .update({
      srs_level: result.level,
      ease_factor: result.easeFactor,
      total_reviews: result.totalReviews,
      next_review_at: next.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    })
    .eq("id", card.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
