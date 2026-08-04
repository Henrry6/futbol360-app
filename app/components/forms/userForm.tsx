import api from "@/services/api";
import { $rules } from "@/assets/utils";
import { useEffect, useState } from "react";
import { League } from "@/(admin)/leagues/page";
import { useShowError } from "../utils/ShowError";
import { Checkbox, Form, Input, Select, Space } from "antd";

export default function UserForm({ isEdit = false }: { isEdit?: boolean }) {
  const [loading, setLoading] = useState(false);
  const ShowError = useShowError();
  const form = Form.useFormInstance();

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

  const roles: string[] = Form.useWatch("roles", form) ?? [];
  const isOfficial = roles.includes("official");

  useEffect(() => {
    if (!isOfficial) {
      form.setFieldValue("official", undefined);
    }
  }, [isOfficial]);

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

      <Form.Item
        name="roles"
        label="Roles"
        rules={[{ required: true, message: "Selecciona al menos un rol" }]}
      >
        <Select
          mode="multiple"
          placeholder="Seleccione uno o varios roles"
          options={[
            { value: "master", label: "Master" },
            { value: "admin", label: "Administrador" },
            { value: "directivo", label: "Directivo" },
            { value: "player", label: "Jugador" },
            { value: "official", label: "Oficial" },
          ]}
        />
      </Form.Item>

      {isOfficial && (
        <Form.Item label="Funciones como oficial" required shouldUpdate>
          <Space orientation="vertical">
            <Form.Item
              name={["official", "canReferee"]}
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Puede arbitrar</Checkbox>
            </Form.Item>
            <Form.Item
              name={["official", "canAssist"]}
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Puede ser asistente</Checkbox>
            </Form.Item>
            <Form.Item
              name={["official", "canBeVocal"]}
              valuePropName="checked"
              noStyle
            >
              <Checkbox>Puede ser vocal</Checkbox>
            </Form.Item>
          </Space>

          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.official !== cur.official}
            rules={[
              {
                validator: async () => {
                  const official = form.getFieldValue("official");
                  const hasAtLeastOne =
                    official?.canReferee ||
                    official?.canAssist ||
                    official?.canBeVocal;
                  if (!hasAtLeastOne) {
                    return Promise.reject("Selecciona al menos una función");
                  }
                },
              },
            ]}
          >
            {() => {
              const official = form.getFieldValue("official");
              const hasAtLeastOne =
                official?.canReferee ||
                official?.canAssist ||
                official?.canBeVocal;
              return !hasAtLeastOne ? (
                <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
                  Selecciona al menos una función
                </div>
              ) : null;
            }}
          </Form.Item>
        </Form.Item>
      )}

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
