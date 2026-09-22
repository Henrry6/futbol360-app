"use client";

import api from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GiWhistle } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { AutoCompleteFast } from "@/components/FastAutocomplete";
import { useShowError, useShowMessage } from "@/components/utils/ShowError";
import {
  Card,
  Tag,
  Button,
  Space,
  Form,
  Input,
  Result,
  InputNumber,
  Checkbox,
  Select,
  Timeline,
  Modal,
  Avatar,
  Empty,
  Spin,
  Popconfirm,
  TimePicker,
} from "antd";
import {
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { ContadorMinutos } from "@/components/campeonato/ContadorMinutos";
import { BotonMovimientos } from "@/components/Movements";

const EVENT_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  gol: { label: "Gol", color: "#16a34a", icon: "⚽" },
  gol_penal: { label: "Gol de penal", color: "#16a34a", icon: "⚽" },
  autogol: { label: "Autogol", color: "#dc2626", icon: "⚽" },
  penal_fallado: { label: "Penal fallado", color: "#94a3b8", icon: "❌" },
  tarjeta_amarilla: { label: "Amarilla", color: "#eab308", icon: "🟨" },
  tarjeta_roja: { label: "Roja", color: "#dc2626", icon: "🟥" },
  cambio: { label: "Cambio", color: "#3b82f6", icon: "🔁" },
};

type Side = "local" | "visitor";

