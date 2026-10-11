
import type { Activity } from "../types/activity";

export const initialActivities: Activity[] = [
  {
    id: "demo-1",
    name: "Morning Run",
    type: "Running",
    duration: 30,
    calories: 280,
    date: "2026-10-10",
    distanceKm: 3.8,
  },
  {
    id: "demo-2",
    name: "Evening Walk",
    type: "Walking",
    duration: 25,
    calories: 120,
    date: "2026-10-09",
    distanceKm: 1.9,
  },
  {
    id: "demo-3",
    name: "Strength Training",
    type: "Gym",
    duration: 45,
    calories: 350,
    date: "2026-10-09",
  },
];
