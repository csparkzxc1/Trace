import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, useColorScheme } from "react-native";
import { colors, fonts, motion } from "@/theme/tokens";
import { Wordmark } from "./Wordmark";

type Props = {
  onFinish?: () => void;
};

export function BrandSplash({ onFinish }: Props) {
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme();
  const tone = scheme === "dark" ? "dark" : "light";
  const bg = tone === "dark" ? colors.ink : colors.cream;
  const taglineColor = tone === "dark" ? colors.goldSoft : colors.burgundy;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: motion.splashFadeIn,
        useNativeDriver: true,
      }),
      Animated.delay(motion.splashTaglineDelay),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: motion.splashTaglineFadeIn,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish?.();
    });
  }, [onFinish, taglineOpacity, wordmarkOpacity]);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Animated.View style={{ opacity: wordmarkOpacity }}>
        <Wordmark variant="horizontal" size={40} tone={tone} />
      </Animated.View>
      <Animated.Text
        style={[styles.tagline, { opacity: taglineOpacity, color: taglineColor }]}
      >
        신앙은 점수가 아닌 흔적입니다.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 18,
    marginTop: 28,
  },
});
