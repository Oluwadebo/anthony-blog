import * as React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

async function getSiteName(): Promise<string> {
  const defaultName = "Anthony Blog";
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = publicApiUrl || "http://localhost:5000/api";
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const res = await fetch(`${apiUrl}/settings`, {
      signal: controller.signal,
      next: { revalidate: 30 } // Cache results for 30 seconds
    });
    
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.settings && data.settings.siteName) {
        return data.settings.siteName;
      }
    }
  } catch (error: any) {
    console.warn("Failed to retrieve dynamic siteName during server-rendering, fallback to default.", error.message || error);
  }
  return defaultName;
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteName = await getSiteName();

  return (
    <>
      <Navbar siteName={siteName} />

      {/* Core App Display Canvas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {children}
      </main>

      <Footer siteName={siteName} />
    </>
  );
}
