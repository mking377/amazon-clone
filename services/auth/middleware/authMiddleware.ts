// services/auth/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// 👇 نوسع الـ Request Interface عشان نضيف req.user
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

// 👇 هنا هنحدد إيه اللي جوه التوكن
interface JwtPayload extends DefaultJwtPayload {
  id: string;
  email: string;
  role: string;
}

// Middleware للتحقق من التوكن
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Auth Header:", authHeader); // ✅ اطبع الهيدر

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token found in Authorization header");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token); // ✅ اطبع التوكن

    // ✅ فك التوكن بالسر الصحيح
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log("Decoded JWT payload:", decoded);

    // ✅ خزن البيانات جوه req.user
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

