"use client";

import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/services/store";

export default function AppHeader() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "logout",
            label: "Cerrar sesión",
            onClick: () => {
              logout();
              router.replace("/login");
            },
          },
        ],
      }}
    >
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="hidden sm:block">
          <div className="font-medium leading-none">{user?.name}</div>
          <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
        </div>
        <Avatar icon={<UserOutlined />} />
      </div>
    </Dropdown>
  );
}
