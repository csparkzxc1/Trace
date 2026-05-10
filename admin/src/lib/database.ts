// admin 에 필요한 최소 DB 타입 (모바일과 분리 — admin 자체 tsconfig 보유).
// 출시 직전 supabase gen types 로 동기화 권장.

type TableEntry<R> = {
  Row: R;
  Insert: Partial<R>;
  Update: Partial<R>;
  Relationships: [];
};

type Iso = string;
type DateStr = string;

export type Database = {
  public: {
    Tables: {
      users: TableEntry<{
        id: string;
        email: string;
        display_name: string;
        church_id: string | null;
        cell_id: string | null;
        role: string;
        is_premium: boolean;
        created_at: Iso;
      }>;
      cells: TableEntry<{
        id: string;
        church_id: string;
        name: string;
        created_at: Iso;
      }>;
      daily_checks: TableEntry<{
        id: string;
        user_id: string;
        date: DateStr;
        category_id: string;
        completed: boolean;
        created_at: Iso;
      }>;
      prayer_journal: TableEntry<{
        id: string;
        user_id: string;
        is_shared_to_cell: boolean;
        created_at: Iso;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
