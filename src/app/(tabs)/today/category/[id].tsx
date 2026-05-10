import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer, Input, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import { useCheckinStore } from "@/lib/stores/checkin";
import * as checkinApi from "@/lib/api/checkin";
import { todayIso } from "@/lib/utils/date";
import { colors, fonts } from "@/theme/tokens";

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const upsert = useCheckinStore((s) => s.upsert);
  const date = todayIso();
  const existing = useCheckinStore((s) => s.byDate[date]?.[id ?? ""]);

  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");
  const [scripture, setScripture] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDuration(existing?.duration_minutes?.toString() ?? "");
    setNote(existing?.note ?? "");
    setScripture(existing?.scripture_ref ?? "");
  }, [existing]);

  async function save() {
    if (!userId || !id) return;
    setSaving(true);
    try {
      let target = existing;
      if (!target || target.id.startsWith("optimistic")) {
        target = await checkinApi.toggleCheckRpc(id, date);
        // toggle 직후 다시 토글해 원래 상태로 (체크 안 된 상태에서 상세만 입력하는 경우 대비)
      }
      const saved = await checkinApi.updateCheckDetails(target.id, {
        duration_minutes: duration ? Number(duration) : null,
        note: note || null,
        scripture_ref: scripture || null,
      });
      upsert(saved);
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>오늘의 흔적 메모</Text>
      <Text style={styles.helper}>
        이 메모는 누구에게도 공유되지 않습니다 (구역장 포함).
      </Text>

      <View style={{ height: 24 }} />

      <Input
        label="시간 (분)"
        keyboardType="number-pad"
        value={duration}
        onChangeText={setDuration}
        placeholder="예: 30"
      />
      <View style={{ height: 16 }} />
      <Input
        label="말씀 본문 (선택)"
        value={scripture}
        onChangeText={setScripture}
        placeholder="예: 시편 23편"
      />
      <View style={{ height: 16 }} />
      <Input
        label="짧은 묵상 (선택)"
        value={note}
        onChangeText={setNote}
        placeholder="천천히 적어도 괜찮습니다"
        multiline
      />

      <View style={{ height: 32 }} />
      <Button label="저장" size="lg" loading={saving} onPress={save} />
      <View style={{ height: 8 }} />
      <Button label="취소" variant="ghost" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
    marginTop: 8,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
  },
});
