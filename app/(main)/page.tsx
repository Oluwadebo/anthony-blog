// /app/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  Calendar,
  BookOpen,
  ArrowRight,
  Loader2,
  Tag,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Newspaper
} from "lucide-react";
import { api } from "../../lib/api";


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

export default function PublicBlogHomePage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    const fetchPublishedPosts = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // Fetch only published blogs
        const response = await api.get<any>("/blogs?status=published");

        if (active) {
          if (response && Array.isArray(response.data)) {
            // Sort by createdAt descending to show newest first
            const sorted = response.data.sort(
              (a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPosts(sorted);
          } else {
            throw new Error("Invalid response envelope structure from database backend.");
          }
        }
      } catch (err: any) {
        if (active) {
          console.error("[Home Fetch Published Exception]:", err);
          setErrorMsg(err.message || "Unable to load articles. Ensure backend nodes are operational.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchPublishedPosts();
    return () => {
      active = false;
    };
  }, []);

  // Filter out any non-published posts just as safety
  const publishedPosts = posts.filter((post) => post.status === "published");

  // Choose the featured post (newest) if available
  const featuredPost = publishedPosts[0];
  const secondaryPosts = publishedPosts.slice(1);

  return (
    <div className="space-y-16 animate-fade-in font-sans text-neutral-100 pb-16">

      {/* Editorial Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden py-16 md:py-24 px-6 md:px-12 bg-neutral-900 border border-neutral-850/80 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl relative space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Premium Publishing Medium</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Dive into Deep Tech &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Modern Code</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl font-sans leading-relaxed">
            Welcome to Anthony Blog, a high-fidelity publisher nodes CMS. Walk through beautiful stories regarding micro-operations, secure APIs, databases, and fullstack wizardry.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-neutral-950 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:scale-101 active:scale-98"
            >
              <span>Get Started Writing</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <a
              href="#recent-posts"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-neutral-300 bg-neutral-950 border border-neutral-800 hover:bg-neutral-900 transition-all focus:outline-none"
            >
              <span>Look at Catalog</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Post Segment */}
      {featuredPost && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              FEATURED STORY
            </h2>
          </div>

          <div className="group relative bg-neutral-900/60 border border-neutral-850/60 rounded-3xl overflow-hidden hover:border-neutral-800 transition-all duration-300 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl">
            <div className="aspect-video md:aspect-auto w-full min-h-[260px] relative overflow-hidden bg-neutral-950">
              <img
                src={featuredPost.imageUrl || "https://picsum.photos/seed/anthony/800/600"}
                alt={featuredPost.title}
                className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="font-mono text-[10px] font-bold text-emerald-400 bg-neutral-950/90 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {featuredPost.category || "TECHNOLOGY"}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {featuredPost.readTime || "5 min read"}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
                  {featuredPost.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850/40">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono text-[10px] text-neutral-300 uppercase font-bold">
                    {featuredPost.author ? featuredPost.author[0] : "E"}
                  </div>
                  <span className="text-xs text-neutral-300 font-medium">{featuredPost.author || "Elena Vance"}</span>
                </div>

                <Link
                  href={`/posts/${featuredPost._id}`}
                  className="inline-flex items-center gap-2 group/btn text-xs font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Catalog Grid */}
      <section id="recent-posts" className="space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-emerald-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              RECENT BLOG CATALOGUES
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {publishedPosts.length} post{publishedPosts.length !== 1 ? "s" : ""} published
          </span>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-neutral-400">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <p className="font-mono text-xs tracking-wider uppercase">Retrieving blog nodes...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/25 text-neutral-300 text-center space-y-2">
            <p className="text-red-400 font-semibold font-mono text-xs">COMMUNICATION OUTAGE</p>
            <p className="text-sm text-neutral-400">{errorMsg}</p>
          </div>
        ) : publishedPosts.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
              📝
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-300">No published articles yet</p>
              <p className="text-xs text-neutral-550">Please log in to the admin console to publish posts and test integrations.</p>
            </div>
            <Link
              href="/admin/posts/create"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl text-xs font-semibold transition-all"
            >
              Create New Article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {publishedPosts.map((post) => {
              return (
                <article
                  key={post._id}
                  className="group bg-neutral-900/40 border border-neutral-850/50 rounded-2xl overflow-hidden hover:border-neutral-800 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl"
                >
                  {/* Cardcover Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                    <img
                      src={post.imageUrl || "https://picsum.photos/seed/blog/600/400"}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[9px] font-bold text-emerald-400 bg-neutral-950/95 border border-emerald-500/10 px-2 py-1 rounded uppercase tracking-wider">
                        {post.category || "DEVELOPMENT"}
                      </span>
                    </div>
                  </div>

                  {/* Card metadata and titles content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-neutral-550 font-mono">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span>&bull;</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views || 0} views
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-850/30 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 font-medium">By {post.author || "Guest"}</span>

                      <Link
                        href={`/posts/${post._id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors group/link"
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
