// /app/admin/posts/create/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Heading, 
  FileText, 
  Tag, 
  Image as ImageIcon,
  BookOpen,
  User,
  Heart
} from "lucide-react";
import { api } from "../../../../lib/api";

interface BlogPayload {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  status: "published" | "draft" | "paused";
  readTime: string;
  author: string;
}

export default function CreateOrEditPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isEditMode = !!postId;

  // Form Fields holding state
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [category, setCategory] = React.useState("TECHNOLOGY");
  const [tagsInput, setTagsInput] = React.useState("");
  const [status, setStatus] = React.useState<"published" | "draft" | "paused">("draft");
  const [readTime, setReadTime] = React.useState("3 min read");
  const [author, setAuthor] = React.useState("Elena Vance");

  // Media upload tracking states
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  // General execution indicators
  const [isPageLoading, setIsPageLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // If in Edit Mode, fetch post information on load
  React.useEffect(() => {
    if (isEditMode && postId) {
      const loadPostInformation = async () => {
        try {
          setIsPageLoading(true);
          setErrorMessage(null);
          
          const response = await api.get<any>(`/blogs/${postId}`);
          
          if (response && response.data) {
            const data = response.data;
            setTitle(data.title || "");
            setDescription(data.description || "");
            setContent(data.content || "");
            setImageUrl(data.imageUrl || "");
            setImagePreview(data.imageUrl || null);
            setCategory(data.category || "TECHNOLOGY");
            setTagsInput(Array.isArray(data.tags) ? data.tags.join(", ") : "");
            setStatus(data.status || "draft");
            setReadTime(data.readTime || "3 min read");
            setAuthor(data.author || "Elena Vance");
          } else {
            throw new Error("Specified article could not be retrieved from the server.");
          }
        } catch (err: any) {
          console.error("[Post Loading Schema Error]:", err);
          setErrorMessage(err.message || "Failed to retrieve the requested post.");
        } finally {
          setIsPageLoading(false);
        }
      };

      loadPostInformation();
    }
  }, [isEditMode, postId]);

  // Handle file input changes and update visual thumbnail preview representation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image file is too large. Maximum size allowed is 5MB.");
        return;
      }
      setSelectedFile(file);
      
      // Update local reader image previews
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear warnings
      if (errorMessage) setErrorMessage(null);
    }
  };

  // Perform upload logic specifically returning public cdn URLs
  const performImageUploadTask = async (): Promise<string | null> => {
    if (!selectedFile) {
      // Bypassed if we already have an imageUrl (such as during edits)
      if (imageUrl) return imageUrl;
      return null;
    }

    try {
      setUploadingImage(true);
      setErrorMessage(null);
      
      // Build standard Multi-part Form Data envelope for multer ingestion
      const data = new FormData();
      data.append("image", selectedFile);

      // Trigger CDN secure media upload
      const response = await api.post<any>("/media/upload", data);
      
      if (response && response.success && response.data?.secureUrl) {
        const url = response.data.secureUrl;
        setImageUrl(url); // Mirror inside states
        return url;
      } else {
        throw new Error(response?.error || "Media ingestion layer failed silently.");
      }
    } catch (err: any) {
      console.error("[Media Uploader Exception]:", err);
      setErrorMessage(err.message || "Media asset transfer to Cloudinary failed.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Primary Submission Orchestration handler
  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Initial logical validations matching Backend input schemas
    if (title.length < 5) {
      setErrorMessage("Please supply an engaging title with at least 5 characters.");
      return;
    }
    if (description.length < 10) {
      setErrorMessage("The description is too brief. Provide at least 10 characters.");
      return;
    }
    if (content.length < 20) {
      setErrorMessage("Articles require detailed insights. Write at least 20 characters.");
      return;
    }
    if (!selectedFile && !imageUrl) {
      setErrorMessage("Please upload or specify a cover display image asset.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Process cover imagery uploads. Return image CDN URL if needed
      let calculatedUrl = imageUrl;
      if (selectedFile) {
        const uploadedUrl = await performImageUploadTask();
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return; // Critical upload failure, error message has been logged mapping
        }
        calculatedUrl = uploadedUrl;
      }

      // 2. Format tags parameter structures
      const tagsParsedArray = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // 3. Structure payload envelope matching Zod schema validator requirements
      const payload: BlogPayload = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        imageUrl: calculatedUrl,
        category: category.toUpperCase().trim(),
        tags: tagsParsedArray,
        status,
        readTime: readTime.trim(),
        author: author.trim(),
      };

      // 4. Dispatch payloads to proper endpoint action nodes
      let response;
      if (isEditMode && postId) {
        response = await api.put<any>(`/blogs/${postId}`, payload);
      } else {
        response = await api.post<any>("/blogs", payload);
      }

      if (response && response.success) {
        setSuccessMessage(
          isEditMode 
            ? "Post modified and updated successfully." 
            : "Creative post generated and successfully written to databases!"
        );
        
        // Delay redirection so success notification transitions gracefully
        setTimeout(() => {
          router.push("/admin/posts");
        }, 1500);
      } else {
        throw new Error(response?.error || "Server operations declined transaction.");
      }

    } catch (err: any) {
      console.error("[Post Submission Execution severe error]:", err);
      // Attempt to retrieve descriptive details arrays if Zod input validations failed
      if (err.details && typeof err.details === "object") {
        const errorsList = Object.entries(err.details)
          .map(([field, msgs]: any) => `${field}: ${msgs.join(", ")}`)
          .join(" | ");
        setErrorMessage(`Field validations failed: ${errorsList}`);
      } else {
        setErrorMessage(err.message || "Failed to commit blog details.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToPosts = () => {
    router.push("/admin/posts");
  };

  if (isPageLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 text-neutral-400">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="font-mono text-xs tracking-wider uppercase">Retrieving specific article specifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-white max-w-4xl mx-auto pb-12">
      {/* Top Header Block */}
      <div className="flex items-center justify-between border-b border-neutral-850/55 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToPosts}
            type="button"
            className="p-2.5 bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-850 transition-colors inline-flex items-center"
            title="Return to posts database"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {isEditMode ? "Modify Article" : "Compose Prose"}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {isEditMode ? "Tinker post elements and update production nodes" : "Commit fresh stories to Anthony Blog server catalogues"}
            </p>
          </div>
        </div>

        <button
          onClick={handleFormSubmission}
          type="button"
          disabled={isSubmitting || uploadingImage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-950 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-98 shadow-[0_4px_12px_rgba(16,185,129,0.15)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEditMode ? "Commit Changes" : "Publish Article"}</span>
            </>
          )}
        </button>
      </div>

      {/* Action Notification Display Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/35 text-red-350 text-sm flex items-start gap-3 animate-pulse-subtle">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-250">Terminal Operation warning</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/35 text-emerald-350 text-sm flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-450 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-emerald-250">Verification successful</p>
            <p className="mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Main Composition Editor Board */}
      <form onSubmit={handleFormSubmission} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column Form inputs */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl shadow-lg space-y-6">
            
            {/* Title field */}
            <div>
              <label htmlFor="post-title" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase">
                Article Title (Minimum 5 characters)
              </label>
              <div className="mt-2 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Heading className="h-4 w-4" />
                </div>
                <input
                  id="post-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 placeholder-neutral-600"
                  placeholder="The Horizon of Decentralized Publishing..."
                />
              </div>
            </div>

            {/* Description field */}
            <div>
              <label htmlFor="post-description" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase">
                Brief Abstract (Minimum 10 characters)
              </label>
              <div className="mt-2 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 flex items-start pointer-events-none text-neutral-500">
                  <FileText className="h-4 w-4" />
                </div>
                <textarea
                  id="post-description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-550 text-sm transition-all text-neutral-100 placeholder-neutral-600"
                  placeholder="An insightful walkthrough regarding standard database integrity layers..."
                />
              </div>
            </div>

            {/* Content field (Textarea for Simple Markdown Prose composition) */}
            <div>
              <label htmlFor="post-content" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase flex items-center justify-between">
                <span>Article Markdown Prose (Minimum 20 characters)</span>
                <span className="text-[10px] text-neutral-550 border border-neutral-850 px-1.5 py-0.5 rounded">Markdown Supported</span>
              </label>
              <textarea
                id="post-content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="mt-2 block w-full outline-none px-4 py-3.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 placeholder-neutral-700 font-mono resize-none leading-relaxed"
                placeholder="## Sub-sections&#10;&#10;Begin crafting your narrative records here..."
              />
            </div>

          </div>
        </div>

        {/* Right side Metadata column */}
        <div className="space-y-6">
          
          {/* Metadata parameters card */}
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest font-mono border-b border-neutral-850/50 pb-3">
              Article Configurations
            </h2>

            {/* Status Select dropdown */}
            <div>
              <label htmlFor="post-status" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase">
                Publish Status Link
              </label>
              <select
                id="post-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="mt-2 block w-full px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 appearance-none cursor-pointer"
              >
                <option value="draft">Status: Local Draft</option>
                <option value="published">Status: Open Public</option>
                <option value="paused">Status: Paused archive</option>
              </select>
            </div>

            {/* Classification Category drop options */}
            <div>
              <label htmlFor="post-category" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase">
                Content Classification Category
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 block w-full px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 appearance-none cursor-pointer"
              >
                <option value="TECHNOLOGY">Classification: Technology</option>
                <option value="DEVELOPMENT">Classification: Development</option>
                <option value="DATABASE">Classification: Database</option>
                <option value="DESIGN">Classification: Design</option>
                <option value="SECURITY">Classification: Security</option>
              </select>
            </div>

            {/* Read Time setting box */}
            <div>
              <label htmlFor="post-readtime" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase">
                Computed Read Time
              </label>
              <div className="mt-2 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <BookOpen className="h-4 w-4" />
                </div>
                <input
                  id="post-readtime"
                  type="text"
                  required
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100"
                  placeholder="3 min read"
                />
              </div>
            </div>

            {/* Author Attribution parameter */}
            <div>
              <label htmlFor="post-author" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase">
                Author Attribution
              </label>
              <div className="mt-2 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="post-author"
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100"
                  placeholder="Elena Vance"
                />
              </div>
            </div>

            {/* Tags Separators commas inputs */}
            <div>
              <label htmlFor="post-tags" className="block text-xs font-mono tracking-wider text-neutral-400 uppercase">
                Search Tags (comma separated)
              </label>
              <div className="mt-2 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Tag className="h-4 w-4" />
                </div>
                <input
                  id="post-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 placeholder-neutral-600"
                  placeholder="mongodb, webdev, express"
                />
              </div>
            </div>

          </div>

          {/* Cover Imagery uploading deck */}
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest font-mono border-b border-neutral-850/50 pb-3">
              Cover Imagery CDN
            </h2>

            {/* Displays thumbnail previews of loaded URL or local files */}
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden aspect-video border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                <img 
                  src={imagePreview} 
                  alt="Post thumbnail draft"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                    setImageUrl("");
                  }}
                  className="absolute bottom-2 right-2 px-2.5 py-1.5 bg-red-950/90 border border-red-500/30 hover:bg-neutral-950 text-red-300 text-[10px] font-semibold font-mono uppercase tracking-wider rounded-lg transition-all"
                >
                  Discard Imagery
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-neutral-800 rounded-xl p-8 text-center text-neutral-500 flex flex-col items-center gap-2 justify-center bg-neutral-950/40">
                <ImageIcon className="h-8 w-8 text-neutral-700" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-neutral-400">Select story thumbnail imagery</p>
                  <p className="text-[10px] text-neutral-600">PNG, JPG, BMP format limits up to 5MB</p>
                </div>
              </div>
            )}

            {/* Inputs upload trigger */}
            <div className="relative flex items-center justify-center">
              <label 
                htmlFor="thumbnail-raw-file"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-350 bg-neutral-950 hover:bg-neutral-850 hover:text-white transition-all cursor-pointer text-center"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>{imagePreview ? "Replace Thumbnail File" : "Choose Thumbnail file"}</span>
                  </>
                )}
              </label>
              <input
                id="thumbnail-raw-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadingImage}
                className="hidden"
              />
            </div>
            
            {/* If imagery already exists inside metadata logs */}
            {imageUrl && !selectedFile && (
              <p className="text-[10px] font-mono text-neutral-500 break-all bg-neutral-950 border border-neutral-850 p-2.5 rounded-lg">
                CDN: {imageUrl}
              </p>
            )}
          </div>

        </div>

      </form>
    </div>
  );
}
