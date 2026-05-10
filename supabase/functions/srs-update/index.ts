// supabase/functions/srs-update
// 클라이언트가 카드 채점 시 호출. 서버에서 다음 일정을 결정해
// 사용자가 클라이언트 코드를 우회하더라도 정합성 유지.
// SM-2 변형은 src/lib/utils/srs.ts와 동일한 규칙.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const INTERVALS = [1, 3, 7, 14, 30, 90, 180];

type Payload = {
  card_id: string;
  quality: 0 | 1 | 2 | 3;
};

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return new Response("missing env", { status: 500 });

  const auth = req.headers.get("Authorization") ?? "";
  const supabase = createClient(url, serviceKey, {
    global: { headers: { Authorization: auth } },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const { card_id, quality } = (await req.json()) as Payload;

  const { data: card, error } = await supabase
    .from("scripture_memory")
    .select("*")
    .eq("id", card_id)
    .eq("user_id", user.id)
    .single();
  if (error || !card) return new Response("not found", { status: 404 });

  let level = card.srs_level;
  let ease = Number(card.ease_factor);

  if (quality === 0) {
    level = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    const delta = quality === 1 ? -0.05 : quality === 2 ? 0 : 0.1;
    ease = Math.max(1.3, ease + delta);
    level = Math.min(INTERVALS.length - 1, level + 1);
  }

  const baseInterval = INTERVALS[level] ?? INTERVALS[0];
  const intervalDays = Math.max(1, Math.round(baseInterval * (ease / 2.5)));
  const nextReview = new Date(Date.now() + intervalDays * 86400_000);

  const { data: updated, error: e2 } = await supabase
    .from("scripture_memory")
    .update({
      srs_level: level,
      ease_factor: ease,
      total_reviews: card.total_reviews + 1,
      next_review_at: nextReview.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    })
    .eq("id", card_id)
    .select()
    .single();

  if (e2) return new Response(e2.message, { status: 500 });
  return Response.json(updated);
});
