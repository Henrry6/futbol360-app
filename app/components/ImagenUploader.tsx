"use client";

import api from "@/services/api";
import { useState } from "react";
import { cloudinaryUrl } from "@/libs/cloudinary";
import { useShowMessage } from "./utils/ShowError";
import { Avatar, Button, Image, Popconfirm, Space, Upload } from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface Props {
  /** Ruta base del recurso: "/players", "/teams", ... */
  endpoint: string;
  /** _id del documento */
  id: string;
  /** publicId guardado en el documento (record.photo, record.logo, ...) */
  value?: string;
  onChange?: () => void;
  size?: number;
  /** Ícono del placeholder */
  icon?: React.ReactNode;
  shape?: "circle" | "square";
  maxMB?: number;
  crop?: "fill" | "fit" | "face" | "pad";
}

export default function ImageUploader({
  endpoint,
  id,
  value,
  onChange,
  size = 180,
  icon = <UserOutlined />,
  shape = "square",
  maxMB = 5,
  crop = "face",
}: Props) {
  const [loading, setLoading] = useState(false);
  const url = cloudinaryUrl(value, size * 2, crop);
  const message = useShowMessage();

  const upload = async (file: File) => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("file", file);
      await api.post(`${endpoint}/${id}/image`, fd);
      message("Imagen actualizada");
      onChange?.();
    } catch {
      message("No se pudo subir la imagen", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      setLoading(true);
      await api.delete(`${endpoint}/${id}/image`);
      message("Imagen eliminada");
      onChange?.();
    } catch {
      message("No se pudo eliminar la imagen", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {url ? (
        shape === "circle" ? (
          <Avatar size={size} src={url} />
        ) : (
          <Image
            src={url}
            alt={value}
            width={size}
            height={size}
            preview={{ src: cloudinaryUrl(value, 1000, "fit") }}
          />
        )
      ) : (
        <Avatar size={size} shape={shape} icon={icon} />
      )}

      <Space>
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            if (file.size > maxMB * 1024 * 1024) {
              message(`Máximo ${maxMB}MB`, "error");
              return Upload.LIST_IGNORE;
            }
            upload(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            {url ? "Cambiar" : "Subir"}
          </Button>
        </Upload>

        {url && (
          <Popconfirm title="¿Eliminar la imagen?" onConfirm={remove}>
            <Button danger icon={<DeleteOutlined />} loading={loading} />
          </Popconfirm>
        )}
      </Space>
    </div>
  );
}
