import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import { colors, fonts } from "@/theme/tokens";

export default function LeaderTools() {
  const router = useRouter();
  const role = useAuthStore((s) => s.profile?.role);

  if (role !== "cell_leader" && role !== "pastor") {
    return (
      <ScreenContainer>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>구역장 권한이 필요합니다</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>구역장 도구</Text>
      <Text style={styles.helper}>
        멤버의 메모·노트는 어떤 도구에서도 열람되지 않습니다.
      </Text>

      <View style={{ height: 24 }} />

      <Pressable
        onPress={() =>
          router.push("/(tabs)/cell/leader/create-prayer" as never)
        }
        style={styles.row}
      >
        <Text style={styles.rowText}>구역 공동 기도제목 등록</Text>
      </Pressable>
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
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    backgroundColor: colors.paper,
  },
  rowText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
});
