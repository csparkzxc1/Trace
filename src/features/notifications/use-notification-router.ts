// 푸시 알림 응답 → 앱 내 라우트 이동.
//
// 페이로드 규약:
//   data.route   "today" | "journey" | "cell" | "self" | "verse" | 임의 경로
//   data.encouragementId  (선택) → cell/encourage/{memberId} 등 향후 확장
//
// Edge Function (daily-notification 등) 에서 발송 시 data 를 함께 실어야
// 정확한 deep link 가 가능하다. data 가 없으면 기본 today 탭.

import { useEffect } from "react";
import { useRouter } from "expo-router";

let Notifications: typeof import("expo-notifications") | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require("expo-notifications") as typeof import("expo-notifications");
} catch {
  Notifications = null;
}

const ROUTE_MAP: Record<string, string> = {
  today: "/(tabs)/today",
  journey: "/(tabs)/journey",
  cell: "/(tabs)/cell",
  self: "/(tabs)/self",
  verse: "/(tabs)/today/verse-detail",
  memory: "/(tabs)/self/memory",
  prayer: "/(tabs)/self/prayer-archive",
};

export function useNotificationRouter(): void {
  const router = useRouter();

  useEffect(() => {
    if (!Notifications) return;

    function handle(data: unknown): void {
      const payload = (data ?? {}) as { route?: string; href?: string };
      const target =
        (payload.route && ROUTE_MAP[payload.route]) ??
        payload.href ??
        "/(tabs)/today";
      try {
        router.push(target as never);
      } catch {
        router.push("/(tabs)/today");
      }
    }

    // 1) 백그라운드에서 알림 탭으로 들어온 경우
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      handle(res.notification.request.content.data);
    });

    // 2) 콜드 스타트 — 알림으로 앱이 처음 열린 경우
    Notifications.getLastNotificationResponseAsync().then((res) => {
      if (res) handle(res.notification.request.content.data);
    });

    return () => {
      sub.remove();
    };
  }, [router]);
}
