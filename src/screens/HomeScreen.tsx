
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ActivityCard from "../components/ActivityCard";
import StatCard from "../components/StatCard";
import { colors } from "../theme/colors";
import type { Activity, ActivityType } from "../types/activity";
import type { TabName } from "../components/BottomNav";
import { calculateActivitySummary } from "../utils/activity";

type Props = {
  activities: Activity[];
  onAdd: () => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onOpenTab: (tab: TabName) => void;
};

const filters: ("All" | ActivityType)[] = [
  "All",
  "Running",
  "Walking",
  "Cycling",
  "Gym",
];

export default function HomeScreen({
  activities,
  onAdd,
  onEdit,
  onDelete,
  onOpenTab,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<"All" | ActivityType>("All");

  const summary = useMemo(
    () => calculateActivitySummary(activities),
    [activities],
  );

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesType =
        selectedFilter === "All" || activity.type === selectedFilter;

      const matchesSearch =
        activity.name.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query) ||
        activity.date.includes(query);

      return matchesType && matchesSearch;
    });
  }, [activities, search, selectedFilter]);

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.eyebrow}>YOUR FITNESS SPACE</Text>
                <Text style={styles.title}>GoBit</Text>
                <Text style={styles.subtitle}>
                  Small steps. Stronger habits.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={onAdd}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </Pressable>
            </View>

            <View style={styles.stats}>
              <StatCard
                label="Activities"
                value={String(summary.totalActivities)}
                detail="Recorded"
              />
              <StatCard
                label="Duration"
                value={`${summary.totalDurationMinutes} min`}
                detail="Total time"
              />
            </View>

            <View style={styles.stats}>
              <StatCard
                label="Calories"
                value={String(summary.totalCalories)}
                detail="Estimated kcal"
              />
              <StatCard
                label="Distance"
                value={`${summary.totalDistanceKm.toFixed(1)} km`}
                detail="Recorded distance"
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent activities</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => onOpenTab("History")}
                hitSlop={8}
              >
                <Text style={styles.link}>View history</Text>
              </Pressable>
            </View>

            <TextInput
              accessibilityLabel="Search activities"
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, type, or date"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              returnKeyType="search"
            />

            <View style={styles.filters}>
              {filters.map((filter) => {
                const selected = selectedFilter === filter;

                return (
                  <Pressable
                    key={filter}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSelectedFilter(filter)}
                    style={[
                      styles.filterButton,
                      selected && styles.filterSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected && styles.filterTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No activities found</Text>
            <Text style={styles.emptyText}>
              Try another search or add an activity.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  addButton: {
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
  },
  link: {
    color: colors.accent,
    fontWeight: "700",
    fontSize: 13,
  },
  searchInput: {
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    marginBottom: 12,
    color: colors.text,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  emptyText: {
    color: colors.secondary,
    marginTop: 6,
    textAlign: "center",
  },
});
