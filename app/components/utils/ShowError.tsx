"use client";

import { useCallback } from "react";
import { App } from "antd";
import { AxiosError } from "axios";

export async function getMensajeError(err: any) {
  const result: string | Blob = err.response?.data
    ? err.response.data?.message || err.response.data
    : err.message;
  if (result instanceof Blob) {
    try {
      const error = JSON.parse(await result.text());
      return error.message;
    } catch {
      return result.text();
    }
  }
  return result;
}

export function useShowError() {
  const { modal } = App.useApp();

  const showError = useCallback(
    async (err: unknown, { title = "Proceso fallido", msg = "" } = {}) => {
      const content =
        msg !== "" ? msg : await getMensajeError(err as AxiosError);
      modal.error({
        title,
        width: 450,
        content: <>{content}</>,
        okType: "danger",
      });
    },
    [modal],
  );

  return showError;
}

export function useShowMessage() {
  const { message } = App.useApp();

  const showMessage = useCallback(
    (
      text: string,
      type: "success" | "error" | "info" | "warning" = "success",
    ) => {
      switch (type) {
        case "success":
          message.success(text);
          break;
        case "error":
          message.error(text);
          break;
        case "info":
          message.info(text);
          break;
        case "warning":
          message.warning(text);
          break;
      }
    },
    [message],
  );

  return showMessage;
}
