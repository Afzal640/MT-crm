import express from "express";
import User from "../MODELS/USER.js";
import Activity from "../MODELS/activity.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getTeamReport } from "../controller/admincontroller.js";

const router = express.Router();

/**
 * 🟢 TEAM REPORT (For Admin Team View)
 */
router.get("/team-report", protect, authorizeRoles("admin"), getTeamReport);

/**
 * 🟢 USERS LIST (Sales / Production / Admin)
 */
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 🟡 DASHBOARD STATS
 */
router.get("/dashboard-stats", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find();

    const sales = users.filter(u => u.role === "sales").length;
    const production = users.filter(u => u.role === "production").length;
    const admin = users.filter(u => u.role === "admin").length;

    const activities = await Activity.find().populate("createdBy", "name").sort({ createdAt: -1 }).limit(10);

    res.json({
      leads: {
        value: users.length,
        change: 10,
        trend: "up"
      },
      deals: {
        value: sales,
        change: 5,
        trend: "up"
      },
      followups: {
        value: production,
        change: -2,
        trend: "down"
      },
      revenue: {
        value: users.length * 100,
        change: 12,
        trend: "up"
      },
      recentActivities: activities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 🔵 CHART DATA
 */
router.get("/chart-data", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find();

    const sales = users.filter(u => u.role === "sales").length;
    const production = users.filter(u => u.role === "production").length;

    res.json({
      leadsByService: [
        { name: "Sales", value: sales, color: "#6366f1" },
        { name: "Production", value: production, color: "#10b981" }
      ],
      monthlyDeals: [
        { month: "Jan", deals: 5, revenue: 10 },
        { month: "Feb", deals: 8, revenue: 15 },
        { month: "Mar", deals: 12, revenue: 20 }
      ]
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create-user", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role // sales / production / admin
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;