import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});
// require('dotenv').config({path:'./env'})

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🔧 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Database connection error!!", err));
