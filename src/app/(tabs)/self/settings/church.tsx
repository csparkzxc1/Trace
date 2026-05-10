import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Input, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as cellApi from "@/lib/api/cell";
import { colors, fonts } from "@/theme/tokens";

export default function ChurchCellSettings() {
  const profile = useAuthStore((s) => s.profile);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function joinCell() {
    if (!code.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const cell = await cellApi.joinCellByCode(code.trim());
      if (!cell) setError("일치하는 구역 코드를 찾지 못했습니다");
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 시도해주세요");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>교회 · 구역</Text>
      <View style={{ height: 24 }} />

      <Text style={styles.label}>현재 교회</Text>
      <Text style={styles.value}>
        {profile?.church_id ? "등록됨" : "등록되지 않음"}
      </Text>

      <View style={{ height: 16 }} />
      <Text style={styles.label}>현재 구역</Text>
      <Text style={styles.value}>
        {profile?.cell_id ? "등록됨" : "등록되지 않음"}
      </Text>

      <View style={{ height: 32 }} />

      <Text style={styles.section}>구역 코드로 가입</Text>
      <Text style={styles.helper}>
        구역장에게 받은 초대 코드를 입력하세요.
      </Text>

      <View style={{ height: 12 }} />
      <Input
        label="초대 코드"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 24 }} />
      <Button label="가입" loading={saving} onPress={joinCell} />
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
    fontSize: 17,
    color: colors.ink,
    marginTop: 4,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.ink,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 6,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
});
