
import type { Activity } from "../types/activity";

export type ActivitySummary = {
  totalActivities: number;
  totalDurationMinutes: number;
  totalCalories: number;
  totalDistanceKm: number;
};

export function calculateActivitySummary(
  activities: Activity[],
): ActivitySummary {
  return activities.reduce<ActivitySummary>(
    (summary, activity) => ({
      totalActivities: summary.totalActivities + 1,
      totalDurationMinutes:
        summary.totalDurationMinutes + activity.duration,
      totalCalories: summary.totalCalories + activity.calories,
      totalDistanceKm:
        summary.totalDistanceKm + (activity.distanceKm ?? 0),
    }),
    {
      totalActivities: 0,
      totalDurationMinutes: 0,
      totalCalories: 0,
      totalDistanceKm: 0,
    },
  );
}
