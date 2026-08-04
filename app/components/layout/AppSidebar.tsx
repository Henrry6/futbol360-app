"use client";

import { FC } from "react";
import { Menu } from "antd";
import Link from "next/link";
import type { MenuProps } from "antd";
import { usePathname } from "next/navigation";

type MenuItemType = NonNullable<MenuProps["items"]>[number];

type Props = {
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  items: MenuProps["items"];
};

// Envuelve en <Link> solo los items hoja (sin children), que son los navegables.
const buildItems = (items: MenuProps["items"]): MenuProps["items"] => {
  return items?.map((item) => {
    if (!item) return item;

    if ("children" in item && item.children?.length) {
      return {
        ...item,
        children: buildItems(item.children as MenuProps["items"]),
      } as MenuItemType;
    }

    return {
      ...item,
      label: <Link href={String(item.key)}>{(item as any).label}</Link>,
    } as MenuItemType;
  });
};

const AppSidebar: FC<Props> = ({
  showHeader = true,
  title = "⚽ Futbol360",
  subtitle,
  items,
}) => {
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
        items={buildItems(items)}
      />
    </div>
  );
};

export default AppSidebar;
