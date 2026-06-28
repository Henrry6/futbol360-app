"use client";

import { useVisataInsert } from "@/assets/vistaInsert";
import ChampionsForm from "@/components/forms/championsForm";
import PageHeader from "@/components/PageHeader";
import { Button, Form } from "antd";

export default function InsertChampions() {
  const insert = useVisataInsert({
    endpoint: "/championship",
    defaults: {
      status: "activo",
    },
  });
  return (
    <div className="p-6">
      <PageHeader
        breadcrumbs={[
          {
            label: "Campeonatos",
            href: "/campeonatos",
          },
          {
            label: "Crear campeonato",
          },
        ]}
        hideSearch
        hideRefresh
      />

      <Form
        form={insert.form}
        layout="vertical"
        initialValues={insert.initialValues}
        onFinish={insert.onSubmit}
      >
        <ChampionsForm />
      </Form>
      <div>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </div>
    </div>
  );
}
