import express from "express";

import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("REDIS_URL is not defined in environment variables");
  process.exit(1);
}
export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  });

await connectDB();
const app = express();

// Basic root route to verify server is working
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
