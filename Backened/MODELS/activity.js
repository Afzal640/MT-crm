import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["call", "email", "meeting", "message"],
    required: true
  },
  clientName: String,
  company: String,
  date: String,
  time: String,
  notes: String,
  outcome: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Activity", activitySchema);