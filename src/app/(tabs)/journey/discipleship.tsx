import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Card, Button } from "@/components/ui";
import { BUILTIN_MODULES } from "@/lib/data/discipleship";
import { colors, fonts } from "@/theme/tokens";

export default function DiscipleshipScreen() {
  const modules = BUILTIN_MODULES;

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>제자훈련</Text>
      <Text style={styles.label}>DISCIPLESHIP</Text>

      <View style={{ height: 24 }} />

      {modules.length === 0 ? (
        <Card>
          <Text style={styles.cardLabel}>아직 등록된 커리큘럼이 없습니다</Text>
          <Text style={styles.cardBody}>
            출시 후 사랑의교회·온누리·CCC 등 정식 커리큘럼을 단계적으로 추가합니다.
            그 전까지는 자체 커리큘럼을 직접 등록해 진도만 표시할 수 있습니다.
          </Text>
          <View style={{ height: 16 }} />
          <Button
            label="내 커리큘럼 등록 (준비 중)"
            variant="secondary"
            disabled
            onPress={() => {}}
          />
        </Card>
      ) : (
        <View style={{ gap: 12 }}>
          {modules.map((m) => (
            <Card key={m.id}>
              <Text style={styles.cardLabel}>
                {sourceLabel(m.source)} · {m.weeks}주
              </Text>
              <Text style={styles.moduleTitle}>{m.title}</Text>
              <Text style={styles.cardBody}>{m.description}</Text>
            </Card>
          ))}
        </View>
      )}

      <View style={{ height: 16 }} />
      <Text style={styles.helper}>
        진도는 점수가 아닙니다. 한 주 머물러도, 한 단원을 다시 펼쳐도 모두 흔적입니다.
      </Text>
    </ScreenContainer>
  );
}

function sourceLabel(s: string | null): string {
  switch (s) {
    case "samrang":
      return "사랑의교회";
    case "onnuri":
      return "온누리교회";
    case "ccc":
      return "CCC";
    case "custom":
      return "내 커리큘럼";
    default:
      return "커리큘럼";
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    marginTop: 8,
  },
  cardLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  moduleTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: 6,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    marginTop: 8,
    lineHeight: 22,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 22,
  },
});
