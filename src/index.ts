import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import dailyLogRoutes from "./routes/dailyLogRoutes";
import vaccineAlertRoutes from "./routes/vaccineAlertRoutes";
import animalRoutes from "./routes/animalRoutes";
import calvingRoutes from "./routes/calvingRoutes";
import roiRoutes from "./routes/roiRoutes";
import weightScheduleRoutes from "./routes/weightScheduleRoutes";
import adminRoutes from "./routes/adminRoutes";
import publicRoutes from "./routes/publicRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smartkhamar";

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000").split(",").map(s => s.trim());
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/daily-logs", dailyLogRoutes);
app.use("/api/vaccines", vaccineAlertRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/calving", calvingRoutes);
app.use("/api/roi", roiRoutes);
app.use("/api/weight-schedule", weightScheduleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api", (_req, res) => {
  res.json({
    message: "SmartKhamar AI API",
    version: "1.0.0",
    endpoints: ["/api/auth", "/api/animals", "/api/daily-logs", "/api/vaccines", "/api/calving", "/api/roi", "/api/weight-schedule", "/api/admin", "/api/health"],
  });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
