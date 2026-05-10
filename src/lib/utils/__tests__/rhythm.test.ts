import {
  extractSignals,
  generateRhythm,
  type DayActivity,
} from "../rhythm";
import { isSafeCopy } from "../microcopy";
import { rangeDays } from "../date";

function emptyDays(start: string, count: number): DayActivity[] {
  return rangeDays(start, count).map((date) => ({
    date,
    count: 0,
    byCategory: {},
  }));
}

function fillDay(
  d: DayActivity,
  count: number,
  cats: Partial<Record<string, number>> = {},
): DayActivity {
  return { ...d, count, byCategory: cats as DayActivity["byCategory"] };
}

describe("Rhythm of the Year", () => {
  test("폴백 라인을 항상 1줄 이상 반환", () => {
    const signals = extractSignals(emptyDays("2026-01-01", 30), "2026-05-10");
    const lines = generateRhythm(signals);
    expect(lines.length).toBeGreaterThan(0);
  });

  test("seasonOpener: 1~3월 dominant 카테고리를 잡는다", () => {
    const days = emptyDays("2026-01-01", 90);
    days.forEach((d, i) => {
      if (i < 60) days[i] = fillDay(d, 4, { worship: 1, prayer: 1, qt: 1, word: 1 });
    });
    const signals = extractSignals(days, "2026-04-01");
    expect(signals.seasonOpener?.category).toBeTruthy();
  });

  test("peakWindow: 평균 1 미만이면 잡지 않는다", () => {
    const days = emptyDays("2026-01-01", 60);
    const signals = extractSignals(days, "2026-03-01");
    expect(signals.peakWindow).toBeNull();
  });

  test("singleFocus: 한 카테고리가 40% 초과", () => {
    const days = emptyDays("2026-01-01", 100);
    days.forEach((d, i) => {
      days[i] = fillDay(d, 5, {
        worship: 1, // 과반
        prayer: 1,
      });
    });
    const signals = extractSignals(days, "2026-04-10");
    expect(signals.singleFocus).not.toBeNull();
  });

  test("evenDistribution: 7영역 std/mean < 0.3", () => {
    const days = emptyDays("2026-01-01", 100);
    days.forEach((d, i) => {
      days[i] = fillDay(d, 7, {
        worship: 1,
        word: 1,
        prayer: 1,
        qt: 1,
        memory: 1,
        evangel: 1,
        service: 1,
      });
    });
    const signals = extractSignals(days, "2026-04-10");
    expect(signals.evenDistribution).toBe(true);
  });

  test("sundayContinuity: 주일 worship 연속 카운트", () => {
    const days = rangeDays("2026-04-05", 35).map((date) => ({
      date,
      count: 0,
      byCategory: {} as DayActivity["byCategory"],
    }));
    days.forEach((d, i) => {
      if (new Date(d.date).getDay() === 0) {
        days[i] = fillDay(d, 5, { worship: 1 });
      }
    });
    // 마지막 일요일이 2026-05-03 또는 -10에 있어야 함
    const signals = extractSignals(days, "2026-05-10");
    expect(signals.sundayContinuity?.weeks ?? 0).toBeGreaterThanOrEqual(3);
  });

  test("quietPause: 7일 이상 흔적 없는 구간을 인식", () => {
    const days = emptyDays("2026-01-01", 60);
    // 모두 흔적 0 → quietPause 잡힘
    const signals = extractSignals(days, "2026-03-01");
    expect(signals.quietPause).not.toBeNull();
    expect(signals.quietPause?.days).toBeGreaterThanOrEqual(7);
  });

  test("peakWindow가 있으면 quietPause 라인은 출력하지 않는다", () => {
    const days = emptyDays("2026-01-01", 100);
    // 일부 구간만 흔적 있음
    for (let i = 30; i < 50; i++) {
      days[i] = fillDay(days[i]!, 6, {
        worship: 1, word: 1, prayer: 1, qt: 1, memory: 1, evangel: 1,
      });
    }
    const signals = extractSignals(days, "2026-04-10");
    const lines = generateRhythm(signals);
    const templates = lines.map((l) => l.template);
    if (templates.includes("peak_window")) {
      expect(templates).not.toContain("quiet_pause");
    }
  });

  test("모든 템플릿 출력이 §6.3 카피 톤 가이드 준수", () => {
    const scenarios: DayActivity[][] = [
      // 모든 시그널 활성화 시나리오
      (() => {
        const days = emptyDays("2026-01-01", 130);
        days.forEach((d, i) => {
          if (i < 60) days[i] = fillDay(d, 5, { worship: 1, word: 1 });
          if (i >= 90) days[i] = fillDay(d, 6, {
            worship: 1, word: 1, prayer: 1, qt: 1, memory: 1, evangel: 1,
          });
        });
        return days;
      })(),
      // 폴백 시나리오
      emptyDays("2026-01-01", 30),
    ];

    for (const days of scenarios) {
      const signals = extractSignals(days, "2026-05-10");
      const lines = generateRhythm(signals);
      lines.forEach((l) => {
        expect(isSafeCopy(l.text)).toBe(true);
      });
    }
  });

  test("최대 4줄, 시간순 정렬", () => {
    const days = emptyDays("2026-01-01", 130);
    days.forEach((d, i) => {
      if (i < 60) days[i] = fillDay(d, 5, { worship: 1, word: 1 });
    });
    const signals = extractSignals(days, "2026-05-10");
    const lines = generateRhythm(signals);
    expect(lines.length).toBeLessThanOrEqual(4);
    for (let i = 1; i < lines.length; i++) {
      expect(lines[i]!.period).toBeGreaterThanOrEqual(lines[i - 1]!.period);
    }
  });
});
