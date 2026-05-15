import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ScreenContainer, Checkbox, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as settingsApi from "@/lib/api/settings";
import { DEFAULT_CATEGORIES } from "@/lib/utils/categories";
import type { VisibilitySettings } from "@/types/database";
import { colors, fonts } from "@/theme/tokens";

export default function VisibilityScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const [vs, setVs] = useState<VisibilitySettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    settingsApi.fetchVisibility(userId).then((v) => {
      setVs(
        v ?? {
          user_id: userId,
          share_streak: true,
          share_categories: DEFAULT_CATEGORIES.map((c) => c.slug),
          share_total_only: true,
          hide_from_leader: false,
          updated_at: new Date().toISOString(),
        },
      );
    });
  }, [userId]);

  async function save() {
    if (!userId || !vs) return;
    setSaving(true);
    try {
      await settingsApi.upsertVisibility(vs);
    } finally {
      setSaving(false);
    }
  }

  if (!vs) return <ScreenContainer><Text /></ScreenContainer>;

  function toggleCategory(slug: string) {
    if (!vs) return;
    const has = vs.share_categories.includes(slug);
    setVs({
      ...vs,
      share_categories: has
        ? vs.share_categories.filter((s) => s !== slug)
        : [...vs.share_categories, slug],
    });
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>가시성 설정</Text>
        <Text style={styles.helper}>
          노트·시간·구절 같은 메모는 어떤 설정에서도 외부에 공개되지 않습니다.
        </Text>

        <View style={{ height: 24 }} />

        <Checkbox
          checked={vs.share_total_only}
          onToggle={(v) => setVs({ ...vs, share_total_only: v })}
          label="총 흔적 개수만 공개 (디폴트, 권장)"
        />
        <View style={{ height: 12 }} />
        <Checkbox
          checked={vs.share_streak}
          onToggle={(v) => setVs({ ...vs, share_streak: v })}
          label="streak(이어진 일수) 공개"
        />
        <View style={{ height: 12 }} />
        <Checkbox
          checked={vs.hide_from_leader}
          onToggle={(v) => setVs({ ...vs, hide_from_leader: v })}
          label="구역장에게도 비공개"
        />

        <View style={{ height: 24 }} />
        <Text style={styles.section}>카테고리별 공개 (선택적)</Text>
        <Text style={styles.helper}>
          위에서 "총 개수만"을 끈 경우에만 적용됩니다.
        </Text>
        <View style={{ height: 12 }} />
        {DEFAULT_CATEGORIES.map((c) => (
          <View key={c.slug} style={{ marginBottom: 12 }}>
            <Checkbox
              checked={vs.share_categories.includes(c.slug)}
              onToggle={() => toggleCategory(c.slug)}
              label={`${c.ko} · ${c.en}`}
              disabled={vs.share_total_only}
            />
          </View>
        ))}

        <View style={{ height: 24 }} />
        <Button label="저장" size="lg" loading={saving} onPress={save} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.ink,
  },
});
