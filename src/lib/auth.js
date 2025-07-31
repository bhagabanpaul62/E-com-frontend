export function getAuthStatus() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  console.log("🪙 Token:", token);
  console.log("🔐 Secret:", process.env.ACCESS_TOKEN_SECRET);

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return null;
  }
}
