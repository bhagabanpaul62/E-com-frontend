export async function getAuthStatus() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/check-auth`,
      {
        method: "GET",
        credentials: "include", // important to send cookies
      }
    );

    if (!res.ok) {
      console.log("Auth failed:", await res.json());
      return null;
    }

    const user = await res.json();
    return user;
  } catch (err) {
    console.error("Failed to fetch auth status:", err);
    return null;
  }
}
