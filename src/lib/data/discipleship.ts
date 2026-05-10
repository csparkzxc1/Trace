// 제자훈련 커리큘럼 (스텁).
// §14 V2 백로그: 사랑의교회·온누리·CCC 라이선스 협의 후 정식 데이터로 교체.
// 그 전까지는 사용자가 자체 커리큘럼을 등록해 진도만 추적할 수 있는 구조.

export type DiscipleshipModule = {
  id: string;
  title: string;
  description: string;
  weeks: number;
  // null이면 "내 커리큘럼" — 사용자 직접 등록
  source: "samrang" | "onnuri" | "ccc" | "custom" | null;
};

// 출시 전엔 비어있음 — 라이선스 확보 후 실제 데이터 주입.
// 사용자는 [나 → 제자훈련] 진입 시 빈 상태 → 커리큘럼 등록 안내를 본다.
export const BUILTIN_MODULES: DiscipleshipModule[] = [];
