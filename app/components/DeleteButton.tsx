// components/ui/DeleteButton.tsx

"use client";

import { useState } from "react";
import api from "@/services/api";
import { showError } from "./utils/ShowError";
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteButtonProps {
  endpoint: string;
  id: string;
  title?: string;
  onSuccess?: () => void;
}

export default function DeleteButton({
  endpoint,
  id,
  title = "¿Está seguro de eliminar este registro?",
  onSuccess,
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await api.delete(`${endpoint}/${id}`);

      message.success("Registro eliminado correctamente");

      onSuccess?.();
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title={title}
      okText="Sí"
      cancelText="No"
      onConfirm={handleDelete}
    >
      <Button danger loading={loading} icon={<DeleteOutlined />}>
        Eliminar
      </Button>
    </Popconfirm>
  );
}
