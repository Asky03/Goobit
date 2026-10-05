export type ActivityType =
  | 'walking'
  | 'running'
  | 'cycling'
  | 'workout';

export type ActivitySource =
  | 'gobit'
  | 'health_connect'
  | 'google_health'
  | 'fitbit';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;

  startedAt: string;
  endedAt: string;

  durationSeconds: number;
  distanceMeters: number;
  steps: number;
  calories: number;

  source: ActivitySource;
}

export interface ActivitySummary {
  totalActivities: number;
  totalDurationSeconds: number;
  totalDistanceMeters: number;
  totalSteps: number;
  totalCalories: number;
}