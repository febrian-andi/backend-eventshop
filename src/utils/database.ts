import mongoose from "mongoose";
import { DATABASE_URL, DB_NAME } from "./env";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: DB_NAME,
    });
    return Promise.resolve("Database connected successfully");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  connect,
};
