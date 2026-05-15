import { supabase } from "@/lib/supabase";
import type {
  NotificationSettings,
  VisibilitySettings,
} from "@/types/database";

export async function fetchVisibility(
  userId: string,
): Promise<VisibilitySettings | null> {
  const { data, error } = await supabase
    .from("visibility_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertVisibility(
  patch: Partial<VisibilitySettings> & { user_id: string },
): Promise<VisibilitySettings> {
  const { data, error } = await supabase
    .from("visibility_settings")
    .upsert(patch)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchNotifications(
  userId: string,
): Promise<NotificationSettings | null> {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertNotifications(
  patch: Partial<NotificationSettings> & { user_id: string },
): Promise<NotificationSettings> {
  const { data, error } = await supabase
    .from("notification_settings")
    .upsert(patch)
    .select()
    .single();
  if (error) throw error;
  return data;
}
