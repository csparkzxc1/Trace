import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Input, Checkbox, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as settingsApi from "@/lib/api/settings";
import {
  registerPushTokenForUser,
  unregisterPushTokenForUser,
} from "@/features/notifications/register-push";
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

  const [hint, setHint] = useState<string | null>(null);

  async function save() {
    if (!settings || !userId) return;
    setSaving(true);
    setHint(null);
    try {
      if (settings.push_enabled && !settings.push_token) {
        const r = await registerPushTokenForUser(userId);
        if (!r.ok) {
          setHint(
            r.reason === "permission_denied"
              ? "알림 권한이 허용되지 않았습니다. 시스템 설정에서 다시 켤 수 있습니다."
              : r.reason === "simulator"
                ? "실제 기기에서만 알림을 받을 수 있습니다."
                : "알림 등록을 잠시 뒤 다시 시도해주세요.",
          );
          // §7.3 권한이 없으면 자동으로 OFF 상태 유지
          await settingsApi.upsertNotifications({
            ...settings,
            push_enabled: false,
            push_token: null,
          });
          setSettings({ ...settings, push_enabled: false, push_token: null });
          return;
        }
        // register-push 가 이미 upsert 함. 로컬 상태 동기화.
        setSettings({ ...settings, push_token: r.token });
      } else if (!settings.push_enabled && settings.push_token) {
        await unregisterPushTokenForUser(userId);
      }
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

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

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
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
    lineHeight: 20,
  },
});
