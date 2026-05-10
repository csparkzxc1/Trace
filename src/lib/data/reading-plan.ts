// 두란노 생명의삶 2026 일정 (스텁).
// 실제 출시 전 라이선스 확인 후 정식 데이터로 교체.

export type ReadingPlanDay = {
  date: string;
  passage: string;
};

export const READING_PLAN_ID = "duranno-2026";

const STARTING_BOOKS: { book: string; chapters: number }[] = [
  { book: "창세기", chapters: 50 },
  { book: "출애굽기", chapters: 40 },
  { book: "레위기", chapters: 27 },
  { book: "민수기", chapters: 36 },
  { book: "신명기", chapters: 34 },
];

export function readingForDay(dayIndex: number): string {
  let cursor = dayIndex;
  for (const { book, chapters } of STARTING_BOOKS) {
    if (cursor < chapters) {
      return `${book} ${cursor + 1}장`;
    }
    cursor -= chapters;
  }
  return "복습";
}

export function readingForDate(iso: string, planStart: string): string {
  const a = new Date(planStart).getTime();
  const b = new Date(iso).getTime();
  const dayIndex = Math.max(0, Math.floor((b - a) / 86400000));
  return readingForDay(dayIndex);
}
