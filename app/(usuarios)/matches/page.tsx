"use client";

import dayjs, { Dayjs } from "dayjs";
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
import { useAuthStore } from "@/services/store";

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
  hour?: Date | Dayjs;
  vocal?: { name: string };
  localGoals?: number;
  visitorGoals?: number;
  status: "programado" | "en_juego" | "finalizado" | "suspendido";
  observations?: string;
  _movements: Movement[];
}

export default function EquiposPage() {
  const user = useAuthStore((state) => state.user);
  const index = useVistaIndex<Match>({
    endpoint: "/matchs",
    params: {
      $getAllFields: "true",
      vocal: user?.id,
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
            title: "Fecha / Hora",
            dataIndex: "date",
            width: 130,
            align: "center",
            render: (_, record) => (
              <Space
                orientation="vertical"
                size={0}
                style={{ lineHeight: 1.3 }}
              >
                <span>{dayjs(record.date).format("DD/MM/YYYY")}</span>
                <span>{dayjs(record.hour).format("HH:mm")}</span>
                <span
                  style={{
                    fontSize: 14,
                    color: "#1042cc",
                  }}
                >
                  {record.vocal?.name ?? "—"}
                </span>
              </Space>
            ),
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
