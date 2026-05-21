// backend/src/models/Settings.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    siteName: {
      type: String,
      required: true,
      default: "Anthony Blog",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
