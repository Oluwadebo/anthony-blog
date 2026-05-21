'use client';

import * as React from "react";
import { User, Shield, Key, Eye, CheckCircle, RefreshCw } from "lucide-react";

export default function AccountTab() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (nextTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <section className="bg-white border border-[#cbc4d2] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#4f378a]/30 shadow-sm shrink-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuArimo4U5FgI8lcu6b2F4pc2-CZ_jdsdQgv-gwZ-oEp3MHkTyhNMm7fAJklekM1AEfjaTXCtuGmft-MkniU3GpP8RYPj9MDBSOjWOTFhtgvvTgHEA7pkTQGRugCJYrgSq8xMn_zK850eP5GXqSmS5_54fa6WjniUYM_yIU0ezgwUnK7k0bZ_VianTIl6B-Fu081h3cgnpSWQOQsoecapKFwNSE9Sb3EeuXeV6JS-C-XL7l09vD033ZIwFDQKGUfOzMq8XS6fr9xXna_"
            alt="Elena Vance"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left min-w-0 flex-1">
          <h2 className="text-xl font-bold text-[#1d1b20] font-sans">Elena Vance</h2>
          <p className="text-xs text-[#4f378a] font-bold tracking-wider uppercase mt-0.5">Senior Chief Editor</p>
          <p className="text-xs text-[#494551] mt-1 font-semibold truncate">ogunwedebo21@gmail.com</p>
        </div>
        
        {/* Connection status */}
        <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide shrink-0">
          <Shield className="w-3.5 h-3.5" />
          ADMIN AUTHENTICATED
        </div>
      </section>

      {/* Admin Panel Specific details */}
      <section className="bg-white border border-[#cbc4d2] rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#1d1b20] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#cbc4d2]/30 pb-2">
          <User className="w-4 h-4 text-[#4f378a]" />
          PublisherCMS Credentials
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-[#494551] leading-relaxed">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#494551]/60">Login Address</span>
            <p className="bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-lg p-2.5 text-[#1d1b20] select-all font-mono">
              ogunwedebo21@gmail.com
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#494551]/60">Temporary Password Key</span>
            <p className="bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-lg p-2.5 text-[#1d1b20] select-all font-mono">
              ogunwedebo21
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <span className="text-[10px] uppercase font-bold text-[#494551]/60">JWT Signature Salt Token</span>
            <p className="bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-lg p-2.5 text-[#1d1b20] select-all font-mono">
              quick_wash_secret_9
            </p>
          </div>
        </div>
      </section>

      {/* Preferences panel */}
      <section className="bg-white border border-[#cbc4d2] rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#1d1b20] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#cbc4d2]/30 pb-2">
          <Shield className="w-4 h-4 text-[#4f378a]" />
          Preferences & Operations
        </h3>

        <div className="space-y-3.5">
          {/* Theme Toggler */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-[#1d1b20] font-sans">Visual Themes</p>
              <p className="text-[10px] text-[#494551]">Toggle between soft light-mode lavender and eye-care dark mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="bg-[#f2ecf4] border border-[#cbc4d2] hover:bg-[#e1d4fd] text-[#4f378a] px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {theme === "light" ? "Enact Dark Style" : "Enact Light Style"}
            </button>
          </div>

          {/* Core capability audit */}
          <div className="flex justify-between items-center border-t border-[#cbc4d2]/20 pt-3.5">
            <div>
              <p className="text-xs font-bold text-[#1d1b20] font-sans">Server AI Modules</p>
              <p className="text-[10px] text-[#494551]">Verification state of Gemini AI models on Cloud Run nodes.</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-[10px] font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              gemini-3.5-flash ACTIVE
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
