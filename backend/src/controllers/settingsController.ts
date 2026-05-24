// backend/src/controllers/settingsController.ts
import { Request, Response } from "express";
import { SiteSettings } from "../models/Settings";
import { z } from "zod";

const settingsUpdateSchema = z.object({
  siteName: z
    .string()
    .min(1, { message: "Site Name must contain at least 1 character" })
    .max(100, { message: "Site Name cannot exceed 100 characters" }),
});

/**
 * GET /api/settings
 * Fetch the current site settings. Creates default settings if none exist.
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings({ siteName: "Anthony Blog" });
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("Error in getSettings controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve site settings",
      details: error.message,
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const validationResult = settingsUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Input validation failed for site settings",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { siteName } = validationResult.data;

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings({ siteName });
    } else {
      settings.siteName = siteName;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Site configurations updated successfully",
      settings,
    });
  } catch (error: any) {
    console.error("Error in updateSettings controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update site settings",
      details: error.message,
    });
  }
};
