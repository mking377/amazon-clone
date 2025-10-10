import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret";


// ✅ إنشاء Access Token (قصير العمر)

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15m", // صلاحية قصيرة
  });
}


// ✅ إنشاء Refresh Token (أطول عمر)
 
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d", // أسبوع
  });
}


// ✅ التحقق من Access Token
 
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}


// ✅ التحقق من Refresh Token
 
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/*

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret";

// access token (قصير العمر)
export function generateAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "15m" });
}

// refresh token (أطول عمر)
export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { algorithm: "HS256", expiresIn: "7d" });
}

// للتحقق من refresh token
export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as any;
  } catch {
    return null;
  }
}

*/
