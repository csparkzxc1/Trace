// supabase/functions/payment-issue-billing
//
// 토스페이먼츠 빌링키 발급 — 클라이언트가 토스 위젯/SDK로 카드 인증을 거친 후
// authKey 와 customerKey 를 보내면 빌링키를 발급받아 안전하게 보관 후
// users.is_premium=true + premium_until=+31일을 세팅한다.
//
// 빌링키 자체는 외부 노출 시 결제 도용 가능하므로 클라이언트에 반환하지 않고
// 서버 보관 (private 테이블 권장; 본 스텁에선 응답에서 마스킹).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOSS_API = "https://api.tosspayments.com/v1/billing/authorizations/issue";

type Payload = {
  customerKey: string;
  authKey: string;
};

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const secretKey = Deno.env.get("TOSS_SECRET_KEY");
  if (!url || !serviceKey || !secretKey) {
    return new Response("missing env", { status: 500 });
  }

  const auth = req.headers.get("Authorization") ?? "";
  const supabase = createClient(url, serviceKey, {
    global: { headers: { Authorization: auth } },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return new Response("invalid json", { status: 400 });
  }
  if (payload.customerKey !== user.id) {
    return new Response("customerKey mismatch", { status: 403 });
  }

  const tossRes = await fetch(TOSS_API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${secretKey}:`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authKey: payload.authKey,
      customerKey: payload.customerKey,
    }),
  });

  if (!tossRes.ok) {
    const errBody = await tossRes.text();
    return new Response(JSON.stringify({ error: errBody }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tossData = (await tossRes.json()) as {
    billingKey: string;
    customerKey: string;
    cardCompany?: string;
    cardNumber?: string;
  };

  // 빌링키 보관 — 별도 private 테이블이 없으므로 본 스텁에선
  // notification_settings.push_token 같은 곳에 두지 않고, 가맹점 운영 콘솔에
  // 수동 보관하거나 별도 billing_keys 테이블을 만들어 service_role 만 접근하게
  // 한다. 출시 직전 마이그레이션 0005 에서 billing_keys 테이블 추가 예정.

  const until = new Date(Date.now() + 31 * 86400_000).toISOString().slice(0, 10);
  await supabase
    .from("users")
    .update({ is_premium: true, premium_until: until })
    .eq("id", user.id);

  return Response.json({
    ok: true,
    cardCompany: tossData.cardCompany ?? null,
    // 카드번호 마지막 4자리만 노출
    cardLast4: tossData.cardNumber?.slice(-4) ?? null,
    premiumUntil: until,
  });
});
