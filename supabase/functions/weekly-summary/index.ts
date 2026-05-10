// supabase/functions/weekly-summary
// cron: 일요일 저녁 1회. §7.3 — 주간 요약은 일요일 1회만.
// 점수화·비교 표현 사용 금지 (§6.3).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

function summaryBody(traceDays: number): string {
  if (traceDays <= 0) return "한 주 동안의 동행, 흔적은 다음 주에 이어갑니다.";
  if (traceDays < 4) return "한 주 동안의 동행, 천천히 흔적이 남았습니다.";
  return "한 주 동안 흔적이 깊어지고 있습니다 ·";
}

Deno.serve(async () => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return new Response("missing env", { status: 500 });
  }
  const supabase = createClient(url, serviceKey);

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 6);
  const startIso = start.toISOString().slice(0, 10);
  const endIso = today.toISOString().slice(0, 10);

  const { data: settings, error: e1 } = await supabase
    .from("notification_settings")
    .select("user_id, push_token, push_enabled")
    .eq("push_enabled", true)
    .not("push_token", "is", null);

  if (e1) return new Response(e1.message, { status: 500 });

  const messages: { to: string; title: string; body: string }[] = [];

  for (const row of settings ?? []) {
    const { data: checks } = await supabase
      .from("daily_checks")
      .select("date, completed")
      .eq("user_id", row.user_id)
      .eq("completed", true)
      .gte("date", startIso)
      .lte("date", endIso);

    const byDate = new Map<string, number>();
    for (const c of checks ?? []) {
      byDate.set(c.date, (byDate.get(c.date) ?? 0) + 1);
    }
    const traceDays = [...byDate.values()].filter((n) => n >= 4).length;

    messages.push({
      to: (row as { push_token: string }).push_token,
      title: "흔적 · 한 주의 동행",
      body: summaryBody(traceDays),
    });
  }

  if (messages.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }));
  }

  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messages),
  });
  return new Response(JSON.stringify({ sent: messages.length, ok: res.ok }), {
    status: 200,
  });
});
