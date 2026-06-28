"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb, Button, Input, Space, Typography } from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  loading?: boolean;
  hideSearch?: boolean;
  hideRefresh?: boolean;
  insertHref?: string;
  insertLabel?: string;
  onRefresh?: () => void;
  onSearch?: (e: string) => void;
  onClear?: () => void;
  extra?: React.ReactNode;
}

export default function PageHeader({
  breadcrumbs,
  loading = false,
  hideSearch = false,
  hideRefresh = false,
  insertHref,
  insertLabel = "Crear",
  onRefresh,
  onSearch,
  onClear,
  extra,
}: PageHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const title = breadcrumbs[breadcrumbs.length - 1]?.label ?? "";

  return (
    <div className="mb-6">
      <Breadcrumb
        className="mb-2"
        items={breadcrumbs.map((item) => ({
          title: item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            item.label
          ),
        }))}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <Title
          level={2}
          style={{
            margin: 0,
          }}
        >
          {title}
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
            {!hideRefresh && (
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

            {!extra && insertHref && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push(insertHref)}
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
