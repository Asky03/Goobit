
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import ActivityForm from "./src/components/ActivityForm";
import BottomNav, {
  type TabName,
} from "./src/components/BottomNav";

import { initialActivities } from "./src/data/initialActivities";
import type { Activity } from "./src/types/activity";

import HomeScreen from "./src/screens/HomeScreen";
import {
  HistoryScreen,
  InsightsScreen,
  ProfileScreen,
  TrackScreen,
} from "./src/screens/OtherScreens";

import { colors } from "./src/theme/colors";

export default function App() {
  const [activities, setActivities] =
    useState<Activity[]>(initialActivities);

  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [formVisible, setFormVisible] = useState(false);
  const [editingActivity, setEditingActivity] =
    useState<Activity | null>(null);

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

    if (!activity) return;

    Alert.alert(
      "Delete activity?",
      `Are you sure you want to delete "${activity.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
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
});
