// supabase/functions/payment-webhook
// 토스페이먼츠 구독 결제 웹훅 수신.
// 실제 키·서명 검증은 사용자가 토스페이먼츠 계정 발급 후 환경변수로 주입.
// 이 스텁은 결제 성공 → users.is_premium=true + premium_until 갱신만 수행.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type TossEvent = {
  eventType: string;
  data: {
    orderId: string;
    customerKey: string;
    status: string;
    expiresAt?: string;
  };
};

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const secret = Deno.env.get("TOSS_WEBHOOK_SECRET");
  if (!url || !serviceKey) return new Response("missing env", { status: 500 });

  const signature = req.headers.get("x-toss-signature");
  if (secret && !signature) return new Response("missing signature", { status: 400 });
  // TODO: HMAC 서명 검증 (사용자 토스 키 발급 후 활성화)

  const event = (await req.json()) as TossEvent;
  const supabase = createClient(url, serviceKey);

  if (event.eventType === "PAYMENT.DONE" && event.data.status === "DONE") {
    const until = event.data.expiresAt
      ? event.data.expiresAt.slice(0, 10)
      : new Date(Date.now() + 31 * 86400_000).toISOString().slice(0, 10);

    const { error } = await supabase
      .from("users")
      .update({ is_premium: true, premium_until: until })
      .eq("id", event.data.customerKey);

    if (error) return new Response(error.message, { status: 500 });
  }

  if (event.eventType === "PAYMENT.CANCELED") {
    await supabase
      .from("users")
      .update({ is_premium: false })
      .eq("id", event.data.customerKey);
  }

  return new Response("ok", { status: 200 });
});
