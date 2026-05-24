// context/SiteContext.tsx
"use client";
import * as React from "react";
import { SERVER_API_URL } from "../lib/api";
import { createContext, useContext, useState } from "react";

// const SiteContext = createContext({
//   siteName: "Anthony Blog",
//   updateSiteName: (name: string) => {},
// });
const SiteContext = React.createContext<any>(null);

export function SiteProvider({
  children,
  initialName,
}: {
  children: React.ReactNode;
  initialName: string;
}) {
  // const [siteName, setSiteName] = useState(initialName);

  const [siteName, setSiteName] = React.useState("Loading..."); // Handle loading state

  React.useEffect(() => {
    const fetchSiteName = async () => {
      try {
        const res = await fetch(`${SERVER_API_URL}/settings`);
        const data = await res.json();
        if (data?.settings?.siteName) {
          setSiteName(data.settings.siteName);
        }
      } catch (error) {
        console.error("Failed to fetch site name:", error);
        setSiteName("Anthony Blog"); // Fallback on error
      }
    };
    fetchSiteName();
  }, []);
  
  return (
    <SiteContext.Provider value={{ siteName, updateSiteName: setSiteName }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
