// supabase/functions/payment-cancel
//
// 사용자 구독 해지. 즉시 환불은 정책상 진행하지 않고, 결제 주기 끝까지
// Premium 유지 → premium_until 도래 시 자연 만료. (§ 카피: "해지 후에도 결제
// 주기 끝까지 Premium 이 유지됩니다")
//
// 동작:
//   1) auth.uid() 의 billing_keys.status = 'revoked'
//   2) cron 의 정기 청구 대상에서 자연 제외 (status='active' 만 대상)
//   3) is_premium / premium_until 은 그대로 유지 (만료까지 사용)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return new Response("missing env", { status: 500 });

  const auth = req.headers.get("Authorization") ?? "";
  const supabase = createClient(url, serviceKey, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const { error } = await supabase
    .from("billing_keys")
    .update({ status: "revoked" })
    .eq("user_id", user.id);
  if (error) return new Response(error.message, { status: 500 });

  return Response.json({ ok: true });
});
