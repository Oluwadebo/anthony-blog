// backend/src/models/Post.ts
import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export interface IPost extends Document {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  status: "published" | "draft" | "paused";
  likes: number;
  dislikes: number;
  views: number;
  readTime: string;
  author: string;
  authorImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "TECHNOLOGY",
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["published", "draft", "paused"],
      default: "draft",
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      required: true,
      default: "3 min read",
    },
    author: {
      type: String,
      required: true,
      default: "Elena Vance",
    },
    authorImage: {
      type: String,
      required: true,
      default: "https://lh3.googleusercontent.com/aida-public/AB6AXuArimo4U5FgI8lcu6b2F4pc2-CZ_jdsdQgv-gwZ-oEp3MHkTyhNMm7fAJklekM1AEfjaTXCtuGmft-MkniU3GpP8RYPj9MDBSOjWOTFhtgvvTgHEA7pkTQGRugCJYrgSq8xMn_zK850eP5GXqSmS5_54fa6WjniUYM_yIU0ezgwUnK7k0bZ_VianTIl6B-Fu081h3cgnpSWQOQsoecapKFwNSE9Sb3EeuXeV6JS-C-XL7l09vD033ZIwFDQKGUfOzMq8XS6fr9xXna_",
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);

// Zod schema for input validation on post creation and updating
export const createPostInputSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters long" }),
  imageUrl: z.string().url({ message: "Invalid image URL format" }),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["published", "draft", "paused"]).optional(),
  readTime: z.string().optional(),
  author: z.string().optional(),
  authorImage: z.string().optional(),
});

export const updatePostInputSchema = createPostInputSchema.partial();
