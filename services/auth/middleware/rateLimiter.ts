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

/*

// services/auth/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";

// login limiter
export const loginLimiter = (locale: string) =>
  rateLimit({
    windowMs: parseInt(process.env.LOGIN_WINDOW_MS || "900000"), // 15 دقيقة
    max: parseInt(process.env.LOGIN_MAX_ATTEMPTS || "5"),
    handler: (req, res) => {
      const t = getTranslations(locale);
      return res.status(429).json({
        error: t("rateLimit.tooManyLogin"),
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// forgot password limiter
export const forgotPasswordLimiter = (locale: string) =>
  rateLimit({
    windowMs: parseInt(process.env.FORGOT_WINDOW_MS || "900000"), // 15 دقيقة
    max: parseInt(process.env.FORGOT_MAX_ATTEMPTS || "3"),
    handler: (req, res) => {
      const t = getTranslations(locale);
      return res.status(429).json({
        error: t("rateLimit.tooManyForgot"),
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// reset password limiter
export const resetPasswordLimiter = (locale: string) =>
  rateLimit({
    windowMs: parseInt(process.env.RESET_WINDOW_MS || "900000"), // 15 دقيقة
    max: parseInt(process.env.RESET_MAX_ATTEMPTS || "5"),
    handler: (req, res) => {
      const t = getTranslations(locale);
      return res.status(429).json({
        error: t("rateLimit.tooManyReset"),
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

*/


/*

import rateLimit from "express-rate-limit";

// rate limiter للـ login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 محاولات فقط
  message: {
    error: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// rate limiter للـ forgot-password
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // 3 محاولات فقط
  message: {
    error: "Too many password reset requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
*/
