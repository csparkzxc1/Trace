import { create } from "zustand";
import type { CategorySlug } from "@/types/database";

type OnboardingState = {
  churchId: string | null;
  churchName: string | null;
  cellInviteCode: string | null;
  priorities: CategorySlug[];
  morningPrayerAt: string | null;
  qtAt: string | null;
  eveningReviewAt: string | null;
  pushOptIn: boolean;
  set: (patch: Partial<OnboardingState>) => void;
  reset: () => void;
};

const INITIAL: Omit<OnboardingState, "set" | "reset"> = {
  churchId: null,
  churchName: null,
  cellInviteCode: null,
  priorities: [],
  morningPrayerAt: null,
  qtAt: null,
  eveningReviewAt: null,
  pushOptIn: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL,
  set: (patch) => set(patch),
  reset: () => set(INITIAL),
}));
