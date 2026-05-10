import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  ScreenContainer,
  Button,
  StepHeader,
  Checkbox,
  Input,
} from "@/components/ui";
import { useOnboardingStore } from "@/features/auth/onboarding-store";
import { useAuthStore } from "@/lib/stores/auth";
import * as settingsApi from "@/lib/api/settings";
import * as authApi from "@/lib/api/auth";
import * as cellApi from "@/lib/api/cell";
import { colors, fonts } from "@/theme/tokens";

export default function StepNotifications() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const ob = useOnboardingStore();

  async function finish() {
    if (!userId) {
      router.replace("/(tabs)/today");
      return;
    }
    await settingsApi.upsertNotifications({
      user_id: userId,
      morning_prayer_at: ob.morningPrayerAt,
      qt_at: ob.qtAt,
      evening_review_at: ob.eveningReviewAt,
      push_enabled: ob.pushOptIn,
    });
    if (ob.cellInviteCode) {
      try {
        await cellApi.joinCellByCode(ob.cellInviteCode);
      } catch {
        /* 무시 — 나중에 설정에서 다시 입력 가능 */
      }
    }
    if (ob.churchName) {
      const profile = await authApi.fetchProfile(userId);
      if (profile) {
        await authApi.upsertProfile({ ...profile });
      }
    }
    ob.reset();
    router.replace("/(tabs)/today");
  }

  return (
    <ScreenContainer scroll>
      <StepHeader step={5} total={5} title="알림 시간 (선택)" />
      <Text style={styles.helper}>
        새벽기도 알림은 무음·진동만 울립니다. 푸시는 옵트인입니다.
      </Text>

      <View style={{ height: 24 }} />

      <Input
        label="새벽기도 시간 (예: 05:30)"
        value={ob.morningPrayerAt ?? ""}
        onChangeText={(v) => ob.set({ morningPrayerAt: v || null })}
        placeholder="00:00"
      />
      <View style={{ height: 16 }} />
      <Input
        label="큐티 시간"
        value={ob.qtAt ?? ""}
        onChangeText={(v) => ob.set({ qtAt: v || null })}
        placeholder="00:00"
      />
      <View style={{ height: 16 }} />
      <Input
        label="저녁 묵상 시간"
        value={ob.eveningReviewAt ?? ""}
        onChangeText={(v) => ob.set({ eveningReviewAt: v || null })}
        placeholder="00:00"
      />

      <View style={{ height: 24 }} />

      <Checkbox
        checked={ob.pushOptIn}
        onToggle={(v) => ob.set({ pushOptIn: v })}
        label="알림을 받겠습니다 (언제든 끌 수 있어요)"
      />

      <View style={{ flex: 1 }} />

      <Button label="시작하기" size="lg" onPress={finish} />
      <View style={{ height: 12 }} />
      <Button label="나중에 설정할게요" variant="ghost" onPress={finish} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
});
