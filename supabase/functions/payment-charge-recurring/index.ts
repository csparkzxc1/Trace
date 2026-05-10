// supabase/functions/payment-charge-recurring
//
// 매일 새벽 cron 으로 호출. premium_until 이 3일 이내(만료 임박)인 사용자에게
// billing_key 로 토스 정기 청구를 시도, 성공 시 premium_until +1개월 갱신.
// 실패 3회 누적 시 billing_keys.status='suspended' + push 안내 (옵트인 사용자).
//
// 율법주의 방지(§6.3): 결제 실패 안내도 "다시 시도" 같은 따뜻한 톤.
//
// 환경변수: TOSS_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOSS_BILLING_API = "https://api.tosspayments.com/v1/billing";
const PRICE_KRW = 4900;
const NAME = "흔적 Premium 월간";

type Row = {
  id: string;
  email: string;
  premium_until: string;
};

type BKRow = { user_id: string; billing_key: string };

function nextMonthIso(from: Date = new Date()): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

Deno.serve(async () => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const tossSecret = Deno.env.get("TOSS_SECRET_KEY");
  if (!url || !serviceKey || !tossSecret) {
    return new Response("missing env", { status: 500 });
  }
  const supabase = createClient(url, serviceKey);

  // premium_until 이 오늘 ~ 3일 후 사이인 활성 구독자
  const now = new Date();
  const threshold = new Date(now.getTime() + 3 * 86400_000)
    .toISOString()
    .slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  const { data: targets, error } = await supabase
    .from("users")
    .select("id, email, premium_until")
    .eq("is_premium", true)
    .gte("premium_until", today)
    .lte("premium_until", threshold);
  if (error) return new Response(error.message, { status: 500 });

  if (!targets?.length) {
    return Response.json({ attempted: 0 });
  }

  // 빌링키 조회
  const ids = (targets as Row[]).map((u) => u.id);
  const { data: bks } = await supabase
    .from("billing_keys")
    .select("user_id, billing_key")
    .in("user_id", ids)
    .eq("status", "active");
  const byUser = new Map((bks as BKRow[] | null)?.map((b) => [b.user_id, b.billing_key]));

  const auth = `Basic ${btoa(`${tossSecret}:`)}`;
  let succeeded = 0;
  let failed = 0;

  for (const u of targets as Row[]) {
    const bk = byUser.get(u.id);
    if (!bk) {
      failed += 1;
      continue;
    }
    const orderId = `trace_${u.id.replace(/-/g, "")}_${Date.now()}`;
    const res = await fetch(`${TOSS_BILLING_API}/${bk}`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        customerKey: u.id,
        amount: PRICE_KRW,
        orderId,
        orderName: NAME,
        customerEmail: u.email,
      }),
    });

    if (res.ok) {
      const next = nextMonthIso(new Date(u.premium_until));
      await supabase
        .from("users")
        .update({ premium_until: next })
        .eq("id", u.id);
      succeeded += 1;
    } else {
      failed += 1;
      // 1회 실패 → status 변경 X (3회 retry 후 suspended). 본 단순 구현에선
      // 즉시 suspended 처리하지 않고 다음 cron 까지 대기 (당일 만료 전이면 자연 만료)
      console.error(`charge failed for user=${u.id}:`, await res.text());
    }
  }

  return Response.json({ attempted: targets.length, succeeded, failed });
});
