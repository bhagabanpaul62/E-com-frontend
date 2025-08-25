import Nav from "@/components/user/layout/Nav";
import "../globals.css";
import { getAuthStatus } from "@/lib/auth";
import CategoryNavigation from "@/components/user/category/CategoryNavigation";
import FlipkartFooter from "@/components/user/FlipkartFooter";
import AuthFallback from "@/components/auth/AuthFallback";
import AuthProvider from "@/components/auth/AuthProvider";

export default async function RootLayout({ children }) {
  // Try to get user status, but don't fail if token is expired
  let user = null;
  try {
    user = await getAuthStatus();
    console.log("👤 User status:", user);
  } catch (error) {
    console.log(
      "⚠️ Auth check failed, will handle on client side:",
      error.message
    );
  }

  return (
    <AuthProvider initialUser={user}>
      <main>
        <AuthFallback />
        <Nav user={user} />
        <header className="pt-14 sm:pt-16">
          <CategoryNavigation />
        </header>
        {children}
        <footer>
          <FlipkartFooter />
        </footer>
      </main>
    </AuthProvider>
  );
}
