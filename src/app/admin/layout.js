import { SidebarAdmin } from "@/components/admin/SidebarAdmin";
import "../globals.css";
import { getAuthStatus } from "@/lib/auth";
import Link from "next/link";

// Force server to revalidate on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Admin Dashboard - E-com",
  description: "Admin dashboard for E-commerce management",
};

export default async function RootLayout({ children }) {
  const user = await getAuthStatus();
  console.log("👤 User status:", JSON.stringify(user));

  // Clear check for admin access
  if (!user || !user.isAdmin) {
    return (
      <html>
        <body>
          <main className="flex flex-col justify-center items-center h-screen text-xl text-red-600 gap-8">
            <p className="font-medium">Access Denied – Admins only</p>
            <div className="text-center text-gray-700 text-sm mb-4">
              {!user
                ? "You are not logged in"
                : "Your account does not have admin privileges"}
            </div>
            <Link
              href="/login"
              className="bg-amber-400 hover:bg-amber-500 px-6 py-3 w-32 h-12 flex justify-center items-center rounded-md text-white font-medium transition-colors"
            >
              Login
            </Link>
          </main>
        </body>
      </html>
    );
  }

  return (
    <main>
      <SidebarAdmin>{children}</SidebarAdmin>
    </main>
  );
}
