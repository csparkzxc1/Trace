import {
  Modal as RNModal,
  View,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import type { ReactNode } from "react";
import { colors, fonts, radii } from "@/theme/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
};

export function Modal({ visible, onClose, title, children }: Props) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View pointerEvents="box-none" style={styles.center}>
        <View style={styles.sheet}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <View style={styles.body}>{children}</View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(31, 42, 55, 0.4)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 12,
  },
  body: {
    minHeight: 24,
  },
});
