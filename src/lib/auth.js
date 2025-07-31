// /lib/auth.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getAuthStatus() {
  const cookieStore = cookies(); // ✅ no await
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded; // e.g., { _id, email, role }
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
