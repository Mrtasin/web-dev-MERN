import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`MongoDB connection error :- ${error.message}`);
    process.exit(0);
  }
};

export default connectDB;
