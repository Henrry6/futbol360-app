"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";
import CrudModal from "@/components/CrudModal";
import { canModifyUser } from "@/assets/users";
import { useAuthStore } from "@/services/store";
import { LockOutlined } from "@ant-design/icons";
import { Table, Tag, Space, Tooltip } from "antd";
import UserForm from "@/components/forms/userForm";
import DeleteButton from "@/components/DeleteButton";
import { useShowError } from "@/components/utils/ShowError";
import { BotonMovimientos } from "@/components/Movements";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  roles: ("master" | "admin" | "directivo" | "player" | "official")[];
  leagues: string[];
  status: "activo" | "inactivo";
  _movements: any[];
}

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const hasRole = useAuthStore((state) => state.hasRole);
  const me = useAuthStore((state) => state.user);
  const showError = useShowError();

  const init = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users", {
        params: {
          $getAllFields: "true",
        },
      });
      console.log(data.data);
      setData(data.data);
    } catch (error) {
      await showError(error);
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
      title: "Roles",
      dataIndex: "roles",
      render: (roles: any) => (
        <div className="flex flex-wrap gap-2">
          {roles.map((x: string, ind: number) => (
            <Tag key={ind} color="blue" className="mr-5">
              {x}
            </Tag>
          ))}
        </div>
      ),
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
                {/* Un master solo puede ser modificado por él mismo (la API responde 403). */}
                {canModifyUser(user, me?.id) ? (
                  <>
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
                  </>
                ) : (
                  <Tooltip title="Solo el propio usuario master puede modificar su información">
                    <Tag icon={<LockOutlined />}>Solo lectura</Tag>
                  </Tooltip>
                )}
                <BotonMovimientos movimientos={user._movements} />
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
