// backend/src/utils/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "quick_wash_secret_9";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};
