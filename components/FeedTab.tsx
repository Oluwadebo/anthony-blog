'use client';

import * as React from "react";
import { Article } from "./types";
import { Sparkles, ArrowRight, BookOpen, Clock } from "lucide-react";

interface FeedTabProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export default function FeedTab({ articles, onSelectArticle }: FeedTabProps) {
  // Extract trending posts
  const trendingArticles = React.useMemo(() => {
    // Return published articles with highest views
    return articles
      .filter((a) => a.status === "Published")
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  }, [articles]);

  const latestArticles = React.useMemo(() => {
    // Show all articles matching newest
    return articles.sort((a, b) => {
      // Return order
      return b.id.localeCompare(a.id);
    });
  }, [articles]);

  return (
    <div className="space-y-6">
      {/* Trending Horizontal Scroll Section */}
      <section className="py-2">
        <div className="mb-3.5 flex justify-between items-end">
          <h2 className="text-xl font-bold text-[#1d1b20] tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#4f378a]" />
            Trending Stories
          </h2>
        </div>

        {/* Scroll deck */}
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 snap-x snap-mandatory">
          {trendingArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="min-w-[280px] md:min-w-[340px] snap-start group cursor-pointer"
            >
              <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-2.5 bg-[#f2ecf4] border border-[#cbc4d2]/30 shadow-xs">
                {/* Image */}
                <img
                  src={art.image}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Horizontal Category Pill layout overlay */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-[#cbc4d2]/20">
                  <span className="text-[10px] font-bold text-[#4f378a] tracking-wider uppercase">
                    {art.category}
                  </span>
                </div>
              </div>

              {/* Title links */}
              <h3 className="font-bold text-sm tracking-tight text-[#1d1b20] line-clamp-2 leading-snug group-hover:text-[#4f378a] transition-colors">
                {art.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Updates vertical List Feed */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#cbc4d2]/20 pb-2">
          <h2 className="text-xl font-bold text-[#1d1b20] tracking-tight">
            Latest Updates
          </h2>
          <span className="text-xs font-semibold text-[#494551]">
            Grid representation
          </span>
        </div>

        <div className="space-y-5">
          {latestArticles.map((art) => {
            const isDraft = art.status === "Draft";

            return (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer flex flex-col gap-3 transition-opacity duration-300"
              >
                {/* Thumbnail container */}
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-[#cbc4d2]/40 bg-[#f2ecf4] relative shadow-xs">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#1d1b20] px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-xs border border-[#cbc4d2]/10">
                    <Clock className="w-3.5 h-3.5 text-[#4f378a]" />
                    {art.readTime}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      art.status === "Published" ? "bg-emerald-50 text-[#10b981]" : "bg-slate-100 text-slate-600"
                    }`}>
                      {art.status}
                    </span>
                    <span className="text-xs text-[#494551] font-semibold">{art.date}</span>
                  </div>

                  <h3 className="font-bold text-base md:text-lg text-[#1d1b20] tracking-tight leading-snug group-hover:text-[#4f378a] transition-colors font-sans">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#494551] leading-relaxed line-clamp-2 md:line-clamp-3">
                    {art.content}
                  </p>

                  {/* Author avatar and metadata */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#cbc4d2]/30 bg-slate-100">
                      <img
                        src={art.authorImage}
                        alt={art.author}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#1d1b20]">{art.author}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
