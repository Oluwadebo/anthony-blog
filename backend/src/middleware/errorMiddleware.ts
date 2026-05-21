// backend/src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";

/**
 * Global Error-Handling Middleware System
 * Catches all unhandled promise rejections, Route level throws, and operational exceptions.
 * Prevents system credential and environment details disclosure by sanitizing responses in production.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  // Track precise error trace internally on the server nodes
  console.error(`[Error Handler Exception]: ${err.message || err}`);
  if (err.stack) {
    console.error(err.stack);
  }

  // Determine standard response code parameters
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;

  // Build clean, production-ready standardized response model
  return res.status(statusCode).json({
    success: false,
    error: isProduction ? "Internal Server Error" : err.message || "An unexpected error occurred.",
    message: isProduction ? "Our publishing backend service experienced an unhandled error event." : err.message || "Internal Server Error",
    ...(isProduction ? {} : { stack: err.stack, details: err }),
    timestamp: new Date().toISOString(),
  });
};
