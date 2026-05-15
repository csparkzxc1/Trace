// 7대 영성훈련 영역 자가진단.
// A.W. 토저의 신앙 점검 정신을 따르되, 정식 토저 7문항 라이선스 확인 전까지는
// 7대 영역 매핑형 자체 문항을 사용. 출시 전 라이선스/번역 검토 필요.

import type { CategorySlug } from "@/types/database";

export type Question = {
  id: string;
  text: string;
  category: CategorySlug;
};

export const TOZER_QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "worship",
    text: "예배 가운데 하나님 임재를 진심으로 갈망하고 있습니까?",
  },
  {
    id: "q2",
    category: "word",
    text: "말씀이 일상의 결정에 실제로 영향을 주고 있습니까?",
  },
  {
    id: "q3",
    category: "prayer",
    text: "기도가 의무가 아닌 동행으로 느껴지는 시간이 있습니까?",
  },
  {
    id: "q4",
    category: "qt",
    text: "조용한 시간에 마음의 소리를 솔직하게 하나님께 내어놓고 있습니까?",
  },
  {
    id: "q5",
    category: "memory",
    text: "최근 마음에 새겨두고 싶은 말씀이 있었습니까?",
  },
  {
    id: "q6",
    category: "evangel",
    text: "이웃에게 신앙을 전하거나 살아내고 싶은 마음이 있습니까?",
  },
  {
    id: "q7",
    category: "service",
    text: "공동체와 이웃을 위해 작은 섬김을 시작하고 있습니까?",
  },
];

// 4점 척도: 0=전혀 / 1=조금 / 2=꽤 / 3=많이
export const SCALE_LABELS = ["전혀", "조금", "꽤", "많이"] as const;

export function scoreByCategory(
  answers: Record<string, number>,
): Record<CategorySlug, number> {
  const result: Record<CategorySlug, number> = {
    worship: 0,
    word: 0,
    prayer: 0,
    qt: 0,
    memory: 0,
    evangel: 0,
    service: 0,
  };
  for (const q of TOZER_QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === "number") {
      result[q.category] += v;
    }
  }
  return result;
}

export function recommend(scores: Record<CategorySlug, number>): {
  category: CategorySlug;
  message: string;
} {
  const entries = (Object.entries(scores) as [CategorySlug, number][]).sort(
    (a, b) => a[1] - b[1],
  );
  const lowest = entries[0]?.[0] ?? "prayer";

  const messages: Record<CategorySlug, string> = {
    worship: "예배의 자리를 다시 마주하는 한 주간을 추천합니다.",
    word: "한 절씩이라도 마음에 머무는 말씀 시간을 권합니다.",
    prayer: "짧아도 정직한 기도부터 시작해보면 어떨까요.",
    qt: "조용한 5분의 시간이 회복의 시작이 됩니다.",
    memory: "마음에 새기고 싶은 한 구절을 찾아 적어보세요.",
    evangel: "가까운 한 사람을 위해 마음을 두는 한 주가 필요합니다.",
    service: "작은 섬김 한 가지를 시작해보세요.",
  };

  return { category: lowest, message: messages[lowest] };
}
