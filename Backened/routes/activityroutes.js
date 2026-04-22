import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getActivities,
  createActivity
} from "../controller/activitycontroller.js"

const router = express.Router();

router.get("/", protect, getActivities);
router.post("/", protect, createActivity);

export default router;