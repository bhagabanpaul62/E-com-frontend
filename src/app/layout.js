import { ToastProvider } from "@/components/ui/toast-provider";

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <div>{children}</div>
      </body>
    </html>
  );
}
