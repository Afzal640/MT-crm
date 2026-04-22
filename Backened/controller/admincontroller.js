import User from "../MODELS/USER.js";
import Lead from "../MODELS/leads.js";
import Target from "../MODELS/target.js";

export const getTeamReport = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const leads = await Lead.find();

    const closedWonLeads = leads.filter(l => l.status === "closed-won");

    const totalRevenue = closedWonLeads.reduce((sum, l) => {
      return sum + Number(l.budget ?? 0);
    }, 0);

    res.json({
      totalUsers: users.length,
      totalLeads: leads.length,
      totalDeals: closedWonLeads.length,
      totalRevenue,
      teamMembers: users
    });

  } catch (err) {
    console.error("🔥 Team report error:", err);
    res.status(500).json({ message: err.message });
  }
};