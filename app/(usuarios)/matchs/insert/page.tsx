"use client";

import dayjs from "dayjs";
import { Button, Card, Form, Spin } from "antd";
import PageHeader from "@/components/PageHeader";
import TeamForm from "@/components/forms/teamForm";
import { useVisataInsert } from "@/assets/vistaInsert";
import { Team } from "../page";

export default function InsertTeam() {
  const insert = useVisataInsert<Team>({
    endpoint: "/teams",
    params: {
      $getAllFields: "true",
    },
    datos: {
      status: "activo",
    },
    formatearDataInicial: (data) => {
      console.log(data, "INI");
      data.fundacion = dayjs(data.fundacion);
    },
  });
  return (
    <div className="p-6">
      <PageHeader
        resource={{
          label: "Equipos",
          href: "/teams",
          singular: "equipo",
        }}
        hideSearch
        hideRefresh
      />
      <Spin spinning={insert.loading}>
        <Form
          form={insert.form}
          layout="vertical"
          initialValues={insert.datos}
          onFinish={insert.onSubmit}
        >
          <TeamForm />
          <div>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
}
