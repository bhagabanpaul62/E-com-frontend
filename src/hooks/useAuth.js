"use client";

import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh token on client side
  const refreshToken = useCallback(async () => {
    try {
      console.log("🔄 Client-side token refresh...");

      // Add timeout to refresh request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Get refreshToken from localStorage as fallback
      const storedRefreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/users/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: storedRefreshToken
            ? JSON.stringify({ refreshToken: storedRefreshToken })
            : undefined,
          credentials: "include", // Important for cookies
          signal: controller.signal,
        }
      ).finally(() => clearTimeout(timeoutId));

      if (!response.ok) {
        console.error("❌ Failed to refresh token:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("✅ Client token refreshed successfully");

      // Update authentication state
      if (data.success && data.data) {
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      // Handle network errors gracefully
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        console.log("Backend server unreachable during token refresh");
      } else {
        console.error("❌ Error refreshing token:", error);
      }
      return false;
    }
  }, []);

  // Function to make authenticated API calls with automatic token refresh
  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      const makeRequest = async () => {
        return fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
        });
      };

      try {
        let response = await makeRequest();

        // If we get a 401, try to refresh the token and retry
        if (response.status === 401) {
          console.log("🔄 Got 401, attempting token refresh...");

          const refreshSuccess = await refreshToken();

          if (refreshSuccess) {
            console.log("✅ Token refreshed, retrying request...");
            response = await makeRequest();
          } else {
            console.log("❌ Token refresh failed, user needs to login");
            setIsAuthenticated(false);
            setUser(null);
            // Redirect to login page
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return null;
          }
        }

        return response;
      } catch (error) {
        console.error("❌ Error in authenticated request:", error);
        throw error;
      }
    },
    [refreshToken]
  );

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're running in a browser environment (not during SSR)
        if (typeof window === "undefined") return;

        // Add a timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/users/validate-token`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        ).finally(() => clearTimeout(timeoutId));

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsAuthenticated(true);
            setUser(data.data.user);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else if (response.status === 401) {
          // Try to refresh token
          console.log("🔄 Token validation failed, attempting refresh...");
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Re-check authentication after refresh
            const retryResponse = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER}/api/users/validate-token`,
              {
                credentials: "include",
              }
            );

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              if (retryData.success) {
                setIsAuthenticated(true);
                setUser(retryData.data.user);
              } else {
                setIsAuthenticated(false);
                setUser(null);
              }
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error checking auth status:", error);

        // Handle network errors gracefully
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
          console.log("Backend server unreachable, continuing as guest");
        }

        // Continue as guest if auth check fails
        setIsAuthenticated(false);
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [refreshToken]);

  const logout = useCallback(async () => {
    try {
      // Add timeout to logout request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/users/logout`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));
    } catch (error) {
      // Handle network errors gracefully
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        console.log("Backend server unreachable during logout");
      } else {
        console.error("❌ Error during logout:", error);
      }
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
        window.location.href = "/login";
      }
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    refreshToken,
    makeAuthenticatedRequest,
    logout,
  };
}
