import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

type SummaryCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function SummaryCard({
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 125,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "space-between",
  },

  title: {
    color: "#BDBDBD",
    fontSize: 13,
    fontWeight: "500",
  },

  value: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 8,
  },

  subtitle: {
    color: "#A8A8A8",
    fontSize: 12,
  },
});