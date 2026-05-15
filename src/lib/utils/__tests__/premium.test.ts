import { isPremiumActive, canUseFeature } from "../premium";

describe("Premium 게이팅", () => {
  test("is_premium=false 면 비활성", () => {
    expect(isPremiumActive({ is_premium: false, premium_until: null })).toBe(
      false,
    );
  });

  test("is_premium=true + premium_until=null 이면 활성 (영구)", () => {
    expect(isPremiumActive({ is_premium: true, premium_until: null })).toBe(
      true,
    );
  });

  test("premium_until 이 오늘 이후면 활성", () => {
    const future = new Date(Date.now() + 7 * 86400_000)
      .toISOString()
      .slice(0, 10);
    expect(
      isPremiumActive({ is_premium: true, premium_until: future }),
    ).toBe(true);
  });

  test("premium_until 이 어제면 비활성", () => {
    const yesterday = new Date(Date.now() - 2 * 86400_000)
      .toISOString()
      .slice(0, 10);
    expect(
      isPremiumActive({ is_premium: true, premium_until: yesterday }),
    ).toBe(false);
  });

  test("premium_until 당일은 활성 (만료일 포함)", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(
      isPremiumActive(
        { is_premium: true, premium_until: today },
        new Date(),
      ),
    ).toBe(true);
  });

  test("profile 이 null 이면 비활성", () => {
    expect(isPremiumActive(null)).toBe(false);
  });

  test("canUseFeature 는 isPremiumActive 와 동일 게이트", () => {
    expect(
      canUseFeature(
        { is_premium: true, premium_until: null },
        "ai_meditation",
      ),
    ).toBe(true);
    expect(
      canUseFeature(
        { is_premium: false, premium_until: null },
        "ai_meditation",
      ),
    ).toBe(false);
  });
});
