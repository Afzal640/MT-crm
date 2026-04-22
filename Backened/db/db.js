import mongoose from "mongoose";

const connectDB = async () => {


  //pASSWORD   : qyUukG3A6Ab9k2Uj
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;