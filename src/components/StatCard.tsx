
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  label: string;
  value: string;
  detail: string;
};

export default function StatCard({
  label,
  value,
  detail,
}: Props) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}. ${detail}`}
      style={styles.card}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    minHeight: 126,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 15,
    justifyContent: "space-between",
  },
  label: {
    color: "#D0D3DA",
    fontSize: 13,
    fontWeight: "500",
  },
  value: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginVertical: 8,
  },
  detail: {
    color: "#D0D3DA",
    fontSize: 12,
  },
});
