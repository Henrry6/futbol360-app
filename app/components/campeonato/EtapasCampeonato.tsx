"use client";

import api from "@/services/api";
import FormGrid from "../FormGrid";
import Switch from "antd/lib/switch";
import FormNumber from "../FormNumber";
import { useEffect, useState } from "react";
import { useConfirm } from "../utils/useConfirm";
import { useShowError, useShowMessage } from "../utils/ShowError";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  Empty,
  Form,
  Input,
  Select,
  Spin,
  Typography,
} from "antd";

interface Stage {
  _id: string;
  name?: string;
  order?: number;
  mode: "round_robin" | "round_robin_double" | "groups" | "knockout";
  participants?: number;
  qualifyTeams?: number;
  groups?: number;
  thirdPlaceMatch?: boolean;
  status: "pendiente" | "generada" | "activa" | "finalizada";
}

export default function EtapasCampeonato({
  championshipId,
}: {
  championshipId: string;
}) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const ShowError = useShowError();
  const ShowMessage = useShowMessage();
  const confirm = useConfirm();

  const getStages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/championships/${championshipId}/stages`);
      setStages(Array.isArray(data) ? data : (data.data ?? []));
    } catch (error) {
      ShowError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (championshipId) {
      getStages();
    }
  }, [championshipId]);

  const updateStage = (index: number, patch: Partial<Stage>) => {
    setStages((prev) =>
      prev.map((stage, i) => (i === index ? { ...stage, ...patch } : stage)),
    );
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      await api.post(`/championships/${championshipId}/stages`, {
        name: `Etapa ${stages.length + 1}`,
        status: "pendiente",
        mode: "round_robin",
        order: stages.length + 1,
      });
      await getStages();
    } catch (error) {
      ShowError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (stage: Stage) => {
    try {
      setSaving(stage._id);
      await api.put(
        `/championships/${championshipId}/stages/${stage._id}`,
        stage,
      );
      ShowMessage("Etapa actualizada correctamente");
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = (stage: Stage) => {
    confirm({
      title: `¿Eliminar la etapa "${stage.name ?? "..."}"?`,
      content: "Esta acción no se puede deshacer.",
      okText: "Eliminar",
      cancelText: "Cancelar",
      danger: true,
      onOk: async () => {
        try {
          const { data } = await api.get(`/rounds`, {
            params: { championship: championshipId, stage: stage._id },
          });
          const rounds = Array.isArray(data) ? data : (data.data ?? []);
          if (rounds.length > 0) {
            ShowMessage(
              "No se puede eliminar la etapa porque tiene jornadas o partidos generados.",
              "error",
            );
            return;
          }
          await api.delete(
            `/championships/${championshipId}/stages/${stage._id}`,
          );
          ShowMessage("Etapa eliminada correctamente");
          await getStages();
        } catch (error) {
          ShowError(error);
        }
      },
    });
  };

  return (
    <div className="mb-6">
      <Typography.Title level={5}>Etapas del campeonato</Typography.Title>

      <Card>
        <Spin spinning={loading}>
          <div className="mb-4 flex justify-end">
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
              Agregar etapa
            </Button>
          </div>

          {stages.length === 0 ? (
            <Empty description="No existen etapas configuradas" />
          ) : (
            <Collapse
              items={stages.map((stage, index) => ({
                forceRender: true,
                key: stage._id,
                label: `${index + 1}. ${stage.name || `Etapa ${index + 1}`}`,
                children: (
                  <>
                    <FormGrid>
                      <Form.Item label="Nombre">
                        <Input
                          placeholder="Ej. Fase Regular, Semifinales, Final..."
                          value={stage.name}
                          onChange={(e) =>
                            updateStage(index, { name: e.target.value })
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Modo de competencia">
                        <Select
                          placeholder="Seleccione el formato de la etapa"
                          value={stage.mode}
                          onChange={(mode: Stage["mode"]) =>
                            updateStage(index, { mode })
                          }
                          options={[
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
                          ]}
                        />
                      </Form.Item>

                      <Form.Item label="Participantes">
                        <FormNumber
                          className="w-full"
                          placeholder="Cantidad de equipos participantes"
                          value={stage.participants}
                          onChange={(value) =>
                            updateStage(index, {
                              participants: value as number,
                            })
                          }
                        />
                      </Form.Item>

                      <Form.Item label="Clasifican">
                        <FormNumber
                          className="w-full"
                          placeholder="Cantidad de equipos que avanzan"
                          value={stage.qualifyTeams}
                          onChange={(value) =>
                            updateStage(index, {
                              qualifyTeams: value as number,
                            })
                          }
                        />
                      </Form.Item>

                      {stage.mode === "groups" && (
                        <Form.Item label="Cantidad de grupos">
                          <FormNumber
                            className="w-full"
                            placeholder="Ej. 2, 4, 8..."
                            value={stage.groups}
                            onChange={(value) =>
                              updateStage(index, { groups: value as number })
                            }
                          />
                        </Form.Item>
                      )}

                      {stage.mode === "knockout" && (
                        <Form.Item
                          label="Partido por tercer lugar"
                          valuePropName="checked"
                        >
                          <Switch
                            checked={stage.thirdPlaceMatch}
                            onChange={(checked) =>
                              updateStage(index, { thirdPlaceMatch: checked })
                            }
                          />
                        </Form.Item>
                      )}

                      <Form.Item label="Estado">
                        <Select
                          disabled
                          value={stage.status}
                          options={[
                            {
                              value: "pendiente",
                              label: "Pendiente",
                            },
                            {
                              value: "generada",
                              label: "Generada",
                            },
                            {
                              value: "activa",
                              label: "Activa",
                            },
                            {
                              value: "finalizada",
                              label: "Finalizada",
                            },
                          ]}
                        />
                      </Form.Item>
                    </FormGrid>
                    <div className="md:col-span-2 flex justify-end gap-2 mt-6">
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={saving === stage._id}
                        onClick={() => handleSave(stage)}
                      >
                        Guardar etapa
                      </Button>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(stage)}
                      >
                        Eliminar etapa
                      </Button>
                    </div>
                  </>
                ),
              }))}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
}
