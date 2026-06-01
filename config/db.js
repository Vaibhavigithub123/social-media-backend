//mongodb connection
const mongoose = require("mongoose");

const connectDb = async () => {
  //Added check to ensure MONGO_URI is defined in environment variables
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Mongodb connection failed", err.message);
  }
};

module.exports = connectDb;
