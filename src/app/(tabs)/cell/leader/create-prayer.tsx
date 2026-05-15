import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as prayerApi from "@/lib/api/prayer";
import { isSafeCopy } from "@/lib/utils/microcopy";
import { colors, fonts } from "@/theme/tokens";

export default function CreatePrayerForCell() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const [title, setTitle] = useState("");
  const [request, setRequest] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!userId) return;
    if (!isSafeCopy(request) || !isSafeCopy(title)) {
      setError("따뜻한 표현으로 다시 적어주세요");
      return;
    }
    if (!request.trim()) {
      setError("기도제목을 적어주세요");
      return;
    }
    setSaving(true);
    try {
      await prayerApi.addPrayerEntry({
        userId,
        title: title.trim() || undefined,
        request: request.trim(),
        shareToCell: true,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>구역 공동 기도제목</Text>
      <Text style={styles.helper}>
        구역 멤버 모두에게 보입니다. 개인 메모는 [나 → 기도수첩]에서 작성하세요.
      </Text>

      <View style={{ height: 24 }} />

      <Input label="제목 (선택)" value={title} onChangeText={setTitle} />
      <View style={{ height: 16 }} />
      <Input
        label="기도제목"
        value={request}
        onChangeText={setRequest}
        multiline
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 24 }} />
      <Button label="등록" size="lg" loading={saving} onPress={save} />
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
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
});
