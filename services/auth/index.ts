// services/auth/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import superAdminRoutes from "./routes/superAdminRoutes";

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET as string;


const app = express();
const PORT = process.env.PORT || 4000;
console.log("===== DEBUG Node JWT_SECRET =====", JSON.stringify(process.env.JWT_SECRET));
console.log("Length:", process.env.JWT_SECRET?.length);
console.log("Node secret hex:", Buffer.from(JWT_SECRET).toString("hex"));
// ✅ Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // لازم عشان الكوكيز cross-site
  })
);
app.use(express.json());
app.use(cookieParser());

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

/*

// services/auth/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import profileRoutes from "./user/profile";
import authRoutes from "./routes/auth";
import superAdminRoutes from "./routes/superAdminRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // لازم عشان الكوكيز cross-site
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/superadmin", superAdminRoutes);
app.use("/auth/profile", profileRoutes);

// ✅ Route للتجربة
app.get("/test", function (_req: Request, res: Response) {
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


*/

/*
// services/auth/index.ts
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import superAdminRoutes from "./routes/superAdminRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // لازم عشان الكوكيز cross-site
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/superadmin", superAdminRoutes);


// ✅ Start server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
/*
// services/auth/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import superAdminRoutes from "./routes/superAdminRoutes";
dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // بديل body-parser.json()
app.use("/superadmin", superAdminRoutes);

*

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
    process.exit(1); // خروج لو فشل الاتصال
  }
})();

// ✅ ربط الراوتر
app.use("/auth", authRoutes);

// ✅ Route للتجربة
app.get("/test", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Server is running!" });
});


*/
/*

// services/auth/index.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ اتصال MongoDB
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("❌ MONGO_URI not found in .env");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ ربط الراوتر
app.use("/auth", authRoutes);

app.get("/test", (_, res) => res.json({ success: true, message: "Server is running!" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Auth server running on port ${PORT}`));

*/


/*

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ اتصال MongoDB
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not found in .env");
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ تعريف الـ User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Secret key للـ JWT
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// ✅ Register Route
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // هل الإيميل موجود بالفعل؟
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// ✅ Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // إنشاء JWT
    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ Test Route
app.get("/test", (req, res) => {
  res.json({ success: true, message: "Server is running!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});






*/



/*

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
});
/*

// اتصال PostgreSQL عبر Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // ضروري للاتصال بـ Supabase
});

*

// Secret key للـ JWT
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// ✅ Register Route
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // هل الإيميل موجود بالفعل؟
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // تخزين المستخدم
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// ✅ Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // إنشاء JWT
    const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ Test Route للتأكد من الاتصال بـ Supabase
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});


*/



/*



import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// اتصال PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
});

// Secret key للـ JWT
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// ✅ Register Route
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // هل الإيميل موجود بالفعل؟
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // تخزين المستخدم
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// ✅ Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // إنشاء JWT
    const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.listen(4000, () => {
  console.log("Auth running on 4000");
});


*/


/*
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "super_secret_key"; // غيرها بمفتاح أقوى

// ✅ Register
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(4000, () => {
  console.log("✅ Auth service running on http://localhost:4000");
});






*/

/*


import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Secret key للـ JWT
const JWT_SECRET = "mysecretkey";

// Array مؤقت لتخزين المستخدمين
const users: { name: string; email: string; password: string }[] = [];

// ✅ Register Route
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // هل الإيميل موجود بالفعل؟
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // تخزين المستخدم
    users.push({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// ✅ Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // إنشاء JWT
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

app.listen(4000, () => {
  console.log("Auth running on 4000");
});

*/

/*


import express from "express";
const app = express();
app.get("/", (req,res)=> res.send("Hello from Auth Service (Node + TS)"));
app.listen(4000, ()=> console.log("Auth running on 4000"));

*/
