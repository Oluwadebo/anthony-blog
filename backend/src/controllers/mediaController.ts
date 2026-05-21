// backend/src/controllers/mediaController.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

/**
 * Helper function to pipe an in-memory buffer straight to Cloudinary via streams
 */
const streamUploadToCloudinary = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "publishercms_assets",
        resource_type: "image",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error || new Error("Failed to capture image response metadata from Cloudinary."));
        }
      }
    );

    // End stream by writing buffer content securely
    uploadStream.end(fileBuffer);
  });
};

/**
 * @desc    Upload single image asset to CDN Cloudinary
 * @route   POST /api/media/upload
 * @access  Private (Admin/Editor)
 */
export const uploadImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Ensure file stream was parsed by Multer successfully
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Missing image file",
        suggestion: "Please provide a valid multi-part form-data file attached to your request",
      });
    }

    console.log(
      `[Media Controller] Commencing upload for file: ${req.file.originalname} (${req.file.mimetype})`
    );

    // 2. Perform upload process through memory stream
    const uploadResult = await streamUploadToCloudinary(req.file.buffer);

    // 3. Return successfully generated secure CDN URL references
    return res.status(200).json({
      success: true,
      message: "Media asset loaded and registered successfully",
      data: {
        originalName: req.file.originalname,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error: any) {
    console.error("[Media Upload Component Severe Error Exception]:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while transferring media assets to cloud nodes.",
      details: error.message || error,
    });
  }
};
