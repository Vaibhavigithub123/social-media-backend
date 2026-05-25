//mongodb connection
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Mongodb connection failed", err.message);
  }
};

module.exports = connectDb;
