"use client";

import dayjs, { Dayjs } from "dayjs";
import $filtros from "@/assets/utils";
import { Movement } from "@/types/global";
import PageHeader from "@/components/PageHeader";
import TagButtons from "@/components/TagButtons";
import { useVistaIndex } from "@/assets/vistaIndex";
import DeleteButton from "@/components/DeleteButton";
import { usePathname, useRouter } from "next/navigation";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Descriptions, Space, Spin, Table } from "antd";

export interface Player {
  _id: string;
  team: { name: string };
  league: string;
  cedula: string;
  names: string;
  lastName: string;
  birthDate: Date | Dayjs;
  jerseyNumber: number;
  photo?: string;
  position?:
    | "portero"
    | "defensa"
    | "lateral_derecho"
    | "lateral_izquierdo"
    | "volante"
    | "mediocampista"
    | "extremo_derecho"
    | "extremo_izquierdo"
    | "delantero";
  status: "activo" | "inactivo";
  _movements: Movement[];
}

export default function PlayersPage() {
  const router = useRouter();
  const pathname = usePathname();

  const { loading, refresh, setSearch, tableProps } = useVistaIndex<Player>({
    endpoint: "/players",
    params: {
      $getAllFields: "true",
    },
  });

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <PageHeader
          resource={{
            label: "Jugadores",
            href: "/players",
          }}
          loading={loading}
          onSearch={setSearch}
          onRefresh={refresh}
        />
        <Table
          {...tableProps}
          rowKey={(record) => record._id}
          expandable={{
            expandedRowRender: (record) => (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex justify-center">
                  {record.photo ? (
                    // <Image
                    //   src={record.photo}
                    //   width={180}
                    //   preview
                    //   className="rounded-lg"
                    // />
                    <>Foto</>
                  ) : (
                    <Avatar size={180} icon={<UserOutlined />} />
                  )}
                </div>

                <div className="md:col-span-2">
                  <Descriptions
                    title="Información del jugador"
                    column={2}
                    size="small"
                  >
                    <Descriptions.Item label="Equipo">
                      {record.team?.name || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Cédula">
                      {record.cedula}
                    </Descriptions.Item>

                    <Descriptions.Item label="Nombres">
                      {record.names}
                    </Descriptions.Item>

                    <Descriptions.Item label="Apellidos">
                      {record.lastName}
                    </Descriptions.Item>

                    <Descriptions.Item label="Nacimiento">
                      {$filtros.date(record.birthDate)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Edad">
                      {dayjs().diff(record.birthDate, "year")} años
                    </Descriptions.Item>

                    <Descriptions.Item label="Posición">
                      {record.position || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Número">
                      {record.jerseyNumber || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Estado">
                      <TagButtons status={record.status} />
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            ),
          }}
          columns={[
            {
              title: "Foto",
              dataIndex: "photo",
              width: 70,
              align: "center",
              render: (photo) =>
                photo ? (
                  <Avatar src={photo} size={40} />
                ) : (
                  <Avatar size={40}>
                    <UserOutlined />
                  </Avatar>
                ),
            },
            {
              title: "Jugador",
              render: (_, record) => `${record.names} ${record.lastName}`,
            },
            {
              title: "Equipo",
              render: (_, record) => record.team?.name,
            },
            {
              title: "#",
              dataIndex: "jerseyNumber",
              align: "center",
              width: 80,
            },
            {
              title: "Posición",
              dataIndex: "position",
              align: "center",
              render: (value) => value || "-",
            },
            {
              title: "Estado",
              dataIndex: "status",
              align: "center",
              render: (status) => <TagButtons status={status} />,
            },
            {
              key: "options",
              align: "center",
              render: (_, record) => (
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() =>
                      router.push(`${pathname}/${record._id}/edit`)
                    }
                  />

                  <DeleteButton
                    endpoint="/players"
                    id={record._id}
                    title={`¿Eliminar el jugador ${record.names} ${record.lastName}?`}
                    onSuccess={refresh}
                  />
                </Space>
              ),
            },
          ]}
        />
      </div>
    </Spin>
  );
}
