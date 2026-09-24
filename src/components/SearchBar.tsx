import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { colors } from "../constants/colors";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search activities..."
        placeholderTextColor={colors.mutedText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },

  input: {
    height: 52,
    color: colors.text,
    fontSize: 15,
  },
});