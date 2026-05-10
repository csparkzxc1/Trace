import { supabase } from "@/lib/supabase";

// Toss 빌링키 발급 → users.is_premium=true 로 활성화.
// authKey: 클라이언트가 토스 결제위젯/SDK로 카드 인증 후 받는 일회용 키
// customerKey: users.id (auth.uid())
export async function issueBillingKey(input: {
  customerKey: string;
  authKey: string;
}): Promise<{
  ok: boolean;
  cardCompany: string | null;
  cardLast4: string | null;
  premiumUntil: string | null;
}> {
  const { data, error } = await supabase.functions.invoke(
    "payment-issue-billing",
    { body: input },
  );
  if (error) throw error;
  return data as {
    ok: boolean;
    cardCompany: string | null;
    cardLast4: string | null;
    premiumUntil: string | null;
  };
}
