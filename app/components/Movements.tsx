import { FC } from "react";
import $filtros from "@/assets/filtros";
import { Movement } from "@/types/utils";
import { Button, ButtonProps, Drawer, Timeline } from "antd";
import { useAuthStore } from "@/services/store";
import {
  MailOutlined,
  StopOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

export const BotonMovimientos: FC<{
  movimientos: Movement[];
  danger?: boolean;
  usarBoton?: boolean;
  tipoBoton?: ButtonProps["type"];
}> = (props) => {
  const setBitacora = useAuthStore((state) => state.setBitacora);
  const tieneMovimientos =
    Array.isArray(props.movimientos) && props.movimientos.length !== 0;
  return props.usarBoton ? (
    <Button
      icon={<HistoryOutlined />}
      title="Ver historial"
      disabled={!tieneMovimientos}
      type={props.tipoBoton}
      onClick={
        tieneMovimientos ? () => setBitacora(props.movimientos) : undefined
      }
    />
  ) : (
    <HistoryOutlined
      style={{ color: props.danger ? "red" : "" }}
      title="Ver historial"
      className={!tieneMovimientos ? "text-gray-300 cursor-not-allowed" : ""}
      onClick={
        tieneMovimientos ? () => setBitacora(props.movimientos) : undefined
      }
    />
  );
};

const Bitacora: FC = () => {
  const bitacora = useAuthStore((state) => state.bitacora);
  const setBitacora = useAuthStore((state) => state.setBitacora);

  const getColorIcon = (type: string) => {
    switch (type) {
      case "created":
        return { color: "green" };
      case "approved":
        return { color: "green" };
      case "denegado":
        return { color: "red" };
      case "bulk-emission":
        return { color: "#2b9bb5" };
      case "bulk-sent":
        return { color: "#535fed" };
      case "issued":
      case "bulk-emitido":
        return { color: "green", icon: <CheckOutlined /> };
      case "pre-canceled":
        return { color: "#FFA500", icon: <QuestionCircleOutlined /> };
      case "canceled":
        return { color: "red", icon: <StopOutlined /> };
      case "edit":
        return { color: "gray" };
      case "email":
        return { color: "#00CCFF", icon: <MailOutlined /> };
      case "deleted":
        return { color: "red", icon: <DeleteOutlined /> };
      case "cancel-by-sat":
        return { color: "red", icon: <StopOutlined /> };
      case "pre-cancel-by-sat":
        return { color: "#FFA500", icon: <QuestionCircleOutlined /> };
    }
  };

  return (
    <Drawer
      title="Bitácora"
      placement="right"
      closable={false}
      open={bitacora.length !== 0}
      onClose={() => setBitacora([])}
    >
      <Timeline
        items={bitacora.map((mov: Movement, index: number) => {
          return {
            key: "movimiento" + index,
            color: getColorIcon(mov.type)?.color,
            dot: getColorIcon(mov.type)?.icon,
            content: (
              <>
                {mov.nota} <br />
                {$filtros.completeDate(mov?.date as string)}
              </>
            ),
          };
        })}
      />
    </Drawer>
  );
};

export default Bitacora;
