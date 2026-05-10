import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Input, Checkbox, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as settingsApi from "@/lib/api/settings";
import type { NotificationSettings } from "@/types/database";
import { colors, fonts } from "@/theme/tokens";

export default function NotificationsSettings() {
  const userId = useAuthStore((s) => s.user?.id);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    settingsApi.fetchNotifications(userId).then((s) => {
      setSettings(
        s ?? {
          user_id: userId,
          morning_prayer_at: null,
          qt_at: null,
          evening_review_at: null,
          weekly_summary_day: 0,
          push_token: null,
          push_enabled: false,
          updated_at: new Date().toISOString(),
        },
      );
    });
  }, [userId]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      await settingsApi.upsertNotifications(settings);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <ScreenContainer><Text /></ScreenContainer>;

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>알림</Text>
      <Text style={styles.helper}>
        새벽기도 알림은 무음·진동만 울립니다. 끄거나 시간만 바꿀 수 있습니다.
      </Text>

      <View style={{ height: 24 }} />

      <Checkbox
        checked={settings.push_enabled}
        onToggle={(v) => setSettings({ ...settings, push_enabled: v })}
        label="알림을 받겠습니다"
      />

      <View style={{ height: 24 }} />

      <Input
        label="새벽기도 시간"
        value={settings.morning_prayer_at ?? ""}
        onChangeText={(v) =>
          setSettings({ ...settings, morning_prayer_at: v || null })
        }
        placeholder="00:00"
      />
      <View style={{ height: 16 }} />
      <Input
        label="큐티 시간"
        value={settings.qt_at ?? ""}
        onChangeText={(v) => setSettings({ ...settings, qt_at: v || null })}
        placeholder="00:00"
      />
      <View style={{ height: 16 }} />
      <Input
        label="저녁 묵상 시간"
        value={settings.evening_review_at ?? ""}
        onChangeText={(v) =>
          setSettings({ ...settings, evening_review_at: v || null })
        }
        placeholder="00:00"
      />

      <View style={{ height: 24 }} />
      <Button label="저장" size="lg" loading={saving} onPress={save} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
});
