// /components/Navbar.tsx
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { name: "Stories", href: "/" },
  { name: "Categories", href: "#categories" },
  { name: "About", href: "#about" },
];

export default function Navbar({
  siteName: initialSiteName = "Anthony Blog",
}: {
  siteName?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [siteName] = React.useState(initialSiteName);

  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    // Zero-timeout macro-task tick prevents React hydration mismatches
    const timer = setTimeout(() => setMounted(true), 0);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Elegant text splitting for structural layout styling
  const firstLetter = siteName ? siteName[0] : "A";
  const [firstPart, ...rest] = siteName.split(" ");
  const secondPart = rest.join(" ") || "";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/20 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 py-3 shadow-xl shadow-zinc-900/5"
          : "bg-transparent py-6",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* --- LOGO SECTION --- */}
        <Link href="/" className="flex items-center space-x-4 group h-12">
          <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-105">
            <div className="absolute inset-0 bg-emerald-500 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-700 blur-[4px] opacity-20" />
            <div className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white dark:text-zinc-950 font-black text-xl">
                {firstLetter}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
              {firstPart}{" "}
              {secondPart && (
                <span className="text-emerald-500">{secondPart}</span>
              )}
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-1">
              Intelligence & Design
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center space-x-10">
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group/link",
                  pathname === link.href
                    ? "text-emerald-500"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
                )}
              >
                {link.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[1.5px] bg-emerald-500 transition-all duration-300",
                    pathname === link.href
                      ? "w-full"
                      : "w-0 group-hover/link:w-full",
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

          {/* Action Systems */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Toggle Layout Theme"
            >
              {mounted &&
                (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </button>

            <Search
              size={18}
              className="text-zinc-400 cursor-pointer hover:text-emerald-500 transition-colors"
            />

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full group transition-all hover:bg-emerald-500/20"
                >
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">
                    {user.email?.[0]?.toUpperCase() || "A"}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-650 dark:text-emerald-450">
                    Console
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1 px-2 border border-neutral-800 hover:border-red-500/30 rounded-lg text-xs font-mono tracking-wide text-neutral-400 hover:text-red-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  title="Sign out of Admin Session"
                >
                  <LogOut size={12} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center group hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-all shadow-md"
              >
                <User className="w-4 h-4 text-white dark:text-zinc-900 transition-colors group-hover:text-white" />
              </Link>
            )}
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button
          className="lg:hidden text-zinc-900 dark:text-white p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE DRAWER LAYOUT --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "block text-2xl font-black uppercase tracking-tighter",
                    pathname === link.href
                      ? "text-emerald-500"
                      : "text-zinc-900 dark:text-white",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-neutral-400">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer"
                >
                  {mounted &&
                    (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
                  Toggle Theme
                </button>

                <div className="flex items-center gap-4">
                  <Link
                    href={user ? "/admin" : "/login"}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={14} />
                    {user ? "Console" : "Admin Login"}
                  </Link>
                  {user && (
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1"
                    >
                      <LogOut size={12} />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
