import dayjs from "dayjs";
import api from "@/services/api";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { useShowError } from "@/components/utils/ShowError";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  TimePicker,
} from "antd";

interface ProgramarPartidoProps {
  match: any;
  onSuccess: () => void;
}

export default function ProgramarPartido({
  match,
  onSuccess,
}: ProgramarPartidoProps) {
  const ShowError = useShowError();
  const [open, setOpen] = useState(false);
  const [referees, setReferees] = useState<any[]>([]);
  const [assistants, setAssistants] = useState<any[]>([]);
  const [vocals, setVocals] = useState<any[]>([]);
  const [loadingOfficials, setLoadingOfficials] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const getOfficials = async () => {
    if (referees.length || assistants.length || vocals.length) return;
    try {
      setLoadingOfficials(true);
      const { data } = await api.get(`/users`, {
        params: { roles: "official" },
      });
      const officials = data.data;
      setReferees(officials.filter((u: any) => u.official?.canReferee));
      setAssistants(officials.filter((u: any) => u.official?.canAssist));
      setVocals(officials.filter((u: any) => u.official?.canBeVocal));
    } catch (error) {
      ShowError(error);
    } finally {
      setLoadingOfficials(false);
    }
  };

  const openModal = () => {
    getOfficials();
    form.setFieldsValue({
      date: match.date ? dayjs(match.date) : null,
      hour: match.hour ? dayjs(match.hour) : null,
      referee: match.referee?._id ?? match.referee ?? undefined,
      assistantReferees: (match.assistantReferees ?? []).map(
        (a: any) => a?._id ?? a,
      ),
      vocal: match.vocal?._id ?? match.vocal ?? undefined,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    try {
      setSaving(true);
      await api.put(`/matchs/${match._id}`, {
        date: values.date.toISOString(),
        hour: values.hour?.toISOString() || null,
        vocal: values?.vocal || null,
        referee: values.referee || null,
        assistantReferees: values.assistantReferees ?? [],
      });
      onSuccess();
      closeModal();
    } catch (error) {
      ShowError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button icon={<EditOutlined />} onClick={openModal} />

      <Modal
        title="Programar partido"
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={saving}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Alert
          type="info"
          title="Para poder iniciar el partido debe tener registrado la fecha, hora y vocal"
          showIcon
        />
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Fecha"
            name="date"
            rules={[{ required: true, message: "Selecciona la fecha" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Hora"
            name="hour"
            rules={[{ required: true, message: "Selecciona la hora" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Vocal"
            name="vocal"
            rules={[{ required: true, message: "Selecciona un vocal" }]}
          >
            <Select
              loading={loadingOfficials}
              allowClear
              placeholder="Selecciona un vocal"
              options={vocals.map((u: any) => ({
                label: u.name,
                value: u._id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Árbitro" name="referee">
            <Select
              loading={loadingOfficials}
              allowClear
              placeholder="Selecciona un árbitro"
              options={referees.map((u: any) => ({
                label: u.name,
                value: u._id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Árbitros asistentes" name="assistantReferees">
            <Select
              mode="multiple"
              loading={loadingOfficials}
              allowClear
              placeholder="Selecciona uno o más asistentes"
              options={assistants.map((u: any) => ({
                label: u.name,
                value: u._id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
