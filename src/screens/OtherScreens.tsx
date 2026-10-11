
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ActivityCard from "../components/ActivityCard";
import StatCard from "../components/StatCard";
import { colors } from "../theme/colors";
import type { Activity } from "../types/activity";
import { calculateActivitySummary } from "../utils/activity";

type HistoryProps = {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
};

type InsightsProps = {
  activities: Activity[];
};

export function HistoryScreen({
  activities,
  onEdit,
  onDelete,
}: HistoryProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Activity history</Text>
        <Text style={styles.subtitle}>
          Review and manage your recorded activities.
        </Text>

        {activities.length === 0 ? (
          <Text style={styles.empty}>No activities recorded yet.</Text>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export function TrackScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.title}>Track activity</Text>
        <Text style={styles.subtitle}>
          GPS, step counting, and live workout tracking are planned for Day 2.
        </Text>
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Tracking is not active yet</Text>
          <Text style={styles.noticeText}>
            This preview does not access your location or phone sensors.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function InsightsScreen({ activities }: InsightsProps) {
  const summary = calculateActivitySummary(activities);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your insights</Text>
        <Text style={styles.subtitle}>
          A summary of activities recorded in this session.
        </Text>

        <View style={styles.stats}>
          <StatCard
            label="Activities"
            value={String(summary.totalActivities)}
            detail="Total recorded"
          />
          <StatCard
            label="Duration"
            value={`${summary.totalDurationMinutes} min`}
            detail="Combined duration"
          />
        </View>

        <View style={styles.stats}>
          <StatCard
            label="Calories"
            value={`${summary.totalCalories}`}
            detail="Illustrative kcal"
          />
          <StatCard
            label="Distance"
            value={`${summary.totalDistanceKm.toFixed(1)} km`}
            detail="Recorded distance"
          />
        </View>

        <Text style={styles.note}>
          These totals use the activity entries currently stored in app
          memory. They reset when the app reloads.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Your GoBit preferences and app information.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>GoBit Fitness</Text>
          <Text style={styles.infoText}>
            A fitness tracking MVP built with React Native and Expo.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Privacy</Text>
          <Text style={styles.infoText}>
            This Day 1 version does not connect to health services or collect
            GPS tracking data.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Data storage</Text>
          <Text style={styles.infoText}>
            Activities are held in app memory and are not yet persisted
            between reloads.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },
  empty: {
    color: colors.secondary,
    textAlign: "center",
    marginTop: 32,
    padding: 20,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  notice: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  noticeTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  noticeText: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
  },
  note: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  infoText: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
