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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/users/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for cookies
        }
      );

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
      console.error("❌ Error refreshing token:", error);
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/users/validate-token`,
          {
            credentials: "include",
          }
        );

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
              `${process.env.NEXT_PUBLIC_SERVER}/users/validate-token`,
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
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [refreshToken]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("❌ Error during logout:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      if (typeof window !== "undefined") {
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
