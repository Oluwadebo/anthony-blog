// /components/Footer.tsx
"use client";

import * as React from "react";
import Link from "next/link";

export default function Footer({ siteName = "Anthony Blog" }: { siteName?: string }) {
  const currentYear = new Date().getFullYear();

  // Extract first letter for the stylized logo block
  const firstLetter = siteName ? siteName[0] : "A";

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* --- BRANDING BLOCK --- */}
          <div className="col-span-1 md:col-span-5">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative w-8 h-8 transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-emerald-500 rounded rotate-6 group-hover:rotate-12 transition-transform duration-700 blur-[2px] opacity-20" />
                <div className="absolute inset-0 bg-zinc-900 dark:bg-white rounded flex items-center justify-center shadow-sm">
                  <span className="text-white dark:text-zinc-950 font-black text-sm">{firstLetter}</span>
                </div>
              </div>
              <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
                {siteName}
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 text-sm leading-relaxed">
              A modern editorial archive dedicated to the intersection of synthetic intelligence, high design, and the evolving narrative form.
            </p>
          </div>

          {/* --- COLUMN 1: EXPLORATION --- */}
          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h4 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400 dark:text-zinc-500 mb-6">Exploration</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link href="/" className="text-zinc-500 hover:text-emerald-500 transition-colors">Stories</Link></li>
              <li><Link href="/#categories" className="text-zinc-500 hover:text-emerald-500 transition-colors">Categories</Link></li>
              <li><Link href="/#archive" className="text-zinc-500 hover:text-emerald-500 transition-colors">Archive</Link></li>
            </ul>
          </div>

          {/* --- COLUMN 2: SYSTEM --- */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400 dark:text-zinc-500 mb-6">System</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link href="/admin" className="text-zinc-500 hover:text-emerald-500 transition-colors">Admin Console</Link></li>
              <li><Link href="/login" className="text-zinc-500 hover:text-emerald-500 transition-colors">Admin Login</Link></li>
              <li><Link href="/privacy" className="text-zinc-500 hover:text-emerald-500 transition-colors">Privacy Protocols</Link></li>
            </ul>
          </div>

          {/* --- COLUMN 3: SOCIAL --- */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400 dark:text-zinc-500 mb-6">Connect</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><a href="#" className="text-zinc-500 hover:text-emerald-500 transition-colors">Twitter / X</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-emerald-500 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-emerald-500 transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM METADATA BAR --- */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 flex justify-center items-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">
            © {currentYear} {siteName}. All narratives protected.
          </p>
        </div>
      </div>
    </footer>
  );
}
