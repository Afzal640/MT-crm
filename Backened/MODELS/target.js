import mongoose from "mongoose";

const targetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    period: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },

    type: {
      type: String,
      enum: ["leads", "deals", "revenue", "followups", "calls", "meetings"],
      required: true,
    },

    target: {
      type: Number,
      required: true,
    },

    current: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Target", targetSchema);