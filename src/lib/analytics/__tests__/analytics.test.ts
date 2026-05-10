import {
  maskProperties,
  initAnalytics,
  setAnalyticsUser,
  track,
  captureError,
} from "../index";

describe("Analytics PII 마스킹 (§13)", () => {
  test("민감 키는 [masked] 로 치환", () => {
    const out = maskProperties({
      email: "user@example.com",
      display_name: "홍길동",
      note: "오늘 묵상한 내용",
      cardNumber: "1234-5678-9012-3456",
    });
    expect(out).toEqual({
      email: "[masked]",
      display_name: "[masked]",
      note: "[masked]",
      cardNumber: "[masked]",
    });
  });

  test("일반 키는 그대로 유지", () => {
    expect(
      maskProperties({
        category: "worship",
        completedCount: 5,
      }),
    ).toEqual({
      category: "worship",
      completedCount: 5,
    });
  });

  test("중첩 객체도 재귀적으로 마스킹", () => {
    expect(
      maskProperties({
        category: "memory",
        card: { reference: "시편 23편", text: "여호와는 나의 목자" },
      }),
    ).toEqual({
      category: "memory",
      card: { reference: "시편 23편", text: "[masked]" },
    });
  });

  test("배열은 원본 유지 (요소가 객체여도 통과 — 호출자가 추가 마스킹 책임)", () => {
    const r = maskProperties({ ids: ["a", "b"] });
    expect(r).toEqual({ ids: ["a", "b"] });
  });

  test("SDK 미설정 시 init/track/captureError 가 throw 하지 않음", async () => {
    delete process.env.EXPO_PUBLIC_SENTRY_DSN;
    delete process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
    await expect(initAnalytics()).resolves.toBeUndefined();
    expect(() => track("checkin_toggled", { category: "qt" })).not.toThrow();
    expect(() => captureError(new Error("x"), "test")).not.toThrow();
    expect(() => setAnalyticsUser("uid")).not.toThrow();
    expect(() => setAnalyticsUser(null)).not.toThrow();
  });
});
