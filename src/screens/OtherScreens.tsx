
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { LocationSubscription } from "expo-location";

import ActivityCard from "../components/ActivityCard";
import StatCard from "../components/StatCard";
import { colors } from "../theme/colors";
import type { Activity, ActivityType } from "../types/activity";
import { calculateActivitySummary } from "../utils/activity";
import {
  calculateDistanceMeters,
  calculatePaceMinutesPerKm,
  calculateSpeedKmh,
  formatDuration,
} from "../utils/tracking";
import type { WorkoutLocation } from "../services/locationService";
import { startLocationUpdates } from "../services/locationService";
import { startPedometerUpdates } from "../services/pedometerService";

type HistoryProps = {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
};

type InsightsProps = {
  activities: Activity[];
};

type TrackProps = {
  onSaveActivity: (activity: Activity) => void;
};

type TrackingStatus = "idle" | "running" | "paused";

const WORKOUT_TYPES: ActivityType[] = [
  "Running",
  "Walking",
  "Cycling",
];

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

export function TrackScreen({ onSaveActivity }: TrackProps) {
  const [status, setStatus] = useState<TrackingStatus>("idle");
  const [activityType, setActivityType] =
    useState<ActivityType>("Running");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [steps, setSteps] = useState(0);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsReady, setGpsReady] = useState(false);
  const [stepCounterAvailable, setStepCounterAvailable] = useState<
    boolean | null
  >(null);
  const [message, setMessage] = useState(
    "Choose an activity and start your workout outdoors for best GPS results.",
  );

  const statusRef = useRef<TrackingStatus>("idle");
  const locationSubscriptionRef =
    useRef<LocationSubscription | null>(null);
  const pedometerSubscriptionRef =
    useRef<Awaited<ReturnType<typeof startPedometerUpdates>> | null>(null);
  const lastLocationRef = useRef<WorkoutLocation | null>(null);
  const distanceRef = useRef(0);
  const stepsRef = useRef(0);
  const stepsBeforeSubscriptionRef = useRef(0);
  const elapsedRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const startRequestRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      locationSubscriptionRef.current?.remove();
      pedometerSubscriptionRef.current?.subscription.remove();
      locationSubscriptionRef.current = null;
      pedometerSubscriptionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const timer = setInterval(() => {
      if (startedAtRef.current !== null) {
        const nextElapsed =
          elapsedRef.current +
          Math.floor((Date.now() - startedAtRef.current) / 1000);

        setElapsedSeconds(nextElapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  
const releaseSubscriptions = () => {
  locationSubscriptionRef.current?.remove();

  pedometerSubscriptionRef.current?.subscription.remove();

  locationSubscriptionRef.current = null;
  pedometerSubscriptionRef.current = null;
};


  const handleLocation = (location: WorkoutLocation) => {
    if (statusRef.current !== "running") {
      return;
    }

    setGpsAccuracy(location.accuracy);

    // Reject points with poor accuracy before they affect distance.
    if (
      location.accuracy !== null &&
      location.accuracy > 35
    ) {
      setMessage("GPS accuracy is low. Waiting for a better signal.");
      return;
    }

    const previous = lastLocationRef.current;

    if (previous) {
      const segmentMeters = calculateDistanceMeters(previous, location);
      const elapsedMs = location.timestamp - previous.timestamp;

      // Ignore duplicate, reversed-time and implausible GPS jumps.
      if (elapsedMs <= 0 || segmentMeters > 0.0) {
        if (elapsedMs <= 0) {
          return;
        }

        const speedMetersPerSecond =
          segmentMeters / (elapsedMs / 1000);

        if (speedMetersPerSecond > 35) {
          setMessage("Ignoring an implausible GPS jump.");
          return;
        }

        // Ignore tiny movements that are likely stationary GPS drift.
        if (segmentMeters < 2) {
          lastLocationRef.current = location;
          setMessage("GPS connected. Tracking your workout.");
          setGpsReady(true);
          return;
        }

        distanceRef.current += segmentMeters;
        setDistanceMeters(distanceRef.current);
      }
    }

    lastLocationRef.current = location;
    setGpsReady(true);
    setMessage("GPS connected. Tracking your workout.");
  };

  const startWorkout = async () => {
    if (startRequestRef.current || statusRef.current === "running") {
      return;
    }

    startRequestRef.current = true;
    setMessage("Requesting location permission and starting GPS…");

    try {
      const locationSubscription = await startLocationUpdates(handleLocation);

      if (!mountedRef.current) {
        locationSubscription.remove();
        return;
      }

      locationSubscriptionRef.current = locationSubscription;
      lastLocationRef.current = null;
      setGpsReady(false);
      setGpsAccuracy(null);

      // Step counting is optional: a missing pedometer must not stop GPS.
      try {
        const pedometerSubscription = await startPedometerUpdates(
          (sensorSteps) => {
            if (statusRef.current !== "running") {
              return;
            }

            const totalSteps =
              stepsBeforeSubscriptionRef.current + sensorSteps;

            stepsRef.current = totalSteps;
            setSteps(totalSteps);
            setStepCounterAvailable(true);
          },
        );

        
if (!mountedRef.current) {
  pedometerSubscription.subscription.remove();
  locationSubscription.remove();
  return;
}


        pedometerSubscriptionRef.current = pedometerSubscription;
        setStepCounterAvailable(true);
      } catch {
        setStepCounterAvailable(false);
        setMessage(
          "GPS tracking is active. Step counting is unavailable or not permitted on this device.",
        );
      }

      startedAtRef.current = Date.now();
      statusRef.current = "running";
      setStatus("running");
      setMessage("Workout in progress. Keep the app open.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to start GPS tracking.";

      setMessage(errorMessage);
      Alert.alert("Unable to start workout", errorMessage);
      releaseSubscriptions();
    } finally {
      startRequestRef.current = false;
    }
  };

  const pauseWorkout = () => {
    if (statusRef.current !== "running") {
      return;
    }

    if (startedAtRef.current !== null) {
      elapsedRef.current += Math.floor(
        (Date.now() - startedAtRef.current) / 1000,
      );
    }

    startedAtRef.current = null;
    stepsBeforeSubscriptionRef.current = stepsRef.current;
    statusRef.current = "paused";
    setStatus("paused");
    setElapsedSeconds(elapsedRef.current);
    releaseSubscriptions();
    lastLocationRef.current = null;
    setMessage("Workout paused.");
  };

  const resumeWorkout = async () => {
    if (statusRef.current !== "paused") {
      return;
    }

    await startWorkout();
  };

  const resetWorkout = () => {
    releaseSubscriptions();
    statusRef.current = "idle";
    setStatus("idle");
    lastLocationRef.current = null;
    distanceRef.current = 0;
    stepsRef.current = 0;
    stepsBeforeSubscriptionRef.current = 0;
    elapsedRef.current = 0;
    startedAtRef.current = null;
    setElapsedSeconds(0);
    setDistanceMeters(0);
    setSteps(0);
    setGpsReady(false);
    setGpsAccuracy(null);
    setStepCounterAvailable(null);
  };

  const stopWorkout = () => {
    if (statusRef.current === "idle") {
      return;
    }

    const finalElapsed =
      statusRef.current === "running" && startedAtRef.current !== null
        ? elapsedRef.current +
          Math.floor((Date.now() - startedAtRef.current) / 1000)
        : elapsedRef.current;

    const finalDistanceKm = distanceRef.current / 1000;

    releaseSubscriptions();
    statusRef.current = "idle";
    setStatus("idle");

    if (finalElapsed < 1 && finalDistanceKm < 0.01) {
      resetWorkout();
      setMessage("Workout discarded because no meaningful activity was recorded.");
      return;
    }

    const calorieRate =
      activityType === "Running" ? 10 :
      activityType === "Cycling" ? 8 : 4;

    const completedActivity: Activity = {
      id: `workout-${Date.now()}`,
      name: `${activityType} workout`,
      type: activityType,
      duration: Math.max(1, Math.round(finalElapsed / 60)),
      calories: Math.round((finalElapsed / 60) * calorieRate),
      date: new Date().toISOString().slice(0, 10),
      distanceKm: Number(finalDistanceKm.toFixed(2)),
    };

    Alert.alert(
      "Finish workout?",
      `Save ${formatDuration(finalElapsed)} of ${activityType.toLowerCase()}?`,
      [
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            resetWorkout();
            setMessage("Workout discarded.");
          },
        },
        {
          text: "Save workout",
          onPress: () => {
            onSaveActivity(completedActivity);
            resetWorkout();
            setMessage("Workout saved to your activity list.");
          },
        },
      ],
    );
  };

  const elapsedForMetrics = elapsedSeconds;

  const distanceKm = distanceMeters / 1000;
  const speedKmh = calculateSpeedKmh(
    distanceMeters,
    elapsedForMetrics,
  );
  const pace = calculatePaceMinutesPerKm(
    distanceMeters,
    elapsedForMetrics,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Track activity</Text>
        <Text style={styles.subtitle}>
          Track a foreground workout using your phones GPS and, where
          available, its step counter.
        </Text>

        <Text style={styles.sectionTitle}>Activity type</Text>
        <View style={styles.typeRow}>
          {WORKOUT_TYPES.map((type) => (
            <Pressable
              key={type}
              accessibilityRole="button"
              accessibilityState={{ selected: activityType === type }}
              disabled={status !== "idle"}
              onPress={() => setActivityType(type)}
              style={[
                styles.typeButton,
                activityType === type && styles.typeButtonSelected,
                status !== "idle" && styles.disabledButton,
              ]}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  activityType === type && styles.typeButtonTextSelected,
                ]}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.timerCard}>
          <Text style={styles.metricLabel}>Elapsed time</Text>
          <Text style={styles.timer}>
            {formatDuration(elapsedForMetrics)}
          </Text>
          <Text style={styles.statusText}>
            {status === "running"
              ? "WORKOUT IN PROGRESS"
              : status === "paused"
                ? "WORKOUT PAUSED"
                : "READY TO START"}
          </Text>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>{distanceKm.toFixed(2)} km</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Steps</Text>
            <Text style={styles.metricValue}>{steps}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pace</Text>
            <Text style={styles.metricValue}>{pace} /km</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Speed</Text>
            <Text style={styles.metricValue}>{speedKmh.toFixed(1)} km/h</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusCardTitle}>Sensor status</Text>
          <Text style={styles.statusCardText}>
            GPS: {gpsReady ? "Receiving usable location" : "Waiting for a usable fix"}
          </Text>
          <Text style={styles.statusCardText}>
            Accuracy: {gpsAccuracy === null ? "Not available" : `${Math.round(gpsAccuracy)} m`}
          </Text>
          <Text style={styles.statusCardText}>
            Pedometer: {stepCounterAvailable === null
              ? "Not checked"
              : stepCounterAvailable
                ? "Available"
                : "Unavailable"}
          </Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        {status === "idle" ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => void startWorkout()}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Start workout</Text>
          </Pressable>
        ) : (
          <View style={styles.controls}>
            {status === "running" ? (
              <Pressable
                accessibilityRole="button"
                onPress={pauseWorkout}
                style={[styles.controlButton, styles.secondaryButton]}
              >
                <Text style={styles.secondaryButtonText}>Pause</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => void resumeWorkout()}
                style={[styles.controlButton, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>Resume</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={stopWorkout}
              style={[styles.controlButton, styles.stopButton]}
            >
              <Text style={styles.primaryButtonText}>Stop</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.disclaimer}>
          Foreground tracking only. Keep GoBit open during your workout.
          Calories are illustrative estimates, not medical measurements.
          GPS distance may be inaccurate indoors or where signals are weak.
        </Text>
      </ScrollView>
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
            value={String(summary.totalCalories)}
            detail="Illustrative kcal"
          />
          <StatCard
            label="Distance"
            value={`${summary.totalDistanceKm.toFixed(1)} km`}
            detail="Recorded distance"
          />
        </View>

        <Text style={styles.note}>
          Activities are currently stored in app memory and reset when the
          app reloads. Persistent storage is planned for Day 3.
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
            Location is requested when you start a workout. This version uses
            foreground tracking only and does not upload GPS data to a server.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Data storage</Text>
          <Text style={styles.infoText}>
            Activities currently remain in memory and are not preserved
            between app reloads. Local persistence is planned for Day 3.
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
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  typeButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 5,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  typeButtonTextSelected: {
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.65,
  },
  timerCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 22,
    marginBottom: 12,
  },
  metricLabel: {
    color: colors.secondary,
    fontSize: 12,
    marginBottom: 8,
  },
  timer: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  statusText: {
    color: "#D0D3DA",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 10,
    letterSpacing: 1,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  metricValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  statusCardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  statusCardText: {
    color: colors.secondary,
    fontSize: 13,
    marginBottom: 5,
  },
  message: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  controls: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    flex: 1,
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  stopButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 14,
  },
  note: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
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
