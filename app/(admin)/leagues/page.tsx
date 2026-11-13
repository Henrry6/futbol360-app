"use client";

import { Card, Empty, Spin } from "antd";
import { Movement } from "@/types/global";
import CrudModal from "@/components/CrudModal";
import PageHeader from "@/components/PageHeader";
import TagButtons from "@/components/TagButtons";
import { useVistaIndex } from "@/assets/vistaIndex";
import LeagueForm from "@/components/forms/leagueForm";

export interface League {
  _id: string;
  code: string;
  name: string;
  status: "activo" | "inactivo";
  description?: string;
  logo?: string;
  _movements: Movement[];
}

export default function LeaguesPage() {
  const { data, loading, refresh, setSearch, clearFilters } =
    useVistaIndex<League>({
      endpoint: "/leagues",
    });

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <PageHeader
          resource={{
            label: "Ligas",
            href: "/leagues",
          }}
          loading={loading}
          onSearch={setSearch}
          onRefresh={refresh}
          onClear={clearFilters}
          extra={
            <CrudModal
              title="Nueva liga"
              buttonText="Crear liga"
              endpoint="/leagues"
              mode="create"
              initialValues={{ status: "activo" }}
              onSuccess={refresh}
            >
              <LeagueForm />
            </CrudModal>
          }
        />

        {!loading && data.length === 0 ? (
          <Empty description="No existen ligas. Crea la primera con «Crear liga»." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((league) => (
              <Card
                key={league._id}
                hoverable
                className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-0"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-4xl">🏆</div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-lg truncate">
                        {league.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Código: <strong>{league.code}</strong>
                      </p>
                    </div>
                  </div>
                  <TagButtons status={league.status} />
                </div>

                {league.description && (
                  <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                    {league.description}
                  </p>
                )}

                <div className="flex justify-end mt-6">
                  <CrudModal
                    title={`Editar liga ${league.name}`}
                    endpoint="/leagues"
                    mode="edit"
                    id={league._id}
                    initialValues={league}
                    onSuccess={refresh}
                  >
                    <LeagueForm />
                  </CrudModal>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Spin>
  );
}
