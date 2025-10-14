// services/auth/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import superAdminRoutes from "./routes/superAdminRoutes";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  })
);
app.use(express.json());
app.use(cookieParser());


/*
// ✅ Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // لازم عشان الكوكيز cross-site
  })
);
app.use(express.json());
app.use(cookieParser());

*/

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/superadmin", superAdminRoutes);

// ✅ Route للتجربة
app.get("/test", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Server is running!" });
});

// ✅ اتصال MongoDB
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not found in .env");
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
})();

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

