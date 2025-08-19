import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function getAuthStatus() {
  try {
    const cookieStore = cookies();
    // Using optional chaining to safely handle when cookie might not exist
    const token = cookieStore.get("accessToken")?.value;

    console.log("🪙 accessToken:", token);

    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("🔓 Decoded token:", decoded);
      return decoded;
    } catch (err) {
      console.error("❌ JWT error:", err);
      return null;
    }
  } catch (err) {
    console.error("❌ Cookie error:", err);
    return null;
  }
}
