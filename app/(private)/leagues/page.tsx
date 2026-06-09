"use client";

import { Card } from "antd";
import api from "@/services/api";
import { useEffect, useState } from "react";

export default function LeaguesPage() {
  const [loading, setLoading] = useState(false);
  const [leagues, setLeagues] = useState([]);

  const loadLeagues = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/leagues");

      setLeagues(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeagues();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Ligas</h1>

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
  );
}
