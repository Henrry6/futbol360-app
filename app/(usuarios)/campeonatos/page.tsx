"use client";

import dayjs, { Dayjs } from "dayjs";
import $filtros from "@/assets/utils";
import { Movement } from "@/types/global";
import EmptyState from "@/components/Empty";
import PageHeader from "@/components/PageHeader";
import { EditOutlined } from "@ant-design/icons";
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

export interface ChampionshipTeam {
  team: string;
  status: "activo" | "retirado" | "expulsado";
  // Fecha en la que union al campeonato
  joinedAt: Date;
  // Fecha de salida
  leftAt?: Date;
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
  category: string;
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
      $getAllFields: "true",
    },
  });

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
        <div className="grid md:grid-cols-3 gap-4">
          {data.map((championship) => (
            <Card
              key={championship._id}
              hoverable
              className="rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-start bg-linear-to-r from-green-200 to-indigo-300  rounded-t-xl p-4">
                <div className="flex gap-3">
                  <div className="text-4xl">🏆</div>

                  <div>
                    <Typography.Title level={5} className="mb-0">
                      {championship.name}
                    </Typography.Title>

                    <Typography.Text type="secondary">
                      Temporada {$filtros.date(championship.season, "YYYY")}
                    </Typography.Text>
                  </div>
                </div>
                <TagButtons status={championship.status} />
              </div>

              <Divider />

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
                    label: "👥 Equipos",
                    children: championship?.teams?.length,
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
                ]}
              />

              <Divider />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {championship.champion && (
                    <>🥇 {championship.champion.name}</>
                  )}
                </div>

                <Space>
                  <Button
                    onClick={() =>
                      router.push(pathname + "/" + championship._id + "/edit")
                    }
                    icon={<EditOutlined />}
                  />
                  <DeleteButton
                    endpoint="/championship"
                    id={championship._id}
                    title={`¿Eliminar categoría ${championship.name}?`}
                    onSuccess={refresh}
                  />
                </Space>
              </div>
            </Card>
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
