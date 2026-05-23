// /app/login/page.tsx
"use client";

import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const { login, error, clearError, isLoading, user } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  // Clear errors on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationError) setValidationError(null);
    clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationError) setValidationError(null);
    clearError();
  };

  // Safe client redirect or route actions
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    // 1. Client-side input validations
    if (!email.trim()) {
      setValidationError("Please enter your account email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email format.");
      return;
    }

    if (!password) {
      setValidationError("Please enter your account password.");
      return;
    }

    if (password.length < 5) {
      setValidationError("Passwords are minimum 5 characters long.");
      return;
    }

    // 2. Perform API authentication call
    try {
      await login(email.trim(), password);
      // Success triggers dynamic UI completion before redirection state
      setLoginSuccess(true);

      // Delay redirection slightly so user sees success feedback
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/admin";
        }
      }, 1200);
    } catch (err: any) {
      console.error("[Login Submission Exec Failure]:", err);
    }
  };

  // If already logged in, show helpful greeting or redirection hint
  React.useEffect(() => {
    if (user && !loginSuccess) {
      // Auto-reroute since they hold a valid active session already
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/admin";
        }
      }, 1000);
    }
  }, [user, loginSuccess]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-white selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Abstract brand icon */}
        <Link href="/">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/20">
            <span className="font-mono text-xl font-black text-neutral-950">
              A
            </span>
          </div>
        </Link>

        <h2 className="mt-6 text-sm font-mono tracking-widest text-emerald-400 uppercase">
          PUBLISHER CMS GATEWAY
        </h2>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Anthony Blog
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Enter credentials securely to enter administrative terminal nodes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 py-8 px-4 border border-neutral-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:px-10 relative overflow-hidden">
          {/* Subtle brand glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />

          {/* Alert Displays */}
          {(error || validationError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm animate-pulse-subtle flex flex-col gap-1">
              <span className="font-semibold text-red-200">System Warning</span>
              <span>{validationError || error}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex flex-col gap-1">
              <span className="font-semibold text-emerald-200">
                Access Granted
              </span>
              <span>
                Session verified securely. Directing to admin dashboard
                modules...
              </span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono tracking-wider text-neutral-400 uppercase"
              >
                Admin Email Address
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="block w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 placeholder-neutral-600 font-sans"
                  placeholder="name@anthonyblog.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono tracking-wider text-neutral-400 uppercase"
              >
                Secure Passkey
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm transition-all text-neutral-100 placeholder-neutral-600 font-sans"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500/30 border-neutral-850 rounded bg-neutral-950"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-neutral-400 font-sans select-none"
                >
                  Keep terminal session authorized
                </label>
              </div>

              <div className="text-xs">
                <a
                  href="#"
                  className="font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Lost Key?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || loginSuccess}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-emerald-500/10 rounded-xl text-sm font-semibold text-neutral-950 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/35 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>Decrypt Terminal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick seeded test credential pill */}
          <div className="mt-8 border-t border-neutral-850/50 pt-6 text-center">
            <span className="inline-flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono text-neutral-500">
              <span>Primary Admin seeded credentials setup is active.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
