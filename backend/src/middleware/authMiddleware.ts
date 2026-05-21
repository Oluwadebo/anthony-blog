// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../utils/auth";

const JWT_SECRET = process.env.JWT_SECRET || "quick_wash_secret_9";

// Extend Express Request object interface to hold authenticated user context info
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Access Denied: Authorization Header is missing"
      });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        error: "Access Denied: Invalid Authorization token format. Must be Bearer Token."
      });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // Attach validated payload token context records
    req.user = decoded;
    
    return next();
  } catch (error: any) {
    console.error("Authentication Middleware Error Verification:", error.message);
    return res.status(401).json({
      success: false,
      error: "Access Denied: Token validation failed or has expired"
    });
  }
};
