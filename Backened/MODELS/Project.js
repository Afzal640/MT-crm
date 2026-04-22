import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    clientName: String,
    service: String,

   assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    deadline: Date,

    status: {
      type: String,
      enum: ["not-started", "in-progress", "review", "completed"],
      default: "not-started"
    },

    progress: {
      type: Number,
      default: 0
    },

   files: [
  {
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
]
  })

export default mongoose.model("Project", projectSchema);