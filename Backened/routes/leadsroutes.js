import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getLeads, createLead, updateLead, deleteLead } from "../controller/leadscontroller.js";
import Lead from "../MODELS/leads.js"; // ⚠️ yeh bhi missing tha

const router = express.Router();

// ✅ Static routes MUST come before parameterized /:id routes
router.get("/", protect, getLeads);
router.post("/", protect, createLead);

// ✅ Parameterized routes after specific ones
router.get("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

export default router;
