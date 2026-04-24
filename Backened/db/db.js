import mongoose from "mongoose";

const connectDB = async () => {
  // Aapka asli Connection String
  const dbURI = "mongodb+srv://muhammad64078_db_user:qyUukG3A6Ab9k2Uj@cluster0.yil7zff.mongodb.net/crm";

  try {
    // Humne direct dbURI variable pass kiya hai
    await mongoose.connect(dbURI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error ❌:", error.message);
    process.exit(1); // Error aane par process ko stop kar dega
  }
};

export default connectDB;