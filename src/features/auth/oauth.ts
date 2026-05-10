// 카카오 OAuth 로그인 — Supabase 의 signInWithOAuth + expo-web-browser 흐름.
//
// Supabase는 redirect URL 로 access_token / refresh_token 을 fragment(#) 또는
// PKCE 흐름으로 돌려준다. 모바일에서는 커스텀 scheme(trace://) 으로 받아
// supabase.auth.exchangeCodeForSession(...) 또는 setSession(...) 으로
// 세션을 확정한다.
//
// 사전 준비 (Supabase 대시보드 → Authentication → Providers → Kakao):
//   1) Enable, Client ID/Secret 입력 (Kakao Developers REST API 키)
//   2) Redirect URLs 에 trace://auth/callback 추가
//   3) Kakao Developers → 플랫폼 → iOS/Android Bundle ID 등록

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const REDIRECT = Linking.createURL("auth/callback");

export type OAuthResult =
  | { ok: true }
  | { ok: false; reason: "cancelled" | "error"; message?: string };

export async function signInWithKakao(): Promise<OAuthResult> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: REDIRECT,
      skipBrowserRedirect: true,
      scopes: "profile_nickname account_email",
    },
  });
  if (error || !data?.url) {
    return { ok: false, reason: "error", message: error?.message };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT, {
    showInRecents: false,
  });

  if (result.type !== "success" || !result.url) {
    return {
      ok: false,
      reason: result.type === "cancel" ? "cancelled" : "error",
    };
  }

  // PKCE 흐름: ?code=...&...
  // implicit 흐름: #access_token=...&refresh_token=...
  const url = new URL(result.url);
  const code = url.searchParams.get("code");
  if (code) {
    const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
    if (exErr) return { ok: false, reason: "error", message: exErr.message };
    return { ok: true };
  }

  const fragment = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  const params = new URLSearchParams(fragment);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (access_token && refresh_token) {
    const { error: setErr } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (setErr) return { ok: false, reason: "error", message: setErr.message };
    return { ok: true };
  }

  return { ok: false, reason: "error", message: "no token in callback" };
}
