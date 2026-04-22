
import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
  addProjectFile,
  createProjectFromLead,
} from "../controller/projectcontroller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ CONVERT LEAD TO PROJECT
router.post("/from-lead", protect, authorizeRoles("admin"), createProjectFromLead);

// ✅ GET ALL PROJECTS (FILTERED INSIDE CONTROLLER)
router.get("/", protect, authorizeRoles("admin", "production"), getProjects);

// ✅ CREATE PROJECT (ADMIN ONLY)
router.post("/", protect, authorizeRoles("admin"), createProject);

// ✅ GET SINGLE PROJECT
router.get("/:id", protect, getProjectById);

// ✅ UPDATE STATUS
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "production"),
  updateProjectStatus
);

// ✅ UPLOAD FILE
router.post(
  "/:id/files",
  protect,
  authorizeRoles("admin", "production"),
  addProjectFile
);




export default router;