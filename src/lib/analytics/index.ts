// 분석·에러 트래킹 통합 레이어 (§3.1).
//
// 정책:
//   1) PII 는 절대 외부 도구로 보내지 않는다 (이메일·이름·기도제목·메모).
//   2) 사용자 식별은 supabase user.id(uuid) 만. Mixpanel/Sentry user.id 동일.
//   3) Sentry/Mixpanel SDK 가 미설치이거나 DSN/Token 미설정이면 모든 호출은 no-op.
//   4) 율법주의 방지 카피 톤은 분석 이벤트 이름에도 적용 — "fail" 같은 단어 X.
//
// 환경변수:
//   EXPO_PUBLIC_SENTRY_DSN   (선택)
//   EXPO_PUBLIC_MIXPANEL_TOKEN (선택)

type Mixpanel = {
  init: (token: string, opts?: Record<string, unknown>) => Promise<void>;
  identify: (id: string) => Promise<void>;
  reset: () => Promise<void>;
  track: (event: string, props?: Record<string, unknown>) => Promise<void>;
};

type Sentry = {
  init: (opts: { dsn: string; tracesSampleRate?: number }) => void;
  setUser: (u: { id: string } | null) => void;
  captureException: (e: unknown) => void;
  captureMessage: (m: string) => void;
};

let mixpanel: Mixpanel | null = null;
let sentry: Sentry | null = null;

const SENSITIVE_KEYS = new Set([
  "email",
  "displayName",
  "display_name",
  "name",
  "phone",
  "address",
  "note",
  "scripture_ref",
  "request",
  "answer_note",
  "message",
  "title",
  "text",
  "transcript",
  "password",
  "token",
  "billingKey",
  "billing_key",
  "authKey",
  "auth_key",
  "card_number",
  "cardNumber",
]);

export function maskProperties(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (SENSITIVE_KEYS.has(k)) {
      out[k] = "[masked]";
      continue;
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = maskProperties(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export async function initAnalytics(): Promise<void> {
  const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  const mixpanelToken = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;

  if (sentryDsn) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require("@sentry/react-native") as Sentry;
      mod.init({ dsn: sentryDsn, tracesSampleRate: 0.1 });
      sentry = mod;
    } catch {
      sentry = null;
    }
  }

  if (mixpanelToken) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Mixpanel: MP } = require("mixpanel-react-native") as {
        Mixpanel: new (token: string, trackAutomaticEvents: boolean) => Mixpanel;
      };
      const inst = new MP(mixpanelToken, false);
      await inst.init(mixpanelToken, { autoCapture: false });
      mixpanel = inst;
    } catch {
      mixpanel = null;
    }
  }
}

export function setAnalyticsUser(userId: string | null): void {
  try {
    if (userId) {
      sentry?.setUser({ id: userId });
      mixpanel?.identify(userId);
    } else {
      sentry?.setUser(null);
      mixpanel?.reset();
    }
  } catch {
    /* swallow */
  }
}

export function track(
  event: string,
  props: Record<string, unknown> = {},
): void {
  try {
    mixpanel?.track(event, maskProperties(props));
  } catch {
    /* swallow */
  }
}

export function captureError(e: unknown, context?: string): void {
  try {
    if (context) sentry?.captureMessage(`[${context}]`);
    sentry?.captureException(e);
  } catch {
    /* swallow */
  }
}
