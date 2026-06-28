require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");
const taskRoutes = require("./src/routes/taskRoutes");
const habitRoutes = require("./src/routes/habitRoutes");
const authRoutes = require("./src/routes/authRoutes");
const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});