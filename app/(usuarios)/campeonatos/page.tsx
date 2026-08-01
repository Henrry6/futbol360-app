"use client";

import dayjs, { Dayjs } from "dayjs";
import $filtros from "@/assets/utils";
import { Movement } from "@/types/global";
import EmptyState from "@/components/Empty";
import PageHeader from "@/components/PageHeader";
import {
  CalendarOutlined,
  EditOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import TagButtons from "@/components/TagButtons";
import { useVistaIndex } from "@/assets/vistaIndex";
import DeleteButton from "@/components/DeleteButton";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Space,
  Spin,
  Typography,
} from "antd";
import ResponsiveCard from "@/components/ResponsiveCard";

export interface ChampionshipTeam {
  team: string;
  status: "activo" | "retirado" | "expulsado";
  // Fecha en la que union al campeonato
  fechaIngreso: Date | Dayjs;
  // Fecha de salida
  fechaSalida?: Date | Dayjs;
  // Posición final
  finalPosition?: number;
  // Puntos obtenidos
  points?: number;
  notes?: string;
}

export interface Championship {
  _id: string;
  league: string;
  name: string;
  category: { name: string };
  // Año deportivo
  season: Date | Dayjs;
  // Apertura, Clausura, Temporada, Copa, etc.
  type: "temporada" | "apertura" | "clausura" | "copa" | "amistoso";
  startDate: Date | Dayjs;
  endDate?: Date | Dayjs;
  // Equipos participantes
  teams: ChampionshipTeam[];
  // Campeón
  champion?: {
    name: string;
  };
  // Subcampeón
  runnerUp?: string;
  // Tercer lugar
  thirdPlace?: string;
  // Estado
  status: "planificado" | "activo" | "finalizado" | "cancelado";
  observations?: string;
  _movements: Movement[];
}

export default function CampeonatosPage() {
  const router = useRouter();
  const pathname = usePathname();

  const { data, loading, refresh, setSearch } = useVistaIndex<Championship>({
    endpoint: "/championships",
    params: {
      fields: `name league category {name} teams stages currentStage champion \
runnerUp thirdPlace status observations type startDate endDate season`,
    },
  });

  console.log(data);

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <PageHeader
          resource={{
            label: "Campeonatos",
            href: "/campeonatos",
          }}
          loading={loading}
          onSearch={setSearch}
          onRefresh={refresh}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {data.map((championship) => (
            <ResponsiveCard
              key={championship._id}
              header={
                <>
                  <div className="flex items-start gap-3">
                    <div className="text-4xl shrink-0">🏆</div>
                    <div className="min-w-0">
                      <Typography.Title
                        level={5}
                        className="white-space-nowrap"
                      >
                        {championship.name}
                      </Typography.Title>

                      <Typography.Text type="secondary">
                        Temporada{" "}
                        {championship.season
                          ? $filtros.date(championship.season, "YYYY")
                          : "#"}
                      </Typography.Text>
                    </div>
                  </div>

                  <TagButtons
                    status={championship.status}
                    className="self-start"
                  />
                </>
              }
              footer={
                <Space>
                  <Button
                    title="Editar"
                    icon={<EditOutlined />}
                    onClick={() =>
                      router.push(`${pathname}/${championship._id}/edit`)
                    }
                  />
                  <Button
                    title="Gestionar campeonato"
                    type="dashed"
                    icon={<ScheduleOutlined />}
                    onClick={() =>
                      router.push(`${pathname}/${championship._id}/gestionar`)
                    }
                  />
                  <DeleteButton
                    endpoint="/championships"
                    id={championship._id}
                    title={`¿Eliminar campeonato ${championship.name}?`}
                    onSuccess={refresh}
                  />
                </Space>
              }
            >
              <Descriptions
                column={1}
                size="small"
                colon={false}
                items={[
                  {
                    label: "Tipo",
                    children: <TagButtons status={championship.type} />,
                  },
                  {
                    label: "Categoria",
                    children: championship.category.name,
                  },
                  {
                    label: "👥 Equipos",
                    children: championship.teams.length,
                  },
                  {
                    label: "📅 Inicio",
                    children: dayjs(championship.startDate).format(
                      "DD/MM/YYYY",
                    ),
                  },
                  {
                    label: "📅 Fin",
                    children: championship.endDate
                      ? dayjs(championship.endDate).format("DD/MM/YYYY")
                      : "-",
                  },
                  ...(championship.champion
                    ? [
                        {
                          label: "🥇 Campeón",
                          children: championship.champion.name,
                        },
                      ]
                    : []),
                ]}
              />
            </ResponsiveCard>
          ))}
        </div>
        {data.length === 0 && !loading && (
          <EmptyState
            title="No existen campeonatos"
            description="Crea el primer campeonato para comenzar a registrar partidos y posiciones."
            buttonText="Crear campeonato"
            onCreate={() => router.push("/campeonatos/insert")}
            onRefresh={refresh}
            icon="🏆"
          />
        )}{" "}
      </div>
    </Spin>
  );
}
