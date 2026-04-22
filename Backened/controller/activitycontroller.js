import Activity from "../MODELS/activity.js";
import Target from "../MODELS/target.js";

// GET ALL ACTIVITIES (Admin sees all, Sales see only theirs)
export const getActivities = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query = { createdBy: req.user.id };
    }

    const activities = await Activity.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching activities" });
  }
};

// CREATE ACTIVITY
export const createActivity = async (req, res) => {
  try {
    const user = req.user;
    const activity = await Activity.create({
      ...req.body,
      createdBy: user.id
    });

    // 🔥 AUTOMATIC TARGET UPDATE
    if (user.role === "sales") {
      let targetType = "followups";
      if (activity.type === "call") targetType = "calls";
      if (activity.type === "meeting") targetType = "meetings";

      await Target.findOneAndUpdate(
        { userId: user.id, period: "daily", type: targetType },
        { $inc: { current: 1 }, $setOnInsert: { target: 10 } },
        { upsert: true }
      );
    }

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ msg: "Error creating activity" });
  }
};