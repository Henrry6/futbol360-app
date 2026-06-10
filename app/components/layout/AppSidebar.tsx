"use client";

import { TeamOutlined, UserOutlined, TrophyOutlined } from "@ant-design/icons";

import { Menu } from "antd";
import { useRouter } from "next/navigation";
import { FC } from "react";

const AppSidebar: FC<{ hiddeTitle?: boolean }> = (props) => {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col">
      {!props.hiddeTitle && (
        <div className="h-16 flex items-center px-4 border-b">
          <h1 className="font-bold text-lg text-white">⚽ Futbol360</h1>
        </div>
      )}

      <Menu
        mode="inline"
        theme="light"
        className="flex-1 border-r-0"
        style={{
          background: "#DCFCE7",
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
        onClick={(item) => router.push(item.key)}
      />
    </div>
  );
};

export default AppSidebar;
