'use client';

import * as React from "react";
import { Article } from "./types";
import { X, Sparkles, Loader2, Save, Wand2 } from "lucide-react";

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onSave: (articleData: Partial<Article>) => void;
}

export default function ArticleEditorModal({ isOpen, onClose, article, onSave }: ArticleEditorModalProps) {
  const [title, setTitle] = React.useState(article ? article.title : "");
  const [category, setCategory] = React.useState(article ? article.category : "TECHNOLOGY");
  const [content, setContent] = React.useState(article ? article.content : "");
  const [tagsInput, setTagsInput] = React.useState(article ? article.tags.join(", ") : "");
  const [status, setStatus] = React.useState<"Published" | "Draft" | "Paused">(article ? article.status : "Draft");

  // AI states
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiFeedback, setAiFeedback] = React.useState<string | null>(null);

  // Handle Gemini AI trigger
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiFeedback(null);

    try {
      // Step 1: Request Scaffolding/Outline
      const contentRes = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "outline",
          prompt: aiPrompt,
          title: title || aiPrompt,
        }),
      });

      const contentData = await contentRes.json();

      if (contentData.error) {
        throw new Error(contentData.error);
      }

      // Append outline content to the editor content area
      const prevContent = content ? `${content}\n\n` : "";
      const generatedScaffolding = contentData.result || "";
      setContent(`${prevContent}${generatedScaffolding}`);

      // Step 2: Request Tag Suggestions
      const tagsRes = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest-tags",
          prompt: aiPrompt,
        }),
      });

      const tagsData = await tagsRes.json();
      if (tagsData.result && Array.isArray(tagsData.result)) {
        setTagsInput(tagsData.result.join(", "));
      }

      // If title was blank, let's use a nice slug
      if (!title) {
        // Simple capitalize title derivation
        setTitle(aiPrompt.substring(0, 50).replace(/^\w/, (c) => c.toUpperCase()));
      }

      setAiFeedback("Success! AI writing outline draft generated & tagged successfully.");
      setAiPrompt("");
    } catch (err: any) {
      console.error(err);
      setAiFeedback(`Error: ${err?.message || "AI Scaffolding was unable to compile. Please check your developer configurations."}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    // Validate inputs
    if (!title.trim()) {
      alert("Title is required before saving");
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    // Auto-calculate reading time based on 200 words per minute standard
    const wordsCount = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(wordsCount / 200));
    const calculatedReadTime = `${minutes} min read`;

    onSave({
      title,
      category: category.toUpperCase(),
      content,
      tags: tagsArray,
      status,
      readTime: calculatedReadTime,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1d1b20]/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white border border-[#cbc4d2] rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        id="editor-modal"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#cbc4d2]">
          <h3 className="font-bold text-lg text-[#1d1b20] font-sans flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#4f378a]" />
            {article ? "Edit Post Scaffolding" : "Write New Article"}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#494551] hover:bg-[#f2ecf4] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* AI Helper block */}
          <div className="bg-[#f2ecf4] border border-[#4f378a]/20 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5 text-[#4f378a]">
              <Wand2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-sans">Gemini AI Author Assistant</span>
            </div>
            
            <p className="text-xs text-[#494551]">
              Provide a prompt to automatically generate an structured, high-readability outline directly in your article body.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., Outline for 10 tips to speed up web database latency"
                disabled={isAiLoading}
                className="flex-1 bg-white border border-[#cbc4d2] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a]"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="bg-[#4f378a] text-white hover:bg-[#6750a4] text-xs font-bold transition-all px-3.5 py-2 rounded-lg shrink-0 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Assembling...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate
                  </>
                )}
              </button>
            </div>

            {aiFeedback && (
              <p className={`text-xs font-semibold ${aiFeedback.startsWith("Error") ? "text-red-600" : "text-emerald-700"}`}>
                {aiFeedback}
              </p>
            )}
          </div>

          {/* Core Fields */}
          <div className="space-y-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#494551] uppercase tracking-wider">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., The Psychology of UX and Whitespace"
                className="w-full bg-white border border-[#cbc4d2] rounded-lg px-3-4 py-2 text-sm focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a]"
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#494551] uppercase tracking-wider">Category Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white border border-[#cbc4d2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4f378a]"
                >
                  <option value="TECHNOLOGY">TECHNOLOGY</option>
                  <option value="DESIGN">DESIGN</option>
                  <option value="STRATEGY">STRATEGY</option>
                  <option value="ARCHITECTURE">ARCHITECTURE</option>
                  <option value="ENGINEERING">ENGINEERING</option>
                  <option value="ANALYTICS">ANALYTICS</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#494551] uppercase tracking-wider">Publish State</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="bg-white border border-[#cbc4d2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4f378a]"
                >
                  <option value="Draft">Draft (In-progress)</option>
                  <option value="Published">Published (Live feed)</option>
                  <option value="Paused">Paused (On Hold)</option>
                </select>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#494551] uppercase tracking-wider">Content Body</label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your rich thoughts or use the generative assistant above..."
                className="w-full bg-white border border-[#cbc4d2] rounded-lg p-3 text-sm focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a] font-serif leading-relaxed"
              />
            </div>

            {/* Tags tags */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#494551] uppercase tracking-wider">Search Keywords / Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="#cms, #design, #strategy"
                className="w-full bg-white border border-[#cbc4d2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a]"
              />
              <p className="text-[10px] text-[#494551] italic">
                Tags automatically update as hash-anchored SEO keywords.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#cbc4d2] bg-[#f8f2fa] flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#cbc4d2] text-[#494551] text-xs font-semibold rounded-lg hover:bg-[#f2ecf4] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#4f378a] text-white hover:bg-[#6750a4] px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {article ? "Update Article" : "Save and File"}
          </button>
        </div>
      </div>
    </div>
  );
}
