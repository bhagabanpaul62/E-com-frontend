"use client";

import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <>
      {/* Original react-hot-toast for backward compatibility */}
      <HotToaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          duration: 5000,
          style: {
            background: "#fff",
            color: "#363636",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: "#effdf5",
              border: "1px solid #dcf7e3",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#fff1f0",
              border: "1px solid #fee7e6",
            },
          },
        }}
      />

      {/* Sonner toast for new components */}
      <SonnerToaster
        position="top-center"
        expand={false}
        richColors
        duration={4000}
      />
    </>
  );
}
