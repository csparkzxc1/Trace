import { create } from "zustand";
import type { DailyCheck } from "@/types/database";

type CheckinState = {
  byDate: Record<string, Record<string, DailyCheck>>;
  upsert: (check: DailyCheck) => void;
  remove: (date: string, categoryId: string) => void;
  getDay: (date: string) => Record<string, DailyCheck>;
  countCompleted: (date: string) => number;
};

export const useCheckinStore = create<CheckinState>((set, get) => ({
  byDate: {},
  upsert: (check) =>
    set((s) => ({
      byDate: {
        ...s.byDate,
        [check.date]: {
          ...(s.byDate[check.date] ?? {}),
          [check.category_id]: check,
        },
      },
    })),
  remove: (date, categoryId) =>
    set((s) => {
      const day = { ...(s.byDate[date] ?? {}) };
      delete day[categoryId];
      return { byDate: { ...s.byDate, [date]: day } };
    }),
  getDay: (date) => get().byDate[date] ?? {},
  countCompleted: (date) =>
    Object.values(get().byDate[date] ?? {}).filter((c) => c.completed).length,
}));
