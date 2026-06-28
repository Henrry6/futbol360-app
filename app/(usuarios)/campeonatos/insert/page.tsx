"use client";

import dayjs from "dayjs";
import { Championship } from "../page";
import { Button, Form, Spin } from "antd";
import PageHeader from "@/components/PageHeader";
import { useVisataInsert } from "@/assets/vistaInsert";
import ChampionsForm from "@/components/forms/championsForm";

export default function InsertChampions() {
  const insert = useVisataInsert<Championship>({
    endpoint: "/championships",
    params: {
      $getAllFields: "true",
    },
    datos: {
      status: "activo",
    },
    formatearDataInicial: (data) => {
      data.season = dayjs(data.season);
      data.startDate = dayjs(data.startDate);
      data.endDate = dayjs(data.endDate);
    },
  });
  return (
    <div className="p-6">
      <PageHeader
        resource={{
          label: "Campeonatos",
          href: "/campeonatos",
          singular: "campeonato",
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
          <ChampionsForm />
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
