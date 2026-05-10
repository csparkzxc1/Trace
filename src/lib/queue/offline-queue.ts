// 오프라인 체크인 큐 (§8.1)
// - 토글 시도 → 실패하면 큐에 누적 → 온라인 복귀/주기 플러시 시 일괄 송출
// - 같은 (user, date, category) 키는 마지막 의도 1개만 보관 (idempotent)
// - MMKV 영속 저장 (앱 재기동에도 유지)
//
// 본 모듈은 순수 로직 + 외부 storage 어댑터로 설계되어 단위 테스트 용이.

import type { PersistentStorage } from "@/lib/storage/persistent";
import { persistentStorage } from "@/lib/storage/persistent";

const QUEUE_KEY = "trace.checkin.queue.v1";

export type QueuedCheckin = {
  userId: string;
  date: string;
  categoryId: string;
  // 마지막 의도. 큐에 있는 동안 사용자가 다시 토글하면 덮어쓴다.
  intentCompleted: boolean;
  enqueuedAt: number;
};

type Queue = QueuedCheckin[];

function read(storage: PersistentStorage): Queue {
  const raw = storage.getString(QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Queue;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(storage: PersistentStorage, q: Queue): void {
  if (q.length === 0) {
    storage.delete(QUEUE_KEY);
    return;
  }
  storage.setString(QUEUE_KEY, JSON.stringify(q));
}

function keyOf(item: Pick<QueuedCheckin, "userId" | "date" | "categoryId">) {
  return `${item.userId}|${item.date}|${item.categoryId}`;
}

// ============================================================================
// 외부 API
// ============================================================================

export function enqueueCheckin(
  item: Omit<QueuedCheckin, "enqueuedAt">,
  storage: PersistentStorage = persistentStorage,
): void {
  const queue = read(storage);
  const k = keyOf(item);
  const existingIndex = queue.findIndex((q) => keyOf(q) === k);
  const next: QueuedCheckin = { ...item, enqueuedAt: Date.now() };
  if (existingIndex >= 0) {
    queue[existingIndex] = next;
  } else {
    queue.push(next);
  }
  write(storage, queue);
}

export function dequeueCheckin(
  item: Pick<QueuedCheckin, "userId" | "date" | "categoryId">,
  storage: PersistentStorage = persistentStorage,
): void {
  const queue = read(storage);
  const k = keyOf(item);
  const next = queue.filter((q) => keyOf(q) !== k);
  write(storage, next);
}

export function readQueue(
  storage: PersistentStorage = persistentStorage,
): QueuedCheckin[] {
  return read(storage);
}

export function clearQueue(
  storage: PersistentStorage = persistentStorage,
): void {
  storage.delete(QUEUE_KEY);
}

// ============================================================================
// flush — 큐 전체를 send 함수로 송출. 성공한 항목만 큐에서 제거.
// ============================================================================

export type FlushResult = {
  attempted: number;
  succeeded: number;
  failed: number;
};

export async function flushQueue(
  send: (item: QueuedCheckin) => Promise<void>,
  storage: PersistentStorage = persistentStorage,
): Promise<FlushResult> {
  const queue = read(storage);
  if (queue.length === 0) return { attempted: 0, succeeded: 0, failed: 0 };

  const survivors: QueuedCheckin[] = [];
  let succeeded = 0;
  for (const item of queue) {
    try {
      await send(item);
      succeeded += 1;
    } catch {
      survivors.push(item);
    }
  }
  write(storage, survivors);
  return {
    attempted: queue.length,
    succeeded,
    failed: queue.length - succeeded,
  };
}
