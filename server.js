import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import dotenv from 'dotenv';
import todoRoutes from "./routes/todoRoutes.js"

dotenv.config(); // Load environment variables

const app = express();

app.use(express.json()); // Middleware to parse JSON
app.use("/api/auth", authRoutes); // Use auth routes
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
