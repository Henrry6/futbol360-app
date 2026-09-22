"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Breadcrumb, Button, Input, Space, Typography } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export interface BreadcrumbItem {
  label: string;
  href: string;
  singular?: string;
}

export interface PageHeaderProps {
  entityName?: string;
  resource: BreadcrumbItem;
  loading?: boolean;
  hideSearch?: boolean;
  hideRefresh?: boolean;
  hideInsert?: boolean;
  insertLabel?: string;
  onRefresh?: () => void;
  onSearch?: (e: string) => void;
  onClear?: () => void;
  extra?: React.ReactNode;
}

export default function PageHeader({
  loading = false,
  hideSearch = false,
  hideRefresh = false,
  hideInsert = false,
  insertLabel = "Crear",
  onRefresh,
  onSearch,
  onClear,
  extra,
  resource,
}: PageHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const { id } = useParams();

  const subtitle = resource.singular
    ? id
      ? `Editar ${resource.singular}`
      : `Crear ${resource.singular}`
    : undefined;

  useEffect(() => {
    document.title = subtitle
      ? `${resource.label} - ${subtitle}`
      : resource.label;
  }, [resource.label, subtitle]);

  const breadcrumbsList = [
    {
      label: resource.label,
      href: resource.href,
    },
    ...(subtitle
      ? [
          {
            label: subtitle,
          },
        ]
      : []),
  ];
  return (
    <div className="mb-6">
      <Breadcrumb
        className="mb-2"
        items={breadcrumbsList.map((item) => ({
          title: item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            item.label
          ),
        }))}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {resource.label}
        </Title>

        <div className="flex flex-col sm:flex-row gap-3">
          {!hideSearch && (
            <Input
              allowClear
              className="sm:w-72"
              defaultValue={search}
              prefix={<SearchOutlined />}
              placeholder="Buscar..."
              onChange={(e) => onSearch?.(e.target.value)}
            />
          )}

          <Space>
            {!hideRefresh && onRefresh && (
              <Button
                loading={loading}
                icon={<ReloadOutlined />}
                onClick={onRefresh}
              />
            )}
            {onClear && (
              <Button
                title="Eliminar filtros"
                icon={<ClearOutlined />}
                onClick={onClear}
              />
            )}

            {!extra && !subtitle && !hideInsert && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push(`${resource.href}/insert`)}
              >
                {insertLabel}
              </Button>
            )}

            {extra}
          </Space>
        </div>
      </div>
    </div>
  );
}
