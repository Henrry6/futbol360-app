import { Form } from "antd";
import api from "@/services/api";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useShowError } from "@/components/utils/ShowError";
import { useShowMessage } from "@/components/utils/ShowError";
import { useCallback, useEffect, useMemo, useState } from "react";

interface CrudFormProps<T> {
  endpoint: string;
  datos?: Partial<T>;
  onSuccess?: (data: T) => void;
  params?: Record<string, any>;
  formatearDataInicial?: (data: T) => Promise<void> | void;
}

export function useVisataInsert<T>({
  endpoint,
  datos,
  onSuccess,
  params,
  formatearDataInicial,
}: CrudFormProps<T>) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const showError = useShowError();
  const showMessage = useShowMessage();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const listPath = `/${pathname.split("/").filter(Boolean)[0]}`;

  const load = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data } = await api.get(`${endpoint}/${id}`, {
        params,
      });
      await formatearDataInicial?.(data);
      form.setFieldsValue(data);
      return data || datos;
    } catch (error) {
      await showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onSubmit = useCallback(
    async (values: any) => {
      try {
        let response;
        if (!id) {
          response = await api.post(endpoint, values);
          showMessage("Registro creado correctamente");
        } else {
          response = await api.put(`${endpoint}/${id}`, values);
          showMessage("Registro actualizado correctamente");
        }
        onSuccess?.(response.data);
        router.push(listPath);
      } catch (error) {
        await showError(error);
      }
    },
    [endpoint, form, id, onSuccess],
  );

  return {
    id,
    form,
    loading,
    onSubmit,
    formatearDataInicial,
    datos,
    refresh: load,
  };
}
