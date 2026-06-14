"use client";

import { menus } from "@/assets/menus";
import { Drawer, Grid, Layout } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/services/store";
import { MenuOutlined } from "@ant-design/icons";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function LayoutUsuarios({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isMobileMd = !screens.lg;

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  const menu = menus.directivo(user?.league as string);

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
          <AppSidebar items={menu} />
        </Sider>
      )}

      <Layout>
        <Header
          className="px-3! "
          style={{
            height: 64,
            lineHeight: "64px",
            backgroundColor: "#DCFCE7",
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
                </>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-base whitespace-nowrap">
                  {user?.nameLiga}
                </span>
                <span className="text-sm text-black">{user?.code}</span>
              </div>
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
              ⚽ Futbol360
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
        <AppSidebar showHeader={false} items={menu} />
      </Drawer>
    </Layout>
  );
}
