import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as cellApi from "@/lib/api/cell";
import {
  subscribeCellChecks,
  subscribeIncomingEncouragements,
  type RealtimeClient,
} from "./realtime";
import type { Encouragement, UserProfile } from "@/types/database";
import { todayIso } from "@/lib/utils/date";

// 실제 supabase 클라이언트는 우리 최소 인터페이스의 상위 집합 — 캐스팅으로 사용.
const realtime = supabase as unknown as RealtimeClient;

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
    return subscribeCellChecks(realtime, cellId, (row) => {
      if (entries.some((e) => e.member.id === row.user_id)) {
        reload();
      }
    });
  }, [cellId, entries, reload]);

  // Realtime: 본인이 받은 격려를 즉시 노출
  useEffect(() => {
    if (!viewerId) return;
    return subscribeIncomingEncouragements(realtime, viewerId, setRecent);
  }, [viewerId]);

  return {
    entries,
    loading,
    recentEncouragement,
    dismissEncouragement: () => setRecent(null),
    reload,
  };
}
