import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";
import type { RhythmLine } from "@/lib/utils/rhythm";

type Props = {
  lines: RhythmLine[];
};

export function RhythmSection({ lines }: Props) {
  return (
    <View style={styles.box}>
      {lines.map((line, idx) => (
        <Text
          key={`${line.template}-${idx}`}
          style={[styles.line, idx === lines.length - 1 && { marginBottom: 0 }]}
        >
          {renderEmphases(line)}
        </Text>
      ))}
    </View>
  );
}

function renderEmphases(line: RhythmLine) {
  const segments: { text: string; em: boolean }[] = [];
  let cursor = 0;
  for (const e of line.emphases) {
    if (e.start > cursor) {
      segments.push({ text: line.text.slice(cursor, e.start), em: false });
    }
    segments.push({ text: line.text.slice(e.start, e.end), em: true });
    cursor = e.end;
  }
  if (cursor < line.text.length) {
    segments.push({ text: line.text.slice(cursor), em: false });
  }
  return segments.map((s, i) =>
    s.em ? (
      <Text key={i} style={styles.em}>
        {s.text}
      </Text>
    ) : (
      <Text key={i}>{s.text}</Text>
    ),
  );
}

const styles = StyleSheet.create({
  box: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(184, 146, 79, 0.04)",
  },
  line: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 28,
    marginBottom: 12,
  },
  em: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    color: colors.burgundy,
    fontSize: 16,
  },
});
