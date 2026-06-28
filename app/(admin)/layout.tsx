"use client";

import { Drawer, Grid, Layout } from "antd";
import { adminMenu } from "@/assets/menus";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/services/store";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isMobileMd = !screens.lg;

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    if (token && !isAdmin) {
      router.replace("/");
    }
  }, [token, isAdmin, router]);

  if (!token || !isAdmin) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobileMd && (
        <Sider
          width={200}
          theme="light"
          style={{
            background: "#1da350",
            borderRight: "1px solid #E5E7EB",
          }}
        >
          <AppSidebar subtitle="ADMIN" items={adminMenu} />
        </Sider>
      )}

      <Layout>
        <Header
          className="px-3! "
          style={{
            height: 64,
            lineHeight: "64px",
            backgroundColor: "#D4D4FF",
          }}
        >
          <div className="flex items-center justify-between h-full w-full">
            <div className="flex items-center gap-4">
              {isMobileMd && (
                <>
                  <MenuOutlined
                    onClick={() => setOpen(true)}
                    className="text-xl cursor-pointer hidden sm:block"
                  />
                  <h1 className="font-bold text-lg whitespace-nowrap">
                    ⚽ Futbol360 - ADMIN
                  </h1>
                </>
              )}
            </div>

            <AppHeader />
          </div>
        </Header>

        <Content className="p-4 md:p-6">{children}</Content>
      </Layout>

      <Drawer
        title={
          <>
            <h1 className="font-bold text-xl whitespace-nowrap">
              ⚽ Futbol360 - ADMIN
            </h1>
          </>
        }
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        style={{
          background: "#DCFCE7",
        }}
      >
        <AppSidebar subtitle="ADMIN" items={adminMenu} showHeader={false} />
      </Drawer>
    </Layout>
  );
}
