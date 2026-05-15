import { calculateStreak, isTraceDay } from "../streak";
import type { CheckSummary } from "@/types/domain";

function summary(date: string, count: number): CheckSummary {
  return { date, completedCount: count, isTraceDay: count >= 4 };
}

describe("Streak (§7.1)", () => {
  test("4개 미만 일자는 흔적의 날이 아니다", () => {
    expect(isTraceDay(0)).toBe(false);
    expect(isTraceDay(3)).toBe(false);
    expect(isTraceDay(4)).toBe(true);
    expect(isTraceDay(7)).toBe(true);
  });

  test("연속 흔적의 날을 정확히 카운트한다", () => {
    const days = [
      summary("2026-05-08", 5),
      summary("2026-05-09", 4),
      summary("2026-05-10", 7),
    ];
    expect(calculateStreak(days, "2026-05-10")).toBe(3);
  });

  test("끊긴 날은 streak를 끊는다", () => {
    const days = [
      summary("2026-05-08", 5),
      summary("2026-05-09", 2), // 흔적 X
      summary("2026-05-10", 7),
    ];
    expect(calculateStreak(days, "2026-05-10")).toBe(1);
  });

  test("오늘이 흔적 아닌 날이면 0", () => {
    const days = [summary("2026-05-10", 1)];
    expect(calculateStreak(days, "2026-05-10")).toBe(0);
  });

  test("기록이 없는 날은 streak를 끊는다", () => {
    const days = [summary("2026-05-10", 5)];
    expect(calculateStreak(days, "2026-05-10")).toBe(1);
  });
});
