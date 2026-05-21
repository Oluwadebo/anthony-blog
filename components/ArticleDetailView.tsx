'use client';

import * as React from "react";
import { Article, Comment } from "./types";
import { ArrowLeft, Share2, Eye, ChevronDown } from "lucide-react";

interface ArticleDetailViewProps {
  article: Article;
  articles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onUpdateArticleLikes: (articleId: string, deltaLikes: number, deltaDislikes: number) => void;
  onAddComment: (articleId: string, comment: string) => void;
}

export default function ArticleDetailView({
  article,
  articles,
  onBack,
  onSelectArticle,
  onUpdateArticleLikes,
  onAddComment,
}: ArticleDetailViewProps) {
  const [commentText, setCommentText] = React.useState("");
  const [hasLiked, setHasLiked] = React.useState<"up" | "down" | null>(null);

  // Derive related articles
  const relatedArticles = React.useMemo(() => {
    return articles
      .filter((a) => a.id !== article.id && a.status === "Published")
      .slice(0, 2);
  }, [articles, article]);

  const handleLike = () => {
    if (hasLiked === "up") {
      // Undo like
      onUpdateArticleLikes(article.id, -1, 0);
      setHasLiked(null);
    } else if (hasLiked === "down") {
      // Switch from dislike to like
      onUpdateArticleLikes(article.id, 1, -1);
      setHasLiked("up");
    } else {
      onUpdateArticleLikes(article.id, 1, 0);
      setHasLiked("up");
    }
  };

  const handleDislike = () => {
    if (hasLiked === "down") {
      // Undo dislike
      onUpdateArticleLikes(article.id, 0, -1);
      setHasLiked(null);
    } else if (hasLiked === "up") {
      // Switch from like to dislike
      onUpdateArticleLikes(article.id, -1, 1);
      setHasLiked("down");
    } else {
      onUpdateArticleLikes(article.id, 0, 1);
      setHasLiked("down");
    }
  };

  const handlePostCommentSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(article.id, commentText);
    setCommentText("");
  };

  // Safe share trigger toast simulation
  const [shareToastVisible, setShareToastVisible] = React.useState(false);
  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch {}
    setShareToastVisible(true);
    setTimeout(() => {
      setShareToastVisible(false);
    }, 2500);
  };

  const contentParagraphs = article.content.split("\n\n");
  const firstParagraph = contentParagraphs[0] || "";
  const otherParagraphs = contentParagraphs.slice(1);

  // We split the drop cap character
  const dropCap = firstParagraph.charAt(0);
  const remainingFirstParagraph = firstParagraph.slice(1);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top bar back links */}
      <section className="flex justify-between items-center border-b border-[#cbc4d2]/30 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 cursor-pointer text-[#4f378a] hover:text-[#322f35] font-sans font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Feed</span>
        </button>
        <span className="font-sans font-bold text-[#4f378a] tracking-tight">
          PublisherCMS
        </span>
      </section>

      {/* Hero Banner image with title overlay */}
      <section className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
        <img
          src={article.image}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-5">
          <span className="bg-[#4f378a] text-white px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-md mb-2 w-max">
            {article.category}
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-sans text-white leading-tight">
            {article.title}
          </h2>
        </div>
      </section>

      {/* Author Details metadata */}
      <section className="bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#cbc4d2] bg-slate-100 shrink-0">
            <img
              src={article.authorImage}
              alt={article.author}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-sans text-sm font-bold text-[#1d1b20]">{article.author}</p>
            <p className="text-[10px] font-semibold text-[#494551] uppercase">
              {article.date} • {article.readTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[#494551] font-bold shrink-0">
          <div className="flex flex-col items-center">
            <Eye className="w-4 h-4 text-[#4f378a]" />
            <span className="text-[10px] mt-0.5">{article.views >= 1000 ? `${(article.views/1000).toFixed(1)}k` : article.views}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex flex-col items-center hover:text-[#4f378a] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] mt-0.5">Share</span>
          </button>
        </div>
      </section>

      {/* Shared URL toast simulation notifications */}
      {shareToastVisible && (
        <div className="bg-emerald-700 text-white rounded-lg px-4 py-2.5 text-xs text-center font-bold tracking-wide animate-pulse">
          📋 Article reference link copied to clipboard!
        </div>
      )}

      {/* Article Typography Prose content */}
      <article className="font-serif text-[#494551] text-base leading-relaxed tracking-wide serif-content pr-1 space-y-4">
        {/* Paragraph 1 with Drop Cap */}
        <p className="relative">
          <span className="text-4xl font-extrabold text-[#4f378a] mr-2 float-left leading-none font-sans pt-1">
            {dropCap}
          </span>
          {remainingFirstParagraph}
        </p>

        {otherParagraphs.map((para, idx) => {
          // Render blockquote if paragraph is styled like a quote
          if (para.includes("scaffolding") || para.startsWith('"') || para.startsWith("Content is King")) {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-[#4f378a] bg-[#f2ecf4] px-4 py-3 my-6 rounded-r-lg font-sans text-sm italic text-[#1d1b20] leading-normal"
              >
                {para}
              </blockquote>
            );
          }
          return <p key={idx}>{para}</p>;
        })}
      </article>

      {/* Active Ratings feedback upvote/downvote */}
      <section className="py-4 border-y border-[#cbc4d2]/30 flex justify-center gap-8 bg-white/40 rounded-xl">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 group active:scale-95 transition-transform cursor-pointer px-4 py-1.5 rounded-full ${
            hasLiked === "up" ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-300" : "hover:bg-[#f2ecf4]"
          }`}
        >
          <div className="w-9 h-9 border border-[#cbc4d2] rounded-full flex items-center justify-center bg-white group-hover:bg-[#f2ecf4] shrink-0">
            <span className={`text-sm ${hasLiked === "up" ? "text-emerald-700 font-bold" : "text-[#494551]"}`}>👍</span>
          </div>
          <span className="text-xs">{article.likes}</span>
        </button>

        <button
          onClick={handleDislike}
          className={`flex items-center gap-2 group active:scale-95 transition-transform cursor-pointer px-4 py-1.5 rounded-full ${
            hasLiked === "down" ? "bg-red-50 text-red-700 font-bold border border-red-300" : "hover:bg-[#f2ecf4]"
          }`}
        >
          <div className="w-9 h-9 border border-[#cbc4d2] rounded-full flex items-center justify-center bg-white group-hover:bg-[#f2ecf4] shrink-0">
            <span className={`text-sm ${hasLiked === "down" ? "text-red-700 font-bold" : "text-[#494551]"}`}>👎</span>
          </div>
          <span className="text-xs">{article.dislikes}</span>
        </button>
      </section>

      {/* Tag lists chips */}
      <section className="flex flex-wrap gap-2 py-1">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-[#ece6ee] text-[#1d1b20] text-xs font-semibold rounded-full border border-[#cbc4d2]/40 cursor-default"
          >
            {tag}
          </span>
        ))}
      </section>

      {/* Related Reading asymmetrical list widget */}
      {relatedArticles.length > 0 && (
        <section className="bg-white border border-[#cbc4d2] rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#4f378a] uppercase tracking-wider">
            Related Reading
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="border border-[#cbc4d2]/40 rounded-xl overflow-hidden flex shadow-xs cursor-pointer active:scale-98 hover:bg-[#f8f2fa] transition-all"
              >
                <div className="w-1/3 aspect-square shrink-0">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-[#4f378a] uppercase tracking-wider">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-xs text-[#1d1b20] mt-1 line-clamp-2 leading-tight">
                    {art.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Comments Module */}
      <section className="border-t border-[#cbc4d2]/30 pt-6 space-y-4">
        <div className="flex items-center justify-between font-sans">
          <h3 className="text-lg font-bold text-[#1d1b20]">
            Comments ({article.comments.length})
          </h3>
          <button className="text-[#4f378a] hover:text-[#1d1b20] text-xs font-bold flex items-center gap-0.5 cursor-pointer">
            Newest
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Comment Input */}
        <div className="flex gap-3 mb-6 font-sans">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#cbc4d2] bg-slate-100 shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArimo4U5FgI8lcu6b2F4pc2-CZ_jdsdQgv-gwZ-oEp3MHkTyhNMm7fAJklekM1AEfjaTXCtuGmft-MkniU3GpP8RYPj9MDBSOjWOTFhtgvvTgHEA7pkTQGRugCJYrgSq8xMn_zK850eP5GXqSmS5_54fa6WjniUYM_yIU0ezgwUnK7k0bZ_VianTIl6B-Fu081h3cgnpSWQOQsoecapKFwNSE9Sb3EeuXeV6JS-C-XL7l09vD033ZIwFDQKGUfOzMq8XS6fr9xXna_"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your rich perspective to the conversation..."
              rows={2}
              className="w-full bg-[#f2ecf4] border border-[#cbc4d2] rounded-xl p-3 text-xs md:text-sm focus:ring-2 focus:ring-[#e1d4fd] focus:border-[#4f378a] focus:bg-white outline-none transition-all font-sans leading-relaxed"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handlePostCommentSubmit}
                disabled={!commentText.trim()}
                className="bg-[#4f378a] text-white hover:bg-[#6750a4] text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-all disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Comments Feed list */}
        <div className="space-y-4 font-sans">
          {article.comments.length === 0 ? (
            <p className="text-xs text-[#494551] italic text-center py-6">
              No perspectives posted yet. Be the first to start the dialog!
            </p>
          ) : (
            article.comments.map((comm) => (
              <div key={comm.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#cbc4d2]/40 bg-slate-100 shrink-0">
                  <img
                    src={comm.avatar}
                    alt={comm.author}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-[#1d1b20]">{comm.author}</h5>
                    <span className="text-[10px] text-[#494551] font-semibold">{comm.time}</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#494551] leading-relaxed pt-0.5">
                    {comm.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-[10px] text-[#494551] font-bold pt-1">
                    <button className="flex items-center gap-1 hover:text-[#4f378a] cursor-pointer">
                      <span>👍</span> {comm.likes}
                    </button>
                    <button className="hover:underline cursor-pointer">Reply</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
