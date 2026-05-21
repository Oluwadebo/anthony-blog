// backend/src/routes/mediaRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { uploadImage } from "../controllers/mediaController";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import multer from "multer";

const router = Router();

// POST /upload - Upload a single image to the cloud. Protected via authMiddleware.
router.post(
  "/upload",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    // Intercept multer-specific errors to return client-friendly JSON responses
    upload.single("image")(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Handle specific errors originating from Multer itself (e.g., file size limit exceeded)
        return res.status(400).json({
          success: false,
          error: `Multer configuration exception: ${err.message}`,
          code: err.code,
        });
      } else if (err) {
        // Handle custom validation exceptions thrown from our file filter
        return res.status(400).json({
          success: false,
          error: err.message || "An unexpected validation exception arose during file ingestion.",
        });
      }
      return next();
    });
  },
  uploadImage
);

export default router;
