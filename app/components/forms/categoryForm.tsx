"use client";

import FormNumber from "../FormNumber";
import { $rules } from "@/assets/utils";
import { Form, Input, Select } from "antd";

export default function CategoryForm() {
  return (
    <>
      <Form.Item label="Nombre" name="name" rules={[$rules.required()]}>
        <Input placeholder="Ingrese el nombre de la categoría" />
      </Form.Item>
      <div className=" grid grid-cols-2 gap-5">
        <Form.Item label="Edad mínima" name="minAge">
          <FormNumber min={0} max={99} placeholder="Ingrese la edad mímina" />
        </Form.Item>
        <Form.Item label="Edad máxima" name="maxAge">
          <FormNumber min={0} max={99} placeholder="Ingrese la edad máxima" />
        </Form.Item>
      </div>

      <Form.Item label="Estado" name="status" initialValue="activo">
        <Select
          placeholder="Seleccione una opción"
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
    </>
  );
}
