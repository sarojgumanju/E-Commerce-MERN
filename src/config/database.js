import config from "./config.js"
import mongoose from "mongoose";

async function connectDB() {
  await mongoose.connect(config.mongodbUrl).then(() => {
    console.log("MongoDB connected successfully!");
  }).catch((error) => {
    console.log(error);
  });
}

export default connectDB;
