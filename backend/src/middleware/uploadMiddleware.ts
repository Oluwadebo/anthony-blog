// backend/src/middleware/uploadMiddleware.ts
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// Store file streams securely in-memory as Buffers before pushing to Cloudinary
const storage = multer.memoryStorage();

// Supported image formats
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    // Standard file validation passes!
    callback(null, true);
  } else {
    // Return structured exception rejecting unexpected file signatures
    callback(new Error("Invalid file format. Only JPEG, PNG, WebP, and GIF image files are allowed."));
  }
};

// Set file upload configurations keeping streams bounded safely
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Bounded at a maximum size of 5MB
  },
});
