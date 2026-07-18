"use client";

import { Dayjs } from "dayjs";
import $filtros from "@/assets/utils";
import { Movement } from "@/types/global";
import PageHeader from "@/components/PageHeader";
import {
  CaretRightOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FormOutlined,
  RollbackOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import TagButtons from "@/components/TagButtons";
import { useVistaIndex } from "@/assets/vistaIndex";
import DeleteButton from "@/components/DeleteButton";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Descriptions,
  Divider,
  Space,
  Spin,
  Table,
} from "antd";
import InfoGrid from "@/components/InfoGrid";

// export interface Match {
//   _id: string;
//   league: string;
//   championship: string;
//   round: string;
//   stage: string;
//   localTeam: string;
//   visitorTeam: string;
//   date?: Date | Dayjs;
//   localGoals?: number;
//   visitorGoals?: number;
//   status: "programado" | "en_juego" | "finalizado" | "suspendido";
//   observations?: string;
//   _movements: Movement[];
// }

export interface Match {
  _id: string;

  championship: {
    _id: string;
    name: string;
  };

  stage: {
    _id: string;
    name: string;
  };

  round: {
    _id: string;
    name: string;
    round: number;
  };

  localTeam: {
    _id: string;
    name: string;
    logo?: string;
  };

  visitorTeam: {
    _id: string;
    name: string;
    logo?: string;
  };

  date?: Date | Dayjs;

  localGoals?: number;

  visitorGoals?: number;

  status: "programado" | "en_juego" | "finalizado" | "suspendido";

  observations?: string;

  _movements: Movement[];
}

export default function EquiposPage() {
  const index = useVistaIndex<Match>({
    endpoint: "/matchs",
    params: {
      $getAllFields: "true",
    },
  });

  return (
    <Spin spinning={index.loading}>
      <PageHeader
        resource={{
          label: "Equipos",
          href: "/teams",
        }}
        loading={index.loading}
        onSearch={index.setSearch}
        onRefresh={index.refresh}
      />
      <Table
        {...index.tableProps}
        expandable={{
          expandedRowRender: (record) => (
            <InfoGrid
              items={[
                {
                  label: "Campeonato",
                  value: record.championship.name,
                },
                {
                  label: "Etapa",
                  value: record.stage.name,
                },
                {
                  label: "Jornada",
                  value: record.round.name,
                },
                {
                  label: "Estado",
                  value: <TagButtons status={record.status} />,
                },
                {
                  label: "Fecha",
                  value: record.date ? $filtros.date(record.date) : "-",
                },
                {
                  label: "Marcador",
                  value: `${record.localGoals ?? 0} - ${record.visitorGoals ?? 0}`,
                },
                {
                  label: "Observaciones",
                  value: record.observations || "-",
                  span: 3,
                },
              ]}
              columns={3}
            />
          ),
        }}
        rowKey={(record) => record._id}
        columns={[
          {
            title: "Jornada",
            dataIndex: ["round", "name"],
            width: 120,
          },

          {
            title: "Local",
            dataIndex: "localTeam",
            render: (team) => (
              <Space>
                <Avatar src={team.logo} icon={<TeamOutlined />} />
                {team.name}
              </Space>
            ),
          },

          {
            title: "",
            align: "center",
            width: 130,
            render: (_, record) => (
              <strong>
                {record.localGoals ?? 0} - {record.visitorGoals ?? 0}
              </strong>
            ),
          },

          {
            title: "Visitante",
            dataIndex: "visitorTeam",
            render: (team) => (
              <Space>
                <Avatar src={team.logo} icon={<TeamOutlined />} />
                {team.name}
              </Space>
            ),
          },

          {
            title: "Fecha",
            dataIndex: "date",
            width: 130,
            align: "center",
            render: (value) => (value ? $filtros.date(value) : "-"),
          },

          {
            title: "Estado",
            dataIndex: "status",
            align: "center",
            render: (status) => <TagButtons status={status} />,
          },

          {
            title: "",
            key: "actions",
            width: 140,
            align: "center",
            render: (_, record) => (
              <Space>
                <Space>
                  {record.status === "programado" && (
                    <Button type="primary" icon={<CaretRightOutlined />}>
                      Iniciar
                    </Button>
                  )}

                  {record.status === "en_juego" && (
                    <>
                      <Button icon={<FormOutlined />}>Vocalía</Button>

                      <Button danger icon={<RollbackOutlined />}>
                        Revertir
                      </Button>

                      <Button type="primary" icon={<CheckCircleOutlined />}>
                        Finalizar
                      </Button>
                    </>
                  )}

                  {(record.status === "finalizado" ||
                    record.status === "suspendido") && (
                    <Button icon={<EyeOutlined />}>Ver vocalía</Button>
                  )}
                </Space>
              </Space>
            ),
          },
        ]}
      />
    </Spin>
  );
}
