// components/TablaPosiciones.tsx
"use client";

import useSWR from "swr";
import api from "@/services/api";
import { Table, Tag, Empty, Spin, Tooltip, Typography } from "antd";

export interface StandingRow {
  team: string;
  name: string;
  logo?: string;
  // Solo en etapas de grupos ("A", "B"…); `position` es dentro del grupo
  group?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

interface TablaPosicionesProps {
  championshipId: string;
  stageId?: string;
  highlightTeams?: string[];
  size?: "small" | "middle";
}

const HeaderTip = ({ label, tip }: { label: string; tip: string }) => (
  <Tooltip title={tip}>
    <span>{label}</span>
  </Tooltip>
);

export function TablaPosiciones({
  championshipId,
  stageId,
  highlightTeams = [],
  size = "small",
}: TablaPosicionesProps) {
  const { data = [], isLoading } = useSWR(
    championshipId
      ? `table-positions:${championshipId}:${stageId ?? "all"}`
      : null,
    () =>
      api
        .get(`/championships/${championshipId}/table-positions`, {
          params: stageId ? { stageId } : {},
        })
        .then((res) => res.data as StandingRow[]),
  );

  const columns = [
    {
      title: <HeaderTip label="#" tip="Posición en la tabla (o en el grupo)" />,
      dataIndex: "position",
      key: "position",
      width: 48,
      align: "center" as const,
    },
    {
      title: <HeaderTip label="Equipo" tip="Nombre del equipo" />,
      dataIndex: "name",
      key: "name",
      render: (name: string, row: StandingRow) => (
        <span
          className={
            highlightTeams.includes(row.team) ? "font-semibold" : undefined
          }
        >
          {name}
        </span>
      ),
    },
    {
      title: (
        <HeaderTip
          label="PJ"
          tip="Partidos jugados: total de partidos disputados"
        />
      ),
      dataIndex: "played",
      key: "played",
      align: "center" as const,
    },
    {
      title: <HeaderTip label="G" tip="Partidos ganados" />,
      dataIndex: "wins",
      key: "wins",
      align: "center" as const,
    },
    {
      title: <HeaderTip label="E" tip="Partidos empatados" />,
      dataIndex: "draws",
      key: "draws",
      align: "center" as const,
    },
    {
      title: <HeaderTip label="P" tip="Partidos perdidos" />,
      dataIndex: "losses",
      key: "losses",
      align: "center" as const,
    },
    {
      title: (
        <HeaderTip
          label="GF"
          tip="Goles a favor: goles anotados por el equipo"
        />
      ),
      dataIndex: "goalsFor",
      key: "goalsFor",
      align: "center" as const,
    },
    {
      title: (
        <HeaderTip
          label="GC"
          tip="Goles en contra: goles recibidos por el equipo"
        />
      ),
      dataIndex: "goalsAgainst",
      key: "goalsAgainst",
      align: "center" as const,
    },
    {
      title: (
        <HeaderTip
          label="DG"
          tip="Diferencia de goles (goles a favor - goles en contra)"
        />
      ),
      dataIndex: "goalDifference",
      key: "goalDifference",
      align: "center" as const,
      render: (val: number) => (
        <span
          className={val > 0 ? "text-green-600" : val < 0 ? "text-red-600" : ""}
        >
          {val > 0 ? `+${val}` : val}
        </span>
      ),
    },
    {
      title: (
        <HeaderTip
          label="Pts"
          tip="Puntos obtenidos según el reglamento del campeonato (victoria = 3, empate = 1, derrota = 0)"
        />
      ),
      dataIndex: "points",
      key: "points",
      align: "center" as const,
      render: (val: number) => <Tag color="blue">{val}</Tag>,
    },
  ];

  if (!isLoading && data.length === 0) {
    return <Empty description="Sin datos de posiciones" />;
  }

  // Fase de grupos: la API devuelve todos los grupos ordenados (A, B…);
  // se muestra una tabla por grupo.
  const groups = data.some((row) => row.group)
    ? [...new Set(data.map((row) => row.group ?? ""))].map((group) => ({
        group,
        rows: data.filter((row) => (row.group ?? "") === group),
      }))
    : [{ group: "", rows: data }];

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Tabla de posiciones</Typography.Title>
      <div className="space-y-6">
        {groups.map(({ group, rows }) => (
          <div key={group || "general"}>
            {group && (
              <Typography.Title level={5} className="mb-2!">
                Grupo {group}
              </Typography.Title>
            )}
            <Table
              rowKey="team"
              size={size}
              columns={columns}
              dataSource={rows}
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          </div>
        ))}
      </div>
    </Spin>
  );
}
