import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ui";
import { MemberRow } from "@/components/cell";
import { useAuthStore } from "@/lib/stores/auth";
import * as cellApi from "@/lib/api/cell";
import type { UserProfile } from "@/types/database";
import { todayIso } from "@/lib/utils/date";
import { colors, fonts } from "@/theme/tokens";

export default function CellBoard() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const cellId = profile?.cell_id ?? null;
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [todayCounts, setTodayCounts] = useState<Map<string, number | null>>(
    new Map(),
  );

  useEffect(() => {
    if (!cellId) return;
    const date = todayIso();
    Promise.all([
      cellApi.fetchCellMembers(cellId),
      cellApi.fetchCellPublicChecks(cellId, date),
    ])
      .then(([m, checks]) => {
        // 시간순 정렬 (§7.2 랭킹 금지)
        setMembers(m.slice().sort((a, b) => a.display_name.localeCompare(b.display_name, "ko")));
        const map = new Map<string, number | null>();
        for (const member of m) {
          const memberChecks = checks.filter(
            (c) => c.user_id === member.id && c.completed,
          );
          map.set(member.id, memberChecks.length > 0 ? memberChecks.length : 0);
        }
        setTodayCounts(map);
      })
      .catch(() => {});
  }, [cellId]);

  if (!cellId) {
    return (
      <ScreenContainer>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>아직 구역에 속해있지 않습니다</Text>
          <Text style={styles.emptySub}>
            혼자 가는 길도 흔적이 됩니다.{"\n"}
            구역 코드는 [나 → 설정 → 교회·구역]에서 등록할 수 있습니다.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={styles.title}>구역</Text>
        <Pressable
          onPress={() =>
            router.push("/(tabs)/cell/visibility" as never)
          }
        >
          <Text style={styles.linkRight}>가시성 설정 ›</Text>
        </Pressable>
      </View>

      <View style={{ height: 16 }} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 32 }}>
        {members.map((m) => (
          <MemberRow
            key={m.id}
            displayName={m.display_name}
            todayCount={todayCounts.get(m.id) ?? null}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/cell/encourage/[memberId]",
                params: { memberId: m.id },
              })
            }
          />
        ))}

        <Pressable
          onPress={() => router.push("/(tabs)/cell/prayer-requests" as never)}
          style={styles.linkRow}
        >
          <Text style={styles.linkText}>공동 기도제목 →</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  linkRight: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
    textAlign: "center",
  },
  emptySub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  linkRow: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: colors.line,
    marginTop: 8,
  },
  linkText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
});
