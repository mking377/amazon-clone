// services/auth/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";

// login limiter
export const loginLimiter = () =>
  rateLimit({
    windowMs: parseInt(process.env.LOGIN_WINDOW_MS || "900000"), // 15 دقيقة
    max: parseInt(process.env.LOGIN_MAX_ATTEMPTS || "5"),
    handler: (_req, res) => {
      return res.status(429).json({
        error: "rateLimit.tooManyLogin", // المفتاح فقط
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// forgot password limiter
export const forgotPasswordLimiter = () =>
  rateLimit({
    windowMs: parseInt(process.env.FORGOT_WINDOW_MS || "900000"), // 15 دقيقة
    max: parseInt(process.env.FORGOT_MAX_ATTEMPTS || "3"),
    handler: (_req, res) => {
      return res.status(429).json({
        error: "rateLimit.tooManyForgot", // المفتاح فقط
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// reset password limiter
export const resetPasswordLimiter = () =>
  rateLimit({
    windowMs: parseInt(process.env.RESET_WINDOW_MS || "900000"), // 15 دقيقة
    max: parseInt(process.env.RESET_MAX_ATTEMPTS || "5"),
    handler: (_req, res) => {
      return res.status(429).json({
        error: "rateLimit.tooManyReset", // المفتاح فقط
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

