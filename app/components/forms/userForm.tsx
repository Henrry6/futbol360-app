import { $rules } from "@/assets/utils";
import { Form, Input, Select } from "antd";

export default function UserForm({ isEdit = false }: { isEdit?: boolean }) {
  return (
    <>
      <Form.Item name="name" label="Nombre" rules={[$rules.required()]}>
        <Input placeholder="Ingrese el nombre" />
      </Form.Item>

      <Form.Item name="username" label="Usuario" rules={[{ required: true }]}>
        <Input placeholder="Ingrese el usuario" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Correo"
        rules={[{ required: true }, { type: "email" }]}
      >
        <Input placeholder="Ingrese el correo" />
      </Form.Item>

      {!isEdit && (
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Ingrese una contraseña" />
        </Form.Item>
      )}

      <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
        <Select
          options={[
            { value: "master", label: "Master" },
            { value: "admin", label: "Administrador" },
            { value: "directivo", label: "Directivo" },
            { value: "player", label: "Jugador" },
          ]}
        />
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select
          options={[
            { value: "activo", label: "Activo" },
            { value: "inactivo", label: "Inactivo" },
          ]}
        />
      </Form.Item>

      <Form.Item name="leagues" label="Ligas">
        <Select mode="multiple" placeholder="Seleccione ligas" />
      </Form.Item>
    </>
  );
}
