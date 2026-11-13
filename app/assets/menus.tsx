import { User } from "@/services/store";
import type { ReactNode } from "react";
import { GiSoccerBall } from "react-icons/gi";
import {
  TrophyOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

type MenuItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  children?: MenuItem[];
};

export const masterMenu: MenuItem[] = [
  {
    key: "/dashboard",
    label: "Inicio",
  },
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
];
export const adminMenu: MenuItem[] = [
  {
    key: "/dashboard",
    label: "Inicio",
  },
  {
    key: "/leagues",
    icon: <TrophyOutlined />,
    label: "Ligas",
  },
  {
    key: "/usuarios",
    icon: <UserOutlined />,
    label: "Usuarios",
  },
];

export const directivoMenu = [
  {
    key: "/dashboard",
    label: "Inicio",
  },
  {
    key: "championship",
    icon: <TrophyOutlined />,
    label: "Campeonato",
    children: [
      {
        key: "/campeonatos",
        label: "Campeonatos",
      },
      {
        key: "/categories",
        label: "Categorías",
      },
    ],
  },
  {
    key: "participants",
    icon: <TeamOutlined />,
    label: "Participantes",
    children: [
      {
        key: "/teams",
        label: "Equipos",
      },
      {
        key: "/players",
        label: "Jugadores",
      },
      {
        key: "/referees",
        label: "Árbitros",
      },
      {
        key: "/vocals",
        label: "Vocales",
      },
    ],
  },
  {
    key: "reports",
    icon: <BarChartOutlined />,
    label: "Reportes",
    children: [
      {
        key: "/statistics",
        label: "Estadísticas",
      },
      // {
      //   key: "/history",
      //   label: "Historial",
      // },
    ],
  },
];
export const officialMenu = [
  {
    key: "/matchs",
    icon: <GiSoccerBall size={18} />,
    label: "Mis partidos",
  },
  {
    key: "/history",
    icon: <BarChartOutlined />,
    label: "Historial",
  },
];
export const playerMenu = [
  {
    key: "/dashboard",
    label: "Inicio",
  },
  {
    key: "/team",
    icon: <TeamOutlined />,
    label: "Mi equipo",
  },
  {
    key: "/matchs",
    icon: <GiSoccerBall size={18} />,
    label: "Mis partidos",
  },
  {
    key: "/statistics",
    icon: <BarChartOutlined />,
    label: "Mis estadísticas",
  },
];

export const roleMenus = {
  master: masterMenu,
  admin: adminMenu,
  directivo: directivoMenu,
  official: officialMenu,
  player: playerMenu,
};

type Role = User["roles"][number];

export const getMenuByRoles = (roles: Role[]) => {
  const map = new Map<string, MenuItem>();

  roles?.forEach((role) => {
    // if (role === "maste") return;
    roleMenus[role]?.forEach((item) => {
      const current = map.get(item.key);
      if (!current) {
        map.set(item.key, {
          ...item,
          children:
            "children" in item && item.children
              ? [...item.children]
              : undefined,
        });
        return;
      }

      if ("children" in item && item.children) {
        const childMap = new Map<string, MenuItem>(
          (current.children ?? []).map((child: MenuItem) => [child.key, child]),
        );

        item.children.forEach((child) => {
          if (!childMap.has(child.key)) {
            childMap.set(child.key, child);
          }
        });

        current.children = Array.from(childMap.values());
      }
    });
  });

  return Array.from(map.values());
};
