// /app/admin/posts/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  Edit3, 
  Trash2, 
  Eye, 
  Loader2, 
  FileText, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { api } from "../../../../lib/api";

interface PostItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "published" | "draft" | "paused";
  views: number;
  createdAt: string;
}

export default function PostsListPage() {
  const router = useRouter();
  const [posts, setPosts] = React.useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorVisible, setErrorVisible] = React.useState<string | null>(null);
  
  // Filtering and searching state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "published" | "draft" | "paused">("all");
  
  // Deleting state tracking
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Fetch posts from API
  const loadPostsCatalog = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorVisible(null);
      const response = await api.get<any>("/blogs?status=all");
      if (response && Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        throw new Error("Invalid schema envelope returned from server.");
      }
    } catch (err: any) {
      console.error("[Posts Load Error]:", err);
      setErrorVisible(err.message || "Failed to load posts from publisher service.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    const initialLoad = async () => {
      try {
        const response = await api.get<any>("/blogs?status=all");
        if (active) {
          if (response && Array.isArray(response.data)) {
            setPosts(response.data);
          } else {
            throw new Error("Invalid schema envelope returned from server.");
          }
        }
      } catch (err: any) {
        if (active) {
          console.error("[Posts Load Error]:", err);
          setErrorVisible(err.message || "Failed to load posts from publisher service.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    initialLoad();
    return () => {
      active = false;
    };
  }, []);

  // Erase a specific post record matching its ObjectID
  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently erase: "${title}"?\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      setErrorVisible(null);
      
      const response = await api.delete<any>(`/blogs/${id}`);
      
      if (response && response.success) {
        // Remove locally from state to prevent reloading completely
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        throw new Error(response?.error || "Server declined deletion request.");
      }
    } catch (err: any) {
      console.error("[Post Deletion Error]:", err);
      setErrorVisible(err.message || "An error occurred while deleting the post.");
    } finally {
      setDeletingId(null);
    }
  };

  // Navigates to Create/Edit page
  const navigateToCreateMode = () => {
    router.push("/admin/posts/create");
  };

  const navigateToEditMode = (id: string) => {
    router.push(`/admin/posts/create?id=${id}`);
  };

  // Compute filtered datasets
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true : post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans antialiased text-white">
      {/* Header Block Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-850/55 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Articles Catalog
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 font-sans">
            Oversee stories, draft revisions, view counts, and publish statuses.
          </p>
        </div>

        <button
          onClick={navigateToCreateMode}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-950 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-98 shadow-[0_4px_12px_rgba(16,185,129,0.15)] self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Post</span>
        </button>
      </div>

      {/* Warning/Error banners if things go south */}
      {errorVisible && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/35 text-red-350 text-sm flex items-start gap-3 animate-pulse-subtle">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-250">Terminal Operation warning</p>
            <p className="mt-0.5">{errorVisible}</p>
          </div>
        </div>
      )}

      {/* Filters and Search Tools row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search Input Box */}
        <div className="sm:col-span-2 relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search items by title, category, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 placeholder-neutral-500"
          />
        </div>

        {/* Status Filter Choice Select */}
        <div className="relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="block w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 appearance-none cursor-pointer"
          >
            <option value="all">Filter: All Statuses</option>
            <option value="published">Status: Published</option>
            <option value="draft">Status: Drafts</option>
            <option value="paused">Status: Paused</option>
          </select>
        </div>
      </div>

      {/* Main Data Registry Card */}
      <div className="bg-neutral-900 border border-neutral-850/80 rounded-2xl overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-neutral-400">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <p className="font-mono text-xs tracking-wider uppercase">Loading database collections...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <FileText className="h-12 w-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-sm text-neutral-400 font-medium">No records found matching criteria</p>
            <p className="text-xs text-neutral-550 mt-1">Try broadening your inquiries or execute creation triggers above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/40 border-b border-neutral-850/50 text-neutral-500 font-mono text-[10px] tracking-wider uppercase">
                  <th className="py-4 px-6 font-semibold">Title Page details</th>
                  <th className="py-4 px-6 font-semibold">Classification</th>
                  <th className="py-4 px-6 font-semibold">Status state</th>
                  <th className="py-4 px-6 font-semibold text-center">Viewers</th>
                  <th className="py-4 px-6 font-semibold">Time catalog</th>
                  <th className="py-4 px-6 font-semibold text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/40 text-sm">
                {filteredPosts.map((post) => {
                  return (
                    <tr 
                      key={post._id}
                      className="hover:bg-neutral-850/15 transition-all text-neutral-200 group"
                    >
                      {/* Name of the content */}
                      <td className="py-4.5 px-6 min-w-[220px]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors leading-snug">
                            {post.title}
                          </span>
                          <span className="text-[11px] text-neutral-550 mt-1 line-clamp-1">
                            {post.description}
                          </span>
                        </div>
                      </td>

                      {/* Tag / Category details */}
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <span className="font-mono text-xs text-neutral-400 uppercase bg-neutral-950/30 px-2 py-1 rounded border border-neutral-850/40">
                          {post.category || "TECHNOLOGY"}
                        </span>
                      </td>

                      {/* Pill status */}
                      <td className="py-4.5 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.75 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border
                          ${post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : post.status === "paused"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"}
                        `}>
                          <span className={`h-1.5 w-1.5 rounded-full 
                            ${post.status === "published" 
                              ? "bg-emerald-500 animate-pulse" 
                              : post.status === "paused"
                              ? "bg-red-500"
                              : "bg-amber-500"}`} 
                          />
                          {post.status}
                        </span>
                      </td>

                      {/* Statistics counts views */}
                      <td className="py-4.5 px-6 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                          <Eye className="h-3.5 w-3.5 text-neutral-600" />
                          <span>{post.views || 0}</span>
                        </div>
                      </td>

                      {/* Created timeline */}
                      <td className="py-4.5 px-6 whitespace-nowrap font-mono text-xs text-neutral-400">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Operation action triggers */}
                      <td className="py-4.5 px-6 space-x-1 text-right whitespace-nowrap">
                        <button
                          onClick={() => navigateToEditMode(post._id)}
                          className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-colors border border-transparent hover:border-emerald-500/10 inline-flex items-center"
                          title="Modify post prose"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeletePost(post._id, post.title)}
                          disabled={deletingId === post._id}
                          className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors border border-transparent hover:border-red-500/10 inline-flex items-center disabled:opacity-50"
                          title="Erase post permanently"
                        >
                          {deletingId === post._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
