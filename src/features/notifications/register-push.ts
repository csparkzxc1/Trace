// §7.3 푸시는 옵트인. 사용자가 "알림 받기"를 명시 ON 한 직후에만 호출.
// 권한 거부·OS 미지원 시 조용히 false 반환 (죄책감 트리거 카피 X).

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

export type RegisterResult = {
  ok: boolean;
  token: string | null;
  reason?: "permission_denied" | "simulator" | "no_project_id" | "error";
};

export async function registerPushTokenForUser(
  userId: string,
): Promise<RegisterResult> {
  if (!Device.isDevice) {
    return { ok: false, token: null, reason: "simulator" };
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== "granted") {
    const next = await Notifications.requestPermissionsAsync();
    status = next.status;
  }
  if (status !== "granted") {
    return { ok: false, token: null, reason: "permission_denied" };
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    return { ok: false, token: null, reason: "no_project_id" };
  }

  if (Platform.OS === "android") {
    // §7.3 새벽기도 알림은 무음·진동만. 채널 우선 등록.
    await Notifications.setNotificationChannelAsync("morning_prayer", {
      name: "새벽기도",
      importance: Notifications.AndroidImportance.LOW,
      vibrationPattern: [0, 300, 200, 300],
      sound: undefined,
      enableVibrate: true,
    });
    await Notifications.setNotificationChannelAsync("default", {
      name: "기본",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    });
  }

  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    await supabase
      .from("notification_settings")
      .upsert({ user_id: userId, push_token: token, push_enabled: true });
    return { ok: true, token };
  } catch {
    return { ok: false, token: null, reason: "error" };
  }
}

export async function unregisterPushTokenForUser(userId: string) {
  await supabase
    .from("notification_settings")
    .update({ push_enabled: false, push_token: null })
    .eq("user_id", userId);
}
