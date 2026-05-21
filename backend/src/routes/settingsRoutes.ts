// backend/src/routes/settingsRoutes.ts
import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// GET / - Retrieve site settings details
router.get("/", getSettings);

// PUT / - Update site settings (requires Admin authentication)
router.put("/", authMiddleware, updateSettings);

export default router;
