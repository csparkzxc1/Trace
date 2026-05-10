// 가벼운 i18n 헬퍼.
// 1) 디바이스 locale 자동 감지 (expo-localization)
// 2) ko / en JSON 사전, 미발견 키는 ko 폴백 → 키 그대로 반환
// 3) {placeholder} 보간
//
// 본 헬퍼는 점진 적용용 — 기존 화면들의 하드코딩된 한글 카피는 점차 t() 로 교체.

import ko from "./ko.json";
import en from "./en.json";

let Localization: typeof import("expo-localization") | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Localization = require("expo-localization") as typeof import("expo-localization");
} catch {
  Localization = null;
}

type Dict = Record<string, string>;
const DICTS: Record<"ko" | "en", Dict> = {
  ko: ko as Dict,
  en: en as Dict,
};

export type Locale = keyof typeof DICTS;

let currentLocale: Locale = (() => {
  const tag = Localization?.getLocales?.()[0]?.languageCode;
  return tag === "en" ? "en" : "ko";
})();

export function setLocale(loc: Locale): void {
  currentLocale = loc;
}
export function getLocale(): Locale {
  return currentLocale;
}

export function t(
  key: string,
  vars: Record<string, string | number> = {},
): string {
  const dict = DICTS[currentLocale] ?? DICTS.ko;
  const raw = dict[key] ?? DICTS.ko[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_m, name: string) => {
    const v = vars[name];
    return v == null ? `{${name}}` : String(v);
  });
}
