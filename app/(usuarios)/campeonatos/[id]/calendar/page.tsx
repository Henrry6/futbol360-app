"use client";

import PageHeader from "@/components/PageHeader";
import InfoGrid from "@/components/InfoGrid";
import TagButtons from "@/components/TagButtons";

import { Card, Collapse, Table, Space, Button, Avatar } from "antd";

import {
  EyeOutlined,
  CaretRightOutlined,
  FormOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

export default function CalendarPage() {
  const championship = {
    _id: "1",
    name: "Liga Provincial 2026",
  };

  const stage = {
    name: "Fase Regular",
    mode: "Round Robin",
    participants: 10,
    qualifyTeams: 6,
    status: "generada",
  };

  const rounds = [
    {
      _id: "1",
      name: "Jornada 1",
      status: "en_juego",
      matches: [
        {
          _id: "1",
          localTeam: {
            name: "Aucas",
            logo: "",
          },
          visitorTeam: {
            name: "Liga",
            logo: "",
          },
          localGoals: 2,
          visitorGoals: 1,
          status: "finalizado",
        },
        {
          _id: "2",
          localTeam: {
            name: "Barcelona",
            logo: "",
          },
          visitorTeam: {
            name: "Nacional",
            logo: "",
          },
          status: "programado",
        },
        {
          _id: "3",
          localTeam: {
            name: "Orense",
            logo: "",
          },
          visitorTeam: {
            name: "Cuenca",
            logo: "",
          },
          localGoals: 1,
          visitorGoals: 0,
          status: "en_juego",
        },
      ],
    },

    {
      _id: "2",
      name: "Jornada 2",
      status: "pendiente",
      matches: [],
    },

    {
      _id: "3",
      name: "Jornada 3",
      status: "pendiente",
      matches: [],
    },
  ];

  return (
    <>
      <PageHeader
        resource={{
          label: "Campeonatos / Calendario",
          href: "/campeonatos",
        }}
      />

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="Información del campeonato">
          <InfoGrid
            columns={3}
            items={[
              {
                label: "Etapa",
                value: stage.name,
              },
              {
                label: "Modo",
                value: stage.mode,
              },
              {
                label: "Participantes",
                value: stage.participants,
              },
              {
                label: "Clasifican",
                value: stage.qualifyTeams,
              },
              {
                label: "Estado",
                value: <TagButtons status={stage.status} />,
              },
            ]}
          />
        </Card>

        <Collapse accordion defaultActiveKey={["1"]}>
          {rounds.map((round) => (
            <Panel
              key={round._id}
              header={
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <strong>{round.name}</strong>

                  <TagButtons status={round.status} />
                </Space>
              }
            >
              <Table
                rowKey="_id"
                pagination={false}
                locale={{
                  emptyText: "No existen partidos para esta jornada.",
                }}
                dataSource={round.matches}
                columns={[
                  {
                    title: "Local",
                    render: (_, record: any) => (
                      <Space>
                        <Avatar
                          src={record.localTeam.logo}
                          icon={<TeamOutlined />}
                        />

                        {record.localTeam.name}
                      </Space>
                    ),
                  },

                  {
                    title: "Marcador",
                    align: "center",
                    width: 120,
                    render: (_, record: any) =>
                      record.status === "programado"
                        ? "vs"
                        : `${record.localGoals ?? 0} - ${
                            record.visitorGoals ?? 0
                          }`,
                  },

                  {
                    title: "Visitante",
                    render: (_, record: any) => (
                      <Space>
                        <Avatar
                          src={record.visitorTeam.logo}
                          icon={<TeamOutlined />}
                        />

                        {record.visitorTeam.name}
                      </Space>
                    ),
                  },

                  {
                    title: "Estado",
                    width: 150,
                    align: "center",
                    render: (_, record: any) => (
                      <TagButtons status={record.status} />
                    ),
                  },

                  {
                    title: "",
                    width: 220,
                    align: "center",
                    render: (_, record: any) => (
                      <Space>
                        {record.status === "programado" && (
                          <Button type="primary" icon={<CaretRightOutlined />}>
                            Iniciar
                          </Button>
                        )}

                        {record.status === "en_juego" && (
                          <>
                            <Button icon={<FormOutlined />}>Vocalía</Button>

                            <Button danger icon={<RollbackOutlined />} />

                            <Button
                              type="primary"
                              icon={<CheckCircleOutlined />}
                            />
                          </>
                        )}

                        {(record.status === "finalizado" ||
                          record.status === "suspendido") && (
                          <Button icon={<EyeOutlined />}>Ver</Button>
                        )}
                      </Space>
                    ),
                  },
                ]}
              />
            </Panel>
          ))}
        </Collapse>
      </Space>
    </>
  );
}
