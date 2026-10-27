import mongoose from "mongoose";
import dotenv from "dotenv";
import { log } from "node:console";

export const connectDB = async () => {
  try {
    let DB_CONNECTION_STRING = "";
    if (process.env.NODE_ENV === "development") {
      DB_CONNECTION_STRING = process.env.MONGO_LOCAL_URI!;
    }
    if (process.env.NODE_ENV === "production") {
      DB_CONNECTION_STRING = process.env.MONGO_URI!;
    }

    const dbResp = await mongoose.connect(DB_CONNECTION_STRING);
    console.log("Database connected", dbResp.connection.host);
  } catch (error) {
    console.log("DB connection error", error);
    process.exit(1);
  }
};
