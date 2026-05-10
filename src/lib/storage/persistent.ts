// 영속 저장 추상화. 네이티브에서는 MMKV(빠르고 동기적), 그 외 환경에서는
// in-memory fallback. 테스트 환경에서도 동작하도록 Storage 인터페이스만 노출.

export type PersistentStorage = {
  getString(key: string): string | null;
  setString(key: string, value: string): void;
  delete(key: string): void;
};

let storage: PersistentStorage;

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

try {
  // react-native-mmkv 는 native binding 이 필요 — Jest 환경에서는 require 실패.
  // 그 경우 메모리 storage 로 폴백.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MMKV } = require("react-native-mmkv") as typeof import("react-native-mmkv");
  const mmkv = new MMKV({ id: "trace.persistent" });
  storage = {
    getString: (k) => mmkv.getString(k) ?? null,
    setString: (k, v) => mmkv.set(k, v),
    delete: (k) => mmkv.delete(k),
  };
} catch {
  storage = memoryStorage();
}

export const persistentStorage = storage;

// 테스트에서 강제로 메모리 storage 로 교체할 때 사용
export function __setPersistentStorageForTests(s: PersistentStorage) {
  storage = s;
  Object.assign(persistentStorage, s);
}
