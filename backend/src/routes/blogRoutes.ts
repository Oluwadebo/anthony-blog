// backend/src/routes/blogRoutes.ts
import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/blogController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// GET / - Retrieve published/queried blog posts for public or internal consumption
router.get("/", getAllPosts);

// GET /:id - Retrieve single blog post details and increment viewership count
router.get("/:id", getPostById);

// POST / - Create a fresh blog content scaffolding (requires Admin/Editor session headers)
router.post("/", authMiddleware, createPost);

// PUT /:id - Modify post parameters, status transitions, or edit prose
router.put("/:id", authMiddleware, updatePost);

// DELETE /:id - Permanently erase post asset references from cloud persistence
router.delete("/:id", authMiddleware, deletePost);

export default router;
