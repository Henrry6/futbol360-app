import { FC } from "react";
import { Tag } from "antd";

export interface TagButtonProps {
  title?: string;
  status: string;
  className?: string;
  color?: string;
  onClick?: () => void;
}
interface StatusItem {
  id: string;
  description: string;
  color?: string;
}

export const dataStatus: StatusItem[] = [
  { id: "activo", description: "Activo", color: "green" },
  { id: "inactivo", description: "Inactivo", color: "red" },
  { id: "planificado", description: "Planificado", color: "blue" },
  { id: "finalizado", description: "Finalizado", color: "gold" },
  //Campeonatos
  { id: "temporada", description: "Temporada", color: "orange" },
  { id: "apertura", description: "Apertura", color: "green" },
  { id: "clausura", description: "Clausura", color: "purple" },
  { id: "copa", description: "Copa", color: "magenta" },
  { id: "amistoso", description: "Amistoso", color: "cyan" },
  //Partidos
  { id: "programado", description: "Programado", color: "purple" },
  { id: "en_juego", description: "En juego", color: "green" },
  { id: "suspendido", description: "Suspendido", color: "red" },
  //Etapas
  { id: "generada", description: "Generada", color: "purple" },
  { id: "pendiente", description: "Pendiente", color: "red" },
  { id: "finalizada", description: "Finalizada", color: "gold" },
  // Delete
  { id: "anulado", description: "Anulado", color: "red" },
  { id: "cancelado", description: "Cancelado", color: "red" },

  { id: "created", description: "Creado", color: "blue" },
  { id: "borrador", description: "Borrador", color: "orange" },
  { id: "aprobado", description: "Aprobado", color: "green" },
] as const;

export const getStatusInfo = (status: string) => {
  const item = dataStatus.find((x) => x.id === status);

  return {
    color: item?.color,
    message: item?.description ?? status,
  };
};

const TagButtons: FC<TagButtonProps> = ({
  title,
  status,
  className,
  color,
  onClick,
}) => {
  if (!status) return null;

  const { color: defaultColor, message } = getStatusInfo(status);

  return (
    <Tag
      title={title}
      color={color ?? defaultColor}
      className={className}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {message}
    </Tag>
  );
};

export default TagButtons;
