// context/SiteContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SiteContext = createContext({
  siteName: "Anthony Blog",
  updateSiteName: (name: string) => {},
});

export function SiteProvider({
  children,
  initialName,
}: {
  children: React.ReactNode;
  initialName: string;
}) {
  const [siteName, setSiteName] = useState(initialName);

  useEffect(() => {
    setSiteName(initialName);
  }, [initialName]);
  return (
    <SiteContext.Provider value={{ siteName, updateSiteName: setSiteName }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
