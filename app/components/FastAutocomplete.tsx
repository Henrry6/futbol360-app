import api from "@/services/api";
import { Form, Select } from "antd";
import type { SelectProps } from "antd";
import { $rules } from "@/assets/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type SelectValue = string | number | (string | number)[];

interface RemoteSelectProps {
  value?: SelectValue;
  onChange?: (value?: SelectValue) => void;
  endpoint: string;
  params?: Record<string, any>;
  placeholder?: string;
  disabled?: boolean;
  isMultiple?: boolean;
  /**
   * El trigger permite cargar los datos del select al montar el componente,
   * esto es útil cuando se quiere obtener el objeto completo del valor inicial.
   * Por defecto es false.
   */
  triggerOnMount?: boolean;
  valueField: string;
  optionLabel: (item: any) => React.ReactNode;
  onSelect?: (item: any) => any;
}

const RemoteSelect = ({
  value,
  onChange,
  endpoint,
  params,
  placeholder,
  disabled,
  valueField,
  isMultiple,
  triggerOnMount,
  optionLabel,
  onSelect,
}: RemoteSelectProps) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const debounce = useRef<NodeJS.Timeout | null>(null);

  const load = async (text = "") => {
    try {
      setLoading(true);
      const { data } = await api.get(endpoint, {
        params: {
          limit: 50,
          ...params,
          ...(text ? { q: text } : {}),
        },
      });
      setOptions(
        data.data.map((item: any) => ({
          value: item[valueField],
          label: optionLabel(item),
          item,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  const search = (text: string) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    debounce.current = setTimeout(() => {
      load(text);
    }, 300);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (value && options?.length === 0) {
      load();
    }
  }, [value]);

  const optionMap = useMemo(() => {
    return new Map(options?.map((o: any) => [o.value, o.item]) ?? []);
  }, [options]);

  useEffect(() => {
    if (!triggerOnMount || value == null) return;

    if (isMultiple) {
      onSelect?.((value as any[]).map((v) => optionMap.get(v)).filter(Boolean));
    } else {
      const item = optionMap.get(value);
      if (item) {
        onSelect?.(item);
      }
    }
  }, [triggerOnMount, value, optionMap]);

  return (
    <Select
      value={value}
      options={options}
      loading={loading}
      allowClear
      placeholder={placeholder}
      disabled={disabled}
      showSearch={{
        filterOption: false,
        onSearch: search,
      }}
      mode={isMultiple ? "multiple" : undefined}
      onFocus={() => load()}
      onClear={() => {
        onChange?.(isMultiple ? [] : undefined);
        onSelect?.(isMultiple ? [] : undefined);
      }}
      onChange={(value) => {
        onChange?.(value);
        if (isMultiple) {
          onSelect?.((value as any[]).map((v) => optionMap.get(v)));
        } else {
          onSelect?.(optionMap.get(value));
        }
      }}
    />
  );
};

interface AutoCompleteFastProps {
  name?: string | (string | number)[];
  endpoint: string;
  params?: Record<string, any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  valueField?: string;
  isMultiple?: boolean;
  triggerOnMount?: boolean;
  optionLabel?: (item: any) => React.ReactNode;
  onSelect?: (item: any | any[] | undefined) => void;
}

export function AutoCompleteFast({
  name,
  endpoint,
  params,
  label,
  placeholder,
  required,
  disabled,
  isMultiple,
  valueField = "_id",
  triggerOnMount,
  optionLabel = (item) => item.description,
  onSelect,
}: AutoCompleteFastProps) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [$rules.required()] : []}
    >
      <RemoteSelect
        triggerOnMount={triggerOnMount}
        endpoint={endpoint}
        params={params}
        placeholder={placeholder || "Seleccione un registro"}
        disabled={disabled}
        valueField={valueField}
        optionLabel={optionLabel}
        isMultiple={isMultiple}
        onSelect={onSelect}
      />
    </Form.Item>
  );
}
