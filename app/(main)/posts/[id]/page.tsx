// /app/posts/[id]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  BookOpen, 
  User, 
  Tag, 
  Loader2, 
  Share2,
  Clock,
  ThumbsUp
} from "lucide-react";
import { api } from "../../../../lib/api";

interface Post {
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  status: "published" | "draft" | "paused";
  views: number;
  readTime: string;
  author: string;
  createdAt: string;
}

export default function PublicSinglePostView({ params }: { params: any }) {
  const [postId, setPostId] = React.useState<string | null>(null);
  const [post, setPost] = React.useState<Post | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  // Safely extract params.id in Client Components across React 18/19 NextJS models
  React.useEffect(() => {
    if (params) {
      Promise.resolve(params).then((resolved) => {
        if (resolved && resolved.id) {
          setPostId(resolved.id);
        }
      });
    }
  }, [params]);

  React.useEffect(() => {
    if (!postId) return;

    let active = true;

    const fetchPostDetails = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        
        // Fetch article by ID (The server automatically increments view count)
        const response = await api.get<any>(`/blogs/${postId}`);
        
        if (active) {
          if (response && response.data) {
            setPost(response.data);
          } else {
            throw new Error("Unable to parse article response envelop.");
          }
        }
      } catch (err: any) {
        if (active) {
          console.error("[Post Fetch Details Exception]:", err);
          setErrorMsg(err.message || "Failed to load the article from index database.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchPostDetails();
    return () => {
      active = false;
    };
  }, [postId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-neutral-400 font-sans">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="font-mono text-xs tracking-wider uppercase">Loading Story Node...</p>
      </div>
    );
  }

  if (errorMsg || !post) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 text-neutral-350">
          <p className="text-red-400 font-bold font-mono text-xs uppercase tracking-widest mb-1">
            Article Outage
          </p>
          <p className="text-sm">{errorMsg || "This article is either offline, a draft, or does not exist."}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back to Home index</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in pb-24 font-sans select-text">
      
      {/* Return Navigation Anchor */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-emerald-400 transition-all group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Catalog</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-850 hover:text-white hover:border-neutral-750 transition-all"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>{isCopied ? "Copied Node" : "Share Node"}</span>
        </button>
      </div>

      {/* Cinematic Cover Image Panel */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-850">
        <img
          src={post.imageUrl || "https://picsum.photos/seed/editorial/1200/600"}
          alt={post.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
      </div>

      {/* Article Header Information */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category || "TECHNOLOGY"}
          </span>
          <span className="text-neutral-700">&bull;</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <Clock className="h-3.5 w-3.5 text-neutral-500" />
            {post.readTime || "5 min read"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {post.title}
        </h1>

        {/* Post Briefing */}
        <p className="text-base sm:text-lg text-neutral-350 italic border-l-2 border-emerald-500 pl-4 py-1 leading-relaxed">
          {post.description}
        </p>

        {/* Editorial bio and metrics indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-neutral-900 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-black text-emerald-400 uppercase">
              {post.author ? post.author[0] : "A"}
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-mono tracking-wider uppercase leading-none">AUTHORED BY</p>
              <p className="text-sm font-extrabold text-white mt-1">{post.author || "Elena Vance"}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-neutral-400" />
              <strong className="text-neutral-300 font-medium">{post.views || 0}</strong> views
            </span>
          </div>
        </div>
      </div>

      {/* Styled Rich Text Content Block */}
      <div 
        className="font-serif text-neutral-300 leading-relaxed text-base sm:text-lg select-text
          prose prose-neutral prose-invert max-w-none
          prose-p:leading-relaxed prose-p:mb-6
          prose-headings:text-white prose-headings:font-sans prose-headings:font-extrabold prose-headings:tracking-tight
          prose-h1:text-2xl sm:prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-4
          prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg sm:prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
          prose-li:text-neutral-300
          prose-strong:text-white prose-strong:font-bold
          prose-a:text-emerald-400 prose-a:underline hover:prose-a:text-emerald-300
          prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-neutral-400 prose-blockquote:my-6
          prose-pre:bg-neutral-900 prose-pre:p-4 prose-pre:rounded-xl prose-pre:font-mono prose-pre:text-sm prose-pre:overflow-x-auto prose-pre:border prose-pre:border-neutral-850 prose-pre:my-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Article Footer tag metrics selection */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-8 border-t border-neutral-900">
          {post.tags.map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-neutral-400 rounded-full text-xs font-mono select-none"
            >
              <Tag className="h-3 w-3 text-neutral-500" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* Outro recommendation segment */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-tr from-neutral-900 to-neutral-950 border border-neutral-850 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Appreciated this read?</h3>
        <p className="text-neutral-400 text-sm max-w-md mx-auto">
          Help spread knowledge. Share this secure decoupled CMS node or head back to browse other technical guidelines in our library.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all font-sans"
          >
            <span>Back to Home Feed</span>
            <ArrowLeft className="h-3 w-3 rotate-180" />
          </Link>
        </div>
      </div>

    </article>
  );
}
