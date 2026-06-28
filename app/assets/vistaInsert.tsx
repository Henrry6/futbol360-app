import { Form } from "antd";
import api from "@/services/api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useShowError } from "@/components/utils/ShowError";
import { useShowMessage } from "@/components/utils/ShowError";

interface CrudFormProps<T> {
  endpoint: string;
  defaults?: Partial<T>;
  onSuccess?: (data: T) => void;
}

export function useVisataInsert<T>({
  endpoint,
  defaults,
  onSuccess,
}: CrudFormProps<T>) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const showError = useShowError();
  const showMessage = useShowMessage();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<T> | undefined>();

  const load = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data } = await api.get(`${endpoint}/${id}`);
      setInitialValues(data);
      form.setFieldsValue(data);
    } catch (error) {
      await showError(error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, form, id, showError]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = useCallback(async () => {
    try {
      console.log("aaaaa");
      const values = await form.validateFields();
      let response;
      if (!id) {
        response = await api.post(endpoint, values);
        showMessage("Registro creado correctamente");
      } else {
        response = await api.put(`${endpoint}/${id}`, values);
        showMessage("Registro actualizado correctamente");
      }

      onSuccess?.(response.data);

      return response.data;
    } catch (error) {
      await showError(error);
      throw error;
    }
  }, [endpoint, form, id, onSuccess, showError, showMessage]);

  return {
    id,
    form,
    loading,
    onSubmit,
    initialValues: initialValues ?? defaults,
    refresh: load,
  };
}
