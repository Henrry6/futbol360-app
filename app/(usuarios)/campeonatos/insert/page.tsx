"use client";

import dayjs from "dayjs";
import { Championship } from "../page";
import { Button, Form, Spin } from "antd";
import PageHeader from "@/components/PageHeader";
import { useVisataInsert } from "@/assets/vistaInsert";
import ChampionsForm from "@/components/forms/championsForm";
import { useShowMessage } from "@/components/utils/ShowError";

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
      console.log(data, "init");
      data.season = dayjs(data.season);
      data.startDate = dayjs(data.startDate);
      data.endDate = dayjs(data.endDate);
      data.category = data.category?._id;
      for (const team of data.teams) {
        team.fechaIngreso = dayjs(team.fechaIngreso);
        if (team.fechaSalida) {
          team.fechaSalida = dayjs(team.fechaSalida);
        }
      }
    },
  });
  const message = useShowMessage();

  const onPreSubmit = (values: any) => {
    const teams = values.teams ?? [];
    const repeated = teams.find(
      (team: any, index: number) =>
        teams.findIndex((t: any) => t.team === team.team) !== index,
    );
    if (repeated) {
      message(
        `El equipo "${repeated.teamName}" está seleccionado más de una vez.`,
        "error",
      );
      return;
    }
    insert.onSubmit(values);
  };
  console.log(insert.datos, "DATA");
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
          onFinish={onPreSubmit}
        >
          <ChampionsForm
            form={insert.form}
            championshipId={
              typeof insert.id === "string" ? insert.id : undefined
            }
          />
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
