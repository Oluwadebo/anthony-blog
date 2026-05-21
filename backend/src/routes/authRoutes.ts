// backend/src/routes/authRoutes.ts
import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

// POST /login - Authenticate credentials and return JWT
router.post("/login", login);

export default router;
