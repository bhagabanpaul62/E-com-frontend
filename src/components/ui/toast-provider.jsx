"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
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
  );
}
