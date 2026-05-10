import { supabase } from "@/lib/supabase";

export async function generateMeditation(input: {
  scriptureRef: string;
  text: string;
  userNote?: string;
}): Promise<{ message: string }> {
  const { data, error } = await supabase.functions.invoke("ai-meditation", {
    body: input,
  });
  if (error) throw error;
  return data as { message: string };
}
