// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import { loginInputSchema } from "../models/User";
import { User } from "../models/User";
import { comparePassword, generateToken } from "../utils/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ogunwedebo21@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ogunwedebo21";

export const login = async (req: Request, res: Response) => {
  try {
    // 1. Validate incoming inputs against the input strict Zod schema
    const validationResult = loginInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Input validation failed",
        details: validationResult.error.flatten().fieldErrors
      });
    }

    const { email, password } = validationResult.data;

    // Check with direct seeded admin first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Admin seeded tokens generated instantly!
      const token = generateToken({
        userId: "seeded-admin-id",
        email: ADMIN_EMAIL,
        role: "admin"
      });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully as Admin (Seeded Environment Reference)",
        token,
        user: {
          email: ADMIN_EMAIL,
          role: "admin"
        }
      });
    }

    // 2. Query MongoDB database for users matching login address
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Access Denied: Invalid email address or secure passkey"
      });
    }

    // 3. Verify security passwords
    const isMatched = await comparePassword(password, user.passwordHash);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        error: "Access Denied: Invalid email address or secure passkey"
      });
    }

    // 4. Generate 1 hour authenticated session tokens
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return res.status(200).json({
      success: true,
      message: "Session authenticated successfully",
      token,
      user: {
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error("Login Controller Error Handler:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred during user authentication processing."
    });
  }
};
