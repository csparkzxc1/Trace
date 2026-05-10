// 흔적 · Trace — Supabase 데이터베이스 타입.
// 마이그레이션 0001/0002와 1:1 매칭. 실제 운영에선 supabase gen types 사용.

export type Iso = string;
export type DateStr = string;

export type Role = "member" | "cell_leader" | "pastor" | "admin";
export type LicenseTier = "free" | "church" | "enterprise";

export type CategorySlug =
  | "worship"
  | "word"
  | "prayer"
  | "qt"
  | "memory"
  | "evangel"
  | "service";

export type Church = {
  id: string;
  name: string;
  denomination: string | null;
  address: string | null;
  pastor_name: string | null;
  license_tier: LicenseTier;
  license_until: DateStr | null;
  created_at: Iso;
  updated_at: Iso;
}

export type Cell = {
  id: string;
  church_id: string;
  name: string;
  leader_id: string | null;
  invite_code: string;
  created_at: Iso;
  updated_at: Iso;
}

export type UserProfile = {
  id: string;
  email: string;
  display_name: string;
  church_id: string | null;
  cell_id: string | null;
  role: Role;
  baptism_date: DateStr | null;
  joined_church_at: DateStr | null;
  avatar_url: string | null;
  is_premium: boolean;
  premium_until: DateStr | null;
  created_at: Iso;
  updated_at: Iso;
}

export type TrainingCategory = {
  id: string;
  church_id: string | null;
  slug: CategorySlug | string;
  name_ko: string;
  name_en: string | null;
  icon: string | null;
  sort_order: number;
  is_default: boolean;
  created_at: Iso;
}

export type DailyCheck = {
  id: string;
  user_id: string;
  date: DateStr;
  category_id: string;
  completed: boolean;
  duration_minutes: number | null;
  note: string | null;
  scripture_ref: string | null;
  created_at: Iso;
  updated_at: Iso;
}

export type PrayerJournalEntry = {
  id: string;
  user_id: string;
  title: string | null;
  request: string;
  scripture_ref: string | null;
  is_shared_to_cell: boolean;
  answered_at: Iso | null;
  answer_note: string | null;
  created_at: Iso;
  updated_at: Iso;
}

export type ScriptureMemory = {
  id: string;
  user_id: string;
  reference: string;
  text: string;
  translation: string;
  srs_level: number;
  ease_factor: number;
  next_review_at: Iso;
  last_reviewed_at: Iso | null;
  total_reviews: number;
  created_at: Iso;
  updated_at: Iso;
}

export type ReadingPlanProgress = {
  user_id: string;
  plan_id: string;
  date: DateStr;
  passage_ref: string;
  completed: boolean;
  updated_at: Iso;
}

export type Assessment = {
  id: string;
  user_id: string;
  type: string;
  answers: Record<string, number | string | boolean>;
  scores: Record<CategorySlug | string, number>;
  created_at: Iso;
}

export type Encouragement = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  emoji: string | null;
  message: string | null;
  created_at: Iso;
}

export type VisibilitySettings = {
  user_id: string;
  share_streak: boolean;
  share_categories: string[];
  share_total_only: boolean;
  hide_from_leader: boolean;
  updated_at: Iso;
}

export type NotificationSettings = {
  user_id: string;
  morning_prayer_at: string | null;
  qt_at: string | null;
  evening_review_at: string | null;
  weekly_summary_day: number;
  push_token: string | null;
  push_enabled: boolean;
  updated_at: Iso;
}

export type BillingKey = {
  user_id: string;
  billing_key: string;
  card_company: string | null;
  card_last4: string | null;
  status: "active" | "suspended" | "revoked";
  issued_at: Iso;
  updated_at: Iso;
}

// Insert/Update를 Partial로 완화 — 실제 DB가 RLS·column default·NOT NULL을
// 검증한다. 클라이언트 타입 단계에서 모든 필수 컬럼을 강제하면 upsert·patch
// 시그니처가 비현실적으로 무거워지므로 Supabase 공식 codegen과 동일한 정책.
type TableEntry<R> = {
  Row: R;
  Insert: Partial<R>;
  Update: Partial<R>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      churches: TableEntry<Church>;
      cells: TableEntry<Cell>;
      users: TableEntry<UserProfile>;
      training_categories: TableEntry<TrainingCategory>;
      daily_checks: TableEntry<DailyCheck>;
      prayer_journal: TableEntry<PrayerJournalEntry>;
      scripture_memory: TableEntry<ScriptureMemory>;
      reading_plan_progress: TableEntry<ReadingPlanProgress>;
      assessments: TableEntry<Assessment>;
      encouragements: TableEntry<Encouragement>;
      visibility_settings: TableEntry<VisibilitySettings>;
      notification_settings: TableEntry<NotificationSettings>;
      billing_keys: TableEntry<BillingKey>;
    };
    Views: {
      daily_checks_public: {
        Row: Omit<DailyCheck, "note" | "scripture_ref">;
        Relationships: [];
      };
      prayer_journal_shared: {
        Row: Pick<
          PrayerJournalEntry,
          "id" | "user_id" | "title" | "request" | "scripture_ref" | "created_at"
        >;
        Relationships: [];
      };
      billing_key_summary: {
        Row: Pick<
          BillingKey,
          "user_id" | "card_company" | "card_last4" | "status" | "issued_at"
        >;
        Relationships: [];
      };
    };
    Functions: {
      toggle_check: {
        Args: { p_category_id: string; p_date?: DateStr };
        Returns: DailyCheck;
      };
      get_user_streak: { Args: { p_user_id: string }; Returns: number };
      get_week_heatmap: {
        Args: { p_user_id: string; p_start_date: DateStr };
        Returns: { date: DateStr; completed_count: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
