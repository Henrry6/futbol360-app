import api from "@/services/api";
import { Form, Select } from "antd";
import type { SelectProps } from "antd";
import { $rules } from "@/assets/utils";
import { useEffect, useRef, useState } from "react";

interface AutoCompleteFastProps {
  name: string | (string | number)[];
  endpoint: string;
  params?: Record<string, any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  valueField?: string;
  optionLabel?: (item: any) => React.ReactNode;
  onSelect?: (item: any) => void;
}

interface RemoteSelectProps {
  value?: string;
  onChange?: (value?: string) => void;
  endpoint: string;
  params?: Record<string, any>;
  placeholder?: string;
  disabled?: boolean;
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
      onFocus={() => load()}
      onClear={() => {
        onChange?.(undefined);
        onSelect?.(undefined);
      }}
      onChange={(value) => {
        onChange?.(value);
      }}
      onSelect={(_, option: any) => {
        if (!option) {
          onSelect?.(undefined);
          return;
        }
        onSelect?.(option.item);
      }}
    />
  );
};

export function AutoCompleteFast({
  name,
  endpoint,
  params,
  label,
  placeholder,
  required,
  disabled,
  valueField = "_id",
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
        endpoint={endpoint}
        params={params}
        placeholder={placeholder || "Seleccione un registro"}
        disabled={disabled}
        valueField={valueField}
        optionLabel={optionLabel}
        onSelect={onSelect}
      />
    </Form.Item>
  );
}
