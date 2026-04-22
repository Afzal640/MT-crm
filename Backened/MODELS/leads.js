import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  clientName: String,
  contactPerson: String,
  email: String,
  phone: String,

  service: String,
  budget: String,
  deadline: String,
  source: String,
  notes: String,

  status: {
    type: String,
    enum: ["new", "discussing", "proposal", "negotiation", "closed-won", "closed-lost"],
    default: "new"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Lead", leadSchema);