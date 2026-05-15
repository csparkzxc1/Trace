// supabase/functions/daily-notification
// cron: 매일 새벽/큐티/저녁 시간대에 알림 발송.
// §7.3 푸시는 옵트인 사용자만, 새벽기도는 무음·진동 페이로드.
// 실제 cron 트리거는 supabase.com 대시보드 또는 pg_cron으로 등록.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SlotKey = "morning_prayer" | "qt" | "evening_review";

type Payload = {
  slot: SlotKey;
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

function buildMessage(slot: SlotKey) {
  const data = { route: "today" };
  if (slot === "morning_prayer") {
    return {
      title: "흔적",
      body: "새벽의 자리, 천천히 시작합니다.",
      sound: null, // §7.3 무음·진동
      priority: "default",
      data,
    };
  }
  if (slot === "qt") {
    return {
      title: "흔적",
      body: "조용한 5분의 자리.",
      sound: null,
      priority: "default",
      data: { route: "verse" },
    };
  }
  return {
    title: "흔적",
    body: "오늘 동행하신 자리를 잠시 살펴봅니다.",
    sound: null,
    priority: "default",
    data: { route: "today" },
  };
}

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return new Response("missing env", { status: 500 });
  }
  const { slot } = (await req.json()) as Payload;
  const supabase = createClient(url, serviceKey);

  const column =
    slot === "morning_prayer"
      ? "morning_prayer_at"
      : slot === "qt"
        ? "qt_at"
        : "evening_review_at";

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const wantedTime = `${hh}:${mm}`;

  const { data, error } = await supabase
    .from("notification_settings")
    .select("user_id, push_token, push_enabled, " + column)
    .eq("push_enabled", true)
    .not("push_token", "is", null);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const targets = (data ?? []).filter((row) => {
    const value = (row as Record<string, unknown>)[column];
    return typeof value === "string" && value.startsWith(wantedTime);
  });

  if (targets.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  const messages = targets.map((t) => ({
    to: (t as { push_token: string }).push_token,
    ...buildMessage(slot),
  }));

  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messages),
  });

  return new Response(JSON.stringify({ sent: messages.length, ok: res.ok }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
