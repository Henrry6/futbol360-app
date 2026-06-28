"use client";

import PageHeader from "@/components/PageHeader";
import ChampionsForm from "@/components/forms/championsForm";

export default function EditChampionship() {
  return (
    <div className="p-6">
      <PageHeader
        breadcrumbs={[
          {
            label: "Campeonatos",
            href: "/campeonatos",
          },
          {
            label: "Editar categoría",
          },
        ]}
        hideSearch
        hideRefresh
      />
      <ChampionsForm />
    </div>
  );
}
