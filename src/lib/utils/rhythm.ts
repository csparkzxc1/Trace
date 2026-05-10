// "올해의 결" — 정성적 회고 알고리즘 (§6.3 카피 톤 준수)
//
// 목적: 1년치 daily_checks를 입력 받아, 사용자 본인의 동행을 따뜻한
// 톤으로 회고하는 3~4줄을 생성한다. 모든 템플릿은 점수화·비교·정죄
// 표현을 배제한다 (§7.5).

import type { CategorySlug } from "@/types/database";
import { DEFAULT_CATEGORIES } from "./categories";
import { todayIso, addDays } from "./date";

export type DayActivity = {
  date: string;
  count: number;
  byCategory: Partial<Record<CategorySlug, number>>; // 1 if completed in that cat
};

export type RhythmSignals = {
  totalTraceDays: number;
  totalChecks: number;
  seasonOpener: { season: string; category: CategorySlug } | null;
  peakWindow: { startDate: string; weeks: number; avgCount: number } | null;
  recentEmphasis: { month: number; category: CategorySlug } | null;
  sundayContinuity: { weeks: number } | null;
  quietPause: { startDate: string; days: number } | null;
  evenDistribution: boolean;
  singleFocus: { category: CategorySlug; share: number } | null;
};

export type EmphasisRange = {
  start: number;
  end: number;
  tone: "em" | "accent";
};

export type RhythmLine = {
  template: string;
  text: string;
  emphases: EmphasisRange[];
  period: number; // 0~12, 시간순 정렬용
  weight: number;
};

const TRACE_THRESHOLD = 4;

function categoryNameKo(slug: CategorySlug): string {
  return DEFAULT_CATEGORIES.find((c) => c.slug === slug)?.ko ?? "흔적";
}

function seasonOf(month: number): string {
  if (month <= 1) return "겨울";
  if (month <= 4) return "봄";
  if (month <= 7) return "여름";
  if (month <= 10) return "가을";
  return "겨울";
}

function monthLabel(month: number): string {
  return `${month + 1}월`;
}

// ============================================================================
// 1) 시그널 추출
// ============================================================================
export function extractSignals(
  days: DayActivity[],
  reference: string = todayIso(),
): RhythmSignals {
  const refDate = new Date(reference);
  const refMonth = refDate.getMonth();

  let totalChecks = 0;
  let totalTraceDays = 0;
  const monthlyCategoryCounts: Record<
    number,
    Partial<Record<CategorySlug, number>>
  > = {};
  const overallCategory: Partial<Record<CategorySlug, number>> = {};

  for (const d of days) {
    totalChecks += d.count;
    if (d.count >= TRACE_THRESHOLD) totalTraceDays += 1;
    const m = new Date(d.date).getMonth();
    if (!monthlyCategoryCounts[m]) monthlyCategoryCounts[m] = {};
    for (const [slug, v] of Object.entries(d.byCategory)) {
      const s = slug as CategorySlug;
      monthlyCategoryCounts[m]![s] = (monthlyCategoryCounts[m]![s] ?? 0) + (v ?? 0);
      overallCategory[s] = (overallCategory[s] ?? 0) + (v ?? 0);
    }
  }

  // seasonOpener: 1~3월 (m 0,1,2)에서 dominant category
  const earlyCounts: Partial<Record<CategorySlug, number>> = {};
  for (const m of [0, 1, 2]) {
    for (const [slug, v] of Object.entries(monthlyCategoryCounts[m] ?? {})) {
      const s = slug as CategorySlug;
      earlyCounts[s] = (earlyCounts[s] ?? 0) + (v ?? 0);
    }
  }
  const seasonOpener = pickDominant(earlyCounts);
  const earlyMonth = days.find((d) => d.count > 0);

  // peakWindow: 3주(21일) 롤링 윈도우 평균 카운트 최대
  let peakWindow: RhythmSignals["peakWindow"] = null;
  if (days.length >= 21) {
    let bestSum = 0;
    let bestStart = 0;
    let sum = 0;
    for (let i = 0; i < days.length; i++) {
      sum += days[i]?.count ?? 0;
      if (i >= 21) sum -= days[i - 21]?.count ?? 0;
      if (i >= 20 && sum > bestSum) {
        bestSum = sum;
        bestStart = i - 20;
      }
    }
    if (bestSum >= 21) {
      // 평균 1 이상이어야 의미 있음
      peakWindow = {
        startDate: days[bestStart]?.date ?? days[0]!.date,
        weeks: 3,
        avgCount: bestSum / 21,
      };
    }
  }

  // recentEmphasis: 직전 완료 월의 dominant
  const lastCompleteMonth = (refMonth - 1 + 12) % 12;
  const lastCounts = monthlyCategoryCounts[lastCompleteMonth] ?? {};
  const recentDom = pickDominant(lastCounts);
  const recentEmphasis = recentDom
    ? { month: lastCompleteMonth, category: recentDom }
    : null;

  // sundayContinuity: 가장 최근 주일부터 거꾸로 worship 연속 주수.
  // reference 자체가 days에 없어도 days 안의 가장 최근 일요일부터 시작.
  let sundayContinuity: RhythmSignals["sundayContinuity"] = null;
  let consec = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i]!;
    if (d.date > reference) continue;
    if (new Date(d.date).getDay() !== 0) continue;
    if ((d.byCategory.worship ?? 0) > 0) {
      consec += 1;
    } else {
      break;
    }
  }
  if (consec >= 3) sundayContinuity = { weeks: consec };

  // quietPause: 7일 이상 흔적의 날이 한 번도 없는 가장 최근 구간.
  // 배열 끝까지 이어진 run도 잡도록 루프 후 한 번 더 평가.
  let quietPause: RhythmSignals["quietPause"] = null;
  let runStart: string | null = null;
  let runLen = 0;
  const flushRun = () => {
    if (runStart && runLen >= 7) {
      quietPause = { startDate: runStart, days: runLen };
    }
  };
  for (const d of days) {
    if (d.count < TRACE_THRESHOLD) {
      if (!runStart) runStart = d.date;
      runLen += 1;
    } else {
      flushRun();
      runStart = null;
      runLen = 0;
    }
  }
  flushRun();

  // evenDistribution / singleFocus
  const totalCat = Object.values(overallCategory).reduce(
    (a, b) => a + (b ?? 0),
    0,
  );
  let evenDistribution = false;
  let singleFocus: RhythmSignals["singleFocus"] = null;
  if (totalCat > 0) {
    const values = DEFAULT_CATEGORIES.map(
      (c) => overallCategory[c.slug] ?? 0,
    );
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const stdev = Math.sqrt(variance);
    if (mean > 0 && stdev / mean < 0.3) evenDistribution = true;

    const dominant = pickDominant(overallCategory);
    if (dominant) {
      const share = (overallCategory[dominant] ?? 0) / totalCat;
      if (share > 0.4) singleFocus = { category: dominant, share };
    }
  }

  void earlyMonth;

  return {
    totalTraceDays,
    totalChecks,
    seasonOpener: seasonOpener
      ? { season: seasonOf(0), category: seasonOpener }
      : null,
    peakWindow,
    recentEmphasis,
    sundayContinuity,
    quietPause,
    evenDistribution,
    singleFocus,
  };
}

