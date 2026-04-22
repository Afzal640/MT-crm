import express from "express";
import { getSalesDashboard } from "../controller/salescontroller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("sales"),
  getSalesDashboard
);

export default router;