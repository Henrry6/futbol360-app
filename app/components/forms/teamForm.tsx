import { DatePicker, Divider, Form, Input, Select } from "antd";
import FormGrid from "../FormGrid";
import { $rules } from "@/assets/utils";

export default function TeamForm() {
  return (
    <>
      <FormGrid>
        <Form.Item name="name" label="Nombre" rules={[$rules.required()]}>
          <Input placeholder="Ingrese el nombre del equipo" />
        </Form.Item>

        <Form.Item
          name="representative"
          label="Representante"
          rules={[$rules.required()]}
        >
          <Input placeholder="Ingrese el nombre del representante" />
        </Form.Item>

        <Form.Item
          name="fundacion"
          label="Fecha de fundación"
          rules={[$rules.required()]}
        >
          <DatePicker
            className="w-full"
            placeholder="Seleccione el año de fundación"
          />
        </Form.Item>

        <Form.Item name="phone" label="Teléfono">
          <Input placeholder="Ingrese el número de teléfono" />
        </Form.Item>

        <Form.Item name="logo" label="Logo">
          <Input placeholder="Ingrese la URL del logo" />
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

      <Divider orientation="horizontal">
        <b>Directorio</b>
      </Divider>

      <FormGrid>
        <Form.Item name={["directorio", "presidente"]} label="Presidente">
          <Input placeholder="Ingrese el nombre del presidente" />
        </Form.Item>

        <Form.Item
          name={["directorio", "vicepresidente"]}
          label="Vicepresidente"
        >
          <Input placeholder="Ingrese el nombre del vicepresidente" />
        </Form.Item>

        <Form.Item name={["directorio", "secretario"]} label="Secretario">
          <Input placeholder="Ingrese el nombre del secretario" />
        </Form.Item>

        <Form.Item name={["directorio", "tesorero"]} label="Tesorero">
          <Input placeholder="Ingrese el nombre del tesorero" />
        </Form.Item>
      </FormGrid>
    </>
  );
}
