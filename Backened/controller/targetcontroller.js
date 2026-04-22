import Target from "../MODELS/target.js";

/**
 * 🎯 ASSIGN TARGET (ADMIN ONLY)
 */
export const assignTarget = async (req, res) => {
  try {
    const { userId, type, period, target } = req.body;

    // Find and update if exists, or create new
    const updatedTarget = await Target.findOneAndUpdate(
      { userId, type, period },
      { 
        target, 
        assignedBy: req.user.id,
        current: 0 // Reset current progress when target is reassigned? 
                   // Usually keep it, but user might want a fresh start
      },
      { upsert: true, new: true }
    );

    res.json(updatedTarget);
  } catch (error) {
    console.error("Assign target error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📊 GET ALL TARGETS (ADMIN + USER)
 */
export const getTargets = async (req, res) => {
  try {
    const query = {};

    // admin sees all, others see only theirs
    if (req.user.role !== "admin") {
      query.userId = req.user.id;
    }

    const targets = await Target.find(query)
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(targets);
  } catch (error) {
    console.error("Get targets error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔥 AUTO UPDATE PROGRESS (FOR LEADS ETC)
 */
export const updateTargetProgress = async (req, res) => {
  try {
    const { userId, type, increment = 1 } = req.body;

    const updated = await Target.findOneAndUpdate(
      { userId, type },
      { $inc: { current: increment } },
      { new: true }
    );

    res.json({ success: true, updated });
  } catch (error) {
    console.error("Update target progress error:", error);
    res.status(500).json({ message: error.message });
  }
};