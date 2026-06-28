import api from "@/services/api";
import { $rules } from "@/assets/utils";
import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { League } from "@/(admin)/leagues/page";
import { useShowError } from "../utils/ShowError";

export default function UserForm({ isEdit = false }: { isEdit?: boolean }) {
  const [loading, setLoading] = useState(false);
  const ShowError = useShowError();

  const [selectLeagues, setLeagues] = useState<League[]>([]);
  const loadLeagues = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/leagues");
      setLeagues(data.data);
    } catch (error) {
      ShowError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeagues();
  }, []);

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
        <Select
          mode="multiple"
          loading={loading}
          placeholder="Seleccione ligas"
          options={selectLeagues.map((league) => ({
            value: league._id,
            label: league.name,
          }))}
        />
      </Form.Item>
    </>
  );
}
