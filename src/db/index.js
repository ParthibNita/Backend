import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `database connected!! DB host : ${connectionInstance.connection.host}`
    );
    // console.log(`Connected to DB: ${connectionInstance.connection.name}`);
    // console.log(`Port: ${connectionInstance.connection.port}`);
    // console.log(
    //   `Connection state: ${connectionInstance.connection.readyState}`
    // );
  } catch (error) {
    console.log("DB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
