
import type { WorkoutLocation } from "../services/locationService";

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateDistanceMeters(
  start: WorkoutLocation,
  end: WorkoutLocation,
): number {
  const latitudeDifference = toRadians(
    end.latitude - start.latitude,
  );
  const longitudeDifference = toRadians(
    end.longitude - start.longitude,
  );

  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  const safeA = Math.min(1, Math.max(0, a));

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA))
  );
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function calculatePaceMinutesPerKm(
  distanceMeters: number,
  elapsedSeconds: number,
): string {
  if (distanceMeters <= 0 || elapsedSeconds <= 0) {
    return "--:--";
  }

  const secondsPerKm = elapsedSeconds / (distanceMeters / 1000);

  if (!Number.isFinite(secondsPerKm)) {
    return "--:--";
  }

  const totalSeconds = Math.round(secondsPerKm);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function calculateSpeedKmh(
  distanceMeters: number,
  elapsedSeconds: number,
): number {
  if (distanceMeters <= 0 || elapsedSeconds <= 0) {
    return 0;
  }

  return (distanceMeters / 1000) / (elapsedSeconds / 3600);
}
