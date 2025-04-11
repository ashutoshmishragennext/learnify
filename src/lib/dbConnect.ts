import mongoose from 'mongoose';
// import dotenv from "dotenv";

// dotenv.config({ path: '.env.local' });

const MONGO_URI: string = process.env.MONGO_URI || "random String";

if (MONGO_URI === "random String") {
  throw new Error("Define MongoDB connection string properly.");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Database Connected with ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
};

export default connectDB;
