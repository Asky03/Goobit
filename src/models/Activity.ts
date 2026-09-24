export type ActivityType =
  | "Running"
  | "Walking"
  | "Cycling"
  | "Gym";

export type Activity = {
  id: string;
  name: string;
  type: ActivityType;
  duration: number;
  calories: number;
  date: string;
};