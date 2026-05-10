import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as cellApi from "@/lib/api/cell";
import type { Encouragement, UserProfile } from "@/types/database";
import { todayIso } from "@/lib/utils/date";

export type BoardEntry = {
  member: UserProfile;
  todayCount: number;
  lastActiveAt: string | null;
};

export function useCellBoard(cellId: string | null, viewerId: string | null) {
  const [entries, setEntries] = useState<BoardEntry[]>([]);
  const [recentEncouragement, setRecent] = useState<Encouragement | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!cellId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [members, checks] = await Promise.all([
        cellApi.fetchCellMembers(cellId),
        cellApi.fetchCellPublicChecks(cellId, todayIso()),
      ]);
      const sorted = members
        .slice()
        .sort((a, b) => a.display_name.localeCompare(b.display_name, "ko"));
      const next: BoardEntry[] = sorted.map((m) => ({
        member: m,
        todayCount: checks.filter((c) => c.user_id === m.id && c.completed)
          .length,
        lastActiveAt: null,
      }));
      setEntries(next);
    } finally {
      setLoading(false);
    }
  }, [cellId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Realtime: 같은 구역 멤버의 daily_checks 변경 시 board 재조회
  useEffect(() => {
    if (!cellId) return;
    const channel = supabase
      .channel(`cell:${cellId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_checks",
        },
        (payload) => {
          const row = (payload.new ?? payload.old) as
            | { user_id?: string }
            | null;
          if (!row?.user_id) return;
          if (entries.some((e) => e.member.id === row.user_id)) {
            reload();
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [cellId, entries, reload]);

  // Realtime: 본인이 받은 격려를 즉시 노출
  useEffect(() => {
    if (!viewerId) return;
    const channel = supabase
      .channel(`encouragements:${viewerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "encouragements",
          filter: `to_user_id=eq.${viewerId}`,
        },
        (payload) => {
          setRecent(payload.new as Encouragement);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [viewerId]);

  return {
    entries,
    loading,
    recentEncouragement,
    dismissEncouragement: () => setRecent(null),
    reload,
  };
}
