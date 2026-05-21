// backend/src/scripts/seedAdmin.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { SiteSettings } from "../models/Settings";
import { hashPassword } from "../utils/auth";
import { connectDB } from "../config/db";

// Load environment configurations
dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ogunwedebo21@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ogunwedebo21";

/**
 * CLI database seeding script for initializing administrative credentials
 */
export const seedAdmin = async (): Promise<void> => {
  console.log("[Seeder Script]: Commencing administrative account verification...");

  // 1. Establish database connection link
  const connection = await connectDB();
  if (!connection) {
    console.error("[Seeder Script Aborted]: Database connection could not be established.");
    process.exit(1);
  }

  try {
    // 2. Query check for pre-existing accounts matching configuration
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`[Seeder Script Bypass]: Administrative account already exists for ${ADMIN_EMAIL}.`);
    } else {
      console.log(`[Seeder Script Ingestion]: No admin account found for ${ADMIN_EMAIL}. Generating hashed credentials...`);
      
      // 3. Encrypt target password using safe crypt salts
      const passwordHash = await hashPassword(ADMIN_PASSWORD);

      // 4. Save administrator specifications securely
      const adminUser = new User({
        email: ADMIN_EMAIL,
        passwordHash,
        role: "admin"
      });

      await adminUser.save();
      console.log(`[Seeder Script Success]: Administrative account generated successfully for: ${ADMIN_EMAIL}`);
    }

    // 4.5. Seed Default Site settings if missing
    const existingSettings = await SiteSettings.findOne();
    if (existingSettings) {
      console.log(`[Seeder Script Bypass]: Site settings already initialized with name: "${existingSettings.siteName}"`);
    } else {
      console.log(`[Seeder Script Ingestion]: Default site settings not found. Seeding Initial configuration...`);
      const defaultSettings = new SiteSettings({ siteName: "Anthony Blog" });
      await defaultSettings.save();
      console.log(`[Seeder Script Success]: Site settings seeded successfully with default site name: "Anthony Blog"`);
    }
  } catch (error: any) {
    console.error(`[Seeder Script Exception]: An error arose during admin seeding tasks: ${error.message || error}`);
  } finally {
    // 5. Clean disconnect
    await mongoose.disconnect();
    console.log("[Seeder Script Terminal]: Database connection closed gracefully.");
  }
};

// Expose CLI runnable execution trigger direct to process shell calls if called as entry point
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log("[Seeder Script Completed successfully]");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Seeder Script Failed severely]:", err);
      process.exit(1);
    });
}
