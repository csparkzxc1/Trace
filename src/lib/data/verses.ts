export type Verse = {
  reference: string;
  text: string;
  translation: string;
};

const VERSES: Verse[] = [
  {
    reference: "마태복음 11:28",
    text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라",
    translation: "개역개정",
  },
  {
    reference: "시편 23:1",
    text: "여호와는 나의 목자시니 내게 부족함이 없으리로다",
    translation: "개역개정",
  },
  {
    reference: "이사야 41:10",
    text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라",
    translation: "개역개정",
  },
  {
    reference: "빌립보서 4:6",
    text: "아무것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라",
    translation: "개역개정",
  },
  {
    reference: "예레미야 29:11",
    text: "여호와의 말씀이니라 너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라",
    translation: "개역개정",
  },
  {
    reference: "시편 46:10",
    text: "너희는 가만히 있어 내가 하나님 됨을 알지어다",
    translation: "개역개정",
  },
  {
    reference: "잠언 3:5-6",
    text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라",
    translation: "개역개정",
  },
];

export function pickVerseForDate(iso: string): Verse {
  const d = new Date(iso);
  const dayIndex =
    Math.floor(d.getTime() / 86400000) % VERSES.length;
  return VERSES[dayIndex] ?? VERSES[0]!;
}
