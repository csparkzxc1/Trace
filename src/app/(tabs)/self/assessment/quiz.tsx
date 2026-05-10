import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import {
  TOZER_QUESTIONS,
  SCALE_LABELS,
  scoreByCategory,
} from "@/lib/data/tozer-assessment";
import * as assessmentApi from "@/lib/api/assessment";
import { colors, fonts } from "@/theme/tokens";

export default function AssessmentQuiz() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const total = TOZER_QUESTIONS.length;
  const q = TOZER_QUESTIONS[index]!;

  async function pick(value: number) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (index < total - 1) {
      setIndex(index + 1);
      return;
    }
    if (!userId) {
      router.replace("/(tabs)/self/assessment/result");
      return;
    }
    setSaving(true);
    try {
      const scores = scoreByCategory(next);
      await assessmentApi.saveAssessment({
        userId,
        type: "tozer-7",
        answers: next,
        scores,
      });
      router.replace("/(tabs)/self/assessment/result");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.headRow}>
        <Text style={styles.step}>
          {index + 1} / {total}
        </Text>
      </View>

      <View style={{ height: 24 }} />

      <Text style={styles.question}>{q.text}</Text>

      <View style={{ flex: 1 }} />

      <View style={styles.scale}>
        {SCALE_LABELS.map((label, value) => (
          <Pressable
            key={label}
            onPress={() => pick(value)}
            style={({ pressed }) => [
              styles.option,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.optionLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ height: 8 }} />
      {index > 0 ? (
        <Button
          label="이전"
          variant="ghost"
          loading={saving}
          onPress={() => setIndex(index - 1)}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headRow: {
    alignItems: "flex-end",
  },
  step: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 14,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  question: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
    lineHeight: 36,
    letterSpacing: -0.2,
  },
  scale: {
    gap: 8,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
  },
  optionLabel: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
    textAlign: "center",
  },
});
