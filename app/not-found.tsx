"use client";

import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-4 animate-bounce">⚽</div>

        <h1 className="text-7xl font-extrabold text-green-700">404</h1>

        <h2 className="text-3xl font-bold text-slate-800 mt-4">
          ¡Fuera de la cancha!
        </h2>

        <p className="text-slate-500 mt-4 text-lg">
          La página que buscas no existe o fue movida a otra posición del
          torneo.
        </p>

        <div className="mt-8">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => router.push("/leagues")}
          >
            Volver al inicio
          </Button>
        </div>

        {/* <div className="text-8xl mb-6 animate-spin">⚽</div> */}

        <div className="mt-10 text-sm text-slate-400">
          Futbol360 • Gestión de ligas y campeonatos
        </div>
      </div>
    </div>
  );
}
