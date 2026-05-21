// backend/src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);

// Zod Validation Schema for Login Inputs
export const loginInputSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
