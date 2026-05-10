import { supabase } from "@/lib/supabase";
import type { TrainingCategory } from "@/types/database";

export async function fetchDefaultCategories(): Promise<TrainingCategory[]> {
  const { data, error } = await supabase
    .from("training_categories")
    .select("*")
    .eq("is_default", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
