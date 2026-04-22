import express from "express";
import {
  assignTarget,
  getTargets,
  updateTargetProgress,
} from "../controller/targetcontroller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assign", protect, assignTarget);
router.get("/", protect, getTargets);
router.put("/update", protect, updateTargetProgress);

export default router;