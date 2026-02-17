import express from "express";

import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.js";

dotenv.config();

await connectDB();
const app = express();

// Basic root route to verify server is working
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(express.json());

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
