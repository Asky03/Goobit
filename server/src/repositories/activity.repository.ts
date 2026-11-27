import { pool } from "../config/db";
import type {
  Activity,
  ActivityType,
  ActivityUpdate,
} from "../types/activity";

type ActivityRow = {
  id: string;
  name: string;
  type: ActivityType;
  duration: number;
  calories: number;
  date: Date;
  distance_km: number | null;
};

function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    duration: row.duration,
    calories: row.calories,
    date: row.date.toISOString(),

    ...(row.distance_km !== null
      ? { distanceKm: row.distance_km }
      : {}),
  };
}

export async function findAllActivities():
  Promise<Activity[]> {
  const result = await pool.query<ActivityRow>(
    `SELECT *
     FROM public.activities
     ORDER BY date DESC, created_at DESC`,
  );

  return result.rows.map(toActivity);
}

export async function findActivityById(
  id: string,
): Promise<Activity | null> {
  const result = await pool.query<ActivityRow>(
    `SELECT *
     FROM public.activities
     WHERE id = $1`,
    [id],
  );

  return result.rows[0]
    ? toActivity(result.rows[0])
    : null;
}

export async function createActivity(
  activity: Activity,
): Promise<Activity> {
  const result = await pool.query<ActivityRow>(
    `INSERT INTO public.activities (
       id,
       name,
       type,
       duration,
       calories,
       date,
       distance_km
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      activity.id,
      activity.name,
      activity.type,
      activity.duration,
      activity.calories,
      activity.date,
      activity.distanceKm ?? null,
    ],
  );

  return toActivity(result.rows[0]);
}

export async function updateActivity(
  id: string,
  update: ActivityUpdate,
): Promise<Activity | null> {
  const columns = {
    name: "name",
    type: "type",
    duration: "duration",
    calories: "calories",
    date: "date",
    distanceKm: "distance_km",
  } as const;

  const keys = Object.keys(update) as
    (keyof ActivityUpdate)[];

  const values = keys.map(
    (key) => update[key],
  );

  const assignments = keys.map(
    (key, index) =>
      `${columns[key]} = $${index + 1}`,
  );

  const result = await pool.query<ActivityRow>(
    `UPDATE public.activities
     SET ${assignments.join(", ")},
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length + 1}
     RETURNING *`,
    [...values, id],
  );

  return result.rows[0]
    ? toActivity(result.rows[0])
    : null;
}

export async function deleteActivity(
  id: string,
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM public.activities
     WHERE id = $1`,
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}