import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getAuthStatus() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  console.log("🪙 accessToken:", token);

  if (!token) return { debug: "No token found" };

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (err) {
    console.error("❌ JWT error:", err);
    return { debug: "Invalid token", error: err.message };
  }
}
