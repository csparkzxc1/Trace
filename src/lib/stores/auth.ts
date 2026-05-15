import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/database";

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setInitialized: (v: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  initialized: false,
  setSession: (session) =>
    set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setInitialized: (initialized) => set({ initialized }),
  reset: () =>
    set({ session: null, user: null, profile: null, initialized: true }),
}));
