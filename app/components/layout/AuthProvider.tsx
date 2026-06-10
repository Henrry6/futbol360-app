"use client";

import { ConfigProvider } from "antd";
import { useAuthStore } from "@/services/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}

// app/providers.tsx

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#51ad73",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
