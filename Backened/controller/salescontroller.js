import Lead from "../MODELS/leads.js";
import Activity from "../MODELS/activity.js";

export const getSalesDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const leads = await Lead.countDocuments({ assignedTo: userId });
    const deals = await Lead.countDocuments({
      assignedTo: userId,
      status: "closed-won"
    });

    const activities = await Activity.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        leads,
        deals,
        followups: 5
      },
      chart: [
        { month: "Jan", deals: 2 },
        { month: "Feb", deals: 4 }
      ],
      recentActivities: activities
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching dashboard data" });
  }
};