import { Router } from "express";

import {
  getActivities,
  getActivity,
  postActivity,
  patchActivity,
  removeActivity,
} from "../controllers/activity.controller";

const router = Router();

router.get("/", getActivities);

router.get("/:id", getActivity);

router.post("/", postActivity);

router.patch("/:id", patchActivity);

router.delete("/:id", removeActivity);

export default router;