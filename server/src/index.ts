import "dotenv/config";
import express from "express";

import activityRoutes from "./routes/activity.routes";
import { pool, connectDatabase } from "./config/db";

const app = express();

const PORT = Number(process.env.PORT ?? 5000);
const HOST = process.env.HOST ?? "127.0.0.1";

// HTTP request logging middleware.
// Avoid logging request bodies, IP addresses,
// query parameters or individual activity IDs.
app.use((req, res, next) => {
  const startTime = Date.now();
  const path = req.path;

  const safePath =
    path === "/api/activities"
      ? "/api/activities"
      : path.startsWith("/api/activities/")
        ? "/api/activities/:id"
        : ["/", "/health", "/health/db", "/api/test"].includes(path)
          ? path
          : "[other route]";

  res.once("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[HTTP] ${req.method} ${safePath} -> ` +
        `${res.statusCode} (${duration}ms)`,
    );
  });

  next();
});

// Request body configuration.
app.use(express.json({ limit: "100kb" }));

// Activity API routes.
app.use("/api/activities", activityRoutes);

// Root endpoint.
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to GoBit API",
    version: "1.0.0",
  });
});

// Backend health check.
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "GoBit API",
  });
});

// Database health check.
app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database,
        NOW() AS server_time
    `);

    res.json({
      status: "ok",
      database: result.rows[0].database,
      serverTime: result.rows[0].server_time,
    });
  } catch (error) {
    console.error(
      "[GoBit Database] Health check failed:",
      error instanceof Error ? error.name : "Unknown error",
    );

    res.status(503).json({
      status: "error",
      message: "Database unavailable",
    });
  }
});

// Database connection test endpoint.
app.get("/api/test", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, message, created_at
      FROM connection_test
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "[GoBit Database] Test query failed:",
      error instanceof Error ? error.name : "Unknown error",
    );

    res.status(500).json({
      success: false,
      message: "Unable to retrieve test records",
    });
  }
});

// Connect to PostgreSQL before starting Express.
async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, HOST, () => {
      console.log(
        `[GoBit Server] API running at http://${HOST}:${PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "[GoBit Server] Failed to start:",
      error instanceof Error ? error.name : "Unknown error",
    );

    await pool.end();
    process.exit(1);
  }
}

void startServer();