
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Activity } from "../types/activity";
import { ACTIVITY_TYPES } from "../types/activity";
import { initialActivities } from "../data/initialActivities";

const STORAGE_KEY = "@gobit/activities/v1";

function isActivity(value: unknown): value is Activity {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  const validDistance =
    item.distanceKm === undefined ||
    (typeof item.distanceKm === "number" &&
      Number.isFinite(item.distanceKm) &&
      item.distanceKm >= 0);

  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    typeof item.type === "string" &&
    ACTIVITY_TYPES.some((type) => type === item.type) &&
    typeof item.duration === "number" &&
    Number.isFinite(item.duration) &&
    item.duration >= 0 &&
    typeof item.calories === "number" &&
    Number.isFinite(item.calories) &&
    item.calories >= 0 &&
    typeof item.date === "string" &&
    !Number.isNaN(Date.parse(item.date)) &&
    validDistance
  );
}

function parseActivities(raw: string): Activity[] {
  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("Stored activities must be an array.");
  }

  // Reject the stored collection rather than silently dropping
  // records that fail validation.
  if (!parsed.every(isActivity)) {
    throw new Error("Stored activity data is invalid.");
  }

  return parsed;
}

/**
 * Loads saved activities. If storage has never been initialized,
 * seeds it with the existing demo activities.
 *
 * Invalid stored data is reported instead of silently replaced.
 */
export async function loadActivities(): Promise<Activity[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    const starterActivities = [...initialActivities];
    await saveActivities(starterActivities);
    return starterActivities;
  }

  return parseActivities(raw);
}

let writeQueue: Promise<void> = Promise.resolve();

/**
 * Serializes writes so rapid create/edit/delete operations do
 * not overwrite a newer saved collection with an older one.
 */
export function saveActivities(
  activities: Activity[],
): Promise<void> {
  const snapshot = JSON.stringify(activities);

  const write = writeQueue.then(() =>
    AsyncStorage.setItem(STORAGE_KEY, snapshot),
  );

  // Keep the queue usable after a failed write while still
  // returning the failure to the caller.
  writeQueue = write.catch(() => undefined);

  return write;
}

/**
 * Removes the saved activity collection.
 * The next load initializes the demo activities again.
 */
export async function clearSavedActivities(): Promise<void> {
  await writeQueue;
  await AsyncStorage.removeItem(STORAGE_KEY);
}
