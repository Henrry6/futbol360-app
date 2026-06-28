"use client";

import { Card, Space, Spin } from "antd";
import { Movement } from "@/types/global";
import CrudModal from "@/components/CrudModal";
import PageHeader from "@/components/PageHeader";
import TagButtons from "@/components/TagButtons";
import { useVistaIndex } from "@/assets/vistaIndex";
import DeleteButton from "@/components/DeleteButton";
import CategoryForm from "@/components/forms/categoryForm";

export interface Category {
  _id: string;
  league: string;
  name: string;
  status: "activo" | "inactivo";
  minAge?: number;
  maxAge?: number;
  _movements: Movement[];
}

export default function CategoriesPage() {
  const { data, loading, refresh, setSearch, clearFilters } =
    useVistaIndex<Category>({
      endpoint: "/categories",
    });

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <PageHeader
          resource={{
            label: "Categorías",
            href: "/categories",
          }}
          loading={loading}
          onSearch={setSearch}
          onRefresh={refresh}
          onClear={clearFilters}
          extra={
            <>
              <CrudModal
                title="Nueva Categoría"
                endpoint="/categories"
                mode="create"
                initialValues={{
                  status: "activo",
                }}
                onSuccess={refresh}
              >
                <CategoryForm />
              </CrudModal>
            </>
          }
        />
        <div className="grid md:grid-cols-4 gap-4">
          {data.map((category: any) => (
            <Card
              key={category._id}
              hoverable
              className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-gray-500 text-sm">Categoría deportiva</p>
                </div>
                <TagButtons status={category.status} />
              </div>

              <div className="my-5 border-t" />
              <div className="flex items-center gap-2 text-gray-600">
                <span>🎂</span>
                <span>
                  {category.minAge} - {category.maxAge} años
                </span>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Space>
                  <CrudModal
                    title="Editar Usuario"
                    buttonText="Editar"
                    endpoint="/categories"
                    mode="edit"
                    id={category._id}
                    initialValues={category}
                    onSuccess={refresh}
                  >
                    <CategoryForm />
                  </CrudModal>

                  <DeleteButton
                    endpoint="/categories"
                    id={category._id}
                    title={`¿Eliminar categoría ${category.name}?`}
                    onSuccess={refresh}
                  />
                </Space>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Spin>
  );
}
