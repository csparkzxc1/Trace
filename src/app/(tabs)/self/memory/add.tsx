import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as memoryApi from "@/lib/api/memory";
import { colors, fonts } from "@/theme/tokens";

export default function AddMemory() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("개역개정");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!userId) return;
    if (!reference.trim() || !text.trim()) {
      setError("성경 본문과 구절을 적어주세요");
      return;
    }
    setSaving(true);
    try {
      await memoryApi.addCard({
        userId,
        reference: reference.trim(),
        text: text.trim(),
        translation: translation.trim() || "개역개정",
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>새 말씀 카드</Text>

      <View style={{ height: 24 }} />

      <Input
        label="성경 본문"
        value={reference}
        onChangeText={setReference}
        placeholder="예: 마태복음 11:28"
      />
      <View style={{ height: 16 }} />
      <Input
        label="구절"
        value={text}
        onChangeText={setText}
        multiline
        placeholder="개역개정 본문을 적어주세요"
      />
      <View style={{ height: 16 }} />
      <Input
        label="번역 (기본 개역개정)"
        value={translation}
        onChangeText={setTranslation}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 24 }} />
      <Button label="저장" size="lg" loading={saving} onPress={save} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
});
