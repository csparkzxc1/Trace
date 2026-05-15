// supabase/functions/srs-stt
//
// 사용자가 보낸 짧은 음성 녹음 → OpenAI Whisper 로 STT → 전사 텍스트 반환.
// 성경 암송 빈칸 모드의 정답률 계산은 클라이언트에서 normalized 텍스트 비교로 수행.
//
// 환경변수:
//   OPENAI_API_KEY  — Whisper 호출용
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — auth 검증용
//
// 입력: multipart/form-data
//   - audio: Blob (m4a/wav)
//
// 응답: { transcript: string }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!url || !serviceKey) return new Response("missing env", { status: 500 });

  const auth = req.headers.get("Authorization") ?? "";
  const supabase = createClient(url, serviceKey, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  if (!openaiKey) {
    // 키 미설정 시 안전한 빈 응답 (학습은 그대로 진행되도록 클라이언트가 fallback)
    return Response.json({ transcript: "" });
  }

  const form = await req.formData();
  const audio = form.get("audio");
  if (!(audio instanceof Blob)) {
    return new Response("missing audio", { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("file", audio, "audio.m4a");
  upstream.append("model", "whisper-1");
  upstream.append("language", "ko");
  upstream.append("response_format", "json");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}` },
    body: upstream,
  });

  if (!res.ok) {
    return new Response("stt failed", { status: 502 });
  }
  const json = (await res.json()) as { text?: string };
  return Response.json({ transcript: json.text ?? "" });
});
