"use client";

import { Dayjs } from "dayjs";
import $filtros from "@/assets/utils";
import { Movement } from "@/types/global";
import PageHeader from "@/components/PageHeader";
import TagButtons from "@/components/TagButtons";
import { cloudinaryUrl } from "@/libs/cloudinary";
import { useVistaIndex } from "@/assets/vistaIndex";
import DeleteButton from "@/components/DeleteButton";
import { usePathname, useRouter } from "next/navigation";
import ImageUploader from "@/components/ImagenUploader";
import { EditOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Descriptions,
  Divider,
  Space,
  Spin,
  Table,
} from "antd";

export interface Team {
  _id: string;
  league: string;
  name: string;
  representative: string;
  fundacion: Date | Dayjs;
  logo?: string;
  phone?: string;
  directorio?: {
    presidente: string;
    vicepresidente: string;
    secretarios: string;
    tesorero: string;
  };
  status: "activo" | "inactivo";
  _movements: Movement[];
}

export default function EquiposPage() {
  const router = useRouter();
  const pathname = usePathname();

  const { loading, refresh, setSearch, tableProps } = useVistaIndex<Team>({
    endpoint: "/teams",
    params: {
      $getAllFields: "true",
    },
  });

  return (
    <Spin spinning={loading}>
      <PageHeader
        resource={{
          label: "Equipos",
          href: "/teams",
        }}
        loading={loading}
        onSearch={setSearch}
        onRefresh={refresh}
      />
      <Table
        {...tableProps}
        expandable={{
          expandedRowRender: (record) => (
            <div className="grid md:grid-cols-3 gap-8">
              <ImageUploader
                endpoint="/teams"
                id={record._id}
                value={record.logo}
                onChange={refresh}
                crop="pad"
              />

              <div className="md:col-span-2">
                <Descriptions
                  title="Información general"
                  column={2}
                  size="small"
                >
                  <Descriptions.Item label="Equipo">
                    {record.name}
                  </Descriptions.Item>

                  <Descriptions.Item label="Representante">
                    {record.representative}
                  </Descriptions.Item>

                  <Descriptions.Item label="Fundación">
                    {$filtros.date(record.fundacion) || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Teléfono">
                    {record.phone || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Estado">
                    <TagButtons status={record.status} />
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Descriptions title="Directorio" column={2} size="small">
                  <Descriptions.Item label="Presidente">
                    {record.directorio?.presidente || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Vicepresidente">
                    {record.directorio?.vicepresidente || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Secretario">
                    {record.directorio?.secretarios || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Tesorero">
                    {record.directorio?.tesorero || "-"}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          ),
        }}
        rowKey={(record) => record._id}
        columns={[
          {
            title: "Logo",
            dataIndex: "logo",
            width: 70,
            align: "center",
            render: (photo) =>
              photo ? (
                <Avatar
                  src={cloudinaryUrl(photo, 100, "pad")}
                  size={60}
                  icon={<TeamOutlined />}
                />
              ) : (
                <Avatar size={40}>
                  <TeamOutlined />
                </Avatar>
              ),
          },
          {
            title: "Equipo",
            dataIndex: "name",
          },
          {
            title: "Representante",
            dataIndex: "representative",
          },
          {
            title: "Fundación",
            dataIndex: "fundacion",
            align: "center",
            render: (value) => $filtros.date(value) || "-",
          },
          {
            title: "Teléfono",
            dataIndex: "phone",
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
                  onClick={() => router.push(`${pathname}/${record._id}/edit`)}
                />

                <DeleteButton
                  endpoint="/teams"
                  id={record._id}
                  title={`¿Eliminar el equipo ${record.name}?`}
                  onSuccess={refresh}
                />
              </Space>
            ),
          },
        ]}
      />
    </Spin>
  );
}
