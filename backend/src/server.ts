import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import express, { Request, Response, NextFunction, Application } from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import { globalErrorHandler } from "./middleware/errorMiddleware";

// Load environment variables
dotenv.config();

// Initialize the Express Application
const app: Application = express();

// Determine configuration values
const PORT = process.env.PORT || 5000;

// Security Middleware (Helmet sets HTTP headers for securing Express applications)
app.use(helmet());

// Cross-Origin Resource Sharing settings
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permit requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    } else {
      return callback(new Error("CORS Policy: Access forbidden from this origin"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));

// Parsing incoming Request payloads (JSON and URL-encoded limits set safely)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Route handlers API registrations
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/settings", settingsRoutes);

// Basic Server Health Check Verification Endpoint
app.get("/health", (_req: Request, res: Response) => {
  const connectionStates = ["Disconnected", "Connected", "Connecting", "Disconnecting"];
  const isOk = mongoose.connection.readyState;
  const dbStatus = connectionStates[isOk] || "Unknown";

  res.status(200).json({
    status: "Healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbStatus,
      serverNode: "Online"
    }
  });
});

// Fallback Route handling for undefined routes (404 Error handler payload)
app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: "Specified resource not found",
    suggestion: "Please check your endpoint parameters or method action"
  });
});

// Global Error Catchment Middleware System
app.use(globalErrorHandler);

// Connect database securely
connectDB();

// Start Server connection listener
const server = app.listen(PORT, () => {
  console.log(`[PublisherCMS Backend Server] Running successfully on port ${PORT}`);
  console.log(`[Health Verification Endpoint] Visit http://localhost:${PORT}/health to verify`);
});

// Graceful shut down hook signals
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Starting graceful shutdown process...");
  server.close(() => {
    console.log("Database connections and HTTP server closed safely.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down server socket...");
  server.close(() => {
    process.exit(0);
  });
});
