import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { useCheckinStore } from "@/lib/stores/checkin";
import * as checkinApi from "@/lib/api/checkin";
import * as catApi from "@/lib/api/categories";
import type { TrainingCategory, DailyCheck } from "@/types/database";
import { todayIso, addDays, startOfWeek, rangeDays } from "@/lib/utils/date";
import {
  enqueueCheckin,
  flushQueue,
  readQueue,
} from "@/lib/queue/offline-queue";

export type TodayHookValue = {
  loading: boolean;
  date: string;
  categories: TrainingCategory[];
  checks: Record<string, DailyCheck>;
  completedCount: number;
  heatmap: { date: string; count: number }[];
  streak: number;
  toggle: (category: TrainingCategory) => Promise<void>;
  reload: () => Promise<void>;
};

export function useToday(): TodayHookValue {
  const userId = useAuthStore((s) => s.user?.id);
  const date = todayIso();
  const upsert = useCheckinStore((s) => s.upsert);
  const remove = useCheckinStore((s) => s.remove);
  const dayChecks = useCheckinStore((s) => s.byDate[date] ?? {});

  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [heatmap, setHeatmap] = useState<{ date: string; count: number }[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [cats, todayChecks, weekHeatmap, st] = await Promise.all([
        catApi.fetchDefaultCategories(),
        checkinApi.fetchTodayChecks(userId, date),
        checkinApi
          .fetchHeatmap(userId, startOfWeek(date))
          .catch(() => [] as { date: string; completed_count: number }[]),
        checkinApi.fetchUserStreak(userId).catch(() => 0),
      ]);
      setCategories(cats);
      todayChecks.forEach(upsert);
      const week = rangeDays(startOfWeek(date), 7).map((d) => {
        const found = weekHeatmap.find((h) => h.date === d);
        return { date: d, count: found?.completed_count ?? 0 };
      });
      setHeatmap(week);
      setStreak(st);
    } finally {
      setLoading(false);
    }
  }, [userId, date, upsert]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(
    async (category: TrainingCategory) => {
      if (!userId) return;
      const existing = dayChecks[category.id];
      const intent = !existing?.completed;
      const optimistic: DailyCheck = {
        id: existing?.id ?? `optimistic-${category.id}`,
        user_id: userId,
        date,
        category_id: category.id,
        completed: intent,
        duration_minutes: existing?.duration_minutes ?? null,
        note: existing?.note ?? null,
        scripture_ref: existing?.scripture_ref ?? null,
        created_at: existing?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      upsert(optimistic);
      try {
        const saved = await checkinApi.toggleCheckRpc(category.id, date);
        upsert(saved);
      } catch {
        // 네트워크/일시적 오류 — 화면 상태는 그대로 유지하고 큐에 의도 보관.
        // 재기동/재연결 시 flush 가 처리한다.
        enqueueCheckin({
          userId,
          date,
          categoryId: category.id,
          intentCompleted: intent,
        });
      }
    },
    [userId, date, dayChecks, upsert],
  );

  // 화면 진입 시 큐 플러시. 성공 시 저장된 체크 결과로 로컬 상태 갱신.
  const flushPendingQueue = useCallback(async () => {
    if (!userId) return;
    if (readQueue().length === 0) return;
    await flushQueue(async (item) => {
      if (item.userId !== userId) return; // 다른 계정 데이터는 건드리지 않음
      const current = await checkinApi
        .fetchTodayChecks(item.userId, item.date)
        .then((rows) => rows.find((r) => r.category_id === item.categoryId));
      if (current?.completed === item.intentCompleted) return; // 이미 일치
      const saved = await checkinApi.toggleCheckRpc(
        item.categoryId,
        item.date,
      );
      // 의도와 다르면 한 번 더 토글 (idempotent 보정)
      if (saved.completed !== item.intentCompleted) {
        await checkinApi.toggleCheckRpc(item.categoryId, item.date);
      }
    });
    // 큐 처리 후 화면 데이터 재조회로 일관성 회복
    await load();
  }, [userId, load]);

  useEffect(() => {
    flushPendingQueue();
  }, [flushPendingQueue]);

  void remove;

  const completedCount = Object.values(dayChecks).filter(
    (c) => c.completed,
  ).length;

  return {
    loading,
    date,
    categories,
    checks: dayChecks,
    completedCount,
    heatmap,
    streak,
    toggle,
    reload: load,
  };
}

export function nextWeekHeatmapStart(): string {
  return addDays(todayIso(), -6);
}
