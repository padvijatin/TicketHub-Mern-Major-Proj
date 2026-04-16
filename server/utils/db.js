const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const mongoUri = String(process.env.MONGODB_URI || "").trim();
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured");
    }

    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
