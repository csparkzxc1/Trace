import {
  normalizeText,
  similarity,
  qualityFromSimilarity,
} from "../text-similarity";

describe("Text similarity (음성 SRS 비교)", () => {
  test("normalizeText 는 공백·문장부호·따옴표를 제거한다", () => {
    expect(normalizeText("여호와는 나의 목자시니, 내게 부족함이 없으리로다."))
      .toBe("여호와는나의목자시니내게부족함이없으리로다");
  });

  test("동일 문자열은 1.0", () => {
    expect(similarity("시편 23편", "시편 23편")).toBe(1);
  });

  test("부호 차이만 있으면 1.0 으로 인식", () => {
    expect(
      similarity(
        "여호와는 나의 목자시니",
        "여호와는, 나의 목자시니!",
      ),
    ).toBe(1);
  });

  test("한 글자 차이 작은 거리", () => {
    const s = similarity("나의 목자", "나의 옥자");
    expect(s).toBeGreaterThan(0.7);
    expect(s).toBeLessThan(1);
  });

  test("완전히 다른 문장은 낮은 점수", () => {
    expect(similarity("아브라함", "노아의 방주에 모인 동물들")).toBeLessThan(
      0.5,
    );
  });

  test("빈 문자열 처리", () => {
    expect(similarity("", "")).toBe(1);
    expect(similarity("말씀", "")).toBe(0);
  });

  test("qualityFromSimilarity 매핑", () => {
    expect(qualityFromSimilarity(1.0)).toBe(3);
    expect(qualityFromSimilarity(0.95)).toBe(3);
    expect(qualityFromSimilarity(0.8)).toBe(2);
    expect(qualityFromSimilarity(0.6)).toBe(1);
    expect(qualityFromSimilarity(0.2)).toBe(0);
  });
});
