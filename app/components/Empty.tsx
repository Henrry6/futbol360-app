"use client";

import { Button } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onCreate?: () => void;
  onRefresh?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "No hay información",
  description = "Todavía no existen registros para mostrar.",
  buttonText = "Crear registro",
  onCreate,
  onRefresh,
  icon = "🏆",
}: EmptyStateProps) {
  return (
    <div className="flex justify-center py-16">
      <div className="max-w-md text-center">
        <div className="text-7xl mb-4 animate-bounce">{icon}</div>

        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>

        <p className="mt-4 text-slate-500 text-lg">{description}</p>

        <div className="flex justify-center gap-3 mt-8">
          {onCreate && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              {buttonText}
            </Button>
          )}

          {onRefresh && (
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>
              Actualizar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
