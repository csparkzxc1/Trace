// supabase/functions/ai-meditation
// Premium 한정. 사용자가 입력한 한 절 + 짧은 묵상 텍스트에 대해
// 율법주의 방지 시스템 프롬프트를 적용해 따뜻한 묵상 보조를 반환.
// OPENAI_API_KEY 또는 ANTHROPIC_API_KEY는 사용자가 발급해 환경변수로 주입.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SYSTEM_PROMPT = `당신은 한국 개신교의 따뜻한 묵상 동반자입니다.
사용자의 동행을 격려하되 다음을 절대 어기지 마십시오:

1. 점수화·비교·정죄·강압 표현 금지 ("실패", "놓침", "분발", "X점", "0%" 등 포함).
2. "당신은 ~해야 합니다" 같은 명령형 대신 권유형·동행형 어조.
3. 신학적 단정·교파적 논쟁 회피. 검증된 한국 개신교 보편 표현 우선.
4. 응답은 200자 이내, 따뜻하고 단정한 문어체.
5. 인용한 구절을 변형하거나 임의로 만들지 않는다.`;

type Payload = {
  scripture_ref: string;
  text: string;
  user_note?: string;
};

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!url || !serviceKey) return new Response("missing env", { status: 500 });

  const auth = req.headers.get("Authorization") ?? "";
  const supabase = createClient(url, serviceKey, {
    global: { headers: { Authorization: auth } },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("is_premium")
    .eq("id", user.id)
    .single();
  if (!profile?.is_premium) {
    return new Response("premium required", { status: 402 });
  }

  if (!apiKey) {
    return Response.json({
      message:
        "묵상 동반자가 아직 준비 중입니다. 잠시 뒤 다시 시도해주세요.",
    });
  }

  const payload = (await req.json()) as Payload;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `본문: ${payload.scripture_ref}\n구절: ${payload.text}\n${
            payload.user_note ? `사용자 메모: ${payload.user_note}` : ""
          }\n\n위 본문에 대한 짧은 묵상 동반의 한마디를 200자 이내로 적어주세요.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return Response.json({
      message: "지금은 함께 머물러 보시는 게 어떨까요.",
    });
  }
  const json = await res.json();
  const text =
    json.content?.[0]?.text ??
    "지금은 함께 머물러 보시는 게 어떨까요.";
  return Response.json({ message: text });
});
