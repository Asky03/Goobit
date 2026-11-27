import type {
  Request,
  Response,
} from "express";

import * as repository
  from "../repositories/activity.repository";

import {
  ValidationError,
  validateActivity,
  validateActivityUpdate,
} from "../validation/activity.validation";

function handleError(
  error: unknown,
  res: Response,
): void {
  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: error.message,
    });

    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    res.status(409).json({
      success: false,
      message: "Activity ID already exists",
    });

    return;
  }

  console.error("Activity API error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export async function getActivities(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const activities =
      await repository.findAllActivities();

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    handleError(error, res);
  }
}

export async function getActivity(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const activity =
      await repository.findActivityById(
        req.params.id,
      );

    if (!activity) {
      res.status(404).json({
        success: false,
        message: "Activity not found",
      });

      return;
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    handleError(error, res);
  }
}

export async function postActivity(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input = validateActivity(req.body);

    const activity =
      await repository.createActivity(input);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    handleError(error, res);
  }
}

export async function patchActivity(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const input =
      validateActivityUpdate(req.body);

    const activity =
      await repository.updateActivity(
        req.params.id,
        input,
      );

    if (!activity) {
      res.status(404).json({
        success: false,
        message: "Activity not found",
      });

      return;
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    handleError(error, res);
  }
}

export async function removeActivity(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const deleted =
      await repository.deleteActivity(
        req.params.id,
      );

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Activity not found",
      });

      return;
    }

    res.json({
      success: true,
      message: "Activity deleted",
    });
  } catch (error) {
    handleError(error, res);
  }
}