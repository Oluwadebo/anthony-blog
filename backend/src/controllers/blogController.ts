// backend/src/controllers/blogController.ts
import { Request, Response } from "express";
import { Post, createPostInputSchema, updatePostInputSchema } from "../models/Post";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

/**
 * @desc    Create a new blog post
 * @route   POST /api/blogs
 * @access  Private (Admin/Editor)
 */
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Validate inputs using Zod
    const validationResult = createPostInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Post validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const {
      title,
      description,
      content,
      imageUrl,
      category,
      tags,
      status,
      readTime,
      author,
      authorImage,
    } = validationResult.data;

    // 2. Build and save the post
    const newPost = new Post({
      title,
      description,
      content,
      imageUrl,
      category: category || "TECHNOLOGY",
      tags: tags || [],
      status: status || "draft",
      readTime: readTime || "3 min read",
      author: author || "Elena Vance",
      authorImage: authorImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuArimo4U5FgI8lcu6b2F4pc2-CZ_jdsdQgv-gwZ-oEp3MHkTyhNMm7fAJklekM1AEfjaTXCtuGmft-MkniU3GpP8RYPj9MDBSOjWOTFhtgvvTgHEA7pkTQGRugCJYrgSq8xMn_zK850eP5GXqSmS5_54fa6WjniUYM_yIU0ezgwUnK7k0bZ_VianTIl6B-Fu081h3cgnpSWQOQsoecapKFwNSE9Sb3EeuXeV6JS-C-XL7l09vD033ZIwFDQKGUfOzMq8XS6fr9xXna_",
    });

    const savedPost = await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Blog post scaffolding created successfully",
      data: savedPost,
    });
  } catch (error: any) {
    console.error("Create Post Controller Error Exception:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred during creation of the blog post.",
    });
  }
};

/**
 * @desc    Get all blog posts (Public returns published only, Admin retrieves all matching status or state)
 * @route   GET /api/blogs
 * @access  Public / Private conditional
 */
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { status, category, tag } = req.query;
    
    // Build query criteria filter parameters
    const query: any = {};

    // Standard public access restricts results to published stories by default
    // unless designated override parameters or custom secure actions are given.
    if (status === "all") {
      // Allow fetching all statuses (for Admin views)
    } else if (status && ["published", "draft", "paused"].includes(status as string)) {
      query.status = status;
    } else {
      query.status = "published";
    }

    if (category) {
      query.category = (category as string).toUpperCase();
    }

    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error: any) {
    console.error("Get All Posts Controller Error Exception:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while fetching content updates.",
    });
  }
};

/**
 * @desc    Get singular blog post details by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Direct find and dynamic view increments
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
        suggestion: "Please double check the ID parameter sequence",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    console.error("Get Post By ID Controller Error Exception:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Blog Post Object ID structure",
      });
    }
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while loading post information details.",
    });
  }
};

/**
 * @desc    Update a blog post
 * @route   PUT /api/blogs/:id
 * @access  Private (Admin/Editor)
 */
export const updatePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Validate update content with partial validation
    const validationResult = updatePostInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Update input fields validation failed",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    // 2. Find and update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: validationResult.data },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post successfully updated",
      data: updatedPost,
    });
  } catch (error: any) {
    console.error("Update Post Controller Error Exception:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Blog Post Object ID structure",
      });
    }
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred during backend post update modifications.",
    });
  }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blogs/:id
 * @access  Private (Admin/Editor)
 */
export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found for deletion",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post template permanently removed from server nodes",
      data: { id },
    });
  } catch (error: any) {
    console.error("Delete Post Controller Error Exception:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Blog Post Object ID structure",
      });
    }
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred during deletion of post records.",
    });
  }
};
