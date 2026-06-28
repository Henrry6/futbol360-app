"use client";

import { Card, Spin } from "antd";
import api from "@/services/api";
import { Movement } from "@/types/global";
import { useEffect, useState } from "react";
import { useShowError } from "@/components/utils/ShowError";
import PageHeader from "@/components/PageHeader";

export interface Championship {
  _id: string;
  league: string;
  name: string;
  year: number;
  startDate: Date;
  endDate?: Date;
  status: "activo" | "inactivo";
  _movements: Movement[];
}

export default function CampeonatosPage() {
  const ShowError = useShowError();
  const [loading, setLoading] = useState(false);
  const [leagues, setLeagues] = useState([]);

  const loadCampeonatos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/championship");
      setLeagues(data.data);
    } catch (error) {
      ShowError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampeonatos();
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <PageHeader
          breadcrumbs={[
            {
              label: "Campeonatos",
            },
          ]}
          loading={loading}
          insertHref="/campeonatos/insert"
          onRefresh={loadCampeonatos}
        />
        <div className="grid md:grid-cols-3 gap-4">
          {leagues.map((league: any) => (
            <Card key={league._id} hoverable className="rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏆</div>

                <div>
                  <h2 className="font-bold text-lg">{league.name}</h2>

                  <p className="text-gray-500">Administrar liga</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Spin>
  );
}
