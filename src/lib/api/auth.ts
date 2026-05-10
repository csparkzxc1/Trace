import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/database";

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.session;
}

export async function signUpWithPassword(
  email: string,
  password: string,
  displayName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(
  profile: Pick<UserProfile, "id" | "email" | "display_name"> &
    Partial<UserProfile>,
) {
  const { data, error } = await supabase
    .from("users")
    .upsert(profile)
    .select()
    .single();
  if (error) throw error;
  return data;
}
