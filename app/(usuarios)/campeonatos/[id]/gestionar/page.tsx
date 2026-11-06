"use client";

import dayjs from "dayjs";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import PageHeader from "@/components/PageHeader";
import { cloudinaryUrl } from "@/libs/cloudinary";
import TagButtons from "@/components/TagButtons";
import { BotonMovimientos } from "@/components/Movements";
import ProgramarPartido from "@/components/campeonato/ProgamarPartido";
import { TablaPosiciones } from "@/components/campeonato/TablaPosiciones";
import { useShowError, useShowMessage } from "@/components/utils/ShowError";
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
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  CaretRightOutlined,
  FormOutlined,
  RollbackOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const EnumsModos = [
  {
    value: "round_robin",
    label: "Todos contra todos",
  },
  {
    value: "round_robin_double",
    label: "Todos contra todos (ida y vuelta)",
  },
  {
    value: "groups",
    label: "Fase de grupos",
  },
  {
    value: "knockout",
    label: "Eliminación directa",
  },
];

const getCampeonatoKey = (championshipId?: string) =>
  championshipId ? `championship:${championshipId}` : null;

const getRoundsKey = (championshipId?: string, stageId?: string) =>
  championshipId && stageId ? `rounds:${championshipId}:${stageId}` : null;

const getMatchesKey = (championshipId?: string, roundId?: string) =>
  championshipId && roundId ? `matchs:${championshipId}:${roundId}` : null;

interface RoundMatchesProps {
  championshipId: string;
  roundId: string;
  onStartMatch: (record: any) => void;
  onRevertStart: (record: any) => void;
}

