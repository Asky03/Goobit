import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Activity } from "../models/Activity";
import { colors } from "../constants/colors";

type ActivityCardProps = {
  activity: Activity;
  onDelete: (id: string) => void;
};

function getBadgeColors(type: Activity["type"]) {
  switch (type) {
    case "Running":
      return {
        background: colors.running,
        text: colors.runningText,
      };

    case "Walking":
      return {
        background: colors.walking,
        text: colors.walkingText,
      };

    case "Cycling":
      return {
        background: colors.cycling,
        text: colors.cyclingText,
      };

    case "Gym":
      return {
        background: colors.gym,
        text: colors.gymText,
      };
  }
}

export default function ActivityCard({
  activity,
  onDelete,
}: ActivityCardProps) {
  const badgeColors = getBadgeColors(activity.type);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{activity.name}</Text>

          <Text style={styles.date}>{activity.date}</Text>
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: badgeColors.background },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: badgeColors.text },
            ]}
          >
            {activity.type}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.detailLabel}>Duration</Text>

          <Text style={styles.detailValue}>
            {activity.duration} min
          </Text>
        </View>

        <View>
          <Text style={styles.detailLabel}>Calories</Text>

          <Text style={styles.detailValue}>
            {activity.calories} kcal
          </Text>
        </View>

        <Pressable
          onPress={() => onDelete(activity.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  titleContainer: {
    flex: 1,
    marginRight: 8,
  },

  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  date: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 5,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 20,
  },

  detailLabel: {
    color: colors.mutedText,
    fontSize: 11,
    marginBottom: 4,
  },

  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  deleteText: {
    color: "#D64545",
    fontSize: 12,
    fontWeight: "600",
  },
});