import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ScreenContainer, Card } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as prayerApi from "@/lib/api/prayer";
import { colors, fonts } from "@/theme/tokens";

type SharedPrayer = {
  id: string;
  user_id: string;
  title: string | null;
  request: string;
  scripture_ref: string | null;
  created_at: string;
};

export default function PrayerRequests() {
  const profile = useAuthStore((s) => s.profile);
  const cellId = profile?.cell_id ?? null;
  const [list, setList] = useState<SharedPrayer[]>([]);

  useEffect(() => {
    if (!cellId) return;
    prayerApi.fetchSharedCellPrayers(cellId).then(setList).catch(() => {});
  }, [cellId]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>공동 기도제목</Text>
      <Text style={styles.helper}>
        멤버가 직접 "구역에 공유"한 제목만 보입니다. 본인의 답변 메모는 공유되지 않습니다.
      </Text>

      <View style={{ height: 16 }} />

      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 32 }}>
        {list.length === 0 ? (
          <Text style={styles.empty}>아직 나누어진 기도제목이 없습니다.</Text>
        ) : (
          list.map((p) => (
            <Card key={p.id}>
              {p.title ? <Text style={styles.cardTitle}>{p.title}</Text> : null}
              <Text style={styles.cardBody}>{p.request}</Text>
              {p.scripture_ref ? (
                <Text style={styles.scripture}>{p.scripture_ref}</Text>
              ) : null}
            </Card>
          ))
        )}
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
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 32,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 8,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 24,
  },
  scripture: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    marginTop: 8,
    letterSpacing: 0.4,
  },
});
