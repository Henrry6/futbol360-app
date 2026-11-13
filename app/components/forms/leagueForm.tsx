"use client";

import { $rules } from "@/assets/utils";
import { Form, Input, Select } from "antd";

export default function LeagueForm() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5">
        <Form.Item
          label="Código"
          name="code"
          className="sm:col-span-1"
          extra="Los usuarios de la liga inician sesión con este código."
          rules={[
            $rules.required(),
            {
              pattern: /^\S+$/,
              message: "El código no puede tener espacios",
            },
          ]}
          normalize={(value?: string) => value?.trim()}
        >
          <Input placeholder="Ej.: LDPQ" maxLength={20} />
        </Form.Item>
        <Form.Item
          label="Nombre"
          name="name"
          className="sm:col-span-2"
          rules={[$rules.required()]}
        >
          <Input placeholder="Ingrese el nombre de la liga" />
        </Form.Item>
      </div>

      <Form.Item label="Descripción" name="description">
        <Input.TextArea rows={3} placeholder="Descripción breve de la liga" />
      </Form.Item>

      <Form.Item label="Estado" name="status" initialValue="activo">
        <Select
          placeholder="Seleccione una opción"
          options={[
            { label: "Activo", value: "activo" },
            { label: "Inactivo", value: "inactivo" },
          ]}
        />
      </Form.Item>
    </>
  );
}
