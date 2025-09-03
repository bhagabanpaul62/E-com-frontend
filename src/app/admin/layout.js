import "../globals.css";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

// Force server to revalidate on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Admin Dashboard - E-com",
  description: "Admin dashboard for E-commerce management",
};

export default function RootLayout({ children }) {
  // Using a client component for admin authentication
  // This allows us to use localStorage as a fallback for cookie authentication
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
