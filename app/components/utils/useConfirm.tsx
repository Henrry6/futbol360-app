"use client";

import { useCallback } from "react";
import { App } from "antd";

interface ConfirmOptions {
  title: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  onOk: () => void | Promise<void>;
}

export function useConfirm() {
  const { modal } = App.useApp();

  const confirm = useCallback(
    ({
      title,
      content,
      okText = "Aceptar",
      cancelText = "Cancelar",
      danger = false,
      onOk,
    }: ConfirmOptions) =>
      modal.confirm({
        title,
        content,
        okText,
        cancelText,
        okType: danger ? "danger" : "primary",
        onOk,
      }),
    [modal],
  );

  return confirm;
}
