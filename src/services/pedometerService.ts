
import { Pedometer } from "expo-sensors";

export async function isPedometerAvailable(): Promise<boolean> {
  return Pedometer.isAvailableAsync();
}

export async function startPedometerUpdates(
  onSteps: (steps: number) => void,
): Promise<ReturnType<typeof Pedometer.watchStepCount>> {
  const available = await isPedometerAvailable();

  if (!available) {
    throw new Error(
      "Step counting is not available on this device.",
    );
  }

  const permission = await Pedometer.requestPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Motion permission is required to count steps.",
    );
  }

  return Pedometer.watchStepCount((result) => {
    onSteps(result.steps);
  });
}
