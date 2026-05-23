// /frontend/src/lib/api.ts

const isServer = typeof window === "undefined";
// const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

// const BASE_URL = isServer
//   ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
//   : "/api";

const SERVER_API_URL = process.env.API_BASE_URL || "https://anthony-blog-dpl6.onrender.com/api" || "http://localhost:5000/api" ;

// Client-side calls should always use the proxy (relative path)
const BASE_URL = isServer ? SERVER_API_URL : "/api";

export class APIError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Safely retrieves the JWT token from browser localStorage.
 * Accounts for Next.js SSR environment where 'window' is undefined.
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error(
        "[API Get Token Exception]: Failed to read token from localStorage.",
        error,
      );
      return null;
    }
  }
  return null;
};

/**
 * Safely persists the JWT token to browser localStorage.
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error(
        "[API Set Token Exception]: Failed to write token to localStorage.",
        error,
      );
    }
  }
};

/**
 * Safely removes the JWT token from browser localStorage (logout).
 */
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error(
        "[API Remove Token Exception]: Failed to remove token from localStorage.",
        error,
      );
    }
  }
};

interface RequestOptions extends RequestInit {
  bypassToken?: boolean;
}

/**
 * Base fetch client wrapper with automatic authorization and error interception.
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    bypassToken = false,
    headers: customHeaders,
    ...remainingOptions
  } = options;

  // Build the target absolute URL
  const targetUrl = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  // Initialize unified headers signature
  const headers = new Headers(customHeaders);

  // Auto-inject Authorization header if a token resides in client storage
  if (!bypassToken) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Set Content-Type default as application/json unless sending multipart form-data (which needs native boundary)
  if (
    !(remainingOptions.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const finalConfig: RequestInit = {
    ...remainingOptions,
    headers,
  };

  try {
    const response = await fetch(targetUrl, finalConfig);

    // Parse JSON safely or return text/empty on blank bodies
    let responseData: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = text ? { message: text } : null;
    }

    // Capture non-2xx status errors and throw structured apiExceptions
    if (!response.ok) {
      const errorMessage =
        responseData?.error ||
        responseData?.message ||
        `Request completed with status code ${response.status}`;

      throw new APIError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (error: any) {
    if (error instanceof APIError) {
      throw error;
    }

    // Catch-all connection failures (CORS boundary blockages, server power downs)
    console.error(`[API Fetch Client Exception] URL: ${targetUrl}`, error);
    throw new APIError(
      error.message ||
        "A network error occurred. Please verify your connection to our publishing services.",
      500,
      error,
    );
  }
}

/**
 * Standardized API client endpoints trigger methods
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) => {
    const formattedBody =
      body instanceof FormData ? body : JSON.stringify(body);
    return request<T>(endpoint, {
      method: "POST",
      body: formattedBody,
      ...options,
    });
  },

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) => {
    const formattedBody =
      body instanceof FormData ? body : JSON.stringify(body);
    return request<T>(endpoint, {
      method: "PUT",
      body: formattedBody,
      ...options,
    });
  },

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};


// lib/api.ts

export async function getSiteName(): Promise<string> {
  const defaultName = "Anthony Blog";
  const apiBase = process.env.API_BASE_URL || "https://anthony-blog-dpl6.onrender.com" || "http://localhost:5000";

  try {
    const res = await fetch(`${apiBase}/api/settings`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error("Failed to fetch settings");

    const data = await res.json();
    return data?.settings?.siteName || defaultName;
  } catch (error) {
    console.error("Failed to retrieve siteName:", error);
    return defaultName;
  }
}