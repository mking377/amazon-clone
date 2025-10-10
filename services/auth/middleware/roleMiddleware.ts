// services/auth/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";

// Middleware للتحقق من الدور
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};

/*

// services/auth/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";

// Middleware للتحقق من الدور
export const requireRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};

*/
