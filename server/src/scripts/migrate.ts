import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "../config/db";

async function migrate(): Promise<void> {
  try {
    const migrationPath = resolve(
      process.cwd(),
      "migrations",
      "001_create_activities.sql",
    );

    const sql = await readFile(
      migrationPath,
      "utf8",
    );

    await pool.query(sql);

    console.log(
      "Migration completed: 001_create_activities.sql",
    );
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void migrate();