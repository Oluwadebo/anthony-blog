// /frontend/src/hooks/useAuth.ts
"use client";

import * as React from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

/**
 * Custom Hook for accessing Authentication session state and handler triggers.
 * Must be executed within descendant trees of AuthProvider component.
 */
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error(
      "[useAuth Hook Failure]: useAuth must be consumed helper inside an AuthProvider element."
    );
  }

  return context;
};
