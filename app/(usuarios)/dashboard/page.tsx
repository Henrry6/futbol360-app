"use client";

import api from "@/services/api";
import { Col, Row, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShowError } from "@/components/utils/ShowError";
import {
  TrophyOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const ShowError = useShowError();

  async function loadData() {
    try {
      setLoading(true);
      const [datos] = await Promise.all([api.get(`/dashboard`)]);
      setData(datos.data);
    } catch (e) {
      ShowError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    {
      title: "Campeonatos",
      value: data?.campeonatos ?? 0,
      icon: <TrophyOutlined />,
      route: "/campeonatos",
      color: "from-amber-400 to-orange-500",
    },
    {
      title: "Categorías",
      value: data?.categorias ?? 0,
      icon: <AppstoreOutlined />,
      route: "/categories",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Equipos",
      value: data?.equipos ?? 0,
      icon: <TeamOutlined />,
      route: "/teams",
      color: "from-green-400 to-green-600",
    },
    {
      title: "Partidos",
      value: data?.jugadores ?? 0,
      icon: <CalendarOutlined />,
      route: "/matches",
      color: "from-violet-400 to-purple-600",
    },
    {
      title: "Usuarios",
      value: data?.usuarios ?? 0,
      icon: <UsergroupAddOutlined />,
      route: "/users",
      color: "from-cyan-400 to-teal-600",
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Datos Estadísticos</h1>
        <p className="text-gray-500">Resumen general de la liga</p>
      </div>
      <Row gutter={[24, 24]} className="flex items-center justify-center">
        {stats.map((item) => (
          <Col key={item.title} xs={12} sm={8} md={8} lg={6} xl={4}>
            <div
              onClick={() => router.push(item.route)}
              className="
            cursor-pointer
            transition-all
            duration-300
            hover:scale-105
            flex
            flex-col
            items-center
          "
            >
              <div
                className={`
              w-20 h-20
              sm:w-28 sm:h-28
              md:w-32 md:h-32
              rounded-full
              bg-linear-to-br
              ${item.color}
              text-white
              shadow-lg
              flex
              flex-col
              items-center
              justify-center
            `}
              >
                <div className="text-xl sm:text-3xl mb-1">{item.icon}</div>
                <div className="text-2xl font-bold">{item.value}</div>
              </div>

              <div className="mt-3 text-center font-bold">{item.title}</div>
            </div>
          </Col>
          // bg-teal-500
          // bg-gradient-to-br from-blue-500 to-indigo-600
          // bg-gradient-to-br from-teal-500 to-cyan-600
          // bg-gradient-to-br from-violet-500 to-purple-600
        ))}
      </Row>
    </Spin>
  );
}
