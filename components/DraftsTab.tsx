'use client';

import * as React from "react";
import { Article } from "./types";
import { Search, MoreVertical, Calendar, Eye, FileText, CheckCircle, PauseCircle, PlayCircle, Edit2, Trash2, HelpCircle } from "lucide-react";

interface DraftsTabProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (articleId: string) => void;
  onToggleStatus: (articleId: string, currentStatus: "Published" | "Draft" | "Paused") => void;
  onNewArticle: () => void;
}

export default function DraftsTab({
  articles,
  onSelectArticle,
  onEditArticle,
  onDeleteArticle,
  onToggleStatus,
  onNewArticle,
}: DraftsTabProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<"All" | "Published" | "Draft" | "Paused">("All");

  // Track the ID of the open popup menu
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  // Close menus when clicking anywhere
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setOpenMenuId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent closing immediately
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Filter posts based on search input and active state category tag
  const filteredArticles = React.useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = activeFilter === "All" || art.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [articles, searchTerm, activeFilter]);

  return (
    <div className="space-y-5">
      {/* Search & Filter Section */}
      <section className="bg-white p-4 rounded-xl border border-[#cbc4d2] shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#494551]" />
          <input
            type="text"
            placeholder="Search posts by title, tag, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl focus:outline-none focus:border-[#4f378a] focus:ring-2 focus:ring-[#e1d4fd] text-sm"
          />
        </div>

        {/* Filter Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {(["All", "Published", "Draft", "Paused"] as const).map((filter) => {
            const isActive = activeFilter === filter;
            const label = filter === "All" ? "All Posts" : filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#e1d4fd] text-[#4f378a] shadow-xs"
                    : "bg-[#e6e0e9] text-[#494551] hover:bg-[#ece6ee]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Articles Feed List */}
      <section className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="bg-white border border-[#cbc4d2] rounded-xl p-8 text-center text-[#494551]">
            <HelpCircle className="w-10 h-10 mx-auto text-[#cbc4d2] mb-2" />
            <p className="text-sm font-semibold">No articles found matching criteria</p>
            <p className="text-xs text-[#cbc4d2] mt-1">Try expanding your search parameters or start a draft!</p>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const isPublished = art.status === "Published";
            const isDraft = art.status === "Draft";
            const isPaused = art.status === "Paused";

            return (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-white border border-[#cbc4d2] hover:bg-[#f8f2fa] rounded-xl p-4 flex flex-col gap-3 relative cursor-pointer active:bg-[#ece6ee] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 max-w-[85%]">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide uppercase inline-block ${
                      isPublished ? "bg-emerald-50 text-[#10b981] border border-[#10b981]/20" :
                      isDraft ? "bg-slate-100 text-slate-600 border border-slate-200" :
                      "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {art.status}
                    </span>

                    {/* Headline */}
                    <h3 className="font-bold text-base text-[#1d1b20] leading-snug tracking-tight font-sans">
                      {art.title}
                    </h3>
                  </div>

                  {/* Actions vertical Menu button */}
                  <button
                    onClick={(e) => handleMenuToggle(e, art.id)}
                    className="p-1 hover:bg-[#e6e0e9] rounded-full transition-colors shrink-0 cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5 text-[#494551]" />
                  </button>
                </div>

                {/* Subtitle Info metadata */}
                <div className="flex items-center gap-3.5 text-xs text-[#494551] font-semibold">
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {isDraft ? "Last updated 2h ago" : art.date}
                  </span>
                  {!isDraft && (
                    <span className="flex items-center gap-1 shrink-0 border-l border-[#cbc4d2]/40 pl-3.5">
                      <Eye className="w-3.5 h-3.5" />
                      {art.views >= 1000 ? `${(art.views / 1000).toFixed(1)}k` : art.views} views
                    </span>
                  )}
                </div>

                {/* Micro Action Overflow Overlay Menu Popup (State-driven) */}
                {openMenuId === art.id && (
                  <div 
                    onClick={(e) => e.stopPropagation()} // retain clicks inside
                    className="absolute right-4 top-12 bg-white shadow-xl rounded-xl border border-[#cbc4d2] z-40 w-44 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150"
                  >
                    {/* Edit Option */}
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onEditArticle(art);
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-[#f2ecf4] text-xs font-bold text-[#1d1b20] transition-colors border-b border-[#cbc4d2]/20 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 text-slate-500" />
                      Edit Post
                    </button>

                    {/* Pause / Resume Option */}
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onToggleStatus(art.id, art.status);
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-[#f2ecf4] text-xs font-bold text-[#1d1b20] transition-colors border-b border-[#cbc4d2]/20 cursor-pointer"
                    >
                      {isPublished ? (
                        <>
                          <PauseCircle className="w-4 h-4 text-amber-600" />
                          Pause Post
                        </>
                      ) : isPaused ? (
                        <>
                          <PlayCircle className="w-4 h-4 text-emerald-600" />
                          Resume Post
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#4f378a]" />
                          Publish Post
                        </>
                      )}
                    </button>

                    {/* Delete Option */}
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onDeleteArticle(art.id);
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-red-50 text-xs font-bold text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Floating Action FAB button */}
      <button
        onClick={onNewArticle}
        className="fixed bottom-24 right-6 bg-[#4f378a] text-white hover:bg-[#6750a4] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 z-50 active:scale-95 transition-all outline-none border border-white/10 shrink-0 cursor-pointer text-sm font-bold animate-pulse hover:animate-none"
      >
        <span className="text-xl leading-none font-light">+</span>
        <span>New Post</span>
      </button>
    </div>
  );
}
