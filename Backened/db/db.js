import mongoose from "mongoose";

const connectDB = async () => {


  //pASSWORD   : qyUukG3A6Ab9k2Uj
  try {
    if (!process.env.MONGODB_URL) {
      console.warn("MONGODB_URL is not defined in environment variables!");
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

export default connectDB;