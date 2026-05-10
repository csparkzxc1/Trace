import {
  todayIso,
  addDays,
  daysBetween,
  startOfWeek,
  startOfMonth,
  rangeDays,
} from "../date";

describe("Date utilities", () => {
  test("addDays는 양수/음수 모두 동작", () => {
    expect(addDays("2026-05-10", 1)).toBe("2026-05-11");
    expect(addDays("2026-05-10", -1)).toBe("2026-05-09");
  });

  test("월 경계를 넘나든다", () => {
    expect(addDays("2026-05-31", 1)).toBe("2026-06-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });

  test("daysBetween은 차이 일수를 반환", () => {
    expect(daysBetween("2026-05-10", "2026-05-15")).toBe(5);
  });

  test("startOfWeek (일요일 시작)", () => {
    expect(startOfWeek("2026-05-10")).toBe("2026-05-10"); // 일요일
    expect(startOfWeek("2026-05-13")).toBe("2026-05-10");
  });

  test("startOfMonth", () => {
    expect(startOfMonth("2026-05-15")).toBe("2026-05-01");
  });

  test("rangeDays(start, 7)은 7일 배열", () => {
    const r = rangeDays("2026-05-10", 7);
    expect(r).toHaveLength(7);
    expect(r[0]).toBe("2026-05-10");
    expect(r[6]).toBe("2026-05-16");
  });

  test("todayIso는 YYYY-MM-DD 형식", () => {
    expect(todayIso(new Date("2026-05-10T15:00:00"))).toBe("2026-05-10");
  });
});
