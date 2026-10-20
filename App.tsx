
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ActivityForm from "./src/components/ActivityForm";
import BottomNav, {
  type TabName,
} from "./src/components/BottomNav";

import HomeScreen from "./src/screens/HomeScreen";
import {
  HistoryScreen,
  InsightsScreen,
  ProfileScreen,
  TrackScreen,
} from "./src/screens/OtherScreens";

import {
  loadActivities,
  saveActivities,
} from "./src/services/activityStorage";
import type { Activity } from "./src/types/activity";
import { colors } from "./src/theme/colors";

type LoadStatus = "loading" | "ready" | "error";

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [formVisible, setFormVisible] = useState(false);
  const [editingActivity, setEditingActivity] =
    useState<Activity | null>(null);

  // Load saved activities once when the app starts.
  useEffect(() => {
    let cancelled = false;

    async function initializeActivities() {
      try {
        const savedActivities = await loadActivities();

        if (cancelled) {
          return;
        }

        setActivities(savedActivities);
        setLoadStatus("ready");
      } catch (error) {
        console.error("Unable to load GoBit activities:", error);

        if (!cancelled) {
          setLoadStatus("error");
        }
      }
    }

    void initializeActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  // Retry loading after a storage error.
  const retryLoadActivities = async () => {
    setLoadStatus("loading");

    try {
      const savedActivities = await loadActivities();
      setActivities(savedActivities);
      setLoadStatus("ready");
    } catch (error) {
      console.error("Unable to reload GoBit activities:", error);
      setLoadStatus("error");
    }
  };

  // Persist changes only after the initial load has succeeded.
  useEffect(() => {
    if (loadStatus !== "ready") {
      return;
    }

    void saveActivities(activities).catch((error: unknown) => {
      console.error("Unable to persist GoBit activities:", error);

      Alert.alert(
        "Couldn't save activities",
        "Your latest changes may not survive an app restart. Check device storage and try again.",
      );
    });
  }, [activities, loadStatus]);

  const openAddForm = () => {
    setEditingActivity(null);
    setFormVisible(true);
  };

  const openEditForm = (activity: Activity) => {
    setEditingActivity(activity);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingActivity(null);
  };

  const saveActivity = (activity: Activity) => {
    setActivities((current) => {
      const exists = current.some((item) => item.id === activity.id);

      return exists
        ? current.map((item) =>
            item.id === activity.id ? activity : item,
          )
        : [activity, ...current];
    });

    closeForm();
  };

  const deleteActivity = (id: string) => {
    const activity = activities.find((item) => item.id === id);

    if (!activity) {
      return;
    }

    Alert.alert(
      "Delete activity?",
      `Are you sure you want to delete "${activity.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setActivities((current) =>
              current.filter((item) => item.id !== id),
            );
          },
        },
      ],
    );
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "Home":
        return (
          <HomeScreen
            activities={activities}
            onAdd={openAddForm}
            onEdit={openEditForm}
            onDelete={deleteActivity}
            onOpenTab={setActiveTab}
          />
        );

      case "Track":
        return <TrackScreen onSaveActivity={saveActivity} />;

      case "History":
        return (
          <HistoryScreen
            activities={activities}
            onEdit={openEditForm}
            onDelete={deleteActivity}
          />
        );

      case "Insights":
        return <InsightsScreen activities={activities} />;

      case "Profile":
        return <ProfileScreen />;

      default:
        return (
          <HomeScreen
            activities={activities}
            onAdd={openAddForm}
            onEdit={openEditForm}
            onDelete={deleteActivity}
            onOpenTab={setActiveTab}
          />
        );
    }
  };

  if (loadStatus !== "ready") {
    return (
      <SafeAreaView style={styles.app}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />

        <View style={styles.loadingContainer}>
          {loadStatus === "loading" ? (
            <>
              <ActivityIndicator
                size="large"
                color={colors.accent}
              />
              <Text style={styles.loadingTitle}>
                Loading your workouts…
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.errorTitle}>
                Couldnt load your workouts
              </Text>

              <Text style={styles.errorMessage}>
                Your saved data has not been replaced. Check storage
                availability and retry.
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retry loading saved workouts"
                onPress={() => void retryLoadActivities()}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <View style={styles.screen}>{renderScreen()}</View>

      <BottomNav
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <ActivityForm
        key={`${formVisible}-${editingActivity?.id ?? "new"}`}
        visible={formVisible}
        initialActivity={editingActivity}
        onSave={saveActivity}
        onCancel={closeForm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingTitle: {
    marginTop: 16,
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  errorTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    color: colors.secondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 13,
    marginTop: 20,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
