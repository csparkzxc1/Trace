import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as churchesApi from "@/lib/api/churches";
import type { Church } from "@/types/database";
import { colors, fonts } from "@/theme/tokens";

type Props = {
  value: string;
  onChangeText: (s: string) => void;
  onSelect: (church: Church) => void;
};

export function ChurchSearchInput({
  value,
  onChangeText,
  onSelect,
}: Props) {
  const [results, setResults] = useState<Church[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      churchesApi
        .searchChurches(q)
        .then((rows) => {
          setResults(rows);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 250);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <View>
      <Text style={styles.label}>교회 이름</Text>
      <TextInput
        value={value}
        onChangeText={(v) => {
          setOpen(true);
          onChangeText(v);
        }}
        placeholder="예: 사랑의교회"
        placeholderTextColor={colors.inkSoft}
        style={styles.input}
        onFocus={() => setOpen(true)}
      />
      {open && (loading || results.length > 0) ? (
        <View style={styles.dropdown}>
          {loading ? (
            <ActivityIndicator color={colors.ink} style={styles.loading} />
          ) : (
            results.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  onSelect(c);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { backgroundColor: colors.creamDeep },
                ]}
              >
                <Text style={styles.rowName}>{c.name}</Text>
                {c.address ? (
                  <Text style={styles.rowSub}>{c.address}</Text>
                ) : null}
              </Pressable>
            ))
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: 6,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    maxHeight: 240,
  },
  loading: { padding: 16 },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowName: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.ink,
  },
  rowSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
});
