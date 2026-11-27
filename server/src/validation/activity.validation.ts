import {
  ACTIVITY_TYPES,
  type Activity,
  type ActivityType,
  type ActivityUpdate,
} from "../types/activity";

export class ValidationError extends Error {}

function asObject(
  value: unknown,
): Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new ValidationError(
      "Request body must be an object",
    );
  }

  return value as Record<string, unknown>;
}

function text(
  value: unknown,
  field: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.length > 250
  ) {
    throw new ValidationError(
      `${field} must be a non-empty string`,
    );
  }

  return value.trim();
}

function number(
  value: unknown,
  field: string,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new ValidationError(
      `${field} must be a non-negative number`,
    );
  }

  return value;
}

function activityType(
  value: unknown,
): ActivityType {
  if (
    typeof value !== "string" ||
    !ACTIVITY_TYPES.some(
      (type) => type === value,
    )
  ) {
    throw new ValidationError(
      "Invalid activity type",
    );
  }

  return value as ActivityType;
}

function activityDate(value: unknown): string {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new ValidationError(
      "Invalid activity date",
    );
  }

  return new Date(value).toISOString();
}

export function validateActivity(
  input: unknown,
): Activity {
  const body = asObject(input);

  const activity: Activity = {
    id: text(body.id, "id"),
    name: text(body.name, "name"),
    type: activityType(body.type),
    duration: number(body.duration, "duration"),
    calories: number(body.calories, "calories"),
    date: activityDate(body.date),
  };

  if (body.distanceKm !== undefined) {
    activity.distanceKm = number(
      body.distanceKm,
      "distanceKm",
    );
  }

  return activity;
}

export function validateActivityUpdate(
  input: unknown,
): ActivityUpdate {
  const body = asObject(input);
  const update: ActivityUpdate = {};

  const allowedFields = [
    "name",
    "type",
    "duration",
    "calories",
    "date",
    "distanceKm",
  ];

  for (const key of Object.keys(body)) {
    if (!allowedFields.includes(key)) {
      throw new ValidationError(
        `Unsupported field: ${key}`,
      );
    }
  }

  if ("name" in body) {
    update.name = text(body.name, "name");
  }

  if ("type" in body) {
    update.type = activityType(body.type);
  }

  if ("duration" in body) {
    update.duration = number(
      body.duration,
      "duration",
    );
  }

  if ("calories" in body) {
    update.calories = number(
      body.calories,
      "calories",
    );
  }

  if ("date" in body) {
    update.date = activityDate(body.date);
  }

  if ("distanceKm" in body) {
    update.distanceKm = number(
      body.distanceKm,
      "distanceKm",
    );
  }

  if (Object.keys(update).length === 0) {
    throw new ValidationError(
      "No valid fields supplied for update",
    );
  }

  return update;
}