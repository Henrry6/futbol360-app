"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/services/store";
import { Table, Tag, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: "master" | "admin" | "directivo" | "player";
  leagues: string[];
  status: "activo" | "inactivo";
  _movements: any[];
}

export default function LeaguesPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const hasRole = useAuthStore((state) => state.hasRole);
  console.log(useAuthStore.getState());
  const loadLeagues = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/users");

      setData(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeagues();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
    },
    {
      title: "Usuario",
      dataIndex: "username",
    },
    {
      title: "Correo",
      dataIndex: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Estado",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "activo" ? "green" : "red"}>{status}</Tag>
      ),
    },

    ...(hasRole(["master", "admin"])
      ? [
          {
            title: "Acciones",
            render: (_: any, user: User) => (
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => editUser(user)}
                >
                  Editar
                </Button>

                <Popconfirm
                  title="¿Eliminar usuario?"
                  onConfirm={() => deleteUser(user._id)}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Eliminar
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  const editUser = (user: User) => {
    console.log("Editing user:", user);
    // TODO: Implementar modal/formulario para editar usuario
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await api.delete(`/users/${userId}`);
      loadLeagues();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>

        {hasRole(["master", "admin"]) && (
          <Button type="primary">Nuevo Usuario</Button>
        )}
      </div>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}
