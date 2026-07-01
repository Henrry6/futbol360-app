import dayjs from "dayjs";
import { FC } from "react";
import FormGrid from "../FormGrid";
import FormNumber from "../FormNumber";
import { $rules } from "@/assets/utils";
import { AutoCompleteFast } from "../FastAutocomplete";
import {
  Button,
  Card,
  Collapse,
  DatePicker,
  Divider,
  Empty,
  Form,
  FormInstance,
  Input,
  Select,
  Typography,
} from "antd";
const ChampionshipForm: FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <div className="mb-6">
      <FormGrid>
        <Form.Item name="name" label="Nombre" rules={[$rules.required()]}>
          <Input placeholder="Ingrese un nombre" />
        </Form.Item>

        <AutoCompleteFast
          required
          label="Categoría"
          name="category"
          endpoint="/categories"
          optionLabel={(item: any) => `${item.name}`}
        />

        <Form.Item name="season" label="Temporada">
          <DatePicker
            className="w-full"
            picker="year"
            placeholder="Seleccione el año"
          />
        </Form.Item>

        <Form.Item name="type" label="Tipo">
          <Select
            placeholder="Seleccione un opción"
            options={[
              {
                label: "Temporada",
                value: "temporada",
              },
              {
                label: "Apertura",
                value: "apertura",
              },
              {
                label: "Clausura",
                value: "clausura",
              },
              {
                label: "Copa",
                value: "copa",
              },
              {
                label: "Amistoso",
                value: "amistoso",
              },
            ]}
          />
        </Form.Item>

        <Form.Item name="status" label="Estado">
          <Select
            options={[
              {
                label: "Planificado",
                value: "planificado",
              },
              {
                label: "Activo",
                value: "activo",
              },
              {
                label: "Finalizado",
                value: "finalizado",
              },
              {
                label: "Cancelado",
                value: "cancelado",
              },
            ]}
          />
        </Form.Item>

        <Form.Item name="startDate" label="Fecha inicio">
          <DatePicker className="w-full" placeholder="Ingrese una fecha" />
        </Form.Item>

        <Form.Item name="endDate" label="Fecha fin">
          <DatePicker className="w-full" placeholder="Ingrese una fecha" />
        </Form.Item>
      </FormGrid>
      <Form.Item
        name="observations"
        label="Observaciones"
        className="col-span-2"
      >
        <Input.TextArea rows={3} placeholder="Ingrese una observación" />
      </Form.Item>
      <Divider className="col-span-2" />
      <Typography.Title level={5}>Equipos participantes</Typography.Title>
      <Card>
        <Form.List name="teams">
          {(fields, { add, remove }) => (
            <>
              <div className="mb-4 flex justify-end">
                <div>
                  <Button
                    type="dashed"
                    block
                    onClick={() =>
                      add({
                        status: "activo",
                        fechaIngreso: dayjs(),
                      })
                    }
                  >
                    + Agregar equipo
                  </Button>
                </div>
              </div>
              {fields.length === 0 ? (
                <Empty
                  className="mt-6"
                  description="No hay equipos agregados"
                />
              ) : (
                <Collapse
                  className="mt-4"
                  items={fields.map((field, index) => ({
                    forceRender: true,
                    key: field.key,
                    label: (
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) =>
                          `${index + 1}. ${getFieldValue(["teams", field.name, "teamName"]) || `Equipo ${index + 1}`}`
                        }
                      </Form.Item>
                    ),
                    children: (
                      <div className="grid md:grid-cols-2 gap-4">
                        <Form.Item name={[field.name, "teamName"]} hidden>
                          <Input />
                        </Form.Item>
                        <AutoCompleteFast
                          required
                          name={[field.name, "team"]}
                          label="Equipo"
                          endpoint="/teams"
                          optionLabel={(item) => item.name}
                          triggerOnMount={true}
                          onSelect={(team) => {
                            form.setFieldValue(
                              ["teams", field.name, "teamName"],
                              team?.name,
                            );
                          }}
                        />

                        <Form.Item name={[field.name, "status"]} label="Estado">
                          <Select
                            options={[
                              { value: "activo", label: "Activo" },
                              { value: "retirado", label: "Retirado" },
                              { value: "expulsado", label: "Expulsado" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, "fechaIngreso"]}
                          label="Fecha ingreso"
                          rules={[$rules.required()]}
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, "fechaSalida"]}
                          label="Fecha salida"
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, "finalPosition"]}
                          label="Posición final"
                        >
                          <FormNumber
                            className="w-full"
                            placeholder="Posición del equipo"
                            formatter={(text) => `${text} Posición`}
                            disabled
                          />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, "points"]}
                          label="Puntos obtenidos del equipo"
                        >
                          <FormNumber
                            className="w-full"
                            disabled
                            placeholder="Puntos"
                          />
                        </Form.Item>

                        <Form.Item
                          className="md:col-span-2"
                          name={[field.name, "notes"]}
                          label="Observaciones"
                        >
                          <Input.TextArea rows={3} />
                        </Form.Item>

                        <div className="md:col-span-2 flex justify-end">
                          <Button danger onClick={() => remove(field.name)}>
                            {/* ToDo: Validar cuando se puede eliminar */}
                            Eliminar equipo
                          </Button>
                        </div>
                      </div>
                    ),
                  }))}
                />
              )}
            </>
          )}
        </Form.List>
      </Card>
    </div>
  );
};
export default ChampionshipForm;
