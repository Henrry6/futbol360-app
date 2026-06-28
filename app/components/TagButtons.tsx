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
  { id: "anulado", description: "Anulado", color: "red" },
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
