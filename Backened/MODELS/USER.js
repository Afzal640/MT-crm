import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "sales", "production"],
    default: "sales",
  },

  status: {
  type: String,
  enum: ["not-started", "in-progress", "review", "completed"],
  default: "not-started"
}
});

export default mongoose.model("User", userSchema);
