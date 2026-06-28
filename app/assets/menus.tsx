import {
  TrophyOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { GiSoccerBall } from "react-icons/gi";

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

export const leagueMenu = () => [
  {
    key: "/dashboard",
    label: "Inicio",
  },
  {
    key: "league",
    icon: <TrophyOutlined />,
    label: "Liga",
    children: [
      {
        key: "/campeonatos",
        label: "Campeonatos",
      },
      {
        key: "/categories",
        label: "Categorías",
      },
      {
        key: "/fixtures",
        label: "Calendario",
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
    ],
  },
  {
    key: "competition",
    icon: <GiSoccerBall size={18} />,
    label: "Competición",
    children: [
      {
        key: "/matches",
        label: "Partidos",
      },
      {
        key: "/standings",
        label: "Tabla de posiciones",
      },
      {
        key: "/scorers",
        label: "Goleadores",
      },
      {
        key: "/sanctions",
        label: "Sanciones",
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
      {
        key: "/history",
        label: "Historial",
      },
    ],
  },
];

export const menus = {
  admin: adminMenu,

  directivo: () => leagueMenu(),
};
