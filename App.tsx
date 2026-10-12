
import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { colors } from "./src/theme/colors";
import { initialActivities } from "./src/data/initialActivities";
import type { Activity } from "./src/types/activity";

import ActivityForm from "./src/components/ActivityForm";
import BottomNav, { type TabName } from "./src/components/BottomNav";
import HomeScreen from "./src/screens/HomeScreen";

import {
  HistoryScreen,
  InsightsScreen,
  ProfileScreen,
  TrackScreen,
} from "./src/screens/OtherScreens";

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [formVisible, setFormVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  function openAddForm() {
    setEditingActivity(null);
    setFormVisible(true);
  }

  function openEditForm(activity: Activity) {
    setEditingActivity(activity);
    setFormVisible(true);
  }

  function saveActivity(activity: Activity) {
    setActivities((current) => {
      const exists = current.some((item) => item.id === activity.id);

      if (exists) {
        return current.map((item) =>
          item.id === activity.id ? activity : item
        );
      }

      return [activity, ...current];
    });

    setFormVisible(false);
    setEditingActivity(null);
  }

  function deleteActivity(id: string) {
    const activity = activities.find((item) => item.id === id);

    Alert.alert(
      "Delete activity?",
      `Remove "${activity?.name ?? "this activity"}" from GoBit?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setActivities((current) =>
              current.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  }

  function renderScreen() {
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
        return <TrackScreen />;

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
    }
  }

  return (
    <View style={styles.app}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <View style={styles.screen}>{renderScreen()}</View>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      <ActivityForm

        visible={formVisible}
        key={`${showActivityForm}-${editingActivity?.id ?? "new"}`}
        initialActivity={editingActivity}
        onSave={saveActivity}
        onCancel={() => {
          setFormVisible(false);
          setEditingActivity(null);
        }}
      />
    </View>
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
