import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// Function to refresh the access token
async function refreshToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      console.log("❌ No refresh token available");
      return null;
    }

    console.log("🔄 Attempting to refresh token...");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/users/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      console.error("❌ Failed to refresh token:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("✅ Token refreshed successfully");

    // The new tokens are automatically set in cookies by the backend
    return data.data.accessToken;
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return null;
  }
}

export async function getAuthStatus() {
  try {
    const cookieStore = await cookies();
    // Using optional chaining to safely handle when cookie might not exist
    let token = cookieStore.get("accessToken")?.value;

    console.log("🪙 accessToken:", token);

    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("🔓 Decoded token:", decoded);
      return decoded;
    } catch (err) {
      console.error("❌ JWT error:", err.message);

      // If token is expired, try to refresh it
      if (err.name === "TokenExpiredError") {
        console.log("🔄 Token expired, attempting refresh...");

        const newToken = await refreshToken();
        if (newToken) {
          try {
            // Verify the new token
            const decoded = jwt.verify(
              newToken,
              process.env.ACCESS_TOKEN_SECRET
            );
            console.log("✅ New token verified:", decoded);
            return decoded;
          } catch (verifyError) {
            console.error("❌ New token verification failed:", verifyError);
            return null;
          }
        }
      }

      return null;
    }
  } catch (err) {
    console.error("❌ Cookie error:", err);
    return null;
  }
}
