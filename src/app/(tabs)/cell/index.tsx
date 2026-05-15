import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ui";
import { MemberRow } from "@/components/cell";
import { useAuthStore } from "@/lib/stores/auth";
import { useCellBoard } from "@/features/cell/use-cell-board";
import { colors, fonts } from "@/theme/tokens";

export default function CellBoard() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const userId = useAuthStore((s) => s.user?.id) ?? null;
  const cellId = profile?.cell_id ?? null;
  const { entries, recentEncouragement, dismissEncouragement } = useCellBoard(
    cellId,
    userId,
  );

  useEffect(() => {
    if (!recentEncouragement) return;
    const t = setTimeout(dismissEncouragement, 5000);
    return () => clearTimeout(t);
  }, [recentEncouragement, dismissEncouragement]);

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
          onPress={() => router.push("/(tabs)/cell/visibility" as never)}
        >
          <Text style={styles.linkRight}>가시성 설정 ›</Text>
        </Pressable>
      </View>

      {recentEncouragement ? (
        <Pressable
          onPress={dismissEncouragement}
          style={styles.toast}
        >
          <Text style={styles.toastEmoji}>{recentEncouragement.emoji ?? "·"}</Text>
          <Text style={styles.toastBody} numberOfLines={2}>
            새 격려가 도착했습니다
            {recentEncouragement.message
              ? ` — ${recentEncouragement.message}`
              : ""}
          </Text>
        </Pressable>
      ) : null}

      <View style={{ height: 16 }} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 32 }}>
        {entries.map((e) => (
          <MemberRow
            key={e.member.id}
            displayName={e.member.display_name}
            todayCount={e.todayCount}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/cell/encourage/[memberId]",
                params: { memberId: e.member.id },
              })
            }
          />
        ))}

        <Pressable
          onPress={() =>
            router.push("/(tabs)/cell/prayer-requests" as never)
          }
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
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: colors.creamDeep,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    marginTop: 12,
  },
  toastEmoji: {
    fontSize: 24,
  },
  toastBody: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
  },
});
