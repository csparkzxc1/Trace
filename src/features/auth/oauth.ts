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
import { Platform } from "react-native";
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

// ============================================================================
// Apple Sign-In (iOS 한정).
// expo-apple-authentication 으로 native ID token 받아 supabase.auth.signInWithIdToken
// (provider: apple) 으로 세션 생성. App Store 정책상 다른 소셜 로그인 제공 시
// Apple Sign-In 도 동등하게 제공해야 함 (가이드라인 4.8).
// ============================================================================

export async function signInWithApple(): Promise<OAuthResult> {
  if (Platform.OS !== "ios") {
    return { ok: false, reason: "error", message: "iOS only" };
  }
  let AppleAuthentication: typeof import("expo-apple-authentication") | null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    AppleAuthentication = require("expo-apple-authentication") as typeof import("expo-apple-authentication");
  } catch {
    return { ok: false, reason: "error", message: "module unavailable" };
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const token = credential.identityToken;
    if (!token) {
      return { ok: false, reason: "error", message: "no identity token" };
    }
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token,
    });
    if (error) return { ok: false, reason: "error", message: error.message };
    return { ok: true };
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "ERR_REQUEST_CANCELED") {
      return { ok: false, reason: "cancelled" };
    }
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "unknown",
    };
  }
}
