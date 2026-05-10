import type { CategorySlug } from "@/types/database";

export const DEFAULT_CATEGORIES: {
  slug: CategorySlug;
  ko: string;
  en: string;
}[] = [
  { slug: "worship", ko: "예배", en: "Worship" },
  { slug: "word", ko: "말씀", en: "Word" },
  { slug: "prayer", ko: "기도", en: "Prayer" },
  { slug: "qt", ko: "큐티", en: "Quiet Time" },
  { slug: "memory", ko: "암송", en: "Memory" },
  { slug: "evangel", ko: "전도", en: "Evangelism" },
  { slug: "service", ko: "봉사", en: "Service" },
];
