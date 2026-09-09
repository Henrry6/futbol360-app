"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Tag,
  Button,
  Space,
  Tabs,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Select,
  Rate,
  Timeline,
  Modal,
  Avatar,
  Empty,
  Spin,
  Popconfirm,
} from "antd";
import {
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GiSoccerBall, GiWhistle } from "react-icons/gi";
import api from "@/services/api";
import { useShowError } from "@/components/utils/ShowError";

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

export default function VocaliaPage() {
  const { vocaliaId } = useParams<{ vocaliaId: string }>();
  const ShowError = useShowError();
  const [vocalia, setVocalia] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [match, setPartido] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form] = Form.useForm();
  const [eventForm] = Form.useForm();

  const isLocked =
    vocalia?.status === "finalizada" || vocalia?.match?.status === "finalizado";

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/matchs-reports/${vocaliaId}`);
      setVocalia(data);
      form.setFieldsValue(data);
      if (data.match) {
        const { data: partido } = await api.get(`/matchs/${data.match}`);
        setPartido(partido);
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
    if (vocaliaId) load();
  }, [vocaliaId]);

  const handleSave = async (values: any) => {
    try {
      setSaving(true);
      const { data } = await api.patch(`/matchs-reports/${vocaliaId}`, values);
      setVocalia(data);
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(false);
    }
  };

  const openEventModal = (event?: any) => {
    setEditingEvent(event ?? null);
    eventForm.resetFields();
    if (event) eventForm.setFieldsValue(event);
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (values: any) => {
    try {
      if (editingEvent) {
        await api.patch(`/matchs-events/${editingEvent._id}`, values);
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

  const localGoals = events.filter(
    (e) =>
      (e.type === "gol" || e.type === "gol_penal") &&
      e.team === match.localTeam?._id,
  ).length;
  const visitorGoals = events.filter(
    (e) =>
      (e.type === "gol" || e.type === "gol_penal") &&
      e.team === match.visitorTeam?._id,
  ).length;

  return (
    <Spin spinning={loading}>
      {match && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Marcador */}
          <Card
            className="overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #052e16 0%, #14532d 60%, #16a34a 100%)",
              border: "none",
            }}
          >
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

          <Tabs
            defaultActiveKey="eventos"
            items={[
              {
                key: "eventos",
                label: (
                  <span>
                    <GiSoccerBall className="inline mr-1" /> Eventos
                  </span>
                ),
                children: (
                  <Card
                    title="Cronología del partido"
                    extra={
                      !isLocked && (
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => openEventModal()}
                        >
                          Agregar evento
                        </Button>
                      )
                    }
                  >
                    {events.length === 0 ? (
                      <Empty description="Aún no hay eventos registrados" />
                    ) : (
                      <Timeline
                        items={[...events]
                          .sort((a, b) => a.minute - b.minute)
                          .map((event) => {
                            const config = EVENT_CONFIG[event.type];
                            const isLocal =
                              event.team ===
                              (match.localTeam?._id ?? match.localTeam);
                            return {
                              color: config?.color,
                              children: (
                                <div className="flex items-center justify-between">
                                  <Space>
                                    <span style={{ fontSize: 18 }}>
                                      {config?.icon}
                                    </span>
                                    <span className="font-semibold">
                                      {event.minute}
                                    </span>
                                    <span>{config?.label}</span>
                                    <span className="text-gray-500">
                                      {isLocal
                                        ? match.localTeam?.name
                                        : match.visitorTeam?.name}
                                    </span>
                                    {event.player?.name && (
                                      <Tag icon={<UserOutlined />}>
                                        {event.player.name}
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
                                        onConfirm={() =>
                                          handleDeleteEvent(event._id)
                                        }
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
                ),
              },
              {
                key: "equipos",
                label: "Información de equipos",
                forceRender: true,
                children: (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    disabled={isLocked}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(["local", "visitor"] as const).map((side) => (
                        <Card
                          key={side}
                          title={
                            <Space>
                              <Avatar
                                src={
                                  match[
                                    side === "local"
                                      ? "localTeam"
                                      : "visitorTeam"
                                  ]?.logo
                                }
                                icon={<TeamOutlined />}
                              />
                              {
                                match[
                                  side === "local" ? "localTeam" : "visitorTeam"
                                ]?.name
                              }
                            </Space>
                          }
                          size="small"
                        >
                          <Form.Item label="Capitán" name={[side, "captain"]}>
                            <Select
                              placeholder="Selecciona un jugador"
                              options={[]}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[side, "captainArmband"]}
                            valuePropName="checked"
                          >
                            <Checkbox>Usó cinta de capitán</Checkbox>
                          </Form.Item>
                          <Form.Item
                            name={[side, "dressingRoomClean"]}
                            valuePropName="checked"
                          >
                            <Checkbox>Camerino entregado limpio</Checkbox>
                          </Form.Item>
                          <Form.Item
                            name={[side, "dressingRoomEquipment"]}
                            valuePropName="checked"
                          >
                            <Checkbox>Implementos completos</Checkbox>
                          </Form.Item>
                          <Form.Item
                            label="Observaciones"
                            name={[side, "observations"]}
                          >
                            <Input.TextArea rows={2} />
                          </Form.Item>
                        </Card>
                      ))}
                    </div>

                    {!isLocked && (
                      <div className="flex justify-end mt-4">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={saving}
                        >
                          Guardar cambios
                        </Button>
                      </div>
                    )}
                  </Form>
                ),
              },
              {
                key: "informe",
                label: "Informe general",
                forceRender: true,
                children: (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    disabled={isLocked}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Form.Item label="Asistencia" name="attendance">
                        <InputNumber style={{ width: "100%" }} min={0} />
                      </Form.Item>
                      <Form.Item label="Recaudación" name="income">
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          prefix="$"
                        />
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
                    <Form.Item
                      label="Observaciones generales"
                      name="observations"
                    >
                      <Input.TextArea rows={2} />
                    </Form.Item>

                    {!isLocked && (
                      <div className="flex justify-between mt-4">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={saving}
                        >
                          Guardar informe
                        </Button>
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          style={{ background: "#16a34a" }}
                          onClick={() => handleSave({ status: "finalizada" })}
                        >
                          Finalizar partido
                        </Button>
                      </div>
                    )}
                  </Form>
                ),
              },
            ]}
          />

          {/* Modal de eventos */}
          <Modal
            title={editingEvent ? "Editar evento" : "Nuevo evento"}
            open={eventModalOpen}
            onCancel={() => setEventModalOpen(false)}
            onOk={() => eventForm.submit()}
          >
            <Form form={eventForm} layout="vertical" onFinish={handleSaveEvent}>
              <Form.Item
                label="Minuto"
                name="minute"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} max={130} />
              </Form.Item>
              <Form.Item
                label="Tipo de evento"
                name="type"
                rules={[{ required: true }]}
              >
                <Select
                  options={Object.entries(EVENT_CONFIG).map(([value, cfg]) => ({
                    value,
                    label: `${cfg.icon} ${cfg.label}`,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Equipo"
                name="team"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    {
                      value: match.localTeam?._id,
                      label: match.localTeam?.name,
                    },
                    {
                      value: match.visitorTeam?._id,
                      label: match.visitorTeam?.name,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Jugador" name="player">
                <Select placeholder="Selecciona un jugador" options={[]} />
              </Form.Item>
              <Form.Item label="Observaciones" name="observations">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </Spin>
  );
}
