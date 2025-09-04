import { ToastProvider } from "@/components/ui/toast-provider";
import ReduxProvider from "@/components/redux/ReduxProvider";

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ToastProvider />
          <div>{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
