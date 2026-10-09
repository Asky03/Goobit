export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function formatDistance(meters: number): string {
  const safeMeters = Math.max(0, meters);

  if (safeMeters >= 1000) {
    return `${(safeMeters / 1000).toFixed(2)} km`;
  }

  return `${Math.round(safeMeters)} m`;
}

export function formatCalories(calories: number): string {
  return `${Math.max(0, Math.round(calories))} kcal`;
}

export function formatSteps(steps: number): string {
  return Math.max(0, Math.round(steps)).toLocaleString();
}