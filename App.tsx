
import React, { useEffect, useRef, useState } from "react";

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
  loadServerCache,
  saveServerCache,
} from "./src/services/activityStorage";

import {
  fetchActivities,
  createActivity,
  updateActivity,
  deleteRemoteActivity,
} from "./src/services/activityApi";

import type { Activity } from "./src/types/activity";
import { colors } from "./src/theme/colors";

type LoadStatus = "loading" | "ready" | "error";

export default function App() {
  // Application state.
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loadStatus, setLoadStatus] =
    useState<LoadStatus>("loading");

  const [activeTab, setActiveTab] =
    useState<TabName>("Home");

  const [formVisible, setFormVisible] =
    useState(false);

  const [editingActivity, setEditingActivity] =
    useState<Activity | null>(null);

  // Backend connection state.
  const [isOnline, setIsOnline] = useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  // Prevent overlapping API operations.
  const requestInProgress = useRef(false);

  // Load activities when the application starts.
  useEffect(() => {
    let cancelled = false;

    async function initializeActivities() {
      try {
        const records = await fetchActivities();

        if (cancelled) {
          return;
        }

        setActivities(records);
        setIsOnline(true);
        setLoadStatus("ready");
      } catch (error) {
        if (__DEV__) {
          console.warn(
            "Backend unavailable:",
            error instanceof Error
              ? error.message
              : "Unknown error",
          );
        }

        try {
          const cached = await loadServerCache();

          if (cancelled) {
            return;
          }

          setActivities(cached);
          setIsOnline(false);
          setLoadStatus("ready");
        } catch (storageError) {
          if (__DEV__) {
            console.error(
              "Unable to load cache:",
              storageError instanceof Error
                ? storageError.name
                : "Unknown error",
            );
          }

          if (!cancelled) {
            setLoadStatus("error");
          }
        }
      }
    }

    void initializeActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh activities and reconnect to backend.
  const retryLoadActivities = async (): Promise<void> => {
    if (requestInProgress.current) {
      Alert.alert(
        "Please wait",
        "Another request is currently in progress.",
      );

      return;
    }

    requestInProgress.current = true;
    setIsRefreshing(true);

    try {
      if (__DEV__) {
        console.log(
          "[GoBit] Refreshing backend connection",
        );
      }

      const records = await fetchActivities();

      setActivities(records);
      setIsOnline(true);
      setLoadStatus("ready");

      if (__DEV__) {
        console.log(
          "[GoBit] Activities refreshed successfully",
        );
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(
          "[GoBit] Unable to reconnect:",
          error instanceof Error
            ? error.message
            : "Unknown error",
        );
      }

      // Preserve the currently displayed activities.
      setIsOnline(false);

      // Retry local storage if the initial load failed.
      if (loadStatus === "error") {
        try {
          const cached = await loadServerCache();

          setActivities(cached);
          setLoadStatus("ready");
        } catch (storageError) {
          if (__DEV__) {
            console.error(
              "Unable to load cache:",
              storageError instanceof Error
                ? storageError.name
                : "Unknown error",
            );
          }

          setLoadStatus("error");
        }
      }

      Alert.alert(
        "Connection unavailable",
        "Unable to reach the GoBit backend. " +
          "Your existing saved data has not been replaced.",
      );
    } finally {
      requestInProgress.current = false;
      setIsRefreshing(false);
    }
  };

  // Cache confirmed backend records locally.
  useEffect(() => {
    if (loadStatus !== "ready" || !isOnline) {
      return;
    }

    void saveServerCache(activities).catch(
      (error: unknown) => {
        if (__DEV__) {
          console.error(
            "Unable to update local cache:",
            error instanceof Error
              ? error.name
              : "Unknown error",
          );
        }
      },
    );
  }, [activities, loadStatus, isOnline]);

  // Open the activity creation form.
  const openAddForm = () => {
    setEditingActivity(null);
    setFormVisible(true);
  };

  // Open the activity editing form.
  const openEditForm = (activity: Activity) => {
    setEditingActivity(activity);
    setFormVisible(true);
  };

  // Close the activity form.
  const closeForm = () => {
    setFormVisible(false);
    setEditingActivity(null);
  };

  // Create or update an activity through the API.
  const saveActivity = (activity: Activity) => {
    if (requestInProgress.current) {
      Alert.alert(
        "Please wait",
        "Another request is currently in progress.",
      );

      return;
    }

    if (!isOnline) {
      Alert.alert(
        "Backend unavailable",
        "Reconnect before saving activities.",
      );

      return;
    }

    requestInProgress.current = true;

    async function persistActivity() {
      try {
        const exists = activities.some(
          (item) => item.id === activity.id,
        );

        const saved = exists
          ? await updateActivity(activity)
          : await createActivity(activity);

        setActivities((current) =>
          exists
            ? current.map((item) =>
                item.id === saved.id ? saved : item,
              )
            : [saved, ...current],
        );

        closeForm();
      } catch (error) {
        if (__DEV__) {
          console.error(
            "Unable to save activity:",
            error instanceof Error
              ? error.name
              : "Unknown error",
          );
        }

        setIsOnline(false);

        Alert.alert(
          "Save not confirmed",
          "Reconnect and refresh activities before retrying.",
        );
      } finally {
        requestInProgress.current = false;
      }
    }

    void persistActivity();
  };

  // Delete an activity through the API.
  const deleteActivity = (id: string) => {
    const activity = activities.find(
      (item) => item.id === id,
    );

    if (!activity) {
      return;
    }

    if (!isOnline) {
      Alert.alert(
        "Backend unavailable",
        "Reconnect before deleting activities.",
      );

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
            if (requestInProgress.current) {
              Alert.alert(
                "Please wait",
                "Another request is currently in progress.",
              );

              return;
            }

            requestInProgress.current = true;

            async function remove() {
              try {
                await deleteRemoteActivity(id);

                setActivities((current) =>
                  current.filter(
                    (item) => item.id !== id,
                  ),
                );
              } catch (error) {
                if (__DEV__) {
                  console.error(
                    "Unable to delete activity:",
                    error instanceof Error
                      ? error.name
                      : "Unknown error",
                  );
                }

                setIsOnline(false);

                Alert.alert(
                  "Deletion not confirmed",
                  "Reconnect and refresh activities.",
                );
              } finally {
                requestInProgress.current = false;
              }
            }

            void remove();
          },
        },
      ],
    );
  };

  // Render the selected navigation screen.
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
        return (
          <TrackScreen
            onSaveActivity={saveActivity}
          />
        );

      case "History":
        return (
          <HistoryScreen
            activities={activities}
            onEdit={openEditForm}
            onDelete={deleteActivity}
          />
        );

      case "Insights":
        return (
          <InsightsScreen
            activities={activities}
          />
        );

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

  // Initial loading and error screen.
  if (loadStatus !== "ready") {
    return (
      <SafeAreaView style={styles.app}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.loadingContainer}>
          {loadStatus === "loading" || isRefreshing ? (
            <>
              <ActivityIndicator
                size="large"
                color={colors.accent}
              />

              <Text style={styles.loadingTitle}>
                {isRefreshing
                  ? "Reconnecting to GoBit..."
                  : "Loading your workouts..."}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.errorTitle}>
                Could not load your workouts
              </Text>

              <Text style={styles.errorMessage}>
                Your saved data has not been replaced.
                Check the backend connection and local
                storage availability.
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retry loading saved workouts"
                onPress={() => void retryLoadActivities()}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>
                  Try again
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Main application interface.
  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isRefreshing
            ? "Refreshing backend connection"
            : isOnline
              ? "Refresh activities"
              : "Reconnect to backend"
        }
        accessibilityState={{
          disabled: isRefreshing,
          busy: isRefreshing,
        }}
        disabled={isRefreshing}
        onPress={() => void retryLoadActivities()}
        style={({ pressed }) => [
          styles.connectionBanner,
          isRefreshing
            ? styles.refreshingBanner
            : isOnline
              ? styles.onlineBanner
              : styles.offlineBanner,
          pressed &&
            !isRefreshing &&
            styles.connectionPressed,
        ]}
      >
        <View style={styles.connectionContent}>
          {isRefreshing && (
            <ActivityIndicator
              size="small"
              color="#1D4ED8"
            />
          )}

          <Text
            style={[
              styles.connectionText,
              isRefreshing
                ? styles.refreshingText
                : isOnline
                  ? styles.onlineText
                  : styles.offlineText,
            ]}
          >
            {isRefreshing
              ? "Connecting to database..."
              : isOnline
                ? "Database connected - Tap to refresh"
                : "Offline cache - Tap to reconnect"}
          </Text>
        </View>
      </Pressable>

      <View style={styles.screen}>
        {renderScreen()}
      </View>

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

// Application styles.
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

  connectionBanner: {
    minHeight: 44,
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
  },

  connectionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  connectionText: {
    flexShrink: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },

  connectionPressed: {
    opacity: 0.75,
  },

  onlineBanner: {
    backgroundColor: "#DCFCE7",
  },

  offlineBanner: {
    backgroundColor: "#FEF3C7",
  },

  refreshingBanner: {
    backgroundColor: "#DBEAFE",
  },

  onlineText: {
    color: "#166534",
  },

  offlineText: {
    color: "#92400E",
  },

  refreshingText: {
    color: "#1D4ED8",
  },
});
