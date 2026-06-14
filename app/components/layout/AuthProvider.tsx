"use client";

import { useAuthStore } from "@/services/store";
import { ConfigProvider, App as AntdApp } from "antd";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}

// Configurar el color de ant - desing
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#51ad73",
        },
        components: {
          Layout: {
            headerBg: "#ffffff",
            headerColor: "#000000",
          },
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
