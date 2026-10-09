import { Activity, ActivitySummary } from '../types/activity';

export function calculateActivitySummary(
  activities: Activity[],
): ActivitySummary {
  return activities.reduce<ActivitySummary>(
    (summary, activity) => ({
      totalActivities: summary.totalActivities + 1,
      totalDurationSeconds:
        summary.totalDurationSeconds + activity.durationSeconds,
      totalDistanceMeters:
        summary.totalDistanceMeters + activity.distanceMeters,
      totalSteps: summary.totalSteps + activity.steps,
      totalCalories: summary.totalCalories + activity.calories,
    }),
    {
      totalActivities: 0,
      totalDurationSeconds: 0,
      totalDistanceMeters: 0,
      totalSteps: 0,
      totalCalories: 0,
    },
  );
}