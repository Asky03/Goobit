
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Activity } from "../types/activity";
import { colors } from "../theme/colors";

type Props = {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
};

function badgeStyle(type: Activity["type"]) {
  switch (type) {
    case "Running":
      return { backgroundColor: colors.runningBackground, color: colors.runningText };
    case "Walking":
      return { backgroundColor: colors.walkingBackground, color: colors.walkingText };
    case "Cycling":
      return { backgroundColor: colors.cyclingBackground, color: colors.cyclingText };
    case "Gym":
      return { backgroundColor: colors.gymBackground, color: colors.gymText };
  }
}

export default function ActivityCard({ activity, onEdit, onDelete }: Props) {
  const badge = badgeStyle(activity.type);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleArea}>
          <Text style={styles.name}>{activity.name}</Text>
          <Text style={styles.date}>{activity.date}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>
            {activity.type}
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{activity.duration} min</Text>
        </View>

        <View>
          <Text style={styles.label}>Calories*</Text>
          <Text style={styles.value}>{activity.calories} kcal</Text>
        </View>

        {activity.distanceKm !== undefined && (
          <View>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{activity.distanceKm} km</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${activity.name}`}
          hitSlop={6}
          onPress={() => onEdit(activity)}
          style={styles.actionButton}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${activity.name}`}
          hitSlop={6}
          onPress={() => onDelete(activity.id)}
          style={styles.actionButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
      <Text style={styles.disclaimer}>*Calories are illustrative estimates.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 17,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  titleArea: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  date: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 5,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    marginTop: 20,
  },
  label: {
    color: colors.secondary,
    fontSize: 12,
    marginBottom: 5,
  },
  value: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 15,
  },
  actionButton: {
    minHeight: 40,
    minWidth: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: {
    color: colors.accent,
    fontWeight: "700",
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "700",
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 6,
  },
});
