"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111916",
            color: "#E8F5E9",
            border: "1px solid rgba(0,230,118,0.2)",
          },
          success: {
            iconTheme: {
              primary: "#00E676",
              secondary: "#111916",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF5252",
              secondary: "#111916",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
