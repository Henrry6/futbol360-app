"use client";

import dayjs from "dayjs";
import { Player } from "../page";
import { Button, Card, Form, Spin } from "antd";
import PageHeader from "@/components/PageHeader";
import { useVisataInsert } from "@/assets/vistaInsert";
import PlayerForm from "@/components/forms/playerForm";

export default function InsertTeam() {
  const insert = useVisataInsert<Player>({
    endpoint: "/players",
    params: {
      $getAllFields: "true",
    },
    datos: {
      status: "activo",
    },
    formatearDataInicial: (data) => {
      data.birthDate = dayjs(data.birthDate);
    },
  });
  return (
    <div className="p-6">
      <PageHeader
        resource={{
          label: "Jugadores",
          href: "/players",
          singular: "jugador",
        }}
        hideSearch
        hideRefresh
      />
      <Spin spinning={insert.loading}>
        <Card>
          <Form
            form={insert.form}
            layout="vertical"
            initialValues={insert.datos}
            onFinish={insert.onSubmit}
          >
            <PlayerForm />
            <div>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
