require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB Atlas via Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  }
};

module.exports = { mongoose, connectDB };
