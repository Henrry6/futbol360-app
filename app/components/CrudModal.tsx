// components/ui/CrudModal.tsx

"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";
import { Button, Form, Modal, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { showError } from "./utils/ShowError";

interface CrudModalProps {
  title: string;
  endpoint: string;
  buttonText?: string;
  children: React.ReactNode;
  onSuccess?: () => void;

  mode?: "create" | "edit";

  initialValues?: Record<string, any>;

  id?: string;
}

export default function CrudModal({
  id,
  mode,
  title,
  endpoint,
  buttonText,
  initialValues,
  children,
  onSuccess,
}: CrudModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const values = await form.validateFields();

      if (mode === "create") {
        await api.post(endpoint, values);

        message.success("Registro creado correctamente");
      } else {
        await api.put(`${endpoint}/${id}`, values);

        message.success("Registro actualizado correctamente");
      }

      form.resetFields();

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.log(error, "LLLLL");
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues, form]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        icon={mode === "edit" ? <EditOutlined /> : null}
      >
        {buttonText}
      </Button>

      <Modal
        open={open}
        title={title}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          {children}
        </Form>
      </Modal>
    </>
  );
}
