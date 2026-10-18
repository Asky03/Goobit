
export type StepCounterState = {
  baseline: number | null;
  steps: number;
};

/**
 * Converts a pedometer reading into a non-negative
 * workout-relative count.
 *
 * Call beginStepSession() when a new workout begins.
 * Feed readings into updateStepCount() while the workout
 * is actively counting steps.
 */
export function beginStepSession(): StepCounterState {
  return {
    baseline: null,
    steps: 0,
  };
}

export function updateStepCount(
  state: StepCounterState,
  reading: number,
): StepCounterState {
  if (!Number.isFinite(reading) || reading < 0) {
    return state;
  }

  const baseline = state.baseline ?? reading;

  return {
    baseline,
    steps: Math.max(0, reading - baseline),
  };
}
