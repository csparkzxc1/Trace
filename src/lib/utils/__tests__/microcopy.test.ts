import {
  dailySummaryMessage,
  isSafeCopy,
  assertSafeCopy,
  streakMessage,
} from "../microcopy";

describe("Microcopy (§6.3)", () => {
  test("0개일 때 동행 시작 카피", () => {
    expect(dailySummaryMessage(0)).toContain("동행을 시작");
  });

  test("4개 미만은 천천히 카피", () => {
    expect(dailySummaryMessage(2)).toContain("천천히");
  });

  test("4-6개는 흔적이 남았습니다 카피", () => {
    expect(dailySummaryMessage(5)).toContain("흔적");
  });

  test("7개는 모든 흔적 카피", () => {
    expect(dailySummaryMessage(7)).toContain("모든 흔적");
  });

  test("streak 0은 다시 시작 카피", () => {
    expect(streakMessage(0)).toBe("오늘 다시 시작");
  });

  test("isSafeCopy는 금기어를 거른다", () => {
    expect(isSafeCopy("오늘도 동행합니다")).toBe(true);
    expect(isSafeCopy("실패한 하루")).toBe(false);
    expect(isSafeCopy("0% 달성")).toBe(false);
    expect(isSafeCopy("분발하세요")).toBe(false);
  });

  test("assertSafeCopy는 금기어 시 throw", () => {
    expect(() => assertSafeCopy("정상 카피")).not.toThrow();
    expect(() => assertSafeCopy("X점 부족")).toThrow();
  });

  test("앱 내 모든 카피 후보가 안전한가 (스모크)", () => {
    [
      dailySummaryMessage(0),
      dailySummaryMessage(3),
      dailySummaryMessage(5),
      dailySummaryMessage(7),
      streakMessage(0),
      streakMessage(3),
      streakMessage(15),
    ].forEach((c) => {
      expect(isSafeCopy(c)).toBe(true);
    });
  });
});
