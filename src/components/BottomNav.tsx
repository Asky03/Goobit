
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export type TabName = "Home" | "Track" | "History" | "Insights" | "Profile";

const tabs: { name: TabName; symbol: string }[] = [
  { name: "Home", symbol: "⌂" },
  { name: "Track", symbol: "◎" },
  { name: "History", symbol: "▤" },
  { name: "Insights", symbol: "↗" },
  { name: "Profile", symbol: "○" },
];

type Props = {
  activeTab: TabName;
  onChange: (tab: TabName) => void;
};

export default function BottomNav({ activeTab, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const selected = activeTab === tab.name;

        return (
          <Pressable
            key={tab.name}
            accessibilityRole="button"
            accessibilityLabel={`${tab.name} tab`}
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.name)}
            style={styles.item}
          >
            <Text style={[styles.symbol, selected && styles.selected]}>
              {tab.symbol}
            </Text>
            <Text style={[styles.label, selected && styles.selectedLabel]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 8,
  },
  item: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  symbol: {
    fontSize: 21,
    color: colors.secondary,
  },
  selected: {
    color: colors.accent,
  },
  label: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: "500",
  },
  selectedLabel: {
    color: colors.accent,
    fontWeight: "800",
  },
});
