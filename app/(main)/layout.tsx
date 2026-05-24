import * as React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { SiteProvider } from "../../context/siteprovide";


async function getSiteName(): Promise<string> {
  const defaultName = "Anthony Blog";
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = publicApiUrl || "https://anthony-blog-dpl6.onrender.com" || "http://localhost:5000" ;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const res = await fetch(`${apiUrl}/api/settings`, {
      signal: controller.signal,
      next: { revalidate: 0 } // Cache results for 0 seconds
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
    <SiteProvider initialName={siteName}>
      <Navbar/>

      {/* Core App Display Canvas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {children}
      </main>

      <Footer />
    </SiteProvider>
    </>
  );
}
