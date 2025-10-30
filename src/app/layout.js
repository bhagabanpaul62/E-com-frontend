import { ToastProvider } from "@/components/ui/toast-provider";
import ReduxProvider from "@/components/redux/ReduxProvider";
import "./globals.css"; // Import global CSS styles

// Override any browser-specific CSS issues
const globalStyles = {
  html: {
    boxSizing: "border-box",
  },
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={globalStyles.body}>
        <ReduxProvider>
          <ToastProvider />
          <div>{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
