import {
  TOZER_QUESTIONS,
  scoreByCategory,
  recommend,
} from "../tozer-assessment";

describe("Tozer-style 7 assessment", () => {
  test("7문항이 7대 영역과 1:1 매핑", () => {
    expect(TOZER_QUESTIONS).toHaveLength(7);
    const slugs = TOZER_QUESTIONS.map((q) => q.category);
    expect(new Set(slugs).size).toBe(7);
  });

  test("scoreByCategory는 카테고리별로 누적", () => {
    const answers: Record<string, number> = {};
    TOZER_QUESTIONS.forEach((q) => {
      answers[q.id] = 2;
    });
    const scores = scoreByCategory(answers);
    Object.values(scores).forEach((v) => expect(v).toBe(2));
  });

  test("recommend는 가장 낮은 영역을 반환", () => {
    const answers: Record<string, number> = {};
    TOZER_QUESTIONS.forEach((q) => {
      answers[q.id] = q.category === "prayer" ? 0 : 3;
    });
    const r = recommend(scoreByCategory(answers));
    expect(r.category).toBe("prayer");
    expect(r.message.length).toBeGreaterThan(5);
  });
});
