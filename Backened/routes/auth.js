import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../MODELS/USER.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// ✅ LOGIN (all users)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(`Login failed: User not found for email ${normalizedEmail}`);
      return res.status(400).json({ msg: "User not found" });
    }

    let isMatch = false;
    if (user.password.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ ADMIN CREATE USER
router.post(
  "/create-user",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// ✅ GET ALL SALES USERS (Admin only)
router.get(
  "/sales-users",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find({ role: "sales" }).select("name email role");
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// ✅ GET ALL PRODUCTION USERS (Admin only)
router.get(
  "/production-users",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find({ role: "production" }).select("name email role");
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

export default router;