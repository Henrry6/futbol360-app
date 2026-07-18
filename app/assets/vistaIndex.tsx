"use client";

import { TableProps } from "antd";
import api from "@/services/api";
import { useShowError } from "@/components/utils/ShowError";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface VistaIndexProps {
  endpoint: string;
  params?: Record<string, any>;
  autoLoad?: boolean;
}

export function useVistaIndex<T>({
  endpoint,
  params,
  autoLoad = true,
}: VistaIndexProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const showError = useShowError();

  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const sort = searchParams.get("sort") ?? "";

  const query = searchParams.toString();

  const refresh = useCallback(async () => {
    if (loadingRef.current) return;
    try {
      loadingRef.current = true;
      setLoading(true);
      const parametros = {
        q,
        page,
        limit,
        sort,
        ...params,
      };
      const response = await api.get(endpoint, {
        params: parametros,
      });

      setData(response.data.data ?? []);
      setTotal(response.data.total ?? 0);
    } catch (error) {
      await showError(error);
    } finally {
      loadingRef.current = false;

      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (!autoLoad) return;
    refresh();
  }, [refresh, autoLoad]);

  const remove = async (id: string) => {
    await api.delete(`${endpoint}/${id}`);

    await refresh();
  };

  const updateQuery = useCallback(
    (changes: Record<string, any>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(changes).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === false
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (page: number) => {
      updateQuery({
        page: page <= 1 ? null : page,
      });
    },
    [updateQuery],
  );

  const setLimit = useCallback(
    (limit: number) => {
      updateQuery({
        page: null,
        limit: limit === 20 ? null : limit,
      });
    },
    [updateQuery],
  );
  const setSearch = useCallback(
    (search: string) => {
      updateQuery({
        page: null,
        q: search.trim() || null,
      });
    },
    [updateQuery],
  );

  const setSort = useCallback(
    (sort?: string | null) => {
      updateQuery({
        sort,
      });
    },
    [updateQuery],
  );
  const setFilter = useCallback(
    (field: string, value: any) => {
      updateQuery({
        page: null,
        [field]: value,
      });
    },
    [updateQuery],
  );

  const removeFilter = useCallback(
    (field: string) => {
      updateQuery({
        page: null,
        [field]: null,
      });
    },
    [updateQuery],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  const onTableChange: TableProps<T>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setPage(pagination.current ?? 1);

    setLimit(pagination.pageSize ?? 20);

    if (!Array.isArray(sorter)) {
      if (sorter.order === "ascend") {
        setSort(String(sorter.field));
      } else if (sorter.order === "descend") {
        setSort(`-${String(sorter.field)}`);
      } else {
        setSort(null);
      }
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (!value || value.length === 0) {
        removeFilter(key);
      } else if (value.length === 1) {
        setFilter(key, value[0]);
      } else {
        setFilter(key, "{$in}" + value.join(","));
      }
    });
  };

  const tableProps = useMemo(
    () => ({
      loading,
      dataSource: data,
      pagination: {
        current: page,
        pageSize: limit,
        total,
      },
      onChange: onTableChange,
    }),
    [loading, data, page, limit, total],
  );

  return {
    loading,
    data,
    total,
    refresh,
    setSearch,
    remove,
    setData,
    clearFilters,
    tableProps,
  };
}
