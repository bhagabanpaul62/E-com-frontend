"use client";

// Utility function to make authenticated API calls with automatic token refresh
export async function apiRequest(url, options = {}) {
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

      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        console.log("✅ Token refreshed, retrying request...");
        response = await makeRequest();
      } else {
        console.log("❌ Token refresh failed, redirecting to login");
        // Signal that user needs to login
        if (typeof window !== "undefined") {
          localStorage.setItem("tokenExpired", "true");
          window.location.href = "/login";
        }
        throw new Error("Authentication failed");
      }
    }

    return response;
  } catch (error) {
    console.error("❌ Error in API request:", error);
    throw error;
  }
}

// Hook for making authenticated API calls in React components
export function useApiRequest() {
  return {
    apiRequest,
    get: (url, options = {}) => apiRequest(url, { ...options, method: "GET" }),
    post: (url, data, options = {}) =>
      apiRequest(url, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      }),
    put: (url, data, options = {}) =>
      apiRequest(url, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (url, options = {}) =>
      apiRequest(url, { ...options, method: "DELETE" }),
  };
}
