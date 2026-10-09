export type TrackingStatus =
  | 'idle'
  | 'tracking'
  | 'paused'
  | 'stopped';

export interface TrackingState {
  status: TrackingStatus;
  startedAt: number | null;
  pausedAt: number | null;
  elapsedSeconds: number;
}

let trackingState: TrackingState = {
  status: 'idle',
  startedAt: null,
  pausedAt: null,
  elapsedSeconds: 0,
};

export function getTrackingState(): TrackingState {
  return { ...trackingState };
}

export function startTracking(): TrackingState {
  trackingState = {
    status: 'tracking',
    startedAt: Date.now(),
    pausedAt: null,
    elapsedSeconds: 0,
  };

  return getTrackingState();
}

export function pauseTracking(): TrackingState {
  if (trackingState.status !== 'tracking') {
    return getTrackingState();
  }

  trackingState = {
    ...trackingState,
    status: 'paused',
    pausedAt: Date.now(),
  };

  return getTrackingState();
}

export function resumeTracking(): TrackingState {
  if (trackingState.status !== 'paused') {
    return getTrackingState();
  }

  trackingState = {
    ...trackingState,
    status: 'tracking',
    pausedAt: null,
  };

  return getTrackingState();
}

export function stopTracking(): TrackingState {
  trackingState = {
    ...trackingState,
    status: 'stopped',
  };

  return getTrackingState();
}

export function resetTracking(): TrackingState {
  trackingState = {
    status: 'idle',
    startedAt: null,
    pausedAt: null,
    elapsedSeconds: 0,
  };

  return getTrackingState();
}