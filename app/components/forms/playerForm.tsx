import FormGrid from "../FormGrid";
import { $rules } from "@/assets/utils";
import { AutoCompleteFast } from "../FastAutocomplete";
import { DatePicker, Form, Input, Select } from "antd";
import FormNumber from "../FormNumber";

export default function PlayerForm() {
  return (
    <>
      <FormGrid>
        <Form.Item name="cedula" label="Cédula" rules={[$rules.required()]}>
          <Input placeholder="Ingrese el número de cédula" />
        </Form.Item>

        <Form.Item name="names" label="Nombres" rules={[$rules.required()]}>
          <Input placeholder="Ingrese los nombres del jugador" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Apellidos"
          rules={[$rules.required()]}
        >
          <Input placeholder="Ingrese los apellidos del jugador" />
        </Form.Item>

        <Form.Item
          name="birthDate"
          label="Fecha de nacimiento"
          rules={[$rules.required()]}
        >
          <DatePicker
            className="w-full"
            placeholder="Seleccione la fecha de nacimiento"
          />
        </Form.Item>

        <Form.Item
          name="jerseyNumber"
          label="Número de camiseta"
          rules={[$rules.required()]}
        >
          <FormNumber
            min={1}
            max={99}
            placeholder="Ingrese el número de camiseta"
          />
        </Form.Item>

        <Form.Item name="position" label="Posición">
          <Select
            placeholder="Seleccione una posición"
            options={[
              {
                label: "Portero",
                value: "portero",
              },
              {
                label: "Defensa",
                value: "defensa",
              },
              {
                label: "Lateral derecho",
                value: "lateral_derecho",
              },
              {
                label: "Lateral izquierdo",
                value: "lateral_izquierdo",
              },
              {
                label: "Volante",
                value: "volante",
              },
              {
                label: "Mediocampista",
                value: "mediocampista",
              },
              {
                label: "Extremo derecho",
                value: "extremo_derecho",
              },
              {
                label: "Extremo izquierdo",
                value: "extremo_izquierdo",
              },
              {
                label: "Delantero",
                value: "delantero",
              },
            ]}
          />
        </Form.Item>

        <AutoCompleteFast
          required
          label="Equipo"
          name="team"
          endpoint="/teams"
          optionLabel={(item: any) => item.name}
        />

        <Form.Item name="photo" label="Fotografía">
          <Input placeholder="Ingrese la URL de la fotografía" />
        </Form.Item>

        <Form.Item name="status" label="Estado">
          <Select
            placeholder="Seleccione un estado"
            options={[
              {
                label: "Activo",
                value: "activo",
              },
              {
                label: "Inactivo",
                value: "inactivo",
              },
            ]}
          />
        </Form.Item>
      </FormGrid>
    </>
  );
}
