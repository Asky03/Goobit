import { Activity } from '../types/activity';

const activities: Activity[] = [];

export async function getActivities(): Promise<Activity[]> {
  return [...activities];
}

export async function getActivityById(
  id: string,
): Promise<Activity | null> {
  return activities.find((activity) => activity.id === id) ?? null;
}

export async function saveActivity(activity: Activity): Promise<Activity> {
  const existingIndex = activities.findIndex(
    (item) => item.id === activity.id,
  );

  if (existingIndex >= 0) {
    activities[existingIndex] = activity;
  } else {
    activities.push(activity);
  }

  return activity;
}

export async function deleteActivity(id: string): Promise<boolean> {
  const index = activities.findIndex((activity) => activity.id === id);

  if (index === -1) {
    return false;
  }

  activities.splice(index, 1);
  return true;
}