// supabase/functions/payment-webhook
// 토스페이먼츠 웹훅 수신 + HMAC 시그니처 검증.
// 결제 성공 → users.is_premium=true + premium_until 갱신.
// 결제 취소/실패 → is_premium=false (즉시 차단보다는 premium_until 만료 시 자연 종료
//   정책도 가능. 본 구현은 명시적 취소 시에만 즉시 false).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type TossEvent = {
  eventType: string;
  data: {
    orderId: string;
    customerKey: string;
    status: string;
    method?: string;
    approvedAt?: string;
    expiresAt?: string;
    totalAmount?: number;
  };
};

// 토스 웹훅 시그니처 검증.
// 서명 헤더 형식: "t=<unix_ts>,v1=<hex_hmac>"  (Stripe 호환 스타일)
// HMAC-SHA256("<unix_ts>.<raw_body>", TOSS_WEBHOOK_SECRET)
async function verifySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  toleranceSeconds = 300,
): Promise<boolean> {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => {
      const [k, v] = kv.trim().split("=");
      return [k, v];
    }),
  ) as Record<string, string>;

  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;

  const skew = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(skew) || skew > toleranceSeconds) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`${ts}.${rawBody}`),
  );
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 상수 시간 비교
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const secret = Deno.env.get("TOSS_WEBHOOK_SECRET");
  if (!url || !serviceKey || !secret) {
    return new Response("missing env", { status: 500 });
  }

  const rawBody = await req.text();
  const ok = await verifySignature(
    rawBody,
    req.headers.get("tosspayments-signature"),
    secret,
  );
  if (!ok) {
    return new Response("invalid signature", { status: 401 });
  }

  let event: TossEvent;
  try {
    event = JSON.parse(rawBody) as TossEvent;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const supabase = createClient(url, serviceKey);
  const customerId = event.data.customerKey;

  if (event.eventType === "PAYMENT.DONE" && event.data.status === "DONE") {
    const until = event.data.expiresAt
      ? event.data.expiresAt.slice(0, 10)
      : new Date(Date.now() + 31 * 86400_000).toISOString().slice(0, 10);
    const { error } = await supabase
      .from("users")
      .update({ is_premium: true, premium_until: until })
      .eq("id", customerId);
    if (error) return new Response(error.message, { status: 500 });
  }

  if (
    event.eventType === "PAYMENT.CANCELED" ||
    event.eventType === "PAYMENT.FAILED"
  ) {
    await supabase
      .from("users")
      .update({ is_premium: false })
      .eq("id", customerId);
  }

  return new Response("ok", { status: 200 });
});

// 테스트 export (Deno test runner에서 import 시 사용)
export { verifySignature as __verifySignature };
