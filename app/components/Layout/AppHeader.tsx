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
    <div className="flex justify-between items-center h-full px-6 bg-white">
      <h1 className="font-bold text-xl">⚽ Futbol360</h1>

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
          <Avatar icon={<UserOutlined />} />

          <div>
            <div>{user?.name}</div>

            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
