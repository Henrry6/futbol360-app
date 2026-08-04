"use client";

import dayjs from "dayjs";
import api from "@/services/api";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/services/store";
import TagButtons from "@/components/TagButtons";
import { useShowError } from "@/components/utils/ShowError";
import { Tabs, Table, DatePicker, Tag, Card, Empty } from "antd";

const { RangePicker } = DatePicker;

export default function HistorialPage() {
  const user = useAuthStore((state) => state.user);
  const ShowError = useShowError();
  const [activeTab, setActiveTab] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const availableTabs = [
    user?.official?.canReferee && {
      key: "referee",
      label: "Como árbitro",
    },
    user?.official?.canAssist && {
      key: "assistant",
      label: "Como asistente",
    },
    user?.official?.canBeVocal && {
      key: "vocal",
      label: "Como vocal",
    },
  ].filter(Boolean) as { key: string; label: string }[];

  useEffect(() => {
    if (availableTabs.length && !activeTab) {
      setActiveTab(availableTabs[0].key);
    }
  }, [availableTabs]);

  const getMatches = async () => {
    if (!activeTab) return;
    try {
      setLoading(true);
      const params: any = {
        status: ["finalizado", "suspendido"],
      };
      if (activeTab === "referee") params.referee = user?.id;
      if (activeTab === "assistant") params.assistantReferees = user?.id;
      if (activeTab === "vocal") params.vocal = user?.id;
      if (dateRange) {
        params.date = `{$gte}${dateRange[0].toISOString()}{$lte}${dateRange[1].toISOString()}`;
      }
      const { data } = await api.get(`/matchs`, { params });
      setMatches(data.data);
    } catch (error) {
      ShowError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatches();
  }, [activeTab, dateRange]);

  const columns: any[] = [
    {
      title: "Fecha",
      dataIndex: "date",
      width: 110,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Partido",
      render: (_: any, record: any) => (
        <span>
          {record.localTeam?.name} vs {record.visitorTeam?.name}
        </span>
      ),
    },
    {
      title: "Marcador",
      align: "center",
      width: 100,
      render: (_: any, record: any) =>
        `${record.localGoals ?? 0} - ${record.visitorGoals ?? 0}`,
    },
    {
      title: "Estado",
      width: 120,
      align: "center",
      render: (_: any, record: any) => <TagButtons status={record.status} />,
    },
    // Solo tiene sentido si es su propio historial como árbitro:
    // la calificación se la puso el vocal en el MatchReport
    ...(activeTab === "referee"
      ? [
          {
            title: "Calificación",
            width: 130,
            align: "center" as const,
            render: (_: any, record: any) =>
              record.matchReport?.refereeRating ? (
                <Tag>{record.matchReport.refereeRating}</Tag>
              ) : (
                "—"
              ),
          },
        ]
      : []),
  ];

  return (
    <Card
      title="Historial de partidos"
      extra={
        <RangePicker
          format="DD/MM/YYYY"
          onChange={(dates) => setDateRange(dates)}
          value={dateRange}
        />
      }
    >
      {availableTabs.length === 0 ? (
        <Empty description="No tienes roles de oficial asignados." />
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={availableTabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
          }))}
        />
      )}

      <Table
        rowKey="_id"
        loading={loading}
        dataSource={matches}
        columns={columns}
        pagination={{ pageSize: 15 }}
        locale={{ emptyText: "No hay partidos en este historial." }}
      />
    </Card>
  );
}
