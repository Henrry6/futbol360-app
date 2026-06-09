import { Modal } from "antd";
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

export async function showError(
  err: unknown,
  { title = "Proceso fallido", msg = "" } = {},
) {
  const content = msg !== "" ? msg : await getMensajeError(err as AxiosError);
  Modal.error({
    title,
    width: 450,
    content: <>{content}</>,
    okType: "danger",
  });
}
