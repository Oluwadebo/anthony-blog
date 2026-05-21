'use client';

import * as React from "react";
import { Article, Activity } from "./types";
import { BookOpen, Heart, Eye, Users, TrendingUp, CheckCircle, FileText, UserPlus, AlertCircle, ArrowRight } from "lucide-react";

interface DashboardProps {
  articles: Article[];
  activities: Activity[];
  onNavigate: (tab: "home" | "drafts" | "feed" | "account", selectedArticle?: Article | null) => void;
  onQuickPublish: (articleId: string) => void;
}

export default function Dashboard({ articles, activities, onNavigate, onQuickPublish }: DashboardProps) {
  // Compute dynamic stats based on our memory state list!
  const totalBlogs = articles.length;
  
  // Calculate total views
  const totalViews = React.useMemo(() => {
    return articles.reduce((sum, art) => sum + art.views, 0);
  }, [articles]);

  const formattedViews = React.useMemo(() => {
    if (totalViews >= 1000) {
      return `${(totalViews / 1000).toFixed(1)}k`;
    }
    return totalViews.toString();
  }, [totalViews]);

  // Calculate total likes
  const totalLikes = React.useMemo(() => {
    return articles.reduce((sum, art) => sum + art.likes, 0);
  }, [articles]);

  const formattedLikes = React.useMemo(() => {
    if (totalLikes >= 1000) {
      return `${(totalLikes / 1000).toFixed(1)}k`;
    }
    return totalLikes.toString();
  }, [totalLikes]);

  // Subscribers count (simulated interactive count)
  const [subscribers, setSubscribers] = React.useState(8902);

  // Simple responsive hover effect state for the chart
  const [hoveredDay, setHoveredDay] = React.useState<string | null>(null);

  // Traffic trend values
  const trafficData = [
    { day: "Mon", height: "30%", views: "12,400" },
    { day: "Tue", height: "50%", views: "18,200" },
    { day: "Wed", height: "40%", views: "15,800" },
    { day: "Thu", height: "80%", views: "28,600" },
    { day: "Fri", height: "65%", views: "22,100" },
    { day: "Sat", height: "95%", views: "42,500" },
    { day: "Sun", height: "75%", views: "31,400" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="py-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#1d1b20] mb-1 font-sans">
          Morning, Editor
        </h1>
        <p className="text-sm text-[#494551] font-sans">
          Here is what&apos;s happening with your content today.
        </p>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Total Blogs */}
        <div 
          onClick={() => onNavigate("drafts")}
          className="bg-white hover:bg-[#f8f2fa] cursor-pointer border border-[#cbc4d2] p-4 rounded-xl flex flex-col gap-3 shadow-xs transition-all transform hover:-translate-y-0.5 duration-200"
        >
          <div className="w-9 h-9 rounded-lg bg-[#f2ecf4] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#4f378a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#494551] tracking-wider uppercase">Total Blogs</span>
            <span className="text-2xl font-bold text-[#1d1b20] tracking-tight">{totalBlogs}</span>
          </div>
        </div>

        {/* KPI 2: Total Likes */}
        <div className="bg-[#e1d4fd] border border-[#63597c]/10 p-4 rounded-xl flex flex-col gap-3 shadow-xs transition-all transform hover:-translate-y-0.5 duration-200">
          <div className="w-9 h-9 rounded-lg bg-white/40 flex items-center justify-center">
            <Heart className="w-5 h-5 text-[#4f378a] fill-[#4f378a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#645a7d]/90 tracking-wider uppercase">Total Likes</span>
            <span className="text-2xl font-bold text-[#4f378a] tracking-tight">{formattedLikes}</span>
          </div>
        </div>

        {/* KPI 3: Monthly Views */}
        <div className="bg-white border border-[#cbc4d2] p-4 rounded-xl flex flex-col gap-3 shadow-xs transition-all transform hover:-translate-y-0.5 duration-200">
          <div className="w-9 h-9 rounded-lg bg-[#fdf7ff] flex items-center justify-center border border-[#cbc4d2]/30">
            <Eye className="w-5 h-5 text-[#765b00]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#494551] tracking-wider uppercase">Monthly Views</span>
            <span className="text-2xl font-bold text-[#1d1b20] tracking-tight">{formattedViews}</span>
          </div>
        </div>

        {/* KPI 4: Subscribers */}
        <div 
          onClick={() => setSubscribers(prev => prev + 1)}
          title="Click to simulate a new subscriber signup!"
          className="bg-[#e9ddff] border border-[#63597c]/10 p-4 rounded-xl flex flex-col gap-3 shadow-xs cursor-pointer transition-all transform hover:-translate-y-0.5 duration-200"
        >
          <div className="w-9 h-9 rounded-lg bg-white/40 flex items-center justify-center animate-pulse">
            <Users className="w-5 h-5 text-[#645a7d]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#645a7d]/90 tracking-wider uppercase">Subscribers</span>
            <span className="text-2xl font-bold text-[#645a7d] tracking-tight">{subscribers.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Traffic Chart */}
      <section className="bg-white border border-[#cbc4d2] rounded-xl p-5 shadow-xs">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold text-[#1d1b20] uppercase tracking-wider">Traffic Trend</h3>
          <div className="flex items-center gap-1 text-[#10b981] text-xs font-bold bg-[#10b981]/10 px-2 py-1 rounded-md">
            <TrendingUp className="w-3.5 h-3.5" />
            12% Increase
          </div>
        </div>

        {/* Interactive Custom SVG-like Bar Presentation */}
        <div className="relative pt-6 px-1">
          {/* Tooltip */}
          <div className="h-6 flex justify-center mb-2">
            {hoveredDay ? (
              <span className="text-xs font-semibold text-[#4f378a] bg-[#e1d4fd] px-2 py-0.5 rounded-md transition-all duration-150 animate-bounce">
                {hoveredDay}: <strong className="font-bold">{trafficData.find(d => d.day === hoveredDay)?.views}</strong> sessions
              </span>
            ) : (
              <span className="text-xs text-[#494551] italic">Hover columns for precise statistics</span>
            )}
          </div>

          <div className="h-32 flex items-end justify-between gap-2.5 md:gap-4 px-2">
            {trafficData.map((d) => (
              <div
                key={d.day}
                onMouseEnter={() => setHoveredDay(d.day)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{ height: d.height }}
                className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer ${
                  hoveredDay === d.day
                    ? "bg-[#4f378a] shadow-md shadow-[#4f378a]/30"
                    : "bg-[#4f378a]/40 hover:bg-[#4f378a]/70"
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-2.5 px-2 border-t border-[#cbc4d2]/30 pt-1.5">
            {trafficData.map((d) => (
              <span key={d.day} className="text-xs font-semibold text-[#494551]">
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="bg-white border border-[#cbc4d2] rounded-xl p-5 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-[#1d1b20] uppercase tracking-wider">Recent Activity</h3>
          <button 
            onClick={() => onNavigate("drafts")}
            className="text-xs font-bold text-[#4f378a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            See all posts
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {activities.map((act) => {
            const isPublished = act.type === "published";
            const isDraft = act.type === "draft";
            const isSubscriber = act.type === "subscriber";
            const isFlagged = act.type === "flagged";

            return (
              <div 
                key={act.id} 
                className="bg-[#f8f2fa] p-3 rounded-lg flex items-center gap-3 border border-[#cbc4d2]/40 hover:bg-[#f2ecf4] transition-colors"
              >
                {/* Icon mapping */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isPublished ? "bg-emerald-50 text-[#10b981]" :
                  isDraft ? "bg-[#e1d4fd] text-[#4f378a]" :
                  isSubscriber ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  {isPublished && <CheckCircle className="w-5 h-5" />}
                  {isDraft && <FileText className="w-5 h-5" />}
                  {isSubscriber && <UserPlus className="w-5 h-5" />}
                  {isFlagged && <AlertCircle className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#1d1b20] leading-tight shrink-0 truncate">
                    {act.title}
                  </h4>
                  <p className="text-xs text-[#494551] truncate">
                    {act.description}
                  </p>
                </div>

                <div className="text-[10px] font-semibold text-slate-500 shrink-0">
                  {act.time}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
