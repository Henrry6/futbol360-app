"use client";

import dayjs from "dayjs";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TagButtons from "@/components/TagButtons";
import { useShowError } from "@/components/utils/ShowError";
import ProgramarPartido from "@/components/campeonato/ProgamarPartido";
import {
  Card,
  Collapse,
  Table,
  Space,
  Button,
  Avatar,
  Spin,
  Tabs,
  Empty,
  Tag,
} from "antd";
import {
  EyeOutlined,
  CaretRightOutlined,
  FormOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

export default function GestionCampeonato() {
  const [loading, setLoading] = useState(false);
  const [campeonato, setCampeonato] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<string>();

  // Cache de rounds por etapa: { [stageId]: Round[] }
  const [roundsByStage, setRoundsByStage] = useState<Record<string, any[]>>({});
  const [loadingRounds, setLoadingRounds] = useState(false);

  const [matchesByRound, setMatchesByRound] = useState<Record<string, any[]>>(
    {},
  );
  const [loadingMatches, setLoadingMatches] = useState<Record<string, boolean>>(
    {},
  );

  const getMatchesByRound = async (roundId: string, force = false) => {
    if (!force && matchesByRound[roundId]) return;

    try {
      setLoadingMatches((prev) => ({ ...prev, [roundId]: true }));
      const { data } = await api.get(`/matchs`, {
        params: { championship: id, round: roundId },
      });
      setMatchesByRound((prev) => ({
        ...prev,
        [roundId]: data.data,
      }));
    } catch (error) {
      ShowError(error);
    } finally {
      setLoadingMatches((prev) => ({ ...prev, [roundId]: false }));
    }
  };

  const ShowError = useShowError();
  const { id } = useParams();

  const getCampeonato = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/championships/${id}`);
      setCampeonato(data);
      const firstStage = data.stages.find((s: any) => s.status === "generada");
      if (firstStage) {
        setActiveStage(firstStage._id);
        getRoundsByStage(firstStage._id);
      }
    } catch (error) {
      ShowError(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoundsByStage = async (stageId: string) => {
    if (roundsByStage[stageId]) return;
    try {
      setLoadingRounds(true);
      const { data } = await api.get(`/rounds`, {
        params: { championship: id, stage: stageId },
      });
      setRoundsByStage((prev) => ({
        ...prev,
        [stageId]: data.data.sort((a: any, b: any) => a.round - b.round),
      }));
    } catch (error) {
      ShowError(error);
    } finally {
      setLoadingRounds(false);
    }
  };

  useEffect(() => {
    getCampeonato();
  }, []);

  const handleChangeStage = (stageId: string) => {
    setActiveStage(stageId);
    getRoundsByStage(stageId);
  };

  const stages = campeonato?.stages ?? [];
  const currentStage = stages.find((s: any) => s._id === activeStage);
  const currentRounds = activeStage ? (roundsByStage[activeStage] ?? []) : [];
  return (
    <>
      <PageHeader
        resource={{
          label: "Campeonatos / Calendario",
          href: "/campeonatos",
        }}
      />
      <Spin spinning={loading}>
        <div style={{ width: "100%" }}>
          {currentStage && (
            <Card title="Información de la etapa" className="mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                <div className="border rounded p-2">
                  Etapa actual: <strong>{currentStage.name}</strong>
                </div>
                <div className="border rounded p-2">
                  Modo: <strong>{currentStage.mode}</strong>
                </div>
                <div className="border rounded p-2">
                  Estado: <TagButtons status={currentStage.status} />
                </div>
                <div className="border rounded p-2">
                  Participantes: <strong>{currentStage.participants}</strong>
                </div>
                <div className="border rounded p-2">
                  Clasifican: <strong>{currentStage.qualifyTeams}</strong>
                </div>
              </div>
            </Card>
          )}

          {stages.length === 0 ? (
            <Empty description="Este campeonato aún no tiene etapas generadas." />
          ) : (
            <Tabs
              activeKey={activeStage}
              onChange={handleChangeStage}
              items={stages.map((stage: any) => ({
                key: stage._id,
                label: stage.name,
                children: (
                  <Spin spinning={loadingRounds && activeStage === stage._id}>
                    <Collapse
                      accordion
                      defaultActiveKey={["0"]}
                      onChange={(key) => {
                        const roundId = Array.isArray(key) ? key[0] : key;
                        if (roundId) getMatchesByRound(roundId);
                      }}
                      items={currentRounds.map((round: any) => ({
                        key: round._id,
                        label: (
                          <Space
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <strong>{round.name}</strong>
                            <TagButtons status={round.status} />
                          </Space>
                        ),
                        children: (
                          <Spin spinning={!!loadingMatches[round._id]}>
                            <Table
                              rowKey="_id"
                              pagination={false}
                              locale={{
                                emptyText:
                                  "No existen partidos para esta jornada.",
                              }}
                              dataSource={matchesByRound[round._id] ?? []}
                              columns={[
                                {
                                  title: "Local",
                                  render: (_, record: any) => (
                                    <Space>
                                      <Avatar
                                        src={record.localTeam?.logo}
                                        icon={<TeamOutlined />}
                                      />
                                      {record.localTeam?.name}
                                    </Space>
                                  ),
                                },
                                {
                                  title: "Marcador / Programación",
                                  align: "center",
                                  width: 140,
                                  render: (_, record: any) => {
                                    if (record.status !== "programado") {
                                      return `${record.localGoals ?? 0} - ${record.visitorGoals ?? 0}`;
                                    }

                                    const isScheduled =
                                      record.date &&
                                      record.hour &&
                                      record.vocal;

                                    if (!isScheduled) {
                                      return "vs";
                                    }

                                    return (
                                      <Space
                                        orientation="vertical"
                                        size={0}
                                        style={{ lineHeight: 1.3 }}
                                      >
                                        <span>
                                          {dayjs(record.date).format(
                                            "DD/MM/YYYY",
                                          )}
                                        </span>
                                        <span>
                                          {dayjs(record.hour).format("HH:mm")}
                                        </span>
                                        <span
                                          style={{
                                            fontSize: 14,
                                            color: "#1042cc",
                                          }}
                                        >
                                          {record.vocal?.name ?? "—"}
                                        </span>
                                      </Space>
                                    );
                                  },
                                },
                                {
                                  title: "Visitante",
                                  render: (_, record: any) => (
                                    <Space>
                                      <Avatar
                                        src={record.visitorTeam?.logo}
                                        icon={<TeamOutlined />}
                                      />
                                      {record.visitorTeam?.name}
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
                                  render: (_, record: any) => {
                                    const isScheduled =
                                      record.date &&
                                      record.hour &&
                                      record.vocal;

                                    return (
                                      <Space>
                                        {record.status === "programado" && (
                                          <>
                                            <ProgramarPartido
                                              match={record}
                                              onSuccess={() => {
                                                getMatchesByRound(
                                                  round._id,
                                                  true,
                                                );
                                              }}
                                            />
                                            <Button
                                              type="primary"
                                              icon={<CaretRightOutlined />}
                                              disabled={!isScheduled}
                                            >
                                              Iniciar
                                            </Button>
                                          </>
                                        )}

                                        {record.status === "en_juego" && (
                                          <>
                                            <Button icon={<FormOutlined />}>
                                              Vocalía
                                            </Button>
                                            <Button
                                              danger
                                              icon={<RollbackOutlined />}
                                            />
                                            <Button
                                              type="primary"
                                              icon={<CheckCircleOutlined />}
                                            />
                                          </>
                                        )}

                                        {(record.status === "finalizado" ||
                                          record.status === "suspendido") && (
                                          <Button icon={<EyeOutlined />}>
                                            Ver
                                          </Button>
                                        )}
                                      </Space>
                                    );
                                  },
                                },
                              ]}
                            />
                          </Spin>
                        ),
                      }))}
                    />
                  </Spin>
                ),
              }))}
            />
          )}
        </div>
      </Spin>
    </>
  );
}
