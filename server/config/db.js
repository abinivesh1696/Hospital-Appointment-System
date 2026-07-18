const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI is not set. Skipping MongoDB connection.");
      return false;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed. Starting API without a database connection.");
    console.error(error.message);
    return false;
  }
};

module.exports = connectDB;