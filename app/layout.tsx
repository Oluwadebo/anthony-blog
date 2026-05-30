// /app/layout.tsx
import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "next-themes";
import { getSiteName } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anthony Blog - High-Fidelity Publisher CMS",
  description: "A dark-themed, sleek publishing medium. Secure administrative dashboard, image-uploader module, and fully responsive blog nodes.",
  openGraph: {
    images: ["https://anthony-blog-amber.vercel.app/og.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteName = await getSiteName();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>

              {children}

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