function pickDominant(
  counts: Partial<Record<CategorySlug, number>>,
): CategorySlug | null {
  let best: CategorySlug | null = null;
  let bestN = 0;
  for (const [slug, v] of Object.entries(counts)) {
    if ((v ?? 0) > bestN) {
      bestN = v ?? 0;
      best = slug as CategorySlug;
    }
  }
  return bestN > 0 ? best : null;
}

// ============================================================================
// 2) 라인 후보 생성 + 선택
// ============================================================================

function makeLine(
  template: string,
  textParts: string[],
  emTokens: string[],
  weight: number,
  period: number,
): RhythmLine {
  // emTokens가 textParts 사이에 끼어든다고 가정. 결과 문자열 + emphasis 범위 계산.
  let text = "";
  const emphases: EmphasisRange[] = [];
  for (let i = 0; i < textParts.length; i++) {
    text += textParts[i];
    if (i < emTokens.length) {
      const start = text.length;
      text += emTokens[i];
      const end = text.length;
      emphases.push({ start, end, tone: "em" });
    }
  }
  return { template, text, emphases, period, weight };
}

export function generateRhythm(signals: RhythmSignals): RhythmLine[] {
  const candidates: RhythmLine[] = [];

  if (signals.seasonOpener) {
    candidates.push(
      makeLine(
        "season_opener",
        ["올해는 ", "와 함께 시작된 ", "이었습니다."],
        [
          categoryNameKo(signals.seasonOpener.category),
          signals.seasonOpener.season,
        ],
        80,
        1,
      ),
    );
  }

  if (signals.peakWindow) {
    const d = new Date(signals.peakWindow.startDate);
    const weekIdx = Math.ceil(d.getDate() / 7);
    const weekKo = ["첫째", "둘째", "셋째", "넷째", "다섯째"][weekIdx - 1] ?? "";
    candidates.push(
      makeLine(
        "peak_window",
        [`${monthLabel(d.getMonth())} ${weekKo}주부터 `, "주간 가장 깊이 동행하셨습니다."],
        [`${signals.peakWindow.weeks}`],
        70,
        d.getMonth() + 1,
      ),
    );
  }

  if (signals.recentEmphasis) {
    candidates.push(
      makeLine(
        "recent_emphasis",
        [`${monthLabel(signals.recentEmphasis.month)}에는 `, "이 가장 마음에 머물렀습니다."],
        [categoryNameKo(signals.recentEmphasis.category)],
        65,
        signals.recentEmphasis.month + 1,
      ),
    );
  }

  if (signals.sundayContinuity) {
    candidates.push(
      makeLine(
        "sunday_continuity",
        ["주일 예배의 흔적이 한 번도 끊기지 않았습니다 — ", "주 연속."],
        [`${signals.sundayContinuity.weeks}`],
        75,
        12,
      ),
    );
  }

  if (signals.quietPause && !signals.peakWindow) {
    const d = new Date(signals.quietPause.startDate);
    candidates.push(
      makeLine(
        "quiet_pause",
        [`${monthLabel(d.getMonth())}의 잠시 쉬어가신 자리도 흔적입니다.`],
        [],
        40,
        d.getMonth() + 1,
      ),
    );
  }

  if (signals.singleFocus) {
    candidates.push(
      makeLine(
        "single_focus",
        ["한 해 동안 ", "을 깊이 머무셨습니다."],
        [categoryNameKo(signals.singleFocus.category)],
        55,
        12,
      ),
    );
  } else if (signals.evenDistribution) {
    candidates.push(
      makeLine(
        "even_distribution",
        ["올해는 7가지 영역이 골고루 흔적을 남겼습니다."],
        [],
        50,
        12,
      ),
    );
  }

  // 폴백
  if (candidates.length === 0) {
    candidates.push(
      makeLine(
        "fallback",
        ["올해의 동행이 천천히 이어지고 있습니다."],
        [],
        10,
        0,
      ),
    );
  }

  // 충돌 정리: 같은 template은 1개만 (이미 위에서 보장됨)
  // weight 높은 순으로 4개 → period 오름차순 정렬
  const top = candidates
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);
  top.sort((a, b) => a.period - b.period);
  return top;
}
