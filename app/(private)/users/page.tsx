"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";
import CrudModal from "@/components/CrudModal";
import { useAuthStore } from "@/services/store";
import UserForm from "@/components/forms/userForm";
import { DeleteOutlined } from "@ant-design/icons";
import { showError } from "@/components/utils/ShowError";
import { Table, Tag, Button, Space, Popconfirm } from "antd";
import DeleteButton from "@/components/DeleteButton";

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

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const hasRole = useAuthStore((state) => state.hasRole);

  const init = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users", {
        params: {
          $getAllFields: "true",
        },
      });
      setData(data.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
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
                <CrudModal
                  title="Editar Usuario"
                  buttonText="Editar"
                  endpoint="/users"
                  mode="edit"
                  id={user._id}
                  initialValues={user}
                  onSuccess={init}
                >
                  <UserForm isEdit />
                </CrudModal>

                <DeleteButton
                  endpoint="/users"
                  id={user._id}
                  title={`¿Eliminar usuario ${user.name}?`}
                  onSuccess={init}
                />
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>

        {hasRole(["master", "admin"]) && (
          <CrudModal
            title="Nuevo Usuario"
            endpoint="/users"
            buttonText="Nuevo Usuario"
            mode="create"
            initialValues={{
              role: "admin",
              status: "activo",
            }}
            onSuccess={init}
          >
            <UserForm />
          </CrudModal>
        )}
      </div>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
