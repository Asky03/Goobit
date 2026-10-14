
import * as Location from "expo-location";

export type WorkoutLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

export async function requestLocationPermission(): Promise<void> {
  const permission =
    await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Location permission is required to track workout distance.",
    );
  }
}

export async function startLocationUpdates(
  onLocation: (location: WorkoutLocation) => void,
): Promise<Location.LocationSubscription> {
  await requestLocationPermission();

  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 3,
    },
    (location) => {
      onLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      });
    },
  );
}
