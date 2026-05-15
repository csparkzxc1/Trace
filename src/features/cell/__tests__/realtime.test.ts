import {
  subscribeCellChecks,
  subscribeIncomingEncouragements,
  type RealtimeClient,
  type RealtimeChannelLike,
} from "../realtime";

type Captured = {
  client: RealtimeClient;
  channelName: string | null;
  onArgs: { event: string; opts: unknown } | null;
  callback: ((p: unknown) => void) | null;
  removed: number;
};

function makeMock(): Captured {
  const captured: Captured = {
    client: undefined as unknown as RealtimeClient,
    channelName: null,
    onArgs: null,
    callback: null,
    removed: 0,
  };

  const handle: RealtimeChannelLike = {
    on: (event, opts, cb) => {
      captured.onArgs = { event, opts };
      captured.callback = cb;
      return handle;
    },
    subscribe: () => handle,
  };

  captured.client = {
    channel: (name: string) => {
      captured.channelName = name;
      return handle;
    },
    removeChannel: () => {
      captured.removed += 1;
      return null;
    },
  };

  return captured;
}

describe("Cell realtime — leak 방지 + 동작", () => {
  test("subscribeCellChecks: 채널명·이벤트·테이블 검증 + cleanup 시 removeChannel 호출", () => {
    const m = makeMock();
    const onChange = jest.fn();

    const unsub = subscribeCellChecks(m.client, "cell-1", onChange);

    expect(m.channelName).toBe("cell:cell-1");
    expect(m.onArgs?.event).toBe("postgres_changes");
    expect(m.onArgs?.opts).toMatchObject({
      event: "*",
      schema: "public",
      table: "daily_checks",
    });
    expect(m.removed).toBe(0);

    unsub();
    expect(m.removed).toBe(1);
  });

  test("subscribeCellChecks: payload.new 우선, 없으면 old, user_id 없으면 무시", () => {
    const m = makeMock();
    const onChange = jest.fn();
    subscribeCellChecks(m.client, "cell-1", onChange);

    m.callback?.({ new: { user_id: "u-new" } });
    expect(onChange).toHaveBeenLastCalledWith({ user_id: "u-new" });

    m.callback?.({ old: { user_id: "u-old" } });
    expect(onChange).toHaveBeenLastCalledWith({ user_id: "u-old" });

    m.callback?.({ new: {} });
    expect(onChange).toHaveBeenCalledTimes(2);

    m.callback?.({});
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test("subscribeIncomingEncouragements: filter + cleanup + payload.new 만 호출", () => {
    const m = makeMock();
    const onIncoming = jest.fn();

    const unsub = subscribeIncomingEncouragements(
      m.client,
      "viewer-1",
      onIncoming,
    );

    expect(m.channelName).toBe("encouragements:viewer-1");
    expect(m.onArgs?.opts).toMatchObject({
      event: "INSERT",
      table: "encouragements",
      filter: "to_user_id=eq.viewer-1",
    });

    m.callback?.({ new: { id: "e1", emoji: "·" } });
    expect(onIncoming).toHaveBeenCalledWith({ id: "e1", emoji: "·" });

    m.callback?.({});
    expect(onIncoming).toHaveBeenCalledTimes(1);

    unsub();
    expect(m.removed).toBe(1);
  });

  test("이중 unsubscribe 호출 시 removeChannel 두 번 호출 (호출자 책임)", () => {
    const m = makeMock();
    const unsub = subscribeCellChecks(m.client, "x", jest.fn());
    unsub();
    unsub();
    expect(m.removed).toBe(2);
  });
});
