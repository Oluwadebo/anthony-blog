// /app/(admin)/layout.tsx
"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  LogOut, 
  Menu, 
  X, 
  Shield,
  ArrowLeft,
  Settings
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Secure sign out trigger
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Posts",
      path: "/admin/posts",
      icon: FileText,
    },
    {
      name: "Media Upload",
      path: "/admin/media",
      icon: Upload,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased flex flex-col md:flex-row">
        
        {/* Mobile Header Top Navigation Panel */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-850 z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-mono font-black text-neutral-950 text-sm">
              A
            </div>
            <span className="font-mono text-xs font-bold tracking-widest text-neutral-300">
              ANTHONY CMS
            </span>
          </div>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-850 rounded-lg focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Sidebar Component (Desktop Mode and Mobile Drawer Overlay) */}
        <aside
          className={`
            fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-850 z-40 flex flex-col justify-between
            transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static md:h-screen md:flex-shrink-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Top segment containing brand signature */}
          <div>
            <div className="h-16 flex items-center gap-3 px-6 border-b border-neutral-850/50">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)] border border-emerald-400/15 group-hover:scale-102 transition-transform">
                <span className="font-mono text-base font-black text-neutral-950">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold tracking-widest text-emerald-400 leading-none">
                  ADMIN NODE
                </span>
                <span className="text-sm font-extrabold tracking-tight text-white mt-0.5">
                  Anthony Blog
                </span>
              </div>
            </div>

            {/* Main sidebar links container */}
            <nav className="mt-8 px-4 space-y-1.5 text-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group duration-200 text-left
                      ${isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 shadow-[inset_0_1px_1px_rgba(16,185,129,0.1)]" 
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850/50 border border-transparent"}
                    `}
                  >
                    <IconComponent className={`
                      h-4 w-4 transition-transform group-hover:scale-105 duration-200
                      ${isActive ? "text-emerald-400" : "text-neutral-500 group-hover:text-neutral-300"}
                    `} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom user credentials panel with Sign Out & Return to Public Site buttons */}
          <div className="p-4 border-t border-neutral-850/50 space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 bg-neutral-950/40 rounded-xl border border-neutral-850/30">
              <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                <Shield className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-neutral-200 truncate font-sans">
                  {user?.email || "ogunwedebo21@gmail.com"}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider leading-none mt-0.5">
                  {user?.role || "SYSTEM ADMIN"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                href="/"
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all group"
              >
                <ArrowLeft className="h-4 w-4 text-emerald-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>Return to Public Site</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-all group"
              >
                <LogOut className="h-4 w-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                <span>Disconnect Terminal</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop overlay panel shown in mobile navigation state */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-30 md:hidden"
          />
        )}

        {/* Primary Page Content Wrapper Panel */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>

      </div>
    </ProtectedRoute>
  );
}
