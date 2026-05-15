import { reviewCard, SRS_INTERVALS_DAYS } from "../srs";

describe("SRS · SM-2 변형", () => {
  const initial = { level: 0, easeFactor: 2.5, totalReviews: 0 };

  test("어려움(0)이면 level이 0으로 초기화되고 ease가 감소한다", () => {
    const r = reviewCard(initial, 0);
    expect(r.level).toBe(0);
    expect(r.easeFactor).toBeCloseTo(2.3, 5);
    expect(r.intervalDays).toBe(SRS_INTERVALS_DAYS[0]);
    expect(r.totalReviews).toBe(1);
  });

  test("ease는 1.3 미만으로 떨어지지 않는다", () => {
    let s = { level: 0, easeFactor: 1.4, totalReviews: 0 };
    s = {
      ...s,
      ...reviewCard(s, 0),
    };
    expect(s.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  test("정답률에 따라 다음 level이 1 증가한다", () => {
    const r = reviewCard(initial, 2);
    expect(r.level).toBe(1);
    expect(r.intervalDays).toBeGreaterThanOrEqual(3);
  });

  test("최고 level에서는 더 이상 올라가지 않는다", () => {
    const top = {
      level: SRS_INTERVALS_DAYS.length - 1,
      easeFactor: 2.5,
      totalReviews: 100,
    };
    const r = reviewCard(top, 3);
    expect(r.level).toBe(SRS_INTERVALS_DAYS.length - 1);
  });

  test("nextReviewDelayMs는 intervalDays * 86400_000과 같다", () => {
    const r = reviewCard(initial, 3);
    expect(r.nextReviewDelayMs).toBe(r.intervalDays * 86400_000);
  });

  test("쉬움(2)은 ease를 유지한다", () => {
    const r = reviewCard(initial, 2);
    expect(r.easeFactor).toBeCloseTo(2.5, 5);
  });

  test("완벽(3)은 ease를 0.1만큼 올린다", () => {
    const r = reviewCard(initial, 3);
    expect(r.easeFactor).toBeCloseTo(2.6, 5);
  });
});
