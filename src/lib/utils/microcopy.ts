// §6.3 카피 톤 가이드 — 점수화·정죄 표현 절대 금지.
// 완료 개수에 따라 따뜻한 톤의 마이크로카피를 반환한다.

const FORBIDDEN = [
  "실패",
  "놓쳤습니다",
  "포기",
  "다시 처음부터",
  "벌점",
  "꼴찌",
  "분발",
  "0% 달성",
  "X점",
];

export function dailySummaryMessage(completedCount: number): string {
  if (completedCount <= 0) return "오늘도 동행을 시작합니다";
  if (completedCount < 4) return "천천히 가도 괜찮습니다";
  if (completedCount < 7) return `${completedCount}가지 흔적이 남았습니다`;
  return "오늘의 모든 흔적이 남았습니다 ·";
}

export function streakMessage(streakDays: number): string {
  if (streakDays <= 0) return "오늘 다시 시작";
  if (streakDays < 7) return `흔적이 이어지고 있습니다`;
  return `흔적이 깊어지고 있습니다`;
}

export function assertSafeCopy(text: string): void {
  for (const word of FORBIDDEN) {
    if (text.includes(word)) {
      throw new Error(`금기어가 카피에 포함됨: "${word}" → ${text}`);
    }
  }
}

export function isSafeCopy(text: string): boolean {
  return FORBIDDEN.every((w) => !text.includes(w));
}
