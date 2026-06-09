"use client";

import { TeamOutlined, UserOutlined, TrophyOutlined } from "@ant-design/icons";

import { Menu } from "antd";
import { useRouter } from "next/navigation";

export default function AppSidebar() {
  const router = useRouter();

  return (
    <Menu
      mode="inline"
      style={{
        height: "100%",
      }}
      items={[
        {
          key: "/leagues",
          icon: <TrophyOutlined />,
          label: "Ligas",
        },

        {
          key: "/users",
          icon: <UserOutlined />,
          label: "Usuarios",
        },

        {
          key: "/teams",
          icon: <TeamOutlined />,
          label: "Equipos",
        },
      ]}
      onClick={(item) => {
        router.push(item.key);
      }}
    />
  );
}