export default function VocaliaPage() {
  const { vocaliaId } = useParams<{ vocaliaId: string }>();
  const ShowError = useShowError();
  const message = useShowMessage();

  const router = useRouter();
  const [finishResult, setFinishResult] = useState<{
    status: "finalizado" | "suspendido";
  } | null>(null);

  const [vocalia, setVocalia] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [match, setPartido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // formularios independientes por sección
  const [localForm] = Form.useForm();
  const [visitorForm] = Form.useForm();
  const [reportForm] = Form.useForm();
  const [eventForm] = Form.useForm();
  const equipo = Form.useWatch("team", eventForm);

  // modal de eventos
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // modal de jugadores (plantilla del equipo en esta vocalía)
  const [playersModalOpen, setPlayersModalOpen] = useState(false);
  const [playersModalSide, setPlayersModalSide] = useState<Side>("local");
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  // nuevo estado: cache de jugadores por equipo
  const [teamPlayers, setTeamPlayers] = useState<Record<string, any[]>>({});

  const finishReport = async (values: {
    status: "finalizado" | "suspendido";
  }) => {
    try {
      setSaving(true);
      await api.post(`/matchs-reports/${vocaliaId}/finalizar`, values);
      setFinishResult({ status: values.status });
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(false);
    }
  };

  // redirección automática a los 10s cuando se muestra el resultado
  useEffect(() => {
    if (!finishResult) return;
    const timer = setTimeout(() => {
      router.push("/matchs");
    }, 10000);
    return () => clearTimeout(timer);
  }, [finishResult, router]);

  // trae y cachea jugadores de un equipo (se reutiliza en modal y en columnas)
  const ensureTeamPlayers = async (teamId: string) => {
    if (!teamId || teamPlayers[teamId]) return teamPlayers[teamId] ?? [];
    try {
      const { data } = await api.get(`/players`, { params: { team: teamId } });
      const list = (data.data || data || []).sort(
        (a: any, b: any) => a.jerseyNumber - b.jerseyNumber,
      );
      setTeamPlayers((prev) => ({ ...prev, [teamId]: list }));
      return list;
    } catch (error) {
      ShowError(error);
      return [];
    }
  };

  const isLocked =
    vocalia?.status === "finalizada" || match?.status === "finalizado";

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/matchs-reports/${vocaliaId}`, {
        params: {
          $getAllFields: "true",
        },
      });
      setVocalia(data);
      if (data.match) {
        const { data: partido } = await api.get(`/matchs/${data.match}`);
        setPartido(partido);
        // precarga plantillas completas de ambos equipos
        const localTeamId = partido.localTeam?._id ?? partido.localTeam;
        const visitorTeamId = partido.visitorTeam?._id ?? partido.visitorTeam;
        await Promise.all([
          ensureTeamPlayers(localTeamId),
          ensureTeamPlayers(visitorTeamId),
        ]);
      }
      const { data: eventsData } = await api.get(`/matchs-events`, {
        params: { match: data?.match },
      });
      setEvents(eventsData.data || []);
    } catch (error) {
      ShowError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!vocalia || !match) return;
    localForm.setFieldsValue(vocalia.local);
    visitorForm.setFieldsValue(vocalia.visitor);
    reportForm.setFieldsValue(vocalia);
  }, [vocalia, match]);

  useEffect(() => {
    if (vocaliaId) load();
  }, [vocaliaId]);

  // ---- Guardar información del equipo (local o visitante) ----
  const handleSaveTeam = async (side: Side, values: any) => {
    try {
      setSaving(true);
      const { data } = await api.put(`/matchs-reports/${vocaliaId}`, {
        [side]: { ...vocalia[side], ...values },
      });
      message("Información guardada");
      setVocalia(data);
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(false);
    }
  };

  // ---- Guardar informe general ----
  const handleSaveReport = async (values: any) => {
    try {
      setSaving(true);
      const { data } = await api.put(`/matchs-reports/${vocaliaId}`, values);
      setVocalia(data);
      message("Información guardada");
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(false);
    }
  };

  // ---- Modal jugadores ----
  const openPlayersModal = async (side: Side) => {
    const teamId = side === "local" ? localTeamId : visitorTeamId;
    setPlayersModalSide(side);
    setSelectedPlayers(
      (vocalia?.[side]?.players || []).map((p: any) => p?._id ?? p),
    );
    setPlayersModalOpen(true);
    setLoadingPlayers(true);
    await ensureTeamPlayers(teamId);
    setLoadingPlayers(false);
  };

  const handleSavePlayers = async () => {
    try {
      setSaving(true);
      const { data } = await api.put(`/matchs-reports/${vocaliaId}`, {
        [playersModalSide]: {
          ...vocalia[playersModalSide],
          players: selectedPlayers,
        },
      });
      setVocalia(data);
      setPlayersModalOpen(false);
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(false);
    }
  };

  // ---- Eventos ----
  const openEventModal = (event?: any, presetTeam?: string) => {
    const isEditing = !!event?._id;
    setEditingEvent(isEditing ? event : null);
    eventForm.resetFields();
    if (isEditing) {
      eventForm.setFieldsValue(event);
    } else {
      const minutesSinceStart = vocalia?.startTime
        ? Math.max(
            0,
            Math.floor(dayjs().diff(dayjs(vocalia.startTime), "minute")),
          )
        : 0;
      eventForm.setFieldsValue({
        minute: Math.min(130, minutesSinceStart),
        type: "gol",
        ...(presetTeam ? { team: presetTeam } : {}),
      });
    }
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (values: any) => {
    try {
      if (editingEvent) {
        await api.put(`/matchs-events/${editingEvent._id}`, values);
      } else {
        await api.post(`/matchs-events`, {
          ...values,
          match: vocalia.match?._id ?? vocalia.match,
          championship: vocalia.championship,
          stage: vocalia.stage,
          round: vocalia.round,
          league: vocalia.league,
          vocalia: vocalia._id,
        });
      }
      eventForm.resetFields();
      setEventModalOpen(false);
      load();
    } catch (error) {
      ShowError(error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await api.delete(`/matchs-events/${eventId}`);
      load();
    } catch (error) {
      ShowError(error);
    }
  };

  const handleUpdateTime = async (
    field: "startTime" | "endTime",
    time: dayjs.Dayjs | null,
  ) => {
    if (!time) return;
    try {
      setSaving(true);
      const base = vocalia?.[field] ? dayjs(vocalia[field]) : dayjs();
      const merged = base
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .toDate();
      const { data } = await api.put(`/matchs-reports/${vocaliaId}`, {
        [field]: merged,
      });
      setVocalia(data);
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(false);
    }
  };

  if (!match) return <Spin spinning={loading} />;

  const localTeamId = match.localTeam?._id ?? match.localTeam;
  const visitorTeamId = match.visitorTeam?._id ?? match.visitorTeam;
  const localGoals = events.filter(
    (e) =>
      (e.type === "gol" || e.type === "gol_penal") && e.team === localTeamId,
  ).length;
  const visitorGoals = events.filter(
    (e) =>
      (e.type === "gol" || e.type === "gol_penal") && e.team === visitorTeamId,
  ).length;

  const renderTeamColumn = (side: Side) => {
    const teamId = side === "local" ? localTeamId : visitorTeamId;
    const teamData = side === "local" ? match.localTeam : match.visitorTeam;
    const form = side === "local" ? localForm : visitorForm;

    const registeredIds: string[] = (vocalia?.[side]?.players || []).map(
      (p: any) => p?._id ?? p,
    );
    const allTeamPlayers = teamPlayers[teamId] || [];
    const registered = registeredIds
      .map((id) => allTeamPlayers.find((p: any) => p._id === id))
      .filter(Boolean); // objetos completos {_id, names, lastName, jerseyNumber, ...}

    const teamEvents = [...events]
      .filter((e) => e.team === teamId)
      .sort((a, b) => a.minute - b.minute);

    return (
      <div className="flex flex-col gap-4 mt-6">
        {/* Jugadores */}
        <Card
          size="small"
          title={
            <Space>
              <Avatar src={teamData?.logo} icon={<TeamOutlined />} />
              {teamData?.name}
            </Space>
          }
          extra={
            !isLocked && (
              <Button
                size="small"
                type="primary"
                icon={<UsergroupAddOutlined />}
                onClick={() => openPlayersModal(side)}
              >
                Registrar jugadores
              </Button>
            )
          }
        >
          {registered.length === 0 ? (
            <Empty description="Sin jugadores registrados" />
          ) : (
            <div className="flex flex-col gap-1 p-5">
              {[...registered]
                .sort((a, b) => a.jerseyNumber - b.jerseyNumber)
                .map((p: any) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-2 py-1 border-b border-gray-300 last:border-b-0"
                  >
                    <UserOutlined />
                    <span className="text-gray-600">#{p.jerseyNumber}</span>
                    <span>
                      {p.names} {p.lastName}{" "}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* Eventos del equipo */}
        <Card
          size="small"
          title="Eventos"
          extra={
            !isLocked && (
              <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openEventModal(undefined, teamId)}
              >
                Agregar
              </Button>
            )
          }
        >
          {teamEvents.length === 0 ? (
            <Empty description="Sin eventos" />
          ) : (
            <Timeline
              items={teamEvents.map((event) => {
                const config = EVENT_CONFIG[event.type];
                const playerId = event.player;
                const player = (teamPlayers[teamId] || []).find(
                  (p: any) => p._id === playerId,
                );

                return {
                  color: config?.color,
                  content: (
                    <div className="flex items-center justify-between">
                      <Space>
                        <span style={{ fontSize: 16 }}>{config?.icon}</span>
                        <span className="font-semibold">
                          {event.minute}&apos;{" "}
                        </span>
                        <span>{config?.label}</span>
                        {player && (
                          <Tag icon={<UserOutlined />}>
                            {player.names} {player.lastName} #
                            {player.jerseyNumber}
                          </Tag>
                        )}
                      </Space>
                      {!isLocked && (
                        <Space>
                          <Button
                            size="small"
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEventModal(event)}
                          />
                          <Popconfirm
                            title="¿Eliminar este evento?"
                            onConfirm={() => handleDeleteEvent(event._id)}
                          >
                            <Button
                              size="small"
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        </Space>
                      )}
                    </div>
                  ),
                };
              })}
            />
          )}
        </Card>

        {/* Información del equipo */}
        <Card size="small" title="Información del equipo">
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => handleSaveTeam(side, values)}
          >
            <Form.Item label="Capitán" name="captain">
              <Select
                placeholder="Selecciona un jugador"
                options={registered
                  .sort((a, b) => a.jerseyNumber - b.jerseyNumber)
                  .map((p: any) => ({
                    value: p?._id ?? p,
                    label: p?.names
                      ? ` #${p.jerseyNumber} - ${p.names} ${p.lastName}`
                      : p,
                  }))}
              />
            </Form.Item>
            <Form.Item name="captainArmband" valuePropName="checked">
              <Checkbox>Usó cinta de capitán</Checkbox>
            </Form.Item>
            <Form.Item name="dressingRoomClean" valuePropName="checked">
              <Checkbox>Camerino entregado limpio</Checkbox>
            </Form.Item>
            <Form.Item name="dressingRoomEquipment" valuePropName="checked">
              <Checkbox>Implementos completos</Checkbox>
            </Form.Item>
            <Form.Item label="Observaciones" name="observations">
              <Input.TextArea rows={2} />
            </Form.Item>
            {!isLocked && (
              <div className="flex justify-end">
                <Button type="primary" htmlType="submit" loading={saving}>
                  Guardar
                </Button>
              </div>
            )}
          </Form>
        </Card>
      </div>
    );
  };

  return (
    <Spin spinning={loading}>
      {finishResult ? (
        <div className="max-w-xl mx-auto mt-20">
          <Result
            status={
              finishResult.status === "finalizado" ? "success" : "warning"
            }
            title={
              finishResult.status === "finalizado"
                ? "Vocalía finalizada correctamente"
                : "Partido suspendido"
            }
            subTitle="Serás redirigido a Mis Partidos en unos segundos..."
            extra={[
              <Button
                key="redirect"
                type="primary"
                onClick={() => router.push("/matchs")}
              >
                Ir ahora a Mis Partidos
              </Button>,
            ]}
          />
        </div>
      ) : (
        match && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Marcador */}
            <Card
              className="overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #052e16 0%, #14532d 60%, #16a34a 100%)",
                border: "none",
              }}
            >
              <div className="flex justify-end">
                <BotonMovimientos movimientos={vocalia._movements} />
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <Avatar
                    size={64}
                    src={match.localTeam?.logo}
                    icon={<TeamOutlined />}
                    style={{ border: "3px solid rgba(255,255,255,0.3)" }}
                  />
                  <span className="font-semibold text-center">
                    {match.localTeam?.name}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 px-6">
                  <Tag
                    color={
                      vocalia?.status === "finalizada"
                        ? "success"
                        : vocalia?.status === "en_juego"
                          ? "processing"
                          : "gold"
                    }
                    className="mb-1"
                  >
                    {vocalia?.status === "borrador" && "Vocalía en preparación"}
                    {vocalia?.status === "en_juego" && "En juego"}
                    {vocalia?.status === "finalizada" && "Finalizada"}
                  </Tag>
                  <div className="text-5xl font-bold tracking-wide">
                    {localGoals} - {visitorGoals}
                  </div>

                  <ContadorMinutos
                    startTime={vocalia?.startTime}
                    endTime={vocalia?.endTime}
                    status={vocalia?.status}
                    size="large"
                  />

                  {!isLocked && (
                    <Space size="small" className="mt-1">
                      <TimePicker
                        size="small"
                        format="HH:mm"
                        placeholder="Inicio"
                        value={
                          vocalia?.startTime
                            ? dayjs(vocalia.startTime)
                            : undefined
                        }
                        onChange={(t) => handleUpdateTime("startTime", t)}
                      />
                      <TimePicker
                        size="small"
                        format="HH:mm"
                        placeholder="Fin"
                        value={
                          vocalia?.endTime ? dayjs(vocalia.endTime) : undefined
                        }
                        onChange={(t) => handleUpdateTime("endTime", t)}
                      />
                    </Space>
                  )}
                  <span className="text-xs opacity-70">
                    <GiWhistle className="inline mr-1" />
                    {match.referee?.name ?? "Árbitro sin asignar"}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1">
                  <Avatar
                    size={64}
                    src={match.visitorTeam?.logo}
                    icon={<TeamOutlined />}
                    style={{ border: "3px solid rgba(255,255,255,0.3)" }}
                  />
                  <span className="font-semibold text-center">
                    {match.visitorTeam?.name}
                  </span>
                </div>
              </div>
            </Card>

            {/* Dos columnas por equipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderTeamColumn("local")}
              {renderTeamColumn("visitor")}
            </div>

            {/* Informe general (único, para ambos equipos) */}
            <Card title="Informe general">
              <Form
                form={reportForm}
                layout="vertical"
                onFinish={handleSaveReport}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* <AutoCompleteFast
                    label="Arbitrador"
                    name="referee"
                    endpoint="/referees"
                    optionLabel={(item: any) => `${item.names}`}
                  /> */}
                  <Form.Item label="Recaudación" name="income">
                    <InputNumber style={{ width: "100%" }} min={0} prefix="$" />
                  </Form.Item>
                  <Form.Item
                    label="Calificación al árbitro"
                    name="refereeRating"
                  >
                    <Select
                      placeholder="Calificar"
                      options={[
                        { value: "muy_buena", label: "Muy buena" },
                        { value: "buena", label: "Buena" },
                        { value: "regular", label: "Regular" },
                        { value: "mala", label: "Mala" },
                      ]}
                    />
                  </Form.Item>
                </div>

                <Form.Item label="Informe del árbitro" name="refereeReport">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Informe del vocal" name="vocalReport">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Observaciones generales" name="observations">
                  <Input.TextArea rows={2} />
                </Form.Item>

                {!isLocked && (
                  <div className="flex justify-between mt-4">
                    <Button type="primary" htmlType="submit" loading={saving}>
                      Guardar informe
                    </Button>
                    <Space>
                      <Popconfirm
                        title="Suspender partido"
                        description="¿Seguro que deseas suspender este partido?"
                        okText="Suspender"
                        okButtonProps={{ danger: true }}
                        cancelText="Cancelar"
                        onConfirm={() => finishReport({ status: "suspendido" })}
                      >
                        <Button danger icon={<StopOutlined />}>
                          Suspender
                        </Button>
                      </Popconfirm>

                      <Popconfirm
                        title="Finalizar partido"
                        description="¿Seguro que deseas finalizar este partido? El acta quedará cerrada."
                        okText="Finalizar"
                        cancelText="Cancelar"
                        onConfirm={() => finishReport({ status: "finalizado" })}
                      >
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          style={{ background: "#16a34a" }}
                        >
                          Finalizar partido
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                )}
              </Form>
            </Card>

            {/* Modal de jugadores por equipo */}
            <Modal
              title={`Registrar jugadores - ${
                playersModalSide === "local"
                  ? match.localTeam?.name
                  : match.visitorTeam?.name
              }`}
              open={playersModalOpen}
              onCancel={() => setPlayersModalOpen(false)}
              onOk={handleSavePlayers}
              confirmLoading={saving}
              width={800}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Selecciona los jugadores convocados"
                loading={loadingPlayers}
                value={selectedPlayers}
                onChange={setSelectedPlayers}
                options={(
                  teamPlayers[
                    playersModalSide === "local" ? localTeamId : visitorTeamId
                  ] || []
                ).map((p: any) => ({
                  value: p._id,
                  label: `${p.names} ${p.lastName} - #${p.jerseyNumber}`,
                }))}
                showSearch={{
                  filterOption: (input, option) =>
                    (option?.label as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase()),
                }}
              />
            </Modal>

            {/* Modal de eventos */}
            <Modal
              title={editingEvent?._id ? "Editar evento" : "Nuevo evento"}
              open={eventModalOpen}
              onCancel={() => setEventModalOpen(false)}
              onOk={() => eventForm.submit()}
            >
              <Form
                form={eventForm}
                layout="vertical"
                onFinish={handleSaveEvent}
                initialValues={editingEvent}
              >
                <Form.Item
                  label="Minuto"
                  name="minute"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    max={130}
                    placeholder="Ingrese el minuto"
                  />
                </Form.Item>
                <Form.Item
                  label="Tipo de evento"
                  name="type"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Seleccione un tipo de evento"
                    options={Object.entries(EVENT_CONFIG).map(
                      ([value, cfg]) => ({
                        value,
                        label: `${cfg.icon} ${cfg.label}`,
                      }),
                    )}
                  />
                </Form.Item>
                <Form.Item
                  label="Equipo"
                  name="team"
                  rules={[{ required: true }]}
                >
                  <Select
                    disabled
                    options={[
                      { value: localTeamId, label: match.localTeam?.name },
                      { value: visitorTeamId, label: match.visitorTeam?.name },
                    ]}
                  />
                </Form.Item>
                {equipo && (
                  <Form.Item label="Jugador" name="player">
                    <Select
                      placeholder="Seleccione un jugador"
                      options={(() => {
                        const side =
                          equipo === localTeamId ? "local" : "visitor";
                        const registeredIds: string[] = (
                          vocalia?.[side]?.players || []
                        ).map((p: any) => p?._id ?? p);
                        const allTeamPlayers = teamPlayers[equipo] || [];
                        return registeredIds
                          .map((id) =>
                            allTeamPlayers.find((p: any) => p._id === id),
                          )
                          .filter(Boolean)
                          .sort(
                            (a: any, b: any) => a.jerseyNumber - b.jerseyNumber,
                          )
                          .map((p: any) => ({
                            value: p._id,
                            label: `${p.names} ${p.lastName} - #${p.jerseyNumber}`,
                          }));
                      })()}
                    />
                  </Form.Item>
                )}
                <Form.Item label="Observaciones" name="observations">
                  <Input.TextArea rows={2} placeholder="Observaciones" />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )
      )}
    </Spin>
  );
}
