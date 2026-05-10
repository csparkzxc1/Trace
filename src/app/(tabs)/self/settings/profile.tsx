import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Input, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as authApi from "@/lib/api/auth";
import { colors, fonts } from "@/theme/tokens";

export default function ProfileSettings() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setDisplayName(profile.display_name);
  }, [profile?.id]);

  async function save() {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await authApi.upsertProfile({
        ...profile,
        display_name: displayName.trim() || profile.display_name,
      });
      setProfile(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>프로필</Text>
      <View style={{ height: 24 }} />

      <Input
        label="이름 또는 별명"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <View style={{ height: 16 }} />
      <Text style={styles.label}>이메일</Text>
      <Text style={styles.value}>{profile?.email ?? ""}</Text>

      <View style={{ height: 24 }} />
      <Button label="저장" loading={saving} onPress={save} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.ink,
    marginTop: 4,
  },
});
