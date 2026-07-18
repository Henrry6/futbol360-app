"use client";

import { useState } from "react";
import api from "@/services/api";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useShowError, useShowMessage } from "./utils/ShowError";

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
  const showError = useShowError();
  const showMessage = useShowMessage();

  const handleDelete = async () => {
    try {
      setLoading(true);

      await api.delete(`${endpoint}/${id}`);
      showMessage("Registro eliminado correctamente");
      onSuccess?.();
    } catch (error) {
      await showError(error);
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
      <Button
        title="Eliminar"
        danger
        loading={loading}
        icon={<DeleteOutlined />}
      />
    </Popconfirm>
  );
}
