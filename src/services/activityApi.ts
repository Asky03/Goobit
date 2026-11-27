
import type { Activity } from "../types/activity";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 15000;

if (__DEV__) {
  console.log("[GoBit API] Base URL:", BASE_URL);
}

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export class ActivityApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ActivityApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not configured",
    );
  }

  const url = `${BASE_URL}${path}`;
  const method = options.method ?? "GET";
  const startTime = Date.now();

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body != null) {
    headers.set("Content-Type", "application/json");
  }

  // Request timeout implementation.
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    if (__DEV__) {
      console.log("[GoBit API] Request:", method, url);
    }

    const response = await fetch(url, {
      ...options,
      method,
      headers,
      signal: controller.signal,
    });

    if (__DEV__) {
      console.log(
        "[GoBit API] HTTP Status:",
        response.status,
      );

      console.log(
        "[GoBit API] Response Time:",
        `${Date.now() - startTime}ms`,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const result =
      (await response.json()) as ApiResponse<T>;

    if (__DEV__) {
      console.log(
        "[GoBit API] Response Success:",
        result.success,
      );
    }

    if (!response.ok || !result.success) {
      throw new ActivityApiError(
        result.message ??
          "Activity API request failed",
        response.status,
      );
    }

    return result.data as T;
  } catch (error) {
    if (controller.signal.aborted) {
      if (__DEV__) {
        console.warn(
          "[GoBit API] Request timed out:",
          method,
          `${Date.now() - startTime}ms`,
        );
      }

      throw new Error(
        "Request timed out after 15 seconds. " +
          "Check the backend connection and refresh activities.",
      );
    }

    if (__DEV__) {
      console.error(
        "[GoBit API] Request Failed:",
        method,
        url,
      );

      console.error(
        "[GoBit API] Elapsed Time:",
        `${Date.now() - startTime}ms`,
      );

      console.error(
        "[GoBit API] Error Details:",
        error instanceof Error
          ? error.name
          : "Unknown error",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function fetchActivities(): Promise<Activity[]> {
  return request<Activity[]>("/api/activities");
}

export function fetchActivity(
  id: string,
): Promise<Activity> {
  return request<Activity>(
    `/api/activities/${encodeURIComponent(id)}`,
  );
}

export function createActivity(
  activity: Activity,
): Promise<Activity> {
  return request<Activity>("/api/activities", {
    method: "POST",
    body: JSON.stringify(activity),
  });
}

export function updateActivity(
  activity: Activity,
): Promise<Activity> {
  const { id, ...updates } = activity;

  return request<Activity>(
    `/api/activities/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
  );
}

export async function deleteRemoteActivity(
  id: string,
): Promise<void> {
  await request<void>(
    `/api/activities/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}
