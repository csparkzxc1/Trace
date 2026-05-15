import type { CategorySlug } from "./database";

export const TRACE_THRESHOLD = 4;

export type CheckSummary = {
  date: string;
  completedCount: number;
  isTraceDay: boolean;
};

export type CategorySummary = {
  slug: CategorySlug | string;
  nameKo: string;
  nameEn: string | null;
  count: number;
};

export type CellMemberSnapshot = {
  userId: string;
  displayName: string;
  todayCount: number | null;
  lastActiveAt: string | null;
};

export type SrsQuality = 0 | 1 | 2 | 3;

export const SRS_QUALITY_LABELS_KO: Record<SrsQuality, string> = {
  0: "어려움",
  1: "보통",
  2: "쉬움",
  3: "완벽",
};
