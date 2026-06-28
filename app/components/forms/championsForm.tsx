import FormGrid from "../FormGrid";
import { $rules } from "@/assets/utils";
import { AutoCompleteFast } from "../FastAutocomplete";
import { DatePicker, Form, Input, Select } from "antd";

export default function ChampionshipForm() {
  return (
    <>
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
    </>
  );
}
