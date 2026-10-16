
import * as Location from "expo-location";

export type WorkoutLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

export async function requestLocationPermission(): Promise<void> {
  const result = await Location.requestForegroundPermissionsAsync();

  if (!result.granted) {
    throw new Error(
      "Location permission was denied. Enable it in your phone settings to track distance.",
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
