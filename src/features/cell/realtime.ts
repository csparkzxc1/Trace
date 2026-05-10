// 구역 보드 Realtime 구독 — 순수 함수로 분리해 테스트 가능.
// supabase 클라이언트와 콜백을 받아 unsubscribe 함수를 반환한다.
//
// 호출자(useCellBoard) 책임:
//   - cellId/viewerId 가 있을 때만 호출
//   - effect cleanup 에서 반환된 unsubscribe() 를 반드시 실행

import type { Encouragement } from "@/types/database";

type DailyCheckRow = { user_id?: string };

type Unsubscribe = () => void;

// 테스트와 실제 supabase 양쪽 모두에서 동작하도록 최소 인터페이스만 요구.
export type RealtimeChannelLike = {
  on: (event: string, opts: unknown, cb: (payload: unknown) => void) => RealtimeChannelLike;
  subscribe: () => RealtimeChannelLike;
};

export type RealtimeClient = {
  channel: (name: string) => RealtimeChannelLike;
  removeChannel: (channel: RealtimeChannelLike) => unknown;
};

export function subscribeCellChecks(
  client: RealtimeClient,
  cellId: string,
  onChange: (row: DailyCheckRow) => void,
): Unsubscribe {
  const channel = client
    .channel(`cell:${cellId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "daily_checks",
      },
      (payload) => {
        const p = payload as { new?: unknown; old?: unknown };
        const row = (p.new ?? p.old) as DailyCheckRow | null;
        if (row?.user_id) onChange(row);
      },
    )
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}

export function subscribeIncomingEncouragements(
  client: RealtimeClient,
  viewerId: string,
  onIncoming: (e: Encouragement) => void,
): Unsubscribe {
  const channel = client
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
        const p = payload as { new?: unknown };
        if (p.new) onIncoming(p.new as Encouragement);
      },
    )
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}
