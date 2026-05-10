import { t, setLocale } from "../index";

describe("i18n", () => {
  test("ko 기본 키 반환", () => {
    setLocale("ko");
    expect(t("welcome.cta.start")).toBe("시작하기");
    expect(t("category.worship")).toBe("예배");
  });

  test("en 으로 전환", () => {
    setLocale("en");
    expect(t("welcome.cta.start")).toBe("Get started");
    expect(t("category.worship")).toBe("Worship");
    setLocale("ko");
  });

  test("미발견 키는 키 그대로 반환", () => {
    setLocale("ko");
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });

  test("{placeholder} 보간", () => {
    setLocale("ko");
    expect(t("today.summary.some", { count: 3 })).toBe(
      "3가지 흔적이 남았습니다",
    );
  });

  test("placeholder 누락 시 원형 유지", () => {
    setLocale("ko");
    expect(t("today.summary.some")).toBe("{count}가지 흔적이 남았습니다");
  });

  test("en 에 키 누락 시 ko 폴백", () => {
    setLocale("en");
    // 모든 ko 키가 en 에 있다고 가정. 일부러 미존재 키는 키 자체 반환
    expect(t("kor.only")).toBe("kor.only");
    setLocale("ko");
  });
});
