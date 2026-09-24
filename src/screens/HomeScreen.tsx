import React, { useMemo, useState } from "react";

import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SummaryCard from "../components/SummaryCard";
import ActivityCard from "../components/ActivityCard";
import SearchBar from "../components/SearchBar";

import { Activity } from "../models/Activity";
import { colors } from "../constants/colors";

const initialActivities: Activity[] = [
  {
    id: "1",
    name: "Morning Run",
    type: "Running",
    duration: 30,
    calories: 280,
    date: "Today",
  },

  {
    id: "2",
    name: "Evening Walk",
    type: "Walking",
    duration: 25,
    calories: 120,
    date: "Yesterday",
  },

  {
    id: "3",
    name: "Strength Training",
    type: "Gym",
    duration: 45,
    calories: 350,
    date: "Yesterday",
  },
];

export default function HomeScreen() {
  const [activities, setActivities] =
    useState<Activity[]>(initialActivities);

  const [search, setSearch] = useState("");

  const totalDuration = useMemo(() => {
    return activities.reduce(
      (total, activity) => total + activity.duration,
      0
    );
  }, [activities]);

  const totalCalories = useMemo(() => {
    return activities.reduce(
      (total, activity) => total + activity.calories,
      0
    );
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    if (!searchTerm) {
      return activities;
    }

    return activities.filter((activity) => {
      return (
        activity.name.toLowerCase().includes(searchTerm) ||
        activity.type.toLowerCase().includes(searchTerm)
      );
    });
  }, [activities, search]);

  function handleAddActivity() {
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: "New Workout",
      type: "Running",
      duration: 20,
      calories: 180,
      date: "Today",
    };

    setActivities((currentActivities) => [
      newActivity,
      ...currentActivities,
    ]);
  }

  function handleDeleteActivity(id: string) {
    Alert.alert(
      "Delete activity",
      "Are you sure you want to delete this activity?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setActivities((currentActivities) =>
              currentActivities.filter(
                (activity) => activity.id !== id
              )
            );
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <View style={styles.container}>
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <View>
                  <Text style={styles.greeting}>
                    Welcome back 👋
                  </Text>

                  <Text style={styles.heading}>GoBit</Text>
                </View>

                <View style={styles.profileBadge}>
                  <Text style={styles.profileText}>A</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>
                Your Progress
              </Text>

              <View style={styles.summaryRow}>
                <SummaryCard
                  title="Calories"
                  value={`${totalCalories}`}
                  subtitle="kcal burned"
                />

                <View style={styles.summaryGap} />

                <SummaryCard
                  title="Duration"
                  value={`${totalDuration}`}
                  subtitle="minutes"
                />
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  {activities.length} workouts completed
                </Text>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Recent Activities
                </Text>

                <Text style={styles.activityCount}>
                  {filteredActivities.length} total
                </Text>
              </View>

              <SearchBar
                value={search}
                onChangeText={setSearch}
              />

              <View style={styles.spacer} />
            </View>
          }
          renderItem={({ item }) => (
            <ActivityCard
              activity={item}
              onDelete={handleDeleteActivity}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                No activities found
              </Text>

              <Text style={styles.emptySubtitle}>
                Try another search or add a workout.
              </Text>
            </View>
          }
        />

        <Pressable
          style={styles.addButton}
          onPress={handleAddActivity}
        >
          <Text style={styles.addButtonText}>
            + Add Activity
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  greeting: {
    color: colors.secondary,
    fontSize: 13,
    marginBottom: 5,
  },

  heading: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
  },

  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: "row",
  },

  summaryGap: {
    width: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },

  statsText: {
    color: colors.secondary,
    fontSize: 12,
  },

  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: colors.successText,
    fontSize: 11,
    fontWeight: "700",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityCount: {
    color: colors.mutedText,
    fontSize: 12,
  },

  spacer: {
    height: 18,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  emptySubtitle: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 8,
  },

  addButton: {
    position: "absolute",
    bottom: 24,
    left: 18,
    right: 18,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});