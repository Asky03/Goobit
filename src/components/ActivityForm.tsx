
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  ACTIVITY_TYPES,
  type Activity,
  type ActivityType,
} from "../types/activity";
import { colors } from "../theme/colors";

type Props = {
  visible: boolean;
  initialActivity: Activity | null;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
};

export default function ActivityForm({
  visible,
  initialActivity,
  onSave,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialActivity?.name ?? "");
  const [type, setType] = useState<ActivityType>(
    initialActivity?.type ?? "Running",
  );
  const [duration, setDuration] = useState(
    String(initialActivity?.duration ?? 30),
  );
  const [calories, setCalories] = useState(
    String(initialActivity?.calories ?? 200),
  );
  const [date, setDate] = useState(
    initialActivity?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [distance, setDistance] = useState(
    initialActivity?.distanceKm === undefined
      ? ""
      : String(initialActivity.distanceKm),
  );

  function save() {
    const cleanName = name.trim();
    const minutes = Number(duration);
    const kcal = Number(calories);
    const km = distance.trim() === "" ? undefined : Number(distance);

    if (!cleanName) {
      Alert.alert("Missing name", "Enter an activity name.");
      return;
    }

    if (!Number.isFinite(minutes) || minutes <= 0) {
      Alert.alert("Invalid duration", "Enter a duration greater than zero.");
      return;
    }

    if (!Number.isFinite(kcal) || kcal < 0) {
      Alert.alert("Invalid calories", "Enter zero or a positive number.");
      return;
    }

    if (km !== undefined && (!Number.isFinite(km) || km < 0)) {
      Alert.alert("Invalid distance", "Enter zero or a positive distance.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert("Invalid date", "Use the YYYY-MM-DD format.");
      return;
    }

    onSave({
      id: initialActivity?.id ?? `activity-${Date.now()}`,
      name: cleanName,
      type,
      duration: minutes,
      calories: kcal,
      date,
      ...(km === undefined ? {} : { distanceKm: km }),
    });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.heading}>
              {initialActivity ? "Edit activity" : "Add activity"}
            </Text>
            <Text style={styles.description}>
              Record your workout details.
            </Text>

            <Text style={styles.label}>Activity name</Text>
            <TextInput
              accessibilityLabel="Activity name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Morning Run"
              placeholderTextColor={colors.muted}
              style={styles.input}
              maxLength={80}
            />

            <Text style={styles.label}>Activity type</Text>
            <View style={styles.typeList}>
              {ACTIVITY_TYPES.map((item) => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected: type === item }}
                  onPress={() => setType(item)}
                  style={[
                    styles.typeButton,
                    type === item && styles.typeButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      type === item && styles.typeTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              accessibilityLabel="Duration in minutes"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              style={styles.input}
              placeholder="30"
            />

            <Text style={styles.label}>Calories (kcal)</Text>
            <TextInput
              accessibilityLabel="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              style={styles.input}
              placeholder="200"
            />

            <Text style={styles.label}>Distance (km, optional)</Text>
            <TextInput
              accessibilityLabel="Distance in kilometres"
              value={distance}
              onChangeText={setDistance}
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="e.g. 3.5"
            />

            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
              accessibilityLabel="Activity date"
              value={date}
              onChangeText={setDate}
              style={styles.input}
              placeholder="2026-10-12"
              maxLength={10}
            />

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={onCancel}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={save}
                style={[styles.actionButton, styles.saveButton]}
              >
                <Text style={styles.saveText}>Save activity</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    maxHeight: "90%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heading: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  description: {
    color: colors.secondary,
    marginTop: 6,
    marginBottom: 22,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 15,
  },
  typeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  typeButtonSelected: {
    backgroundColor: colors.runningBackground,
    borderColor: colors.accent,
  },
  typeText: {
    color: colors.secondary,
    fontWeight: "600",
  },
  typeTextSelected: {
    color: colors.runningText,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    color: colors.text,
    fontWeight: "700",
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
