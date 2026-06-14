"use client";

import { FC } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  items: MenuProps["items"];
};

const AppSidebar: FC<Props> = ({
  showHeader = true,
  title = "⚽ Futbol360",
  subtitle,
  items,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      {showHeader && (
        <div className="h-16 flex items-center px-4 border-b">
          <div>
            <h1 className="font-bold text-lg text-white">{title}</h1>
            {subtitle && (
              <h2 className="font-bold text-xs text-white text-center">
                {subtitle}
              </h2>
            )}
          </div>
        </div>
      )}

      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[pathname]}
        className="flex-1 border-r-0"
        style={{
          background: "#DCFCE7",
        }}
        items={items}
        onClick={(item) => router.push(item.key)}
      />
    </div>
  );
};

export default AppSidebar;
