import Lead from "../MODELS/leads.js";
import Target from "../MODELS/target.js";
import Activity from "../MODELS/activity.js";
import User from "../MODELS/USER.js";

// ✅ GET LEADS
export const getLeads = async (req, res) => {
  try {
    const user = req.user;
    let leads;

    if (user.role === "admin") {
      leads = await Lead.find()
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    } else if (user.role === "sales") {
      leads = await Lead.find({
        $or: [{ assignedTo: user._id }, { createdBy: user._id }]
      })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    } else {
      leads = [];
    }
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE LEAD
export const createLead = async (req, res) => {
  try {
    const user = req.user;
    const leadData = {
      ...req.body,
      createdBy: user._id,
    };

    if (user.role === "sales") {
      leadData.assignedTo = user._id;
    }

    const lead = await Lead.create(leadData);

    // 🔔 Auto-log a notification activity so admin sees it in the feed
    await Activity.create({
      type: "message",
      clientName: lead.clientName,
      company: lead.contactPerson || lead.clientName,
      notes: `New lead "${lead.clientName}" was added by ${user.name || "a team member"}. Service: ${lead.service || "N/A"}. Budget: ${lead.budget || "N/A"}. Status: ${lead.status || "new"}.`,
      outcome: "Lead Created",
      createdBy: user._id,
    });

    // 🔥 Update Target Progress
    if (user.role === "sales") {
      await Target.findOneAndUpdate(
        { userId: user._id, period: "daily", type: "leads" },
        { $inc: { current: 1 }, $setOnInsert: { target: 10 } },
        { upsert: true }
      );
    }

    // Return populated lead
    const populatedLead = await Lead.findById(lead._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json(populatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const oldLead = await Lead.findById(req.params.id);
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    // 🔥 Target Progress for Deals & Revenue
    if (req.user.role === "sales" && req.body.status === "closed-won" && oldLead.status !== "closed-won") {
      const revenueValue = lead.value || 0;
      
      await Target.findOneAndUpdate(
        { userId: req.user._id, period: "monthly", type: "deals" },
        { $inc: { current: 1 }, $setOnInsert: { target: 5 } },
        { upsert: true }
      );

      if (revenueValue > 0) {
        await Target.findOneAndUpdate(
          { userId: req.user._id, period: "monthly", type: "revenue" },
          { $inc: { current: revenueValue }, $setOnInsert: { target: 50000 } },
          { upsert: true }
        );
      }
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