function RoundMatches({
  championshipId,
  roundId,
  onStartMatch,
  onRevertStart,
}: RoundMatchesProps) {
  const {
    data: matches = [],
    isLoading,
    mutate,
  } = useSWR(getMatchesKey(championshipId, roundId), () =>
    api
      .get("/matchs", {
        params: { championship: championshipId, round: roundId },
      })
      .then((res) => res.data.data),
  );

  return (
    <Spin spinning={isLoading}>
      <Table
        rowKey="_id"
        pagination={false}
        locale={{ emptyText: "No existen partidos para esta jornada." }}
        dataSource={matches}
        columns={[
          {
            title: "Local",
            render: (_, record: any) => (
              <Space>
                <Avatar
                  src={cloudinaryUrl(record.localTeam?.logo, 100, "pad")}
                  size={60}
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

              const isScheduled = record.date && record.hour && record.vocal;

              if (!isScheduled) {
                return "vs";
              }

              return (
                <Space
                  orientation="vertical"
                  size={0}
                  style={{ lineHeight: 1.3 }}
                >
                  <span>{dayjs(record.date).format("DD/MM/YYYY")}</span>
                  <span style={{ color: "green" }}>
                    {dayjs(record.hour).format("HH:mm A")}
                  </span>
                  <span style={{ fontSize: 14, color: "#1042cc" }}>
                    Vocal: {record.vocal?.name ?? "—"}
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
                  src={cloudinaryUrl(record.visitorTeam?.logo, 100, "pad")}
                  size={60}
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
            render: (_, record: any) => <TagButtons status={record.status} />,
          },
          {
            title: "",
            width: 220,
            align: "center",
            render: (_, record: any) => {
              return (
                <Space>
                  {record.status === "programado" && (
                    <ProgramarPartido
                      match={record}
                      onSuccess={() => mutate()}
                    />
                  )}
                  {record.date &&
                    record.hour &&
                    record.vocal &&
                    record.status === "programado" && (
                      <Button
                        type="primary"
                        icon={<CaretRightOutlined />}
                        onClick={() => onStartMatch(record)}
                      >
                        Iniciar
                      </Button>
                    )}

                  {record.status === "en_juego" && (
                    <>
                      <a
                        href={`/campeonatos/${record.championship}/vocalia/${record.matchReport}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button icon={<FormOutlined />} title="Abrir vocalía">
                          Vocalía
                        </Button>
                      </a>
                      <Button
                        danger
                        icon={<RollbackOutlined />}
                        onClick={() => onRevertStart(record)}
                      >
                        Revertir
                      </Button>
                    </>
                  )}

                  {(record.status === "finalizado" ||
                    record.status === "suspendido") && (
                    <a
                      href={`/campeonatos/${record.championship}/vocalia/${record.matchReport}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button icon={<EyeOutlined />}>Ver</Button>
                    </a>
                  )}
                  <BotonMovimientos movimientos={record._movements} />
                </Space>
              );
            },
          },
        ]}
      />
    </Spin>
  );
}

export default function GestionCampeonato() {
  const showMessage = useShowMessage();
  const ShowError = useShowError();
  const { mutate: refreshKey } = useSWRConfig();
  const { id } = useParams();
  const [activeStage, setActiveStage] = useState<string>();
  const [activeRound, setActiveRound] = useState<string>();
  const [generatingFixture, setGeneratingFixture] = useState(false);
  const [deletingFixture, setDeletingFixture] = useState(false);

  const {
    data: campeonato,
    isLoading: loading,
    mutate: mutateCampeonato,
  } = useSWR(getCampeonatoKey(id as string), () =>
    api.get(`/championships/${id}`).then((res) => res.data),
  );

  useEffect(() => {
    if (activeStage || !campeonato?.stages?.length) return;
    const firstStage = campeonato.stages.find(
      (s: any) =>
        s.status === "generada" ||
        s.status === "pendiente" ||
        s.status === "en_juego",
    );
    if (firstStage) setActiveStage(firstStage._id);
  }, [campeonato, activeStage]);

  const {
    data: currentRounds = [],
    isLoading: loadingRounds,
    mutate: mutateRounds,
  } = useSWR(getRoundsKey(id as string, activeStage), () =>
    api
      .get("/rounds", { params: { championship: id, stage: activeStage } })
      .then((res) => res.data.data.sort((a: any, b: any) => a.round - b.round)),
  );

  const refreshAll = async () => {
    setActiveRound(undefined);
    await mutateCampeonato();
    if (activeStage) await mutateRounds();
    const prefix = `matchs:${id}:`;
    await refreshKey((key: unknown) =>
      typeof key === "string" && key.startsWith(prefix) ? true : false,
    );
  };

  const handleChangeStage = (stageId: string) => {
    setActiveStage(stageId);
  };

  const handleGenerateFixture = async () => {
    if (!activeStage) return;
    try {
      setGeneratingFixture(true);
      await api.post(`/championships/${id}/generate-fixture/${activeStage}`);
      showMessage("Fixture generado correctamente");
      await refreshAll();
    } catch (error) {
      ShowError(error);
    } finally {
      setGeneratingFixture(false);
    }
  };

  const handleDeleteFixture = async () => {
    if (!activeStage) return;
    try {
      setDeletingFixture(true);
      await api.delete(`/championships/${id}/delete-fixture/${activeStage}`);
      showMessage("Fixture eliminado correctamente");
      await refreshAll();
    } catch (error) {
      ShowError(error);
    } finally {
      setDeletingFixture(false);
    }
  };

  const handleStartMatch = async (record: any) => {
    try {
      const { data } = await api.post(`/matchs/${record._id}/start`);
      const url = `/campeonatos/${record.championship}/vocalia/${data._id}`;
      window.open(url, "_blank");
      await refreshAll();
      showMessage("Partido iniciado");
    } catch (error) {
      ShowError(error);
    }
  };

  const handleRevertStart = async (record: any) => {
    try {
      await api.delete(`/matchs/${record._id}/revert-start`);
      await refreshAll();
      showMessage("Partido revertido");
    } catch (error) {
      ShowError(error);
    }
  };

  const stages = campeonato?.stages ?? [];
  const currentStage = stages.find((s: any) => s._id === activeStage);

  return (
    <>
      <PageHeader
        resource={{
          label: "Gestionar Campeonato",
          href: "/campeonatos",
        }}
        onRefresh={() => mutateCampeonato()}
        hideInsert
      />
      <Spin spinning={loading}>
        <div style={{ width: "100%" }}>
          {currentStage && (
            <Card
              title="Información de la etapa"
              className="mb-4"
              extra={
                <Space>
                  {currentStage.status === "pendiente" && (
                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      loading={generatingFixture}
                      onClick={handleGenerateFixture}
                    >
                      Generar Fixture
                    </Button>
                  )}

                  {currentStage.status !== "pendiente" &&
                    currentRounds.every(
                      (x: any) => x.status === "pendiente",
                    ) && (
                      <Popconfirm
                        title="¿Eliminar el fixture de esta etapa?"
                        description="Solo es posible si ningún partido tiene información registrada."
                        okText="Sí, eliminar"
                        cancelText="Cancelar"
                        onConfirm={handleDeleteFixture}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          loading={deletingFixture}
                        >
                          Eliminar Fixture
                        </Button>
                      </Popconfirm>
                    )}
                </Space>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 items-start">
                  <div className="border rounded p-4 text-sm leading-tight">
                    Etapa actual: <strong>{currentStage.name}</strong>
                  </div>
                  <div className="border rounded p-4 text-sm leading-tight">
                    Modo:{" "}
                    <strong>
                      {
                        EnumsModos.find((m) => m.value === currentStage.mode)
                          ?.label
                      }
                    </strong>
                  </div>
                  <div className="border rounded p-4 text-sm leading-tight">
                    Estado: <TagButtons status={currentStage.status} />
                  </div>
                  <div className="border rounded p-4 text-sm leading-tight">
                    Participantes: <strong>{currentStage.participants}</strong>
                  </div>
                  <div className="border rounded p-4 text-sm leading-tight">
                    Clasifican: <strong>{currentStage.qualifyTeams}</strong>
                  </div>
                </div>
                <TablaPosiciones
                  championshipId={id as string}
                  stageId={currentStage._id}
                />
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
                      activeKey={activeRound}
                      onChange={(key) => {
                        const roundId = Array.isArray(key) ? key[0] : key;
                        setActiveRound(roundId);
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
                          <RoundMatches
                            championshipId={id as string}
                            roundId={round._id}
                            onStartMatch={handleStartMatch}
                            onRevertStart={handleRevertStart}
                          />
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
