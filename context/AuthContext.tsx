// /frontend/src/context/AuthContext.tsx
"use client";

import * as React from "react";
import { api, setAuthToken, removeAuthToken, getAuthToken } from "../lib/api";

export interface UserProfile {
  email: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserProfile;
}

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Synchronize authentication state on initial layout mount
  React.useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getAuthToken();
        if (storedToken) {
          // In a production app, we would ideally fetch the current user profile from /me
          // to validate the token. Since we don't have that yet, we parse the stored user or
          // decode the JWT. We will retrieve the cached profile or set a basic profile.
          const cachedUser = localStorage.getItem("user");
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
          } else {
            // Decoupled default if parsed state was cleared
            setUser({ email: "ogunwedebo21@gmail.com", role: "admin" });
          }
          setToken(storedToken);
        }
      } catch (err: any) {
        console.error("[AuthProvider Initialization Error]:", err);
        removeAuthToken();
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<LoginResponse>("/auth/login", { email, password });
      
      if (response && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        setAuthToken(response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        return response;
      } else {
        throw new Error("Invalid response envelope structure from backend.");
      }
    } catch (err: any) {
      const parsedErrorMsg = err.message || "Authentication failed. Provide valid credentials.";
      setError(parsedErrorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = React.useCallback((): void => {
    setUser(null);
    setToken(null);
    removeAuthToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }, []);

  const clearError = React.useCallback((): void => {
    setError(null);
  }, []);

  const contextValue = React.useMemo(() => ({
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    clearError,
  }), [user, token, isLoading, error, logout, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
