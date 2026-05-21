// /app/admin/settings/page.tsx
"use client";

import * as React from "react";
import { api } from "../../../lib/api";
import { 
  Settings, 
  Save, 
  Loader2, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Undo
} from "lucide-react";
import Link from "next/link";

interface SettingsFetchResponse {
  success: boolean;
  settings: {
    siteName: string;
    updatedAt: string;
  };
}

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState("");
  const [initialSiteName, setInitialSiteName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  // 1. Fetch current settings upon load
  React.useEffect(() => {
    let active = true;
    
    const fetchSettings = async () => {
      try {
        const data = await api.get<SettingsFetchResponse>("/settings");
        if (active && data && data.success && data.settings) {
          setSiteName(data.settings.siteName);
          setInitialSiteName(data.settings.siteName);
        }
      } catch (error: any) {
        if (active) {
          console.error("Failed to load settings:", error);
          setStatus({
            type: "error",
            message: error.message || "Failed to retrieve the current site configurations."
          });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      active = false;
    };
  }, []);

  // 2. Submit new settings via PUT request
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) {
      setStatus({ type: "error", message: "Site name cannot be empty." });
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      const result = await api.put<{ success: boolean; message: string; settings: any }>("/settings", {
        siteName: siteName.trim()
      });

      if (result && result.success) {
        setStatus({
          type: "success",
          message: result.message || "Site configurations saved successfully!"
        });
        setInitialSiteName(siteName.trim());
        
        // Trigger a custom event to notify components that branding has shifted
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("siteSettingsUpdated"));
        }
      }
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      setStatus({
        type: "error",
        message: error.message || "Failed to submit settings changes to backend."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-emerald-500 animate-[spin_8s_linear_infinite]" />
            Site Configurations
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Configure dynamic publication-wide values, administrative metadata, and brand names.
          </p>
        </div>
        <Link 
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 rounded-xl text-xs font-mono tracking-wide text-neutral-300 transition-colors"
        >
          <Undo size={14} />
          <span>Back to Console</span>
        </Link>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-900">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-neutral-500 text-xs font-mono">Retuning core site configurations...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Status Message Banners */}
          {status && (
            <div 
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                status.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              <div className="text-sm">
                <span className="font-semibold block uppercase tracking-wider text-[10px] mb-0.5 font-mono">
                  {status.type === "success" ? "Operation Success" : "Service Error Alert"}
                </span>
                <p className="opacity-90">{status.message}</p>
              </div>
            </div>
          )}

          {/* Primary settings settings fields card */}
          <div className="p-6 md:p-8 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight pb-3 border-b border-neutral-850/50 flex items-center gap-2">
              <FileText size={18} className="text-zinc-500" />
              Brand Identity
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label 
                  htmlFor="siteName" 
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono"
                >
                  Site Display Name
                </label>
                <input
                  id="siteName"
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Anthony Blog"
                  className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 outline-none transition-all font-sans"
                  required
                  disabled={isSaving}
                />
                <p className="text-neutral-500 text-[10px] sm:text-xs leading-relaxed">
                  This sets the primary branding signature displayed in the Navbar, Footer, page titles, and other dynamic site interfaces.
                </p>
              </div>
            </div>
          </div>

          {/* Core submit buttons container */}
          <div className="flex items-center justify-between p-6 bg-neutral-900/20 rounded-2xl border border-neutral-900/50">
            <span className="text-[10px] md:text-xs font-mono text-neutral-600 uppercase tracking-widest hidden sm:inline">
              {siteName !== initialSiteName ? "* Unsaved adjustments pending" : "CMS parameters synchronised"}
            </span>
            <div className="flex gap-4 w-full sm:w-auto ml-auto">
              <button
                type="button"
                onClick={() => setSiteName(initialSiteName)}
                disabled={isSaving || siteName === initialSiteName}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 text-xs font-mono tracking-wide text-neutral-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent disabled:pointer-events-none"
              >
                Reset Setup
              </button>
              <button
                type="submit"
                disabled={isSaving || !siteName.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} className="text-neutral-950" />
                    <span>Save Brand Config</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
