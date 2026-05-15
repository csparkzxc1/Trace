import {
  enqueueCheckin,
  dequeueCheckin,
  readQueue,
  flushQueue,
  clearQueue,
  type QueuedCheckin,
} from "../offline-queue";
import type { PersistentStorage } from "@/lib/storage/persistent";

function memoryStorage(): PersistentStorage {
  const map = new Map<string, string>();
  return {
    getString: (k) => map.get(k) ?? null,
    setString: (k, v) => {
      map.set(k, v);
    },
    delete: (k) => {
      map.delete(k);
    },
  };
}

describe("Offline check-in queue (§8.1)", () => {
  test("빈 큐는 빈 배열을 반환한다", () => {
    const s = memoryStorage();
    expect(readQueue(s)).toEqual([]);
  });

  test("새 항목을 enqueue 하면 큐에 1개 들어간다", () => {
    const s = memoryStorage();
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1", intentCompleted: true },
      s,
    );
    const q = readQueue(s);
    expect(q.length).toBe(1);
    expect(q[0]).toMatchObject({
      userId: "u1",
      date: "2026-05-10",
      categoryId: "c1",
      intentCompleted: true,
    });
  });

  test("같은 (user,date,category) 재토글 시 마지막 의도 1개만 보관 (idempotent)", () => {
    const s = memoryStorage();
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1", intentCompleted: true },
      s,
    );
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1", intentCompleted: false },
      s,
    );
    const q = readQueue(s);
    expect(q.length).toBe(1);
    expect(q[0]?.intentCompleted).toBe(false);
  });

  test("다른 카테고리는 별도 항목으로 유지된다", () => {
    const s = memoryStorage();
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1", intentCompleted: true },
      s,
    );
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c2", intentCompleted: true },
      s,
    );
    expect(readQueue(s).length).toBe(2);
  });

  test("dequeue 는 정확히 키와 일치하는 항목만 제거", () => {
    const s = memoryStorage();
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1", intentCompleted: true },
      s,
    );
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c2", intentCompleted: true },
      s,
    );
    dequeueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1" },
      s,
    );
    const q = readQueue(s);
    expect(q.length).toBe(1);
    expect(q[0]?.categoryId).toBe("c2");
  });

  test("flush 모두 성공 시 큐가 비워진다", async () => {
    const s = memoryStorage();
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1", intentCompleted: true },
      s,
    );
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c2", intentCompleted: true },
      s,
    );

    const sent: QueuedCheckin[] = [];
    const result = await flushQueue(async (it) => {
      sent.push(it);
    }, s);

    expect(result).toEqual({ attempted: 2, succeeded: 2, failed: 0 });
    expect(readQueue(s).length).toBe(0);
    expect(sent.length).toBe(2);
  });

  test("flush 일부 실패 시 실패 항목만 큐에 남는다", async () => {
    const s = memoryStorage();
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "ok", intentCompleted: true },
      s,
    );
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "fail", intentCompleted: true },
      s,
    );

    const result = await flushQueue(async (it) => {
      if (it.categoryId === "fail") throw new Error("network");
    }, s);

    expect(result).toEqual({ attempted: 2, succeeded: 1, failed: 1 });
    const q = readQueue(s);
    expect(q.length).toBe(1);
    expect(q[0]?.categoryId).toBe("fail");
  });

  test("clearQueue 는 모든 항목을 제거한다", () => {
    const s = memoryStorage();
    enqueueCheckin(
      { userId: "u1", date: "2026-05-10", categoryId: "c1", intentCompleted: true },
      s,
    );
    clearQueue(s);
    expect(readQueue(s)).toEqual([]);
  });

  test("저장 데이터가 손상돼도 빈 배열로 회복", () => {
    const s = memoryStorage();
    s.setString("trace.checkin.queue.v1", "{not-json");
    expect(readQueue(s)).toEqual([]);
  });
});
