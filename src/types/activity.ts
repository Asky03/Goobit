
export const ACTIVITY_TYPES = [
  "Running",
  "Walking",
  "Cycling",
  "Gym",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type Activity = {
  id: string;
  name: string;
  type: ActivityType;
  duration: number;
  calories: number;
  date: string;
  distanceKm?: number;
};
