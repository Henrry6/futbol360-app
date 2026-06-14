import {
  TrophyOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export const adminMenu = [
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
];

export const leagueMenu = (leagueId: string) => [
  {
    key: "championship",
    icon: <TrophyOutlined />,
    label: "Campeonato",
    children: [
      {
        key: `/campeonatos`,
        label: "Campeonatos",
      },
      {
        key: `/leagues/${leagueId}/categories`,
        label: "Categorías",
      },
      {
        key: `/leagues/${leagueId}/fixtures`,
        label: "Calendario",
      },
    ],
  },
  {
    key: `/leagues/${leagueId}/teams`,
    icon: <TeamOutlined />,
    label: "Equipos",
  },
  {
    key: `/leagues/${leagueId}/matches`,
    icon: <CalendarOutlined />,
    label: "Partidos",
  },
];

export const menus = {
  admin: adminMenu,

  directivo: (leagueId: string) => leagueMenu(leagueId),
};
