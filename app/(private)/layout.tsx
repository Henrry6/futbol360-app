"use client";

import { Layout } from "antd";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AppHeader from "@/components/Layout/AppHeader";
import AppSidebar from "@/components/Layout/AppSidebar";

import { useAuthStore } from "@/services/store";

const { Header, Sider, Content } = Layout;

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240}>
        <AppSidebar />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
          }}
        >
          <AppHeader />
        </Header>

        <Content className="p-6">{children}</Content>
      </Layout>
    </Layout>
  );
}
