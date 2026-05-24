// /app/admin/page.tsx
"use client";

import {
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Database,
  Eye,
  FileText,
  Image as ImageIcon,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import * as React from "react";
import { useSite } from "../../../context/siteprovide";
import { api } from "../../../lib/api";

interface PostMetric {
  id: string;
  title: string;
  status: string;
  views: number;
}

export default function AdminDashboardPage() {
  const [loadingMetrics, setLoadingMetrics] = React.useState(true);
  const [totalPostsCount, setTotalPostsCount] = React.useState(0);
  const [draftCount, setDraftCount] = React.useState(0);
  const [publishedCount, setPublishedCount] = React.useState(0);
  const [totalViewerCount, setTotalViewerCount] = React.useState(0);
  const [latestPosts, setLatestPosts] = React.useState<PostMetric[]>([]);
  const { siteName, updateSiteName } = useSite();

  // Fetch metrics upon mounting
  React.useEffect(() => {
    const fetchDashboardStatistics = async () => {
      try {
        setLoadingMetrics(true);
        // Standard API query to base catalog returning standard response
        const listResponse = await api.get<any>("/blogs?status=all");

        if (listResponse && Array.isArray(listResponse.data)) {
          const list: PostMetric[] = listResponse.data;
          setTotalPostsCount(list.length);

          let drafts = 0;
          let published = 0;
          let totalViews = 0;

          list.forEach((post) => {
            if (post.status === "draft") {
              drafts += 1;
            } else if (post.status === "published") {
              published += 1;
            }
            totalViews += post.views || 0;
          });

          setDraftCount(drafts);
          setPublishedCount(published);
          setTotalViewerCount(totalViews);
          setLatestPosts(list.slice(0, 4)); // Capture top 4 items
        }
      } catch (err: any) {
        console.error("[Dashboard Stat Load Exception]:", err);
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchDashboardStatistics();
  }, []);

  const stats = [
    {
      name: "Total Published Articles",
      value: loadingMetrics ? "..." : publishedCount,
      change: "+0% this week",
      icon: CheckCircle,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/15",
    },
    {
      name: "Prose Drafts & Ideation",
      value: loadingMetrics ? "..." : draftCount,
      change: "Local staging active",
      icon: FileText,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/15",
    },
    {
      name: "Cumulative Page Views",
      value: loadingMetrics ? "..." : totalViewerCount.toLocaleString(),
      change: "Traffic direct CDN flow",
      icon: Eye,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/15",
    },
    {
      name: "Aggregate Database Objects",
      value: loadingMetrics ? "..." : totalPostsCount,
      change: "MongoDB Host status okay",
      icon: Database,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/15",
    },
  ];

  const nameParts = (siteName || "Anthony Blog").split(" ");
  const firstPart = nameParts[0];
  const secondPart = nameParts.slice(1).join(" ");

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      {/* Greetings section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-850/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, Admin
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 flex items-center gap-1.5 font-sans">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Terminal active. You hold sovereign administrative access to{" "}
            <span className="text-zinc-900 dark:text-white ">
              {firstPart}
            {secondPart && (
              <span className="ml-1 text-emerald-500">{secondPart}</span>
            )}{" "}
            </span>
            CMS nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/admin/posts?create=true";
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-950 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-98 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Compose Post</span>
          </button>
        </div>
      </div>

      {/* Grid Stats Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl border bg-neutral-900 border-neutral-850 shadow-lg relative overflow-hidden group transition-all duration-300 hover:border-neutral-750`}
            >
              {/* Stat Card visual top headers */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {stat.name}
                </span>
                <span className={`p-2 rounded-lg ${stat.bgColor} border`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </span>
              </div>

              {/* Stat Value parameters */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">
                  {stat.value}
                </span>
              </div>

              {/* Status footer annotation details */}
              <div className="mt-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary analytical rows section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main grid segment: Latest operational logs */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-850 bg-neutral-900 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-850/50 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-widest font-mono">
                Recent Publication Nodes
              </h2>
            </div>
            <a
              href="/admin/posts"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5"
            >
              <span>View all</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {loadingMetrics ? (
            <div className="py-12 text-center text-sm text-neutral-500 font-mono">
              Fetching metrics stream...
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-8 w-8 text-neutral-700 mx-auto mb-2" />
              <p className="text-sm text-neutral-400 font-medium">
                No blog posts registered yet
              </p>
              <p className="text-xs text-neutral-550 mt-1">
                Get started by composing your very first story today!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-neutral-950/40 rounded-xl border border-neutral-850/40 hover:border-neutral-800 transition-all group"
                >
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="text-sm font-semibold text-neutral-100 truncate group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </span>
                    <span className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-mono">
                      ID: {post.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border
                      ${
                        post.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }
                    `}
                    >
                      {post.status}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                      <Eye className="h-3.5 w-3.5 text-neutral-600" />
                      <span>{post.views || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right smaller analytical status widgets */}
        <div className="space-y-6">
          {/* Quick-Action Panel */}
          <div className="p-6 rounded-2xl border border-neutral-850 bg-neutral-900 shadow-md space-y-4">
            <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest font-mono border-b border-neutral-850/50 pb-4">
              Terminal Quick Links
            </h2>

            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/admin/posts?create=true";
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 border border-neutral-850/30 text-left hover:bg-emerald-500/5 hover:border-emerald-500/30 text-neutral-300 hover:text-emerald-300 transition-all font-medium group"
              >
                <span>Compose New Layout</span>
                <PlusCircle className="h-4 w-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/admin/media";
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 border border-neutral-850/30 text-left hover:bg-emerald-500/5 hover:border-emerald-500/30 text-neutral-300 hover:text-emerald-300 transition-all font-medium group"
              >
                <span>Upload Media CDN Asset</span>
                <ImageIcon className="h-4 w-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* MongoDB Connection Integrity Monitoring card */}
          <div className="p-6 rounded-2xl border border-neutral-850 bg-neutral-900 shadow-md relative overflow-hidden">
            {/* Ambient emerald neon aura effect */}
            <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl" />

            <div className="flex items-center gap-3">
              <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                <TrendingUp className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  Central Schema Node
                </h3>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-1 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/10 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Mongoose Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
