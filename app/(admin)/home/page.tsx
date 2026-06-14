"use client";

import api from "@/services/api";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Table } from "antd";

export default function LeaguesPage() {
  const [stats, setStats] = useState<any>();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const [statsRes, leaguesRes] = await Promise.all([
        api.get("/dashboard/admin/statics"),
        api.get("/leagues"),
      ]);
      setStats(statsRes.data);
      setLeagues(leaguesRes.data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Row justify="space-between" className="mb-4">
        <h1 className="text-2xl font-bold">Administración de Ligas</h1>

        <Button type="primary" icon={<PlusOutlined />}>
          Nueva Liga
        </Button>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="Ligas">{stats?.leagues ?? 0}</Card>
        </Col>

        <Col span={6}>
          <Card title="Equipos">{stats?.teams ?? 0}</Card>
        </Col>

        <Col span={6}>
          <Card title="Usuarios">{stats?.users ?? 0}</Card>
        </Col>

        <Col span={6}>
          <Card title="Activas">{stats?.activeLeagues ?? 0}</Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Table
          loading={loading}
          rowKey="_id"
          dataSource={leagues}
          columns={[
            {
              title: "Liga",
              dataIndex: "name",
            },
            {
              title: "Ciudad",
              dataIndex: "city",
            },
            {
              title: "Presidente",
              dataIndex: "president",
            },
            {
              title: "Equipos",
              dataIndex: "teamsCount",
            },
            {
              title: "Campeonatos",
              dataIndex: "championshipsCount",
            },
          ]}
        />
      </Card>
    </>
  );
}
