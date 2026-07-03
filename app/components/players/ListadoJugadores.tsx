"use client";

import api from "@/services/api";
import TagButtons from "../TagButtons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Space, Spin, Typography } from "antd";

interface Props {
  teamId: string;
}

interface Player {
  _id: string;
  names: string;
  lastName: string;
  jerseyNumber: number;
  photo?: string;
  status: string;
}

interface PlayerGroup {
  position: string;
  players: Player[];
}

export default function ListadosJugadores({ teamId }: Props) {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!teamId) return;
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/teams/${teamId}/groups`);
        console.log(data, "AA");
        setGroups(data);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [teamId]);

  return (
    <Spin spinning={loading}>
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.position}>
            <Typography.Title level={4}>{group.position}</Typography.Title>

            <div className="border border-gray-300 rounded-md overflow-hidden">
              {group.players.map((player, index) => (
                <div
                  key={player._id}
                  className={`flex flex-col sm:flex-row sm:items-center
                    sm:justify-between
                  gap-3
                  p-3
                ${
                  index !== group.players.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }
              `}
                >
                  {/* Jugador */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar src={player.photo} icon={<UserOutlined />} />

                    <span className="wrap-break-word">
                      <b>{player.jerseyNumber}</b> {player.names}{" "}
                      {player.lastName}
                    </span>
                  </div>

                  {/* Acciones */}
                  <Space className="self-end sm:self-auto shrink-0">
                    <TagButtons status={player.status} />
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => router.push(`/players/${player._id}/edit`)}
                    >
                      Editar
                    </Button>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Spin>
  );
}
