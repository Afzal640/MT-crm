import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getProjects } from "../controller/projectcontroller.js";

const router = express.Router();

// Production + Admin access
router.get(
  "/",
  protect,
  authorizeRoles("admin", "production"),
  getProjects
);
export default router;