// /frontend/src/components/ProtectedRoute.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading, user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !token && !user) {
      // Redirect to login if user session is absent
      router.push("/login");
    }
  }, [token, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center font-sans text-neutral-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-mono tracking-wider text-emerald-400 uppercase">
              Verifying Terminal Integrity
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Establishing secure handshake with administration node...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If loading has finished but no credentials exist, we are redirecting, return null to remain clean
  if (!token && !user) {
    return null;
  }

  // Authenticated! Safe to display page content
  return <>{children}</>;
}
