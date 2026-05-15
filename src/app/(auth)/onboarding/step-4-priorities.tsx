import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Button, StepHeader } from "@/components/ui";
import { useOnboardingStore } from "@/features/auth/onboarding-store";
import { DEFAULT_CATEGORIES } from "@/lib/utils/categories";
import { colors, fonts } from "@/theme/tokens";
import type { CategorySlug } from "@/types/database";

export default function StepPriorities() {
  const router = useRouter();
  const priorities = useOnboardingStore((s) => s.priorities);
  const set = useOnboardingStore((s) => s.set);

  function toggle(slug: CategorySlug) {
    const has = priorities.includes(slug);
    set({
      priorities: has
        ? priorities.filter((p) => p !== slug)
        : [...priorities, slug],
    });
  }

  return (
    <ScreenContainer scroll>
      <StepHeader step={4} total={5} title="중심에 두고 싶은 영역" />
      <Text style={styles.helper}>
        선택은 강제가 아닙니다. 모든 영역을 동등하게 대해도 좋습니다.
      </Text>

      <View style={{ height: 24 }} />

      <View style={styles.list}>
        {DEFAULT_CATEGORIES.map(({ slug, ko, en }) => {
          const selected = priorities.includes(slug);
          return (
            <Pressable
              key={slug}
              onPress={() => toggle(slug)}
              style={({ pressed }) => [
                styles.row,
                selected && styles.rowSelected,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View>
                <Text style={[styles.ko, selected && styles.koSelected]}>
                  {ko}
                </Text>
                <Text style={styles.en}>{en}</Text>
              </View>
              <Text style={[styles.mark, selected && styles.markSelected]}>
                {selected ? "·" : ""}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ height: 24 }} />

      <Button
        label="계속하기"
        size="lg"
        onPress={() => router.push("/(auth)/onboarding/step-5-notifications")}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
  },
  list: { gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    backgroundColor: colors.paper,
  },
  rowSelected: {
    borderColor: colors.ink,
    backgroundColor: colors.creamDeep,
  },
  ko: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  koSelected: {
    color: colors.ink,
  },
  en: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2,
    marginTop: 2,
  },
  mark: {
    fontFamily: fonts.accent,
    fontSize: 28,
    color: colors.line,
  },
  markSelected: {
    color: colors.gold,
  },
});
