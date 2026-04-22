import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true
  },
  name: String,
  url: String,
  size: String,
  uploadedBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("File", fileSchema);
