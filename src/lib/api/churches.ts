import { supabase } from "@/lib/supabase";
import type { Church } from "@/types/database";

export async function searchChurches(query: string, limit = 10): Promise<Church[]> {
  const q = query.trim();
  if (q.length < 1) return [];
  const { data, error } = await supabase
    .from("churches")
    .select("*")
    .ilike("name", `%${q}%`)
    .order("name", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
