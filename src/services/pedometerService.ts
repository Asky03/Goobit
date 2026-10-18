
import { Pedometer } from "expo-sensors";

export type PedometerStatus =
  | "checking"
  | "available"
  | "permission-denied"
  | "unavailable"
  | "error";

export type PedometerStartResult = {
  subscription: ReturnType<typeof Pedometer.watchStepCount>;
  status: "available";
};
export async function isPedometerAvailable(): Promise<boolean> {
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function startPedometerUpdates(
  onSteps: (steps: number) => void,
  onError?: (error: Error) => void,
): Promise<PedometerStartResult> {
  try {
    const available = await Pedometer.isAvailableAsync();

    if (!available) {
      throw new Error(
        "Step counting is unavailable on this device.",
      );
    }

    const permission = await Pedometer.getPermissionsAsync();

    if (!permission.granted) {
      const requestedPermission =
        await Pedometer.requestPermissionsAsync();

      if (!requestedPermission.granted) {
        throw new Error(
          "Motion permission was not granted. Step counting cannot start.",
        );
      }
    }

    const subscription = Pedometer.watchStepCount((result) => {
      if (
        Number.isFinite(result.steps) &&
        result.steps >= 0
      ) {
        onSteps(result.steps);
      }
    });

    return {
      subscription,
      status: "available",
    };
  } catch (cause) {
    const error =
      cause instanceof Error
        ? cause
        : new Error("Unable to start step counting.");

    onError?.(error);
    throw error;
  }
}
