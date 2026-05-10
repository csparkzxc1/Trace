import { supabase } from "@/lib/supabase";
import type { Assessment } from "@/types/database";

export async function saveAssessment(input: {
  userId: string;
  type: string;
  answers: Record<string, number | string | boolean>;
  scores: Record<string, number>;
}): Promise<Assessment> {
  const { data, error } = await supabase
    .from("assessments")
    .insert({
      user_id: input.userId,
      type: input.type,
      answers: input.answers,
      scores: input.scores,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMyAssessments(
  userId: string,
  type?: string,
): Promise<Assessment[]> {
  let q = supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (type) q = q.eq("type", type);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
