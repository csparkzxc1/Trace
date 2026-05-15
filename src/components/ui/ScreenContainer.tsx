import { ScrollView, View, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorTone } from "@/lib/hooks/useColorTone";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padding?: number;
};

export function ScreenContainer({
  children,
  scroll = false,
  padding = 24,
}: Props) {
  const tone = useColorTone();
  const Body = scroll ? ScrollView : View;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: tone.bg }]}
      edges={["top", "left", "right"]}
    >
      <Body
        contentContainerStyle={scroll ? { padding, flexGrow: 1 } : undefined}
        style={!scroll ? { flex: 1, padding } : undefined}
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
